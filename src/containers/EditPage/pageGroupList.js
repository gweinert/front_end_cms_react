import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GroupElementList from './groupElementList';

// const PageGroupElementList = ({ elements, elementMap, onAddNewGroupItem }) => {
class PageGroupList extends Component {
	static propTypes = {
		elements: PropTypes.arrayOf(PropTypes.object),
		elementMap: PropTypes.object,
		groups: PropTypes.arrayOf(PropTypes.object),
		onAddNewGroupItem: PropTypes.func,
		onDeleteGroupItem: PropTypes.func,
		// onInputChange: PropTypes.func,
	};

	static defaultProps = {
		elements: [],
		groups: [],
		onAddNewGroupItem: () => {},
		onDeleteGroupItem: () => {},
	};

	constructor(props) {
		super(props);
		this.onAddNewGroupItem = this.onAddNewGroupItem.bind(this);
		this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
	}

	onAddNewGroupItem(groupId) {
		const { onAddNewGroupItem } = this.props;
		onAddNewGroupItem(groupId);
	}

	onDeleteButtonClick(groupId) {
		const { onDeleteGroupItem } = this.props;
		onDeleteGroupItem(groupId);
	}

	buildGroups() {
		const { elements, groups } = this.props;
		let betterGroup = [];

		const groupedElements = elements.filter(el => el.groupId !== 0)
			.reduce((accum, cur) => {
				(accum[cur.groupId] = accum[cur.groupId] || []).push(cur);
				return accum;
			}, {});

		Object.keys(groupedElements).forEach((key) => {
			const ge = groupedElements[key];
			const currentGroup = groups.find(groupItem => groupItem.id === parseInt(key, 10));
			const elementsPerSlide = currentGroup.structure
				.reduce((accum, item) => (
					accum.amount ? accum.amount + item.amount : accum + item.amount
				), 0);

			let slide = [];
			ge.forEach((el, index) => {
				const slideNum = Math.floor(index / elementsPerSlide);
				const nextSlide = Math.floor((index + 1) / elementsPerSlide) > slideNum;

				slide.push(el);

				if (nextSlide) {
					betterGroup.push(slide);
					slide = [];
				}
			});

			// ge = betterGroup;
			groupedElements[key] = betterGroup;
			betterGroup = [];
		});

		return groupedElements;
	}

	render() {
		const {
			elements,
			elementMap,
			groups,
		} = this.props;

		const groupEls = this.buildGroups();

		console.log("groupEls", groupEls);

		const groupedElements = elements.filter(el => el.groupId !== 0)
			.reduce((accum, cur) => {
				(accum[cur.groupId] = accum[cur.groupId] || []).push(cur);
				return accum;
			}, {});

		if (Object.keys(groupedElements).length) {
			console.log("groupedElements", groupedElements);
			return (
				<div>
					{Object.keys(groupedElements).map((groupKey, index) => (
						<div className="group" key={groupKey}>
							{groupedElements[groupKey].map((el, elIndex) => {
								const currentGroup = groups.find(groupItem => groupItem.id === parseInt(groupKey, 10));

								return (
									<GroupElementList
										key={el.id}
										el={el}
										index={elIndex}
										group={currentGroup}
										elementMap={elementMap}
									/>
								);
							})}
							<button onClick={() => this.onAddNewGroupItem(groupKey)}>Add New Slide</button>
						</div>
					))}
				</div>
			);
		}

		return null;
	}
}

export default PageGroupList;
