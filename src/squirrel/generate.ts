//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Node} from 'estree';

import {handler} from './handler';


/*
const Generators: Generators = {

    UnaryExpression: function* (node) {
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

    ForStatement: function* (node) {

        yield 'for(';
        yield generate(node.init);
        yield ';';
        yield generate(node.test);
        yield ';';
        yield generate(node.update);
        yield ')';

        yield generate(node.body);
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
    },

    ClassDeclaration: function* (node) {
    },

    MethodDefinition: function* (node) {
    },

    Super: function* () {
        yield 'base';
    },

    UpdateExpression: function* (node) {
        if (node.prefix) yield node.operator;
        yield generate(node.argument);
        if (!node.prefix) yield node.operator;
    },

    RestElement: function* () {
    },

    AssignmentPattern: function* (node) {
    },

    ThrowStatement: function* (node) {
        yield 'throw ';
        yield generate(node.argument);
    }
};*/