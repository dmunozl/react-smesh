import React from 'react';

// ICONS IMPORTS
// general icons
import ImportIcon from './icons/import_icon'
import ArrowDownIcon from './icons/arrow_down_icon'
// main renderer icons
import FaceRenderIcon from './icons/face_render_icon'
import VertexRenderIcon from './icons/vertex_render_icon'
import FlatRenderIcon from './icons/flat_render_icon'
import NoRenderIcon from './icons/no_render_icon'
// secondary renderers icons
import WireFrameRenderIcon from './icons/wireframe_render_icon'
import VertexCloudRenderIcon from './icons/vertexcloud_render_icon'
import FaceNormalsRenderIcon from './icons/facenormals_render_icon'
import VertexNormalsRenderIcon from './icons/vertexnormals_render_icon'

class Header extends  React.Component {
    constructor(){
        super();
        this.state ={
            main_renders:[
                {key:'face-render', child:<FaceRenderIcon/>, type:'btn-faces', tooltip:'Faces Light', active:''},
                {key:'vertex-render', child:<VertexRenderIcon/>, type:'btn-vertex', tooltip:'Vertices Light', active:''},
                {key:'flat-render', child:<FlatRenderIcon/>, type:'', tooltip:'Flat Color' , active:''},
                {key:'none-render', child:<NoRenderIcon/>, type:'', tooltip:'No Render' , active:''}
            ],
            active_render:'face-render'
        };
        this.update_main_render = this.update_main_render.bind(this)
    }

    update_main_render(render){
        this.setState({active_render:render})
    }

    render(){
        let main_renders = this.state.main_renders;
        main_renders = main_renders.map(render => {
            if(render.key === this.state.active_render){
                render.active = 'active';
            }else{
                render.active = ''
            }
            return render;
        });

        return (
            <div className='autogrid'>
                <HeaderButtonSection>
                    <HeaderButton>
                        <ImportIcon/>
                    </HeaderButton>
                </HeaderButtonSection>
                <HeaderButtonSection>
                    {main_renders.map(render =>
                        <HeaderButton key={render.key}
                                      id = {render.key}
                                      type={render.type}
                                      tooltip={render.tooltip}
                                      active={render.active}
                                      click={this.update_main_render}>
                            {render.child}
                        </HeaderButton>
                    )}
                </HeaderButtonSection>
                <HeaderListSection>
                    <HeaderList tooltip = 'Display Properties'>
                        <HeaderListElement text='Wireframe'><WireFrameRenderIcon/></HeaderListElement>
                        <HeaderListElement text='Vertex Cloud'><VertexCloudRenderIcon/></HeaderListElement>
                        <HeaderListElement text='Face Normals'><FaceNormalsRenderIcon/></HeaderListElement>
                        <HeaderListElement text='Vertex Normals'><VertexNormalsRenderIcon/></HeaderListElement>
                    </HeaderList>
                </HeaderListSection>
                <HeaderButtonSection>

                </HeaderButtonSection>
            </div>
        )
    }
}

class HeaderButtonSection extends React.Component {
    render(){
        return (
            <div className='autogrid'
                 onClick={this.ble}>
                {this.props.children}
            </div>
        )
    }
}

class HeaderListSection extends React.Component {
    render(){
        return (
            <div className='autogrid'>
                {this.props.children}
            </div>
        )
    }
}

class HeaderButton extends React.Component {
    render(){
        return(
            <button id={this.props.id}
                    className={'tooltiped prev_a ' + this.props.type + ' ' +this.props.active}
                    data-tooltip={this.props.tooltip}
                    onClick={() => this.props.click(this.props.id)}>
                {this.props.children}
            </button>
        )
    }
}

class HeaderList extends React.Component {
    render(){
        return(
            <button className={'prev_a open-menu'} data-tooltip={this.props.tooltip}>
                <ArrowDownIcon/>
                <ul className={'submenu'}>{this.props.children}</ul>
            </button>
        )
    }
}

class HeaderListElement extends React.Component {
    render() {
        return (
            <li>
                <label className="checkmenu">
                    <input type="checkbox"/>
                    <div className="flex label">
                        <span className={'prev_img'}>{this.props.children}</span>
                        <span>{this.props.text}</span>
                    </div>
                </label>
            </li>
        )
    }
}


export default Header