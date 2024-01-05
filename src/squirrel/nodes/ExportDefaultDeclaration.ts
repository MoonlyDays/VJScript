//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ExportDefaultDeclaration} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit/dist/builders';

import {IDENTIFIER_DEFAULT_EXPORT} from '../helpers/consts';
import {NodeHandler, TraverseState} from './NodeHandler';

export default class extends NodeHandler<ExportDefaultDeclaration> {
    handlePrepare(path: NodePath<ExportDefaultDeclaration>, state: TraverseState) {
        const module = state.module;
        if (!module) {
            throw Error('ImportDeclaration: No Module provided.');
        }

        const node = path.node;
        module.defaultExportIdentifier = path.scope.generateUidIdentifier(IDENTIFIER_DEFAULT_EXPORT);

        let declaration = node.declaration;
        if (is.classDeclaration(declaration)) {
            declaration = b.classExpression(declaration.id, declaration.body);
        }

        if (is.functionDeclaration(declaration)) {
            declaration = b.functionExpression(declaration.id, declaration.params, declaration.body, declaration.generator, declaration.async);
        }

        path.replaceWith(b.expressionStatement(b.assignmentExpression(
            '=',
            module.defaultExportIdentifier,
            declaration
        )));
    }
}