<template>
  <section class="login-page">
    <div class="content">
      <div class="login-title">{{ loginTitle }}</div>
      <section class="login-form">
        <div class="cont-title">登录系统</div>
        <el-form
          ref="formRef"
          :model="state.params"
          style="width: 100%"
          hide-required-asterisk
        >
          <el-row>
            <FormItemCol
              v-model="state.params.username"
              :span="24"
              label=""
              prop="username"
              require
              placeholder="请输入用户名"
            >
              <template #prefix>
                <el-icon size="24"><User /></el-icon>
              </template>
            </FormItemCol>
            <FormItemCol
              v-model="state.params.password"
              :span="24"
              label=""
              prop="password"
              type="password"
              require
              show-password
              placeholder="请输入密码"
            >
              <template #prefix>
                <el-icon size="24"><Lock /></el-icon>
              </template>
            </FormItemCol>
            <FormItemCol
              v-model="state.params.code"
              :span="24"
              label=""
              prop="code"
              type="slot"
              slot-key="code"
              require
              placeholder="请输入验证码"
            >
              <template #prefix>
                <el-icon size="24"><Lock /></el-icon>
              </template>
              <template #code>
                <el-input v-model="state.params.code" maxlength="4" placeholder="请输入验证码" />

                <div class="login-code-wrap">
                  <div class="login-code">
                    <img :src="codeUrl" class="login-code-img" @click="getCode" />
                  </div>
                </div>
              </template>
            </FormItemCol>
            <div class="submit-btn " @click="onSubmit">
              <el-button
                class="btn login"
                :loading="state.loading"
              >
                登录
              </el-button>
            </div>
          </el-row>
        </el-form>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import FormItemCol from '@/components/form-item-col/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import { encrypt } from '@/libs/sm4-crypt'
import { getLoginCodeApi } from '@/api/modules/java.login'
defineProps({})

const store = useStore()

const router = useRouter()
const loginTitle = ref('安福高新技术产业园区')
// -------- inject --------

// -------- ref --------
const formRef = ref<any>(null)
const codeUrl = ref('')
const state = reactive({
  params: {
    username:import.meta.env.VITE_USERNAME,// admin
    password: import.meta.env.VITE_PASSWORD,// Sjy@123qwe
    code: '',
    uuid: ''
  },
  loading: false
})

let route = useRoute()
async function onSubmit() {
  try {
    await formRef.value?.validate()
    state.loading = true
    // 本地测试显示账户，不需要md5加密了
    let res
    res = await store.dispatch(
      'login',
      Object.assign({}, state.params, {
        // password: encrypt(state.params.password)
        password: state.params.password
      })
    )

    state.loading = false
    if (res.success) {
      ElMessage({ type: 'success', message: '登录成功!', duration: 1500 })
      router.replace('/')
    }else{
      getCode()
    }
  } catch (e) {
    console.log(e)
  }
}

async function getCode () {
  const res = await getLoginCodeApi()
  codeUrl.value = 'data:image/jpeg;base64,' + res.img
  state.params.uuid = res.uuid
}

onMounted(async () => {
  await getCode()
})
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: imgPathScss('login/bg.png');
  z-index: 111;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .title {
    width: 716px;
    height: 242px;
    margin-top: 0;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .login-title {
      background: linear-gradient(90deg, #fff 0%, #cdfff6 100%);
      -webkit-background-clip: text;
      background-clip: text;
      font-size: 48px;
      color: transparent;
      font-family: 'Alimama ShuHeiTi';
      font-weight: bold;
      text-shadow: inset 0 0 2px rgba(255, 255, 255, 0.8);
      line-height: 48px;
      letter-spacing: 6px;
    }
  }
}

.login-form {
  width: 562px;
  height: 420px;
  margin-top: 42px;
  padding: 0 74px;
  background-size: 100% 100%;
  background-image: imgPathScss('login/bg-wrap.png');

  .cont-title {
    margin-top: 34px;
    font-size: 24px;
    color: #fff;
    font-family: 'Alimama ShuHeiTi';
    font-weight: bold;
    text-align: center;
    line-height: 28px;
  }

  :deep .el-form {
    margin-top: 60px;
    .el-form-item {
      margin-bottom: 24px !important;
      height: 54px !important;
      .el-form-item__label {
        font-size: 16px !important;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
      }
      .el-form-item__content {
        height: 100%;
      }
      .el-input {
        height: 100%;
        color: white;
        ::placeholder {
          color: rgba(183, 188, 195, 1);
        }
      }
      .el-input__prefix-inner {
        position: relative;
        margin-right: 7px;
        &::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -7px;
          width: 1px;
          height: 14px;
          background: #d3dcea;
        }
      }
      .el-input__wrapper {
        background: white;
        height: 100%;
        padding-left: 10px;
        border-radius: 4px 4px 4px 4px;
        color: #333;

        background-color: transparent;
        border-color: #00f2f2;
        border-radius: 4px;
        font-size: 16px;
        color: #fff;
        .el-input__inner {
          color: white;
          font-size: 18px;
        }
      }
    }
  }

  .code-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    > img {
      width: 124px;
      height: 44px;
      background: #dcdff1;
      cursor: pointer;
    }
  }

  .submit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    padding-bottom: 10px;
    background-size: 100% 100%;
    background-image:imgPathScss('login/bg-btn.png');
    cursor: pointer;

    .btn {
      background: linear-gradient(180deg, #d2f3ea 0%, #f0fbf8 100%);
      -webkit-background-clip: text;
      background-clip: text;
      font-size: 20px;
      color: transparent;
      font-family: 'Alibaba PuHuiTi';
      font-weight: bold;
      text-shadow: 0 2px 4px rgba(32, 52, 31, 0.25);
      line-height: 20px;

      &.login {
        border: 0px;
        // color: #ffffff;
        // font-size: 20px;
      }
    }
  }
}

.icon {
  width: 20px;
  height: 20px;
}

.login-code {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  img{
    height: 100%;
    background: #dcdff1;
    cursor: pointer;
  }
}
</style>
