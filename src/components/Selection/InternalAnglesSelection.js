import React from 'react'


class InternalAnglesSelection extends React.Component{
  render() {
    return <div className="angle-box select-box active">
      <div className="flex v-center">
        <label className="radio">
          <span>Range</span>
        </label>
        <div className="flex v-center">
          <input id="angle_from" type="text" placeholder="0"/>
          <i className="material-icons">remove</i>
          <input id="angle_to" type="text" placeholder="180"/>
        </div>
      </div>
    </div>
  }

}

export default InternalAnglesSelection