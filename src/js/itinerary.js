import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import { ajax } from 'jquery';
import Cookies from 'js-cookie';
import StartTrip from './start-trip';
import moment from 'moment';

import Modal from './modal';
import airportCodes from './airport-codes';



export default class Itinerary extends Component {
	constructor (...args) {
		super (...args);
		this.state = { 
			events: [] ,
			loading: true,
			hotelLoading: true,
			distanceTraveled: 0,
			finalCheckoutDay: ""
		}
	}

	

	componentWillMount() {

		if (Cookies.get('user_email', 'auth_token', 'id')) {
		// ajax('https://api.seatgeek.com/2/events?datetime_local.gte=2016-05-28&datetime_local.lte=2016-05-28T23:59:01&type=mlb&per_page=9').then(data => {
		// this.setState({events: data.events});

		console.log("itin ID",Cookies.get('itinerary_id'));

		ajax({
		  	url:'https://shielded-hollows-39012.herokuapp.com/itinerary',
		  	type: 'POST',
		  	data: {"itinerary_id": Cookies.get('itinerary_id')},
		  	headers: {
		  		'X-Auth-Token': Cookies.get('auth_token')
		  	}
		  }).then(data => {

			// let date = data.pitstop_dates[data.pitstop_dates.length-1];
			// let tomorrow = moment(date).add(1, 'day');

			// let tomorrowFormat = tomorrow._d;

			// let finalCheckoutDay = moment(tomorrowFormat).format('YYYY-MM-DD');
			// console.log("finalco", finalCheckoutDay);

		  	this.setState({events: data.seatgeek.events, pitstop_dates: data.pitstop_dates});
		  	console.log("data", data);

		  	

		  });

		} else {
			hashHistory.replace('/');
		}


		
	}

	componentDidUpdate(){

		::this.drawMap();

	}

	drawMap(){


			let route = this.state.events;

			// let waypts = route.map(a => a.venue.extended_address);

			// let addresses = route.map(a => {
			// 	a.venue.address + " " + a.venue.extended_address;
			// });
			let addresses = route.map(a => a.venue.address+ " " + a.venue.extended_address);

			let waypts=[];


			addresses.forEach( location => waypts.push({location, stopover:true}));

			
			let startAddress = waypts.shift();
			
			let endAddress = waypts.pop();
			

			// console.log("google in comp did mount", google);
			
			var directionsService = new google.maps.DirectionsService;
    		var directionsDisplay = new google.maps.DirectionsRenderer;
		    var mapDiv = document.getElementById('map');
		    var map = new google.maps.Map(mapDiv, {
		      center: {lat: 44.540, lng: -78.546},
		      zoom: 8,
		      styles: [
	{
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 33
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2e5d4"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5dac6"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#c5c6c6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e4d7c6"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fbfaf7"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#acbcc9"
            }
        ]
    }
]
		    });

		    let mapProps = {

		    	mapProps: {
			      center: {lat: 44.540, lng: -78.546},
			      zoom: 8,
			      
	
			    }
			}

		    //var map = new google.maps.Map(mapDiv, mapProps);
		 

			directionsDisplay.setMap(map);


		    directionsService.route({
		          origin: startAddress.location,
		          destination: endAddress.location,
		          waypoints: waypts,
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

		              // let distanceTraveled = this.state.distanceTraveled;
		              // distanceTraveled += route.legs[i].distance;

		              // this.setState({distanceTraveled});

		              // this.distanceTraveled = this.distanceTraveled + route.legs[i].distance;
		            }

		            // console.log("distanceTraveled", distanceTraveled);

		          } else {
		            window.alert('Directions request failed due to ' + status);
		          }
		        });

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

	getFood(){ 
		return this.foodArray.map(food => <li>{food}</li>);
		// return this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>

		// return setTimeout(function(){
			
		// 	let foods = this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>
		// 	return foods;
		// }, 2000);	

	}

	getFoodLoading(){

		return <li>loading worked</li>;

	}

	getHotels(name){ 
		// return this.hotelArray.map(hotel => <li>{hotel}</li>);
		return name;
		// return this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>

		// return setTimeout(function(){
			
		// 	let foods = this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>
		// 	return foods;
		// }, 2000);	

	}

	getHotelsLoading(){

		return <li>loading worked</li>;

	}

	 getEvent(event, index) {

	 	console.log("this", this);

	 	let itinerary = this.state.events;
	 	let pitstop_dates = this.state.pitstop_dates;

	 	// console.log("itinerary[New York]", airportCodes[`Saint Petersburg`]);

	 	if (index !== itinerary.length-1){

	 		console.log("city", itinerary[index].venue.city + " " + itinerary[index+1].venue.city);
			console.log("itinerary[0]", airportCodes[itinerary[index].venue.city] + " " + airportCodes[itinerary[index+1].venue.city]);

	 	}

	 	function getFlightURL(){

	 		if (index !== itinerary.length-1){

	 			return `https://www.skyscanner.com/transport/flights/${airportCodes[itinerary[index].venue.city]}/${airportCodes[itinerary[index+1].venue.city]}/${pitstop_dates[0][index+1]}`;

		 	}else{

		 		return `https://www.skyscanner.com/transport/flights/${airportCodes[itinerary[index].venue.city]}/${pitstop_dates[1][index]}`;

		 	}

	 	}

	 	function getHotelURL(finalco){

	 	// 	console.log("pitstops", pitstop_dates);

			// let date = pitstop_dates[pitstop_dates.length-1];

			// let tomorrow = moment(date).add(1, 'day');

			// let tomorrowFormat = tomorrow._d;

			// let finalCheckoutDay = moment(tomorrowFormat).format('YYYY-MM-DD');
			// console.log("finalco", finalCheckoutDay);

	 		if (index !== itinerary.length-1){

	 			return `https://www.skyscanner.com/hotels?q=${itinerary[index].venue.city}%2C+${itinerary[index].venue.state}&sd=${pitstop_dates[0][index]}&ed=${pitstop_dates[0][index+1]}`;

		 	}else{

		 		return `https://www.skyscanner.com/hotels?q=${itinerary[index].venue.city}%2C+${itinerary[index].venue.state}&sd=${pitstop_dates[0][index]}&ed=${pitstop_dates[1]}`;
		 		// https://www.skyscanner.com/hotels?q=${itinerary[index].venue.city},%2C+${itinerary[index].venue.state}&sd=${pitstop_dates[0][index]}&ed=${pitstop_dates[0][index+1]}
		 	}


	 	}

	 	let address = event.venue.address + " " + event.venue.extended_address;

	 	var map;
	 	// var geocoder;
		var service;
		var infowindow;

		function initialize() {
		  var pyrmont = new google.maps.LatLng(event.venue.location.lat, event.venue.location.lon);
		  let creditNode = document.querySelector('#mapTest');
		  // geocoder = new google.maps.Geocoder();

		  // map = new google.maps.Map(document.getElementById('mapTest'), {
		  //     center: pyrmont,
		  //     zoom: 15
		  //   });

		  var request = {
		    location: pyrmont,
		    radius: '500',
		    query: 'restaurant'
		  };
		
			// function Pitstop(hotel, food, attraction) {
			// 	this.hotel= #
			// 	this.food= #
			// 	this.attraction= #
			// }

		  service = new google.maps.places.PlacesService(creditNode);
		  // service.textSearch(request, callback);
		  service.textSearch(request, (results, status) => {
		  		
		  		if (status == google.maps.places.PlacesServiceStatus.OK) {
					
					
					let foodArray =[];
				    for (var i = 0; i < 5; i++) {
				    	foodArray.push(results[i].name);

				      // var place = results[i];
				      // createMarker(results[i]);
				    }
				    this.foodArray = foodArray;
				    this.setState({loading: false});
				    // console.log(this.foodArray);
				    
				}

		  });

		  var request = {
		    location: pyrmont,
		    radius: '500',
		    query: 'hotel'
		  };

		  service = new google.maps.places.PlacesService(creditNode);
		  // service.textSearch(request, callback);
		  service.textSearch(request, (results, status) => {
		  	console.log("restaurant on itin", results);
		  		
		  		if (status == google.maps.places.PlacesServiceStatus.OK) {
					
					let hotelArray =[];
				    for (var i = 0; i < 5; i++) {
				    	hotelArray.push(results[i].name);

				      // var place = results[i];
				      // createMarker(results[i]);
				    }
				    this.hotelArray = hotelArray;
				    this.setState({hotelLoading: false});
				    // console.log(this.hotelArray);
				    
				}

		  });


		};

		let initWithThis = initialize.bind(this);

		// initWithThis();

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

		// getFood(){ return this.foodArray==="stuff" ? "<li>it's loaded</li>" : <li>Loading...</li>}
	 	let { loading } = this.state;
	 	let { hotelLoading } = this.state;

	 	return ( 
	 			<div key={event.title} className="itinerary-event">
	 			<div className="itinerary-inner-event">
	 				<h2>{moment(gametime).format('dddd, MMMM Do YYYY')} in {event.venue.city}</h2>
	 				<img src={img}/>
	 				<div>{event.title}</div>
	 				<div>Price Range: ${event.stats.lowest_price} to ${event.stats.highest_price}</div>
	 				<div>Average price: ${event.stats.average_price}</div>
	 				<div>Tickets Remaing: {event.stats.listing_count}</div>
					<div><a href={tickets} target="_blank"><button><i className="fa fa-ticket" aria-hidden="true"></i>Tickets!!</button></a></div>
	 				<div>{moment(gametime).format('dddd, MMMM Do YYYY')}</div>
					<div className="itinerary-divider"><h1>Explore {event.venue.city}</h1></div>
 					<div className="local-city-data">
	 					
	 					<div><a href={`https://www.google.com/maps/search/${event.venue.city}+restaurants+close+to+${event.venue.slug}`} target="_blank"><button>Food</button></a></div>
	 					<div><a href={`https://www.google.com/maps/search/${event.venue.city}+attractions`} target="_blank"><button>Attractions</button></a></div>
 					</div>
 					<h1>Flights and Hotels</h1>
 					<div className="local-city-data">
	 					
	 					<div><a href={getHotelURL()} target="_blank"><button>Hotels</button></a></div>

 						<div><a href={getFlightURL()} target="_blank"><button>Flights to next city</button></a></div>
 					</div>
 				</div>
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
		return (
			<div className="itinerary-wrapper">
				<header>
					<i onClick={this.logOutHandler} className="fa fa-sign-out" aria-hidden="true"><span className='icon-label'> Log Out</span></i>
					<Link to="/start-trip"><i className="fa fa-home" aria-hidden="true"> <span className="icon-label">Start Over</span></i></Link>
				</header>
				<div className="itinerary-main">
					<div className="itinerary-title">
					<h2>Your Roadtrip</h2>
					</div>
					<h3>{events.length} days, {events.length} parks, 1 damn good time...</h3>
					<div className="itenerary-body">
						<div className="events-wrapper">
						{events.map(::this.getEvent)}
						</div>
						<div id="map"></div>
						<div id="directions-panel"></div>
					</div>
				</div>
			</div>
			)
		}
}


	//<div id="mapTest"></div>

// <div className="modal-content">
// 			 					<div>
// 			 						<h3>Hotels</h3>
// 			 						<ul>
// 				 						<li>hotel name</li>
// 				 						<li>rating</li>
// 				 						<li>URL</li>
// 				 						<li>google map</li>
// 				 						<li>distance from ballpark</li>
// 				 						{ hotelLoading ? ::this.getHotelsLoading(): ::this.getHotels(event.venue.city) }
// 				 						<Modal location={{lat: event.venue.location.lat, lon:event.venue.location.lon}}></Modal>
// 			 						</ul>
// 			 					</div>
// 			 					<div>
// 			 						<h3>Food</h3>
// 			 						<ul>
// 				 						{ loading ? ::this.getFoodLoading(): ::this.getFood()}
// 			 						</ul>
// 			 					</div>
// 			 					<div>
// 			 						<h3>Attractions</h3>
// 			 						<ul>
// 				 						<li>hotel name</li>
// 				 						<li>rating</li>
// 				 						<li>URL</li>
// 				 						<li>google map</li>
// 				 						<li>distance from ballpark</li>
// 			 						</ul>
// 			 					</div>
// 		 					</div>



