export const componentLibray = [
  { id: 'comp-1', name: '组件 1', dataAttributes: { type: 'comp-1' } },
  { id: 'comp-2', name: '组件 2', dataAttributes: { type: 'comp-2' } },
  { id: 'comp-3', name: '组件 3', dataAttributes: { type: 'comp-3' } },
  {
    name: '栅格布局',
    dataAttributes: {
      type: 'grid-layout',
      isContainer: true,
      class: 'grid-layout'
    }
  },
  {
    name: '表单容器',
    dataAttributes: {
      type: 'form-container',
      isContainer: true,
      class: 'form-container'
    },
    children: [
      { id: 'input-1', type: 'text-input' },
      { id: 'button-1', type: 'submit-button' }
    ]
  }
];
