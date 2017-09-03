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
		onInputChange: PropTypes.func,
	}

	static defaultProps = {
		label: '',
		name: '',
		body: '',
		value: '',
		onInputChange: () => {},
	}

	constructor(props) {
		super(props);
		this.onEditorStateChange = this.onEditorStateChange.bind(this);

		const contentBlock = htmlToDraft(props.body);

		if (contentBlock) {
			const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
			const editorState = EditorState.createWithContent(contentState);
			this.state = {
				editorState,
			};
		}
	}

	onEditorStateChange = (editorState) => {
		this.setState({ editorState });
	}

	getValue() {
		const { editorState } = this.state;
		const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
		return html;
	}

	render() {
		const {
			label,
			name,
			body,
			value,
			// onInputChange,
		} = this.props;

		const inputValue = value || body;
		const labelValue = label || name;
		const { editorState } = this.state;
		return (
			<div>
				<label htmlFor="blurb">{labelValue}
					<Editor
						id="blurb"
						editorState={editorState}
						toolbarClassName="toolbarClassName"
						wrapperClassName="wrapperClassName"
						editorClassName="editorClassName"
						onEditorStateChange={this.onEditorStateChange}
					/>

				</label>
			</div>
		);
	}
}

// export default withInputControl(Blurb);
export default Blurb;

