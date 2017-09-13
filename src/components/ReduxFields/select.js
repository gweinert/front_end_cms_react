import React from 'react';
import PropTypes from 'prop-types';

const Select = props => (
	<div id={props.id} className={props.className}>
		<label htmlFor="Title">{props.label}
			<select
				id={`${props.id}_input`}
				value={props.value}
				onChange={props.onChange}
				{...props.input}
			>
				{props.options.map(option => (
					<option key={option} value={option}>{option}</option>
				))}
			</select>
			{props.meta && props.meta.touched && props.meta.error &&
				<span className="error">{props.meta.error}</span>}
		</label>
	</div>
);

Select.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	body: PropTypes.string,
	value: PropTypes.string,
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	className: PropTypes.string,
	options: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func.isRequired,
};

Select.defaultProps = {
	label: '',
	name: '',
	body: '',
	value: '',
	className: '',
	options: [],
};

export default Select;
