//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BaseNode, FunctionDeclaration, FunctionExpression, Node} from 'estree';
import {is} from 'estree-toolkit';

import {generate} from './generate';

class Helpers {

    private scopeDepth = 0;

    public* generateBody(node: { body: Node[] }) {
        for (const element of node.body) {
            let code = generate(element);

            if (this.scopeDepth > 0) {
                code = code.split('\n').map(x => '    ' + x).join('\n');
            }

            yield code;

            if (is.statement(element))
                yield ';';

            yield '\n';
        }
    }

    public* generateArguments(args: Node[]) {
        yield args.map(x => generate(x)).join(', ');
    }

    public* generateFunction(node: FunctionExpression | FunctionDeclaration) {
        yield 'function';

        if (node.id) {
            yield ' ';
            yield generate(node.id);
        }

        yield ' (';
        yield node.params.map(x => generate(x)).join(', ');
        yield ') ';

        yield generate(node.body);
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
        yield '{\n';
        yield* fn();
        yield '}';
        this.scopeDepth--;
    }
}

export const helpers = new Helpers();
