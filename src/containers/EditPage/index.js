import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import { connect }			from 'react-redux';
import Modal				from '../../components/Modal/modal';
import Title 				from '../../components/ReduxFields/title';
import Blurb 				from '../../components/ReduxFields/blurb';
import ImageInput 			from '../../components/ReduxFields/imageInput';
import LinkInput 			from '../../components/InputControl/linkInput';
import withContextMenu 		from '../../components/ContextMenu/contextMenu';
import PageForm 			from './pageForm';
import NewGroupForm 		from '../../components/Form/newGroupForm';
import {
	createPageElement,
	createPageElementGroup,
	updatePageSafely,
	createPageElementsForGroup,
	savePageElementsForGroup,
	deletePageElementsWithId,
	deletePageGroupSafely,
	deletePageSafely,
	deleteImagesSafely,
	publishSiteSafely,
} 							from '../../actions/';
import './editPage.css';

const PAGE_ELEMENT_TYPES = [
	'title',
	'blurb',
	'image',
	'link',
];

const contextMenuOptions = {
	menu: {
		'Add New Element >': PAGE_ELEMENT_TYPES,
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
			showSuccess: false,
			showError: false,
		};
		this.onPageFormSubmit 		= this.onPageFormSubmit.bind(this);
		this.onContextMenuClick 	= this.onContextMenuClick.bind(this);
		this.onGroupFormSubmit 		= this.onGroupFormSubmit.bind(this);
		this.handleNewGroupItem 	= this.handleNewGroupItem.bind(this);
		this.handleDeleteGroupItem 	= this.handleDeleteGroupItem.bind(this);
		this.handleSaveGroupItem 	= this.handleSaveGroupItem.bind(this);
		this.toggleModal 			= this.toggleModal.bind(this);
		this.onDeletePageClick 		= this.onDeletePageClick.bind(this);
		this.onPublishClick			= this.onPublishClick.bind(this);
	}

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


	onPageFormSubmit(pageForm) {
		const { dispatch } = this.props;
		dispatch(updatePageSafely(pageForm));
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

	onPublishClick() {
		const { dispatch } = this.props;

		dispatch(publishSiteSafely());
	}

	showNewGroupForm() {
		this.setState({
			showModal: true,
		});
	}

	// @ DEV check if group el
	deletePageElement(targetNode) {
		const { dispatch, activePage } = this.props;
		console.log('delete page element', targetNode);
		let validNodeElement = targetNode.className.includes('can-delete') && targetNode;
		let elementToDeleteId;
		let groupId;
		let validGroupId;
		const elIdsToDelete = [];
		let imageURLToDelete;

		// find the input element with the id
		if (validNodeElement) {
			if (targetNode.className.includes('group')) { // check if its a group
				groupId = targetNode.id;
			} else {
				elementToDeleteId = targetNode.id;
			}
		} else {
			validNodeElement = findAncestor(targetNode, 'can-delete');
			if (validNodeElement) {
				console.log('find anc', validNodeElement);
				if (validNodeElement.className.includes('group')) {
					groupId = validNodeElement.id;
				} else {
					elementToDeleteId = validNodeElement.id;
				}
			}
		}

		if (elementToDeleteId) {
			elIdsToDelete.push(parseInt(elementToDeleteId, 10));
		} else if (groupId) {
			// get group id and all element ids in that to delete all
			groupId = parseInt(groupId, 10);
			const group = activePage.groups.find(groupItem => groupItem.id === groupId);
			validGroupId = group.id;
		}

		if (isImage(validNodeElement || targetNode)) {
			imageURLToDelete = this.getImageURLFromElementId(elementToDeleteId);
		}

		if (elIdsToDelete.length) {
			dispatch(deletePageElementsWithId(elIdsToDelete, groupId))
				.then(() => {
					if (imageURLToDelete) {
						dispatch(deleteImagesSafely(elIdsToDelete, [imageURLToDelete]));
					}
				});
		}

		if (validGroupId) {
			dispatch(deletePageGroupSafely(groupId))
				.then(() => {
					const groupImageURLs = [];
					activePage.elements.forEach((el) => {
						if (el.groupId === groupId && el.imageURL !== '') {
							groupImageURLs.push(el.imageURL);
						}
					});
					dispatch(deleteImagesSafely(elIdsToDelete, groupImageURLs));
				});
		}
	}

	getImageURLFromElementId(elementId) {
		const { activePage } = this.props;
		const imageElement = activePage.elements.find(el => el.id === parseInt(elementId, 10));
		return imageElement.imageURL;
	}

	handleNewGroupItem(groupId) {
		const { dispatch, activePage } = this.props;

		dispatch(createPageElementsForGroup(groupId, activePage));
	}

	handleDeleteGroupItem(slide, index) {
		const { dispatch } = this.props;
		const imageURLs = [];
		const ids = slide.map((el) => {
			if (el.imageURL !== '') {
				imageURLs.push(el.imageURL);
			}
			if (el.id[0] !== '_') {
				return parseInt(el.id, 10);
			}
			return el.id;
		});
		dispatch(deletePageElementsWithId(ids, slide[0].groupId))
			.then(() => {
				if (imageURLs.length) {
					dispatch(deleteImagesSafely(ids, imageURLs));
				}
			});
	}

	handleSaveGroupItem(slide, index) {
		const { dispatch, activePage } = this.props;
		if (slide.length) {
			dispatch(savePageElementsForGroup(slide, index, activePage.id));
		}
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
		const { showModal } = this.state;

		if (activePage) {
			return (
				<div className="edit-page">
					<h1>{activePage.name}</h1>
					<PageForm
						key={activePage.id}
						action="/"
						activePage={activePage}
						onSubmit={this.onPageFormSubmit}
						elementMap={pageElementComponentMap}
						onAddNewGroupItem={this.handleNewGroupItem}
						onDeleteGroupItem={this.handleDeleteGroupItem}
						onSaveGroupItem={this.handleSaveGroupItem}
					/>
					<button
						className="button button-mobile-large"
						onClick={this.onPublishClick}
					>
						PUBLISH
					</button>
					<button
						className="button button-outline delete-button button-mobile-large"
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
	const { page, user } = state;

	return {
		page,
		user,
	};
};

export default connect(mapStateToProps)(withContextMenu(EditPage, contextMenuOptions));


function findAncestor(el, cls) {
	while ((el = el.parentElement) && !el.classList.contains(cls));
	return el;
}

function isImage(validNodeElement) {
	return validNodeElement.className.includes('is-image');
}
