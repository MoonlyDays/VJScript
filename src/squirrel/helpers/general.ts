//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {is, NodePath} from 'estree-toolkit';

export function findPathInsideArray(path: NodePath) {
    return path.find(x => Array.isArray(x.container));
}

/**
 * Returns the deepest member expression in the tree. Returns the given path if it's not a member expression.
 * @param path
 */
export function getDeepestMemberExpression(path: NodePath) {
    let memberObject: NodePath;
    while (is.memberExpression(path) && is.memberExpression((memberObject = path.get('object')))) {
        path = memberObject;
    }

    return path;
}