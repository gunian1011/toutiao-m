<template>
  <div class="channel-edit">
    <van-cell :border="false">
        <div slot="title" class="title-text">我的频道</div>
        <van-button type="danger" class="edit-btn"
        plain round size="mini" 
        @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
        <van-grid-item 
        class="grid-item"
        v-for="(channel, index) in myChannels" 
        :key="index"
        @click="onMyChannelClick(channel, index)"
        >
        <!-- v-bind:class 语法
            一个对象，对象中的key表示要作用的css类名
            对象中的value要计算出布尔值
            true 则作用于该类名
            false 不作用该类名 -->
            <van-icon v-show= "isEdit && !fiexdChannels.includes(channel.id)" 
                slot="icon" name="clear"></van-icon>
        <span slot="text" class="text"
          :class="{ active: index === active }">{{ channel.name }}</span>
        </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
        <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
        <van-grid-item 
            class="grid-item"
            icon="plus"
            v-for="(channel, index) in recommendChannels" 
            :key="index" 
            :text="channel.name"
            @click="onAddChannel(channel)" 
        />
    </van-grid>
  </div>
</template>

<script>
    import { getAllChannels, addUserChannels, deleteUserChannel } from '@/api/channle'
    import { mapState } from 'vuex'
    import { setItem } from '@/utils/storage'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannels: {
        type: Array,
        required: true
    },
    active: {
        type: Number,
        required: true
    }
  },
  data () {
    return {
        allChannels: [], // 所有频道
        isEdit: false,  // 控制编辑状态的显示
        fiexdChannels: [0], // 固定频道，不允许被删除
    }
  },
  computed: {

    ...mapState(['user']),
    
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖数据发生变化，则计算属性会重新执行
    recommendChannels () {
        // 数组的 filter 方法 遍历数组，把复合条件的元素添加到新的数组
        return this.allChannels.filter(channel => {
            return !this.myChannels.find(myChannels => {
                return myChannels.id === channel.id
            })
        })
    }

    // recommendChannels () {
    //     const channels = []
    //     this.allChannels.forEach(channel => {
    //         // find 遍历数组【，找到满足条件的元素项
    //         const ret = this.myChannels.find(myChannel => {
    //             return myChannel.id === channel.id
    //         })
    //         // 如果我的频道中不包括该频道项，则收集到推荐频道
    //         if (!ret) {
    //             channels.push(channel)
    //         }
    //     })
    //     // 把结果返回
    //     return channels
    // }
    
    
  },
  watch: {},
  created () {
    this.loadAllChannels()
  },
  mounted () {},
  methods: {
    async loadAllChannels () {
        try {
            const { data } = await getAllChannels()
            this.allChannels = data.data.channels
        } catch (err) {
            this.$toast('数据获取失败')
        }
    },

    async onAddChannel (channel) {
        this.myChannels.push(channel)

        // 数据持久化处理
        if (this.user) {
            try {
                // 已登录，把数据请求接口放到线上
                await addUserChannels({
                    id: channel.id,  // 频道id
                    seq: this.myChannels.length, // 序号
                })
            } catch {
                this.$toast('保存失败，请稍后重试')
            }
        } else {
            // 未登录，把数据存储到本地
            setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
        
    },
               
    onMyChannelClick (channel, index) {
        // 如果是编辑状态执行删除频道
        if (this.isEdit){
            // 如果是固定频道，则不删除
            if (this.fiexdChannels.includes(channel.id)) {
                return
            }

            // 2. 删除频道项
            this.myChannels.splice(index, 1)

            // 3. 如果删除的激活频道之前的频道，则更新激活的频道项
            // 参数1：要删除的元素的开始索引
            // 参数2：删除的个数，如果不指定，则从参数1开始一直删到最后
            if (index <= this.active) {
                // 让激活频道的索引 -1
                this.$emit('update-active', this.active -1, true)
            }
            // 4. 处理持久化
            this.deleteChannel(channel)
        } else {
            // 如果不是，执行切换频道
            this.$emit('update-active', index, false)
        }
    },
    async deleteChannel (channel) {
        try {
            if(this.user) {
                // 已登录，将数据更新到线上
                await deleteUserChannel(channel.id)
            } else {
                // 未登录，将数据更新到本地
                setItem('TOUTIAO_CHANNELS', this.myChannels)
            }
        } catch (err) {
            this.$toast('操作失败，请稍后再试')
        }
       
    }
  }
}
</script>

<style scoped lang="less">
    .channel-edit {
        padding: 85px 0;
        .van-button--plain, .van-button--danger {
            padding: 20px;
        }
        .title-text {
            font-size: 32px;
            color: #333333;
        }
        .edit-btn {
            width: 104px;
            height: 48px;
            font-size: 26px;
            color: #f85959;
            border: 1px solid #f85959;
        }
        /deep/ .grid-item {
           width: 160px;
           height: 86px;
           .van-grid-item__content {
            white-space: nowrap;
                background-color: #f4f5f6; 
                .van-grid-item__text, .text {
                    font-size: 28px;
                    color: #222;
                    margin-top: 0;
                }
                .active {
                    color: red;
                }
                .van-grid-item__icon-wrapper {
                    position: unset;
                }
           }

           
        }

        /deep/ .my-grid {
            .grid-item {
                .van-icon-clear {
                    position: absolute;
                    right: -10px;
                    top: -10px;
                    color: #cacaca;
                    font-size: 30px;
                    z-index: 2;

                }
            }
        }

        /deep/ .recommend-grid {
            .grid-item {
                .van-grid-item__content {
                    flex-direction: row;
                    .van-icon-plus {
                        font-size: 28px;
                        margin-right: 6px;
                    }
                    
                }
            }
        }
    }
    
</style>
