"use strict"

const familiesModule = require('./families');

const init = ({ lib, swLib }) => {
    return familiesModule.init({ lib, swLib });
}

module.exports = { init };
