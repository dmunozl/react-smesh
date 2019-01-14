import React from 'react';
import ReactDOM from 'react-dom';

import Header from './Header';
import Logo from './Logo'

// CSS IMPORTS
import './css/base.css'
import './css/style.css'
import './css/anim.css'

ReactDOM.render(<><Header /><Logo/></>, document.getElementById('app'));
