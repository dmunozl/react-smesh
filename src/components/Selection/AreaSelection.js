import React from 'react'


class AreaSelection extends React.Component{
  render() {
    return <div className="area-box select-box">
      <div className="flex v-center">
        <label className="radio">
          <span>Range</span>
        </label>
        <div className="flex v-center">
          <input id="area_from" type="text" placeholder="0"/>
          <i className="material-icons">remove</i>
          <input id="area_to" type="text" placeholder="-"/>
        </div>
      </div>
    </div>
  }

}

export default AreaSelection