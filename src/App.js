import React from 'react';
// OWN COMPONENTS
import Header from './components/Header'
import ModelView from './components/ModelView'
import {LoadModal, ErrorModal} from "./components/Modals";
// CG OBJECTS
import fileHandlerFactory from './cg/FileHandlerFactory'
import RModel from './cg/RModel'
import DirectFaceRender from './cg/Renders/MainRenders/DirectFaceRender'
// OTHERS
import config from './config'

class SMeshApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            status: 'IDLE',
            message: 'Everything is fine',

            gl: undefined,
            canvas: undefined,
            model: undefined,
            r_model: undefined,
            main_render: undefined,
            secondary_renders: undefined,

            projection: 'Perspective',
            active_main_render: 'FaceRender',
            active_secondary_renders: [],
            main_render_list: config.main_renders,
            secondary_render_list: config.secondary_renders,
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
            const status = 'LOADING';
            const message = 'Loading Model';

            model.setLoadedCallback(this.onModelLoaded);

            this.setState({status, message, model});
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

    onModelLoaded = () => {
        let status = this.state.model.status;
        let message = this.state.model.message;
        let r_model = undefined;

        if (status === 'SUCCESS') {
            status = 'LOADING';
            message = 'Calculating Rendering Info';
            r_model = new RModel(this.state.model, this.state.gl);

            this.setState({status, message, r_model});

            setTimeout(() => {
                r_model.setLoadedCallback(this.onRModelLoaded);
                r_model.loadData();
            }, 100);
        } else {
            this.setState({status, message, r_model})
        }
    };

    onRModelLoaded = () => {
        let status = this.state.r_model.status;
        let message = this.state.r_model.message;
        let main_render =  undefined;

        if (status === 'SUCCESS') {
            main_render = new DirectFaceRender(this.state.model, this.state.gl);
            main_render.init();
        }

        this.setState({status, message, main_render})
    };

    onCanvasMount = (canvas) => {
        const gl = canvas.getContext("webgl2");
        this.setState({gl, canvas});
    };

    cleanApp = () => {
        const status = 'IDLE';
        const model = undefined;
        const r_model = undefined;
        this.setState({status, model, r_model});
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
                    <Header main_render_list={this.state.main_render_list}
                            secondary_render_list={this.state.secondary_render_list}
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
