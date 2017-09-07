import React from 'react';
import PropTypes from 'prop-types';
import './modal.css';

const Modal = ({ show, onCloseClick, children }) => {
	const showClass = show ? 'show' : '';

	return (
		<div className={`modal-container ${showClass}`}>
			<div className="modal">
				<button
					className="close"
					onClick={onCloseClick}
				>
					<h2>X</h2>
				</button>
				<div className="modal-inner">
					{children}
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	show: PropTypes.bool,
	onCloseClick: PropTypes.func,
	children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

Modal.defaultProps = {
	show: false,
	onCloseClick: () => {},
	children: null,
};

export default Modal;
