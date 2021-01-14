import React, {Component } from 'react'
import {Upload, Modal, message} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { reqDeletePic } from '../../api'

export default class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    constructor (props) {
        super(props)
        const { imgs } = this.props
        const baseUrl = 'http://localhost:5000/upload/'
        const fileList = []
        console.log('prctures()',imgs)
        if (imgs) {
            imgs.forEach((item, index) => {
                fileList.push({
                    uid: -index,
                    name: item,
                    status: 'done',
                    url: baseUrl + item
                })
            })
        }
        console.log(fileList)
        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: fileList,
        }
    }

    // 上传文件状态改变时
    handleChange = ({file, fileList}) => {
        console.log(file, fileList)
        if (file.status === 'done') {
            const { uid, status} = file
            const { url, name } = fileList[fileList.length-1].response.data
            const list = this.state.fileList
            list.push({ uid, name, status, url })
            this.setState({
                fileList: list
            })
        } else if (file.status === 'error') {
            message.error('图片上传失败')
        }

    }
    // 浏览按钮点击时
    handlePreview = (file) => {
        const {name, url} = file
        this.setState({
            previewVisible: true,
            previewImage: url,
            previewTitle: name
        })
    }
    // 删除按钮，清除数组中的数据
    handleRemove = async (file) => {
        const uid = file.uid
        const {fileList} = this.state
        const list = fileList.filter(item => item.uid !== uid)
        const res = await reqDeletePic(file.name)
        console.log(res)
        if (res.status === 0) {
            message.success('删除成功')
        } else {
            message.error(res.msg)
        }
        this.setState({
            fileList: list
        })
    }
    // 弹窗关闭时
    handleCancel = () => this.setState({ previewVisible: false })
    getStateList = () => {
        const imgs = []
        this.state.fileList.forEach(item => {
            imgs.push(item.name)
        })
        return imgs
    }
    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        )
        return (
            <>
                <Upload
                    action= '/manage/img/upload'
                    name='image'
                    listType="picture-card"
                    fileList={fileList}
                    onRemove={this.handleRemove}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        )
    }
}