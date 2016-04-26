import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import { ajax } from 'jquery';



export default class Itinerary extends Component {
	constructor (...args) {
		super (...args);
		this.state = { events: [] }
	}

	

	componentWillMount() {

		ajax('https://api.seatgeek.com/2/events?datetime_local.gte=2016-04-26&datetime_local.lte=2016-04-27T00:00:01&type=mlb&per_page=25').then(data => {
			console.log(data.events);
		this.setState({events: data.events})
			
		})

	}
	 getEvent(event) {
	 	return ( 
	 			<div key={event.title}>
	 				<h2>{event.datetime_local} in {event.venue.city}</h2>
	 				<img src={event.performers[0].image}/>
	 				<div>{event.title}</div>
	 				<div>{event.url}</div>
	 				<div>Average price: ${event.stats.average_price}</div>
	 				<div>{event.datetime_local}</div>
	 			</div>
			)
	}




	render () {

		let { events } = this.state;
		console.log(events)
		return (
			<div className="itinerary-wrapper">
				<h2>Your Roadtrip</h2>
				<div className="body">
					<div>
					{events.map(::this.getEvent)}
					</div>
					<Link to="/StartTrip">Start Over</Link>
				</div>
			</div>



			)
		}
}






