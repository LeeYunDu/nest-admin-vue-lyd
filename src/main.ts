import { createApp } from 'vue'
import App from './App.vue'
import * as global from './global/lib/index'
import './router/permission'
import router from './router'
import store from './store'
import '@/styles/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 帮助开发者根据不同屏幕尺寸和分辨率自动调整布局，使得网站在各种设备上（如手机、平板、桌面等）都能流畅运行。
// import 'amfe-flexible'
// 兼容低版本浏览器
import 'core-js/stable'
import 'regenerator-runtime/runtime'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(global)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
