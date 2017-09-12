import React from 'react';
import PropTypes from 'prop-types';

const Input = props => (
	<div id={props.id} className={props.className}>
		<label htmlFor={props.name}>{props.label}
			<input
				id={`${props.id}_input`}
				value={props.value}
				onChange={props.onChange}
				type="text"
				{...props.input}
			/>
			{props.meta && props.meta.touched && props.meta.error &&
				<span className="error">{props.meta.error}</span>}
		</label>
	</div>
);

Input.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	name: PropTypes.string,
	body: PropTypes.string,
	value: PropTypes.string,
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	onChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
	className: '',
	label: '',
	name: '',
	body: '',
	value: '',
	id: '',
};

export default Input;