// const IP_ADDRESS = 'http://192.168.0.189:8080';
const IP_ADDRESS = 'http://localhost:8080';


export function GET(url, requestDispatch, successDispatch, errorDispatch) {
	return (dispatch) => {
		dispatch(requestDispatch());

		return fetch(`${IP_ADDRESS}/${url}`,
			{ credentials: 'include' })
			.then((res) => {
				if (res.ok) return res.json();
				throw new TypeError('Oops, probably a 404!');
			})
			.then(json => dispatch(successDispatch(json)))
			.catch((error) => {
				console.error(error);
				return dispatch(errorDispatch(error));
			});
	};
}

export function POST(url, formData, requestDispatch, successDispatch, errorDispatch) {
	return (dispatch) => {
		dispatch(requestDispatch());

		return fetch(`${IP_ADDRESS}/${url}`,
			{
				credentials: 'include',
				method: 'POST',
				body: formData,
			})
			.then((res) => {
				if (res.ok) return res.json();
				throw new TypeError('Oops, probably a 404!');
			})
			.then((json) => {
				if (json.success) {
					return dispatch(successDispatch(json));
				}

				return dispatch(errorDispatch(json));
			})
			.catch((error) => {
				console.error(error);
				return dispatch(errorDispatch(error));
			});
	};
}

