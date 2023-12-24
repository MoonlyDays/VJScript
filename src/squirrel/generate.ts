//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BlockStatement, Program} from 'estree';
import {traverse, Visitor} from 'estree-toolkit';
import {ESTree} from 'meriyah';

export function generate(node: ESTree.Node) {
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

const Generators: Generators = {
    Program: function* (node: Program) {
        this.BlockStatement({});
    },
    BlockStatement: function* (node: BlockStatement) {

    }
};