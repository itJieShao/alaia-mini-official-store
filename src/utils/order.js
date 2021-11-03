import { ORDER_ALL_STATUS } from '@/constants/order';


export const isAllOrderStatus = (statues) => {
  return statues.length === ORDER_ALL_STATUS.length 
}