//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForInStatement, ForOfStatement} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

export const LoopHelpers = {
    normalizeStatement(forPath: NodePath<ForInStatement | ForOfStatement>) {

        const path = forPath.get('left');
        const node = path.node;

        if (is.variableDeclaration(node)) {
            // Declarations in for loop always are supposed to have one declarator.
            const declarator = node.declarations[0];

            // If we are declaring an Array Pattern, just use that pattern
            // as our left parameter.
            if (is.arrayPattern(declarator.id)) {
                path.replaceWith(declarator.id);
                return;
            }

            // If we are declaring an identifier, return
            // that identifier in an array pattern.
            if (is.identifier(declarator.id)) {
                path.replaceWith(b.arrayPattern([declarator.id]));
                return;
            }

            throw Error(`Unhandled left-side node of an for loop expression: ${node.type}`);
        }
    }
}