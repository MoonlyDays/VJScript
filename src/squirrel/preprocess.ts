//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {builders as b, traverse} from 'estree-toolkit';
import {ESTree} from 'meriyah';

export function preprocess(program: ESTree.Program) {
    traverse(program, TraverseVisitors);
}


type TraverseVisitors = Parameters<typeof traverse>[1];
const TraverseVisitors: TraverseVisitors = {
    VariableDeclaration: path => {

        const node = path.node;
        if (node.kind == 'const') {
            // Multiple declarators in a single const declaration is not allowed.
            const declarators = node.declarations;
            if (declarators.length > 1) {
                for (let i = 1; i < declarators.length; i++) {
                    const declarator = declarators[i];
                    path.insertAfter([b.variableDeclaration('const', [declarator])]);
                }

                node.declarations = node.declarations.slice(0, 1);
            }

            // Const can only accept a single literal value,
            // Otherwise it's a local.
            const declarator = declarators[0];
            if (declarator) {

                // We assume it's always not null, because parser won't allow uninitialized
                // const variables.
                const init = declarator.init;
                if (init.type != 'Literal') {
                    node.kind = 'let';
                }
            }
        }

    }
};