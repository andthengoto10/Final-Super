import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { logoutUser } from '../../../actions/authActions';
import { connect } from 'react-redux';
import classes from '../dashboard.module.scss';

class Sidebar extends Component {
	state = {
		sidebarItems: [
			{
				id: 1,
				icon: 'fas fa-columns',
				text: 'Dashboard'
			},
			{
				id: 2,
				icon: 'fas fa-user-tie',
				text: 'Profile'
			},
			{
				id: 3,
				icon: 'fas fa-users',
				text: 'Members'
			},
			{
				id: 4,
				icon: 'fas fa-border-all',
				text: 'Category'
			},
			{
				id: 5,
				icon: 'far fa-folder-open',
				text: 'Archive'
			},
			{
				id: 6,
				icon: 'far fa-calendar-alt',
				text: 'Calendar'
			},
			{
				id: 7,
				icon: 'fas fa-cog',
				text: 'Setting'
			}
		]
	};
	onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	};
	clickHandler = (e) => {
		this.props.switchItemsInSidebar(e.target.innerText);
	};
	render() {
		return (
			<section className={classes.sidebarContainer}>
				<header>
					<i className="fas fa-user-tie" />
					<h4>{this.props.user.firstName}</h4>
				</header>
				<aside>
					<ul>
						{this.state.sidebarItems.map((item) => (
							<li key={item.id} onClick={this.clickHandler}>
								<i className={item.icon} />
								{item.text}
							</li>
						))}
					</ul>
				</aside>
				<footer>
					<button onClick={this.onLogoutClick}>
						<i className="fas fa-sign-out-alt" />
						<p>Logout</p>
					</button>
				</footer>
			</section>
		);
	}
}
Sidebar.propTypes = {
	auth: PropTypes.object.isRequired,
	logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Sidebar);
