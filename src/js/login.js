import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import { ajax } from 'jquery';
import SSF from 'react-simple-serial-form';
import Cookies from 'js-cookie';

let loggedInUser = null;

export default class Login extends Component{

	loginHandler(userData){

		if (userData.email && userData.password){

			let data = new FormData();

			data.append('email', userData.email);
			data.append('password', userData.password);

			ajax({
		      url: 'https://shielded-hollows-39012.herokuapp.com/login',
		      type: 'POST',
		      data: data,
		      cache: false,
		      dataType: 'json',
		      processData: false,
		      contentType: false
		    }).then( (response, statusText, { status } ) => {
				
		    	if (status == 200){

		    		console.log("response.user =>",response.user);
		    		console.log("response.user.id =>",response.user.id);

					Cookies.set('user_email', response.user.email);
					Cookies.set('auth_token', response.user.auth_token);
					Cookies.set('id', response.user.id);
					loggedInUser = Cookies.get();
					// loggedInUser = Cookies.get('auth_token');
					
					console.log("loggedInUser",loggedInUser);

					hashHistory.push('/start-trip');

		}

		

	})}
		else{

					alert("You need to enter both an email and a password to login");

				}
	}

	signupHandler(userData){

		if (userData.email && userData.password && userData.first && userData.last){

		let data = new FormData();

		data.append('first', userData.first);
		data.append('last', userData.last);
		data.append('email', userData.email);
		data.append('password', userData.password);


		ajax({
		      url: 'https://shielded-hollows-39012.herokuapp.com/signup',
		      type: 'POST',
		      data: data,
		      cache: false,
		      dataType: 'json',
		      processData: false,
		      contentType: false
		    }).then( (response, statusText, { status } ) => {

		    	console.log(status);
				
		    	if (status == 201){

		    		console.log("response.user =>",response.user);
		    		console.log("response.user.id =>",response.user.id);

					Cookies.set('user_email', response.user.email);
					Cookies.set('auth_token', response.user.auth_token);
					Cookies.set('id', response.user.id);
					loggedInUser = Cookies.get();
					// loggedInUser = Cookies.get('auth_token');
					
					console.log("loggedInUser",loggedInUser);

					hashHistory.push('/start-trip');



		}

		

		})}
		else{

					alert("You need to enter both an email and a password to login");

				}


	}

	render(){

		return(

			<div className="login-wrapper">

				<SSF onData={::this.loginHandler}>
					<h2>Login</h2>

					<div><input type="email" name="email" placeholder="Email"></input></div>
					<div><input type="password" name="password" placeholder="Password"></input></div>
					<button>Login</button>

				</SSF>

				<SSF onData={::this.signupHandler}>
					<h2>Sign up</h2>

					<div><input type="text" name="first" placeholder="First name"></input></div>
					<div><input type="text" name="last" placeholder="Last name"></input></div>
					<div><input type="email" name="email" placeholder="Email"></input></div>
					<div><input type="password" name="password" placeholder="Password"></input></div>
					<button>Sign up</button>

				</SSF>


			</div>

			);

	}

}