//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program, Statement} from 'estree';
import {is, NodePath} from 'estree-toolkit';

import {generateBodyCode} from '../helpers/generator';
import {deepestIdentifier} from '../helpers/search';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<Program> {

    handlePrepare(path: NodePath<Program>) {
        const statements = path.get('body');
        let length = statements.length;

        for (let i = 0; i < length; i++) {
            const statement = statements[i] as NodePath<Statement>;
            if (!is.expressionStatement(statement))
                continue;

            const expr = statement.get('expression');
            if (!is.assignmentExpression(expr))
                continue;

            const deepest = deepestIdentifier(expr.get('left')) as NodePath;
            if (!is.identifier(deepest))
                continue;

            const deepestNode = deepest.node;
            if (deepestNode.name != 'exports')
                continue;

            statements.splice(i, 1);
            path.pushContainer('body', [statement.cloneNode()]);
            statement.remove();
            length--;
            i--;
        }

    }

    handleCodeGen(node: Program): Generator<string, void, unknown> {
        return generateBodyCode(node);
    }
}