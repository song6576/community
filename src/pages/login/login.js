/**
 * 登录页面
 */
import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import './login.less';
// 引入存储用户名
import memory from '../../utils/memory';
import storage from '../../utils/storage';
// 引入登录接口
import { reqLogin } from '../../api';
import { Redirect } from 'react-router';

export default class Login extends Component {

  /**
   * 提交·表单
   * @param {*} values
   */
  onFinish = async(values) => {
    const {username,password} = values
    // 调用登录接口
    const result = await reqLogin(username,password)
    // 验证登录是否成功
    if(result.status == 0) {
      message.success(`${username}欢迎回来!`)
      //保存user
      const user = result.data
      memory.user = user
      storage.saveUser(user) // 存储到local里面
      // 跳转到admin管理界面，不需要回退到登录
      this.props.history.replace('/')
    } else {
      message.error('登录失败，请重新登录')
    }
    console.log('Success:', values);
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const user = memory.user
    if(user.username) {
      return <Redirect to='/' />
    }
    return (
      <div className='content'>
        <div className='header'>
          <h3>欢迎来到小区新冠防疫系统</h3>
        </div>
        <div className='login-box'>
          <h1>登录</h1>
          <div className='output-form'>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={this.onFinish}
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
              style={{marginTop: '15px'}}
            >
              <Form.Item
                label="账号"
                name="username"
                rules={[{ required: true, message: '请输入您的用户名!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入您的密码!' }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                <Button type="primary" htmlType="submit" style={{marginTop: '20px',width:'100%'}}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}
