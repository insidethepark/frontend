import React, { Component } from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import DatePicker from 'material-ui/lib/date-picker/date-picker';
import ReactDatePicker from 'react-date-picker';
// require('react-date-picker/base.css');


export default class StartTrip extends Component{


	render(){

		return(

			<div>
				<ReactDatePicker />
			</div>
			);

	}
}