import React, { Component } from 'react';
import { Menu } from 'antd';
import { HomeOutlined,
  TeamOutlined,
  WifiOutlined,
  VerifiedOutlined,
  GlobalOutlined,
  ApartmentOutlined,
  BellOutlined,
  PieChartOutlined,
  PushpinOutlined
} from '@ant-design/icons';
import './index.less';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

export default class LeftNav extends Component {

  handleClick = e => {
    console.log('click ', e);
  };

  render() {
    return (
      <div>
        <div style={{textAlign: 'center',margin: '30px 0'}}>
          <h3 style={{color:'white',fontSize:'20px'}}>小区新冠防疫系统</h3>
        </div>
        <Menu
          onClick={this.handleClick}
          style={{ width: 200 }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme='dark'
        >
          <Menu.Item key="1">
            <Link to='/home'>首页</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<TeamOutlined />} title="系统用户">
            <Menu.Item key="2">
              <Link to='/user'>管理员</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<HomeOutlined />} title="居民管理">
          <Menu.Item key="3">
            <Link to='/residents'>居民信息</Link>
          </Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<ApartmentOutlined />} title="物资管理">
            <Menu.Item key="4">
              <Link to='/supplies/materialInformation'>物资信息</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to='/supplies/suppliesAdmin'>申请审批</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<WifiOutlined />} title="诊断管理">
            <Menu.Item key="6">
              <Link to='/diagnosis'>诊断记录</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" icon={<PushpinOutlined />} title="疫苗接种">
            <Menu.Item key="7">
              <Link to='/vaccine'>接种管理</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub6" icon={<GlobalOutlined />} title="访客管理">
            <Menu.Item key="8">
              <Link to='/visitors'>访客记录</Link>
              </Menu.Item>
          </SubMenu>
          <SubMenu key="sub7" icon={<VerifiedOutlined />} title="健康管理">
            <Menu.Item key="9">
              <Link to='/health'>健康上报</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub8" icon={<BellOutlined />} title="疫情通告">
            <Menu.Item key="10">
              <Link to='/outbreakNotice'>疫情通告</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub9" icon={<PieChartOutlined />} title="病例统计">
            <Menu.Item key="11">
              <Link to='/cases'>病例记录</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}
