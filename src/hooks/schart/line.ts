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
export const lineGroup = {

};
