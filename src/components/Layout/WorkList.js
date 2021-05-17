import React from 'react';
import BootStrapModel from '../UI/BootStrapModel';

const WorkList = (props) => {
	//console.log(props);
	return(
		<BootStrapModel
			show={props.showWorkList ? 'show' : ''}
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
						props.employee && props.employee.work_list && props.employee.work_list.length > 0 &&
						props.employee.work_list.map(item => (
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
						(!props.employee || props.employee.work_list === undefined || props.employee.work_list.length <= 0) &&
						<tr>
							<td colSpan="6" align="center">No data</td>
						</tr>
					}
				</tbody>
			</table>
		</BootStrapModel>
	)
};

export default WorkList;