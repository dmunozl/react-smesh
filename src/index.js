import React from 'react';
import ReactDOM from 'react-dom';

import {Header, ModelView} from './App';

// CSS IMPORTS
import './css/base.css'
import './css/style.css'
import './css/anim.css'

ReactDOM.render(<Header/>, document.getElementById('header'));
ReactDOM.render(<ModelView/>, document.getElementById('model-view'));
