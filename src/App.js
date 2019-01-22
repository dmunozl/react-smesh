import React from 'react';
import WatchJS from 'melanke-watchjs'

import Header from './components/Header'
import ModelView from './components/ModelView'
import {LoadModal, ErrorModal} from "./components/Modals";

import fileHandlerFactory from './cg/FileHandlerFactory'

import config from './config'

class SMeshApp extends React.Component{
    constructor(){
        super();
        this.state ={
            status: 'NORMAL',
            message: 'Everything is fine',
            gl: undefined,
            model: {},
            projection: 'Perspective',
            main_renders: config.main_renders,
            secondary_renders: config.secondary_renders,
            active_main_render: 'FaceRender',
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
        this.setState({status, message});
    };

    onCanvasMount = (canvas) => {
        const gl = canvas.getContext("webgl2");
        this.setState({gl});
    };

    cleanApp = () => {
        const status = 'NORMAL';
        const model = {};
        this.setState({status, model});
    };

    render(){
        let loadModal_hide = 'hide';
        let errorModal_hide = 'hide';
        if(this.state.status === 'LOADING') loadModal_hide='';
        if(this.state.status === 'ERROR') errorModal_hide='';

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
