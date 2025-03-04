import { App } from 'vue'
import ElementPlus from './element-plus'
// import ZtPlus from './zt';
import SChart from './chart'
import Rem from './rem'
const install = (app: App): void => {
  app.use(ElementPlus)
  // app.use(ZtPlus);
  app.use(SChart)
  app.use(Rem)
}

export { install }
