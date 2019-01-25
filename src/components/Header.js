import React from 'react';

import {getIconComponent} from "../utils";

// ICONS IMPORTS
import ImportIcon from '../icons/import_icon'
import ArrowDownIcon from '../icons/arrow_down_icon'
import ViewModeIcon from '../icons/viewmode_icon'
import ResetIcon from '../icons/reset_icon'

class Header extends  React.Component {
    render(){
        let main_renders = this.props.main_render_list.map(render => {
            if(render.key === this.props.active_main_render){
                render.active = 'active';
            }else{
                render.active = ''
            }
            return render
        });

        let secondary_renders = this.props.secondary_render_list.map(render => {
           if(this.props.active_secondary_renders.includes(render.key)){
               render.checked = 'checked';
           }else{
               render.checked = ''
           }
           return render
        });

        return (
            <><div className='autogrid'>
                <HeaderSection>
                    <input hidden ref={input => this.import_input = input} type="file"
                           onChange={() => this.props.importHandleChange(this.import_input.files[0])}/>
                    <HeaderButton id="load-model"
                                  tooltip="Load Model"
                                  handleClick={() => this.props.importHandleClick(this.import_input)}
                    ><ImportIcon/></HeaderButton>
                </HeaderSection>

                <HeaderSection>
                    {main_renders.map(render =>
                        <HeaderButton key={render.key}
                                      id = {render.key}
                                      type={render.type}
                                      tooltip={render.tooltip}
                                      active={render.active}
                                      handleClick={this.props.mainRenderHandleClick}
                        >{getIconComponent(render.key)}</HeaderButton>
                    )}
                </HeaderSection>

                <HeaderSection>
                    <HeaderList tooltip = 'Display Properties'>
                        {secondary_renders.map(render =>
                            <HeaderListElement key={render.key}
                                               id={render.key}
                                               text={render.text}
                                               checked={render.checked}
                                               handleChange={this.props.secondaryRendersHandleChange}
                            >{getIconComponent(render.key)}</HeaderListElement>
                        )}
                    </HeaderList>
                </HeaderSection>

                <HeaderSection>
                    <HeaderButton id='change-view' tooltip='Change View Mode' disabled='disabled'>
                        <ViewModeIcon/>
                    </HeaderButton>
                    <HeaderButton id='reset-view' tooltip='Reset View' disabled='disabled'>
                        <ResetIcon/>
                    </HeaderButton>
                </HeaderSection>
            </div>
            <Logo/></>
        )
    }
}

const HeaderSection = (props) => (
    <div className='autogrid'>
        {props.children}
    </div>
);

const HeaderButton = (props) => (
    <button id={props.id}
            className={
                'tooltiped prev_a ' +
                props.type + ' ' +
                props.active + ' ' +
                props.disabled
            }
            data-tooltip={props.tooltip}
            onClick={() => props.handleClick(props.id)}>
        {props.children}
    </button>
);

HeaderButton.defaultProps = {
    active: '',
    disabled: '',
    type: '',
    handleClick:() => console.log('unimplemented')
};


const HeaderList = (props) => (
    <button className={'prev_a open-menu'} data-tooltip={props.tooltip}>
        <ArrowDownIcon/>
        <ul className={'submenu'}>{props.children}</ul>
    </button>
);

const HeaderListElement = (props) => (
    <li id={props.id}>
        <label className="checkmenu">
            <input type="checkbox" checked={props.checked} onChange={() => props.handleChange(props.id)}/>
            <div className="flex label">
                <span className={'prev_img'}>{props.children}</span>
                <span>{props.text}</span>
            </div>
        </label>
    </li>
);

HeaderListElement.defaultProps = {
    handleChange:() => console.log('unimplemented')
};

const Logo = () => (
    <div className="logo flex center">
        <div>
            <h1>S-MESH</h1>
            <div className="autogrid center">
                <button className="modal-trigger" data-modal="modal-about">About</button>
                <span>|</span>
                <a href="." target="_blank">GitHub</a>
            </div>
        </div>
    </div>
);

export default Header
