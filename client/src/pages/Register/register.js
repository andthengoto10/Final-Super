import React from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import classes from "../../assest/form.module.scss";
import ReCAPTCHA from "react-google-recaptcha";

// to validate the form
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password is too short - should be 8 chars minimum.")
});
class Register extends React.Component {
  state = {
    errors: {},
    isHide: true,
    isNotRobot: false
  };
  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }
  submitHandler = values => {
    const recaptcha = document.querySelector("iframe[name]");
    if (this.state.isNotRobot) {
      this.props.registerUser(values, this.props.history);
    } else {
      recaptcha.style.border = "1px solid red";
      toast.dismiss();
      toast.error(<div>Please check the box 'I am not a Robot'</div>);
    }
  };
  // to show and hide the password
  passwordHandler = () => {
    const inputPassword = document.getElementById("inputPassword");
    if (this.state.isHide) {
      inputPassword.type = "text";
      this.setState({ isHide: false });
    } else {
      inputPassword.type = "password";
      this.setState({ isHide: true });
    }
  };
  onReCAPTCHA = value => {
    const recaptcha = document.querySelector("iframe[name]");
    recaptcha.style.border = "none";
    this.setState({ isNotRobot: !this.state.isNotRobot });
  };
  render() {
    // to hide the error message if the user does not close it
    toast.dismiss();
    return (
      <div className={classes.formContainer}>
        <h1>Register</h1>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: ""
          }}
          validationSchema={SignUpSchema}
          onSubmit={values => {
            this.submitHandler(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <Field
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                />
                {errors.firstName && touched.firstName ? (
                  <div className={classes.errors}>{errors.firstName}</div>
                ) : null}
              </div>
              <div>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                />
                {errors.lastName && touched.lastName ? (
                  <div className={classes.errors}>{errors.lastName}</div>
                ) : null}
              </div>
              <div>
                <Field name="email" type="email" placeholder="Enter Email" />
                {errors.email && touched.email ? (
                  <div className={classes.errors}>{errors.email}</div>
                ) : null}
              </div>
              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Create Password"
                  id="inputPassword"
                />
                {errors.password && touched.password ? (
                  <div className={classes.errors}>{errors.password}</div>
                ) : null}
                <i
                  className={
                    this.state.isHide ? "fas fa-eye-slash" : "fas fa-eye"
                  }
                  onClick={this.passwordHandler}
                />
              </div>
              <input type="submit" value="Register" />
              <p>
                Already have an account <Link to="/login">Login</Link>
              </p>
            </Form>
          )}
        </Formik>
        <ReCAPTCHA
          sitekey="6LeD97oUAAAAAJ8qELK18cJ0kKXaol2O_aoVIggn"
          onChange={this.onReCAPTCHA}
          className={classes.notRobot}
          hl={"en"}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  msg: state.msg
});
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
