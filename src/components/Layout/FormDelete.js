import React, { Component } from 'react';
import BootStrapModel from '../UI/BootStrapModel';
import axios from '../../axiosAuth';
import { connect } from 'react-redux';
import WithErrorHandler from '../../hoc/WithErrorHandler';

class FormDelete extends Component {
	constructor(props) {
		super(props);
		this.state = {
			password: ''
		}
	}
	inputChangeHandler = (event, name) => {
		const value = event.target.value;
		this.setState({[name]: value});
	}
	delete() {
		axios.post('/accounts:signInWithPassword?key=AIzaSyCWqP6VvsxBlignTd3ksFNisOyhDI-W-yg', {
			email: this.props.email,
			password: this.state.password,
			returnSecureToken: true 
		})
		.then(response => {
			if(response !== undefined) {
				this.props.deleted();
				//window.$('#formLogin').modal('hide')
			}
		})
		.catch(error => {
			
		});
	}
	hideModel() {
		window.$('#formDelete').modal('hide')
	}
	render() {
		return (
			<BootStrapModel
				show={this.props.showAddTurn ? 'show' : ''}
				size="modal-sm"
				modelId="formDelete"
			>
				<div className="form-group">
					<div className="col-sm-12">
						<label className="mb-2">Please input password</label>
						<input className="form-control" type="password" value={this.state.password} onChange={(event) => this.inputChangeHandler(event, 'password')} />
					</div>
				</div>
				<div className="form-group row">
					<div className="col-sm-4"></div>
					<div className="col-sm-8">
						<button className="btn btn-primary mr-2" type="button" onClick={() => this.delete()}>Delete</button>
						<button className="btn btn-light" onClick={() => this.hideModel()}>Cancel</button>
					</div>
				</div>
			</BootStrapModel>
		)
	}
}

const mapStateToProps = state => {
	return {
		email: state.session.email
	}
}

export default connect(mapStateToProps)(WithErrorHandler(FormDelete, axios));