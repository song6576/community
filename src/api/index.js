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
      // console.log(err,data)
      if(!err && data.status === '1') {
        // 取出需要的数据
        const {weather,temperature,city} = data.lives[0]
        resolve({weather,temperature,city})
      } else {
        // 失败了
        message.error('获取天气失败',err)
      }
    })
  })
}

/**
* 查询系统用户模块
*/
export const reqUsers = () => ajax(BASE + '/user')

/**
 * 添加系统用户模块
 */
export const reqAddUser = (username,password,iphone) => ajax(BASE + `/adduser?username=${username}&password=${password}&iphone=${iphone}`)

/**
 * 删除系统用户
 */
export const reqdelUser = (id) => ajax(BASE + `/delUser?id=${id}`)

/**
 * 修改系统用户
 */
export const reqUpdataUser = (id,username,password,role,iphone) => ajax(BASE + `/updateUser?id=${id}&username=${username}&password=${password}&role=${role}&iphone=${iphone}`)

/**
* 查询所有居民信息模块
*/
export const reqResidentsUsers = () => ajax(BASE + '/residentsUsers')

/**
* 添加居民信息模块
*/
export const reqAddresidentsUsers = (name,age,email,professional,iphone,birthday,address) => ajax(BASE + `/addResidents?name=${name}&age=${age}&email=${email}&professional=${professional}&iphone=${iphone}&birthday=${birthday}&address=${address}`)

/**
 * 删除居民信息
 */
export const reqdelResidents = (id) => ajax(BASE + `/delResidents?id=${id}`)

/**
 * 修改居民信息
 */
export const reqUpdataResidentsUser = (id,name,age,email,professional,iphone,birthday,address) => ajax(BASE + `/updateResidents?id=${id}&name=${name}&age=${age}&email=${email}&professional=${professional}&iphone=${iphone}&birthday=${birthday}&address=${address}`)
