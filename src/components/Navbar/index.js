import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => (
	<nav className={'navbar'}>
		<Link to="/" className={'link'}><h3>CMS</h3></Link>
	</nav>
);

export default Navbar;
