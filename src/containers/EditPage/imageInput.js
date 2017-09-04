import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withInputControl from '../../components/InputControl/inputControl';


class ImageInput extends Component {
	static propTypes = {
		label: PropTypes.string,
		name: PropTypes.string,
		imageURL: PropTypes.string,
		value: PropTypes.string,
		id: PropTypes.string,
		className: PropTypes.string,
		onInputChange: PropTypes.func.isRequired,
	}

	static defaultProps = {
		label: '',
		name: '',
		imageURL: '',
		value: '',
		id: '0',
		className: '',
	}

	render() {
		const {
			label,
			name,
			imageURL,
			value,
			id,
			className,
			onInputChange,
		} = this.props;

		const labelValue = label || name;

		if (imageURL) {
			return <img src={imageURL} alt={imageURL} />;
		}

		return (
			<div id={id} className={className}>
				<label htmlFor="file">{labelValue}
					<input
						id={`${id}_file`}
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

export default withInputControl(ImageInput);
