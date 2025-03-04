import { parseDataset } from '@szzt/chart';

export const legendGroup = {
  RightLegendVNP: {
    width: '25%',
    right: '-3.5%',
    top: 'center',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 10,
    icon: 'rect',
    align: 'left',
    itemStyle: {

    },
    formatter: (dataset: any) => {
      return function (name: string) {
        const itemData: any = parseDataset(dataset).data.find(item => item._name === name) || {};
        const unit = itemData._unit || '';
        return `{name|${name}}{percent|${Number(itemData._value || 0).toLocaleString()}}${unit}   {percent|${(itemData._percent || 0) + '%'}  }`;
      };
    },
    textStyle: {
      rich: {
        name: {
          fontSize: 14,
          width: 80,
          fontFamily: 'Alibaba-PuHuiTi-R'
        },
        value: {
          fontSize: 14,
          color: '#57B8FA',
          fontFamily: 'Roboto-Regular'
        },
        percent: {
          fontSize: 14,
          color: '#DFECFB',
          fontFamily: 'Roboto-Regular'
        }
      },
    }
  },
  RightLegendVPYY: {
    type: 'scroll',
    orient: 'vertical',
    right: 0,
    top: 'center',
    pageIconColor: '#57B8FA',
    pageIconInactiveColor: '#ffffff',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 8,
    formatter: (dataset: any) => {
      return function (name: string) {
        const itemData: any = parseDataset(dataset).data.find(item => item._name === name) || {};
        const unit = itemData._unit || '';
        return `{name|${name}}{percent|${Number(itemData._value / 10000).toFixed(2)}亿元}`;
      };
    },
    textStyle: {
      rich: {
        name: {
          fontSize: 12,
          width: 100
        },
        value: {
          fontSize: 16,
          color: '#57B8FA'
        },
        percent: {
          fontSize: 10,
          color: '#ffffff'
        }
      },
    }
  },
  RightLegendVP: {
    type: 'scroll',
    orient: 'vertical',
    width: '25%',
    right: '3.5%',
    top: 'center',
    pageIconColor: '#57B8FA',
    pageIconInactiveColor: '#ffffff',
    itemWidth: 16,
    itemHeight: 16,
    itemGap: 16,
    formatter: (dataset: any) => {
      return function (name: string) {
        const itemData: any = parseDataset(dataset).data.find(item => item._name === name) || {};
        const unit = itemData._unit || '';
        const result = name.length > 8 ? name.slice(0, 8) + '\n' + name.slice(8, name.length) : name;
        return `{name|${result}}{percent|${itemData._percent || 0}%}`;
      };
    },
    textStyle: {
      rich: {
        name: {
          fontSize: 20,
          width: 240
        },
        value: {
          fontSize: 32,
          color: '#57B8FA'
        },
        percent: {
          fontSize: 24,
          color: '#ffffff'
        }
      },
    }
  },
};
