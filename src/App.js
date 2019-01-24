import React from 'react';
import WatchJS from 'melanke-watchjs'

import Header from './components/Header'
import ModelView from './components/ModelView'
import {LoadModal, ErrorModal} from "./components/Modals";

import fileHandlerFactory from './cg/FileHandlerFactory'
import DirectFaceRender from './cg/Renders/MainRenders/DirectFaceRender'

import config from './config'

class SMeshApp extends React.Component{
    constructor(){
        super();
        this.state ={
            status: 'NORMAL',
            message: 'Everything is fine',
            gl: undefined,
            canvas: undefined,
            model: {},
            projection: 'Perspective',
            main_renders: config.main_renders,
            secondary_renders: config.secondary_renders,
            active_main_render: 'FaceRender',
            main_render: undefined,
            active_secondary_renders: []
        };
    }

    mainRenderHandleClick = (render) => {
        this.setState({active_main_render:render});
    };

    secondaryRendersHandleChange = (render) => {
        let active_secondary_renders = this.state.active_secondary_renders;

        if(active_secondary_renders.includes(render)){
            active_secondary_renders = active_secondary_renders.filter((secondary_render) => {
                return secondary_render !== render;
            })
        }else{
            active_secondary_renders.push(render);
        }
        this.setState({active_secondary_renders});
    };

    importHandleClick = (import_input) => {
        import_input.value = '';
        import_input.click();
    };

    importHandleChange = (file) => {
        if(file) {
            const fileHandler = fileHandlerFactory.getFileHandler(file);
            fileHandler.loadData();
            const model = fileHandler.getModel();
            const status = model.status;
            const message = model.message;

            this.setState({status, message, model});
            WatchJS.watch(model, 'message', this.onModelStatusChange);
        }
    };

    projectionHandleClick = (projection_button) => {
        projection_button.classList.toggle('pers');
        let projection = 'Orthogonal';
        if (projection_button.classList.contains('pers')) {
            projection = 'Perspective';
        }
        this.setState({projection});
    };

    onModelStatusChange = () => {
        if (this.state.status === this.state.model.status && this.state.message === this.state.model.message) return;
        const status = this.state.model.status;
        const message = this.state.model.message;
        let main_render = undefined;

        if(status === 'SUCCESS'){
            console.log(this.state.model);
            main_render = new DirectFaceRender(this.state.model, this.state.gl);
            main_render.init();
        }

        this.setState({status, message, main_render});
    };

    onCanvasMount = (canvas) => {
        const gl = canvas.getContext("webgl2");
        this.setState({gl, canvas});
    };

    cleanApp = () => {
        const status = 'NORMAL';
        const model = {};
        this.setState({status, model});
    };

    resizeCanvas() {
        const canvas = this.state.canvas;
        let width  = canvas.clientWidth*2;
        let height = canvas.clientHeight*2;
        if(width > height){
            canvas.width  = width;
            canvas.height = width/2;
        }else{
            canvas.width  = height*2;
            canvas.height = height;
        }
    }

    render(){
        let loadModal_hide = 'hide';
        let errorModal_hide = 'hide';
        if(this.state.status === 'LOADING') loadModal_hide='';
        if(this.state.status === 'ERROR') errorModal_hide='';

        if(this.state.status === 'SUCCESS'){
            const gl = this.state.gl;
            this.resizeCanvas();
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.CULL_FACE);
            this.state.main_render.draw();
        }

        return(
            <React.Fragment>
                <header>
                    <Header main_renders={this.state.main_renders}
                            secondary_renders={this.state.secondary_renders}
                            active_main_render={this.state.active_main_render}
                            active_secondary_renders={this.state.active_secondary_renders}
                            mainRenderHandleClick={this.mainRenderHandleClick}
                            secondaryRendersHandleChange={this.secondaryRendersHandleChange}
                            importHandleClick = {this.importHandleClick}
                            importHandleChange = {this.importHandleChange}/>
                </header>
                <section id='main-view' className='view1'>
                    <ModelView projectionHandleClick={this.projectionHandleClick} onCanvasMount={this.onCanvasMount}/>
                </section>
                <LoadModal  hide={loadModal_hide}  message={this.state.message} />
                <ErrorModal hide={errorModal_hide} message={this.state.message} cleanApp={this.cleanApp}/>
            </React.Fragment>
        )
    }
}

export default SMeshApp
