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
        outSpecs.holderDepthCompact = outSpecs.holderDepth * initSpecs.jigSideHeightFactor

        outSpecs.holderCutouts = {
            depth: outSpecs.holderDepth * 1.5,
            height: outSpecs.holderHeight - initSpecs.baseMargin,
        }

        switch (outSpecs.pattern) {
            case 'tri':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam * 2
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam
                break;
            case 'rect2x2':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam * 2
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam * 2
                break;
            case 'rect2x3':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam * 2
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam * 2
                break;
            case 'hex':
                outSpecs.holderCutouts.upperWidth = initSpecs.diam * 2
                outSpecs.holderCutouts.upperEdgeWidth = initSpecs.diam * 3
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam * 2
                outSpecs.holderCutouts.lowerEdgeWidth = initSpecs.diam * 3
                break;
            default:
                outSpecs.holderCutouts.upperWidth = initSpecs.diam
                outSpecs.holderCutouts.lowerWidth = initSpecs.diam
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

    const dowelJigHolderBlanks = (jigSpecs) => {
        const regular = cuboid({
            size: [
                jigSpecs.holderWidth,
                jigSpecs.holderDepth,
                jigSpecs.holderHeight,
            ]
        });

        const compact = cuboid({
            size: [
                jigSpecs.holderWidth,
                jigSpecs.holderDepthCompact,
                jigSpecs.holderHeight,
            ]
        });

        return {
            regular,
            compact
        }
    }

    const dowelJigHolderCutouts = (jigSpecs) => {
        let upper = null;
        let lower = null;


        if (jigSpecs.pattern === 'hex') {
            const cutoutHeights = {
                base: jigSpecs.diam * jigSpecs.jigSideHeightFactor,
            }
            cutoutHeights.edge = jigSpecs.holderCutouts.height - cutoutHeights.base

            const upper1 = cuboid({
                size: [
                    jigSpecs.holderCutouts.upperWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.base,
                ]
            })
            const upper2 = cuboid({
                size: [
                    jigSpecs.holderCutouts.upperEdgeWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.edge,
                ]
            })
            upper = union(upper1, upper2)

            const lower1 = cuboid({
                size: [
                    jigSpecs.holderCutouts.lowerWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.base,
                ]
            })
            const lower2 = cuboid({
                size: [
                    jigSpecs.holderCutouts.lowerEdgeWidth,
                    jigSpecs.holderCutouts.depth,
                    cutoutHeights.edge,
                ]
            })
            lower = union(lower1, lower2)
        } else {
            upper = cuboid({
                size: [
                    jigSpecs.holderCutouts.upperWidth,
                    jigSpecs.holderCutouts.depth,
                    jigSpecs.holderCutouts.height,
                ]
            })
            lower = cuboid({
                size: [
                    jigSpecs.holderCutouts.lowerWidth,
                    jigSpecs.holderCutouts.depth,
                    jigSpecs.holderCutouts.height,
                ]
            })
        }

        return {
            upper,
            lower,
        };
    }

    const dowelJigHolders = (jigSpecs) => {
        const holders = dowelJigHolderBlanks(jigSpecs);
        const basePlate = dowelJigBasePlate(jigSpecs);
        const cutouts = dowelJigHolderCutouts(jigSpecs)

        const upper = union(
            basePlate,
            subtract(holders.regular, cutouts.upper)
        );

        const upperCompact = union(
            basePlate,
            subtract(holders.compact, cutouts.upper)
        );

        const lower = union(
            basePlate,
            subtract(holders.regular, cutouts.lower)
        );

        const lowerCompact = union(
            basePlate,
            subtract(holders.compact, cutouts.lower)
        );

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
