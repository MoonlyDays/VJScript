//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {MemberExpression} from 'estree';
import {builders, is, NodePath} from 'estree-toolkit';

import {Attributes} from '../Attributes';
import {codeGen} from '../handler';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<MemberExpression> {
    handlePrepare(path: NodePath<MemberExpression>, state: TraverseState) {

        const node = path.node;
        const prop = node.property;

        if (is.identifier(prop) && prop.name == 'default') {
            node.property = builders.literal('default');
            node.computed = true;
        }

        Attributes.process(path, state.module);
    }

    * handleCodeGen(node: MemberExpression): Generator<string, void, unknown> {

        yield codeGen(node.object);

        if (node.computed) {
            yield '[';
            yield codeGen(node.property);
            yield ']';
            return;
        }

        yield '.';
        yield codeGen(node.property);
    }
}
