import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import PageGroup 			from './pageGroup';
import SlideItem from './slideItem';


class PageGroupList extends Component {
	static propTypes = {
		elementMap: PropTypes.object,
		groups: PropTypes.arrayOf(PropTypes.object),
		onAddNewGroupItem: PropTypes.func,
		onDeleteGroupItem: PropTypes.func,
		onSaveGroupItem: PropTypes.func,
		pageForm: PropTypes.object,
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

		return (
			<div>
				{groups.map((group, index) => {
					const groupSlides = groupBy(group.elements, 'groupSortOrder');
					return (
						<div className="group can-delete" id={group.id} key={group.id}>
							<h2>{group.name}</h2>
							{Object.keys(groupSlides)
								.sort((a, b) => a - b)
								.map((slideKey, slideIndex) => (
									<SlideItem
										groupId={group.id}
										key={slideKey}
										pageForm={pageForm}
										slide={groupSlides[slideKey]}
										index={slideIndex}
										elementMap={elementMap}
										onDelete={this.onDeleteSlide}
										onSave={this.onSaveSlide}
										onFieldChange={this.props.onFieldChange}
										moveSlideItem={this.props.moveSlideItem}									
									/>
								))
							}
							<button onClick={() => { this.onAddNewGroupItem(group.id); }}>
								Add New Slide
							</button>
						</div>
					);
				})}
			</div>
		);
	}
}

export default PageGroupList;

function groupBy(xs, key) {
	return xs.reduce((rv, x) => {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
}
