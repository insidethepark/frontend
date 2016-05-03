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
		ajax('https://api.seatgeek.com/2/events?datetime_local.gte=2016-05-28&datetime_local.lte=2016-05-28T23:59:01&type=mlb&per_page=15').then(data => {
			console.log(data.events);
		this.setState({events: data.events});
		this.drawMap();

		})} else {
			hashHistory.replace('/');
		}

		ajax({
		  	url:'https://shielded-hollows-39012.herokuapp.com/itinerary',
		  	type: 'POST',
		  	headers: {
		  		'X-Auth-Token': Cookies.get('auth_token')
		  	}
		  }).then(data => {console.log("data", data)});

	}

	drawMap(){


			// console.log("google in comp did mount", google);
			console.log("google", google);
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

	modalHandler(){

		let modalClass = document.querySelector('#modal');
		let modalWrapperClass = document.querySelector('#modal-wrapper');

		modalClass.classList.remove("modal-default");
		modalWrapperClass.classList.remove("modal-default");

		modalClass.classList.add("modal");
		modalWrapperClass.classList.add("modal-wrapper");

	}

	closeModal(){

		let modalClass = document.querySelector('#modal');
		let modalWrapperClass = document.querySelector('#modal-wrapper');
		
		modalClass.classList.remove("modal");
		modalWrapperClass.classList.remove("modal-wrapper");
		
		modalClass.classList.add("modal-default");
		modalWrapperClass.classList.add("modal-default");

	}

	 getEvent(event) {

	 	let address = event.venue.address + " " + event.venue.extended_address;

	 	console.log("address", address);


	 	var map;
	 	var geocoder;
		var service;
		var infowindow;

		(function initialize() {
		  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);
		  geocoder = new google.maps.Geocoder();

		  map = new google.maps.Map(document.getElementById('mapTest'), {
		      center: pyrmont,
		      zoom: 15
		    });

		  var request = {
		    location: pyrmont,
		    radius: '500',
		    query: 'restaurant'
		  };

		  service = new google.maps.places.PlacesService(map);
		  service.textSearch(request, callback);
		}());


		function callback(results, status) {
		  if (status == google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		    	console.log('callback ran');
		    	console.log("results", results);
		      // var place = results[i];
		      // createMarker(results[i]);
		    }
		  }
		}

		function codeAddress() {
		    var address = document.getElementById("address").value;
		    geocoder.geocode( { 'address': address}, function(results, status) {
		      if (status == google.maps.GeocoderStatus.OK) {

		      	console.log("results to ");
		        map.setCenter(results[0].geometry.location);
		        var marker = new google.maps.Marker({
		            map: map,
		            position: results[0].geometry.location
		        });
		      } else {
		        alert("Geocode was not successful for the following reason: " + status);
		      }
		    });
		  }

	 	let gametime = event.datetime_local;
	 	let tickets = event.url;

	 	// let venueImg = event.performers.filter( team => return team.home_team);

	 	
		let img;

		if(event.performers[0].home_team === true){

		 	img = event.performers[0].image;
		}else{

			img = event.performers[1].image;
		}

		//////google places API to get local hotels, attractions, and food data
	 	

	 	return ( 
	 			<div key={event.title} className="itinerary-event">
	 				<h2>{moment(gametime).format('dddd, MMMM Do YYYY')} in {event.venue.city}</h2>
	 				<img src={img}/>
	 				<div>{event.title}</div>
	 				<div>Price Range: ${event.stats.lowest_price} to ${event.stats.highest_price}</div>
	 				<div>Average price: ${event.stats.average_price}</div>
	 				<div>Tickets Remaing: {event.stats.listing_count}</div>
					<div><a href={tickets}><button><i className="fa fa-ticket" aria-hidden="true"></i>Tickets!!</button></a></div>
	 				<div>{moment(gametime).format('dddd, MMMM Do YYYY')}</div>
	 				<div><i className="fa fa-plus" onClick={::this.modalHandler} aria-hidden="true"></i> See travel info (flights, car rentals, hotels)</div>
		 			<div id="modal-wrapper" className="modal-default" onClick={::this.closeModal}>	
		 				<div id="modal" className="modal-default">

		 					<i className="fa fa-times-circle" aria-hidden="true" onClick={::this.closeModal}></i>


		 					<h1>Travel Info for {event.venue.city}</h1>
		 					<div className="modal-content">
			 					<div>
			 						<h3>Hotels</h3>
			 						<ul>
				 						<li>hotel name</li>
				 						<li>rating</li>
				 						<li>URL</li>
				 						<li>google map</li>
				 						<li>distance from ballpark</li>
			 						</ul>
			 					</div>
			 					<div>
			 						<h3>Food</h3>
			 						<ul>
				 						<li>hotel name</li>
				 						<li>rating</li>
				 						<li>URL</li>
				 						<li>google map</li>
				 						<li>distance from ballpark</li>
			 						</ul>
			 					</div>
			 					<div>
			 						<h3>Attractions</h3>
			 						<ul>
				 						<li>hotel name</li>
				 						<li>rating</li>
				 						<li>URL</li>
				 						<li>google map</li>
				 						<li>distance from ballpark</li>
			 						</ul>
			 					</div>
		 					</div>

		 				</div>
		 			</div>
	 				<div><i className="fa fa-plus" aria-hidden="true"></i> See {event.venue.city} attractions</div>
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
				<header>
					<i onClick={this.logOutHandler} className="fa fa-sign-out" aria-hidden="true"><span className='icon-label'> Log Out</span></i>
					<Link to="/start-trip"><i className="fa fa-home" aria-hidden="true"> <span className="icon-label">Start Over</span></i></Link>
				</header>
				<div className="itinerary-main">
					<h2>Your Roadtrip</h2>
					<h4>{events.length} days, {events.length} parks, 1 damn good time</h4>
					<div className="itenerary-body">
						<div className="events-wrapper">
						{events.map(::this.getEvent)}
						</div>
						<div id="mapTest"></div>
						<div id="map"></div>
					</div>
				</div>
			</div>
			)
		}
}






