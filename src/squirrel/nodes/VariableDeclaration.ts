//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {VariableDeclaration} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {generate} from '../handler';
import {IDENTIFIER_MODIFIER_GLOBAL} from '../helpers/consts';
import {findPathInsideArray} from '../helpers/general';
import {generateArguments} from '../helpers/generator';
import {isGlobalIdentifier, isRequireCallExpression} from '../helpers/identify';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<VariableDeclaration> {

    handlePrepare(path: NodePath<VariableDeclaration>) {

        const node = path.node;
        if (variableDeclarationNeedsToSplit(path)) {

            for (let i = 1; i < node.declarations.length; i++) {
                const declarator = node.declarations[i];
                const parentPath = findPathInsideArray(path);
                parentPath.insertAfter([b.variableDeclaration(node.kind, [declarator])]);
            }

            node.declarations = node.declarations.slice(0, 1);
        }

        const declarators = node.declarations;
        const first = declarators[0];

        if (first) {
            if (node.kind == 'const') {

                // Const can only accept a single literal value, otherwise it's a "let".
                // We assume it's always not null, because parser won't allow uninitialized const variables.
                const init = first.init;
                if (!init || !is.literal(init)) {
                    node.kind = 'let';
                }
            }
        }
    }

    * handleGenerate(node: VariableDeclaration): Generator<string, void, unknown> {

        const firstDecl = node.declarations[0];
        const firstDeclId = firstDecl.id;

        // Special case for root table defined global variables.
        // If the identifier of the declaration has global modifier, generate
        // root declaration code for it.
        if (is.identifier(firstDeclId) && firstDeclId.name.includes(IDENTIFIER_MODIFIER_GLOBAL)) {

            if (node.declarations.length > 1) {
                throw Error('VariableDeclaration: has multiple declarators with a global one during Generation.');
            }

            firstDeclId.name = firstDeclId.name.replace(IDENTIFIER_MODIFIER_GLOBAL, '');

            yield '::';
            yield generate(firstDeclId);

            if (firstDecl.init) {
                yield ' <- ';
                yield generate(firstDecl.init);
            }

            return;
        }

        yield node.kind == 'const' ? 'const' : 'local';
        yield ' ';
        yield* generateArguments(node.declarations);
    }
}


/**
 * We're given a Variable Declaration node, returns true if declarators in it need to split
 * in their own declarations.
 * @param path
 */
function variableDeclarationNeedsToSplit(path: NodePath<VariableDeclaration>) {

    const node = path.node;
    if (node.declarations.length <= 1)
        return false;

    if (node.kind == 'const') {
        // Multiple declarators in a single const declaration are not allowed.
        return true;
    }

    const declarations = path.get('declarations');
    for (const declaration of declarations) {
        const id = declaration.get('id');
        const init = declaration.get('init');

        // Global variables must always be declared
        if (isGlobalIdentifier(id))
            return true;

        if (isRequireCallExpression(init))
            return true;
    }

    return false;
}