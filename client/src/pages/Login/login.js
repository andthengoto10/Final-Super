import React from "react";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { toast } from "react-toastify";
import classes from "../../assest/form.module.scss";
import axios from "axios";

// to validate the form
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  password: Yup.string()
    .required("Required")
    .min(6, "Password is too short")
});
class Login extends React.Component {
  state = {
    email: "",
    msg: null,
    error: null,
    isHide: true,
    isVerified: true
  };
  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.error) {
      this.setState({ error: nextProps.error });
    }
    if (!nextProps.isVerified) {
      this.setState({ isVerified: false });
    }
    this.setState({ isVerified: nextProps.isVerified });
  }
  submitHandler(values) {
    this.setState({ email: values.email, isVerified: true });
    this.props.loginUser(values); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
  }
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
  sendEmailVerify = () => {
    const userData = {};
    userData.email = this.state.email;
    console.log(userData);
    axios.post("/resendVerifyEmail", userData).then(res => {
      console.log(res);
      if (res.data.status === "success") {
        toast.info(<div>{res.data.msg}</div>);
      } else {
        this.setState({ msg: res.data.msg });
      }
      this.setState({ isVerified: true });
    });
  };
  render(props) {
    // to hide the error message if the user does not close it
    toast.dismiss();
    return (
      <div className={classes.formContainer}>
        <h1>Welcome</h1>
        {!this.state.isVerified && (
          <p className={classes.msgErrors}>
            Your account has not been verified, please check your email.!
            <br />
            <span onClick={this.sendEmailVerify} className={classes.sendEmail}>
              or click here to send email again
            </span>
          </p>
        )}
        {this.state.msg && !this.state.isVerified && (
          <p className={classes.msgErrors}>{this.state.msg}</p>
        )}
        <Formik
          initialValues={{
            email: "",
            password: ""
          }}
          validationSchema={SignInSchema}
          onSubmit={values => {
            this.submitHandler(values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div>
                <Field type="email" placeholder="Enter Email" name="email" />
                {errors.email && touched.email ? (
                  <div className={classes.errors}>{errors.email}</div>
                ) : null}
              </div>
              <div>
                <Field
                  type="password"
                  placeholder="Enter Password"
                  name="password"
                  id="inputPassword"
                />
                {errors.password && touched.password ? (
                  <div className={classes.errors}>{errors.password}</div>
                ) : null}
                <i
                  className={
                    this.state.isHide ? "fas fa-eye-slash" : "fas fa-eye "
                  }
                  onClick={this.passwordHandler}
                />
                <Link to="/forgotPassword" className={classes.forgotPassword}>
                  Forgot your password?
                </Link>
              </div>
              <input type="submit" value="Login" />
              <p>
                Create a Account? <Link to="/register">Register</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  error: PropTypes.object.isRequired,
  isVerified: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error,
  isVerified: state.isVerified
});

export default connect(mapStateToProps, { loginUser })(Login);
