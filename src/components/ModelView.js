import React from "react";

class ModelView extends React.Component {
    componentDidMount(){
        this.props.onCanvasMount(this.canvas);
    }

    render(){
        return(
            <div className='model-view'>
                <canvas ref={canvas => this.canvas = canvas}/>
                <div className="model-opt">
                    <ProjectionButton projectionHandleClick={this.props.projectionHandleClick}/>
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
        )
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
