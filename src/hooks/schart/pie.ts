import { getTheme } from '@szzt/chart';
class Item {
  [x: string]: any

  constructor (props: any) {
    props.map((color: string, index: number) => {
      this['color' + index] = {
        color: color,
        fontSize: 32,
        lineHeight: 14,
      };
    });
  }
}
const colorRich = new Item(getTheme().color);
export const pieGroup = {
  RingCenter: {
    radius: ['65%', '80%'],
    center: ['30%', '50%'],
    label: {
      show: false,
    },
    itemStyle: {
      borderWidth: 3,
      borderColor: '#03132B',
    },
    labelLine: {
      showAbove: true,
      lineStyle: {
        color: 'rgba(255,255,255,0.5)'
      }
    }
  },
  RingLeft2222: {
    radius: ['60%', '75%'],
    center: ['28%', '50%'],
    label: {
      show: false,
      alignTo: 'labelLine',
      formatter: (data: any) => {
        return `{color${data?.dataIndex}|■  }{name|${data?.name}} \n\n{percent|${data?.percent}%}`;
      },
      rich: {
        ...colorRich,
        percent: {
          fontSize: 28,
          color: '#fff',
          fontWeight: 'bold'
        },
      }
    },
    labelLine: {
      length: 10
    }
  },
};
