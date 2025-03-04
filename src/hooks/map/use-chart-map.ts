import * as Echarts from 'echarts';
import { ref, reactive, watch, toRef } from 'vue';
import GeoJsonOpts from './geo/area.json';
import { cloneDeep, get } from 'lodash-es';
import { calculateCenter, hexToRgba } from '@/utils';

const staticGeoJsonOpts: any = GeoJsonOpts;
function getSimpleGeoJson (denominator = 5) {
  const simpleGeojson = {
    type: 'FeatureCollection',
    features: [] as any[]
  };
  staticGeoJsonOpts.features.map((item: any) => {
    const featuresItem = item;
    // delete featuresItem.geometry.coordinates
    const coordinates: any = item.geometry.coordinates[0];
    const simpleCoordinates = coordinates.filter((o: number[], index: number) => {
      if (index % denominator === 0) {
        o[0] = Number(o[0].toFixed(4));
        o[1] = Number(o[1].toFixed(4));
        return true;
      }
    });
    featuresItem.geometry.coordinates = cloneDeep([simpleCoordinates]);

    simpleGeojson.features.push(featuresItem);
  });
  return simpleGeojson;
}
const GeoJson: any = getSimpleGeoJson(25);

function getDefalutSeriesLines ({ unit }: any) {
  return {
    series: {
      lines: [
        {
          name: 'bar3D',
          type: 'bar3D',
          coordinateSystem: 'geo3D',
          barSize: 1, //柱子粗细
          shading: 'lambert',
          opacity: 1,
          bevelSize: 0.3,
          itemStyle: {
            color: hexToRgba('#FF7048', 0.8)
          },
          label: {
            show: true,
            textStyle: {
              color: '#FF7048',
              fontSize: 22,
              fontWeight: 'bold'
            },
            formatter (params: any) {
              return get(params, 'value[2]', 0) + (unit || '家');
            }
          },
          data: [
          ]
        }
      ]
    }
  };
}

export function getSeriesLines (opts: any) {
  return getDefalutSeriesLines(opts).series.lines;
}

export interface SeriesBarMode {
  name: string
  value: number | string
  ratio?: number | string
  center?: number[]
}

export default function useMap (opts: any) {
  // arg
  const unit = toRef(opts, 'unit');

  // state/data
  const state = reactive<any>({
    geoItems: [] as SeriesBarMode[]
  });
  const seriesLinesRef = ref<any>([]);

  // init
  Echarts.registerMap('yuhang', GeoJson as any);
  const option = ref<any>({
    geo3D: {
      map: 'yuhang',
      regionHeight: 3,
      boxWidth: 95,
      boxDepth: 62,
      top: '-10%',
      shading: 'realistic',
      realisticMaterial: {
        roughness: 0.5
      },
      light: {
        main: {
          color: '#fff',
          shadow: true,
          alpha: '65',
          beta: 60
        },
        ambient: {
          intensity: 0.3
        }
      },
      viewControl: {
        autoRotate: false,
        autoRotateSpeed: 2,
        distance: 70
      },
      label: {
        show: true,
        formatter (params: any) {
          const content = params.name;
          return content;
        },
        textStyle: {
          color: '#fff',
          fontWeight: 'normal',
          fontSize: 12,
        },
        // hover
        emphasis: {
        }
      },
      // 阴影效果
      emphasis: {
        itemStyle: {
          borderWidth: 0.6,
          color: '#198b7b'
        }
      },
      itemStyle: {
        borderWidth: 0.4,
        color: '#198b7b'
      },
    },
    series: [
      {
        name: 'bar3D',
        type: 'bar3D',
        coordinateSystem: 'geo3D',
        barSize: 1, //柱子粗细
        shading: 'lambert',
        opacity: 1,
        bevelSize: 0.3,
        itemStyle: {
          color: hexToRgba('#FF7048', 0.8)
        },
        label: {
          show: true,
          textStyle: {
            color: '#FF7048',
            fontSize: 22,
            fontWeight: 'bold'
          },
          formatter (params: any) {
            return get(params, 'value[2]', 0) + unit.value;
          }
        },
        data: [
        ]
      }
    ]
  });

  watch(seriesLinesRef, () => {
    const cloneOption = cloneDeep(option.value);
    cloneOption.series = seriesLinesRef.value || [];
    option.value = cloneOption;
  });

  // fn
  function setSeriesBar (data: SeriesBarMode[], { unit }: any) {
    const seriesLinesGroup: any = getSeriesLines({ unit });
    state.geoItems = data;
    packBarData();
    const seriesLines: any = seriesLinesGroup.find((o: any) => o.type === 'bar3D');
    seriesLines.data = lineData();
    seriesLinesRef.value = seriesLinesGroup;
  }

  // 组装数据
  function packBarData () {
    const geoItems: SeriesBarMode[] = state.geoItems;
    geoItems.map((item: SeriesBarMode) => {
      const geoOpt = GeoJson.features.find((o: any) => o.properties.name === item.name);
      if (!geoOpt) return;
      const center = calculateCenter(geoOpt.geometry.coordinates[0]);
      item.center = [center.lng, center.lat];
    });
  }

  // 柱状体的主干
  function lineData () {
    const data: SeriesBarMode[] = state.geoItems;
    return data.map((item: SeriesBarMode) => {
      const center: number[] = item.center || [];
      return {
        name: item.name,
        value: center.concat(Number(item.value))
      };
    });
  }

  // 动态计算柱形图的高度（定一个max）
  function lineMaxHeight (data: SeriesBarMode[]): number {
    const maxValue = Math.max(...data.map((item: SeriesBarMode) => Number(item.value)));
    return 0.9 / maxValue;
  }

  return {
    option,

    // fn
    setSeriesBar
  };
}
