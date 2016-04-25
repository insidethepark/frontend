import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import { ajax } from 'jquery';

import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ReactDatePicker from 'react-date-picker';
// require('react-date-picker/base.css');


export default class StartTrip extends Component{

	constructor(...args){
		super(...args)

		this.state = {

			citiesWithGames: [],
			mapProps: {}

		}

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




	render(){

		/////////need to think through what to do when chicago has two home games on the same day

		let { citiesWithGames } = this.state;

		return(

			<div>

				<div>
					<ReactDatePicker onChange={::this.dateChangeHandler}/>

				<div>
					<select name="options"  onChange={::this.dateChangeHandler}>
					<option value="" disabled>Select a Date to see the cities</option>
						{citiesWithGames.map(city => <option value={city} key={city}>{city}</option>)}
					</select>
				</div>
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


//city => <li key={city}>{city}</li>)}

					//<ul>
						//{citiesWithGames.map(city => <li key={city}>{city}</li>)}


					//</ul>
