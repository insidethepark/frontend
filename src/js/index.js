// Javascript Entry Point
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import StartTrip from './start-trip';

render((

	<Router history={hashHistory}>
		<Route path="/" component={StartTrip}></Route>
	</Router>

	), document.querySelector('.app')); 