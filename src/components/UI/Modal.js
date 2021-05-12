import React, { Component } from 'react';
import Aux from '../../hoc/Auxx';
import classNames from 'classnames';

class Modal extends Component {
	render() {
		let status = 'success';
		if(this.props.show) {
			status = 'fail';
		} 
		return(
			<Aux>
				<div className="backdrop"></div>
				<dialog open>
					<section>
						<div className={classNames( status, 'mb-4')}></div>
						{ this.props.children }
					</section>
					<div className="close-icon" onClick={this.props.modalClosed}></div>
				</dialog>
			</Aux>
		)
	}
}

export default Modal;