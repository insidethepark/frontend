// Javascript Entry Point
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import StartTrip from './start-trip';


///google maps

function initMap() {
        var mapDiv = document.getElementById('map');
        var map = new google.maps.Map(mapDiv, {
          center: {lat: 44.540, lng: -78.546},
          zoom: 8
        });
      }
window.initMap;

render((

	<Router history={hashHistory}>
		<Route path="/" component={StartTrip}></Route>
	</Router>

	), document.querySelector('.app')); 