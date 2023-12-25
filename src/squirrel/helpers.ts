//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BaseNode} from 'estree';

import {generate} from './generate';

class Helpers {

    private scopeDepth = 0;

    public* generateBody(node: { body: BaseNode[] }) {
        for (const element of node.body) {
            let code = generate(element);

            if (this.scopeDepth > 0) {
                code = code.split('\n').map(x => '  ' + x).join('\n');
            }

            yield code;
            yield '\n';
        }
    }

    public* generateLROperatorExpression(node: { operator: string, left: BaseNode, right: BaseNode }) {
        yield generate(node.left);
        yield ' ';
        yield node.operator;
        yield ' ';
        yield generate(node.right);
    }

    public* withScope(fn: () => Generator<string, void, unknown>) {
        this.scopeDepth++;
        yield* fn();
        this.scopeDepth--;
    }
}

export const helpers = new Helpers();
