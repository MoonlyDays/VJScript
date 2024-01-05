//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForOfStatement} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {generate} from '../handler';
import {generateArguments} from '../helpers/generator';
import {normalizeLoopStatement} from '../helpers/loop';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ForOfStatement> {
    handlePrepare(path: NodePath<ForOfStatement>) {

        const node = path.node;
        normalizeLoopStatement(path);

        if (is.arrayPattern(node.left)) {
            if (node.left.elements.length > 2) {
                throw Error('ForOfStatement: Array Pattern must not contain more than 2 elements.');
            }
        }
    }

    * handleGenerate(node: ForOfStatement): Generator<string, void, unknown> {

        yield 'foreach (';

        if (is.arrayPattern(node.left)) {
            yield* generateArguments(node.left.elements);
        } else {
            yield generate(node.left);
        }

        yield ' in ';
        yield generate(node.right);
        yield ') ';
        yield generate(node.body);
    }
}