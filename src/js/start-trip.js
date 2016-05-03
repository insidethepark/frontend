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
// require('react-date-picker/base.css');


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
		console.log("startDate", startDate);

		ajax({
			url:'https://shielded-hollows-39012.herokuapp.com/firstgame',
			type: 'POST',
			data: {'local_datetime': startDate},
			headers: {
				'X-Auth-Token': Cookies.get('auth_token')
			}
		}).then(data => {

			data.events.map(event => {

			this.setState({citiesWithGames: data.events});

		})});

	}

	dateChangeHandler(dateString) {

		this.setState({startDate: dateString});

		////////THIS IS THE REAL SHIT BELOW 

		/////DO NOT DELETE


		 ajax({
		 	url:'https://shielded-hollows-39012.herokuapp.com/firstgamedata',
		 	type: 'POST',
		 	data: {'local_datetime': dateString},
		 	headers: {
		 		'X-Auth-Token': Cookies.get('auth_token')
		 	}
		 }).then(data => {

		 	data.events.map(event => {

		 	this.setState({citiesWithGames: data.events});

		 })});

		////////DONT DELETE ABOVE

		// let URL = `https://api.seatgeek.com/2/events?datetime_local.gte=${dateString}&datetime_local.lte=${dateString}T23:59:01&type=mlb&per_page=15`;
		// let citiesWithGames = [];

		// ajax(URL).then( data => {

		// 	console.log("data", data);

		// 	// data.events.map(event => {

		// 	// citiesWithGames.push(event.venue.city);

		// 	// });

		// 	this.setState({citiesWithGames: data.events});

		// })

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

		    console.log("waypts in drawMap", waypts);

		    directionsService.route({
		          origin: this.start_address.location,
		          destination: this.end_address.location,
		          waypoints: waypts,
		          optimizeWaypoints: true,
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
		             // summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
		                  //'</b><br>';
		              //summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
		              //summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
		              //summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
		            }
		          } else {
		            window.alert('Directions request failed due to ' + status);
		          }
		        });

	}

	// updateLocation(){

	// 	this.setState({

	// 	    	mapProps: {
	// 		      center: {lat: 50.540, lng: -50.546},
	// 		      zoom: 8
	// 		    }
	// 		})
	// 	var mapDiv = document.getElementById('map');
	// 	var map = new google.maps.Map(mapDiv, this.state.mapProps);

	// }


	addGameHandler(id){

		////ajax post request to send city zip to backend

		let local_datetime = this.state.startDate;

		console.log("id", id);
		// console.log("zip.zip", zip.zip);
		// console.log("date", local_datetime);


		////////////UNCOMMENT TO TEST BACKEND DATA


		  ajax({
		  	url:'https://shielded-hollows-39012.herokuapp.com/firstgame',
		  	type: 'POST',
		  	data: {"local_datetime": local_datetime , "game_number": id },
		  	headers: {
		  		'X-Auth-Token': Cookies.get('auth_token')
		  	}
		  }).then(data => {console.log("data", data)});

		  ///////Below, send them the city/state data. Will need to make an ajax call first

		 ajax({
		 	url:'https://shielded-hollows-39012.herokuapp.com/nextgamedata',
		 	type: 'POST',
		 	data: {"local_datetime": local_datetime , "game_number": id },
		 	headers: {
		 		'X-Auth-Token': Cookies.get('auth_token')
		 	}
		 }).then(data => {
		 	console.log("nextgamedata", data);

		 		//  data.events.map(event => {

		 		 
				 // citiesWithGames.push(event.venue.city);

				 // });

		 	this.setState({citiesWithGames: data.events});

		 



		 });

		//////////TURN ON THE STUFF ABOVE DO NOT DELETE

		///may recieve new list of cities back, may have to make get request for them

		

		// ajax(`http://ziptasticapi.com/${zip.zip}`).then(cityData => {

		ajax(`https://api.seatgeek.com/2/events?id=${id.id}`).then(data=>{

			let address = data.events[0].venue.address + " " + data.events[0].venue.extended_address;
			console.log("address=>", address);


			let totalPitStops = this.state.totalPitStops + 1;

			this.setState({totalPitStops});

			let route = this.state.route;
			route.push(data.events[0].venue.city);
			this.setState({route});
			console.log("route", route);


			if (totalPitStops === 1){

				this.start_address = {location: address, stopover: true};
				console.log("this.start_address", this.start_address);

			}

			if (totalPitStops === 2){

				this.end_address = {location: address, stopover: true};
				console.log("this.end_address", this.end_address);
				this.setState({mapStyle: {'border': '4px double grey'}});

				this.drawMap();

			}

			if(totalPitStops >= 3){

				let waypts = this.state.waypts;

				waypts.push(this.end_address);
				this.setState({waypts});
				this.end_address = {location: address, stopover: true};

				console.log("waypts=>",this.state.waypts);

				this.drawMap();

			}

		});

		// });

		// ajax(`http://geocoder.ca/?postal=${zip.zip}&geoit=xml&json=1`).then(cityData => {

			

			

			// if (totalPitStops === 1){

			// 	this.start_address = {location: cityData.standard.city, stopover: true};
			// 	console.log("this.start_address", this.start_address);

			// }

			// if (totalPitStops === 2){

			// 	this.end_address = {location: cityData.standard.city, stopover: true};
			// 	console.log("this.end_address", this.end_address);
			// 	this.setState({mapStyle: {'border': '4px double grey'}});

			// 	this.drawMap();

			// }

			


		
		

		////post current city selection

		////get request for next day's games

		////update cities array in state

	}
	// testFunction() {
	// 	ajax({
	// 		url:'https://shielded-hollows-39012.herokuapp.com/firstgame',
	// 		type: 'POST',
	// 		data: {'local_datetime': '2016-04-28'},
	// 		headers: {
	// 			'X-Auth-Token': Cookies.get('auth_token')
	// 		}
	// 	}).then(data => {

	// 		console.log(data);
	// 		data.events.map(event => console.log(event.venue.city));

	// 		this.setState({citiesWithGames: data.events});

	// 	});
	// }

	getIteneraryHandler(city){

		console.log("city in getIteneraryHandler",city);

		if (city.city){

			/////post the zip to the backend

			////hashHistory.push('/itinerary');

			let route = this.state.waypts;

			route.push(city.city);

			this.setState({waypts: route});

		}else{

			////hashHistory.push('/itinerary');

			console.log("waypts=>",this.state.waypts);

		}

		hashHistory.push('/itinerary');

	}

	freeDayHandler(){

		console.log('free day added');

	}

	dataHandler(data) {

		console.log(this.action);

		// this.action === 'add' ? this.addGameHandler(data): this.getIteneraryHandler(data);

		// this.action === 'skip' ? this.freeDayHandler 

		switch (this.action){

			case 'add': 
				this.addGameHandler(data);
				break;
			case 'get':
				this.getIteneraryHandler(data);
				break;
			case 'skip':
				this.freeDayHandler();
				break;

		}
		this.action = null;
	}

	logOutHandler() {
		Cookies.remove('user_email', 'auth_token', 'id');
		console.log('auth_token', Cookies.get('auth_token'));
		hashHistory.push('/');
	}


	render(){

		let { citiesWithGames, startDate } = this.state;

		let gameDate = function(){ return moment(startDate).format('dddd, MMMM Do YYYY') === "Invalid date" ? "Click calendar to see available games" :  moment(startDate).format('dddd, MMMM Do YYYY')}

		return(
			<div>
				<header>
					<i onClick={this.logOutHandler} className="fa fa-sign-out" aria-hidden="true"><span className='icon-label'> Log Out</span></i>
				</header>
				<div className="start-trip-wrapper">
					<div className="calendar">
						<h2>Select date below to see that day's games!</h2>
						<ReactDatePicker style={{"borderRadius": "5px", "box-shadow": "2px 2px 2px black"}} onChange={::this.dateChangeHandler} hideFooter={true}/>
						<div id="map" style={this.state.mapStyle}></div>
					</div>
					<div className="games">
						<div id="game-date">{gameDate()}</div>
						<div style={{"color": "#c7d4e5"}}>{this.state.route.join(' >> ')}</div>
						<div id='game-picker'></div>
						<SSF onData={::this.dataHandler}>
							<div className="game-choices">
								<button onClick={() => this.action = 'add'}>Add another game</button>
								<button onClick={() => this.action = 'skip'}>Add a free day</button>
							</div>
							<div>
								
									{citiesWithGames.map(event => <div key={event.id} className="matchups"><label><input name="id" type="radio" value={event.id} key={event.id}></input> {event.title} </label></div>)}
								
							</div>
							<div className="get-itinerary">
								 <button onClick={() => this.action = 'get'}>Finalize Itinerary</button>
								 {/*<input type="submit" value="Add Another Game" name="action"/>
								 <input type="submit" value="Get Itenerary" name="action"/>*/}
							</div>
						</SSF>
					</div>
				</div>				

			</div>
			);

	}
}

// startDate={moment()}
