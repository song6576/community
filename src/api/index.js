/**
 * 包含所有接口请求函数模块
 * 每个函数的返回值都是promise
 */
import ajax from './axios'
import jsonp from 'jsonp'
import {message} from 'antd'

const BASE = ''

/**
* 登录模块,后端未处理好，这里需要传递参数，拼接
*/
export const reqLogin = (username,password) => ajax(BASE + `/login?username=${username}&password=${password}`)

/**
* 注册模块
*/
export const reqRegister = (username,password) => ajax(BASE + `/register?username=${username}&password=${password}`)

/**
 * jsonp请求的接口请求函数
 */

export const reqWeather = (city) => {
  return new Promise((resolve,reject)=>{
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=912f3a1404ef35b2e6a570ef9f217371`
    // 发送jsonp请求
    jsonp(url,{},(err,data)=>{
      console.log(err,data)
      if(!err && data.status === '1') {
        // 取出需要的数据
        const {weather,temperature} = data.lives[0]
        resolve({weather,temperature})
      } else {
        // 失败了
        message.error('获取天气失败',err)
      }
    })
  })
}