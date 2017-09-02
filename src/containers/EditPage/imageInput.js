import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ImageInput extends Component {
	static propTypes = {
		label: PropTypes.string,
		name: PropTypes.string,
		imageURL: PropTypes.string,
		value: PropTypes.string,
		onInputChange: PropTypes.func.isRequired,
	}

	static defaultProps = {
		label: '',
		name: '',
		imageURL: '',
		value: '',
	}

	render() {
		const {
			label,
			name,
			imageURL,
			value,
			onInputChange,
		} = this.props;

		const labelValue = label || name;

		if (imageURL) {
			return <img src={imageURL} alt={imageURL} />;
		}

		return (
			<div>
				<label htmlFor="file">{labelValue}
					<input
						type="file"
						accept="image/*"
						value={value}
						onChange={onInputChange}
					/>
				</label>
			</div>
		);
	}
}

export default ImageInput;
