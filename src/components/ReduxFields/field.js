import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Field extends Component {
	static propTypes = {
		component: PropTypes.node.isRequired,
		onFieldChange: PropTypes.func,
		name: PropTypes.string.isRequired,
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
		// console.log("fieldIfo field", fieldInfo);
		onFieldChange(fieldInfo);
	}

	render() {
		const { component, value } = this.props;
		const WrappedComponent = component;
		// console.log("field", this.props);
		return (
			<WrappedComponent
				onChange={this.onChange}
				value={value}
				{...this.props}
			/>
		);
	}
}

export default Field;
