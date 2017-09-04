import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import { connect } 			from 'react-redux';
import PageButton 			from './pageButton';
import Modal				from '../../components/Modal/modal';
import NewPageForm 			from '../../components/Form/newPageForm';
import {
	setActivePage,
	createNewPageSafely,
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
				{levelPages.map(pageItem => (
					<li key={pageItem.id}>
						<PageButton
							id={pageItem.id}
							title={pageItem.title}
							onClick={this.onPageListItemClick}
						/>
						{this.renderPageList(pageItem.id)}
					</li>
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

export default connect(mapStateToProps)(PageTree);
