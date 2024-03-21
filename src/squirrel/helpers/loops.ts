//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {ForInStatement, ForOfStatement} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

export const Loops = {
    normalizeStatement(forPath: NodePath<ForInStatement | ForOfStatement>) {

        const path = forPath.get('left');
        const node = path.node;

        let id = node;
        if (is.variableDeclaration(node)) {
            // Declarations in for loop always are supposed to have one declarator.
            const declarator = node.declarations[0];
            id = declarator.id;

            // If we are declaring an identifier, return that identifier in an array pattern.
            if (is.identifier(id)) {
                path.replaceWith(b.arrayPattern([id]));
                return;
            }
        }

        // TODO: deal with patterns in loops
    }
};