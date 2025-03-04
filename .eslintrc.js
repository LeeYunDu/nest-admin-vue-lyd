module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  env: {
    browser: true,
    node: true
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  rules: {
    // js/ts
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'comma-style': ['error', 'last'],
    quotes: [1, 'single'], // 强制使用单引号
    camelcase: [
      //不强制文件驼峰命名
      0,
      {
        properties: 'always'
      }
    ],
    'vue/no-unused-vars': [
      0,
      {
        ignorePattern: '^_'
      }
    ],
    'no-console': [0],
    'no-debugger': [0],
    'vue/no-parsing-error': [
      2,
      {
        'x-invalid-end-tag': false
      }
    ],
    semi: ['error', 'never'],
    'no-multiple-empty-lines': [2, { max: 2 }], //空行最多不能超过两行
    indent: [1, 2, { SwitchCase: 1 }], // 强制使用2空格缩进
    'space-before-function-paren': [0], //函数定义时括号前的空格
    'object-curly-spacing': ['error', 'always'],
    'arrow-parens': ['error', 'as-needed'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false
        },
        singleline: {
          // delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    // vue
    'no-undef': 'error',
    'no-unused-vars': 'off',
    'vue/no-unused-components': 'warn',
    //不强制检查文件名
    'vue/multi-word-component-names': [
      0,
      {
        ignores: []
      }
    ],
    'vue/no-reserved-component-names': [
      0,
      {
        properties: 'always'
      }
    ],
    'no-invalid-regexp': [0], //不效验正则
    'no-useless-escape': [0], //禁用不必要的转义
    'spaced-comment': [0], //注释首尾留空格 关闭
    'handle-callback-err': [0], //回调里不处理错误
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/no-v-html': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': ['off'],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: 1
      }
    ],
    'vue/require-default-prop': 'off',
    'vue/html-closing-bracket-spacing': 'error'
  }
}
