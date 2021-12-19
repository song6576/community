/**
 * 疫苗接种管理api
 */

import ajax from './axios'

const BASE = ''

/**
* 查询用户健康信息
*/
export const reqHealthUser = () => ajax(BASE + '/healthUser');

/**
* 添加健康信息
*/
export const reqaddHealth = (animal,name,iphone,address,status) => ajax(
  BASE + `/addHealth?animal=${animal}&name=${name}&iphone=${iphone}&address=${address}&status=${status}`
  )

/**
* 删除接种信息
*/
export const reqDelHealth = (id) => ajax(BASE + `/delHealth?id=${id}`)
