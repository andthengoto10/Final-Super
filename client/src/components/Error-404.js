import React from 'react';
import { Link } from 'react-router-dom';

export default function Error404() {
	return (
		<div>
			<h1>Error 404</h1>
			<Link to="/">Go To HomePage</Link>
		</div>
	);
}
