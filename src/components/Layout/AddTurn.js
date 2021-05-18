import React, { Component } from 'react';
import BootStrapModel from '../UI/BootStrapModel';
import axios from '../../axios';
import { connect } from 'react-redux';
import WithErrorHandler from '../../hoc/WithErrorHandler';

class AddTurn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			services: [
				{ value: 'pedicure', name: 'Pedicure' },
				{ value: 'manicure', name: 'Manicure' },
				{ value: 'facial', name: 'Facial' },
				{ value: 'comming-late', name: 'Comming late' },
			],
			service: 'pedicure',
			money: ''
		}
	}
	inputChangeHandler = (event, name) => {
		const value = event.target.value;
		this.setState({[name]: value});
	}

	addNewTurn() {
		const employee = this.props.employees[this.props.memberAddTurnId];
		const curTime = new Date().getTime();
		const startTime = new Date(currentDate() +' '+ employee.start_time).getTime();
		const  minute = (curTime - startTime)/60000;
		if(minute < this.state.money){
			return false;
		}
		const turn = {
			service: this.state.service,
			start_time: employee.start_time,
			end_time: currentTime(),
			free: '',
			money: this.state.money
		}
		employee.work_list.push(turn);
		employee.total_turn = employee.work_list.length;
		employee.total = parseInt(employee.total) + parseInt(turn.money);
		employee.working = 0;
		employee.start_time = '';
		axios.put(`/employees/${this.props.fetchDate}/${employee.id}.json?auth=` + this.props.token, employee)
		.then(response => {
			if(response !== undefined) {
				//this.props.updateWorkList(turn);
				const employees = [...this.props.employees];
				employees[this.props.memberAddTurnId] = employee;
				this.props.updateEmployees(employees);
			}
		})
		.catch(error => {

		});
	}

	render() {
		return (
			<BootStrapModel
				show={this.props.showAddTurn ? 'show' : ''}
				size="modal-sm"
				modelId="addTurn"
			>
				<div className="form-group row">
					<div className="col-sm-4">
						<label>Service</label>
					</div>
					<div className="col-sm-8">
						<select className="form-control" value={this.state.service} onChange={(event) => this.inputChangeHandler(event, 'service')} >
							{
								this.state.services.map(service => (
									<option key={service.value}>{service.name}</option>
								))
							}
						</select>
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4">
						<label>Money</label>
					</div>
					<div className="col-sm-8">
						<input className="form-control" type="number" value={this.state.money} onChange={(event) => this.inputChangeHandler(event, 'money')} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4">
						<label>Free</label>
					</div>
					<div className="col-sm-8">
						<input type="checkbox" />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4">
						<label>Password</label>
					</div>
					<div className="col-sm-8">
						<input className="form-control" type="password" value={this.state.password} onChange={(event) => this.inputChangeHandler(event, 'password')} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4"></div>
					<div className="col-sm-8">
						<button className="btn btn-primary mr-2" type="button" onClick={() => this.addNewTurn()}>Create</button>
						<button className="btn btn-light">Cancel</button>
					</div>
				</div>
			</BootStrapModel>
		)
	}
}

const currentDate = () => {
  const d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth() + 1;
  if(month < 10) {
    month = '0' + month;
  }
  let day = d.getDate();
  if(day < 10) {
    day = '0' + day;
  }

  return year + '/' + month + '/' + day;
}

const currentTime = () => {
  const d = new Date();
  let hour = d.getHours();
  if(hour < 10) {
    hour = '0' + hour;
  }
  let minute = d.getMinutes();
  if(minute < 10) {
    minute = '0' + minute;
  }
  let second = d.getSeconds();
  if(second < 10) {
    second = '0' + second;
  }

  return hour + ':' + minute + ':' + second;
}

const mapPropsToState = state => {
	return {
		token: state.session.token,
		employees: state.session.employees,
		memberAddTurnId: state.session.memberAddTurnId,
		fetchDate: state.session.fetchDate
	}
}

const mapDispatchToProps = dispatch => {
  return {
    updateEmployees: (employees) => dispatch({type: 'UPDATE_EMPLOYEES', employees: employees}),
  }
}

export default connect(mapPropsToState, mapDispatchToProps)(WithErrorHandler(AddTurn, axios));