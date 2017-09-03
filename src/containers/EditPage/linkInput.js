import React, { Component } from 'react';
import PropTypes			from 'prop-types';
import withInputControl from '../../components/InputControl/inputControl';


class LinkInput extends Component {
	static propTypes = {
		label: PropTypes.string,
		name: PropTypes.string,
		linkPath: PropTypes.string,
		linkText: PropTypes.string,
		onInputChange: PropTypes.func.isRequired,
	}

	static defaultProps = {
		label: '',
		name: '',
		linkPath: '',
		linkText: '',
	}

	constructor(props) {
		super(props);
		this.state = {
			linkPath: props.linkPath,
			linkText: props.linkText,
		};
		this.onChangeLinkPathInput = this.onChangeLinkPathInput.bind(this);
		this.onChangeLinkTextInput = this.onChangeLinkTextInput.bind(this);
	}

	onInputChange() {
		this.props.onInputChange({
			linkPath: this.state.linkPath,
			linkText: this.state.linkText,
		});
	}

	onChangeLinkPathInput(input) {
		this.setState({ linkPath: input },
			() => this.onInputChange(),
		);
	}

	onChangeLinkTextInput(input) {
		this.setState({ linkText: input });
	}

	render() {
		const {
			label,
			name,
			// linkPath,
			// linkText,
		} = this.props;

		const labelValue = label || name;

		return (
			<div>
				<p>{labelValue}</p>
				<div>
					<label htmlFor="linkPath"><span>Path: </span>
						<input
							onChange={this.onChangeLinkPathInput}
							value={this.state.linkPath}
						/>
					</label>
				</div>
				<div>
					<label htmlFor="linkText"><span>Text: </span>
						<input
							onChange={this.onChangeLinkTextInput}
							value={this.state.linkText}
						/>
					</label>
				</div>
			</div>
		);
	}
}

export default withInputControl(LinkInput);
