import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withInputControl from '../../components/InputControl/inputControl';


class Blurb extends Component {
	static propTypes = {
		label: PropTypes.string,
		name: PropTypes.string,
		body: PropTypes.string,
		value: PropTypes.string,
		onInputChange: PropTypes.func.isRequired,
	}

	static defaultProps = {
		label: '',
		name: '',
		body: '',
		value: '',
		onInputChange: PropTypes.func.isRequired,
	}

	render() {
		const {
			label,
			name,
			body,
			value,
			onInputChange,
		} = this.props;

		const inputValue = value || body;
		const labelValue = label || name;

		return (
			<div>
				<label htmlFor="blurb">{labelValue}
					<textarea
						id="blurb"
						value={inputValue}
						onChange={onInputChange}
					/>
				</label>
			</div>
		);
	}
}

export default withInputControl(Blurb);
