import { SET_CURRENT_USER, USER_LOADING, USER_IS_VERIFIED } from '../actions/types';

const isEmpty = require('is-empty');

const initialState = {
	isAuthenticated: false,
	user: {},
	loading: false,
	isVerified: true
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				isAuthenticated: !isEmpty(action.payload),
				user: action.payload
			};
		case USER_LOADING:
			return {
				...state,
				loading: true
			};
		case USER_IS_VERIFIED:
			return {
				...state,
				isVerified: false
			};
		default:
			return state;
	}
}
