"use strict"

const familiesModule = require('./families');

const init = ({ lib, swLib }) => {
    const swJscad = {
        families: familiesModule.init({ lib, swLib }),
    }

    return swJscad;
}

module.exports = { init };
