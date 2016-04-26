import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import $, { ajax } from 'jquery';
window.$ = $;

import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ReactDatePicker from 'react-date-picker';
import SSF from 'react-simple-serial-form';
// require('react-date-picker/base.css');


export default class StartTrip extends Component{

	constructor(...args){
		super(...args)

		this.state = {

			citiesWithGames: [],
			mapProps: {},
			currentTrip: []

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

		console.log("More games, muthafucka!");

		////post current city selection

		////get request for next day's games

		////update cities array in state

	}

	getIteneraryHandler(city){

		console.log("Itenerary fuck yeah!");

	}

	dataHandler(data) {
		console.log('action', this.action);
		this.action = null;
		console.log('data', data);
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


		return(

			<div>

				<div>
					<ReactDatePicker onChange={::this.dateChangeHandler}/>
					<SSF onData={::this.dataHandler}>
						<div>
							
								{citiesWithGames.map(city => <div key={Math.random()}><label><input name="cities" type="radio" value={city} key={Math.random()}></input> {city}</label></div>)}
							
						</div>
						<div>
							 <button onClick={() => this.action = 'add'}>Add another game</button>
							 <button onClick={() => this.action = 'get'}>Get Itenerary</button>
							 {/*<input type="submit" value="Add Another Game" name="action"/>
							 <input type="submit" value="Get Itenerary" name="action"/>*/}
						</div>
					</SSF>
				</div>
		

				<h2>Messing with map stuff below...</h2>
				<div id="map"></div>
				
				<div id="directions-panel"></div>
				<div id="map2"></div>
				<button onClick={::this.drawMap}>Generate map</button>
				<button onClick={::this.updateLocation}>update location</button>

			</div>
			);

	}
}

// Talk to JD about SSF
// A hacky way to do it is to create a function that tells which function (addGameHandler or getIteneraryHandler)
// to run and then reference THAT function in the onData

