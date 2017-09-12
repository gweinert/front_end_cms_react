import React, { Component } 		from 'react';
import PropTypes 					from 'prop-types';
import { findDOMNode } 				from 'react-dom';
import { DragSource, DropTarget } 	from 'react-dnd';
import Field 						from '../ReduxFields/field';
import ItemTypes 					from './itemTypes';

import './slideItem.css';

const style = {
	border: '1px dashed gray',
	borderRadius: '5px',
	padding: '10px',
	marginBottom: '.5rem',
	backgroundColor: '#eeeeee',
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
		props.moveSlideItem(dragIndex, hoverIndex, props.groupId);

		// Note: we're mutating the monitor item here!
		// Generally it's better to avoid mutations,
		// but it's good here for the sake of performance
		// to avoid expensive index searches.
		monitor.getItem().index = hoverIndex;
	},

	// drop(props, monitor, component) {
	// 	// const dragIndex = monitor.getItem();
	// 	// const hoverIndex = props.index;
	// 	// console.log("on drop", dragIndex, hoverIndex);
	// 	props.dropPageItem(props.id, props.index);
	// },
};

class SlideItem extends Component {
	static propTypes = {
		slide: PropTypes.arrayOf(PropTypes.object).isRequired,
		elementMap: PropTypes.object.isRequired,
		onDelete: PropTypes.func,
		onSave: PropTypes.func,
		pageForm: PropTypes.object,
		connectDragSource: PropTypes.func.isRequired,
		connectDropTarget: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
		isDragging: PropTypes.bool.isRequired,
		// id: PropTypes.any.isRequired,
	}

	static defaultProps = {
		slide: [],
		index: 0,
		onDelete: () => {},
		onSave: () => {},
	}

	constructor(props) {
		super(props);
		this.state = {
			activeEditIndex: null,
		};
		this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
		this.onEditButtonClick = this.onEditButtonClick.bind(this);
		this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
	}

	onDeleteButtonClick() {
		const { slide, index, onDelete } = this.props;
		onDelete(slide, index);
	}

	onEditButtonClick() {
		const { index } = this.props;
		this.setState({ activeEditIndex: index });
	}

	onSaveButtonClick() {
		const { slide, index } = this.props;
		this.setState({ activeEditIndex: null });
		this.props.onSave(slide, index);
	}

	render() {
		const {
			slide,
			elementMap,
			index,
			pageForm,
			isDragging,
			connectDragSource,
			connectDropTarget,
		} = this.props;
		const { activeEditIndex } = this.state;

		const opacity = isDragging ? 0 : 1;
		const showEdit = index === activeEditIndex ? 'show-edit' : '';

		return connectDragSource(connectDropTarget(
		// return (
			<div style={{ ...style, opacity }}>
				<div className={`slide ${showEdit}`}>
					<div className="info">
						{slide.map((el) => {
							const InputComponent = elementMap[el.type.toLowerCase()];
							const nameKey = `${el.type}[${el.id}]`;
							const value = pageForm ? pageForm[nameKey] : '';
							const label = el.name;
							return (
								<div key={el.id}>
									{!showEdit && el.type.toLowerCase() === 'title' ?
										<h4>{el.body || value}</h4> : null
									}
									{!showEdit && el.type.toLowerCase() === 'image' ?
										<div
											className="img"
											style={{ backgroundImage: `url('${el.imageURL}')` }}
											alt={el.imageURL}
										/>
										:
										null
									}
									<div className="edit">
										<Field
											{...el}
											label={label}
											value={value}
											onFieldChange={this.props.onFieldChange}
											key={nameKey}
											name={nameKey}
											component={InputComponent}
										/>
									</div>
								</div>
							);
						})}
					</div>
					<div className="buttons">
						{!showEdit ?
							<button
								className="button button-outline button-small"
								onClick={this.onEditButtonClick}
							>
								Edit Slide
							</button>
							:
							<button
								className="button button-outline button-small"
								onClick={this.onSaveButtonClick}
							>
								Save Slide
							</button>
						}
						<button
							className="button button-outline button-small"
							onClick={this.onDeleteButtonClick}
						>
							Delete Slide
						</button>
					</div>
				</div>
			</div>,
		));
		// );
	}
}

// export default SlideItem;
const dropSlideItem = DropTarget(ItemTypes.SLIDE_ITEM,
	pageItemTarget,
	dropCollect)(SlideItem);

export default DragSource(ItemTypes.SLIDE_ITEM,
	pageItemSource,
	dragCollect)(dropSlideItem);
