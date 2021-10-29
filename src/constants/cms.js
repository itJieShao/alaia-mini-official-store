export const CMS_MODULE = {
  ADV: 'laprairie_Adv',
  PRODUCT: 'laprairie_categoryProduct',
  LPBANNER: 'LP_title_banner',
  SIMPLE: 'laprairie_simple',
  PIC: 'standingPic',
  TITLES: 'laprairie_titles',
  PLP_HEAD: 'LP_PLP_head',
  PLP_TITLE_PRODUCT: 'LP_titles_product',
  PLP_BANNER: 'LP_PLP_banner',
}

// cmscode 
//首页
export const HOME_MAIN_SWIPER_CONFIG = {  moduleCode: 'swiper', templateCode: 'swiper_group', contentCode: 'home_main_swiper' }
export const HOME_TOP_NOTIFY_CONFIG = {  moduleCode: 'swiper', templateCode: 'swiper_group', contentCode: 'home_top_notify' }
export const HOME_SUB_SWIPER_CONFIG = {  moduleCode: 'swiper', templateCode: 'content_swiper_group', contentCode: 'home_sub_swiper' }
export const HOME_STORE_CONFIG = {  moduleCode: 'swiper', templateCode: 'section_content', contentCode: 'home_store' }
export const HOME_PRODUCT_CONFIG = {  moduleCode: 'swiper', templateCode: 'content_swiper_group', contentCode: 'home_product' }
export const HOME_BRAND_INTRO_CONFIG = {  moduleCode: 'swiper', templateCode: 'section_content', contentCode: 'home_brand_intro' }
export const HOME_STYLING_INSPIRATION_TITLE_CONFIG = { moduleCode: 'swiper', templateCode: 'section_content', contentCode: 'home_styling_inspiration_title' }
export const HOME_RECOMMEND_PRODUCT_CONFIG = { moduleCode: 'swiper', templateCode: 'content_swiper_group', contentCode: 'home_recommend_product' }
// 分类页
export const CATEGORY_ACTIVITY_CONFIG = { moduleCode: 'swiper', templateCode: 'swiper_group', contentCode: 'category_activity' }
// 猜你喜欢
export const GUESS_LIKE_SEARCH_CONFIG = { fieldName: 'searchGuessLike', moduleCode: 'product_sku', templateCode: 'guess_like_template', contentCode: 'guess_like_search' }
export const GUESS_LIKE_CAET_CONFIG = { fieldName: 'cartGuessLike', moduleCode: 'product_sku', templateCode: 'guess_like_template', contentCode: 'guess_like_cart' }
export const GUESS_LIKE_PLP_CONFIG = { fieldName: 'plpGuessLike', moduleCode: 'product_sku',  templateCode: 'guess_like_template', contentCode: 'guess_like_plp' }
export const GUESS_LIKE_FAVORITE_CONFIG = { fieldName: 'favoriteGuessLike',moduleCode: 'product_sku', templateCode: 'guess_like_template', contentCode: 'guess_like_favorite' }
// 帮助页cms
export const HELP_LIST_CMS_CONFIG = {  moduleCode: 'index', templateCode: 'help_index', contentCode: 'help_index' }


export const CMS_CONFIG_LIST = [
  HOME_MAIN_SWIPER_CONFIG,
  HOME_TOP_NOTIFY_CONFIG,
  HOME_SUB_SWIPER_CONFIG,
  HOME_STYLING_INSPIRATION_TITLE_CONFIG,
  HOME_PRODUCT_CONFIG,
  HOME_STORE_CONFIG,
  HOME_BRAND_INTRO_CONFIG,
  HOME_RECOMMEND_PRODUCT_CONFIG,
  CATEGORY_ACTIVITY_CONFIG,
  HELP_LIST_CMS_CONFIG,
  GUESS_LIKE_SEARCH_CONFIG,
  GUESS_LIKE_CAET_CONFIG,
  GUESS_LIKE_PLP_CONFIG,
  GUESS_LIKE_FAVORITE_CONFIG
]