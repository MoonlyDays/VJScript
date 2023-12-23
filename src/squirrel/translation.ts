//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {
    ArrayExpression, ArrowFunctionExpression, AssignmentExpression, BaseNode,
    BinaryExpression, BlockStatement, CallExpression, ClassBody, ClassDeclaration,
    ConditionalExpression, ExpressionStatement, ForInStatement,
    ForOfStatement, ForStatement, FunctionDeclaration,
    FunctionExpression, Identifier, IfStatement,
    Literal, LogicalExpression, MemberExpression, MethodDefinition,
    NewExpression, ObjectExpression, Property,
    ReturnStatement, Statement, Super, TemplateLiteral,
    UnaryExpression, UpdateExpression, VariableDeclaration,
    WhileStatement, Program
} from 'estree';
import * as path from 'path';

import {ESTreeNodeMap} from './nodes';
import {isNodeOfType} from './util';

export function translate(scriptPath: string, program: Program) {

    const code =
        '///-------------------------------------------------------------------\n' +
        '/// This code was automatically generated using VJScript.\n' +
        '/// VJScript is an automatic code translation tool from JavaScript\n' +
        '/// to Squirrel.\n' +
        '/// https://github.com/MoonlyDays/VJScript\n' +
        '///-------------------------------------------------------------------\n' +
        '/// Source Script: ' + path.basename(scriptPath) + '\n' +
        '///-------------------------------------------------------------------\n\n';

    return code + translateNode(program);
}

function translateNode(node: BaseNode): string {
    const fn = TranslationMap[node.type];
    if (!fn) {
        console.log(node);
        throw Error(`Node ${node.type} is not supported!`);
    }

    let fragments = [...fn.call(TranslationMap, node)];
    fragments = fragments.filter(x => !!x);
    return fragments.join('');
}

let scopeDepth = 0;
type TranslationMap = { [K in keyof ESTreeNodeMap]?: (node: ESTreeNodeMap[K]) => Generator<string, void, unknown> };
const TranslationMap: TranslationMap = {
    Identifier: function* (node: Identifier) {
        yield node.name;
    },

    Literal: function* (node: Literal) {
        yield JSON.stringify(node.value);
    },

    Property: function* (node: Property) {
        yield translateNode(node.key);
        yield ' = ';

        if (node.value) {
            yield translateNode(node.value);
        } else {
            yield 'null';
        }
    },

    TemplateLiteral: function* (node: TemplateLiteral) {
        for (let i = 0; i < node.quasis.length; i++) {
            const element = node.quasis[i];
            const hasQausis = !!element.value.cooked;
            if (hasQausis) {
                if (i > 0) {
                    yield ' + ';
                }
                yield JSON.stringify(element.value.cooked);
            }

            if (!element.tail) {
                if (hasQausis)
                    yield ' + ';

                const expr = node.expressions[i];
                yield translateNode(expr);
            }
        }
    },

    BlockStatement: function* (node: BlockStatement, addBrackets = true) {

        if (addBrackets) {
            yield '{\n';
            scopeDepth++;
        }

        for (const element of node.body) {
            let code = translateNode(element);

            if (scopeDepth > 0) {
                code = code.split('\n').map(x => '  ' + x).join('\n');
            }

            yield code;
            yield '\n';
        }

        if (addBrackets) {
            scopeDepth--;
            yield '}';
        }
    },

    Program: function* (node: Program) {
        yield* this.BlockStatement({
            type: 'BlockStatement',
            body: node.body as Statement[]
        }, false);
    },

    ExpressionStatement: function* (node: ExpressionStatement) {

        // Directives are not added to the source code.
        if ('directive' in node) {
            return;
        }

        yield translateNode(node.expression);
    },

    IfStatement: function* (node: IfStatement) {

        yield 'if (';
        yield translateNode(node.test);
        yield ')\n';
        yield translateNode(node.consequent);

        if (node.alternate) {
            yield 'else\n';
            yield translateNode(node.alternate);
        }
    },

    WhileStatement: function* (node: WhileStatement) {
        yield 'while (';
        yield translateNode(node.test);
        yield ') ';
        yield translateNode(node.body);
    },

    ForStatement: function* (node: ForStatement) {
        yield 'for(';
        if (node.init) {
            yield translateNode(node.init);
        }

        yield ';';
        if (node.test) {
            yield translateNode(node.test);
        }

        yield ';';
        if (node.update) {
            yield translateNode(node.update);
        }

        yield ')\n';
        yield translateNode(node.body);
    },

    ForOfStatement: function* (node: ForOfStatement): Generator<string, void, unknown> {

        /**
         * +--------------------------+-----------------------------+
         * | JavaScript               | Squirrel
         * +--------------------------+-----------------------------+
         * | 1. for(let val of arr)   | foreach(val in arr)
         * | 2. for(let idx in arr)   | foreach(idx, __v in arr)
         * | 3. for(let [k, v] of arr)| foreach(k, v in arr)
         * | 4. everything else       | throw Exception
         * +--------------------------+-----------------------------+
         */

        if (node.left.type == 'VariableDeclaration') {

            const decl = node.left.declarations[0];
            if (decl.id.type == 'ArrayPattern') {
                node.left.declarations = decl.id.elements.map(x => ({
                    type: 'VariableDeclarator',
                    id: x as Identifier,
                    init: null
                }));
            }

            // The last third case of foreach.
            yield 'foreach(';

            for (let i = 0; i < node.left.declarations.length; i++) {
                const decl = node.left.declarations[i];
                if (decl.id.type == 'Identifier') {
                    if (i > 0)
                        yield ', ';

                    yield decl.id.name;
                }
            }

            yield ' in ';
            yield translateNode(node.right);
            yield ')\n';

            yield translateNode(node.body);
            return;

        }

        throw Error('The following for ... of loop cannot be converted.');
    },

    ForInStatement: function (node: ForInStatement) {

        if (node.left.type == 'VariableDeclaration') {

            node.left.declarations.push({
                type: 'VariableDeclarator',
                init: null,
                id: {
                    type: 'Identifier',
                    name: '__v',
                }
            });

            const forOfNode: ForOfStatement = {...node, type: 'ForOfStatement', await: false};
            return this.ForOfStatement(forOfNode);
        }

        throw Error('The following for ... of loop cannot be converted');
    },

    BreakStatement: function* () {
        yield 'break';
    },

    ContinueStatement: function* () {
        yield 'continue';
    },

    ReturnStatement: function* (node: ReturnStatement) {
        yield 'return ';
        yield translateNode(node.argument);
    },

    VariableDeclaration: function* (node: VariableDeclaration) {

        const kind = node.kind;
        const nutKind = kind == 'const' ? kind : 'local';

        for (let i = 0; i < node.declarations.length; i++) {

            if (i > 0) {
                yield '\n';
            }

            const decl = node.declarations[i];
            yield nutKind;
            yield ' ';
            yield translateNode(decl.id);

            if (decl.init) {
                yield ' = ';
                yield translateNode(decl.init);
            }
        }
    },

    ClassDeclaration: function* (node: ClassDeclaration) {

        yield 'class ';
        yield translateNode(node.id);
        if (node.superClass) {
            yield ' extends ';
            yield translateNode(node.superClass);
        }

        yield ' ';
        yield translateNode(node.body);
    },

    ClassBody: function* (node: ClassBody) {
        yield* this.BlockStatement({
            type: 'BlockStatement',
            body: node.body as BlockStatement['body'],
        });
    },

    MethodDefinition: function* (node: MethodDefinition) {
        const func = node.value;
        func.id = node.key as Identifier;
        yield* this.FunctionExpression(func);
    },

    Super: function* (node: Super) {
        yield 'base';
    },

    AssignmentExpression: function* (node: AssignmentExpression) {

        yield translateNode(node.left);

        if (node.left.type == 'MemberExpression') {
            yield ' <- ';
        } else {
            yield ' = ';
        }

        yield translateNode(node.right);
    },

    ArrayExpression: function* (node: ArrayExpression) {

        yield '[';
        for (let i = 0; i < node.elements.length; i++) {

            const el = node.elements[i];
            if (!el)
                continue;

            if (i > 0)
                yield ', ';

            yield translateNode(el);
        }
        yield ']';
    },

    ObjectExpression: function* (node: ObjectExpression) {
        yield '{\n';
        for (let i = 0; i < node.properties.length; i++) {
            const prop = node.properties[i];
            yield '  ';
            yield translateNode(prop);
            yield ',\n';
        }
        yield '}';
    },

    BinaryExpression: function* (node: BinaryExpression) {

        if (node.operator == '===') {
            // Squirrel doesn't support triple equal signs.
            node.operator = '==';
        }

        yield '(';
        yield translateNode(node.left);
        yield ' ';
        yield node.operator;
        yield ' ';
        yield translateNode(node.right);
        yield ')';
    },

    FunctionExpression: function* (node: FunctionExpression) {

        const body = node.body;
        if (!isNodeOfType(body, 'BlockStatement')) {
            node.body = {
                type: 'BlockStatement',
                body: [{
                    type: 'ReturnStatement',
                    argument: body
                }]
            };
        }

        yield 'function ';
        if (node.id) {
            yield translateNode(node.id);
        }

        yield '(';
        yield node.params.map(x => translateNode(x)).join(', ');
        yield ') ';

        yield translateNode(node.body);
    },

    UnaryExpression: function* (node: UnaryExpression) {
        yield node.operator;
        yield translateNode(node.argument);
    },

    UpdateExpression: function* (node: UpdateExpression) {
        if (node.prefix)
            yield node.operator;

        yield translateNode(node.argument);

        if (!node.prefix)
            yield node.operator;
    },

    ConditionalExpression: function* (node: ConditionalExpression) {
        yield '(';
        yield translateNode(node.test);
        yield ' ? ';
        yield translateNode(node.consequent);
        yield ' : ';
        yield translateNode(node.alternate);
        yield ')';
    },

    LogicalExpression: function* (node: LogicalExpression) {
        yield '(';
        yield translateNode(node.left);
        yield ' ';
        yield node.operator;
        yield ' ';
        yield translateNode(node.right);
        yield ')';
    },

    NewExpression: function* (node: NewExpression) {
        yield* this.CallExpression(node);
    },

    ThisExpression: function* () {
        yield 'this';
    },

    CallExpression: function* (node: CallExpression) {
        yield translateNode(node.callee);
        yield '(';
        for (let i = 0; i < node.arguments.length; i++) {
            const arg = node.arguments[i];
            if (i > 0) {
                yield ', ';
            }

            yield translateNode(arg);
        }
        yield ')';
    },

    MemberExpression: function* (node: MemberExpression) {

        yield translateNode(node.object);
        if (node.computed) {
            yield '[';
            yield translateNode(node.property);
            yield ']';
            return;
        }

        yield '.';
        yield translateNode(node.property);
    },

    ArrowFunctionExpression: function* (node: ArrowFunctionExpression) {
        yield '(';
        yield* this.FunctionExpression({
            type: 'FunctionExpression',
            id: null,
            params: node.params,
            body: node.body as BlockStatement
        });
        yield ')';
    },

    ImportDeclaration: function* () {
    },

    FunctionDeclaration: function* (node: FunctionDeclaration) {
        yield* this.FunctionExpression({
            type: 'FunctionExpression',
            id: node.id,
            params: node.params,
            body: node.body
        });
    }
};
