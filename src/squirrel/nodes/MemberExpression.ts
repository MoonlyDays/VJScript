//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {MemberExpression} from 'estree';
import {NodePath} from 'estree-toolkit';

import {processAttributes} from '../attributes';
import {generate} from '../generate';
import {renameNode} from '../rename';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<MemberExpression> {
    handlePrepare(path: NodePath<MemberExpression>, state: TraverseState) {
        processAttributes(path);
        renameNode(path, state.module);
    }

    * handleGenerate(node: MemberExpression): Generator<string, void, unknown> {

        yield generate(node.object);

        if (node.computed) {
            yield '[';
            yield generate(node.property);
            yield ']';
            return;
        }

        yield '.';
        yield generate(node.property);
    }
}
