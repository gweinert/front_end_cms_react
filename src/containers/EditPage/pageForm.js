import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import { connect } from 'react-redux';
import {
	RECEIVE_USERS_SITE_SUCCESS,
	RECEIVE_FORM_ELEMENTS,
} from '../../actions/actionCreators';
import { 
	loadForm,
	onFieldChange,
} from '../../actions';
import Field from '../../components/ReduxFields/field';
import PageGroupList from '../../components/GroupPageElements/pageGroupList';

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
		// this.onInputChange = this.onInputChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.inputRefs = {};
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}

	componentWillMount() {
		const { activePage, dispatch } = this.props;
		const data = {};
		activePage.elements.forEach((el) => {
			const key = `${el.type}[${el.id}]`;
			data[key] = el.body;
		});
		dispatch(loadForm(data, activePage.id));
	}

	// onInputChange(e) {
	// 	const { value } = e.target;
	// 	const pageProp = e.target.getAttribute('name');
	// 	this.setState({ [pageProp]: value });
	// }

	onSubmit(e) {
		e.preventDefault();

		// avoid submitting on clicking any 'button' type in form
		if (e.target.getAttribute('type') === 'submit') {
			const updatedPageElements = this.buildPageElements();
			const updatedPage = this.buildPage(updatedPageElements);
			console.log("updatePage", updatedPage);

			this.props.onSubmit(updatedPage);
		}
	}

	handleFieldChange(fieldInfo) {
		const { activePage, dispatch } = this.props;
		dispatch(onFieldChange(fieldInfo, activePage.id));
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
			activePage,
			form,
			elementMap,
		} = this.props;

		const pageForm = form.formData[`page[${activePage.id}]`];

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
				{activePage.elements.filter(el => el.groupId === 0)
					.map((el, index) => {
						const InputComponent = elementMap[el.type.toLowerCase()];
						const nameKey = `${el.type}[${el.id}]`;
						const value = pageForm ? pageForm[nameKey] : '';
						return (
							<Field
								{...el.props}
								value={value}
								onFieldChange={this.onFieldChange}
								key={nameKey}
								name={nameKey}
								component={InputComponent}
							/>
						);
					})
				}
				<PageGroupList
					pageForm={pageForm}
					groups={activePage.elementsGroups}
					elementMap={elementMap}
					onAddNewGroupItem={this.props.onAddNewGroupItem}
					onDeleteGroupItem={this.props.onDeleteGroupItem}
					onSaveGroupItem={this.props.onSaveGroupItem}
					onFieldChange={this.handleFieldChange}
				/>
				<input
					onClick={this.onSubmit}
					type="submit"
					value="Submit"
				/>
			</form>
		);
	}
}

const mapStateToProps = (state) => {
	const { form } = state;

	return {
		form,
	};
}

export default connect(mapStateToProps)(PageForm);

// create new, "configured" function
// const PageFormRedux = reduxForm({
// 	form: 'page', // a unique identifier for this form
// 	keepDirtyOnReinitialize: true,
// 	enableReinitialize: true,
// })(PageForm);

// const PageFormReduxLoad = connect(
// 	state => ({
// 		initialValues: state.site.formData,
// 	}),
// 	{ load: RECEIVE_FORM_ELEMENTS },
// )(PageFormRedux);

// export default PageFormReduxLoad;
