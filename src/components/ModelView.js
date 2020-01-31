import React from "react";
import {RModel} from '../cg/RModel'

import RendererFactory from "../cg/RendererFactory"
import ProjectionButton from "./ProjectionButton";

class ModelView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            r_model: undefined,
            view_type: undefined,
            main_renderer: undefined
        };
        this.canvas_ref = React.createRef();
        this.rotating = false;
        this.moving = false;
    }

    componentDidMount() {
        this.canvas = this.canvas_ref.current;
        this.gl = this.canvas.getContext("webgl2");
        if (!this.gl) {alert("No WebGL");}
        window.addEventListener("resize", this.rescaleModel.bind(this));
    }

    componentDidUpdate(prevProps, prevState) {
        const props = this.props;
        if((props.status !== prevProps.status) && props.status === 'SUCCESS'){
            const r_model = new RModel(props.model, props.main_renderer, this.gl);
            const RendererObject = RendererFactory.getRenderer(props.main_renderer);
            let main_renderer = null;

            if (RendererObject) {
                main_renderer = new RendererObject(this.gl, r_model);
            }

            this.setState({
                r_model,
                main_renderer
            });
        }

        if (this.state.r_model && this.state.r_model !== prevState.r_model) {
            const rotator = this.state.r_model.rotator;
            const translator = this.state.r_model.translator;
            const mousedown = e => {
                if (e.button === 0) {
                    this.rotating = true;
                    rotator.setRotationStart(e.clientX, e.clientY)
                } else if (e.button === 2) {
                    this.moving = true;
                    translator.setMovementStart(e.clientX, e.clientY)
                }
            };

            const mouseup = e => {
                this.rotating = false;
                this.moving = false;
            };

            const mousemove = e => {
                if (this.rotating) {
                    rotator.rotateTo(e.clientX, e.clientY);
                    this.state.r_model.updateRotation();
                    this.draw();
                }

                if (this.moving) {
                    translator.moveTo(e.clientX, e.clientY);
                    this.state.r_model.updateTranslation();
                    this.draw();
                }
            };
            this.canvas.addEventListener("contextmenu", e => e.preventDefault());
            this.canvas.addEventListener('mousedown', mousedown);
            this.canvas.addEventListener('mouseup', mouseup);
            this.canvas.addEventListener('mousemove', mousemove);
        }

        if (this.state.r_model && (props.main_renderer !== prevProps.main_renderer)) {
            this.state.r_model.updateRenderType(props.main_renderer);
            const RendererObject = RendererFactory.getRenderer(props.main_renderer);
            let main_renderer = null;

            if (RendererObject) {
                main_renderer = new RendererObject(this.gl, this.state.r_model);
            }

            this.setState({
                main_renderer
            });
        }
    }

    projectionHandleClick = () => {
        if (this.state.r_model) {
            this.state.r_model.toggleProjection();

            this.setState({
                view_type: this.state.r_model.view_type
            })
        }
    };

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

    rescaleModel(){
        if(this.state.r_model){
            this.state.r_model.rescale();
            this.forceUpdate();
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
        if (this.canvas && this.gl) {
            this.draw();
        }

        return <div className='model-view'>
            <canvas ref={this.canvas_ref}/>
            <div className="model-opt">
                <ProjectionButton
                  projectionHandleClick={this.projectionHandleClick}
                  view_type={this.state.view_type}/>
                <div className="zoom">
                    <i className="material-icons">zoom_in</i>
                    <input readOnly type="text" value="1.00"/>
                </div>
            </div>
            <div className="model-statistics">
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

export default ModelView
