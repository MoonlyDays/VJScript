//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {IDENTIFIER_HELPER_INTEROP_WRAPPER} from '../consts';

export const IdentifyHelpers = {

    /**
     * Identify if this path is wrapped inside an interop wrapper function.
     * P.S: This thing: __(...)
     * @param path
     */
    wrappedInsideInteropHelper(path: NodePath) {
        const parent = path.parent;
        if (!is.callExpression(parent))
            return false;

        const callee = parent.callee;
        if (!is.identifier(callee))
            return false;

        return callee.name == IDENTIFIER_HELPER_INTEROP_WRAPPER;
    },

    requireCallExpression(path: NodePath): path is NodePath<CallExpression> {

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

}
