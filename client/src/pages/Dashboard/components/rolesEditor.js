import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import classes from '../dashboard.module.scss';

const roles = [ 'Manager', 'Member', 'Null' ];

class RolesEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			personData: {
				_id: props.row._id,
				firstName: props.row.firstName,
				rfId: props.row.rfId,
				email: props.row.email
			},
			roles: props.defaultValue
		};
		this.updateData = this.updateData.bind(this);
		this.onToggleRoles = this.onToggleRoles.bind(this);
	}
	onToggleRoles(event) {
		const roles = event.currentTarget.name;
		if (this.state.roles[0] === 'App Manager') {
			return;
		} else if (this.state.roles.indexOf(roles) < 0) {
			this.setState({ roles: [ roles ] });
		} else {
			this.setState({ roles: this.state.roles.filter((r) => r !== roles) });
		}
	}
	updateData() {
		this.props.onUpdate(this.state.roles);
		let personData = {
			roles: this.state.roles,
			...this.state.personData
		};
		axios.post('/dashboard/editPerson', personData).then((res) => {
			// console.log(res);
			if (res.data.status === 'success') {
				this.setState({ open: false });
			} else {
				toast.dismiss();
				toast.error(<div>{res.data.msg}</div>);
			}
		});
	}
	render() {
		const rolesCheckBoxes = roles.map((roles) => (
			<div key={`div-${roles}`}>
				<input
					type="radio"
					key={roles}
					name={roles}
					checked={this.state.roles.indexOf(roles) > -1}
					onKeyDown={this.props.onKeyDown}
					onChange={this.onToggleRoles}
				/>
				<label key={`label-${roles}`} htmlFor={roles}>
					{roles}
				</label>
			</div>
		));
		return (
			<div>
				{rolesCheckBoxes}
				<button className={classes.selectButton} onClick={this.updateData}>
					Save
				</button>
			</div>
		);
	}
}

export default RolesEditor;
