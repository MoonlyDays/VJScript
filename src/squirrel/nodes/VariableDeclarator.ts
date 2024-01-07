//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, Literal, VariableDeclarator} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {generate} from '../handler';
import {isRequireCallExpression} from '../helpers/identify';
import {replaceArrayPattern,replaceObjectPattern} from '../helpers/patterns';
import {deepestIdentifier} from '../identifier';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<VariableDeclarator> {

    handlePrepare(path: NodePath<VariableDeclarator>) {
        const node = path.node;

        const id = node.id;
        if (is.arrayPattern(id)) {
            replaceArrayPattern(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }

        if (is.objectPattern(id)) {
            replaceObjectPattern(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }
    }

    * handleGenerate(node: VariableDeclarator): Generator<string, void, unknown> {
        yield generate(node.id);
        if (node.init) {
            yield ' = ';
            yield generate(node.init);
        }
    }
}
