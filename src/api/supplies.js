/**
 * 物资管理api
 */

import ajax from './axios'

const BASE = ''

/**
 * 查询物资信息
 */
export const reqSupplies = () => ajax(BASE + '/suppliesUser');

/**
 * 添加物资信息
 */
export const reqAddsupplies = (suppliesName,inventory,unit) => ajax(BASE + `/addSupplies?suppliesName=${suppliesName}&inventory=${inventory}&unit=${unit}`)

/**
 * 删除物资信息
 */
export const reqDelsupplies = (id) => ajax(BASE + `/delSupplies?id=${id}`)

/**
 * 修改物资信息
 */
export const reqUpdateSupplies = (id,suppliesName,inventory,unit) => ajax(BASE + `/updateSupplies?id=${id}&suppliesName=${suppliesName}&inventory=${inventory}&unit=${unit}`)
