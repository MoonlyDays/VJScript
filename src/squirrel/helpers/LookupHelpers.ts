import {is, NodePath} from "estree-toolkit";

export const LookupHelpers = {

    parentInsideContainer(path: NodePath) {
        return path.find(x => Array.isArray(x.container));
    },

    /**
     * Returns the deepest member expression in the tree. Returns
     * the given path if it's not a member expression.
     * @param path
     */
    deepestMemberExpression(path: NodePath) {
        let memberObject: NodePath;
        while (is.memberExpression(path) && is.memberExpression((memberObject = path.get('object')))) {
            path = memberObject;
        }
        return path;
    },

    /**
     * Returns the shallowest member expression in the tree. Returns
     * the given path if it's not a member expression.
     * @param path
     */
    shallowestIdentifier(path: NodePath) {
        if (is.memberExpression(path.parentPath))
            return this.shallowestIdentifier(path.parentPath);
        return path;
    },

    /**
     * Returns the deepest identifier in the tree. Returns
     * the given path if it's not a member expression.
     * @param path
     */
    deepestIdentifier(path: NodePath) {
        if (is.memberExpression(path))
            return this.deepestIdentifier(path.get('object'));
        return path;
    }
}