import { App } from 'vue'
import ElementPlus from './element-plus'
// import ZtPlus from './zt';
import Rem from './rem'
const install = (app: App): void => {
  app.use(ElementPlus)
  // app.use(ZtPlus);
  app.use(Rem)
}

export { install }
