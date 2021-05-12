import React, { Component } from 'react';
import BootStrapModel from '../UI/BootStrapModel';
import axios from '../../axiosAuth';
import { connect } from 'react-redux';
import WithErrorHandler from '../../hoc/WithErrorHandler';

class FormLogin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: '',
			password: ''
		}

	}
	Login() {
		axios.post('/accounts:signInWithPassword?key=AIzaSyCWqP6VvsxBlignTd3ksFNisOyhDI-W-yg', {
			email: this.state.user,
			password: this.state.password,
			returnSecureToken: true 
		})
		.then(response => {
			if(response !== undefined) {
				const token = response.data.idToken;
				this.props.setToken(token, response.data.email);
				window.$('#formLogin').modal('hide')
			}
		})
		.catch(error => {
			
		});
	}

	inputChangeHandler = (event, name) => {
		const value = event.target.value;
		this.setState({[name]: value});
	}
	render() {
		return (
			<BootStrapModel
				show={this.props.showLogin ? 'show' : ''}
				size="modal-xl"
				modelId="formLogin"
			>
				<form>
					<div className="form-group row">
						<div className="col-sm-2">
							<label>User</label>
						</div>
						<div className="col-sm-10">
							<input className="form-control" type="text" value={this.state.user} onChange={(event) => this.inputChangeHandler(event, 'user')} />
						</div>
					</div>
					<div className="form-group row">
						<div className="col-sm-2">
							<label>Password</label>
						</div>
						<div className="col-sm-10">
							<input className="form-control" type="password" value={this.state.password} onChange={(event) => this.inputChangeHandler(event, 'password')} />
						</div>
					</div>
					<div className="form-group row">
						<div className="col-sm-2"></div>
						<div className="col-sm-10">
							<button className="btn btn-primary mr-2" type="button" onClick={() => this.Login()}>Login</button>
							<button className="btn btn-light">Cancel</button>
						</div>
					</div>
				</form>
			</BootStrapModel>
		)
	}
}

const mapStateToProps = state => {
	return {
		token: state.session.token
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setToken: (token, email) => dispatch({type: 'SET_TOKEN', token: token, email: email})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(FormLogin, axios));