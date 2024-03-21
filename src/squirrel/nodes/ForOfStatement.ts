//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForOfStatement} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {generateCode} from '../handler';
import {generateArgumentsCode} from '../helpers/generator';
import {Loops} from '../helpers/loops';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ForOfStatement> {
    handlePrepare(path: NodePath<ForOfStatement>) {

        const node = path.node;
        Loops.normalizeStatement(path);

        if (is.arrayPattern(node.left)) {
            if (node.left.elements.length > 2) {
                throw Error('ForOfStatement: Array Pattern must not contain more than 2 elements.');
            }
        }
    }

    * handleCodeGen(node: ForOfStatement): Generator<string, void, unknown> {
        yield 'foreach (';

        if (is.arrayPattern(node.left)) {
            yield* generateArgumentsCode(node.left.elements);
        } else {
            yield generateCode(node.left);
        }

        yield ' in ';
        yield generateCode(node.right);
        yield ') ';
        yield generateCode(node.body);
    }
}