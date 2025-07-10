"use strict"

/**
 * ...
 * @namespace families.paper
 */

const init = ({ lib, swLib }) => {
    const { rectangle, cuboid, triangle, circle, cylinder, roundedRectangle } = lib.primitives;
    const { union, subtract } = lib.booleans;
    const { translate, align, mirror, rotate } = lib.transforms;
    const { hull } = lib.hulls
    const { extrudeLinear, extrudeRotate } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { standards, maths, position } = swLib.core

    const camelCase = (str) => {
        // Using replace method with regEx
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    const metric = {}
    Object.values(standards.paper.metric).forEach(([key, val]) => {
        const newKey = camelCase(key.replace('_', ' '))
        metric[newKey] = rectangle({ size: val })
    })

    const imperial = {}
    const ansi = {}
    const arch = {}
    Object.values(standards.paper.imperial).forEach(([key, val]) => {
        if (key === 'ansi') {
            Object.values(val.ansi).forEach(([aKey, aVal]) => {
                const ansiKey = camelCase(aKey.replace('_', ' '))
                ansi[ansiKey] = rectangle({ size: aVal })
            })
        } else if (key === 'arch') {
            Object.values(val.arch).forEach(([arKey, arVal]) => {
                const archKey = camelCase(arKey.replace('_', ' '))
                metric[archKey] = rectangle({ size: arVal })
            })
        } else {
            const newKey = camelCase(key.replace('_', ' '))
            imperial[newKey] = rectangle({ size: val })
        }
    })

    const cards = {}
    Object.values(standards.paper.cards).forEach(([key, val]) => {
        const newKey = camelCase(key.replace('_', ' '))
        metric[newKey] = rectangle({ size: val })
    })

    const bookmarks = {}
    Object.values(standards.paper.bookmarks).forEach(([key, val]) => {
        const newKey = camelCase(key.replace('_', ' '))
        metric[newKey] = rectangle({ size: val })
    })

    const poster = {}
    Object.values(standards.paper.poster).forEach(([key, val]) => {
        const newKey = camelCase(key.replace('_', ' '))
        metric[newKey] = rectangle({ size: val })
    })

    const photos = {}
    Object.values(standards.paper.photos).forEach(([key, val]) => {
        const newKey = camelCase(key.replace('_', ' '))
        metric[newKey] = rectangle({ size: val })
    })

    const paper = {
        metric,
        ansi,
        arch,
        imperial,
        cards,
        bookmarks,
        poster,
        photos,
    }

    return paper;
}

module.exports = { init };
