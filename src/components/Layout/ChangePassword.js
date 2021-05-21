import React, { Component } from 'react';
import BootStrapModel from '../UI/BootStrapModel';
import axios from '../../axiosAuth';
import { connect } from 'react-redux';
import WithErrorHandler from '../../hoc/WithErrorHandler';
import Toast from '../UI/Toast';

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
		if(this.state.password !== this.state.rePassword) {
			Toast('error', 'password and rePassword not correct!');
			return;
		}

		axios.post('/accounts:signInWithPassword?key=AIzaSyCWqP6VvsxBlignTd3ksFNisOyhDI-W-yg', {
			email: this.props.email,
			password: this.state.oldPassword,
		})
		.then(response => {
			if(response !== undefined) {
				axios.post('/accounts:update?key=AIzaSyCWqP6VvsxBlignTd3ksFNisOyhDI-W-yg', {
					idToken: this.props.token,
					password: this.state.password,
					returnSecureToken: true,
				})
				.then(response => {
					if(response !== undefined) {
						const token = response.data.idToken;
						this.props.setToken(token, response.data.email);
						window.$('#changePassword').modal('hide')
					}
				})
				.catch(error => {
					Toast('error', error.response.data.error);
				});
			}
		})
		.catch(error => {
			//Toast('error', error.response.data.error);
		});
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

const mapStateToProps = state => {
	return {
		email: state.session.email,
		token: state.session.token
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setToken: (token, email) => dispatch({type: 'SET_TOKEN', token: token, email: email})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(ChangePassword, axios));