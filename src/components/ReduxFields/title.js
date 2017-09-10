import React from 'react';
import PropTypes from 'prop-types';

const Title = (props) => {
	return (
		<div id={props.id} className={props.className}>
			<label htmlFor="Title">{props.label}
				<input
					id={`${props.id}_input`}
					value={props.value}
					onChange={props.onChange}
					{...props.input}
				/>
				{props.meta && props.meta.touched && props.meta.error &&
					<span className="error">{props.meta.error}</span>}
			</label>
		</div>
	);
};

Title.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	body: PropTypes.string,
	value: PropTypes.string,
	id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	className: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

Title.defaultProps = {
	label: '',
	name: '',
	body: '',
	value: '',
	className: '',
};

export default Title;


// class Title extends Component {
// 	static propTypes = {
// 		label: PropTypes.string,
// 		name: PropTypes.string,
// 		body: PropTypes.string,
// 		value: PropTypes.string,
// 		id: PropTypes.string,
// 		className: PropTypes.string,
// 		onInputChange: PropTypes.func.isRequired,
// 	}

// 	static defaultProps = {
// 		label: '',
// 		name: '',
// 		body: '',
// 		value: '',
// 		id: '0',
// 		className: '',
// 	}

// 	render() {
// 		const {
// 			label,
// 			name,
// 			body,
// 			value,
// 			id,
// 			className,
// 		} = this.props;

// 		const valInput = value || body;
// 		const labelValue = label || name;

// 		return (
// 			<div id={id} className={className}>
// 				<label htmlFor="Title">{labelValue}
// 					<input
// 						id={`${id}_input`}
// 						value={valInput}
// 						onChange={this.props.onInputChange}
// 					/>
// 				</label>
// 			</div>
// 		);
// 	}
// }

// // export default Title;
// export default withInputControl(Title);
