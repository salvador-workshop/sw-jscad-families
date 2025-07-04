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

        // 'single', 'rect2x2', 'tri', 'hex'
        outSpecs.pattern = initSpecs.pattern || 'single'

        outSpecs.holderHeight = initSpecs.dowelBundleHeight * initSpecs.jigSideHeightFactor + initSpecs.baseMargin
        outSpecs.holderWidth = 2 * initSpecs.sideMargin + initSpecs.dowelBundleWidth
        outSpecs.holderDepth = outSpecs.holderWidth * initSpecs.jigSideHeightFactor

        outSpecs.holderCutouts = {
            depth: outSpecs.holderDepth * 1.5,
            height: outSpecs.holderHeight - initSpecs.baseMargin,
        }

        switch (outSpecs.pattern) {
            case 'tri':
                outSpecs.holderCutouts.upperWidth = jigSpecs.diam * 2
                outSpecs.holderCutouts.lowerWidth = jigSpecs.diam
                break;
            case 'rect2x2':
                outSpecs.holderCutouts.upperWidth = jigSpecs.diam * 2
                outSpecs.holderCutouts.lowerWidth = jigSpecs.diam * 2
                break;
            case 'rect2x3':
                outSpecs.holderCutouts.upperWidth = jigSpecs.diam * 2
                outSpecs.holderCutouts.lowerWidth = jigSpecs.diam * 2
                break;
            case 'hex':
                outSpecs.holderCutouts.upperWidth = jigSpecs.diam * 2
                outSpecs.holderCutouts.upperEdgeWidth = jigSpecs.diam * 3
                outSpecs.holderCutouts.lowerWidth = jigSpecs.diam * 2
                outSpecs.holderCutouts.lowerEdgeWidth = jigSpecs.diam * 3
                break;
            default:
                outSpecs.holderCutouts.upperWidth = jigSpecs.diam
                outSpecs.holderCutouts.lowerWidth = jigSpecs.diam
        }

        return outSpecs
    }

    const dowelJigBasePlate = (jigSpecs) => {
        return superPrimitives.meshPanel({
            size: [
                2 * jigSpecs.sideMargin + jigSpecs.holderWidth,
                2 * jigSpecs.sideMargin + jigSpecs.holderDepth,
                jigSpecs.basePlateThickness,
            ]
        });
    }

    const dowelJigHolderBlank = (jigSpecs) => {
        return cuboid({
            size: [
                jigSpecs.holderWidth,
                jigSpecs.holderDepth,
                jigSpecs.holderHeight,
            ]
        });
    }

    const dowelJigHolders = (jigSpecs) => {
        const holder = dowelJigHolderBlank(jigSpecs);
        const basePlate = dowelJigBasePlate(jigSpecs);

        const upper = null;

        const upperCompact = null;

        const lower = null;

        const lowerCompact = null;

        return {
            upper,
            upperCompact,
            lower,
            lowerCompact,
        };
    }

    const singleJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            dowelBundleHeight: dowelDiam,
            dowelBundleWidth: dowelDiam,
        }
        const jigSpecs = completeJigSpecs({ initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const triangularJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            pattern: 'tri',
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR),
            dowelBundleWidth: dowelDiam * 2,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const twoByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 2,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const threeByTwoJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            dowelBundleHeight: dowelDiam * 2,
            dowelBundleWidth: dowelDiam * 3,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
    }

    const hexagonalJigs = ({ dowelRadius }) => {
        const dowelDiam = dowelRadius * 2
        const initSpecs = {
            ...jigSpecDefaults,
            radius: dowelRadius,
            diam: dowelDiam,
            pattern: 'hex',
            dowelBundleHeight: dowelDiam + (dowelDiam * EQUI_TRIANGLE_HEIGHT_FACTOR * 2),
            dowelBundleWidth: dowelDiam * 3,
        }
        const jigSpecs = completeJigSpecs({ jigSpecs: initSpecs });
        const jigHolders = dowelJigHolders(jigSpecs)

        return {
            jigHolders
        };
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
