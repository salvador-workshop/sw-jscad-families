"use strict"

/**
 * ...
 * @namespace families.dowelFittings.dowelCouplers
 */

/**
 * ...
 * @param {*} param0 
 * @returns ...
 */
const dowelCouplers = ({ lib, swLib }) => {
    const { maths } = swLib.core

    // TODO - pull this from `sw-jscad-std-specs` once it's in place.
    const swDefaults = {
        panelThicknessXs: maths.inchesToMm(2 / 64),  // 1/32"
        panelThicknessSm: maths.inchesToMm(3 / 64),
        panelThicknessMd: maths.inchesToMm(4 / 64),   // 1/16"
        panelThicknessLg: maths.inchesToMm(5 / 64),
        panelThicknessXl: maths.inchesToMm(6 / 64),   // 3/32"
    }

    const couplerDefaultSpecs = {
        typThickness: swDefaults.panelThicknessSm,
        offsetWidth: swDefaults.panelThicknessXs,
    }

    const smallDowelCoupler = ({ dowelRadius }) => {
        const smallSpecs = {
            ...couplerDefaultSpecs,
            length: maths.inchesToMm(1)
        }
        return null;
    };

    const mediumDowelCoupler = ({ dowelRadius }) => {
        const mediumSpecs = {
            ...couplerDefaultSpecs,
            length: maths.inchesToMm(2)
        }
        return null;
    };

    const largeDowelCoupler = ({ dowelRadius }) => {
        const largeSpecs = {
            ...couplerDefaultSpecs,
            length: maths.inchesToMm(3)
        }
        return null;
    };

    const output = {
        smallDowelCoupler,
        mediumDowelCoupler,
        largeDowelCoupler,
    }

    return output;
}

module.exports = { init: dowelCouplers }
