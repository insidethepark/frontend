import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { ajax } from 'jquery';



export default class Itinerary extends Component {
	constructor (...args) {
		super (...args);
		this.state = { events: [] }
	}

	

	componentWillMount() {
		ajax('https://api.seatgeek.com/2/events?datetime_local.gte=2016-04-26&datetime_local.lte=2016-04-27T00:00:01&type=mlb&per_page=25').then(events => {
			console.log("i ran");
			console.log("events", events);
			this.setState({events});
			console.log(this.state.events);
		})

	}




	render () {

		let { events } = this.state;

		console.log("this.state.events", this.state.events);

		console.log(events);

		return (
			<div class="itinerary-wrapper">
				<h2>Your Roadtrip</h2>
				<div class="body">
					<img src="{events.performers.image}"/>
					<div>{events.title}</div>
					<div>{events.url}</div>
					<div>{events.stats.average_price}</div>
					<div>{events.datetime_local}</div>
				</div>
			</div>



			)
		}
}
// may have to specify first object withint performers array (line 32)

