//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {
    AssignmentExpression,
    AssignmentOperator,
    ClassBody,
    ForInStatement,
    ForOfStatement,
    MethodDefinition,
    Node,
    PropertyDefinition,
    VariableDeclaration,
    VariableDeclarator
} from 'estree';
import {builders as b, is, NodePath, traverse} from 'estree-toolkit';
import path from 'path';

import {processAttributes} from './attributes';
import {Module} from './module';
import {renameNode} from './rename';

export function preprocess(node: Node, module?: Module) {
    traverse(node, {
        $: {scope: true},

        Identifier: (path, state) => {

            const node = path.node;

            // base is a reserved keyword and we're only allowed to use it if we're
            // inside a call and base is the deepest identifier.
            if (node.name == 'base') {
                node.name = '_base';
            }

            const isProperty = is.memberExpression(path.parentPath) && path.parentKey == 'property';
            if (!isProperty) {
                processAttributes(path);
                renameNode(path, state.module);
            }
        },

        MemberExpression: (path, state) => {
            processAttributes(path);
            renameNode(path, state.module);
        },

        VariableDeclaration: path => {

            const node = path.node;
            if (variableDeclarationNeedsToSplit(path)) {

                for (let i = 1; i < node.declarations.length; i++) {
                    const declarator = node.declarations[i];
                    path.insertAfter([b.variableDeclaration(node.kind, [declarator])]);
                }

                node.declarations = node.declarations.slice(0, 1);
            }

            if (node.kind == 'const') {
                // Const can only accept a single literal value, otherwise it's a local.
                const declarators = node.declarations;
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

            const id = node.id;
            if (is.arrayPattern(id)) {
                const replace: VariableDeclarator[] = [];
                const init = node.init;
                const arrayIdent = path.scope.generateUidIdentifier();
                path.parentPath.insertBefore([b.variableDeclaration('const', [b.variableDeclarator(arrayIdent, init)])]);

                for (let i = 0; i < id.elements.length; i++) {
                    const el = id.elements[i];
                    const elInit = arrayIdent && b.memberExpression(arrayIdent, b.literal(i), true);
                    replace.push(b.variableDeclarator(el, elInit));
                }

                path.replaceWithMultiple(replace);
                return;
            }

            if (is.objectPattern(id)) {
                const replace: VariableDeclarator[] = [];
                const init = node.init;
                const objectIdent = path.scope.generateUidIdentifier();
                path.parentPath.insertBefore([b.variableDeclaration('const', [b.variableDeclarator(objectIdent, init)])]);

                for (let i = 0; i < id.properties.length; i++) {
                    const property = id.properties[i];
                    if (is.property(property)) {

                        const key = property.key;
                        if (is.pattern(key)) {
                            const propInit = objectIdent && b.memberExpression(objectIdent, property.key);
                            replace.push(b.variableDeclarator(objectIdent, propInit));
                        }

                    } else {
                        throw Error(`Cannot use ${property.type} in Object Pattern in Variable Declarator.`);
                    }
                }

                path.replaceWithMultiple(replace);
                return;
            }
        },

        AssignmentExpression: path => {
            const node = path.node;

            if (node.operator == '??=') {

                if (is.expression(node.left)) {
                    path.replaceWith(b.ifStatement(
                        b.binaryExpression('==', node.left, b.literal(null)),
                        b.expressionStatement(b.assignmentExpression('=', node.left, node.right))
                    ));
                    return;
                }
            }

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

            // We can't use slot creation for changing class fields through this keyword.
            let deepestMemberExpr: Node = left;
            while (is.memberExpression(deepestMemberExpr) && is.memberExpression(deepestMemberExpr.object)) {
                deepestMemberExpr = deepestMemberExpr.object;
            }

            if (is.memberExpression(deepestMemberExpr)) {
                if (is.thisExpression(deepestMemberExpr.object) && is.identifier(deepestMemberExpr.property)) {
                    const classBody = path.findParent<ClassBody>(is.classBody);
                    if (classBody) {
                        useSlotOperator = false;

                        // Make sure class has such a property declared.
                        const propDecl = getClassPropertyDefinition(classBody, deepestMemberExpr.property.name);
                        if (!propDecl) {
                            classBody.unshiftContainer('body', [b.propertyDefinition(
                                b.identifier(deepestMemberExpr.property.name),
                                b.literal(null)
                            )]);
                        }
                    }
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
            if (!is.identifier(key)) {
                throw Error('Property Definition key is not Identifier!');
            }

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
        },

        ArrayExpression: (path, state) => {
            const arrayPolyfill = state.module.translator.polyfillFromFile(state.module, path, './polyfill/array.js');
            const polyfill = arrayPolyfill.get('JSArray');

            /*
            if (is.newExpression(path.parent)) {
                const callee = path.parent.callee;
                if (is.identifier(callee) && callee.name == polyfill.Identifier)
                    return;
            }

            path.replaceWith(b.newExpression(
                b.identifier(polyfill.Identifier),
                [path.node]
            ));*/
        },

        AssignmentPattern: path => {

            const node = path.node;

            // If we're using assignment pattern inside a class method.
            const methodPath = path.findParent<MethodDefinition>(x => is.methodDefinition(x));
            if (methodPath) {
                // We better be doing that assignment right at the top
                // of the method body.
                const functionPath = methodPath.get('value');
                const bodyPath = functionPath.get('body');

                bodyPath.unshiftContainer('body', [
                    b.expressionStatement(b.assignmentExpression('??=', node.left, node.right))
                ]);

                node.right = b.literal(null);
            }

        },

        RestElement: path => {
            const node = path.node;
            if (is.identifier(node.argument)) {
                const arg = node.argument;
                if (is.identifier(arg))
                    path.scope.renameBinding(arg.name, 'vargv');
            }
        },

        ImportDefaultSpecifier: path => {
            const node = path.node;
            path.replaceWith(b.importSpecifier(node.local, node.local));
        },

        ImportDeclaration: (nodePath, state) => {
            const module = state.module;
            if (!module) {
                throw Error('Import Declaration in preprocess without Module provided.');
            }

            const polyfill = module.translator.polyfillFromFile(module, nodePath, './polyfill/module.js');
            const node = nodePath.node;
            const scopeIdent = nodePath.scope.generateUidIdentifier();

            const importPath = node.source.value.toString();
            const importedModule = resolveImportedModule(importPath, module);
            if (!importedModule) {
                nodePath.remove();
                if (importPath.startsWith('./') || importPath.startsWith('../'))
                    return;

                throw Error(`Could not resolve module: ${importPath}`);
            }

            for (const specifier of node.specifiers) {
                if (is.importSpecifier(specifier)) {
                    nodePath.insertAfter([
                        b.variableDeclaration('const', [
                            b.variableDeclarator(specifier.local, b.memberExpression(scopeIdent, specifier.imported)),
                        ])
                    ]);
                }

                if (is.importDefaultSpecifier(specifier)) {
                    const defaultImport = importedModule.defaultExportIdent;
                    if (!defaultImport) {
                        throw Error('Import Default Specifier without a Default Export.');
                    }

                    nodePath.insertAfter([
                        b.variableDeclaration('const', [
                            b.variableDeclarator(specifier.local, b.memberExpression(scopeIdent, defaultImport)),
                        ])
                    ]);
                }
            }

            nodePath.replaceWith(b.variableDeclaration('const', [
                b.variableDeclarator(scopeIdent, b.callExpression(
                    b.identifier(polyfill.get('resolveModule')),
                    [b.literal(importedModule.name)]
                ))
            ]));
        },

        ExportDeclaration: (path, state) => {
            const node = path.node;
            if (is.exportNamedDeclaration(node)) {
                path.replaceWith(node.declaration);
            }

            if (is.exportDefaultDeclaration(node)) {
                const module = state.module;
                module.defaultExportIdent = path.scope.generateUidIdentifier('__js_export_default');

                let declaration = node.declaration;
                if (is.classDeclaration(declaration)) {
                    declaration = b.classExpression(declaration.id, declaration.body);
                }

                if (is.functionDeclaration(declaration)) {
                    declaration = b.functionExpression(declaration.id, declaration.params, declaration.body, declaration.generator, declaration.async);
                }

                path.replaceWith(b.expressionStatement(b.assignmentExpression(
                    '=',
                    module.defaultExportIdent,
                    declaration
                )));
            }
        }

    }, {module});
}


const ensureConstructorInClass = (path: NodePath<ClassBody>) => {
    const ctor = getClassConstructor(path);
    if (ctor) return;

    // Add constructor to the top of class body.
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

const resolveImportedModule = (relPath: string, module: Module) => {
    const importPath = path.resolve(module.formattedPath.dir, relPath);
    const importFormatPath = path.parse(importPath);
    const importAbsPath = path.format({...importFormatPath, base: '', ext: module.formattedPath.ext});

    return module.translator.addModule(importAbsPath);
};

const getClassPropertyDefinition = (path: NodePath<ClassBody>, key: string) => {
    return path.get('body').find(x => is.propertyDefinition(x) && is.identifier(x.node.key) && x.node.key.name == key) as NodePath<PropertyDefinition>;
};

const getClassConstructor = (path: NodePath<ClassBody>): MethodDefinition => {
    return path.node.body.find(x => is.methodDefinition(x) && x.kind == 'constructor') as MethodDefinition;
};

const propDefinitionHasValue = (path: PropertyDefinition) => {

    const node = path;
    if (!node.value) return false;

    if (is.literal(node.value) && node.value.value === null) return false;

    return true;
};

const variableDeclarationNeedsToSplit = (path: NodePath<VariableDeclaration>) => {

    const node = path.node;
    if (node.declarations.length <= 1)
        return false;

    if (node.kind == 'const') {

        // Multiple declarators in a single const declaration is not allowed.
        return true;
    }

    for (let i = 0; i < node.declarations.length; i++) {
        const decl = node.declarations[i];
        const id = decl.id;

        if (is.identifier(id) && id.name.startsWith('__global_'))
            return true;
    }

    return false;
};