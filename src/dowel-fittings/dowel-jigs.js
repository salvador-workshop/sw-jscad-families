"use strict"

/**
 * ...
 * @namespace families.dowelFittings.dowelJigs
 */

/**
 * ...
 * @param {*} param0 
 * @returns ...
 */
const dowelJigs = ({ lib, swLib }) => {
    const { rectangle } = lib.primitives;

    const { superPrimitives } = swLib.utils;
    const { maths } = swLib.core
    const { EQUI_TRIANGLE_HEIGHT_FACTOR } = swLib.core.constants

    const dowelJigBasePlate = ({ size }) => {
        const outShape = superPrimitives.meshPanel({ size });
        return outShape;
    }

    const jigSpecDefaults = {
        tolerance: 0,
        typThickness: 0,
        basePlateThickness: 0,
        thickness1: maths.inchesToMm(2 / 64),
        thickness2: maths.inchesToMm(3 / 64),
        thickness3: maths.inchesToMm(4 / 64),
    }

    const singleJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const jigSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam,
            dowelBundleWidth: dowelDiam,
        }

        return null;
    }

    const triangularJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const jigSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR),
            dowelBundleWidth: dowelDiam * 2,
        }

        return null;
    }

    const twoByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const jigSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 2,
        }

        return null;
    }

    const threeByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const jigSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 3,
        }

        return null;
    }

    const hexagonalJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const jigSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR * 2),
            dowelBundleWidth: dowelDiam * 3,
        }

        return null;
    }

    const output = {
        singleJigs,
        triangularJigs,
        twoByTwoJigs,
        threeByTwoJigs,
        hexagonalJigs,
    }

    return output;
}

module.exports = { init: dowelJigs }
