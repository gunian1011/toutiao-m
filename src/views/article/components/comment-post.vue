<template>
    <div class="comment-post">
      <van-field
        class="post-field"
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="150"
        placeholder="请输入留言"
        show-word-limit
      />
      <van-button
        class="post-btn"
        @click="onPost"
        :disabled="!message.length"
      >发布</van-button>
    </div>
  </template>
  
  <script>
    import { addComment } from '@/api/comment'
  export default {
    name: 'CommentPost',
    components: {},
    props: {
        target: {
            type: [Number, String, Object],
            required: true
        }
    },
    data () {
      return {
        message: ''
      }
    },
    computed: {},
    watch: {},
    created () {},
    mounted () {},
    methods: {
        async onPost () {
            this.$toast.loading({
                message: '发布中...',
                forbidClick: true,  //  禁用背景点击
                duration: 0 // 持续时间，默认是2000
            })
            try {
                const { data } = await addComment({
                    target: this.target,
                    content: this.message,
                    art_id: null,
                })
                console.log(data);

                
                // 清空文本框
                this.message = ''
                this.$emit('post-success', data.data)

                this.$toast.success('发布成功')
            } catch (err) {
                this.$toast.fail('发布失败')
            }
        }
    }
  }
  </script>
  
  <style scoped lang="less">
  .comment-post {
    display: flex;
    align-items: center;
    padding: 32px 0 32px 32px;
    .post-field {
      background-color: #f5f7f9;
    }
    .post-btn {
      width: 150px;
      border: none;
      padding: 0;
      color: #6ba3d8;
      &::before {
        display: none;
      }
    }
  }
  </style>
  