import React, { Component } from 'react';
import Modal from '../components/UI/Modal';
import Aux from './Auxx';

const WithErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		constructor(props) {
			super(props);
			axios.interceptors.request.eject(this.state.reqInterceptor);
			axios.interceptors.response.eject(this.state.resInterceptor);
		}
		state = {
			error: null,
			reqInterceptor: axios.interceptors.request.use(req => {
				this.setState({ error: null});
				return req;
			}),
			resInterceptor: axios.interceptors.response.use(error => {
				//this.setState({ error: error});
			})
		};
		errorHandler = () => {
			this.setState({ error: null });
		}
		
		render() {
			const modal = (
				<Modal 
					modalClosed={this.errorHandler}
					show={this.state.error}>
					{this.state.error ? this.state.error.message : null}
				</Modal>
			)
			return (
				<Aux>
					{this.state.error ? modal : null}
					<WrappedComponent {...this.props} />
				</Aux>
			)
		}
	}
}

export default WithErrorHandler;