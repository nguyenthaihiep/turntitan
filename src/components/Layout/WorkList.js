import React, { Component } from 'react';
import BootStrapModel from '../UI/BootStrapModel';
import axios from '../../axios';
import { connect } from 'react-redux';
import WithErrorHandler from '../../hoc/WithErrorHandler';

class WorkList extends Component {
	render() {
		const employee = this.props.employees[this.props.memberAddTurnId];
		console.log(employee);
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
							employee.work_list.map(item => (
								<tr key={item.id}>
									<td>{item.service}</td>
									<td>{item.start_time}</td>
									<td>{item.end_time}</td>
									<td>{item.free}</td>
									<td>{item.money}</td>
									<td></td>
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
	}
}

const mapDispatchToProps = dispatch => {
  return {
    updateEmployees: (employees) => dispatch({type: 'UPDATE_EMPLOYEES', employees: employees}),
  }
}

export default connect(mapPropsToState, mapDispatchToProps)(WithErrorHandler(WorkList, axios));