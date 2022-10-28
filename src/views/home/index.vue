<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        icon="search"
        round
        to="/search"
      >
      搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable >
      <van-tab 
      :title="channel.name"
      v-for="channel in channels"
      :key="channel.id">

      <!-- 文章列表 -->
      <article-list :channel="channel"/>
      </van-tab>
        <div slot="nav-right" class="placeholder"></div>
        <div slot="nav-right" class="hamburger-btn" 
          @click="isChennelEditShow = true">
          <i class="toutiao toutiao-gengduo"></i>
        </div>
    </van-tabs> 
   
      <!-- 频道编辑弹出层 -->
      <van-popup
        v-model="isChennelEditShow"
        closeable
        position="bottom"
        close-icon-position="top-left"
        :style="{ height: '100%' }"
      >
      <channel-edit :my-channels="channels"
        :active="active" 
        @update-active="onUpdateActive" />
      </van-popup>

      
      
  </div>
</template>

<script>
  import { getUserChannels } from '@/api/user'
  import ArticleList from './components/article-list.vue'
  import ChannelEdit from './components/channel-edit.vue'
  import { mapState } from 'vuex'
  import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  props: {

  },
  data () {
    return {
      active: 0,
      channels: [], // 频道数据
      isChennelEditShow: false,  // 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created () {
    this.loadChannels() 
  },
  mounted () {},
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels
        let channels = []

        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地储存的频道列表
          const localChannels = getItem("TOUTIAO_CHANNELS")
          // 有就直接用
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有数据，请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChennelEditShow = true) {
      // 更新激活的频道
      this.active = index
      // 关闭编辑频道弹层
      this.isChennelEditShow = isChennelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  // 害我半小时  还是添加这个/deep/好使
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  .van-nav-bar .van-icon {
    color: #fff;
  }
  
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/.channel-tabs {
    .van-tabs__content {
      min-height: 79vh;
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 5px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
    color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      bottom: 8px;
    }
    .placeholder {
      flex-shrink: 0;
      width: 48px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: .4px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
  
}
</style>