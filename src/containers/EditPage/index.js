import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import { connect }			from 'react-redux';
import Modal				from '../../components/Modal/modal';
import Title 				from './title';
import Blurb 				from './blurb';
import ImageInput 			from './imageInput';
import LinkInput 			from './linkInput';
import withContextMenu 		from '../../components/ContextMenu/contextMenu';
import PageForm 			from './pageForm';
import NewGroupForm 		from './newGroupForm';
import PageElementList 		from './pageElementList';
import PageGroupList 		from './pageGroupList';
import {
	createPageElement,
	createPageElementGroup,
	updatePageSafely,
	createPageElementsForGroup,
	// deletePageElementsForGroup,
	deletePageElementWithId,
	deletePageSafely,
} 							from '../../actions/';

const PAGE_ELEMENT_TYPES = [
	'title',
	'blurb',
	'image',
	'link',
];

const contextMenuOptions = {
	menu: {
		'Add New Element': PAGE_ELEMENT_TYPES,
		'Save As Template': [],
		'Add New Group': [],
		'Delete Page Element': [],
	},
};


const pageElementComponentMap = {
	title: Title,
	blurb: Blurb,
	image: ImageInput,
	link: LinkInput,
};

class EditPage extends Component {
	static propTypes = {
		activePage: PropTypes.object, // eslint-disable-line react/forbid-prop-types
		dispatch: PropTypes.func.isRequired,
		page: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
	}

	static defaultProps = {
		activePage: null,
	}

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showNewGroupForm: true,
			showSuccess: false,
			showError: false,
		};
		this.onPageFormSubmit = this.onPageFormSubmit.bind(this);
		this.onContextMenuClick = this.onContextMenuClick.bind(this);
		this.onGroupFormSubmit = this.onGroupFormSubmit.bind(this);
		this.handleNewGroupItem = this.handleNewGroupItem.bind(this);
		this.handleDeleteGroupItem = this.handleDeleteGroupItem.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.onDeletePageClick = this.onDeletePageClick.bind(this);
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.page.updateSuccess && nextProps.page.updateSuccess === null) {
	// 		this.setState({
	// 			showSuccess: true,
	// 			showError: false,
	// 		});
	// 	} else if (!nextProps.page.updateSuccess && nextProps.page.updateSuccess === null) {
	// 		this.setState({
	// 			showSuccess: false,
	// 		})
	// 	}
	// }

	onContextMenuClick(contextMenuListItem, eventTarget) {
		switch (contextMenuListItem.toLowerCase()) {
		case 'add new group':
			this.showNewGroupForm();
			break;
		case 'delete page element':
			this.deletePageElement(eventTarget);
			break;
		default: this.createNewPageElement(contextMenuListItem);
		}
	}


	onPageFormSubmit(updatedPage) {
		const { dispatch } = this.props;
		dispatch(updatePageSafely(updatedPage));
	}

	onGroupFormSubmit(group) {
		this.createNewPageGroup(group);
	}

	onDeletePageClick() {
		const { dispatch, activePage } = this.props;

		if (activePage.id) {
			dispatch(deletePageSafely(activePage.id));
		}
	}

	showNewGroupForm() {
		this.setState({
			showModal: true,
		});
	}

	deletePageElement(targetNode) {
		const { dispatch } = this.props;
		console.log("delete page element", targetNode);
		let validNodeElement = targetNode.className.includes('input-control') && targetNode;
		let elementToDeleteId;

		function getElementToDeleteId(targetNodeElement) {
			const targetNodeIdType = targetNode.id.split('_')[0];
			console.log("targernode type", targetNodeIdType);
			const validElement = PAGE_ELEMENT_TYPES.indexOf(targetNodeIdType) > -1;
			console.log("valid EL", validElement);
			
			if (validElement) {
				const targetNodeId = targetNode.id.split('_')[1];
				return targetNodeId;
			}

			return false;
		}

		// find the input element with the id
		if (validNodeElement) {
			elementToDeleteId = getElementToDeleteId(validNodeElement);
		} else {
			validNodeElement = findAncestor(targetNode, 'input-control');
			if (validNodeElement) {
				elementToDeleteId = getElementToDeleteId(validNodeElement);
			}
		}
		console.log("validNodeElement", validNodeElement, elementToDeleteId);
		if (elementToDeleteId) {
			dispatch(deletePageElementWithId(elementToDeleteId));
		}
	}

	handleNewGroupItem(groupId) {
		const { dispatch, activePage } = this.props;

		dispatch(createPageElementsForGroup(groupId, activePage));
	}

	handleDeleteGroupItem(groupId) {
		const { dispatch } = this.props;
		// dispatch(deletePageElementsForGroup(groupId));
	}


	toggleModal() {
		this.setState({ showModal: !this.state.showModal });
	}

	createNewPageElement(newElementType) {
		const { dispatch, activePage } = this.props;
		const type = newElementType.toLowerCase();

		if (pageElementComponentMap[type.toLowerCase()]) {
			dispatch(createPageElement(type, activePage));
		}
	}

	createNewPageGroup(groupFormState) {
		const { dispatch, activePage } = this.props;
		if (Object.keys(groupFormState).length) {
			dispatch(createPageElementGroup(groupFormState, activePage));
		}
	}

	render() {
		const { activePage } = this.props;
		const { showModal, showNewGroupForm } = this.state;

		if (activePage) {
			const normalPageElements = activePage.elements.length ?
				activePage.elements.filter(el => el.groupId === 0) : [];
			console.log("activePage", activePage);
			return (
				<div>
					<h1>{activePage.title}</h1>
					<PageForm
						key={activePage.id}
						action="/"
						activePage={activePage}
						onSubmit={this.onPageFormSubmit}
					>
						<PageElementList
							elements={normalPageElements}
							elementMap={pageElementComponentMap}
						/>
						<PageGroupList
							groups={activePage.groups}
							elements={activePage.elements}
							elementMap={pageElementComponentMap}
							onAddNewGroupItem={this.handleNewGroupItem}
							onDeleteGroupItem={this.handleDeleteGroupItem}
						/>
					</PageForm>
					<button
						onClick={this.openNewElementModal}
					>
						Add New Element
					</button>
					<button
						onClick={this.onDeletePageClick}
					>
						DELETE PAGE
					</button>
					<Modal
						show={showModal}
						onCloseClick={this.toggleModal}
					>
						<NewGroupForm
							options={PAGE_ELEMENT_TYPES}
							onSubmit={this.onGroupFormSubmit}
						/>

					</Modal>
				</div>
			);
		}

		return null;
	}
}

const mapStateToProps = (state) => {
	const { page } = state;

	return {
		page,
	};
};

export default connect(mapStateToProps)(withContextMenu(EditPage, contextMenuOptions));


function findAncestor (el, cls) {
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
}
