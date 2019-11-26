import React from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING, USER_IS_VERIFIED } from './types';
import { toast } from 'react-toastify';

const message = (msg) => <div>{msg}</div>;
const options = {
	autoClose: false,
	type: toast.TYPE.ERROR,
	hideProgressBar: false
};

// Register User
export const registerUser = (userData, history) => (dispatch) => {
	axios
		.post('/register', userData)
		.then((res) => {
			// console.log(res);
			if (res.data.status === 'success') {
				history.push('/login'); // re-direct to login on successful register
				toast.info(
					message(`Hello ${res.data.user.firstName}, please check your email to verify your account.!`)
				);
			} else {
				toast.dismiss();
				toast(message(res.data.msg), options);
			}
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};
// Login - get user token
export const loginUser = (userData) => (dispatch) => {
	axios
		.post('/login', userData)
		.then((res) => {
			// console.log(res);
			if (res.data.status === 'isNotUser') {
				toast.dismiss();
				return toast(message(res.data.msg), options);
			}
			if (res.data.status === 'isNotVerified') {
				return dispatch(isNotVerified());
			}
			if (res.data.status === 'error') {
				toast.dismiss();
				return toast(message(res.data.msg), options);
			} else {
				// Set token to localStorage
				const token = res.data.token;
				localStorage.setItem('jwtToken', token);
				// Set token to Auth header
				setAuthToken(token);
				// Decode token to get user data
				const decoded = jwt_decode(token);
				// Set current user
				dispatch(setCurrentUser(decoded));
			}
		})
		.catch((err) =>
			dispatch({
				type: GET_ERRORS,
				payload: err
			})
		);
};
// Set logged in user
export function setCurrentUser(decoded) {
	return {
		type: SET_CURRENT_USER,
		payload: decoded
	};
}
// User isNotVerified
export const isNotVerified = () => {
	return {
		type: USER_IS_VERIFIED
	};
};
// User loading
export const setUserLoading = () => {
	return {
		type: USER_LOADING
	};
};
// Log user out
export const logoutUser = () => (dispatch) => {
	// Remove token from local storage
	localStorage.removeItem('jwtToken');
	// Remove auth header for future requests
	setAuthToken(false);
	// Set current user to empty object {} which will set isAuthenticated to false
	dispatch(setCurrentUser({}));
};
