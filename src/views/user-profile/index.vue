<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar 
        class="page-nav-bar"
        title="个人信息"
        left-arrow
        @click-left="$router.back()"
    />

    <input type="file" hidden ref="file" @change="onFileChange">


    <!-- 个人信息 -->
    <van-cell title="头像" 
        class="photo-cell"
        is-link
        center
        @click="$refs.file.click()"
    >
    <van-image
        class="avatar"
        fit="cover"
        round
        :src="user.photo"
    />
    </van-cell>
    <van-cell title="昵称"
        :value="user.name"
        is-link
        @click="isUpdateNameShow = true"
    />
    <van-cell title="性别"
        :value="user.gender === 0 ? '男' : '女'"
        is-link
        @click="isUpdateGenderShow = true"
    />
    <van-cell title="生日"
        :value="user.birthday"
        is-link
        @click="isUpdateBirthdayShow = true"
    />

    <!-- 编辑昵称 -->
    <van-popup 
        style="height: 100%" 
        v-model="isUpdateNameShow"
        position="bottom"    
    >
        <update-name
            v-if="isUpdateNameShow"
            @close="isUpdateNameShow = false" 
            v-model="user.name"

        />
            
    </van-popup>
    <!-- 编辑性别 -->
    <van-popup 
            v-model="isUpdateGenderShow"
            position="bottom"    
        >
        <update-gender 
            v-if="isUpdateGenderShow"
            v-model="user.gender"
            @close="isUpdateGenderShow = false"
        />
    </van-popup>

    <!-- 编辑生日 -->
    <van-popup 
            v-model="isUpdateBirthdayShow"
            position="bottom"    
        >
        <update-birthday
            v-if="isUpdateBirthdayShow"
            v-model="user.birthday"
            @close="isUpdateBirthdayShow = false"
        />
    </van-popup>

    <!-- 编辑头像 -->
    <van-popup 
            v-model="isUpdatePhotoShow"
            position="bottom"
            style="height: 100%"
        >
        <update-photo 
            v-if="isUpdatePhotoShow"
            :img="img" 
            @close="isUpdatePhotoShow = false"
            @update-photo="user.photo = $event"
        />
    </van-popup>
  </div>
</template>

<script>
    import { getUserProfile } from '@/api/user'
    import UpdateName from './components/update-name.vue'
    import UpdateGender from './components/update-gender.vue'
    import UpdateBirthday from './components/update-birthday.vue'
    import UpdatePhoto from './components/update-photo.vue'
export default {
    name: 'UserProfile',
    components: {
        UpdateName,
        UpdateGender,
        UpdateBirthday,
        UpdatePhoto,
    },
    
    data () {
        return {
            user: {},  //个人信息
            isUpdateNameShow: false,  // 编辑昵称的显示状态
            isUpdateGenderShow: false,  // 编辑性别的
            isUpdateBirthdayShow: false,  // 编辑生日
            isUpdatePhotoShow: false,  // 编辑头像
            img: null // 预览的图片
        }
    },
    created () {
        this.loadUserProfile()
    },
    methods: {
        async loadUserProfile () {
            try {
                const { data } = await getUserProfile()
                this.user = data.data
            } catch (err) {
                this.$toast('数据获取失败')
            }
        },

        onFileChange () {
            // 获取文件对象
            const file = this.$refs.file.files[0]
            // 给予文章对象获取blob 数据

            this.img = window.URL.createObjectURL(file)
            // 展示预览图片弹出层
            this.isUpdatePhotoShow = true

            // file-input 如果选了同一个文件不会触发 change 事件
            // 解决办法每次使用完，把他们 value 清空
            this.$refs.file.value = ''
        }

    }
}
</script>

<style scoped lang="less">
    /deep/.van-nav-bar .van-icon {
            color: #fff !important;
        }
        /deep/.van-nav-bar__text {
            color: #fff;
        }

    .user-profile {
        .avatar {
            width: 60px;
            height: 60px;
        }
        .van-popup {
            background-color: #f5f7f9;
        }
    }
</style>