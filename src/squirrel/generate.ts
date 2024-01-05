//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

/*
const Generators: Generators = {

    ObjectExpression: function* (node: ObjectExpression) {
        yield* helpers.withScope(() => helpers.generateBody({body: node.properties}));
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
};*/