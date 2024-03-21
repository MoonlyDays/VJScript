//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CallExpression, Node} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {IDENTIFIER_HELPER_INTEROP_WRAPPER} from '../consts';
import {LookupHelpers} from "./LookupHelpers";

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
    }
}
