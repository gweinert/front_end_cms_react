import React, { Component } from 'react';
import PropTypes 			from 'prop-types';

function withInputControl(WrappedComponent) {
	return class InputControl extends Component {
		static propTypes = {
			type: PropTypes.string,
			name: PropTypes.string,
			id: PropTypes.number,
			
		}

		static defaultProps = {
			type: '',
			name: '',
			id: 0,
		}

		constructor(props) {
			super(props);
			this.state = {
				value: '',
			};
			this.onInputChange = this.onInputChange.bind(this);
			this.getValue = this.getValue.bind(this);
			this.getType = this.getType.bind(this);
		}

		componentDidMount() {
			// console.log("inputControl", this.props);
		}

		onInputChange(e) {
			this.setState({ value: e.target.value });
		}

		getValue(key) {
			if (key) {
				return this.state.value[key];
			}
			return this.state.value;
		}

		getType() {
			return this.props.type;
		}


		render() {
			const { type, id } = this.props;
			const uniqueId = `${type}_${id}`;
			return (
				<WrappedComponent
					{...this.props}
					onInputChange={this.onInputChange}
					value={this.state.value}
					className="input-control"
					id={uniqueId}
				/>
			);
		}
	}
}

export default withInputControl;
