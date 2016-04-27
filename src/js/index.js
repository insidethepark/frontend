// Javascript Entry Point
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import StartTrip from './start-trip';
import Itenerary from './itenerary';
import Login from './login';
import Itinerary from './itinerary';
import Cookies from 'js-cookie';


///google maps
  function isSignedIn() {
    if (Cookies.get('user_email', 'auth_token', 'id')) {
      return true;
    } else {
      return false;
    }
  }
  function mustSignIn() {
    if(!isSignedIn) {
      hashHistory.replace('/');
    }
  }
  function staySignedIn() {
    if(isSignedIn) {
      hashHistory.replace('/start-trip');
    }
  }

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
		<Route path="/" component={Login}></Route>
    <Route path="/start-trip" component={StartTrip} onEnter={mustSignIn}></Route>
		 <Route path="/itinerary" component={Itinerary} onEnter={mustSignIn}></Route>

  </Router>

  ), document.querySelector('.app')); 


