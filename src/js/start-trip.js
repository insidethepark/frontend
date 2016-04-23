import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { ajax } from 'jquery';

import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ReactDatePicker from 'react-date-picker';
// require('react-date-picker/base.css');


export default class StartTrip extends Component{

	constructor(...args){
		super(...args)

		this.state = {

			citiesWithGames: []

		}

	}

	dateChangeHandler(dateString){

		let URL = `https://api.seatgeek.com/2/events?datetime_local.gte=${dateString}&datetime_local.lte=${dateString}T23:59:01&type=mlb&per_page=15`;
		let citiesWithGames = [];

		ajax(URL).then( data => {

			data.events.map(event => {

			citiesWithGames.push(event.venue.city);

			});

			this.setState({citiesWithGames});

		});

	}


	render(){

		let { citiesWithGames } = this.state;

		return(

			<div>
				<ReactDatePicker onChange={::this.dateChangeHandler}/>

				<ul>

					{citiesWithGames.map(city => <li key={city}>{city}</li>)}

				</ul>

			</div>
			);

	}
}