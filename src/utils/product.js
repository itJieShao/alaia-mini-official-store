import { get } from './utilityOperationHelper'
import {
  CATEGORY_STR, DESCRIPTION_STR, DESCRIPTION_SPF_STR, COLOR_STR,
  OTHER_ATTR_STR,
  WHITE_SERVICE_NAME,
  SPECIAL_TAG_STR,
} from '../constants/product'

export const getCategory = (product) => getAttr(product, CATEGORY_STR)

export const getDescription = (product) => getAttr(product,  DESCRIPTION_STR)

export const getDescriptionSPF = (product) => getAttr(product, DESCRIPTION_SPF_STR)

export const getColorRes = (product) => getAttr(product, COLOR_STR) === '是'

export const getOtherAttr = (product) => getAttr(product, OTHER_ATTR_STR)

export const getSpecialStr = (product) => getAttr(product, SPECIAL_TAG_STR)

function getAttr(product, type) {
  const attr = get(product, 'attributes') || []
  const res = attr.find((item) => item.frontName === type)
  return get(res, 'values[0].displayName') || ''
}

export const getSize = (product) => {
  if (['颜色', '有色商品-颜色'].includes(get(product, 'options[0].frontName'))) {
    return getOtherAttr(product)
  }
  const skus = get(product, 'skus') || []
  if (skus && skus.length > 0) {
    const mainSku = skus.find((sku) => get(sku, 'featuredType') === 'FEATURED') || skus.find((sku) => get(sku, 'isEnabled'))
    const sizeName = (get(mainSku, 'options[0].value.frontName') || '').replace(/\/(.*)/g, '')
    if (sizeName === '赠品' || sizeName === '礼盒') {
      return ''
    }
    return sizeName.replace(/(^\s+)|(\s+$)|\s+/g, '');
  }
  return ''
}
export const getSizeGA = (product) => get(product, 'options[0].value.frontName') || get(product, 'options[0].values[0].frontName')

export const getSizeBySkuInfo = (skuInfo) => {
  const result = get(skuInfo, 'options', []).find((v) => v.originCode === 'customSize')
  return get(result, 'value.frontName', '')
}

export const getColorBySkuInfo = (skuInfo) => {
  const result = get(skuInfo, 'options', []).find((v) => v.originCode === 'basecolor')
  return get(result, 'value.name', '')
}

export const getWhiteGloveService = (product) => (get(product, 'labels') || []).find((item) => (new RegExp(`${WHITE_SERVICE_NAME}`)).test(item.frontName))
