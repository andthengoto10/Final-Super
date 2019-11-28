import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAllPersons } from '../../../actions/personsActions';
import { getAllChips } from '../../../actions/chipsActions';
import Calendar from 'react-calendar';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import classes from '../dashboard.module.scss';

// to formate the time
const getFullTime = (date) => {
	const newDate = new Date(date);
	let hours = newDate.getHours();
	let minute = newDate.getMinutes();

	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minute < 10) {
		minute = '0' + minute;
	}
	return `${hours}:${minute}`;
};
// to add the formate the time in the colum coming and leaving.
const timeFormatter = (cell, row) => {
	if (cell) {
		return getFullTime(cell);
	}
	return '-';
};

class DailyCheck extends React.Component {
	state = {
		date: new Date(),
		chipsList: [],
		swipesOfDate: [],
		persons: [],
		finalListOfPersons: [],
		isOpen: false
	};
	componentDidMount() {
		this.props.getAllChips();
		this.props.getAllPersons();
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		this.setState({ chipsList: [ ...nextProps.chips.chips ], persons: [ ...nextProps.persons.persons ] });
	}
	onChange = (date) => this.setState({ date });
	onClickDay = (day) => {
		// copy of chipsList in state
		const chipsList = [ ...this.state.chipsList ];
		// here i will save the all Chips that swiped today as array of object
		let swipesOfDate = [];

		for (let i = 0; i < chipsList.length; i++) {
			// here i will save the date of today and how many swipes happened on this day
			let obj = {};
			let swipes = chipsList[i].swipes;
			// here i will get the swipes of today
			let swipesOfToday = swipes.filter(
				(item) =>
					day.getFullYear() === new Date(item).getFullYear() &&
					day.getMonth() === new Date(item).getMonth() &&
					day.getDate() === new Date(item).getDate()
			);
			// here i update my obj with this values
			obj.coming = swipesOfToday[0];
			obj.leaving = swipesOfToday[swipesOfToday.length - 1];
			obj.chipNumber = chipsList[i].chipNumber;
			// here i pushed the obj to the final array 'swipesOfDate'
			swipesOfDate.push(obj);
		}

		this.setState({ swipesOfDate: swipesOfDate, isOpen: true }, () => {
			this.compareChipsAndPersons();
		});
	};
	compareChipsAndPersons = () => {
		// just to copy this arrays from state
		let persons = [ ...this.state.persons ];
		let swipesOfDate = [ ...this.state.swipesOfDate ];
		let finalListOfPersons = [];

		persons.forEach((e1) =>
			swipesOfDate.forEach((e2) => {
				if (e1.rfId === e2.chipNumber) {
					e2.firstName = e1.firstName;
					finalListOfPersons.push(e2);
				}
			})
		);
		this.setState({ finalListOfPersons: finalListOfPersons });
	};
	render() {
		return (
			<section className={classes.dailyCheckContainer}>
				<Calendar locale="en" onClickDay={this.onClickDay} onChange={this.onChange} value={this.state.date} />
				{this.state.isOpen ? (
					<BootstrapTable
						data={this.state.finalListOfPersons}
						search={true}
						multiColumnSearch={true}
						pagination={true}
						headerStyle={{ color: '#000033' }}
						options={{
							sizePerPage: 5,
							sizePerPageList: [ 5, 10, { text: 'All', value: this.state.finalListOfPersons.length } ],
							clearSearch: true
						}}
					>
						<TableHeaderColumn isKey dataField="firstName" dataSort={true}>
							Name
						</TableHeaderColumn>
						<TableHeaderColumn dataField="coming" dataFormat={timeFormatter}>
							Coming
						</TableHeaderColumn>
						<TableHeaderColumn dataField="leaving" dataFormat={timeFormatter}>
							Leaving
						</TableHeaderColumn>
					</BootstrapTable>
				) : (
					<p className={classes.tip}>Please choose a day to see details</p>
				)}
			</section>
		);
	}
}

DailyCheck.propTypes = {
	getAllPersons: PropTypes.func.isRequired,
	getAllChips: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
	persons: state.persons,
	chips: state.chips
});

export default connect(mapStateToProps, { getAllPersons, getAllChips })(DailyCheck);
