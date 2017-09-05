import React, { Component } from 'react';
import PropTypes 			from 'prop-types';

class NewGroupForm extends Component {
	static propTypes = {
		options: PropTypes.arrayOf(PropTypes.string),
		numberOfEachOption: PropTypes.number,
		onSubmit: PropTypes.func,
	}

	static defaultProps = {
		options: [],
		numberOfEachOption: 4,
		onSubmit: () => {},
	}

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			structure: [],
		};
		this.onSelectChange = this.onSelectChange.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onCreateClick = this.onCreateClick.bind(this);
	}

	onSelectChange(type, e) {
		const pageElementType = type.toLowerCase();
		const numberOfPageElementType = parseInt(e.target.value, 10);

		this.setState({
			structure: {
				...this.state.structure,
				[pageElementType]: numberOfPageElementType,
			},
		});
	}

	onInputChange(e) {
		const name = e.target.getAttribute('name');
		this.setState({ [name]: e.target.value });
	}

	onCreateClick() {
		this.props.onSubmit(this.state);
	}

	render() {
		const { options, numberOfEachOption } = this.props;
		const selectOptions = [];
		for (let i = 0; i < numberOfEachOption; i += 1) {
			selectOptions.push(i);
		}
		return (
			<div>
				<label htmlFor="name">
					<input
						type="text"
						name="name"
						value={this.state.name}
						onChange={this.onInputChange}
					/>
				</label>
				<ul>
					{options.map(option => (
						<li key={option}>
							<div>
								<span>Type: </span>{option}
								<select
									onChange={e => this.onSelectChange(option, e)}
									value={this.state[option]}
								>
									{selectOptions.map(num => (
										<option key={num} value={num}>{num}</option>
									))}
								</select>
							</div>
						</li>
					))}
				</ul>
				<button onClick={this.onCreateClick}>Create</button>
			</div>
		);
	}
}

export default NewGroupForm;
