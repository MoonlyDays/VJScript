//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ImportDefaultSpecifier} from 'estree';
import {builders as b, NodePath} from 'estree-toolkit';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ImportDefaultSpecifier> {
    handlePrepare(path: NodePath<ImportDefaultSpecifier>) {
        const node = path.node;
        path.replaceWith(b.importSpecifier(node.local, node.local));
    }
}