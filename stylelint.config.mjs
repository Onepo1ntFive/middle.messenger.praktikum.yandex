/** @type {import('stylelint').Config} */
export default {
    'extends': ['stylelint-config-standard-scss'],
    'rules': {
        'scss/dollar-variable-pattern': null,
        'no-empty-source': null,
        'property-no-deprecated': null,
        'value-keyword-case': [
            'lower',
            {
                'ignoreKeywords': ['camelCaseValue', '/[A-Z]/']
            },
        ],
        "color-function-alias-notation": "with-alpha",
        "alpha-value-notation": "number",
    },
    'overrides': [
        {
            'files': ['*.sass'],
            'customSyntax': 'postcss-sass'
        }
    ],
    'ignoreFiles': ['dist/**'],
};