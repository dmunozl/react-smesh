import React from "react";

import config from "../../config";

import InternalAnglesSelection from "./InternalAnglesSelection";
import AreaSelection from "./AreaSelection";
import FaceIdSelection from "./FaceIdSelection";

import CleanSelection from "../../icons/clean_selection";
import AddSelection from "../../icons/add_selection";
import SubtractSelection from "../../icons/subtract_selection";
import IntersectSelection from "../../icons/intersect_selection";


class Selections extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection_tab: "new",
      selection_options_open: false,
      selection_value: 'angle',
      selection_type: 'clean',
      applied_selections: [],
    }
  }

  changeSelectionTab = tab => {
    this.setState({
      selection_tab: tab
    })
  };

  toggleSelectionOptions = () => {
    this.setState({
      selection_options_open: !this.state.selection_options_open,
    })
  };

  updateSelectionValue = (value) => {
    this.setState({
      selection_value: value
    });
    this.toggleSelectionOptions()
  };

  setSelectionType = e => {
    const type = e.target.value;
    this.setState({
      selection_type: type
    })
  };

  render() {
    const polygon_selections = config.polygon_selections;
    const selection_tab = this.state.selection_tab;
    const selection_value = this.state.selection_value;
    const selection_type = this.state.selection_type;
    const selection = polygon_selections.filter(selection=>selection.value===selection_value)[0];

    return <div className="card selections">
      <div className="selection-tabs">
        <div className={selection_tab === "new"? "tabs tab1" : "tabs tab2"}>
          <span className={selection_tab === "new"? "prev_a tab active" : "prev_a tab"} onClick={() => this.changeSelectionTab("new")}>
            <h4>New Selection</h4>
          </span>
          <span className={selection_tab === "active"? "prev_a tab active" : "prev_a tab"} onClick={() => this.changeSelectionTab("active")}>
            <h4>Active selections</h4>
          </span>
        </div>
        <div className="tabs-body">
          <div id="tab-selection" className={selection_tab === "new"? "tab-content active" : "tab-content"}>
            <div id="selection-type" className="select drop-down">
              <div className="button" onClick={this.toggleSelectionOptions}>
                <div>
                  <span>{selection.text}</span>
                </div>
                <button className="prev_a"><i className="material-icons">keyboard_arrow_down</i></button>
              </div>
              <ul className={this.state.selection_options_open? "select-list active" : "select-list"}>
                {polygon_selections.map(selection => {
                  return <li className="clsAnchor" key={selection.value} value={selection.value} onClick={() => this.updateSelectionValue(selection.value)}>
                    <span>{selection.text}</span>
                  </li>
                })}
              </ul>
            </div>
            {this.state.selection_value === "angle" &&
              <InternalAnglesSelection/>}
            {this.state.selection_value === "area" &&
              <AreaSelection/>}
            {this.state.selection_value === "id" &&
              <FaceIdSelection/>}

            <div className="selectionmode-box">
              <h4>Selection mode:</h4>
              <div className="flex evenly">
                <label className="radio select-mode tooltiped"
                       data-tooltip="Clean selection">
                  <input type="radio" name="selection_type" value="clean" onChange={this.setSelectionType} checked={selection_type === "clean"}/>
                  <div className="input-radio">
                    <CleanSelection/>
                  </div>
                </label>
                <label className="radio select-mode tooltiped"
                       data-tooltip="Add">
                  <input type="radio" name="selection_type" value="add" onChange={this.setSelectionType} checked={selection_type === "add"}/>
                  <div className="input-radio">
                    <AddSelection/>
                  </div>
                </label>
                <label className="radio select-mode tooltiped"
                       data-tooltip="Substract">
                  <input type="radio" name="selection_type" value="subtract" onChange={this.setSelectionType} checked={selection_type === "subtract"}/>
                  <div className="input-radio">
                    <SubtractSelection/>
                  </div>
                </label>
                <label className="radio select-mode tooltiped"
                       data-tooltip="Intersect">
                  <input type="radio" name="selection_type" value="intersect" onChange={this.setSelectionType} checked={selection_type === "intersect"}/>
                  <div className="input-radio">
                    <IntersectSelection/>
                  </div>
                </label>
              </div>
            </div>
            <div className="flex center">
              <span className="prev_a">
                <div id="apply_btn" className="btn">Apply</div>
              </span>
            </div>
          </div>
          <div id="tab-history" className={selection_tab === "active"? "tab-content active" : "tab-content"}>
            <ul id="selections-container">

            </ul>
          </div>
        </div>
      </div>
    </div>
  }
}

export default Selections