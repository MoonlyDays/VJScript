//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BlockStatement, ForInStatement, ForOfStatement, Pattern, Statement, VariableDeclarator} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

export type ForStatement = ForInStatement | ForOfStatement;

export const Loops = {
    normalizeStatement(forPath: NodePath<ForStatement>) {

        const leftPath = forPath.get('left');
        if (is.variableDeclaration(leftPath)) {
            const declarators = leftPath.get('declarations') as NodePath<VariableDeclarator>[];
            if (declarators.length != 1) {
                throw new Error('Loops.normalizeStatement: Loop with a variable declaration has multiple declarators?');
            }

            const firstDecl = declarators[0];
            const firstDeclId = firstDecl.get('id');

            if (!is.identifier(firstDeclId)) {
                const aliasIdent = firstDeclId.scope.generateUidIdentifier();
                firstDecl.node.init = aliasIdent;
                leftPath.replaceWith(aliasIdent);
                this.extractPattern(forPath, leftPath.cloneNode());
            }

            return;
        }

        if (!is.identifier(leftPath)) {
            const pattern = leftPath.cloneNode() as Pattern;
            const aliasIdent = leftPath.scope.generateUidIdentifier();
            leftPath.replaceWith(aliasIdent);
            this.extractPattern(forPath, b.expressionStatement(b.assignmentExpression(
                '=',
                pattern,
                aliasIdent)));
        }
        //
        // console.log(JSON.stringify(forPath.node, null, 2));
    },

    extractPattern(forPath: NodePath<ForStatement>, extractNode: Statement) {

        let body = forPath.get('body') as NodePath<BlockStatement | Statement>;
        if (!is.blockStatement(body)) {
            body = body.replaceWith(b.blockStatement([body.cloneNode()]));
        }

        if (is.blockStatement(body)) {
            body.unshiftContainer('body', [extractNode]);
        }

        console.log(JSON.stringify(forPath.node, null, 2));
    }
};