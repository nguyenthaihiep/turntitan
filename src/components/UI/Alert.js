import React, { Component } from 'react';
import classNames from 'classnames';

class Alert extends Component {
	render() {
		return (
			<div className="modal fade" id={this.props.modelId} tabIndex="-1" aria-hidden="true">
				<div className={classNames('modal-dialog', this.props.size)}>
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title h4">{this.props.headTitle}</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div className="modal-body">
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Alert;