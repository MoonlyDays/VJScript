//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {VariableDeclarator} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {generateCode} from '../handler';
import {destructureArrayPattern, destructureObjectPattern} from '../helpers/pattern';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<VariableDeclarator> {

    handlePrepare(path: NodePath<VariableDeclarator>) {
        const node = path.node;

        const id = node.id;
        if (is.arrayPattern(id)) {
            destructureArrayPattern(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }

        if (is.objectPattern(id)) {
            destructureObjectPattern(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }
    }

    * handleCodeGen(node: VariableDeclarator): Generator<string, void, unknown> {
        yield generateCode(node.id);
        if (node.init) {
            yield ' = ';
            yield generateCode(node.init);
        }
    }
}
