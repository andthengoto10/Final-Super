import React from "react";
// import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {} from "../../../../actions/authActions";
import classes from "../../dashboard.module.scss";
import Data from "../../Data.json";

class Profile extends React.Component {
  render() {
    const MyData = Data;
    console.log(MyData);
    return (
      <section className={classes.profileContainer}>
        <header />
        <section className={classes.content}>
          <form action="">
            <img src={MyData[0].photo} alt={MyData[0].firstName} />
            <label htmlFor="id">ID:</label>
            <input type="text" value={MyData[0].rfId} />
            <hr />
            <label htmlFor="chipNumber">Chip Number:</label>
            <input type="text" value={MyData[0].chipNumber} />
            <hr />
            <label htmlFor="Firstname">First Name:</label>
            <input type="text" value={MyData[0].firstName} />
            <hr />
            <label htmlFor="Lastname">Last Name:</label>
            <input type="text" value={MyData[0].lastName} />
            <hr />
            <label htmlFor="telefon">Tel:</label>
            <input type="text" value={MyData[0].telefon} />
            <hr />
            <label htmlFor="email">E-mail:</label>
            <input type="text" value={MyData[0].email} />
            <hr />
            <label htmlFor="plz">PLZ:</label>
            <input type="text" value={MyData[0].adresse.plz} />
            <hr />
            <label htmlFor="adresse">Addresse:</label>
            <input type="text" value={MyData[0].adresse.stadt + ", "} />
            <input type="text" value={MyData[0].adresse.street + "Str. "} />
            <input type="text" value={MyData[0].adresse.hausNummer} />
            <hr />
            <label htmlFor="roles">Roles:</label>
            <input type="text" value={MyData[0].roles} />
            <hr />
            <label htmlFor="matrikelNummer">Matrikel Nummer:</label>
            <input type="text" value={MyData[0].matrikelNummer} />
            <hr />
            <label htmlFor="isVerified">isVerified:</label>
            <input type="text" value={MyData[0].isVerified} />
            <hr />
            <input type="submit" value="Save" />
          </form>
          <div className="portfolioSwiper">{/* <Slide /> */}</div>
        </section>
      </section>
    );
  }
}
Profile.propTypes = {};
const mapStateToProps = state => ({});

export default connect(mapStateToProps, null)(Profile);
