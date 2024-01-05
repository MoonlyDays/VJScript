//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------
// Reusable helper functions that assist to generate Squirrel code.
//--------------------------------------------------------------------------------------------------

import {Function as FunctionNode, Node} from 'estree';
import {is} from 'estree-toolkit';

import {generate} from '../handler';

export function* generateFunction(node: FunctionNode) {
    yield 'function';

    if ('id' in node && node.id) {
        yield ' ';
        yield generate(node.id);
    }

    yield ' (';
    yield node.params.map(x => generate(x)).join(', ');
    yield ') ';

    yield generate(node.body);
}

export function* generateBinaryOperatorExpression(node: { operator: string, left: Node, right: Node }) {
    yield generate(node.left);
    yield ' ';
    yield node.operator;
    yield ' ';
    yield generate(node.right);
}

let scopeDepth = 0;

export function* generateWithScope(generator: () => Generator<string, void, unknown>) {
    scopeDepth++;
    yield '{\n';
    yield* generator();
    yield '}';
    scopeDepth--;
}

export function* generateBody(node: { body: Node[] }) {
    for (const element of node.body) {
        let code = generate(element);

        if (scopeDepth > 0) {
            code = code.split('\n').map(x => '    ' + x).join('\n');
        }

        yield code;
        if (is.statement(element))
            yield ';';

        yield '\n';
    }
}

export function* generateArguments(args: Node[]) {
    yield args.map(x => generate(x)).join(', ');
}