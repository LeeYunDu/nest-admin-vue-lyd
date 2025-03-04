import { App } from 'vue';
import SChart, { setBase, setColor, setTheme } from '@szzt/chart';


export default {
  install ( app: App ) {
    setBase({
      docWidth: 1920,
      baseFont: 28
    });
    setColor({
      color: [
        '#09c788',
        '#ee6e53',
        '#0383f5',
        '#fdce1e',
        '#b562fb',
        '#3F51B5',
        '#81C883',
        '#86a6d5',
        '#B3B3B6'
      ],
      textColor: '#9FA9BA'
    });
    setTheme({
      valueAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(159,169,186,0.3)'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#9FA9BA'
          }
        },
        axisLabel: {
          show: true,
          color: '#9FA9BA'
        }
      },
      categoryAxis: {
        axisLabel: {
          show: true,
          color: '#9FA9BA'
        },
        splitLine: {
          show: false
        },
        axisLine: {
          // show:false,
          lineStyle: {
            color: '#9FA9BA'
          }
        },
        axisTick: {
          show: false
        }
      }
    });

    app.use(SChart);
  }
};
