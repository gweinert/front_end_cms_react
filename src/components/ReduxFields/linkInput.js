import React, { Component } from 'react';
import PropTypes			from 'prop-types';
import withInputControl from '../../components/InputControl/inputControl';


class LinkInput extends Component {
	static propTypes = {
		label: PropTypes.string,
		name: PropTypes.string,
		linkPath: PropTypes.string,
		linkText: PropTypes.string,
		id: PropTypes.number,
		className: PropTypes.string,
		onChange: PropTypes.func.isRequired,
	}

	static defaultProps = {
		label: '',
		name: '',
		linkPath: '',
		linkText: '',
		id: 0,
		className: '',
	}

	constructor(props) {
		super(props);
		this.state = {
			path: props.linkPath,
			text: props.linkText,
		};
		this.onChangeLinkPathInput = this.onChangeLinkPathInput.bind(this);
		this.onChangeLinkTextInput = this.onChangeLinkTextInput.bind(this);
	}

	onInputChange() {
		this.props.onChange({
			type: 'link',
			linkPath: this.state.path,
			linkText: this.state.text,
		});
	}

	onChangeLinkPathInput(e) {
		this.setState({ path: e.target.value },
			() => this.onInputChange(),
		);
	}

	onChangeLinkTextInput(e) {
		this.setState({ text: e.target.value },
			() => this.onInputChange(),
		);
	}

	render() {
		const {
			label,
			name,
			id,
			className,
			// linkPath,
			// linkText,
		} = this.props;

		const labelValue = label || name;

		return (
			<div id={id} className={className}>
				<p>{labelValue}</p>
				<div>
					<label htmlFor="linkPath"><span>Path: </span>
						<input
							id={`${id}_path`}
							onChange={this.onChangeLinkPathInput}
							value={this.state.path}
						/>
					</label>
				</div>
				<div>
					<label htmlFor="linkText"><span>Text: </span>
						<input
							id={`${id}_text`}
							onChange={this.onChangeLinkTextInput}
							value={this.state.text}
						/>
					</label>
				</div>
			</div>
		);
	}
}

export default LinkInput;
