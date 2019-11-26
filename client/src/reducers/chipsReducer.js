import { GET_ALL_CHIPS } from '../actions/types';

const initialState = {
	chips: []
};

export default function(state = initialState, action) {
	// console.log(action);

	switch (action.type) {
		case GET_ALL_CHIPS:
			return {
				...state,
				chips: action.payload
			};
		default:
			return state;
	}
}
