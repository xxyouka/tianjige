module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Vue 规则
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/no-unused-components': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',

    // ES 规则
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',
    'no-undef': 'error',

    // 代码风格
    'indent': ['warn', 2],
    'linebreak-style': ['warn', 'unix'],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'never'],
    'comma-dangle': ['warn', 'never'],

    // 最佳实践
    'eqeqeq': 'error',
    'no-var': 'error',
    'prefer-const': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],
    'no-param-reassign': 'warn'
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
