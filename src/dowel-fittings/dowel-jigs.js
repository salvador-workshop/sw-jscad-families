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
    const { EQUI_TRIANGLE_HEIGHT_FACTOR, PHI_INV } = swLib.core.constants

    // TODO - pull this from `sw-jscad-std-specs` once it's in place.
    const swDefaults = {
        panelThicknessXs: maths.inchesToMm(2 / 64),  // 1/32"
        panelThicknessSm: maths.inchesToMm(3 / 64),
        panelThicknessMd: maths.inchesToMm(4 / 64),   // 1/16"
        panelThicknessLg: maths.inchesToMm(5 / 64),
        panelThicknessXl: maths.inchesToMm(6 / 64),   // 3/32"
    }

    const jigSpecDefaults = {
        tolerance: maths.inchesToMm(1 / 64),
        typThickness: swDefaults.panelThicknessMd,
        basePlateThickness: swDefaults.panelThicknessSm,
        sideMargin: maths.inchesToMm(1 / 8),
        baseMargin: maths.inchesToMm(1 / 4),
        // Percentage of total height. Must be over 50%
        jigSideHeightFactor: PHI_INV,
    }

    const completeJigSpecs = ({
        initSpecs,
    }) => {
        const outSpecs = {
            ...initSpecs
        }
        outSpecs.jigHolderHeight = initSpecs.dowelBundleHeight * initSpecs.jigSideHeightFactor
        outSpecs.jigHolderWidth = 2 * initSpecs.sideMargin + initSpecs.dowelBundleWidth
        outSpecs.jigHolderDepth = outSpecs.jigHolderWidth * initSpecs.jigSideHeightFactor

        return outSpecs
    }

    const dowelJigBasePlate = ({ jigSpecs }) => {
        const outShape = superPrimitives.meshPanel({
            size: [
                2 * jigSpecs.sideMargin + jigSpecs.jigHolderWidth,
                2 * jigSpecs.sideMargin + jigSpecs.jigHolderDepth,
                jigSpecs.basePlateThickness,
            ]
        });
        return outShape;
    }

    const dowelJigHolderBlank = ({ jigSpecs }) => {
        return cuboid({
            size: [
                jigSpecs.jigHolderWidth,
                jigSpecs.jigHolderDepth,
                jigSpecs.jigHolderHeight,
            ]
        });
    }

    const singleJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam,
            dowelBundleWidth: dowelDiam,
        }
        const jigSpecs = completeJigSpecs({ initSpecs });

        return null;
    }

    const triangularJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR),
            dowelBundleWidth: dowelDiam * 2,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });

        return null;
    }

    const twoByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 2,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });

        return null;
    }

    const threeByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 3,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });

        return null;
    }

    const hexagonalJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR * 2),
            dowelBundleWidth: dowelDiam * 3,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });

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
