import {
	fetchUsersSiteIfNeeded,
} from './fetch';

import {
	setActivePage,
	createNewPageSafely,
	deletePageSafely,
} from './page';

import {
	createPageElement,
	deletePageElementsWithId,
} from './element';

import {
	updatePageSafely,
} from './update';

import {
	createPageElementGroup,
	createPageElementsForGroup,
	savePageElementsForGroup,
	// deletePageElementsForGroup,
} from './group';

import {
	loadForm,
	onFieldChange,
} from './form';

export {
	fetchUsersSiteIfNeeded,
	setActivePage,
	createNewPageSafely,
	deletePageSafely,
	createPageElement,
	deletePageElementsWithId,
	createPageElementGroup,
	createPageElementsForGroup,
	savePageElementsForGroup,
	// deletePageElementsForGroup,
	updatePageSafely,
	loadForm,
	onFieldChange,
};
