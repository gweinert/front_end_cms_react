import React from 'react';
import PropTypes from 'prop-types';
// import withInputControl from '../../components/InputControl/inputControl';

const Title = (field) => {
	return (
		<div id={field.id} className={field.className}>
			<label htmlFor="Title">{field.name}
				<input
					id={`${field.id}_input`}
					value={field.value}
					onChange={field.onChange}
					{...field.input}
				/>
				{field.meta && field.meta.touched && field.meta.error &&
					<span className="error">{field.meta.error}</span>}
			</label>
		</div>
	);
};

Title.propTypes = {
	label: PropTypes.string,
	name: PropTypes.string,
	body: PropTypes.string,
	value: PropTypes.string,
	id: PropTypes.string,
	className: PropTypes.string,
	onInputChange: PropTypes.func.isRequired,
};

Title.defaultProps = {
	label: '',
	name: '',
	body: '',
	value: '',
	id: '0',
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
