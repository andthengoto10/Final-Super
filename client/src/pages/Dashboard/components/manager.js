<<<<<<< HEAD
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../../actions/authActions';
import classes from '../dashboard.module.scss';
import DailyCheck from './dailyCheck';
import Members from './members';
import Profile from "./Profile/profile";

class Manager extends React.Component {
	state = {
		itemDisplayed: null,
		sidebarItems: [
			{
				id: 1,
				icon: 'fas fa-columns',
				text: 'Daily Check'
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
	clickHandler = (e) => {
		let itemDisplayed = e.target.innerText;
		this.setState({ itemDisplayed: itemDisplayed });
	};
	switchItemsInSidebar = (itemDisplayed) => {
		switch (itemDisplayed) {
			case 'Daily Check':
				return <DailyCheck />;
			case 'Members':
				return <Members />;
			case 'Profile':
				return <Profile />;
			default:
				return <h1 className={classes.comingSoon}>Coming soon.!</h1>;
		}
	};
	onLogoutClick = (e) => {
		e.preventDefault();
		this.props.logoutUser();
	};
	render() {
		const { user } = this.props.auth;
		return (
			<section className={classes.managerContainer}>
				<section className={classes.sidebarContainer}>
					<header>
						<i className="fas fa-user-tie" />
						<h4>{user.firstName}</h4>
					</header>
					<aside>
						<ul>
							{this.state.sidebarItems.map((item) => (
								<li key={item.id} onClick={(e) => this.clickHandler(e)}>
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
				{this.switchItemsInSidebar(this.state.itemDisplayed)}
			</section>
		);
	}
=======
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../../actions/authActions";
import classes from "../dashboard.module.scss";
import DaleyCheck from "./daleyCheck";
import Members from "./members";
import Profile from "./Profile/profile";

class Manager extends React.Component {
  state = {
    itemDisplayed: null,
    sidebarItems: [
      {
        id: 1,
        icon: "fas fa-columns",
        text: "Daley Check"
      },
      {
        id: 2,
        icon: "fas fa-user-tie",
        text: "Profile"
      },
      {
        id: 3,
        icon: "fas fa-users",
        text: "Members"
      },
      {
        id: 4,
        icon: "fas fa-border-all",
        text: "Category"
      },
      {
        id: 5,
        icon: "far fa-folder-open",
        text: "Archive"
      },
      {
        id: 6,
        icon: "far fa-calendar-alt",
        text: "Calendar"
      },
      {
        id: 7,
        icon: "fas fa-cog",
        text: "Setting"
      }
    ]
  };
  clickHandler = e => {
    let itemDisplayed = e.target.innerText;
    this.setState({ itemDisplayed: itemDisplayed });
  };
  switchItemsInSidebar = itemDisplayed => {
    switch (itemDisplayed) {
      case "Daley Check":
        return <DaleyCheck />;
      case "Members":
        return <Members />;
      case "Profile":
        return <Profile />;
      default:
        return <h1 className={classes.comingSoon}>Coming soon.!</h1>;
    }
  };
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  render() {
    const { user } = this.props.auth;
    return (
      <section className={classes.managerContainer}>
        <section className={classes.sidebarContainer}>
          <header>
            <i className="fas fa-user-tie" />
            <h4>{user.firstName}</h4>
          </header>
          <aside>
            <ul>
              {this.state.sidebarItems.map(item => (
                <li key={item.id} onClick={e => this.clickHandler(e)}>
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
        {this.switchItemsInSidebar(this.state.itemDisplayed)}
      </section>
    );
  }
>>>>>>> 057bbcb6b69e555669060914cb173db212eca0a1
}
Manager.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Manager);
