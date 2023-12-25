//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {
    BaseNode, BinaryExpression,
    BlockStatement,
    ExpressionStatement,
    Identifier,
    Literal, ObjectExpression,
    Program,
    VariableDeclaration,
    VariableDeclarator
} from 'estree';
import {traverse, Visitor} from 'estree-toolkit';

import {helpers} from './helpers';

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

const Generators: Generators = {
    Program: function* (node: Program) {
        yield* helpers.generateBody(node);
    },
    BlockStatement: function* (node: BlockStatement) {
        yield* helpers.withScope(() => helpers.generateBody(node));
    },
    VariableDeclaration: function* (node: VariableDeclaration) {
        yield node.kind == 'const' ? 'const' : 'local';
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
    BinaryExpression: function* (node: BinaryExpression) {
        yield '(';
        yield* helpers.generateLROperatorExpression(node);
        yield ')';
    },
    ExpressionStatement: function* (node: ExpressionStatement) {
        yield generate(node.expression);
    },
    LogicalExpression: function* (node) {
        yield* helpers.generateLROperatorExpression(node);
    },
    ThisExpression: function* () {
        yield 'this';
    },
    MemberExpression: function* (node) {
        yield generate(node.object);

        if (node.computed) {
            yield '[';
            yield generate(node.property);
            yield ']';
            return;
        }

        yield '.';
        yield generate(node.property);
    },
    ConditionalExpression: function* (node) {
        yield generate(node.test);
        yield ' ? ';
        yield generate(node.consequent);
        yield ' : ';
        yield generate(node.alternate);
    },
    CallExpression: function* (node) {
        yield generate(node.callee);
        yield '(';
        yield node.arguments.map(x => generate(x)).join(', ');
        yield ')';
    },
    IfStatement: function* (node) {
        yield 'if (';
        yield generate(node.test);
        yield ') ';
        yield generate(node.consequent);

        if (node.alternate) {
            yield ' else ';
            yield generate(node.alternate);
        }
    },
    AssignmentExpression: function* (node) {
        yield* helpers.generateLROperatorExpression(node);
    },
    UnaryExpression: function* (node) {
        yield '(';
        yield node.operator;
        yield generate(node.argument);
        yield ')';
    },
    ObjectExpression: function* (node: ObjectExpression) {
        yield* helpers.generateBody({body: node.properties});
    },
    Property: function* (node) {
        if (['get', 'set'].includes(node.kind))
            throw Error('Getters and Setters are not supported!');

        yield generate(node.key);
        yield ' = ';
        yield generate(node.value);
    },
    ReturnStatement: function* (node) {
        yield 'return ';
        yield generate(node.argument);
    },
    ArrayExpression: function* (node) {
        yield '[';
        yield node.elements.map(x => generate(x)).join(', ');
        yield ']';
    },
    ForOfStatement: function* (node) {
        yield 'foreach (';

        if (node.left.type == 'ArrayPattern') {
            yield node.left.elements.map(x => generate(x)).join(', ');
        } else {
            yield generate(node.left);
        }

        yield ' in ';
        yield generate(node.right);
        yield ') ';
        yield generate(node.body);
    },
    FunctionExpression: function* (node) {
        yield* helpers.generateFunction(node);
    },
    FunctionDeclaration: function *(node) {
        yield* helpers.generateFunction(node);
    }
};