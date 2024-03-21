//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {VariableDeclaration} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {codeGen} from '../handler';
import {findPathInsideArray} from '../helpers/general';
import {isGlobalIdentifier, isRequireCallExpression} from '../helpers/identify';
import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";

export default class extends NodeHandler<VariableDeclaration> {

    handlePrepare(path: NodePath<VariableDeclaration>) {

        const node = path.node;
        if (this.needsToSplit(path)) {

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

    * handleCodeGen(node: VariableDeclaration): Generator<string, void, unknown> {
        yield node.kind == 'const' ? 'const' : 'local';
        yield ' ';
        yield* GeneratorHelpers.arguments(node.declarations);
    }

    /**
     * Returns true if declarators in the Variable Declaration need to split
     * in their own declarations.
     * @param path
     */
    needsToSplit(path: NodePath<VariableDeclaration>) {

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
}

