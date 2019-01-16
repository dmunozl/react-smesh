import React from "react";

class ModelView extends React.Component {
    render(){
        return(
            <div className='model-view'>
                <canvas/>
                <div className="model-opt">
                    <div className="tooltiped" data-tooltip="Change perspective">
                        <button className="prev_a view-opt">
                            <div className="scene">
                                <div className="cube">
                                    <div className="face top"/>
                                    <div className="face left"/>
                                    <div className="face right"/>
                                </div>
                            </div>
                        </button>
                    </div>
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
        )
    }
}

export default ModelView
