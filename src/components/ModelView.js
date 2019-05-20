import React from "react";
import {RModel} from '../cg/RModel'
import DirectLightRenderer from "../cg/Renderers/MainRenderers/DirectLightRenderer";

class ModelView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            r_model: undefined,
            main_renderer: undefined
        };
        this.canvas_ref = React.createRef();
    }

    componentDidMount() {
        this.canvas = this.canvas_ref.current
        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl) {alert("No WebGL");}
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.status === 'SUCCESS'){
            const r_model = new RModel(nextProps.model, this.gl);
            const main_renderer = new DirectLightRenderer(this.gl, r_model);
            this.setState({
                r_model,
                main_renderer
            });
        }
    }

    draw() {
        const gl = this.gl;
        this.resizeCanvas();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        if(this.state.main_renderer != null){
            this.state.main_renderer.draw();
        }
    }

    resizeCanvas() {
        const canvas = this.gl.canvas;
        const width  = canvas.clientWidth*2;
        const height = canvas.clientHeight*2;
        if(width > height){
            canvas.width  = width;
            canvas.height = width/2;
        }else{
            canvas.width  = height*2;
            canvas.height = height;
        }
    }

    render(){
        if (this.state.main_renderer) {
            this.draw();
        }

        return <div className='model-view'>
            <canvas ref={this.canvas_ref}/>
            <div className="model-opt">
                <ProjectionButton/>
                <div className="zoom">
                    <i className="material-icons">zoom_in</i>
                    <input readOnly type="text" value="1.00"/>
                </div>
            </div>
            <div className="model-stadistics">
                <div className="autogrid center">
                    <div className="coord">
                        <span>Y: 23 - 9009</span>
                        <span>X: 23 - 9009</span>
                        <span>Z: 23 - 9009</span>
                    </div>
                    <div className="stadistics">
                        <span>Vertex: 38.390</span>
                        <span>•</span>
                        <span>Planes: 67.820</span>
                    </div>
                </div>
            </div>
        </div>

    }
}

class ProjectionButton extends React.Component {
    render() {
        return (
          <div className="tooltiped" data-tooltip="Change Projection">
              <button className="prev_a view-opt" onClick={() => this.props.projectionHandleClick(this.projection_button)}>
                  <div ref={button => this.projection_button = button} className="scene pers">
                      <div className="cube">
                          <div className="face top"/>
                          <div className="face left"/>
                          <div className="face right"/>
                      </div>
                  </div>
              </button>
          </div>
        )
    }
}


export default ModelView
