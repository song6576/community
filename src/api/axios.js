/**
 * 能发送异步请求的axios函数模块
 * 封装axios库
 * 函数的返回值是promise
 */

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url,data={},type='GET') {
  /**
 * 统一统计错误
 */
  return new Promise ((resolve,reject) => {
    let promise
    // 1、执行异步ajax请求
    if (type==='POST') { // 发送GET请求
      promise = axios.get(url, { // 配置对象
        params: data // 指定请求参数
      })
    } else {
      promise = axios.post(url,data) // 发送POST请求
    }
    // 2、如果成功了，调用resolve(value)
    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
      message.error('请求出错:' + error.message)
    })
  })
}