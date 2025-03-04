import { FieldItem } from '@/typings/items';
import { get } from 'lodash-es';
import { ref } from 'vue';

export default function useText (field: FieldItem, data: any = {}) {
  const text = ref();
  text.value = get(data, field.key, '-');
  return text.value;
}
