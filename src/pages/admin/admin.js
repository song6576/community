/**
 * 后台管理界面
 */
import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';
import memory from '../../utils/memory';
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';
import Footerd from '../../components/footer';
import Headers from '../../components/header';
import { Route } from 'react-router-dom';
// 引入组件页面
import Home from '../home/home';
import User from '../user/user';
import Residents from '../residents/residents';
import MaterialInformation from '../supplies/materialInformation/materialInformation';
import SuppliesAdmin from '../supplies/suppliesAdmin/suppliesAdmin';
import Diagnosis from '../diagnosis/diagnosis';
import Vaccine from '../vaccine/vaccine';
import Visitors from '../visitors/visitors';
import Health from '../health/health';
import OutbreakNotice from '../outbreakNotice/outbreakNotice';
import Cases from '../cases/cases'

const { Header, Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = memory.user
    // 验证内存中时候有user.username ，如果没有user.username，说明当前没有登录
    if(!user.username) {
      return <Redirect to='/login' />
    }
    return (
      <Layout>
        <Sider>
          <LeftNav/>
        </Sider>
      <Layout style={{height:'100vh'}}>
        <Header style={{background:'white'}}>
          <Headers user={user} />
        </Header>
        <Content style={{background: 'white',margin:'15px'}}>
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/user' component={User} />
            <Route path='/residents' component={Residents} />
            <Route path='/supplies/materialInformation' component={MaterialInformation} />
            <Route path='/supplies/suppliesAdmin' component={SuppliesAdmin} />
            <Route path='/diagnosis' component={Diagnosis} />
            <Route path='/vaccine' component={Vaccine} />
            <Route path='/visitors' component={Visitors} />
            <Route path='/health' component={Health} />
            <Route path='/outbreakNotice' component={OutbreakNotice} />
            <Route path='/cases' component={Cases} />
            <Redirect to='/home' />
          </Switch>
        </Content>
        <Footer>
          <Footerd/>
        </Footer>
      </Layout>
    </Layout>
    )
  }
}
