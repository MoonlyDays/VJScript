//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForOfStatement} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {codeGen} from '../handler';
import {NodeHandler} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";
import {LoopHelpers} from "../helpers/LoopHelpers";

export default class extends NodeHandler<ForOfStatement> {
    handlePrepare(path: NodePath<ForOfStatement>) {

        const node = path.node;
        LoopHelpers.normalizeStatement(path);

        if (is.arrayPattern(node.left)) {
            if (node.left.elements.length > 2) {
                throw Error('ForOfStatement: Array Pattern must not contain more than 2 elements.');
            }
        }
    }

    * handleCodeGen(node: ForOfStatement): Generator<string, void, unknown> {
        yield 'foreach (';

        if (is.arrayPattern(node.left)) {
            yield* GeneratorHelpers.arguments(node.left.elements);
        } else {
            yield codeGen(node.left);
        }

        yield ' in ';
        yield codeGen(node.right);
        yield ') ';
        yield codeGen(node.body);
    }
}