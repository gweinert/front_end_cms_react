import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withInputControl from '../../components/InputControl/inputControl';

class Title extends Component {
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
	}

	render() {
		const {
			label,
			name,
			body,
			value,
		} = this.props;

		const valInput = value || body;
		const labelValue = label || name;

		return (
			<div>
				<label htmlFor="Title">{labelValue}
					<input
						id="Title"
						value={valInput}
						onChange={this.props.onInputChange}
					/>
				</label>
			</div>
		);
	}
}

// export default Title;
export default withInputControl(Title);
