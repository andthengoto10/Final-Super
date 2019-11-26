import React, { Component } from 'react';
import axios from 'axios';

class Confirmation extends Component {
	state = {
		msg: null,
		isVerified: false
	};
	componentDidMount() {
		axios.post(`/confirmation/${this.props.match.params.id}`).then((response) => {
			console.log(response);
			if (response.data.status === 'success') {
				this.setState({ msg: response.data.msg, isVerified: true });
			} else {
				this.setState({ msg: response.data.msg, isVerified: false });
			}
		});
	}
	loginHandler = () => {
		this.props.history.replace('/login');
	};
	registerHandler = () => {
		this.props.history.replace('/register');
	};
	render() {
		return (
			<div className="confirmation">
				<h3>{this.state.msg}</h3>
				{this.state.isVerified ? (
					<button onClick={this.loginHandler}>Go To Login</button>
				) : (
					<button onClick={this.registerHandler}>Go To Register</button>
				)}
			</div>
		);
	}
}

export default Confirmation;
