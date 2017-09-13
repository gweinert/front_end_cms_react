import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './input';
import Select from './select';

class Field extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		onFieldChange: PropTypes.func.isRequired,
		name: PropTypes.string.isRequired,
		value: PropTypes.string,
		label: PropTypes.string,
		options: PropTypes.arrayOf(PropTypes.string),
	}

	static defaultProps = {
		component: 'input',
		value: '',
		label: '',
		options: [],
	}

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		const { name, onFieldChange } = this.props;
		let value = '';

		switch (e.type) {
		case 'blurb':
			value = e.body;
			break;
		case 'link':
			value = `${e.linkPath}:${e.linkText}`;
			break;
		default:
			value = e.target.value;
		}

		const fieldInfo = {
			name,
			value,
		};
		onFieldChange(fieldInfo);
	}

	render() {
		const { component, value, className, label, name, options } = this.props;
		const WrappedComponent = component;
		const labelVal = label || name;
		switch (component) {
		case 'input':
			return (
				<Input
					label={labelVal}
					className="field"
					onChange={this.onChange}
					value={value}
					{...this.props}
				/>
			);
		case 'select':
			return (
				<Select
					label={labelVal}
					className="field"
					onChange={this.onChange}
					value={value}
					options={options}
					{...this.props}
				/>
			)
		default:
			return (
				<WrappedComponent
					className={`field ${className}`}
					onChange={this.onChange}
					value={value}
					{...this.props}
				/>
			);
		}
	}
}

export default Field;
