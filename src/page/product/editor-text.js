import React, { Component } from 'react'
import { message } from 'antd'
import PropTypes from 'prop-types'

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default class EditorText extends Component {
    static propTypes = {
        detail: PropTypes.string
    }
    constructor(props) {
        super(props);
        const html = this.props.detail
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        } else {
            this.state = {
                editorState: EditorState.createEmpty(), //创建一个没有内容编辑容器
            }
        }
    }
    // 文本域发生改变时
    onEditorStateChange = (value) => {
        this.setState({editorState:value})
    }
    // 获取文本标签字符串
    getEditor = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    // 上传图片方法
    uploadImageCallBack=(file)=>{
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url // 得到图片的url
                    resolve({data: {link: url}})
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    message.eroor('上传失败')
                    reject(error)
                })
            }
        )
    }
    render () {
        return (
            <div>
                <Editor
                    editorState={this.state.editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    toolbar={{
                        image: {
                            urlEnabled: true,
                            uploadEnabled: true,
                            alignmentEnabled: true,   // 是否显示排列按钮 相当于text-align
                            uploadCallback: this.uploadImageCallBack,
                            previewImage: true,
                            inputAccept: 'image/*',
                            alt: {present: true, mandatory: false,previewImage: true}
                        },
                    }}
                />
            </div>
        )
    }
}