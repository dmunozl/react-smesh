import React from 'react';

import Header from './components/Header'
import ModelView from './components/ModelView'

import config from './config'

class SMeshApp extends React.Component{
    constructor(){
        super();
        this.state ={
            main_renders: config.main_renders,
            secondary_renders: config.secondary_renders,
            active_main_render: 'FaceRender',
            active_secondary_renders: []
        };
        this.update_main_render = this.update_main_render.bind(this);
        this.update_secondary_renders = this.update_secondary_renders.bind(this)
    }

    update_main_render(render){
        this.setState({active_main_render:render});
    }

    update_secondary_renders(render){
        let active_secondary_renders = this.state.active_secondary_renders;

        if(active_secondary_renders.includes(render)){
            active_secondary_renders = active_secondary_renders.filter((secondary_render) => {
                return secondary_render !== render;
            })
        }else{
            active_secondary_renders.push(render);
        }

        this.setState({active_secondary_renders});
    }

    render(){
        return(
            <>
                <header>
                    <Header main_renders={this.state.main_renders}
                            secondary_renders={this.state.secondary_renders}
                            active_main_render={this.state.active_main_render}
                            active_secondary_renders={this.state.active_secondary_renders}
                            update_main_render={this.update_main_render}
                            update_secondary_renders={this.update_secondary_renders}
                    />
                </header>
                <section id='main-view' className='view1'>
                    <ModelView/>
                </section>
            </>
        )
    }
}

export default SMeshApp
