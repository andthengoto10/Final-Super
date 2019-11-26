import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllPersons } from '../../../actions/personsActions';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import FormEditor from './formEditore';
import RolesEditor from './rolesEditor';
import classes from '../dashboard.module.scss';

// to add the circle in the colum isVerified.
const isVerifiedFormatter = (cell, row) => {
	if (cell === true) {
		return '<i class="fas fa-circle green"></i> ' + cell;
	}
	return '<i class="fas fa-circle red"></i> ' + cell;
};
// to add and style the roles items in the colum roles.
const rolesFormatter = (cell, row) => {
	if (cell[0] === 'Null') {
		return <span style={{ color: '#ff000088' }}>{(cell || []).join(', ')}</span>;
	} else if (cell[0] === 'App Manager') {
		return <span style={{ color: '#000033' }}>{(cell || []).join(', ')}</span>;
	}
	return <span>{(cell || []).join(', ')}</span>;
};

/*
	The getElement function take two arguments,
    1. onUpdate: if you want to apply the modified data, call this function
    2. props: contain customEditorParameters, whole row data, defaultValue and attrs
*/
const createTextEditor = (onUpdate, props) => <FormEditor onUpdate={onUpdate} {...props} />;
const createRolesEditor = (onUpdate, props) => <RolesEditor onUpdate={onUpdate} {...props} />;

class Members extends React.Component {
	componentDidMount() {
		this.props.getAllPersons();
	}
	render() {
		const cellEditProp = {
			mode: 'click'
		};
		const { persons } = this.props.persons;
		return (
			<section className={classes.membersContainer}>
				<BootstrapTable
					data={persons}
					cellEdit={cellEditProp}
					search={true}
					multiColumnSearch={true}
					pagination={true}
					headerStyle={{ color: '#000033' }}
					options={{
						sizePerPage: 5,
						sizePerPageList: [ 5, 10, { text: 'All', value: persons.length } ],
						clearSearch: true
					}}
				>
					<TableHeaderColumn
						dataField="rfId"
						dataSort={true}
						customEditor={{ getElement: createTextEditor }}
						thStyle={{ width: '15%' }}
						tdStyle={{ width: '15%' }}
					>
						Chip Number
					</TableHeaderColumn>
					<TableHeaderColumn
						dataField="firstName"
						customEditor={{ getElement: createTextEditor }}
						thStyle={{ width: '15%' }}
						tdStyle={{ width: '15%' }}
					>
						Name
					</TableHeaderColumn>
					<TableHeaderColumn dataField="email" customEditor={{ getElement: createTextEditor }}>
						E-mail
					</TableHeaderColumn>
					<TableHeaderColumn
						dataField="roles"
						dataFormat={rolesFormatter}
						customEditor={{ getElement: createRolesEditor }}
					>
						Roles
					</TableHeaderColumn>
					<TableHeaderColumn
						isKey
						dataField="isVerified"
						thStyle={{ width: '90px' }}
						tdStyle={{ width: '90px' }}
						dataFormat={isVerifiedFormatter}
					>
						Verified
					</TableHeaderColumn>
				</BootstrapTable>
			</section>
		);
	}
}

Members.propTypes = {
	getAllPersons: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
	persons: state.persons
});

export default connect(mapStateToProps, { getAllPersons })(Members);
