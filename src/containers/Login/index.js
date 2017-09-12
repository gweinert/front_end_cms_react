import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import md5 from 'blueimp-md5';
import {
	login,
} from '../../actions';

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

	componentDidMount() {

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
			<div>
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
					<input type="submit" value="submit" />
				</form>
			</div>
		);
	}
}


export default Login;

