import React from "react";


class ProjectionButton extends React.Component {
  render() {
    return <div className="tooltiped" data-tooltip="Change Projection">
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

  }
}

export default ProjectionButton