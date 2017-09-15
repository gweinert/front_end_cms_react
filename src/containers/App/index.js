// @flow
import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import {
	Route,
	withRouter,
} 							from 'react-router-dom';
import { connect } 			from 'react-redux';
import { DragDropContext } 	from 'react-dnd';
import HTML5Backend 		from 'react-dnd-html5-backend';
import Cookie 				from 'js-cookie';
import Login 				from '../Login';
import NavBar 				from '../../components/Navbar';
import Flash 				from '../../components/Flash/flash';
import EditPage 			from '../EditPage';
import PageTree 			from '../PageTree';
import {
	fetchUsersSiteIfNeeded,
	getUser,
} 							from '../../actions';
import './App.css';


class App extends Component {
	static propTypes = {
		site: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		page: PropTypes.shape({
			activePageId: PropTypes.number,
		}).isRequired,
		user: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		dispatch: PropTypes.func.isRequired,
	}

	static defaultProps = {
	}

	constructor(props) {
		super(props);
		this.state = {
			flashError: '',
			flashSuccess: '',
			flashTimeout: 5000,
		};
	}

	componentDidMount() {
		const { dispatch } = this.props;

		if (Cookie.get('sessionId')) {
			dispatch(getUser())
				.then((action) => {
					if (action.type === 'USER_SESSION_SUCCESS') {
						dispatch(fetchUsersSiteIfNeeded());
					}
				});
		}
	}

	// @dev after login success
	componentWillReceiveProps(nextProps) {
		const { dispatch } = this.props;

		// get data on successful login
		if (nextProps.user.loggedIn && !this.props.user.loggedIn) {
			dispatch(fetchUsersSiteIfNeeded());
		}

		// show user message on update/publish page success or fail
		this.showFlash(nextProps);
	}

	showFlash(nextProps) {
		const { site } = this.props;
		if ((site.isPosting && !nextProps.site.isPosting) ||
			(site.isPublishing && !nextProps.site.isPublishing)) {
			if (nextProps.site.error) {
				this.setState({ flashError: nextProps.site.error });
			} else {
				const message = site.isPosting ? 'Update Successful!' : 'Publish Successful!';
				this.setState({ flashSuccess: message });
			}

			window.setTimeout(() => this.setState({
				flashError: '',
				flashSuccess: '',
			}), this.state.flashTimeout);
		}
	}


	render() {
		const { site, page, user, dispatch } = this.props;
		const pages = site.data ? site.data.pages : [];
		const activePage = site.data &&
			site.data.pages.find(pageItem => pageItem.id === page.activePageId);

		return (
			<div className="App">
				<Flash
					error={this.state.flashError}
					success={this.state.flashSuccess}
				/>
				{ user.loggedIn ?
					<div>
						<NavBar
							user={user}
						/>
						<div className="main-app">
							<PageTree
								pages={pages}
								activePage={activePage}
							/>
							<div className="edit-container">
								<Route
									exact
									path="/"
									render={routeProps => (
										<EditPage
											{...routeProps}
											activePage={activePage}
											dispatch={dispatch}
										/>
									)}
								/>
							</div>
						</div>
					</div>
					:
					<Login
						dispatch={dispatch}
					/>
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	const { site, page, user } = state;

	return {
		site,
		page,
		user,
	};
};

const draggableApp = DragDropContext(HTML5Backend)(App);

export default withRouter(connect(mapStateToProps)(draggableApp));
// export default connect(mapStateToProps)(App);

