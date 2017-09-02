import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import { connect } 			from 'react-redux';
import PageButton 			from './pageButton';
import { setActivePage } 	from '../../actions';
import './index.css';

class PageTree extends Component {
	static propTypes = {
		pages: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
		page: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		dispatch: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);
		this.onPageListItemClick = this.onPageListItemClick.bind(this);
	}

	componentDidMount() {
		// console.log('PageTree', this);
	}

	onPageListItemClick(pageId) {
		const { dispatch } = this.props;
		dispatch(setActivePage(pageId));
	}

	renderPageList(parentId) {
		const { pages, page } = this.props;
		const levelPages = pages.sort((a, b) => a.sortOrder - b.sortOrder)
			.filter(pageItem => pageItem.parentId === parentId);
		const childClass = parentId === 0 ? '' : 'child-page-list';
		const activeChild = ((parentId === page.activePageId)) ? 'active' : '';

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

		return (
			<div className="page-tree">
				<h2>Pages</h2>
				{this.renderPageList(topLevel)}
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
