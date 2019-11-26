import { combineReducers } from 'redux';
import authReducer from './authReducers';
import errorReducer from './errorReducers';
import personsReducer from './personsReducer';
import chipsReducer from './chipsReducer';

const rootReducer = combineReducers({
	auth: authReducer,
	errors: errorReducer,
	persons: personsReducer,
	chips: chipsReducer
});

export default rootReducer;
