import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classes from './nav.module.scss';
import { logoutUser } from '../../actions/authActions';

class Nav extends React.Component {
	state = {
		isPrivateNav: false
	};
	// to check if the nav receiving props to know witch nav i have to display
	UNSAFE_componentWillReceiveProps(nextProps) {
		// console.log(nextProps);
		if (nextProps.auth.isAuthenticated) {
			this.setState({ isPrivateNav: true });
		} else {
			this.setState({ isPrivateNav: false });
		}
	}
	// to checking the status of the user (if he still logged in) when the page reloaded
	componentDidMount() {
		if (localStorage.getItem('jwtToken')) {
			this.setState({ isPrivateNav: true });
		} else {
			this.setState({ isPrivateNav: false });
		}
	}
	onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	};
	render() {
		return (
			<nav className={classes.navBar}>
				<Link to="/" className={classes.logo}>
					<img src={require('../../assest/Image/logo.png')} alt="logo" />
				</Link>
				<ul>
					<li>
						<NavLink to="/">Home</NavLink>
					</li>
					<li>
						{this.state.isPrivateNav ? (
							<NavLink to="/dashboard">Dashboard</NavLink>
						) : (
							<NavLink to="login">Login</NavLink>
						)}
					</li>
					<li>
						{this.state.isPrivateNav ? (
							<NavLink to="/" onClick={this.onLogoutClick}>
								Logout
							</NavLink>
						) : (
							<NavLink to="register">Register</NavLink>
						)}
					</li>
				</ul>
			</nav>
		);
	}
}
Nav.propTypes = {
	auth: PropTypes.object.isRequired,
	logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Nav);
