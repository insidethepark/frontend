import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import $, { ajax } from 'jquery';
window.$ = $;

import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ReactDatePicker from 'react-date-picker';
import Cookies from 'js-cookie';
import SSF from 'react-simple-serial-form';
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
			totalPitStops: 0,
			start_address: []

		}

		this.action = null;

	}
	componentWillMount() {
		if (Cookies.get('user_email', 'auth_token', 'id')) {
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

		ajax({
			url:'https://shielded-hollows-39012.herokuapp.com/firstgame',
			type: 'POST',
			data: {'local_datetime': dateString},
			headers: {
				'X-Auth-Token': Cookies.get('auth_token')
			}
		}).then(data => {

			data.events.map(event => {

			this.setState({citiesWithGames: data.events});

		})});

		// let URL = `https://api.seatgeek.com/2/events?datetime_local.gte=${dateString}&datetime_local.lte=${dateString}T23:59:01&type=mlb&per_page=15`;
		let citiesWithGames = [];

		// ajax(URL).then( data => {

		// 	data.events.map(event => {

		// 	citiesWithGames.push(event.venue.city);

		// 	});

		// 	this.setState({citiesWithGames});

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


	addGameHandler(zip){

		////ajax post request to send city zip to backend

		let local_datetime = this.state.startDate;

		console.log("zip", zip);
		console.log("zip.zip", zip.zip);
		console.log("date", local_datetime);

		ajax({
			url:'https://shielded-hollows-39012.herokuapp.com/nextgame',
			type: 'POST',
			data: {"local_datetime": local_datetime , "zip": zip },
			headers: {
				'X-Auth-Token': Cookies.get('auth_token')
			}
		}).then(data => {console.log("data", data)});

		///may recieve new list of cities back, may have to make get request for them

		

		ajax(`http://ziptasticapi.com/${zip}`).then(cityData => {

			let totalPitStops = this.state.totalPitStops + 1;

			this.setState({totalPitStops});

			let route = this.state.waypts;

			console.log(cityData);

			if (totalPitStops === 1){

				this.start_address = {location: cityData.city, stopover: true};

			}

			if (totalPitStops === 2){

				this.end_address = {location: cityData.city, stopover: true};

				this.drawMap();

			}

			if(totalPitStops >= 3){

				route.push(this.end_address);
				this.setState({waypts: route});
				this.end_address = {location: cityData.city, stopover: true};

				console.log("waypts=>",this.state.waypts);

				this.drawMap();

			}

		});


		
		

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

	}

	dataHandler(data) {

		this.action === 'add' ? this.addGameHandler(data): this.getIteneraryHandler(data);
		this.action = null;
	}

	logOutHandler() {
		Cookies.remove('user_email', 'auth_token', 'id');
		console.log('auth_token', Cookies.get('auth_token'));
		hashHistory.push('/');
	}


	render(){

		let { citiesWithGames } = this.state;

		let espn = 'espn';


		return(

			<div>

				<div>
					<button onClick={this.logOutHandler}>Log Out</button>
					<h2>Select date below to see that day's games!</h2>
					<ReactDatePicker onChange={::this.dateChangeHandler} hideFooter={true}/>

					<div id='game-picker'></div>
					<SSF onData={::this.dataHandler}>
						<div>
							
								{citiesWithGames.map(event => <div key={event.venue.postal_code}><label><input name="zip" type="radio" value={event.venue.postal_code} key={Math.random()}></input> {event.title}</label></div>)}
							
						</div>
						<div>
							 <button onClick={() => this.action = 'add'}>Add another game</button>
							 <button onClick={() => this.action = 'get'}>Get Itenerary</button>
							 {/*<input type="submit" value="Add Another Game" name="action"/>
							 <input type="submit" value="Get Itenerary" name="action"/>*/}
						</div>
					</SSF>
				</div>				
				
				
				<div id="map"></div>

			</div>
			);

	}
}

// startDate={moment()}
