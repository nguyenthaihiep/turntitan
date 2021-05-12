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
		const turn = {
			service: this.state.service,
			start_time: this.props.employee.start_time,
			end_time: this.props.currentTime,
			free: '',
			money: this.state.money
		}
		axios.post(`/employees/${this.props.fetchDate}/${this.props.employee.id}/work_list.json?auth=` + this.props.token, turn)
		.then(response => {
			if(response !== undefined) {
				/*const updateEmployees = [
				...this.state.employees
				]
				//updateEmployees.push(employee);
				this.setState({employees: updateEmployees})*/
				this.props.updateWorkList(turn);
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

const mapPropsToState = state => {
	return {
		token: state.session.token
	}
}

export default connect(mapPropsToState)(WithErrorHandler(AddTurn, axios));