<template>
  <view class="menu">
    <popup :show="visible" @close="handleClose">
      <view class="close" @click="handleClose">
        <!-- <image class="icon-c" :src="require('../../assets/images/icon/menu-close.png')"/> -->
      </view>
      <view class="search">
        <view class="search-content">
          <input
            placeholder="搜索" :value="keyWord" @focus="handleSearchFocus"
            @blur="handleSearchBlur"
            @input="handleSearchInput"
            placeholder-class="input-placeholder"/>
          <!-- <image v-if="keyWord.length > 0" @click="handleClear" class="icon close-icon" :src="require('../../assets/images/icon/menu-close.png')"/>
          <image v-else @click="handleSearchInput" class="icon search-icon" :src="require('../../assets/images/icon/menu-search.png')"/> -->
        </view>
      </view>
      <scroll-view :scroll-y="true" class="list">
        <template v-if="!isFocus && (!keyWord || keyWord.length === 0)">
          <template v-for="men0u in menusList">
            <view v-if="menu.display" :key="menu.code" class="item" @click="handleMenuClick(menu)">{{ menu.name }}</view>
          </template>
        </template>
        <template v-else-if="isFocus && keyWord">
          <view v-if="searchProductResultList.length === 0" class="empty-list">未找到结果。</view>
          <view v-else class="result-list">
            <searchList :productList="searchProductResultList" @close="handleClose"/>
          </view>
        </template>
      </scroll-view>
    </popup>
  </view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { throttle } from '../../utils/utilityOperationHelper'
import popup from '../menuPopup'
import searchList from '../searchList'
import { navigateTo } from '../../utils/utils'
import {
  EVENT_TYPE, trackerClick, trackerProductImpression, SCREEN_NAME,
} from '../../utils/ga'

export default {
  name: 'Menu',
  components: {
    popup,
    searchList,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal && (!this.menusList || this.menusList.length === 0)) {
          this.getMenus()
        }
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters('search', ['defaultFilter', 'keyWord', 'searchProductResultList', 'isFocus']),
    ...mapGetters('common', ['menusList']),
  },
  methods: {
    ...mapActions('common', ['getMenus']),
    ...mapActions('search', ['searchProduct', 'setkeyWord', 'setSearchProductResultList', 'setFocus', 'setMenuName']),
    handleClose() {
      this.$emit('close')
    },
    handleMenuClick(item) {
      this.handleClose()
      setTimeout(() => {
        navigateTo(item.url)
      }, 300);
      this.setMenuName(item.name)
      trackerClick({ ...EVENT_TYPE.MENU, ...{ label: `精选产品::${item.name}` } })
    },
    handleSearchInput(e) {
      const { value } = e.detail
      this.setkeyWord(value)
      if (!value || value.length === 0) {
        this.setSearchProductResultList()
        return
      }
      throttle(this.searchProduct({
        filters: { ...this.defaultFilter, keyword: value },
        sort: {
          name: 'LIST_TIME',
          sort: 'DESC',
        },
      }).then((list) => {
        if (list && list.length > 0) {
          trackerProductImpression(list, SCREEN_NAME.SEARCH_MENU)
        }
      }).catch((e) => {
        console.log('查询失败', e)
      }), 300)
    },
    handleClear() {
      this.setkeyWord()
      this.setSearchProductResultList()
      this.setFocus(false)
    },
    handleSearchFocus() {
      this.setFocus(true)
    },
    handleSearchBlur() {
      if (!this.keyWord || this.keyWord.length === 0) {
        this.setFocus(false)
      }
    },
  },
}
</script>

<style lang="scss">
@import "./index.scss";
</style>
