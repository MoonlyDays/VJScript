//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ExportNamedDeclaration} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<ExportNamedDeclaration> {

    handlePrepare(path: NodePath<ExportNamedDeclaration>) {

        const node = path.node;
        if (is.exportNamedDeclaration(node)) {
            path.replaceWith(node.declaration);
        }
    }

}