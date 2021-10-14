module.exports = {
  root: true,
  env: {
    browser: true
  },
  plugins: ["prettier", "only-warn"],
  extends: ["plugin:vue/essential", "@vue/airbnb"],
  globals: {
    uni: true,
    wx: true,
    getCurrentPages: "readonly"
  },
  rules: {
    "no-underscore-dangle": "off",
    "no-console": "off",
    semi: "off",
    "operator-assignment": "off",
    "no-unused-expressions": "off",
    "class-methods-use-this": "off",
    "import/extensions": "off",
    "no-use-before-define": "off",
    "prefer-rest-params": "off",
    "no-restricted-properties": "off",
    "guard-for-in": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "no-useless-return": "off",
    "no-prototype-builtins": "off",
    "no-nested-ternary": "off",
    "global-require": "off",
    "no-mixed-operators": "off",
    radix: "off",
    "no-tabs": "off",
    "no-dupe-keys": "off",
    "linebreak-style": "off",
    "space-before-function-paren": "off",
    "no-unused-vars": "off",
    "max-len": [
      "warn",
      {
        code: 150
      }
    ],
    "no-shadow": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
