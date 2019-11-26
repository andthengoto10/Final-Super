import React from 'react';
import axios from 'axios';
import { GET_ALL_PERSONS } from './types';
import { toast } from 'react-toastify';

const message = (msg) => <div>{msg}</div>;
const options = {
	autoClose: false,
	type: toast.TYPE.ERROR,
	hideProgressBar: false
};

// Get all persons data
export const getAllPersons = () => (dispatch) => {
	axios.get('/dashboard/persons').then((res) => {
		if (res.data.status === 'success') {
			dispatch(setPersons(res.data.persons));
		}
	});
};

// Edit person data
export const editPersonData = (personData) => (dispatch) => {
	axios.post('/dashboard/editPerson', personData).then((res) => {
		if (res.data.status === 'success') {
			// to get the new data after edit
			dispatch(getAllPersons());
		} else {
			toast.dismiss();
			toast(message(res.data.msg), options);
		}
	});
};

// Set persons in global array
export function setPersons(persons) {
	return {
		type: GET_ALL_PERSONS,
		payload: persons
	};
}
