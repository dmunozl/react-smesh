import React from 'react';

import Header from './components/Header'
import ModelView from './components/ModelView'
import Selections from "./components/Selection/Selections";
import {LoadModal, ErrorModal} from "./components/Modals";

import Model from './cg/Model'
import config from './config'

class SMeshApp extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      model: undefined,
      status: 'WAITING',
      main_renderers: config.main_renderers,
      secondary_renderers: config.secondary_renderers,
      active_main_renderer: 'FaceRender',
      active_secondary_renderers: []
    };
  }

  mainRenderHandleClick = (renderer) => {
    this.setState({active_main_renderer:renderer});
  };

  secondaryRenderHandleChange = (render) => {
    let active_secondary_renders = this.state.active_secondary_renderers;
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
    import_input.click();
  };

  importHandleChange = (file) => {
    if(file) {
      const model = new Model(file, this.loadCallback);
      this.setState({
        model,
        status:model.status
      })
    }
  };

  loadCallback = (model) => {
    this.setState({
      model,
      status:model.status
    })
  };

  render(){
    const hide_loading = this.state.status === 'LOADING'? '' : 'hidden';
    const hide_error = this.state.status === 'ERROR'? '' : 'hidden';

    return <React.Fragment>
      <header>
        <Header
          main_renderers={this.state.main_renderers}
          secondary_renderers={this.state.secondary_renderers}
          active_main_renderer={this.state.active_main_renderer}
          active_secondary_renderers={this.state.active_secondary_renderers}
          mainRenderHandleClick={this.mainRenderHandleClick}
          secondaryRenderHandleChange={this.secondaryRenderHandleChange}
          importHandleClick = {this.importHandleClick}
          importHandleChange = {this.importHandleChange}/>
      </header>
      <section id='main-view' className='view1'>
        <ModelView
          model={this.state.model}
          status = {this.state.status}
          main_renderer={this.state.active_main_renderer}
          secondary_renderers={this.state.active_secondary_renderers}/>
        <Selections/>
        <LoadModal hide={hide_loading} message={this.state.status}/>
        <ErrorModal hide={hide_error}/>
      </section>
    </React.Fragment>

  }
}

export default SMeshApp
