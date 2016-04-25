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


			// ajax().then();

			console.log("login successful");

			ajax({
		      url: 'https://safe-ridge-87798.herokuapp.com/login',
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

		}

		

	})}
		else{

					alert("You need to enter both an email and a password to login");

				}
	}
	
	signupHandler(userData){

		if (userData.email && userData.password && userData.firstname && userData.lastname){

		let data = new FormData();

		data.append('firstname', userData.firstname);
		data.append('lastname', userData.lastname);
		data.append('email', userData.email);
		data.append('password', userData.password);

		console.log("signup successful");

		// ajax().then();

		}else{

			alert("All fields need a value before moving on");

		}


	}

	render(){

		return(

			<div className="login-wrapper">

				<SSF onData={::this.loginHandler}>
					<h2>Login</h2>

					<input type="email" name="email" placeholder="Email"></input>
					<input type="password" name="password" placeholder="Password"></input>
					<button>Login</button>

				</SSF>

				<SSF onData={::this.signupHandler}>
					<h2>Sign up</h2>

					<input type="text" name="firstname" placeholder="First name"></input>
					<input type="text" name="lastname" placeholder="Last name"></input>
					<input type="email" name="email" placeholder="Email"></input>
					<input type="password" name="password" placeholder="Password"></input>
					<button>Sign up</button>

				</SSF>


			</div>

			);

	}

}