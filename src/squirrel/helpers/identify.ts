import {is, NodePath} from 'estree-toolkit';

import {IDENTIFIER_HELPER_INTEROP_WRAPPER} from '../consts';


/**
 * Identify if this path is wrapped inside an interop wrapper function.
 * This thing: __(...)
 * @param path
 */
export function isWrappedInsideInteropHelper(path: NodePath) {
    const parent = path.parent;
    if (!is.callExpression(parent))
        return false;

    const callee = parent.callee;
    if (!is.identifier(callee))
        return false;

    return callee.name == IDENTIFIER_HELPER_INTEROP_WRAPPER;
}