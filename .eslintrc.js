module.exports = {
    plugins: [
    // 'eslint-plugin-tsdoc',
    ],
    'parserOptions': {
        'ecmaVersion': 2018,
        'requireConfigFile': false
    },
    extends: [
        'eslint:recommended',
    ],
    env: {
    // Your environments (which contains several predefined global variables)
        'mocha': true,
        node: true,
        es6: true
    },
    globals: {
    // Your global variables (setting to false means it's not allowed to be reassigned)
    //
    // myGlobal: false
    },
    rules: {
    // Customize your rules
        'quotes': ['error', 'single', { 'avoidEscape': true }],
        'semi': ['error', 'always'],
        'no-console': ['error'],
        'indent': ['error', 4],
    }
};