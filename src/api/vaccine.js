/**
 * 疫苗接种管理api
 */

import ajax from './axios'

const BASE = ''

/**
 * 查询接种信息
 */
export const reqVaccineList = () => ajax(BASE + '/vaccineList');

/**
 * 添加接种信息
 */
export const reqAddVaccine = (name,iphone,vaccineType,vaccineTime,address) => ajax(
  BASE + `/addVaccine?name=${name}&iphone=${iphone}&vaccineType=${vaccineType}&vaccineTime=${vaccineTime}&address=${address}`
  )

/**
 * 删除接种信息
 */
export const reqDelVaccine = (id) => ajax(BASE + `/delVaccine?id=${id}`)

/**
 * 修改接种信息
 */
export const reqUpdateVaccine = (id,name,iphone,vaccineType,vaccineTime,address) => ajax(
  BASE + `/UpdateVaccine?id=${id}&name=${name}&iphone=${iphone}&vaccineType=${vaccineType}&vaccineTime=${vaccineTime}&address=${address}`
  )
