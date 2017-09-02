import React, { Component } from 'react';
import PropTypes 			from 'prop-types';

class PageButton extends Component {
	static propTypes = {
		id: PropTypes.number,
		title: PropTypes.string,
		onClick: PropTypes.func,
	}

	static defaultProps = {
		id: 0,
		title: '',
		onClick: () => {},
	}

	constructor(props) {
		super(props);
		this.onPageListItemClick = this.onPageListItemClick.bind(this);
	}

	onPageListItemClick() {
		const { id, onClick } = this.props;

		onClick(id);
	}

	render() {
		const { title } = this.props;

		return (
			<button
				onClick={this.onPageListItemClick}
			>
				{title}
			</button>
		);
	}
}

export default PageButton;
