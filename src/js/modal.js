import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory, Link } from 'react-router';
import { ajax } from 'jquery';

export default class Modal extends Component{

	constructor (...args) {
		super (...args);
		this.state = { 
			loading: true,
			hotels: [],
			hotelLoading: true
		}
	}

	componentWillMount(){

	 	var map;
	 	// var geocoder;
		var service;
		var infowindow;

		function initialize() {
			console.log(this.props.location.lat);
		  // var pyrmont = new google.maps.LatLng(this.props.location.lat, this.props.location.lon);
		  var pyrmont = new google.maps.LatLng(33.862100, -84.687900);
		  console.log("pyrmont", pyrmont);
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

		  	console.log("restaurant", results);
		  		
		  		if (status == google.maps.places.PlacesServiceStatus.OK) {
					
					
					let foodArray =[];
				    for (var i = 0; i < 5; i++) {
				    	foodArray.push(results[i].name);

				      // var place = results[i];
				      // createMarker(results[i]);
				    }
				    this.foodArray = foodArray;
				    this.setState({loading: false});
				    console.log(this.foodArray);
				    
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
		  		
		  		if (status == google.maps.places.PlacesServiceStatus.OK) {
					
					let hotelArray =[];
				    for (var i = 0; i < 5; i++) {
				    	hotelArray.push(results[i].name);

				      // var place = results[i];
				      // createMarker(results[i]);
				    }
				    this.hotelArray = hotelArray;

				    this.setState({hotels: hotelArray});

				    this.setState({hotelLoading: false});
				    console.log(this.hotelArray);
				    
				}

		  });

	}

	let initializeWithThis = initialize.bind(this);

		initializeWithThis();

}

	getFood(){ 
		console.log("get food ran");
		return this.foodArray.map(food => <li key={food}>{food}</li>);
		// return this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>

		// return setTimeout(function(){
			
		// 	let foods = this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>
		// 	return foods;
		// }, 2000);	

	}

	getFoodLoading(){

		console.log("get food loading");
		return <li>loading...</li>;

	}

	getHotels(){ 
		console.log("get hotels ran");

		return this.hotelArray.map(hotel => <li key={hotel}>{hotel}</li>);

		// return this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>

		// return setTimeout(function(){
			
		// 	let foods = this.foodArray ? <li>it's loaded</li> : <li>Loading...</li>
		// 	return foods;
		// }, 2000);	

	}

	getHotelsLoading(){

		console.log("get hotel loading");
		return <li>loading...</li>;

	}

	render(){
		let { hotelLoading, loading, hotels } = this.state;

		return(
			<div>

				<ul>{this.props.location.lat}</ul>
				<ul>{hotels.map(hotel => <li>hotel</li>)}</ul>
				<ul>{ hotelLoading ? ::this.getHotelsLoading(): ::this.getHotels() }</ul>
				<ul>{ loading ? ::this.getFoodLoading(): ::this.getFood()}</ul>
				<div id="mapTest"></div>

			</div>

			);

	}

}