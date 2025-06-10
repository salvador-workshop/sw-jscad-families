"use strict"

const familiesModule = require('./families');

const init = ({ lib, swLib }) => {
    const swJscadFamilies = {
        families: familiesModule.init({ lib, swLib }),
    }

    return swJscadFamilies;
}

module.exports = { init };
