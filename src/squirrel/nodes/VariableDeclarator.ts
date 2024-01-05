//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {VariableDeclarator} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {generate} from '../handler';
import {resolveArrayPattern, resolveObjectPattern} from '../helpers/patterns';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<VariableDeclarator> {

    handlePrepare(path: NodePath<VariableDeclarator>) {
        const node = path.node;

        const id = node.id;
        if (is.arrayPattern(id)) {
            resolveArrayPattern(path, id, node.init, (k, v) => b.variableDeclarator(k, v));
            return;
        }

        if (is.objectPattern(id)) {
            resolveObjectPattern(path, id, node.init, (k, v) => b.variableDeclarator(k, v));
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