import React from 'react';
import PropTypes from 'prop-types';
import './flash.css';

const Flash = (props) => {
	const { error, success } = props;
	const showSuccess = success !== '' ? 'show-success' : '';
	const showError = error !== '' ? 'show-error' : '';
	let message = '';
	if (success !== '') {
		message = success;
	} else if (error !== '') {
		message = error;
	}

	return (
		<p className={`flash ${showSuccess} ${showError}`}>{message}</p>
	);
};

Flash.propTypes = {
	error: PropTypes.string,
	success: PropTypes.string,
};

Flash.defaultProps = {
	error: '',
	success: '',
};

export default Flash;
