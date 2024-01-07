//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ExportSpecifier} from 'estree';
import {NodePath} from 'estree-toolkit';

import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<ExportSpecifier> {

    handlePrepare(path: NodePath<ExportSpecifier>, state: TraverseState) {

        const module = state.module;
        if (!module) {
            throw Error('ExportSpecifier: No module provided.');
        }

        const node = path.node;
        const local = node.local;
        const exported = node.exported;
        module.registerExport(local.name, exported.name);

        path.remove();
    }
}