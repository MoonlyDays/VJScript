//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {
    AssignmentExpression,
    AssignmentOperator,
    ClassBody,
    ClassDeclaration,
    ForInStatement,
    ForOfStatement,
    Identifier,
    MethodDefinition,
    PropertyDefinition,
    VariableDeclarator
} from 'estree';
import {builders as b, is, NodePath, traverse} from 'estree-toolkit';
import {ESTree} from 'meriyah';

import {renameNode} from './rename';


export function preprocess(program: ESTree.Program) {
    traverse(program, TraverseVisitors);
}

type TraverseVisitors = Parameters<typeof traverse>[1];
const TraverseVisitors: TraverseVisitors = {
    $: {scope: true},

    Identifier: path => {
        renameNode(path);
    },

    MemberExpression: path => {
        renameNode(path);
    },

    VariableDeclaration: path => {

        const node = path.node;
        if (node.kind == 'const') {
            // Multiple declarators in a single const declaration is not allowed.
            const declarators = node.declarations;
            if (declarators.length > 1) {
                for (let i = 1; i < declarators.length; i++) {
                    const declarator = declarators[i];
                    path.insertAfter([b.variableDeclaration('const', [declarator])]);
                }

                node.declarations = node.declarations.slice(0, 1);
            }

            // Const can only accept a single literal value,
            // Otherwise it's a local.
            const declarator = declarators[0];
            if (declarator) {

                // We assume it's always not null, because parser won't allow uninitialized
                // const variables.
                const init = declarator.init;
                if (!init || init.type != 'Literal') {
                    node.kind = 'let';
                }
            }
        }
    },

    ForOfStatement: path => {
        const node = path.node;
        normalizeLoopStatement(path);

        if (node.left.type == 'ArrayPattern') {
            if (node.left.elements.length > 2) throw Error('For Loop: Array Pattern must not contain more than 2 elements.');
        }
    },

    ForInStatement: path => {
        const node = path.node;
        normalizeLoopStatement(path);

        if (node.left.type == 'VariableDeclaration') {
            throw Error('ForInStatement: left must not be VariableDeclaration! Something went wrong!');
        }

        let left = node.left;
        const leftPath = path.get('left');
        if (left.type != 'ArrayPattern') {
            left = b.arrayPattern([left]);
            leftPath.replaceWith(left);
        }

        if (left.elements.length < 2) {
            const extraIdent = leftPath.scope.generateUidIdentifier();
            left.elements.push(extraIdent);
        }

        path.replaceWith(b.forOfStatement(left, node.right, node.body, false));
    },

    VariableDeclarator: path => {
        const node = path.node;
        if (node.id.type == 'ArrayPattern') {
            const replace: VariableDeclarator[] = [];
            const pattern = node.id;
            const init = node.init;

            for (let i = 0; i < pattern.elements.length; i++) {
                const el = pattern.elements[i];
                const elInit = init && b.memberExpression(init, b.literal(i), true);
                replace.push(b.variableDeclarator(el, elInit));
            }

            path.replaceWithMultiple(replace);
            return;
        }
    },

    AssignmentExpression: path => {
        const node = path.node;

        const left = node.left;
        if (is.arrayPattern(left)) {
            const replace: AssignmentExpression[] = [];

            // Try to find a parent that is contained inside an array.
            const parentPath = path.find(x => Array.isArray(x.container));
            const tmp = parentPath.scope.generateUidIdentifier();
            parentPath.insertBefore([b.variableDeclaration('let', [b.variableDeclarator(tmp, node.right)])]);

            for (let i = 0; i < left.elements.length; i++) {
                const key = left.elements[i];
                const value = b.memberExpression(tmp, b.literal(i), true);
                replace.push(b.assignmentExpression('=', key, value));
            }

            parentPath.insertBefore(replace);
            path.remove();
        }

        // For some cases we can't use the slot creation operator
        // therefore we need to check for those cases.
        let useSlotOperator = true;

        // If we assign to a previously declared identifier,
        // we don't need to use the operator.
        if (is.identifier(left)) {
            const leftPath = path.get('left');
            if (leftPath.scope.hasBinding(left.name)) {
                useSlotOperator = false;
            }
        }

        // We can't use slot creation for changing class fields through
        // this keyword.
        if (is.memberExpression(left)) {
            if (is.thisExpression(left.object) && is.identifier(left.property)) {
                const classBody = path.findParent<ClassBody>(is.classBody);
                if (classBody) useSlotOperator = false;
            }
        }

        if (useSlotOperator) {
            (node.operator as AssignmentOperator | '<-') = '<-';
        }
    },

    ClassBody: path => {
        // We generally assume that each class definition must have a constructor.
        ensureConstructorInClass(path);

        const ctor = getClassConstructor(path);
        if (!ctor) throw Error('Class Body doesn\'t have a constructor even though we ensured it?');
    },

    PropertyDefinition: path => {

        const node = path.node;
        const key = node.key;
        if (!is.identifier(key))
            return;

        if (propDefinitionHasValue(node)) {
            const classBody = path.findParent<ClassBody>(is.classBody);
            const ctor = getClassConstructor(classBody);

            const assignment = b.assignmentExpression(
                '=',
                b.memberExpression(b.thisExpression(), node.key),
                node.value
            );

            ctor.value.body.body.unshift(b.expressionStatement(assignment));
        }

        node.value = b.literal(null);
    },

    FunctionExpression: path => {
        // Function expression must not contain a name.
        const node = path.node;
        node.id = null;
    },

    ArrowFunctionExpression: path => {
        const node = path.node;
        if (node.body.type != 'BlockStatement') {
            node.body = b.blockStatement([b.returnStatement(node.body)]);
        }

        path.replaceWith(b.functionExpression(null, node.params, node.body, node.generator, node.async));
    },

    SpreadElement: () => {
        throw Error('Spread Operator (...) is not supported by Squirrel.');
    },

    SequenceExpression: path => {

        const node = path.node;
        const funcBody = [];
        for (let i = 0; i < node.expressions.length; i++) {
            const expr = node.expressions[i];

            if (i == (node.expressions.length - 1)) {
                funcBody.push(b.returnStatement(expr));
                continue;
            }

            funcBody.push(b.expressionStatement(expr));
        }

        path.replaceWith(b.callExpression(b.arrowFunctionExpression([], b.blockStatement(funcBody)), []));
    },

    Super: path => {

        // Is super is being directly invoked in a constructor
        if (is.callExpression(path.parent)) {
            const ctor = path.findParent(x => x.node.type == 'MethodDefinition' && x.node.kind == 'constructor');
            if (ctor) {
                path.replaceWith(b.memberExpression(b.super(), b.identifier('constructor')));
            }
        }
    }
};

const ensureConstructorInClass = (path: NodePath<ClassBody>) => {
    let ctor = getClassConstructor(path);
    if (ctor) return;

    const parentPath = path.parentPath;
    if (!is.classDeclaration(parentPath)) throw Error('Class Body is not inside Class Declaration?');

    const ctorBlock = b.blockStatement([]);
    const ctorParams = [];

    const superClass = getClassDeclarationSuper(parentPath);
    if (superClass) {
        if (superClass.node == parentPath.node) throw Error('Class Definition has itself as Super?');

        const superBody = superClass.get('body');
        ensureConstructorInClass(superBody);
        const superCtor = getClassConstructor(superClass.get('body'));
        if (!superCtor) throw Error('Super Class without a Constructor?');

        ctorParams.push(...superCtor.value.params);
        ctorBlock.body.push(b.expressionStatement(b.callExpression(b.super(), ctorParams)));
    }

    ctor = b.methodDefinition('constructor', b.identifier('constructor'), b.functionExpression(null, ctorParams, ctorBlock));

    // Add constructor to the top of class body.
    path.unshiftContainer('body', [ctor]);
};

const normalizeLoopStatement = (forPath: NodePath<ForInStatement | ForOfStatement>) => {

    const path = forPath.get('left');
    const node = path.node;
    // For loop statement should be normalized to having
    // left property of either Identifier or ArrayPattern types
    if (node.type == 'VariableDeclaration') {
        // Declarations in for loop always are supposed to have one declarator.
        const declarator = node.declarations[0];

        // If we are declaring an Array Pattern, just use that pattern
        // as our left parameter.
        if (declarator.id.type == 'ArrayPattern') {
            path.replaceWith(declarator.id);
            return;
        }

        // If we are declaring an identifier, return
        // that identifier in an array pattern.
        if (declarator.id.type == 'Identifier') {
            path.replaceWith(b.arrayPattern([declarator.id]));
            return;
        }

        throw Error(`Unhandled left-side node of an for loop expression: ${node.type}`);
    }
};

const getClassConstructor = (path: NodePath<ClassBody>): MethodDefinition => {
    return path.node.body.find(x => is.methodDefinition(x) && x.kind == 'constructor') as MethodDefinition;
};

const getClassProperties = (path: NodePath<ClassBody>): PropertyDefinition[] => {
    return path.node.body.filter(x => is.propertyDefinition(x)) as PropertyDefinition[];
};

const getClassDeclarationSuper = (path: NodePath<ClassDeclaration>): NodePath<ClassDeclaration> => {

    const superIdent = path.node.superClass;
    if (!superIdent) return;

    if (!is.identifier(superIdent)) throw Error(`Unhandled Super Class Node of type ${superIdent.type}`);

    const superBinding = path.scope.getBinding(superIdent.name);
    if (!superBinding) throw Error(`Undefined Super Class Binding: ${superIdent.name}`);

    const superClassDeclaration = superBinding.path;
    if (!is.classDeclaration(superClassDeclaration)) throw Error(`Super Class Binding is not a Class Declaration: ${superIdent.name}`);

    return superClassDeclaration;
};

const propDefinitionHasValue = (path: PropertyDefinition) => {

    const node = path;
    if (!node.value) return false;

    if (is.literal(node.value) && node.value.value === null) return false;

    return true;
};
