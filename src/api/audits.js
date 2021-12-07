/**
 * 物资审批接口管理
 */
/**
 * 物资管理api
 */

import ajax from './axios'

const BASE = ''

/**
* 查询物资审批信息
*/
export const reqAudit = () => ajax(BASE + '/audits');

/**
* 添加物资审批信息
*/
export const reqAddaudit = (suppliesName,amount,auditPeople,iphone,address,status) => ajax(
  BASE + `/addAuditSupplies?suppliesName=${suppliesName}&amount=${amount}&auditPeople=${auditPeople}&iphone=${iphone}&address=${address}&status=${status}`
  )

/**
* 删除物资审批信息
*/
export const reqDelaudit = (id) => ajax(BASE + `/delAudit?id=${id}`)

/**
* 修改物资审批信息
*/
export const reqUpdateAudit = (id,suppliesName,amount,auditPeople,iphone,address,status) => ajax(
  BASE + `/updateAudit?id=${id}&suppliesName=${suppliesName}&amount=${amount}&auditPeople=${auditPeople}&iphone=${iphone}&address=${address}&status=${status}`
  )
