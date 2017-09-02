import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ContextMenuListItem extends Component {
	static propTypes = {
		subMenu: PropTypes.arrayOf(PropTypes.string),
		menuKey: PropTypes.string,
		onClick: PropTypes.func,
		children: PropTypes.node,
	}

	static defaultProps = {
		subMenu: [],
		menuKey: '',
		onClick: () => {},
		children: null,
	}

	constructor(props) {
		super(props);
		this.onItemClick = this.onItemClick.bind(this);
	}

	onItemClick() {
		const { menuKey, onClick } = this.props;
		onClick(menuKey);
	}

	render() {
		const {
			subMenu,
			menuKey,
			children,
		} = this.props;

		return (
			<li>
				<button
					onClick={this.onItemClick}
				>
					<div>{menuKey}</div>
				</button>
				{children}
			</li>
		);
	}
}

export default ContextMenuListItem;
