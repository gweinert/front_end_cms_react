import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from './input';

class Field extends Component {
	static propTypes = {
		component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
		onFieldChange: PropTypes.func.isRequired,
		name: PropTypes.string.isRequired,
		value: PropTypes.string,
	}

	static defaultProps = {
		component: 'input',
		value: '',
	}

	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		const { name, onFieldChange } = this.props;
		let value = '';

		if (e.target) {
			value = e.target.value;
		} else if (e.type === 'blurb') {
			value = e.body;
		}

		const fieldInfo = {
			name,
			value,
		};
		onFieldChange(fieldInfo);
	}

	render() {
		const { component, value } = this.props;
		const WrappedComponent = component;
		switch (component) {
		case 'input':
			return (
				<Input
					className="field"
					onChange={this.onChange}
					value={value}
					{...this.props}
				/>
			);
		default:
			return (
				<WrappedComponent
					className="field"
					onChange={this.onChange}
					value={value}
					{...this.props}
				/>
			);
		}
	}
}

export default Field;
