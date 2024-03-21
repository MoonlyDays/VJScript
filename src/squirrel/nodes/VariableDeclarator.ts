//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, Literal, VariableDeclarator} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';
import {PatternHelpers} from "../helpers/patterns";

export default class extends NodeHandler<VariableDeclarator> {

    handlePrepare(path: NodePath<VariableDeclarator>) {
        const node = path.node;

        const id = node.id;
        if (is.arrayPattern(id)) {
            PatternHelpers.destructureArray(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }

        if (is.objectPattern(id)) {
            PatternHelpers.destructureObject(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }
    }

    * handleCodeGen(node: VariableDeclarator): Generator<string, void, unknown> {
        yield codeGen(node.id);
        if (node.init) {
            yield ' = ';
            yield codeGen(node.init);
        }
    }
}
