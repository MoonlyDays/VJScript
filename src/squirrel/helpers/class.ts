//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ClassBody, MethodDefinition, PropertyDefinition} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import classDeclaration from '../nodes/ClassDeclaration';

export function getClassPropertyDefinition(path: NodePath<ClassBody>, key: string) {
    return path.get('body')
        .find(x => is.propertyDefinition(x) &&
            is.identifier(x.node.key) &&
            x.node.key.name == key
        ) as NodePath<PropertyDefinition, ClassBody>;
}

export function getClassConstructor(path: NodePath<ClassBody>) {
    return path.get('body')
        .find(x => is.methodDefinition(x) &&
            x.node.kind == 'constructor'
        ) as NodePath<MethodDefinition, ClassBody>;
}

export function propertyDefinitionHasValue(path: PropertyDefinition) {
    const node = path;
    if (!node.value)
        return false;

    return !(is.literal(node.value) && node.value.value === null);
}

export function ensurePropertyDefinitionInClass(path: NodePath<ClassBody>, propertyKey: string) {

    const propDecl = getClassPropertyDefinition(path, propertyKey);
    if (propDecl)
        return;

    path.unshiftContainer('body', [
        b.propertyDefinition(b.identifier(propertyKey), b.literal(null))
    ]);
}

export function ensureConstructorInClass(path: NodePath<ClassBody>) {
    const ctor = getClassConstructor(path);
    if (ctor) {
        return;
    }

    // Check if this class declaration has a super.
    const classDecl = path.parentPath;
    if (!is.class(classDecl)) {
        throw Error('ensureConstructorInClass: Class Body not inside a Class?');
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