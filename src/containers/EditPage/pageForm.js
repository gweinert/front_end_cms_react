import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import { connect } 			from 'react-redux';
import {
	loadForm,
	onFieldChange,
} 							from '../../actions';
import Field 				from '../../components/ReduxFields/field';
import PageGroupList 		from '../../components/GroupPageElements/pageGroupList';

class PageForm extends Component {
	static propTypes = {
		activePage: PropTypes.object,
		elementMap: PropTypes.object,
		action: PropTypes.string,
		method: PropTypes.string,
		onSubmit: PropTypes.func,
		onSuccess: PropTypes.func,
		onFail: PropTypes.func,
		children: PropTypes.arrayOf(PropTypes.node),
		form: PropTypes.object,
		dispatch: PropTypes.func.isRequired,
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
		this.onSubmit = this.onSubmit.bind(this);
		this.handleFieldChange = this.handleFieldChange.bind(this);
	}

	componentWillMount() {
		this.buildFormState();
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.form.success && nextProps.form.success) {
			this.buildFormState(nextProps);
		}
	}

	onSubmit(e) {
		const { activePage, form, onSubmit } = this.props;
		e.preventDefault();

		// avoid submitting on clicking any 'button' type in form
		if (e.target.getAttribute('type') === 'submit') {
			const formName = `page[${activePage.id}]`;
			const pageForm = form[formName];
			onSubmit(pageForm);
		}
	}

	buildFormState(nextProps) {
		const { dispatch } = this.props;
		const data = {};
		const activePage = nextProps ? nextProps.activePage : this.props.activePage;

		activePage.elements.forEach((el) => {
			const key = `${el.type}[${el.id}]`;
			data[key] = el.body;
		});

		data.name = activePage.name;
		data.path = activePage.path;

		dispatch(loadForm(data, activePage.id));
	}

	handleFieldChange(fieldInfo) {
		const { activePage, dispatch } = this.props;
		dispatch(onFieldChange(fieldInfo, activePage.id));
	}

	render() {
		const {
			action,
			method,
			activePage,
			form,
			elementMap,
		} = this.props;

		const pageForm = form.formData[`page[${activePage.id}]`];
		const pageNameVal = pageForm && pageForm.name ? pageForm.name : '';
		const pagePathVal = pageForm && pageForm.path ? pageForm.path : '';

		return (
			<form
				action={action}
				method={method}
				onSubmit={this.onSubmit}
			>
				<Field
					name="name"
					component="input"
					type="text"
					value={pageNameVal}
					onFieldChange={this.handleFieldChange}
				/>
				<Field
					name="path"
					component="input"
					type="text"
					value={pagePathVal}
					onFieldChange={this.handleFieldChange}
				/>
				{activePage.elements.filter(el => el.groupId === 0)
					.map((el, index) => {
						const InputComponent = elementMap[el.type.toLowerCase()];
						const nameKey = `${el.type}[${el.id}]`;
						const value = pageForm && pageForm[nameKey] ? pageForm[nameKey] : '';
						return (
							<Field
								{...el}
								value={value}
								onFieldChange={this.handleFieldChange}
								key={nameKey}
								name={nameKey}
								component={InputComponent}
							/>
						);
					})
				}
				<PageGroupList
					pageForm={pageForm}
					groups={activePage.groups}
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
