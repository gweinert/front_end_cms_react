import React from 'react';
import PropTypes from 'prop-types';

const PageElementList = ({ elements, elementMap, children }) => (
	<div>
		{elements.map((el, index) => {
			const InputComponent = elementMap[el.type.toLowerCase()];
			return (
				<div key={el.id}>
					<InputComponent {...el} />
				</div>
			);
		})}
	</div>
);


PageElementList.propTypes = {
	elements: PropTypes.arrayOf(PropTypes.object),
	elementMap: PropTypes.object,
	onInputChange: PropTypes.func,
	children: PropTypes.node,
};

PageElementList.defaultProps = {
	elements: [],
	children: null,
};

export default PageElementList;
