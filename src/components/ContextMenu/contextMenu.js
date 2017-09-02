import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ContextMenuListItem from './contextMenuListItem';
import './contextMenu.css';

function withContextMenu(WrappedComponent, contextMenuOptions) {
	return class ContextMenu extends Component {
		constructor(props) {
			super(props);
			this.state = {
				show: false,
				mousePosition: {
					x: 0,
					y: 0,
				},
			};
			this.onContextMenu = this.onContextMenu.bind(this);
			this.onContextMenuItemClick = this.onContextMenuItemClick.bind(this);
			this.showContextMenu = this.showContextMenu.bind(this);
			this.hideContextMenu = this.hideContextMenu.bind(this);
		}

		componentDidMount() {
			// console.log("withContextMenu", this, contextMenuOptions);
			this.contextMenu.addEventListener('contextmenu', this.onContextMenu);
			document.addEventListener('click', this.hideContextMenu);
		}

		componentWillUnmount() {
			this.contextMenu.removeEventListener('contextmenu', this.onContextMenu);
			document.addEventListener('click', this.hideContextMenu);
		}

		onContextMenu(e) {
			e.preventDefault();
			// console.log('onContextClick', e);
			this.showContextMenu(e);
		}

		onContextMenuItemClick(item) {
			this.wc.onContextMenuClick(item);
		}

		showContextMenu(e) {
			this.setState({
				show: true,
				mousePosition: {
					x: e.x,
					y: e.y,
				},
			});
		}

		hideContextMenu() {
			this.setState({ show: false });
		}

		renderMenuList(menu, isSubMenu) {
			const isSubMenuClass = isSubMenu ? 'sub-menu' : 'main-menu';
			const menuList = isSubMenu ? menu : Object.keys(menu);
			return (
				<ul className={isSubMenuClass}>
					{menuList.map((menuKey) => {
						const subMenu = Array.isArray(menu[menuKey]) ? menu[menuKey] : null;
						return (
							<ContextMenuListItem
								key={menuKey}
								subMenu={subMenu}
								menuKey={menuKey}
								onClick={this.onContextMenuItemClick}
							>
								{ subMenu ? this.renderMenuList(subMenu, true) : null }
							</ContextMenuListItem>
						);
					})}
				</ul>
			);
		}

		render() {
			const { menu } = contextMenuOptions;
			const { mousePosition, show } = this.state;
			const positionStyle = {
				left: mousePosition.x,
				top: mousePosition.y,
			};
			const showMenu = show ? 'show' : '';

			return (
				<div
					className="with-context-menu"
					ref={(contextMenu) => { this.contextMenu = contextMenu; }}
				>
					<WrappedComponent
						ref={(wc) => { this.wc = wc; }}
						{...this.props}
					/>
					<div
						className={`menu ${showMenu}`}
						style={positionStyle}
					>
						{this.renderMenuList(menu)}
					</div>

				</div>
			);
		}
	};
}

export default withContextMenu;

