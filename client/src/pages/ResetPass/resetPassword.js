import React from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import classes from '../../assest/form.module.scss';

const message = (msg) => <div>{msg}</div>;
const options = {
	autoClose: false,
	type: toast.TYPE.ERROR,
	hideProgressBar: false
};

// to validate the form
const ResetPassSchema = Yup.object().shape({
	password: Yup.string().required('Required').min(6, 'Password is too short - should be 6 chars minimum.')
});

class ResetPassword extends React.Component {
	state = {
		email: null,
		error: null,
		updated: false
	};
	componentDidMount() {
		axios.post(`/resetPassword/${this.props.match.params.id}`).then((response) => {
			if (response.data.status === 'success') {
				this.setState({ email: response.data.email });
			} else {
				this.setState({ error: response.data.msg });
			}
		});
	}
	submitHandler = (values) => {
		let userData = {
			email: this.state.email,
			...values
		};
		axios.post('/updatePasswordViaEmail', userData).then((response) => {
			if (response.data.status === 'success') {
				this.setState({ updated: true });
			} else {
				this.setState({ updated: false });
				toast(message(response.data.msg), options);
			}
		});
	};
	loginHandler = () => {
		this.props.history.replace('/login');
	};
	sendEmailAgainHandler = () => {
		this.props.history.replace('/forgotPassword');
	};
	render() {
		return (
			<div className={classes.formContainer}>
				{this.state.error && (
					<div className="resetPassword">
						<h3>{this.state.error}</h3>
						<button onClick={this.sendEmailAgainHandler}>Send Email Again</button>
					</div>
				)}
				{this.state.updated && (
					<div className="resetPassword">
						<h3>Your password has been successfully reset, please try logging in again. </h3>
						<button onClick={this.loginHandler}>Login</button>
					</div>
				)}
				{!this.state.error &&
				!this.state.updated && (
					<React.Fragment>
						<h1>Reset Password</h1>
						<Formik
							initialValues={{
								password: ''
							}}
							validationSchema={ResetPassSchema}
							onSubmit={(values) => {
								this.submitHandler(values);
								console.log(values);
							}}
						>
							{({ errors, touched }) => (
								<Form>
									<div>
										<label>{this.state.email}</label>
									</div>
									<div>
										<Field type="password" placeholder="Enter New Password" name="password" />
										{errors.password && touched.password ? (
											<div className={classes.errors}>{errors.password}</div>
										) : null}
									</div>
									<input type="submit" value="Save" />
								</Form>
							)}
						</Formik>
					</React.Fragment>
				)}
			</div>
		);
	}
}
export default ResetPassword;
