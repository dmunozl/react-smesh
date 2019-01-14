import React from 'react';

class Logo extends React.Component {
    render(){
        return(
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
        )
    }
}

export default Logo