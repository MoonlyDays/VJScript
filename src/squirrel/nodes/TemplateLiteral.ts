//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {TemplateLiteral} from 'estree';

import {generateCode} from '../handler';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<TemplateLiteral> {

    * handleCodeGen(node: TemplateLiteral): Generator<string, void, unknown> {

        const parts = [];
        for (let i = 0; i < node.quasis.length; i++) {
            const element = node.quasis[i];
            parts.push(generateCode(element));

            if (!element.tail) {
                const expr = node.expressions[i];
                parts.push(generateCode(expr));
            }
        }

        yield parts.filter(x => !!x).join(' + ');
    }
}