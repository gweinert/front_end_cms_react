import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import { connect } 			from 'react-redux';
// import { DragDropContext } 	from 'react-dnd';
// import HTML5Backend 		from 'react-dnd-html5-backend';
import DraggablePageItem	from './pageTreeItem';
import PageButton 			from './pageButton';
import Modal				from '../../components/Modal/modal';
import NewPageForm 			from '../../components/Form/newPageForm';
import {
	setActivePage,
	createNewPageSafely,
	dragPageItem,
	updatePageSortOrderSafely,
} 							from '../../actions';
import './index.css';


class PageTree extends Component {
	static propTypes = {
		pages: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
		page: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		activePage: PropTypes.object, // eslint-disable-line react/forbid-prop-types
		dispatch: PropTypes.func.isRequired,
	}

	static defaultProps = {
		activePage: {},
	}

	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
		};
		this.onPageListItemClick = this.onPageListItemClick.bind(this);
		this.onAddNewPageButtonClick = this.onAddNewPageButtonClick.bind(this);
		this.onNewPageFormSubmit = this.onNewPageFormSubmit.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.movePageItem = this.movePageItem.bind(this);
		this.dropPageItem = this.dropPageItem.bind(this);
	}

	componentDidMount() {
		// console.log('PageTree', this);
	}

	componentWillReceiveProps(nextProps) {
		this.closeModalOnAddPageSuccess(nextProps);
	}

	onPageListItemClick(pageId) {
		const { dispatch } = this.props;
		dispatch(setActivePage(pageId));
	}

	onAddNewPageButtonClick() {
		this.setState({ showModal: true });
	}

	onNewPageFormSubmit(formState) {
		const { dispatch } = this.props;
		dispatch(createNewPageSafely(formState));
	}

	closeModalOnAddPageSuccess(nextProps) {
		if (nextProps.pages.length === this.props.pages.length + 1) {
			if (this.state.showModal) {
				this.setState({ showModal: false });
			}
		}
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	movePageItem(dragIndex, hoverIndex) {
		const { dispatch } = this.props;
		dispatch(dragPageItem(dragIndex, hoverIndex));
	}

	dropPageItem(pageId, newIndex) {
		const { dispatch } = this.props;
		dispatch(updatePageSortOrderSafely(pageId, newIndex));
	}

	renderPageList(parentId) {
		const { pages, page, activePage } = this.props;
		const levelPages = pages.sort((a, b) => a.sortOrder - b.sortOrder)
			.filter(pageItem => pageItem.parentId === parentId);
		const childClass = parentId === 0 ? '' : 'child-page-list';
		let activeChild = '';
		if (page.activePageId) {
			activeChild = ((parentId === page.activePageId || parentId === activePage.parentId)) ? 'active' : '';
		}

		return (
			<ul className={`${childClass} ${activeChild}`}>
				{levelPages.map((pageItem, index) => (
					<DraggablePageItem
						key={pageItem.id}
						index={index}
						id={pageItem.id}
						movePageItem={this.movePageItem}
						dropPageItem={this.dropPageItem}
					>
						<PageButton
							id={pageItem.id}
							title={pageItem.name}
							onClick={this.onPageListItemClick}
						/>
						{this.renderPageList(pageItem.id)}
					</DraggablePageItem>
				))}
			</ul>
		);
	}

	render() {
		const topLevel = 0;
		const { pages } = this.props;

		return (
			<div className="page-tree">
				<h2>Pages</h2>
				{this.renderPageList(topLevel)}
				<button
					onClick={this.onAddNewPageButtonClick}
				>
					Add New Page
				</button>
				<Modal
					show={this.state.showModal}
					onCloseClick={this.closeModal}
				>
					<NewPageForm
						pages={pages}
						onSubmit={this.onNewPageFormSubmit}
					/>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { page } = state;

	return {
		page,
	};
};

// const DragablePageTree = DragDropContext(HTML5Backend)(PageTree);
// 
// export default connect(mapStateToProps)(DragablePageTree);

export default connect(mapStateToProps)(PageTree);
