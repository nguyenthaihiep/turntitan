import React, { Component } from 'react';
import BootStrapModel from '../UI/BootStrapModel';
//import axios from '../../axios';
//import { connect } from 'react-redux';
//import WithErrorHandler from '../../hoc/WithErrorHandler';

class ChangePassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			oldPassword: '',
			password: '',
			rePassword: ''
		}
	}

	hideModel() {
		window.$('#changePassword').modal('hide')
	}
	inputChangeHandler = (event, name) => {
		const value = event.target.value;
		this.setState({[name]: value});
	}
	changePassword() {
		
	}

	render() {
		return (
			<BootStrapModel
				show={this.props.showAddTurn ? 'show' : ''}
				size="modal-lg"
				modelId="changePassword"
			>
				<div className="form-group row">
					<div className="col-sm-4">
						<label>Old password</label>
					</div>
					<div className="col-sm-8">
						<input className="form-control" type="password" value={this.state.oldPassword} onChange={(event) => this.inputChangeHandler(event, 'oldPassword')} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4">
						<label>New password</label>
					</div>
					<div className="col-sm-8">
						<input className="form-control" type="password" value={this.state.password} onChange={(event) => this.inputChangeHandler(event, 'password')} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4">
						<label>Confirm new password</label>
					</div>
					<div className="col-sm-8">
						<input className="form-control" type="password" value={this.state.rePassword} onChange={(event) => this.inputChangeHandler(event, 'rePassword')} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4"></div>
					<div className="col-sm-8">
						<button className="btn btn-primary mr-2" type="button" onClick={() => this.changePassword()}>Change password</button>
						<button className="btn btn-light" onClick={() => this.hideModel()}>Cancel</button>
					</div>
				</div>
			</BootStrapModel>
		)
	}
}

export default ChangePassword;