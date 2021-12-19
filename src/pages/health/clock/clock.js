import React, { Component } from 'react'
import { Button, Modal, Form, Input, message } from 'antd';
import { reqaddHealth  } from '../../../api/health'

export default class Clock extends Component {

  state = {
    isModalVisible: false
  }

  showModal = () => {
    this.setState({isModalVisible: true})
  };

  handleOk = () => {
    this.setState({isModalVisible: false})
  };

  handleCancel = () => {
    this.setState({isModalVisible: false})
  }

  onFinish = async(values) => {
    const {animal,name,iphone,address,status} = values
    const result = await reqaddHealth(animal,name,iphone,address,status)
    if (result.status === 200) {
      message.success('恭喜你，打卡成功')
      this.handleCancel()
    } else {
      message.error('打卡失败/你已经打过卡了')
    }
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    return (
      <div style={{display: 'flex',justifyContent:'center',alignItems:'center',textAlign:'center',height:'100%'}}>
        <div style={{}}>
          <Button
            type="primary"
            style={{width:'300px',height:'50px'}}
            onClick={this.showModal}
          >
            打卡
          </Button>
          <Modal title="健康打卡"
            visible={this.state.isModalVisible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={null}
          >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请添加姓名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="温度"
            name="animal"
            rules={[{ required: true, message: '请添加温度!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="电话"
            name="iphone"
            rules={[{ required: true, message: '请添加电话!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="居住地址"
            name="address"
            rules={[{ required: true, message: '请添加居住地址!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
          >
            <Input disabled={true} size='small' />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              添加
            </Button>
          </Form.Item>
          </Form>
        </Modal>
      </div>
      </div>
    )
  }
}

