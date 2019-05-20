import React from 'react';

export const LoadModal = (props) => (
    <div id="modal-loading" className={props.hide + " modal loader"}>
        <div className="flex center">
            <div className="modal-container">
                <div className="modal-body">
                    <h5>{props.message}</h5>
                    <div className="spinner">
                        <div className="double-bounce1"/>
                        <div className="double-bounce2"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const ErrorModal = (props) => (
    <div id="modal-warning" className={props.hide + " modal error"}>
        <div className="flex center">
            <div className="modal-container">
                <div className="modal-close close" onClick={props.cleanApp}><i className="material-icons">close</i></div>
                <div className="modal-header">
                    <div className="icon"/>
                    <h4>Error</h4>
                </div>
                <div className="modal-body">
                    <span>{props.message}</span>
                </div>
            </div>
        </div>
    </div>
);