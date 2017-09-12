// import React, { Component } from 'react';
// import PropTypes 			from 'prop-types';
// // import { DragDropContext } 	from 'react-dnd';
// // import HTML5Backend 		from 'react-dnd-html5-backend';
// import SlideItem 			from './slideItem';

// class PageGroup extends Component {
// 	static propTypes = {
// 		group: PropTypes.object.isRequired,
// 		groupSlides: PropTypes.object.isRequired,
// 		onAddNewGroupItem: PropTypes.func.isRequired,
// 		onFieldChange: PropTypes.func.isRequired,
// 		pageForm: PropTypes.object.isRequired,
// 		elementMap: PropTypes.object.isRequired,
// 		onDelete: PropTypes.func.isRequired,
// 		onSave: PropTypes.func.isRequired,
// 	}

// 	constructor(props) {
// 		super(props);
// 		this.onAddNewGroupItem = this.onAddNewGroupItem.bind(this);
// 	}

// 	onAddNewGroupItem() {
// 		const { group } = this.props;
// 		this.props.onAddNewGroupItem(group.id);
// 	}

// 	render() {
// 		const {
// 			group,
// 			groupSlides,
// 			pageForm,
// 			elementMap,
// 		} = this.props;

// 		return (
// 			<div className="group can-delete" id={group.id} key={group.id}>
// 				<h2>{group.name}</h2>
// 				{Object.keys(groupSlides).map((slideKey, slideIndex) => (
// 					<SlideItem
// 						key={slideKey}
// 						groupId={group.id}
// 						pageForm={pageForm}
// 						slide={groupSlides[slideKey]}
// 						index={slideIndex}
// 						elementMap={elementMap}
// 						onDelete={this.props.onDelete}
// 						onSave={this.props.onSave}
// 						onFieldChange={this.props.onFieldChange}
// 						moveSlideItem={this.props.moveSlideItem}
// 					/>
// 				))}
// 				<button onClick={this.onAddNewGroupItem}>
// 					Add New Slide
// 				</button>
// 			</div>
// 		);
// 	}
// }

// // export default DragDropContext(HTML5Backend)(PageGroup);
// export default PageGroup;

