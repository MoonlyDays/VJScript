//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {VariableDeclaration} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';

import {generate} from '../generate';
import {IDENTIFIER_MODIFIER_GLOBAL} from '../helpers';
import {variableDeclarationNeedsToSplit} from '../helpers/general';
import {generateArguments} from '../helpers/generator';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<VariableDeclaration> {

    handlePrepare(path: NodePath<VariableDeclaration>) {

        const node = path.node;
        if (variableDeclarationNeedsToSplit(path)) {

            for (let i = 1; i < node.declarations.length; i++) {
                const declarator = node.declarations[i];
                path.insertAfter([b.variableDeclaration(node.kind, [declarator])]);
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