import React from 'react';
import axios from 'axios';
import { GET_ALL_CHIPS } from './types';
import { toast } from 'react-toastify';

const message = (msg) => <div>{msg}</div>;
const options = {
	autoClose: false,
	type: toast.TYPE.ERROR,
	hideProgressBar: false
};

// Get all chips data
export const getAllChips = () => (dispatch) => {
	axios.get('/dashboard/chips').then((res) => {
		if (res.data.status === 'success') {
			dispatch(setChips(res.data.chips));
		} else {
			toast.dismiss();
			toast(message(res.data.msg), options);
		}
	});
};

// Set chips in global array
export function setChips(chips) {
	return {
		type: GET_ALL_CHIPS,
		payload: chips
	};
}
