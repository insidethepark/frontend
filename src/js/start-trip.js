import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import $, { ajax } from 'jquery';
window.$ = $;

import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ReactDatePicker from 'react-date-picker';
import Cookies from 'js-cookie';
import SSF from 'react-simple-serial-form';
import moment from 'moment';



export default class StartTrip extends Component{

	constructor(...args){
		super(...args)

		this.state = {

			citiesWithGames: [],
			startDate: "",
			mapProps: {},
			currentTrip: [],
			waypts: [],
			route: [],
			totalPitStops: 0,
			start_address: [],
			mapStyle: {}

		}

		this.action = null;

	}
	componentWillMount() {

		if (Cookies.get('user_email', 'auth_token')) {
			return true;
		} 	else {
			hashHistory.replace('/');
		}
	}

	renderNewGames(){

		let { startDate } = this.state;

		ajax({
			url:'https://shielded-hollows-39012.herokuapp.com/firstgamedata',
			type: 'POST',
			data: {'local_datetime': startDate},
			headers: {
				'X-Auth-Token': Cookies.get('auth_token')
			}
		}).then(data => {

			data.events.map(event => {

			this.setState({citiesWithGames: data.seatgeek.events});

		})});

	}

	dateChangeHandler(dateString) {

		document.querySelector('.games').classList.remove('hide');


		this.setState({startDate: dateString});

		////////THIS IS THE REAL SHIT BELOW 

		/////DO NOT DELETE


		 ajax({
		 	url:'https://shielded-hollows-39012.herokuapp.com/firstgame',
		 	type: 'POST',
		 	data: {'local_datetime': dateString},
		 	headers: {
		 		'X-Auth-Token': Cookies.get('auth_token')
		 	}
		 }).then(data => {
		 	Cookies.set('itinerary_id', data.itinerary);

		 	data.seatgeek.events.map(event => {


		 	this.setState({citiesWithGames: data.seatgeek.events});

		 })});

		////////DONT DELETE ABOVE

	}


	drawMap(){

			var directionsService = new google.maps.DirectionsService;
    		var directionsDisplay = new google.maps.DirectionsRenderer;
		    var mapDiv = document.getElementById('map');
		   

		    this.setState({

		    	mapProps: {
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

			    }
			})

		    var map = new google.maps.Map(mapDiv, this.state.mapProps);


			directionsDisplay.setMap(map);


		    var waypts = this.state.waypts;
		    let updatedWaypts;


		    directionsService.route({
		          origin: this.start_address.location,
		          destination: this.end_address.location,
		          waypoints: waypts,
		          optimizeWaypoints: false,
		          travelMode: google.maps.TravelMode.DRIVING
		        }, function(response, status) {
		          if (status === google.maps.DirectionsStatus.OK) {
		            directionsDisplay.setDirections(response);
		            var route = response.routes[0];
		            //var summaryPanel = document.getElementById('directions-panel');
		            //summaryPanel.innerHTML = '';
		            // For each route, display summary information.
		            for (var i = 0; i < route.legs.length; i++) {
		              var routeSegment = i + 1;
		            }
		          } else {
		            window.alert('Directions request failed due to ' + status);
		          }
		        });

	}

	

	addGameHandler(id){

		document.querySelector('.calendar').classList.add('calendar-hidden');
		document.querySelector('#show-calendar').classList.remove('show-calendar');


		let local_datetime = this.state.startDate;



		////////////UNCOMMENT TO TEST BACKEND DATA

		  ajax({
		  	url:'https://shielded-hollows-39012.herokuapp.com/selectgame',
		  	type: 'POST',
		  	data: {"local_datetime": local_datetime, "itinerary_id": Cookies.get('itinerary_id'), "game_number": id.id },
		  	headers: {
		  		'X-Auth-Token': Cookies.get('auth_token')
				  	}
		  }).then(data => {

		  	this.setState({citiesWithGames: [{id:1, title: "Loading..."}]});

		  ///////Below, send them the city/state data. Will need to make an ajax call first

		 ajax({
		 	url:'https://shielded-hollows-39012.herokuapp.com/nextgame',
		 	type: 'POST',
		 	data: {"itinerary_id": Cookies.get ('itinerary_id')},
		 	headers: {
		 		'X-Auth-Token': Cookies.get('auth_token')
		 	}
		 }).then(data => {
		 	this.setState({citiesWithGames: data.seatgeek.events, startDate: data.local_datetime})});

		 		//  data.events.map(event => {

		 		 
				 // citiesWithGames.push(event.venue.city);

				 // });


		 



		 });

		////////TURN ON THE STUFF ABOVE DO NOT DELETE

		

		ajax(`https://api.seatgeek.com/2/events?id=${id.id}`).then(data=>{

			let address = data.events[0].venue.address + " " + data.events[0].venue.extended_address;


			let totalPitStops = this.state.totalPitStops + 1;

			this.setState({totalPitStops});

			let route = this.state.route;
			route.push(data.events[0].venue.city);
			this.setState({route});

			


			if (totalPitStops === 1){

				console.log("i ran");

				this.start_address = {location: address, stopover: true};

				console.log(this.start_address);
				this.end_address = {location: address, stopover: true};
				console.log(this.end_address);

				this.drawMap();

			}

			if (totalPitStops === 2){

				this.end_address = {location: address, stopover: true};
				this.setState({mapStyle: {'border': '4px double grey'}});

				document.querySelector('#map').classList.remove('hide-map');

				this.drawMap();

			}

			if(totalPitStops >= 3){

				let waypts = this.state.waypts;

				waypts.push(this.end_address);
				this.setState({waypts});
				this.end_address = {location: address, stopover: true};

				this.drawMap();

			}

		});
				


	}
	testFunction() {
		ajax({
			url:'https://shielded-hollows-39012.herokuapp.com/firstgame',
			type: 'POST',
			data: {'local_datetime': '2016-04-28'},
			headers: {
				'X-Auth-Token': Cookies.get('auth_token')
			}
		}).then(data => {

			console.log("test function data",data);
			data.events.map(event => console.log(event.venue.city));

			this.setState({citiesWithGames: data.events});

		});
	}

	getIteneraryHandler(id){

		console.log(id);


		if(id.id){

			console.log("if ran");

			let local_datetime = this.state.startDate;

			ajax({
			  	url:'https://shielded-hollows-39012.herokuapp.com/selectgame',
			  	type: 'POST',
			  	data: {"local_datetime": local_datetime, "itinerary_id": Cookies.get('itinerary_id'), "game_number": id.id },
			  	headers: {
			  		'X-Auth-Token': Cookies.get('auth_token')
					  	}
			  }).then(() => { hashHistory.push('/itinerary')});

		}else{

			console.log("else ran");

			hashHistory.push('/itinerary');

		}

		

	}

	freeDayHandler(){

		console.log('free day added');

	}

	dataHandler(data) {

		// this.action === 'add' ? this.addGameHandler(data): this.getIteneraryHandler(data);

		// this.action === 'skip' ? this.freeDayHandler 

		switch (this.action){

			case 'add': 
				this.addGameHandler(data);
				break;
			case 'get':
				::this.getIteneraryHandler(data);
				// hashHistory.push('/itinerary');
				break;
			case 'skip':
				this.freeDayHandler();
				break;

		}
		this.action = null;
	}

	logOutHandler() {
		Cookies.remove('user_email', 'auth_token', 'id');
		hashHistory.push('/');
	}

	showCalendarHandler(){

		document.querySelector('.calendar').classList.remove('calendar-hidden');
		document.querySelector('#show-calendar').classList.add('show-calendar');
		document.querySelector('#map').classList.add('hide-map');

		this.setState({route: [], totalPitStops:0, waypts:[]});

		this.start_address = null;
		this.end_address = null;

	}


	render(){

		let { citiesWithGames, startDate } = this.state;

		let gameDate = function(){ return moment(startDate).format('dddd, MMMM Do YYYY') === "Invalid date" ? "Click calendar to see available games" :  moment(startDate).format('dddd, MMMM Do YYYY')}

		return(
			<div>
				<header>
					<Link to="/start-trip"><img src="https://files.slack.com/files-tmb/T066DB5HT-F18N9DGUU-b4eab1a12b/inside_logo_360.png"/></Link>
					<i onClick={this.logOutHandler} className="fa fa-sign-out" aria-hidden="true"><span className='icon-label'> Log Out</span></i>
				</header>
				<div className="start-trip-wrapper">
					<div className="calendar-map-wrapper">
						<div className="calendar">
							<h2>Select date below to see that day's games!</h2>
							<ReactDatePicker style={{"borderRadius": "5px", "boxShadow": "2px 2px 2px black"}} onChange={::this.dateChangeHandler} hideFooter={true}/>
							
						</div>
						<button id="show-calendar" className="show-calendar" onClick={::this.showCalendarHandler}>Reset</button>
						<div style={{"color": "#c7d4e5"}}>{this.state.route.join(' >> ')}</div>
						<div id="map" style={this.state.mapStyle}></div>
					</div>
					<div className="games hide">
						<div id="game-date">{gameDate()}</div>
						
						<div id='game-picker'></div>
						<SSF onData={::this.dataHandler}>
							<div className="game-choices">
								<button onClick={() => this.action = 'add'}>Add another game</button>
							<div className="get-itinerary">
								 <button onClick={() => this.action = 'get'}>Finalize Itinerary</button>
								 {/*<input type="submit" value="Add Another Game" name="action"/>
								 <input type="submit" value="Get Itenerary" name="action"/>*/}
							</div>
							</div>
							<div className="matchup-list">
								
									{citiesWithGames.map(event => <div key={event.id} className="matchups"><label><input name="id" type="radio" value={event.id} key={event.id}></input> {event.title} </label></div>)}
								
							</div>
						</SSF>
					</div>
				</div>				

			</div>
			);

	}
}

