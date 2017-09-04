import React, { Component } from 'react';
import PropTypes from 'prop-types';

// const GroupElementList = ({ el, elementMap, index, group }) => {
class GroupElementList extends Component {
	static propTypes = {
		el: PropTypes.object.isRequired,
		elementMap: PropTypes.object.isRequired,
		index: PropTypes.number.isRequired,
		group: PropTypes.object.isRequired,
	}

	static defaultProps = {
		group: [],
	}

	render() {
		const {
			el,
			elementMap,
			index,
			group,
		} = this.props;

		const elementsPerSlide = group.structure
			.reduce((accum, item) => (
				accum.amount ? accum.amount + item.amount : accum + item.amount
			), 0);
		const slideNum = Math.floor(index / elementsPerSlide);
		const endOfSlide = Math.floor((index + 1) / elementsPerSlide) > slideNum;
		const InputComponent = elementMap[el.type.toLowerCase()];

		return (
			<div>
				{InputComponent ?
					<InputComponent
						key={el.id}
						{...el}
					/>
					: null
				}
				{ endOfSlide ?
					<button
						onClick={() => this.onDeleteButtonClick(el)}
					>
						Delete Slide
					</button>
					:
					null
				}
			</div>
		);
	}
}

export default GroupElementList;

