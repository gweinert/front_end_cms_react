import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PageForm extends Component {
	static propTypes = {
		activePage: PropTypes.object,
		action: PropTypes.string,
		method: PropTypes.string,
		onSubmit: PropTypes.func,
		onSuccess: PropTypes.func,
		onFail: PropTypes.func,
		children: PropTypes.arrayOf(PropTypes.node),
	}

	static defaultProps = {
		activePage: null,
		action: '',
		method: 'POST',
		onSubmit: () => {},
		onSuccess: () => {},
		onFail: () => {},
		children: [],
	}

	constructor(props) {
		super(props);
		this.state = {
			name: props.activePage.name,
			path: props.activePage.path,
		};
		this.onInputChange = this.onInputChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.inputRefs = {};
	}

	onInputChange(e) {
		const { value } = e.target;
		const pageProp = e.target.getAttribute('name');
		this.setState({ [pageProp]: value });
	}

	onSubmit(e) {
		e.preventDefault();

		// avoid submitting on clicking any 'button' type in form
		if (e.target.getAttribute('type') === 'submit') {
			const updatedPageElements = this.buildPageElements();
			const updatedPage = this.buildPage(updatedPageElements);
			console.log("updatePage", updatedPage);

			// this.props.onSubmit(updatedPage);
		}
	}

	buildPageElements() {
		console.log("input refs", this.inputRefs);
		const updatedPageElements = Object.keys(this.inputRefs).map((inputElKey) => {
			const inputEl = this.inputRefs[inputElKey];
			const pageElObject = inputEl.props;

			switch (pageElObject.type) {
			case 'title':
				return { ...pageElObject, body: inputEl.getValue() || pageElObject.body };
			case 'blurb':
				return { ...pageElObject, body: inputEl.getValue() || pageElObject.body };
			case 'image':
				return { ...pageElObject, imageURL: inputEl.getValue() || pageElObject.imageURL };
			case 'link':
				return {
					...pageElObject,
					linkPath: inputEl.getValue('linkPath') || pageElObject.linkPath,
					linkText: inputEl.getValue('linkText') || pageElObject.linkText,
				};
			default: return pageElObject;
			}
		});

		return updatedPageElements;
	}

	buildPage(updatedPageElements) {
		const { activePage } = this.props;

		const updatedPage = {
			...activePage,
			name: this.state.name,
			path: this.state.path,
			elements: updatedPageElements,
		};

		return updatedPage;
	}

	render() {
		const {
			action,
			method,
			children,
			// activePage,
		} = this.props;

		return (
			<form
				action={action}
				method={method}
				onSubmit={this.onSubmit}
			>
				<div>
					<label htmlFor="Name"><span> Name: </span>
						<input
							name="name"
							type="text"
							value={this.state.name}
							onChange={this.onInputChange}
						/>
					</label>
				</div>
				<div>
					<label htmlFor="Path"> <span>Path:</span>
						<input
							name="path"
							type="text"
							value={this.state.path}
							onChange={this.onInputChange}
						/>
					</label>
				</div>

				{children.map((child) => {
					if (typeof child.type === 'function') { // if its a page element
						return React.cloneElement(
							child,
							{ ...child.props,
								elements: child.props.elements.map((el) => {
									const inputRefKey = `${el.name}_${el.id}`;
									return { ...el, ref: (ref) => { this.inputRefs[inputRefKey] = ref; } }
								}),
							},
						);
					}

					return child;
				})}
				<input
					onClick={this.onSubmit}
					type="submit"
					value="Submit"
				/>
			</form>
		);
	}
}

export default PageForm;
