import React from 'react'


class FaceIdSelection extends React.Component{
  render() {
    return <div className="id-box select-box">
      <div className="flex v-center">
        <label className="radio">
          <input type="radio" name="id-opt" value="range" checked/>
          <div className="input-radio"/>
          <span>Range</span>
        </label>
        <div className="flex v-center">
          <input id='id_from' type="text" placeholder="0"/>
          <i className="material-icons">remove</i>
          <input id='id_to' type="text" placeholder="0"/>
        </div>
      </div>
      <div id="attach">
        <div className="flex v-center">
          <label className="radio">
            <input type="radio" name="id-opt" value="list"/>
            <div className="input-radio"/>
            <span>Paste List</span>
          </label>
        </div>
        <div className="attached-list">
          <textarea disabled placeholder="Ej: 34"/>
        </div>
      </div>
    </div>
  }
}

export default FaceIdSelection