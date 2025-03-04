import { ref, onMounted, reactive, toRefs } from 'vue';
import { isArray, isString } from '@/utils';

export interface AMapOptionsMode {
  container: string | Element
  mapOptions: any
  mapStyle?: string
  loop?: any
  options?: any
}

export interface MarkerMode {
  picture: string
  content: string
}

export interface AMapStateMode {
  map: any

  [key: string]: any
}

export interface PolygonStyleMode {
  strokeColor?: string
  strokeWidth?: number
  fillColor?: string
  fillOpacity?: number
  strokeOpacity?: number
}

export interface PolylineStyleMode {
  strokeColor?: string
  borderWeight?: number
  lineJoin?: string
}

export interface AddPolygonMode {
  geoJSON: any
  style?: PolygonStyleMode
  activeStyle?: PolygonStyleMode
  type?: string
  calculateCenter?: boolean
}

export interface AddPolylineMode {
  data: any
  style?: PolylineStyleMode
}

export type MarkerOptionsMode = {
  position: any
  icon?: any
  zIndex?: number
  content?: string
  [key: string]: any
}

export interface AddMarkerMode {
  data: MarkerOptionsMode | MarkerOptionsMode[]
}

export default function useAMap (options: AMapOptionsMode): AMapStateMode {
  let polygonResolve: any;
  let markerResolve: any;

  const { container, mapOptions, mapStyle, options: stateOpts }: AMapOptionsMode = options || {};
  console.log('stateOpts: ', stateOpts);
  const state = reactive<any>({
    markers: [] as any[],
    polygons: [] as any[],
    style: null,
    activeStyle: null,

    timer: null,
    num: 0
    // timer1: null,
    // num1: 0
  });

  const map = ref<any>({});
  onMounted(() => {
    clearInterval(state.timer);
    init();
  });

  function init () {
    initMap();
  }

  function initMap () {
    const useContainer = isString(container) ? document.getElementById(container) : container;
    if (!useContainer) throw Error('map widthout container to mounted!');

    map.value = new AMap.Map(container, mapOptions);

    mapStyle && map.value.setMapStyle(mapStyle);
  }

  function addPolygon (opts: AddPolygonMode) {
    const { geoJSON, style, activeStyle }: AddPolygonMode = opts || {};
    state.style = style;
    console.log('new AMap: ', AMap.GeoJSON);
    const geojson = new AMap.GeoJSON({
      geoJSON: geoJSON,
      getPolyline: (geojson: any, lnglats: any[]) => {
        return new AMap.Polyline({
          path: lnglats,
          ...(style || {}),
          extData: {
            style,
            activeStyle,
            ...geojson.properties?._parentProperities
          }
        });
      },
      // getPolygon: (geojson: any, lnglats: any[]) => {
      //   return new AMap.Polygon({
      //     path: lnglats,
      //     ...(style || {}),
      //     extData: {
      //       style,
      //       activeStyle,
      //       ...geojson.properties?._parentProperities
      //     }
      //   })
      // }
    });
    geojson.setMap(map.value);
    return geojson;
  }

  function addMarker (opts: AddMarkerMode) {
    const { data }: AddMarkerMode = opts || {};
    const umd: any = isArray(data) ? data : [data];
    if (!umd.length) return;
    const markers = [] as any;
    umd.map((item: MarkerOptionsMode) => {
      const marker = new AMap.Marker({
        ...item
      });
      marker.on('click', () => {
        markerResolve && markerResolve({ marker });
      });
      markers.push(marker);
    });
    state.markers = state.markers.concat(markers);
    map.value.add(markers);
    return {
      markers
    };
  }

  function removePolygon (polygons?: any[]) {
    map.value.remove(polygons || state.polygons);
    !polygons?.length && (state.polygons = []);
  }

  function removeMarkers (markers?: any[]) {
    map.value.remove(markers || state.markers);
    !markers?.length && (state.markers = []);
  }

  return {
    // output ref
    map,
    ...toRefs(state),

    // output fn
    addPolygon,
    addMarker,
    removePolygon,
    removeMarkers,
    subPolygonClick: (fn: any) => (polygonResolve = fn),
    subMarkerClick: (fn: any) => (markerResolve = fn)
  };
}
