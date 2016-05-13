// Javascript Entry Point
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import StartTrip from './start-trip';
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
    // console.log('you shall not pass');
    if(!isSignedIn) {
      hashHistory.replace('/');
    }
  }
  function staySignedIn() {
    if(isSignedIn) {
      hashHistory.replace('/start-trip');
    }
  }


render((

	<Router history={hashHistory}>
		<Route path="/" component={Login}></Route>
    <Route path="/start-trip" component={StartTrip} onEnter={mustSignIn}></Route>
  	<Route path="/itinerary" component={Itinerary} onEnter={mustSignIn}></Route>
 </Router>

  ), document.querySelector('.app')); 


