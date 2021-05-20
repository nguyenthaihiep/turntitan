import React, { Component } from 'react';
import BootStrapModel from '../UI/BootStrapModel';
import axios from '../../axios';
import { connect } from 'react-redux';
import WithErrorHandler from '../../hoc/WithErrorHandler';

class WorkList extends Component {

	removeTurn(index) {
		const employee = this.props.employees[this.props.memberAddTurnId];
		employee.total = parseInt(employee.total) - parseInt(employee.work_list[index].money);
		employee.work_list.splice(index,1);
		employee.total_turn = employee.work_list.length;
		//this.props.updateEmployees(this.props.employees);
		axios.put(`/employees/${this.props.fetchDate}/${employee.id}.json?auth=` + this.props.token, employee)
		.then(response => {
			if(response !== undefined) {
				//this.props.updateWorkList(turn);
				const employees = [...this.props.employees];
				employees[this.props.memberAddTurnId] = employee;
				this.props.updateEmployees(employees);
				window.$('#workList').modal('hide')
			}
		})
		.catch(error => {

		});
	}
	render() {
		const employee = this.props.employees[this.props.memberAddTurnId];
		return(
			<BootStrapModel
				show={this.props.showWorkList ? 'show' : ''}
				size="modal-xl"
				modelId="workList"
			>
				<table className="table">
					<thead>
						<tr>
							<th>Service</th>
							<th>Start time</th>
							<th>End time</th>
							<th>Free</th>
							<th>Money</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{
							employee && employee.work_list && employee.work_list.length > 0 &&
							employee.work_list.map((item, index) => (
								<tr key={item.id}>
									<td>{item.service}</td>
									<td>{item.start_time}</td>
									<td>{item.end_time}</td>
									<td>{item.free}</td>
									<td>{item.money}</td>
									<td><button className="btn btn-danger" onClick={() => this.removeTurn(index)}>Remove</button></td>
								</tr>
							))
						}
						{
							(!employee || employee.work_list === undefined || employee.work_list.length <= 0) &&
							<tr>
								<td colSpan="6" align="center">No data</td>
							</tr>
						}
					</tbody>
				</table>
			</BootStrapModel>
		)
	}
};

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

export default connect(mapPropsToState, mapDispatchToProps)(WithErrorHandler(WorkList, axios));