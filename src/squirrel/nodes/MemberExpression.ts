//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {MemberExpression} from 'estree';
import {builders, is, NodePath} from 'estree-toolkit';

import {processAttributes} from '../attributes';
import {generate} from '../handler';
import {renameNode} from '../rename';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<MemberExpression> {
    handlePrepare(path: NodePath<MemberExpression>, state: TraverseState) {

        const node = path.node;
        const prop = node.property;

        if (is.identifier(prop) && prop.name == 'default') {
            node.property = builders.literal('default');
            node.computed = true;
        }

        processAttributes(path, state.module);
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
