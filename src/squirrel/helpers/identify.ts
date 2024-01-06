//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression, Identifier} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {IDENTIFIER_MODIFIER_GLOBAL} from './consts';

export function isRequireCallExpression(path: NodePath): path is NodePath<CallExpression> {

    const node = path.node;
    if (!is.callExpression(node))
        return false;

    const callee = node.callee;
    if (!is.identifier(callee))
        return false;

    if (callee.name != 'require')
        return false;

    const args = node.arguments;
    if (args.length !== 1)
        return false;

    const arg = args[0];
    if (!is.literal(arg))
        return false;

    return !path.scope.hasBinding('require');
}

export function isGlobalIdentifier(path: NodePath): path is NodePath<Identifier> {
    if (!is.identifier(path))
        return false;

    return path.node.name.includes(IDENTIFIER_MODIFIER_GLOBAL);
}