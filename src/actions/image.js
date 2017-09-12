import {
	REQUEST_IMAGE_UPLOAD,
	IMAGE_UPLOAD_SUCCESS,
	IMAGE_UPLOAD_FAIL,
	REQUEST_IMAGE_DELETE,
	DELETE_IMAGE_SUCCESS,
	DELETE_IMAGE_FAIL,
} from './actionCreators';
import { POST } from '../api';

function requestImageUpload() {
	return {
		type: REQUEST_IMAGE_UPLOAD,
	};
}

function imageUploadSuccess(payload) {
	return {
		type: IMAGE_UPLOAD_SUCCESS,
		payload,
	};
}

function imageUploadFail() {
	return {
		type: IMAGE_UPLOAD_FAIL,
	};
}

function upload(imageData) {
	const formData = JSON.stringify(imageData);
	return POST('image/upload', formData, requestImageUpload, imageUploadSuccess, imageUploadFail);
}

function shouldUploadImageToCloud(state) {
	if (state.isUploadingImage) {
		return false;
	}
	return true;
}

export function uploadImageToCloud(imageData) {
	return (dispatch, getState) => {
		if (shouldUploadImageToCloud(getState())) {
			return dispatch(upload(imageData));
		}
	};
}

function requestDeleteImage() {
	return {
		type: REQUEST_IMAGE_DELETE,
	};
}

function deleteImageSuccess(payload) {
	return {
		type: DELETE_IMAGE_SUCCESS,
		payload,
	};
}

function deleteImageFail() {
	return {
		type: DELETE_IMAGE_FAIL,
	};
}

function deleteImageFromCloud(ids, imageURLs) {
	const formData = JSON.stringify({ ids, imageURLs });
	return POST('image/delete', formData, requestDeleteImage, deleteImageSuccess, deleteImageFail);
}

function shouldDeleteImage(state) {
	if (state.site.isDeleting) {
		return false;
	}
	return true;
}

export function deleteImagesSafely(elementIds, imageURLs) {
	return (dispatch, getState) => {
		if (shouldDeleteImage(getState())) {
			// const elementIdInt = parseInt(elementId, 10);
			// const imageURL = getImageURLFromElementId(elementIdInt, getState());
			return dispatch(deleteImageFromCloud(elementIds, imageURLs));
		}
	};
}

// function getImageURLFromElementId(elementId, state) {
// 	const pageId = state.page.activePageId;
// 	const activePage = state.site.data.pages.find(page => page.id === pageId);
// 	const imageElement = activePage.elements.find(el => el.id === elementId);
// 	return imageElement.imageURL;
// }
