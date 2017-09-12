import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ user }) => (
	<nav className={'navbar'}>
		<div>
			<Link to="/" className={'link'}><h3>CMS</h3></Link>
		</div>
		<div>
			<h3>Hello, {user.data.firstName}</h3>
		</div>
	</nav>
);

Navbar.propTypes = {
	user: PropTypes.object.isRequired,
};

export default Navbar;
