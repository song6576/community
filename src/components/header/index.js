import React, { Component } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router';
import './index.less';
// 天气接口
import {reqWeather} from '../../api/index';
// 时间
import {formateDate} from '../../utils/date';
import { Header } from 'antd/lib/layout/layout';

class Headers extends Component {

  state = {
    currentTime: formateDate(Date.now()), // 当前时间字符串
    weather: '', // 天气文本
    temperature: '', // 当地温度
    city: '', // 城市
  }

   // 获取时间
  getTime = () => {
    this.timer = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  // 获取天气
  getWeather = async () => {
    // 调用接口，获取异步数据
    const { weather, temperature,city } = await reqWeather('江西')
    // 改变状态
    this.setState({weather, temperature,city})
    // console.log(temperature)
  }

  /**
   * 第一次调用render()
   */
    componentDidMount() {
      this.getTime() //显示时间
      this.getWeather() // 显示天气
    }

  render() {
    // 取出{ currentTime, weather }
    const { currentTime, weather, temperature, city } = this.state
    const {user} = this.props
    const menu = (
      <Menu>
        <Menu.Item danger onClick={e => console.log(e)}>退出账号</Menu.Item>
      </Menu>
    );
    return (
      <div className='header'>
        {/* 当前路由地址 */}
        <div className='header-path'>
          <span>接种管理</span>
        </div>
        {/* 天气、时间 */}
        <div className="header-content">
          <span className="header-time">{currentTime}</span>
          <span className='header-weather'>当前 {city}</span>
          <span className='header-weather'>{weather}</span>
          <span className='header-temperature'>{temperature}°c</span>
        {/* 用户信息 */}
          <div className='user'>
            <Dropdown overlay={menu}>
              <a onClick={e => e.preventDefault()}>
                <span style={{color:'black'}}>欢迎</span>
                <span style={{paddingLeft:'5px'}}>{user.username}</span>
                <DownOutlined style={{fontSize:'12px',paddingLeft:'5px'}} />
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Headers)