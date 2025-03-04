
import { register, setColor, setBase, setTheme } from '@szzt/chart';
import { pieGroup } from './pie';
import { legendGroup } from './legend';
import { lineGroup } from './line';

setBase({
  docWidth: 1920,
  baseFont: 14,
  autoRotate: false,
  autoResize: true
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
  textColor: '#fff'
});

setTheme({
  valueAxis: {
    axisLabel: {
      fontSize: 12,
      textStyle: {
        fontSize: 12,
        color: '#9CA4B2'
      },

    },
    nameTextStyle: {
      fontSize: 12,
      color: '#9CA4B2',
    },
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },

    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(178, 194, 211, .2)',
        type: 'dashed'
      }
    }
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#3D77C6',
        type: 'solid'
      }
    },
    axisLabel: {
      fontSize: 12,
      textStyle: {
        fontSize: 12,
        color: '#9CA4B2',
        rotate: 0
      },
      formatter: val => {
        return val;
      }
    },
    splitLine: {
      show: false
    },

  },
  grid: {
    top: 30,
    left: 15,
    bottom: 0,
    right: 15
  },
  legend: {

    allign: 'auto',
    itemWidth: 8,   // 设置每个图例项的宽度
    itemHeight: 8,  // 设置每个图例项的高度
    textStyle: {
      fontSize: '12px',
      color: '#ffffff'
    }
  },
  tooltip: {
    trigger: 'axis',

  }
});


export function useRegister () {
  register('pie', {
    RingCenter: pieGroup.RingCenter,
    RingLeft2222: pieGroup.RingLeft2222,
  });
  register('legend', {
    RightLegendVNP: legendGroup.RightLegendVNP,
    RightLegendVP: legendGroup.RightLegendVP,
    RightLegendVPYY: legendGroup.RightLegendVPYY,
  });

}
