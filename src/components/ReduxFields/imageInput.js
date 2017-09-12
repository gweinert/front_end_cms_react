import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } 			from 'react-redux';
import {
	uploadImageToCloud,
} from '../../actions';


class ImageInput extends Component {
	static propTypes = {
		label: PropTypes.string,
		name: PropTypes.string,
		body: PropTypes.string,
		value: PropTypes.string,
		className: PropTypes.string,
		pageId: PropTypes.number.isRequired,
		id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
		onChange: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired,
	};

	static defaultProps = {
		label: '',
		name: '',
		body: '',
		value: '',
		className: '',
	};

	constructor(props) {
		super(props);
		this.handleFile = this.handleFile.bind(this);
	}

	handleFile(e) {
		const { dispatch, id, pageId } = this.props;
		const reader = new FileReader();
		const file = e.target.files[0];

		// if temp id just make 0
		const elementId = typeof id === 'string' ? 0 : id;
		const tempId = typeof id === 'string' ? id : '';

		reader.onload = (upload) => {
			const imageData = {
				dataUri: upload.target.result,
				filename: file.name,
				filetype: file.type,
				elementId,
				tempId,
				pageId,
				sortOrder: this.props.sortOrder,
				groupId: this.props.groupId,
				groupSortOrder: this.props.groupSortOrder,
				name: this.props.name,

			};
			dispatch(uploadImageToCloud(imageData));
		};

		reader.readAsDataURL(file);
	}

	render() {
		const {
			id,
			label,
			className,
			name,
			value,
			imageURL,
			meta,
		} = this.props;

		const imgStyle = { backgroundImage: `url('${imageURL}')` };

		return (
			<div id={id} className={className}>
				<label htmlFor="ImageInput">{label}
					{imageURL ?
						<div
							className="img"
							style={imgStyle}
							alt={imageURL}
						/>
						:
						<div>
							<input
								id={`${id}_input`}
								type="file"
								accept="image/*"
								value={value}
								onChange={this.handleFile}
								// onChange={props.onChange}
							/>
							{meta && meta.touched && meta.error &&
								<span className="error">{meta.error}</span>}
						</div>
					}
				</label>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { form } = state;

	return {
		form,
	};
};

export default connect(mapStateToProps)(ImageInput);

// export default ImageInput;

