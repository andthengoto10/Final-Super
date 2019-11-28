import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {} from '../../../actions/authActions';
import classes from '../dashboard.module.scss';

class Profile extends React.Component {
	render() {
		return (
			<section className={classes.profileContainer}>
				<header />
				<section className={classes.content}>
					<figure />
					<h5>User Name</h5>
					<hr />
					<main />
					<div className="portfolioSwiper">{/* <Slide /> */}</div>
				</section>
			</section>
		);
	}
}
Profile.propTypes = {};
const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, null)(Profile);
