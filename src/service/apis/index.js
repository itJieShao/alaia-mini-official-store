import { from } from 'apollo-boost';
import { get } from '../../utils/utilityOperationHelper';

export * from './user';
export * from './cart';
export * from './order';
export * from './pdp';
export * from './common';
export * from './search'
export * from './userAction'
export * from './shop'

// 简单来说，有三个分别调接口的地方，如果接口变了改来改去比较烦加了个这个 >_< 后面康康还能拓展些什么其他的，主要还是做接口数据预处理
export const apiFilter = (res, apiKey) => {
  const filterMap = {
    orderDetailApi: 'data.valentino.valentino_orderDetail.orderDetail',
  }
  return get(res, filterMap[apiKey], {})
}
