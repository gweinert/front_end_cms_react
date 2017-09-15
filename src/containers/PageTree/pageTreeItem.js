import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import PropTypes from 'prop-types';
import ItemTypes from './itemTypes';

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
};

function dragCollect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	};
}

const pageItemSource = {
	beginDrag(props) {
		return {
			id: props.id,
			index: props.index,
		};
	},
};


function dropCollect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
	};
}

const pageItemTarget = {
	hover(props, monitor, component) {
		const dragIndex = monitor.getItem().index;
		const hoverIndex = props.index;

		// Don't replace items with themselves
		if (dragIndex === hoverIndex) {
			return;
		}

		// Determine rectangle on screen
		const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

		// Get vertical middle
		const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

		// Determine mouse position
		const clientOffset = monitor.getClientOffset();

		// Get pixels to the top
		const hoverClientY = clientOffset.y - hoverBoundingRect.top;

		// Only perform the move when the mouse has crossed half of the items height
		// When dragging downwards, only move when the cursor is below 50%
		// When dragging upwards, only move when the cursor is above 50%

		// Dragging downwards
		if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
			return;
		}

		// Dragging upwards
		if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
			return;
		}

		// Time to actually perform the action
		props.movePageItem(dragIndex, hoverIndex, props.parentId);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	},

	drop(props, monitor, component) {
		// const dragIndex = monitor.getItem();
		// const hoverIndex = props.index;
		// console.log("on drop", dragIndex, hoverIndex);
		props.dropPageItem(props.id, props.index);
	},
};

class PageTreeItem extends Component {
	static propTypes = {
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		id: PropTypes.any.isRequired,
		// text: PropTypes.string.isRequired,
		children: PropTypes.node,
		movePageItem: PropTypes.func.isRequired,
	}

	static defaultProps = {
		children: null,
	}

	render() {
		const { children, isDragging, connectDragSource, connectDropTarget } = this.props;
		const opacity = isDragging ? 0 : 1;

		return connectDragSource(connectDropTarget(
			<div style={{ ...style, opacity }}>
				{children}
			</div>,
		));
	}
}

const dropPageTreeItem = DropTarget(ItemTypes.PAGE_TREE_ITEM,
	pageItemTarget,
	dropCollect)(PageTreeItem);

export default DragSource(ItemTypes.PAGE_TREE_ITEM,
	pageItemSource,
	dragCollect)(dropPageTreeItem);
