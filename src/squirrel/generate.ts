//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {
    BaseNode,
    BlockStatement,
    Identifier,
    Literal,
    Node,
    Program,
    VariableDeclaration,
    VariableDeclarator
} from 'estree';
import {traverse, Visitor} from 'estree-toolkit';
import {ESTree} from 'meriyah';

let scopeDepth = 0;

export function generate(node: BaseNode) {
    const generator = Generators[node.type];
    if (!generator) {
        console.log(node);
        throw Error(`Node ${node.type} is not supported!`);
    }

    let fragments = [...generator.call(Generators, node)];
    fragments = fragments.filter(x => !!x);
    return fragments.join('');
}

type TraverseVisitors = Parameters<typeof traverse>[1];
type Generators = {
    [K in keyof TraverseVisitors]: (
        this: typeof Generators,
        node: TraverseVisitors[K] extends Visitor<infer X, K> ? X : undefined
    ) => Generator<string, void, unknown>;
};

const generateBody = function* (node: { body: BaseNode[] }) {

    for (const element of node.body) {
        let code = generate(element);

        if (scopeDepth > 0) {
            code = code.split('\n').map(x => '  ' + x).join('\n');
        }

        yield code;
        yield '\n';
    }
};

const Generators: Generators = {
    Program: function* (node: Program) {
        yield* generateBody(node);
    },
    BlockStatement: function* (node: BlockStatement) {
        yield* generateBody(node);
    },
    VariableDeclaration: function* (node: VariableDeclaration) {
        yield node.kind;
        yield ' ';

        yield node.declarations.map(x => generate(x)).join(', ');
    },
    VariableDeclarator: function* (node: VariableDeclarator) {
        yield generate(node.id);
        if (node.init) {
            yield ' = ';
            yield generate(node.init);
        }
    },
    Identifier: function* (node: Identifier) {
        yield node.name;
    },
    Literal: function* (node: Literal) {
        yield JSON.stringify(node.value);
    },
};