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
            model: {},
            main_renders: config.main_renders,
            secondary_renders: config.secondary_renders,
            active_main_render: 'FaceRender',
            active_secondary_renders: []
        };
    }

    main_render_handleClick = (render) => {
        this.setState({active_main_render:render});
    };

    secondary_render_handleChange = (render) => {
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

    import_handleClick = (import_input) => {
        import_input.value = '';
        import_input.click();
    };

    import_handleChange = (file) => {
        if(file) {
            const fileHandler = fileHandlerFactory.getFileHandler(file);
            fileHandler.loadData();
            const model = fileHandler.getModel();
            const status = model.status;
            const message = model.message;

            this.setState({status, message, model});
            WatchJS.watch(model, 'message', this.on_model_status_change);
        }
    };

    on_model_status_change = () => {
        if (this.state.status === this.state.model.status && this.state.message === this.state.model.message) return;
        const status = this.state.model.status;
        const message = this.state.model.message;
        this.setState({status, message});
    };

    clean_app = () => {
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
            <>
                <header>
                    <Header main_renders={this.state.main_renders}
                            secondary_renders={this.state.secondary_renders}
                            active_main_render={this.state.active_main_render}
                            active_secondary_renders={this.state.active_secondary_renders}
                            main_render_handleClick={this.main_render_handleClick}
                            secondary_render_handleChange={this.secondary_render_handleChange}
                            import_handleClick = {this.import_handleClick}
                            import_handleChange = {this.import_handleChange}/>
                </header>
                <section id='main-view' className='view1'>
                    <ModelView/>
                </section>
                <LoadModal  hide={loadModal_hide}  message={this.state.message} />
                <ErrorModal hide={errorModal_hide} message={this.state.message} clean_app={this.clean_app}/>
            </>
        )
    }
}

export default SMeshApp
