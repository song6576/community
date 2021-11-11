import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'; // 引入路由组件，BrowserRouter路由后面没有#
import { Switch } from 'react-router';
import './App.less';
/**
 * 引入所需组件
 */
import Login from './pages/login/login';
import Admin from './pages/admin/admin';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch> {/*只匹配其中一个*/}
          <Route path='/login' component={Login}></Route>
          <Route path='/' component={Admin}></Route>
        </Switch>
      </BrowserRouter>
    )
  }
}