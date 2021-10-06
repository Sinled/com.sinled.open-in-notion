// Documentation for this file: https://prettier.io/docs/en/configuration.html
module.exports = {
    /*
     * We use a larger print width because Prettier's word-wrapping seems to be tuned
     * for plain JavaScript without type annotations
     */
    printWidth: 120,

    /*
     * Increased tab width shows problems with nesting earlier
     */
    tabWidth: 4,

    /*
     * just style preference
     */
    singleQuote: true,

    /*
     * there are cases when absence of semicolons may result problems, so we use them everywhere
     */
    semi: true,

    /*
     * Arrow functions without Parentheses ofter hard to reed, use them always
     */
    arrowParens: 'always',

    /*
     * adding new items to the multiline list will result additional change in git diff
     */
    trailingComma: 'all',
};
