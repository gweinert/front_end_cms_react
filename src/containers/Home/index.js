// @flow
import React, { Component } from 'react';

class Home extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		console.log('Home', this);
	}

	render() {
		return (
			<div>
				<h1>Home</h1>
			</div>
		);
	}
}

export default Home;
