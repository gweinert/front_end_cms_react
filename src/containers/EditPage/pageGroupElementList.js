import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageElementList from './pageElementList';

// const PageGroupElementList = ({ elements, elementMap, onAddNewGroupItem }) => {
class PageGroupElementList extends Component {
	static propTypes = {
		elements: PropTypes.arrayOf(PropTypes.object),
		elementMap: PropTypes.object,
		onAddNewGroupItem: PropTypes.func,
		// onInputChange: PropTypes.func,
	};

	static defaultProps = {
		elements: [],
		onAddNewGroupItem: () => {},
	};

	constructor(props) {
		super(props);
		this.onAddNewGroupItem = this.onAddNewGroupItem.bind(this);
	}

	onAddNewGroupItem(groupId) {
		const { onAddNewGroupItem } = this.props;
		onAddNewGroupItem(groupId);
	}

	render() {
		const {
			elements,
			elementMap,
		} = this.props;

		const groupedElements = elements.filter(el => el.groupId !== 0)
			.reduce((accum, cur) => {
				(accum[cur.groupId] = accum[cur.groupId] || []).push(cur);
				return accum;
			}, {});

		if (Object.keys(groupedElements).length) {
			return (
				<div>
					{Object.keys(groupedElements).map((groupKey, index) => (
						<div className="group" key={groupKey}>
							<PageElementList
								elements={groupedElements[groupKey]}
								elementMap={elementMap}
							/>
							<button onClick={() => this.onAddNewGroupItem(groupKey)}>Add New Slide</button>
						</div>
					))}
				</div>
			);
		}

		return null;
	}
}

export default PageGroupElementList;
