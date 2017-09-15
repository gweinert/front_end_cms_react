import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import md5 from 'blueimp-md5';
import {
	login,
} from '../../actions';
import './login.css';

class Login extends Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}


	onSubmit(e) {
		const { dispatch } = this.props;
		const { email, password } = this.state;
		const hash = md5(password);
		e.preventDefault();
		const creds = { email, hash };
		dispatch(login(creds));
	}

	onChange(e) {
		this.setState({ [e.target.getAttribute('name')]: e.target.value });
	}

	render() {
		return (
			<div className="login">
				<h2>Login</h2>
				<form
					onSubmit={this.onSubmit}
				>
					<label htmlFor="email"><span>email:</span>
						<input
							name="email"
							type="text"
							value={this.state.email}
							onChange={this.onChange}
						/>
					</label>
					<label htmlFor="name"><span>password:</span>
						<input
							name="password"
							type="password"
							value={this.state.password}
							onChange={this.onChange}
						/>
					</label>
					<div className="button-container">
						<input type="submit" value="Login" />
					</div>
				</form>
			</div>
		);
	}
}


export default Login;

