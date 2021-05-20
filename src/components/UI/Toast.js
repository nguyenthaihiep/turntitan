import React, { Component } from 'react';
import Aux from '../../hoc/Auxx';
import classNames from 'classnames';

class Toast extends Component {
	render() {
		let status = 'success';
		if(this.props.show) {
			status = 'fail';
		} 
		return(
			<Aux>
				<div aria-live="polite" aria-atomic="true">
					<div id="error-toast" className="toast">
						<div className="toast-body">
							Hello, world! This is a toast message.
						</div>
					</div>
				</div>
			</Aux>
		)
	}
}

export default Toast;