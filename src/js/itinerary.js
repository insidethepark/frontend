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

		////code below uses the seatgeek API to access the games
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


		  	////code below uses Moment.js to iterate the date by one day. We now use the backend to accomplish this.

			// let date = data.pitstop_dates[data.pitstop_dates.length-1];
			// let tomorrow = moment(date).add(1, 'day');

			// let tomorrowFormat = tomorrow._d;

			// let finalCheckoutDay = moment(tomorrowFormat).format('YYYY-MM-DD');
			// console.log("finalco", finalCheckoutDay);

		  	this.setState({events: data.seatgeek.events, pitstop_dates: data.pitstop_dates});
		  	

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

			let addresses = route.map(a => a.venue.address+ " " + a.venue.extended_address);

			let waypts=[];


			addresses.forEach( location => waypts.push({location, stopover:true}));

			
			let startAddress = waypts.shift();
			
			let endAddress = waypts.pop();
			
			
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
			
		 

			directionsDisplay.setMap(map);



		    directionsService.route({
		          origin: startAddress.location,
		          destination: endAddress.location,
		          waypoints: waypts,
		          optimizeWaypoints: false,
		          travelMode: google.maps.TravelMode.DRIVING
		        }, function(response, status) {
		          if (status === google.maps.DirectionsStatus.OK) {
		            directionsDisplay.setDirections(response);
		            var route = response.routes[0];
		            let distanceTraveled = 0;
		            for (var i = 0; i < route.legs.length; i++) {
		              var routeSegment = i + 1;

		              console.log("route.legs[i].distance",route.legs[i].distance.value);

		              distanceTraveled += route.legs[i].distance.value;
		            }

		            console.log("distanceTraveled", Math.round(distanceTraveled*0.0006021371));

		            document.querySelector('#miles').innerHTML = Math.round(distanceTraveled*0.0006021371);

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


	 getEvent(event, index) {

	 	console.log("this", this);

	 	let itinerary = this.state.events;
	 	let pitstop_dates = this.state.pitstop_dates;

	 	if (index !== itinerary.length-1){

	 		console.log("city", itinerary[index].venue.city + " " + itinerary[index+1].venue.city);
			console.log("itinerary[0]", airportCodes[itinerary[index].venue.city] + " " + airportCodes[itinerary[index+1].venue.city]);

	 	}

	 	function getFlightURL(){

	 		if (index !== itinerary.length-1){


	 			return `https://www.skyscanner.com/transport/flights/${airportCodes[itinerary[index].venue.city]}/${airportCodes[itinerary[index+1].venue.city]}/${pitstop_dates[0][index+1]}`;

		 	}else{

		 		return `https://www.skyscanner.com/transport/flights/${airportCodes[itinerary[index].venue.city]}/${pitstop_dates[1]}`;


		 	}

	 	}

	 	function getHotelURL(finalco){

	 		if (index !== itinerary.length-1){

	 			return `https://www.skyscanner.com/hotels?q=${itinerary[index].venue.city}%2C+${itinerary[index].venue.state}&sd=${pitstop_dates[0][index]}&ed=${pitstop_dates[0][index+1]}`;

		 	}else{

		 		return `https://www.skyscanner.com/hotels?q=${itinerary[index].venue.city}%2C+${itinerary[index].venue.state}&sd=${pitstop_dates[0][index]}&ed=${pitstop_dates[1]}`;
		 		// https://www.skyscanner.com/hotels?q=${itinerary[index].venue.city},%2C+${itinerary[index].venue.state}&sd=${pitstop_dates[0][index]}&ed=${pitstop_dates[0][index+1]}
		 	}


	 	}

	 	function getRentalCarURL(){

	 		if (index !== itinerary.length-1){


				return `https://www.skyscanner.com/car-rental?pick_up=${airportCodes[itinerary[index].venue.city]}&drop_off=${airportCodes[itinerary[index].venue.city]}&pick_up_date=${pitstop_dates[0][index]}&drop_off_date=${pitstop_dates[0][index+1]}`;


	 		}else{

	 			return `https://www.skyscanner.com/car-rental?pick_up=${airportCodes[itinerary[index].venue.city]}&drop_off=${airportCodes[itinerary[index].venue.city]}&pick_up_date=${pitstop_dates[0][index]}&drop_off_date=${pitstop_dates[1]}`;

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

	 	let gametime = event.datetime_local;
	 	let tickets = event.url;

	 	
		let img;

		if(event.performers[0].home_team === true){

		 	img = event.performers[0].image;
		}else{

			img = event.performers[1].image;
		}

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
	 					<div>
		 					<a href={`https://www.google.com/maps/search/${event.venue.city}+restaurants+close+to+${event.venue.slug}`} target="_blank"><button>Food</button></a>
		 					<a href={`https://www.google.com/maps/search/${event.venue.city}+attractions`} target="_blank"><button>Attractions</button></a>
	 					</div>
 					</div>
 					<h1>Travel and Lodging</h1>	
 					<div className="local-city-data">
	 					<div>
	 						<a href={getHotelURL()} target="_blank"><button>Hotels</button></a>

 							<a href={getFlightURL()} target="_blank"><button>Flights to next city</button></a>

 							<a href={getRentalCarURL()} target="_blank"><button>Rent a car</button></a>
 						</div>
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
					<h1 id="title">Inside the Park</h1>
					<i onClick={this.logOutHandler} className="fa fa-sign-out" aria-hidden="true"><span className='icon-label'> Log Out</span></i>
					<Link to="/start-trip"><i className="fa fa-home" aria-hidden="true"> <span className="icon-label">Start Over</span></i></Link>
				</header>
				<div className="itinerary-main">
					<div className="itinerary-title">
					<h2>Your Roadtrip</h2>

					</div>
					<h2>Baseball. Roadtrip. <span id="america">America</span>.</h2>
					<div className="itenerary-body">
						<div className="events-wrapper">
						{events.map(::this.getEvent)}
						</div>
						<div className="trip-summary"><h2>{events.length} parks. <span id="miles"></span> miles. 1 damn good time.</h2></div>
						<div id="map"></div>
					</div>
				</div>
			</div>
			)
		}
}
	




