/**
 * 诊断管理api
 */

import ajax from './axios'

const BASE = ''

/**
* 查询诊断信息
*/
export const reqDiagnoseList = () => ajax(BASE + '/diagnoseList');

/**
* 添加诊断信息
*/
export const reqAddDiagnose = (name,diagnoseTime,iphone,address,status) => ajax(
  BASE + `/addDiagnose?name=${name}&diagnoseTime=${diagnoseTime}&iphone=${iphone}&address=${address}&status=${status}`
  )

/**
* 删除诊断信息
*/
export const reqDeldiagnose = (id) => ajax(BASE + `/delDiagnose?id=${id}`)

/**
* 修改诊断信息
*/
export const reqUpdateDiagnose = (id,name,diagnoseTime,iphone,address,status) => ajax(
  BASE + `/UpdateDiagnose?id=${id}&name=${name}&diagnoseTime=${diagnoseTime}&iphone=${iphone}&address=${address}&status=${status}`
  )
