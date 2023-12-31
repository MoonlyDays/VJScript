//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {builders, is, NodePath} from 'estree-toolkit';

type IdentifierPatternItem = string | null | (NodePath extends NodePath<infer T> ? T : never);
type IdentifierPatternItems = IdentifierPatternItem[];

export class IdentifierPattern {
    public items: IdentifierPatternItems = [];

    constructor(...items: IdentifierPatternItems) {
        this.push(...items);
    }

    public push(...items: IdentifierPatternItems) {
        for (const item of items) {
            if (item) {
                if (typeof item == 'string') {
                    this.items.push(...item.split('.'));
                    continue;
                }

                this.items.push(item);
                continue;
            }

            this.items.push(item);
        }
    }

    public pushFrom(pattern: IdentifierPattern) {
        this.push(...pattern.items);
    }

    toString() {
        return this.items.map(x => x || '*').join('.');
    }

    public hasWildcards() {
        return !!this.items.find(x => typeof x == 'string' && x.startsWith('*'));
    }

    public hasNodes() {
        return !!this.items.find(x => typeof x == 'object');
    }

    public hasBinding(path: NodePath) {

        if (this.hasWildcards()) {
            throw Error(`Cannot resolve implicit patterns (${this.toString()})!`);
        }

        const root = this.items[0];
        if (typeof root != 'string')
            return false;

        return path.scope.hasBinding(root);
    }

    /**
     * Check if a given path matches this pattern.
     * @param path
     */
    public match(path: NodePath): string[][] | false {

        const pathPattern = IdentifierPattern.fromPath(path);

        const wc: {
            enabled: boolean;
            until: IdentifierPatternItem,
            count: number;
            min: number;
            max: number;
        } = {
            enabled: false,
            until: '',
            count: 0,
            min: 0,
            max: 0
        };

        let patternIdx = 0;
        let pathIdx = 0;
        const matchArr = [[]];

        for (; patternIdx < this.items.length; patternIdx++) {
            const patternItem = this.items[patternIdx];
            const pathItem = pathPattern.items[pathIdx++];

            // console.log(`pattern(${patternIdx}): ${patternItem}, path(${pathIdx - 1}): ${pathItem}`);

            // Pattern is requesting wildcard mode. Do all the necessary
            // pattern matching and setting up.
            if (!wc.enabled && typeof patternItem == 'string' && patternItem.startsWith('*')) {
                wc.enabled = true;
                wc.count = 0;
                wc.min = 1;
                wc.max = 1;
                wc.until = this.items[patternIdx + 1];

                if (patternItem.startsWith('**')) {
                    wc.max = Infinity;
                }

                if (patternItem.endsWith('?')) {
                    wc.min = 0;
                }
            }

            // Do all the checks to see if we need to exit the wildcard mode.
            if (wc.enabled) {

                // We reached our "until" pattern, check if we are allowed to leave this.
                if (pathItem == wc.until && wc.count >= wc.min) {
                    wc.enabled = false;
                    pathIdx--;
                    continue;
                }

                // If we reached our "max" limit, and we didn't reach until, bail out.
                if (wc.count >= wc.max) {
                    return false;
                }

                if (pathItem === undefined) {
                    return false;
                }

                matchArr[patternIdx + 1] ??= [];
                matchArr[patternIdx + 1].push(pathItem);
                matchArr[0].push(pathItem);

                wc.count++;
                patternIdx--;
                continue;
            }

            const normalPatternItem = normalizeItem(patternItem);
            const normalPathItem = normalizeItem(pathItem);
            if (normalPatternItem != normalPathItem)
                return false;

            matchArr[patternIdx + 1] ??= [];
            matchArr[patternIdx + 1].push(pathItem);
            matchArr[0].push(pathItem);
        }

        // If we ended in wildcard mode, and we were actually expecting to
        // see something, matching has failed then.
        if (wc.enabled && wc.until) {
            // console.log('- ended in wc');
            return false;
        }

        // console.log(matchArr);
        // console.log(patternIdx, pathPattern.items.length);

        if (patternIdx >= this.items.length)
            return matchArr;

        return false;
    }

    /**
     * Generate am identifier pattern from an actual syntax tree path.
     * Absolute mode (default) will make sure to generate the pattern from topmost node in the tree of this identifier.
     * @param path
     * @param absolute
     */
    public static fromPath(path: NodePath, absolute = false): IdentifierPattern {

        if (is.memberExpression(path.parentPath)) {
            if (path.parentKey == 'property')
                path = path.parentPath;
        }

        if (absolute) {
            // Narrow down the shallowest member expression object.
            // We start building the identifier from top to bottom.
            path = shallowestIdentifier(path);
        }

        return this.build(path);
    }

    private static build(path: NodePath): IdentifierPattern {
        if (is.memberExpression(path)) {

            const objectPath = path.get('object');
            const objectPattern = this.build(objectPath);

            const propertyPath = path.get('property');
            const propertyPattern = this.build(propertyPath);

            objectPattern.pushFrom(propertyPattern);
            return objectPattern;
        }

        if (is.identifier(path)) {
            return new IdentifierPattern(path.node.name);
        }

        return new IdentifierPattern(path.node);
    }

    public codeGenerate() {

        let lastNode;
        for (const item of this.items) {

            let curNode = item;
            if (typeof curNode == 'string')
                curNode = builders.identifier(curNode);

            if (!is.expression(curNode) && !is.privateIdentifier(curNode))
                throw Error('Property must be either an Expression or a Private Identifier.');

            if (lastNode) {
                lastNode = builders.memberExpression(lastNode, curNode, !is.identifier(curNode));
            } else {
                lastNode = curNode;
            }
        }

        return lastNode;
    }
}

function normalizeItem(item: IdentifierPatternItem) {
    if (item) {
        if (typeof item == 'string' && item.startsWith('::'))
            item = item.slice(2);
    }

    return item;
}

export function shallowestIdentifier(path: NodePath) {
    if (is.memberExpression(path.parentPath))
        return shallowestIdentifier(path.parentPath);

    return path;
}

export function deepestIdentifier(path: NodePath) {
    if (is.memberExpression(path))
        return deepestIdentifier(path.get('object'));

    return path;
}

export interface SearchPattern {
    pattern: IdentifierPattern;
}

export function parseSearchPattern<T extends SearchPattern>(pattern: string): T {
    return {pattern: new IdentifierPattern(pattern)} as T;
}

export class ConfigSearchPatternSet<T extends SearchPattern = SearchPattern> extends Set<T> {
    public find(path: NodePath) {

        for (const search of this) {
            const pattern = search.pattern;
            if (pattern.match(path) !== false)
                return search;
        }
    }
}