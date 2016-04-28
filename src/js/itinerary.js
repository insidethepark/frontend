import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import { ajax } from 'jquery';
import Cookies from 'js-cookie';
import StartTrip from './start-trip';
import moment from 'moment';



export default class Itinerary extends Component {
	constructor (...args) {
		super (...args);
		this.state = { events: [] }
	}

	

	componentWillMount() {

		console.log('auth_token', Cookies.get('auth_token'));
		if (Cookies.get('user_email', 'auth_token', 'id')) {
		ajax('https://api.seatgeek.com/2/events?datetime_local.gte=2016-04-28&datetime_local.lte=2016-04-28T23:59:01&type=mlb&per_page=15').then(data => {
			console.log(data.events);
		this.setState({events: data.events});
		this.drawMap();

		})} else {
			hashHistory.replace('/');
		}



	}

	drawMap(){


			console.log("google in comp did mount", google);
			var directionsService = new google.maps.DirectionsService;
    		var directionsDisplay = new google.maps.DirectionsRenderer;
		    var mapDiv = document.getElementById('map');
		    // var map = new google.maps.Map(mapDiv, {
		    //   center: {lat: 44.540, lng: -78.546},
		    //   zoom: 8
		    // });

		    this.setState({

		    	mapProps: {
			      center: {lat: 44.540, lng: -78.546},
			      zoom: 8
			    }
			})

		    var map = new google.maps.Map(mapDiv, this.state.mapProps);
		    console.log("map in component", map);
			console.log("the ajax call ran");

			directionsDisplay.setMap(map);

		    // var waypts = [{
		    //           location: "Nashville",
		    //           stopover: true
		    //         }, {
		    //           location: "Kansas City",
		    //           stopover: true
		    //         }, {
		    //           location: "Denver",
		    //           stopover: true
		    //         }];

		    var waypts = this.state.waypts;
		    let updatedWaypts;


		  //   if(waypts.length > 2 ){

				// let tempWaypts = waypts.splice(0,1);
				// updatedWaypts = tempWaypts.splice(waypts.length-1,1);

		  //   }
		    
		    // console.log("updatedWaypts",updatedWaypts);

		    //console.log("waypts in drawMap", waypts);

		    directionsService.route({
		          origin: this.start_address.location,
		          destination: this.end_address.location,
		          waypoints: updatedWaypts || waypts,
		          optimizeWaypoints: true,
		          travelMode: google.maps.TravelMode.DRIVING
		        }, function(response, status) {
		          if (status === google.maps.DirectionsStatus.OK) {
		            directionsDisplay.setDirections(response);
		            var route = response.routes[0];
		            var summaryPanel = document.getElementById('directions-panel');
		            summaryPanel.innerHTML = '';
		            // For each route, display summary information.
		            for (var i = 0; i < route.legs.length; i++) {
		              var routeSegment = i + 1;
		              summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
		                  '</b><br>';
		              summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
		              summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
		              summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
		            }
		          } else {
		            window.alert('Directions request failed due to ' + status);
		          }
		        });

	}

	updateLocation(){

		this.setState({

		    	mapProps: {
			      center: {lat: 50.540, lng: -50.546},
			      zoom: 8
			    }
			})
		var mapDiv = document.getElementById('map');
		var map = new google.maps.Map(mapDiv, this.state.mapProps);

	}

	// componentDidMount(){


	// 	setTimeout(::this.drawMap, 5000);
	// }

	// componentDidMount(){

	// 	  var mapDiv = document.getElementById('map2');
	// 	    // var map = new google.maps.Map(mapDiv, {
	// 	    //   center: {lat: 44.540, lng: -78.546},
	// 	    //   zoom: 8
	// 	    // });

	// 	    this.setState({

	// 	    	mapProps: {
	// 		      center: {lat: 44.540, lng: -78.546},
	// 		      zoom: 8
	// 		    }
	// 		})

	// 	    var map = new google.maps.Map(mapDiv, this.state.mapProps);
	// 	    console.log("map in component", map);
	// 		console.log("the ajax call ran");


	// }

	addGameHandler(city){

		let totalPitStops = this.state.totalPitStops + 1;
		this.setState({totalPitStops});
		console.log("updatedPitStopCount", totalPitStops);
		let route = this.state.waypts;

		if (totalPitStops === 1){

			this.start_address = {location: city.city, stopover: true};

		}

		if (totalPitStops === 2){

			this.end_address = {location: city.city, stopover: true}

			this.drawMap();

		}

		if(totalPitStops >= 3){

			route.push(this.end_address);
			this.setState({waypts: route});
			this.end_address = {location: city.city, stopover: true}

			
			

			console.log("waypts=>",this.state.waypts);

			this.drawMap();

		}
	}

	 getEvent(event) {
	 	let gametime = event.datetime_local;
	 	let tickets = event.url;

	 	// let venueImg = event.performers.filter( team => return team.home_team);
	 	console.log("event performers",event.performers);

	 	
		let img;

		if(event.performers[0].home_team === true){

		 	img = event.performers[0].image;
		}else{

			img = event.performers[1].image;
		}
	 	

	 	return ( 
	 			<div key={event.title} className="itinerary-event">
	 				<h2>{moment(gametime).format('dddd, MMMM Do YYYY')} in {event.venue.city}</h2>
	 				<img src={img}/>
	 				<div>{event.title}</div>
	 				<div>Price Range: ${event.stats.lowest_price} to ${event.stats.highest_price}</div>
	 				<div>Average price: ${event.stats.average_price}</div>
	 				<div>Tickets Remaing: {event.stats.listing_count}</div>
					<div><a href={tickets}><button>Tickets!!</button></a></div>
	 				<div>{moment(gametime).format('dddd, MMMM Do YYYY')}</div>
	 			</div>
			)
	}

	logOutHandler() {
		Cookies.remove('user_email');
		Cookies.remove('auth_token');
		Cookies.remove('id');
		let loggedInUser = null;
		hashHistory.push('/');
	}




	render () {

		let { events } = this.state;
		console.log(events)
		return (
			<div className="itinerary-wrapper">
				<button onClick={this.logOutHandler}>Log Out</button>
				<h2>Your Roadtrip</h2>
				<div className="body">
					<div>
					{events.map(::this.getEvent)}
					</div>
					<div id="map"></div>
					<Link to="/start-trip">Start Over</Link>
				</div>
			</div>



			)
		}

}






