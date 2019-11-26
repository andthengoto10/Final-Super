import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { editPersonData } from '../../../actions/personsActions';
import classes from '../dashboard.module.scss';

// to validate the form
const EditSchema = Yup.object().shape({
	firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
	rfId: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
	email: Yup.string().email('Invalid email').required('Required')
});

class FormEditor extends React.Component {
	constructor(props) {
		super(props);
		this.submitHandler = this.submitHandler.bind(this);
		this.state = {
			personData: {
				_id: props.row._id,
				firstName: props.row.firstName,
				rfId: props.row.rfId,
				email: props.row.email
			},
			roles: props.row.roles,
			isOpen: true
		};
	}
	submitHandler(values) {
		let personData = {
			roles: this.state.roles,
			...values
		};
		this.props.onUpdate(this.props.defaultValue);
		this.props.editPersonData(personData);
		this.setState({ isOpen: false });
	}
	close = () => {
		this.setState({ isOpen: false });
		this.props.onUpdate(this.props.defaultValue);
	};
	render() {
		return (
			<React.Fragment>
				{this.state.isOpen ? (
					<div className={classes.editContainer}>
						<Formik
							initialValues={{ ...this.state.personData }}
							validationSchema={EditSchema}
							onSubmit={(values) => {
								this.submitHandler(values);
							}}
						>
							{({ errors, touched }) => (
								<Form>
									<div className={classes.inputItem}>
										<label>First Name:</label>
										<Field type="text" name="firstName" placeholder="Enter First Name" />
										{errors.firstName && touched.firstName ? (
											<div className={classes.errors}>{errors.firstName}</div>
										) : null}
									</div>
									<div className={classes.inputItem}>
										<label>Email:</label>
										<Field name="email" placeholder="Enter Email" type="email" />
										{errors.email && touched.email ? (
											<div className={classes.errors}>{errors.email}</div>
										) : null}
									</div>
									<div className={classes.inputItem}>
										<label>Chip Number:</label>
										<Field type="text" name="rfId" placeholder="Enter Chip Number" />
										{errors.rfId && touched.rfId ? (
											<div className={classes.errors}>{errors.rfId}</div>
										) : null}
									</div>
									<div className={classes.inputItem}>
										<button type="button" onClick={this.close}>
											Close
										</button>
										<input type="submit" value="Save" />
									</div>
								</Form>
							)}
						</Formik>
						<div className={classes.blackBg} onClick={this.close} />
					</div>
				) : null}
			</React.Fragment>
		);
	}
}

FormEditor.propTypes = {
	editPersonData: PropTypes.func.isRequired
};

export default connect(null, { editPersonData })(FormEditor);
