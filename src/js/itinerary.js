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
			this.setState({events});
		})

	}




	render () {
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

