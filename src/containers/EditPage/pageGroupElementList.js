import React from 'react';
import PropTypes from 'prop-types';
import PageElementList from './pageElementList';

const PageGroupElementList = ({ elements, elementMap }) => {
	const groupedElements = elements.filter(el => el.groupId !== 0)
		.reduce((accum, cur) => {
			(accum[cur.groupId] = accum[cur.groupId] || []).push(cur);
			return accum;
		}, {});

	if (Object.keys(groupedElements).length) {
		return (
			<div>
				{Object.keys(groupedElements).map((groupKey, index) => (
					<div className="group" key={groupKey}>
						<PageElementList
							elements={groupedElements[groupKey]}
							elementMap={elementMap}
						/>
					</div>
				))}
			</div>
		);
	}

	return null;
};

PageGroupElementList.propTypes = {
	elements: PropTypes.arrayOf(PropTypes.object),
	elementMap: PropTypes.object,
};

PageGroupElementList.defaultProps = {
	elements: [],
};

export default PageGroupElementList;
