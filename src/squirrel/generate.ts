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
        yield* helpers.generateArguments(node.declarations);
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
        yield* helpers.generateArguments(node.arguments);
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
        yield ' ';
        yield generate(node.argument);
        yield ')';
    },

    ObjectExpression: function* (node: ObjectExpression) {
        yield* helpers.withScope(() => helpers.generateBody({body: node.properties}));
    },

    Property: function* (node) {
        if (['get', 'set'].includes(node.kind))
            throw Error('Getters and Setters are not supported!');

        yield generate(node.key);
        yield ' = ';
        yield generate(node.value);
    },

    ReturnStatement: function* (node) {
        yield 'return';

        if (node.argument) {
            yield ' ';
            yield generate(node.argument);
        }
    },

    ArrayExpression: function* (node) {
        yield '[';
        yield* helpers.generateArguments(node.elements);
        yield ']';
    },

    ForOfStatement: function* (node) {
        yield 'foreach (';

        if (node.left.type == 'ArrayPattern') {
            yield* helpers.generateArguments(node.left.elements);
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

    FunctionDeclaration: function* (node) {
        yield* helpers.generateFunction(node);
    },

    TemplateLiteral: function* (node) {
        const parts = [];
        for (let i = 0; i < node.quasis.length; i++) {
            const element = node.quasis[i];
            parts.push(generate(element));

            if (!element.tail) {
                const expr = node.expressions[i];
                parts.push(generate(expr));
            }
        }

        yield parts.filter(x => !!x).join(' + ');
    },

    TemplateElement: function* (node) {
        yield JSON.stringify(node.value.cooked);
    },

    NewExpression: function* (node) {
        yield generate(node.callee);
        yield '(';
        yield* helpers.generateArguments(node.arguments);
        yield ')';
    },

    ClassDeclaration: function* (node) {
        yield 'class ';
        yield generate(node.id);

        if (node.superClass) {
            yield ' extends ';
            yield generate(node.superClass);
        }

        yield ' ';
        yield generate(node.body);
    },

    ClassBody: function* (node) {
        yield* helpers.withScope(() => helpers.generateBody(node));
    },

    PropertyDefinition: function* (node) {
        if (node.static) {
            yield 'static ';
        }

        yield generate(node.key);

        if (node.value) {
            yield ' = ';
            yield generate(node.value);
        }
    },

    MethodDefinition: function* (node) {
        if (['get', 'set'].includes(node.kind)) {
            throw Error('Class getter and setter are not support.');
        }

        if (node.static) {
            yield 'static ';
        }

        if (node.kind == 'method') {
            yield 'function ';
            yield generate(node.key);
        } else {
            yield 'constructor';
        }

        yield '(';
        yield* helpers.generateArguments(node.value.params);
        yield ') ';

        yield* helpers.withScope(() => helpers.generateBody(node.value.body));
    },

    Super: function* () {
        yield 'base';
    }
};