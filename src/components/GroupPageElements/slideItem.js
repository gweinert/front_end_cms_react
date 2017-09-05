import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Field from '../ReduxFields/field';

import './slideItem.css';

class SlideItem extends Component {
	static propTypes = {
		slide: PropTypes.arrayOf(PropTypes.object).isRequired,
		index: PropTypes.number,
		elementMap: PropTypes.object.isRequired,
		onDelete: PropTypes.func,
		onSave: PropTypes.func,
		pageForm: PropTypes.object,
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
		} = this.props;
		const { activeEditIndex } = this.state;

		const showEdit = index === activeEditIndex ? 'show-edit' : '';

		return (
			<div className={`slide ${showEdit}`}>
				<h2>Slide {index + 1}</h2>
				{slide.map((el) => {
					const InputComponent = elementMap[el.type.toLowerCase()];
					const nameKey = `${el.type}[${el.id}]`;
					const value = pageForm ? pageForm[nameKey] : '';
					return (
						<div>
							{el.type.toLowerCase() === 'title' ?
								<h4>{el.body}</h4> : null
							}
							<div className="edit">
								<Field
									{...el}
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
				<button
					onClick={this.onDeleteButtonClick}
				>
					Delete Slide
				</button>
				{!showEdit ?
					<button
						onClick={this.onEditButtonClick}
					>
						Edit Slide
					</button>
					:
					<button
						onClick={this.onSaveButtonClick}
					>
						Save Slide
					</button>
				}
			</div>
		);
	}
}

export default SlideItem;
