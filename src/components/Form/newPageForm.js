import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NewPageForm extends Component {
	static propTypes = {
		pages: PropTypes.arrayOf(PropTypes.object),
		onSubmit: PropTypes.func,
	}

	static defaultProps = {
		pages: [],
		onSubmit: () => {},
	}

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			template: 'New Template',
		};
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(e) {
		const name = e.target.getAttribute('name');
		const value = e.target.value;
		this.setState({ [name]: value });
	}

	onSubmit(e) {
		e.preventDefault();
		const isValid = this.validForm();

		if (isValid) {
			this.props.onSubmit(this.state);
		}
	}

	validForm() {
		let isValid = true;
		Object.keys(this.state).forEach((key) => {
			if (this.state[key] === '') {
				isValid = false;
			}
		});

		return isValid;
	}

	render() {
		const { pages } = this.props;

		return (
			<form
				onSubmit={this.onSubmit}
			>
				<div>
					<label htmlFor="name"><span>Page Name:</span>
						<input
							type="text"
							name="name"
							value={this.state.name}
							onChange={this.onChange}
						/>
					</label>
				</div>
				<div>
					<label htmlFor="template"><span>Template:</span>
						<select
							name="template"
							value={this.state.template}
							onChange={this.onChange}
						>
							<option default value="New Template">New Template</option>
							<option value="home">Home</option>
						</select>
					</label>
				</div>
				<div>
					<label htmlFor="parentId"><span>SubPage Under:</span>
						<select
							name="parentId"
							value={this.state.parentId}
							onChange={this.onChange}
						>
							<option default value="0">Not Sub Page</option>
							{pages.map(page => (
								<option key={page.id} value={page.id}>{page.name}</option>
							))}
						</select>
					</label>
				</div>
				<input type="submit" value="Create Page" />
			</form>
		);
	}
}

export default NewPageForm;
