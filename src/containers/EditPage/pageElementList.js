import React from 'react';
import PropTypes from 'prop-types';

const PageElementList = ({ elements, elementMap }) => (
	<div>
		{elements.map((el, index) => {
			const InputComponent = elementMap[el.type.toLowerCase()];

			return (
				InputComponent ? <InputComponent key={el.id} {...el} /> : null
			);
		})}
	</div>
);

PageElementList.propTypes = {
	elements: PropTypes.arrayOf(PropTypes.object),
	elementMap: PropTypes.object,
};

PageElementList.defaultProps = {
	elements: [],
};

export default PageElementList;
