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
const ForgotPassSchema = Yup.object().shape({
	email: Yup.string().email('Invalid email').required('Required')
});

class ForgotPassword extends React.Component {
	submitHandler = (values) => {
		axios.post('/forgotPassword', values).then((res) => {
			if (res.data.status === 'success') {
				toast.info(message(`${res.data.result}`));
			} else {
				toast(message(res.data.msg), options);
			}
		});
	};
	render() {
		return (
			<div className={classes.formContainer}>
				<h1>Forgot Password</h1>
				<Formik
					initialValues={{
						email: ''
					}}
					validationSchema={ForgotPassSchema}
					onSubmit={(values) => {
						this.submitHandler(values);
					}}
				>
					{({ errors, touched }) => (
						<Form>
							<div>
								<label>Please type your email address to change your password</label>
								<Field type="email" placeholder="Email Addess" name="email" />
								{errors.email && touched.email ? (
									<div className={classes.errors}>{errors.email}</div>
								) : null}
							</div>
							<input type="submit" value="Send Email" />
						</Form>
					)}
				</Formik>
			</div>
		);
	}
}
export default ForgotPassword;
