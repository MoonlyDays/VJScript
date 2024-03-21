import {ClassBody, MethodDefinition, PropertyDefinition} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';

/**
 * A list of helper functions for working with Classes.
 */
export const ClassHelpers = {

    /**
     * Get path to the node that defines a property by name.
     * @param path
     * @param key
     */
    getPropertyDefinition(path: NodePath<ClassBody>, key: string) {
        return path.get('body')
            .find(x => is.propertyDefinition(x) &&
                is.identifier(x.node.key) &&
                x.node.key.name == key
            ) as NodePath<PropertyDefinition, ClassBody>;
    },

    /**
     * Get method definition for the constructor.
     * @param path
     */
    getConstructorDefinition(path: NodePath<ClassBody>) {
        return path.get('body')
            .find(x => is.methodDefinition(x) &&
                x.node.kind == 'constructor'
            ) as NodePath<MethodDefinition, ClassBody>;
    },

    /**
     * Check if a property definition has any specific value.
     * @param node
     */
    propertyDefinitionHasValue(node: PropertyDefinition) {
        if (!node.value)
            return false;

        if (is.literal(node.value)) {
            if (node.value.value === null)
                return false;
        }

        return true;
    },

    /**
     * Make sure a property has a definition inside a class.
     * @param path
     * @param propertyKey
     */
    ensurePropertyDefinition(path: NodePath<ClassBody>, propertyKey: string) {
        const propDecl = this.getPropertyDefinition(path, propertyKey);
        if (propDecl)
            return;

        path.unshiftContainer('body', [
            b.propertyDefinition(b.identifier(propertyKey), b.literal(null))
        ]);
    },


    /**
     * Ensure that there is a constructor inside a class.
     * @param path
     */
    ensureConstructorExists(path: NodePath<ClassBody>) {
        const ctor = this.getConstructorDefinition(path);
        if (ctor)
            return;

        // Check if this class declaration has a super.
        const classDecl = path.parentPath;
        if (!is.class(classDecl)) {
            throw Error('ClassHelpers.ensureConstructorExists: Class Body not inside a Class?');
        }

        // No super declared, we can just create an empty method.
        if (!classDecl.node.superClass) {
            path.unshiftContainer('body', [b.methodDefinition(
                'constructor',
                b.identifier('constructor'),
                b.functionExpression(null, [], b.blockStatement([]))
            )]);
            return;
        }

        //-------------------------------------------------------------------------------------
        // Since we have no information about the super's constructor arguments,
        // and we have to pass them somehow anyway, take advantage of `vargv` array
        // and pass that as an array of arguments to base constructor through `acall()` method.
        //-------------------------------------------------------------------------------------
        // `.acall()` also requires us to provide a "this" argument as the first element in the
        // provided `vargv` array.
        // We can then `.insert(0, this)` it to the vargv array which returns one with this
        // being in place #0, and the rest of elements are the arguments that were provided.
        //-------------------------------------------------------------------------------------
        // This will generate code like this:
        //  constructor(...) {
        //      base.constructor.acall(vargv.insert(0, this))
        //  }
        //-------------------------------------------------------------------------------------
        path.unshiftContainer('body', [b.methodDefinition(
            'constructor',
            b.identifier('constructor'),
            b.functionExpression(
                null,
                [
                    b.restElement(b.identifier('vargv'))
                ],
                b.blockStatement([
                    b.expressionStatement(b.callExpression(
                        b.memberExpression(
                            b.memberExpression(
                                b.super(),
                                b.identifier('constructor')
                            ),
                            b.identifier('acall')
                        ),
                        [
                            b.callExpression(
                                b.memberExpression(
                                    b.identifier('vargv'),
                                    b.identifier('insert')
                                ),
                                [
                                    b.literal(0),
                                    b.thisExpression()
                                ]
                            )
                        ]
                    ))
                ])
            )
        )]);
    }
};