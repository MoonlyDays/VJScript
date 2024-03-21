import {is, NodePath} from 'estree-toolkit';

/**
 * Goes up the node tree and finds the nearest parent (or ourselves) that
 * is contained inside an array container. This is useful to find a node, that
 * we can use to push an adjacent node to.
 * @param path
 */
export function findParentInsideContainer(path: NodePath): NodePath {
    return path.find(x => Array.isArray(x.container));
}

/**
 * Returns the deepest member expression in the tree. Returns
 * the given path if it's not a member expression.
 * @param path
 */
export function deepestMemberExpression(path: NodePath): NodePath {
    let memberObject: NodePath;
    while (is.memberExpression(path) && is.memberExpression((memberObject = path.get('object')))) {
        path = memberObject;
    }
    return path;
}

/**
 * Returns the shallowest member expression in the tree. Returns
 * the given path if it's not a member expression.
 * @param path
 */
export function shallowestIdentifier(path: NodePath): NodePath {
    if (is.memberExpression(path.parentPath))
        return shallowestIdentifier(path.parentPath);
    return path;
}

/**
 * Returns the deepest identifier in the tree. Returns
 * the given path if it's not a member expression.
 * @param path
 */
export function deepestIdentifier(path: NodePath): NodePath {
    if (is.memberExpression(path))
        return deepestIdentifier(path.get('object'));
    return path;
}