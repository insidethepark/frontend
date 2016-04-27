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
			mapProps: {},
			currentTrip: [],
			waypts: [],
			totalPitStops: 0,
			start_address: []

		}

		this.action = null;

	}

	dateChangeHandler(dateString){

		let URL = `https://api.seatgeek.com/2/events?datetime_local.gte=${dateString}&datetime_local.lte=${dateString}T23:59:01&type=mlb&per_page=15`;
		let citiesWithGames = [];

		ajax(URL).then( data => {

			data.events.map(event => {

			citiesWithGames.push(event.venue.city);

			});

			this.setState({citiesWithGames});

		});

	}

	// componentDidMount(){


	// 		console.log("google in comp did mount", google);

	// 		var directionsService = new google.maps.DirectionsService;
	// 	    var directionsDisplay = new google.maps.DirectionsRenderer;
	// 	    var mapDiv = document.getElementById('map2');
	// 	    var map = new google.maps.Map(mapDiv, {
	// 	      center: {lat: 44.540, lng: -78.546},
	// 	      zoom: 8
	// 	    });
	// 		console.log("the ajax call ran");

	// 	}

	///////////////map seems to be a bit buggy when incorporating state. May not matter if only displayed on the
	// next view but if it's on this page, may need to look into react google maps

	drawMap(){


			console.log("google in comp did mount", google);
			var directionsService = new google.maps.DirectionsService;
    		var directionsDisplay = new google.maps.DirectionsRenderer;
		    var mapDiv = document.getElementById('map2');
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
		var mapDiv = document.getElementById('map2');
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
		

		////post current city selection

		////get request for next day's games

		////update cities array in state

	}

	getIteneraryHandler(city){

		console.log("Itenerary fuck yeah!");

		console.log("city in getIteneraryHandler",city);

		if (city.city){

			let route = this.state.waypts;

			route.push(city.city);

			this.setState({waypts: route});

		}else{

			console.log("waypts=>",this.state.waypts);


			////render itenerary

		}

	}

	dataHandler(data) {
		console.log('action', this.action);

		this.action === 'add' ? this.addGameHandler(data): this.getIteneraryHandler(data);
		this.action = null;
		console.log('data', data);
	}

	logOutHandler() {
		Cookies.remove('user_email', 'auth_token', 'id');
		hashHistory.push('/');
	}


	render(){

		/////////need to think through what to do when chicago has two home games on the same day

		let { citiesWithGames } = this.state;


		////stexp 1: user selects first date

		////step 2: we display all games on that date

		////step 3: they select one (idea: might could use radio buttons to ensure they can only pick one game)

		////step 4: they click "add another game to roadtrip"

		////step 4.5: we add the selected game to a trip list

		////step 5: post request and recieve games for next day within certain range in response

		////step 6: display games

		////step 7: select one -- it's added to the trip list

		////step 8: if "add another game is clicked", repeat steps 5-7

		//// step final: user clicks "Get Trip Itenerary" and final screen is revealed, 
		////allowing them to see details about each game and even purchase tickets




		///////// change event state to an object so that it can hold things like zipcode. 
		///////// This allows us the ability to eliminate the Chicago key error and will enable us to attach and pass along any other data to the backend as needed



		return(

			<div>

				<div>
					<button onClick={this.logOutHandler}>Log Out</button>
					<ReactDatePicker onChange={::this.dateChangeHandler}/>
					<SSF onData={::this.dataHandler}>
						<div>
							
								{citiesWithGames.map(city => <div key={city}><label><input name="city" type="radio" value={city} key={Math.random()}></input> {city}</label></div>)}
							
						</div>
						<div>
							 <button onClick={() => this.action = 'add'}>Add another game</button>
							 <button onClick={() => this.action = 'get'}>Get Itenerary</button>
							 {/*<input type="submit" value="Add Another Game" name="action"/>
							 <input type="submit" value="Get Itenerary" name="action"/>*/}
						</div>
					</SSF>
				</div>				
				
				
				<div id="map2"></div>
				<div id="directions-panel"></div>
				<button onClick={::this.drawMap}>Generate map</button>
				<button onClick={::this.updateLocation}>update location</button>

			</div>
			);

	}
}
// Talk to JD about SSF
// A hacky way to do it is to create a function that tells which function (addGameHandler or getIteneraryHandler)
// to run and then reference THAT function in the onData

