import React from 'react';

import Header from './components/Header'
import ModelView from './components/ModelView'
import {Model} from './cg/Model'

import config from './config'

class SMeshApp extends React.Component{
    constructor(){
        super();
        this.state ={
            model: undefined,
            main_renders: config.main_renders,
            secondary_renders: config.secondary_renders,
            active_main_render: 'FaceRender',
            active_secondary_renders: []
        };
    }

    main_render_handleClick = (render) => {
        this.setState({active_main_render:render});
        console.log(render)
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
        console.log(active_secondary_renders)
    };

    import_handleClick = (import_input) => {
        import_input.click();
        console.log('Import Click')
    };

    import_handleChange = (file) => {
        if(file) {
            const model = new Model(file);
            this.setState({model});
        }
    };

    render(){
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
                            import_handleChange = {this.import_handleChange}
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
