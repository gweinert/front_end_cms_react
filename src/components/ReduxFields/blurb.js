import React, { Component } from 'react';
import PropTypes 			from 'prop-types';
import {
	EditorState,
	convertToRaw,
	ContentState,
} 							from 'draft-js';
import { Editor } 			from 'react-draft-wysiwyg';
import draftToHtml 			from 'draftjs-to-html';
import htmlToDraft 			from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import withInputControl 	from '../../components/InputControl/inputControl';


class Blurb extends Component {
	static propTypes = {
		label: PropTypes.string,
		name: PropTypes.string,
		body: PropTypes.string,
		value: PropTypes.string,
		id: PropTypes.number,
		type: PropTypes.string,
		className: PropTypes.string,
		// onInputChange: PropTypes.func,
		onChange: PropTypes.func,
	}

	static defaultProps = {
		label: '',
		name: '',
		body: '',
		// value: '',
		id: 0,
		type: '',
		className: '',
		onInputChange: () => {},
	}

	constructor(props) {
		super(props);
		this.onEditorStateChange = this.onEditorStateChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.state = {
			editorState: '',
		};
	}

	componentWillMount() {
		this.setEditorState();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setEditorState(nextProps);
		}
	}

	onEditorStateChange(editorState) {
		this.setState({ editorState });
	}

	onBlur() {
		const { editorState } = this.state;
		const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		this.props.onChange({ type: 'blurb', body: html });
	}

	setEditorState(nextProps) {
		let { value, body } = this.props;
		if (nextProps) {
			value = nextProps.value;
			body = nextProps.body;
		}
		const blurbValue = value || body;
		const contentBlock = htmlToDraft(blurbValue);

		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const editorState = EditorState.createWithContent(contentState);
			this.setState({ editorState });
		}
	}

	render() {
		const {
			label,
			name,
			body,
			value,
			id,
			type,
			className,
		} = this.props;
		const { editorState } = this.state;
		const labelValue = label || name;

		return (
			<div className={className}>
				<label htmlFor="blurb">{labelValue}
					<Editor
						editorState={editorState}
						toolbarClassName="toolbarClassName"
						wrapperClassName="wrapperClassName"
						editorClassName="editorClassName"
						onEditorStateChange={this.onEditorStateChange}
						onBlur={this.onBlur}
					/>

				</label>
			</div>
		);
	}
}

// export default withInputControl(Blurb);
export default Blurb;

