//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {processAttributes} from '../attributes';
import {IDENTIFIER_MODIFIER_GLOBAL} from '../helpers/consts';
import {renameNode} from '../rename';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<Identifier> {
    handlePrepare(path: NodePath<Identifier>, state: TraverseState) {

        const node = path.node;

        // base is a reserved keyword, and we're only allowed to use it if we're
        // inside a call and base is the deepest identifier.
        if (node.name == 'base') {
            node.name = '_base';
        }

        const isProperty = is.memberExpression(path.parentPath) && path.parentKey == 'property';
        if (!isProperty) {
            processAttributes(path);
            renameNode(path, state.module);
        }
    }

    * handleGenerate(node: Identifier): Generator<string, void, unknown> {

        if (node.name.includes(IDENTIFIER_MODIFIER_GLOBAL)) {
            node.name = node.name.replace(IDENTIFIER_MODIFIER_GLOBAL, '');
            yield '::';
        }

        yield node.name;
    }
}