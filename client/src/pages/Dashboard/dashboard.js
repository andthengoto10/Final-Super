import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Manager from './components/manager';
import Employee from './components/employee';
import { connect } from 'react-redux';

class Dashboard extends Component {
	// to check if the user has a role and what is it.!
	checkRoleOfUser(roles) {
		let userRole = null;
		for (let i = 0; i < roles.length; i++) {
			if (roles[i] === 'App Manager' || 'Company Manager') {
				userRole = roles[i];
			}
			return userRole;
		}
	}
	// to see which dashboard for this role
	userSwitch = (role) => {
		switch (this.checkRoleOfUser(role)) {
			case 'App Manager' || 'Company Manager':
				return <Manager />;
			default:
				return <Employee />;
		}
	};
	render() {
		const { user } = this.props.auth;
		return <React.Fragment>{this.userSwitch(user.roles)}</React.Fragment>;
	}
}
Dashboard.propTypes = {
	auth: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
	auth: state.auth
});

export default connect(mapStateToProps, null)(Dashboard);
