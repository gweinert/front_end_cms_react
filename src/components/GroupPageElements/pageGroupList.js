import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import GroupElementList from './groupElementList';
import SlideItem from './slideItem';

// const PageGroupElementList = ({ elements, elementMap, onAddNewGroupItem }) => {
class PageGroupList extends Component {
	static propTypes = {
		elementMap: PropTypes.object,
		groups: PropTypes.object,
		onAddNewGroupItem: PropTypes.func,
		onDeleteGroupItem: PropTypes.func,
		onSaveGroupItem: PropTypes.func,
		pageForm: PropTypes.object,
		// onInputChange: PropTypes.func,
	};

	static defaultProps = {
		groups: [],
		onAddNewGroupItem: () => {},
		onDeleteGroupItem: () => {},
		onSaveGroupItem: () => {},
	};

	constructor(props) {
		super(props);
		this.onAddNewGroupItem = this.onAddNewGroupItem.bind(this);
		this.onDeleteSlide = this.onDeleteSlide.bind(this);
		this.onSaveSlide = this.onSaveSlide.bind(this);
	}

	onAddNewGroupItem(groupId) {
		const { onAddNewGroupItem } = this.props;
		onAddNewGroupItem(groupId);
	}

	onDeleteSlide(slide, index) {
		const { onDeleteGroupItem } = this.props;
		onDeleteGroupItem(slide, index);
	}

	onSaveSlide(slide, index) {
		const { onSaveGroupItem } = this.props;
		onSaveGroupItem(slide, index);
	}

	render() {
		const {
			elementMap,
			groups,
			pageForm,
		} = this.props;

		console.log("groupEls", groups);

		return (
			<div>
				{Object.keys(groups).map((groupKey, index) => (
					<div className="group" key={groupKey}>
						{groups[groupKey].map((slide, slideIndex) => (
							<SlideItem
								pageForm={pageForm}
								slide={slide}
								index={slideIndex}
								elementMap={elementMap}
								onDelete={this.onDeleteSlide}
								onSave={this.onSaveSlide}
								onFieldChange={this.props.onFieldChange}
							/>
						))}
					</div>
				))}
			</div>
		);
	}
}

export default PageGroupList;
