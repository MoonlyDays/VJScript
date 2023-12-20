import * as path from "path";
import {Program} from "esprima";
import {
    ArrayExpression,
    AssignmentExpression,
    BaseNode,
    BinaryExpression,
    BlockStatement, BreakStatement,
    CallExpression, ContinueStatement,
    ExpressionStatement, ForInStatement, ForOfStatement, ForStatement,
    Identifier,
    IfStatement,
    ImportDeclaration,
    Literal,
    MemberExpression,
    NewExpression,
    TemplateLiteral,
    UnaryExpression, UpdateExpression,
    VariableDeclaration
} from "estree";

export const toSquirrel = (scriptPath: string, node: Program) => {

    let code =
        '///------------------------------------------------------------\n' +
        '/// This code was automatically generated using VJScript. nm\n' +
        '/// VJScript is an automatic code translation tool from JavaScript\n' +
        '/// to Squirrel.\n' +
        '/// https://github.com/MoonlyDays/VJScript\n' +
        '///------------------------------------------------------------\n' +
        '/// Source Script: ' + path.basename(scriptPath) + '\n' +
        '///------------------------------------------------------------\n\n';

    return code + translate(node);
}

let currentScopeDepth = -1;
const nodeTranslators = {

    Identifier: function* (node: Identifier) {
        yield node.name;
    },

    Literal: function* (node: Literal) {
        yield JSON.stringify(node.value);
    },

    TemplateLiteral: function* (node: TemplateLiteral) {
        for (let i = 0; i < node.quasis.length; i++) {

            const element = node.quasis[i];
            const hasQausis = !!element.value.cooked;
            if (hasQausis) {
                if (i > 0) {
                    yield " + ";
                }
                yield JSON.stringify(element.value.cooked);
            }

            if (!element.tail) {
                if (hasQausis)
                    yield " + ";

                const expr = node.expressions[i];
                yield translate(expr);
            }
        }
    },

    BlockStatement: function* (node: BlockStatement) {
        yield "{\n";
        yield* nodeTranslators["Program"](node);
        yield "}\n";
    },

    Program: function* (node: Program) {

        currentScopeDepth++;
        for (const element of node.body) {
            let code = translate(element);

            if (currentScopeDepth > 0) {
                code = code.split("\n").map(x => "  " + x).join("\n");
            }

            yield code;
            yield '\n';
        }

        currentScopeDepth--;
    },

    ExpressionStatement: function* (node: ExpressionStatement) {
        // Directives are not added to the source code.
        if ("directive" in node) {
            return;
        }

        yield translate(node.expression);
    },

    IfStatement: function* (node: IfStatement) {

        yield "if (";
        yield translate(node.test);
        yield ")\n";
        yield translate(node.consequent);

        if (node.alternate) {
            yield "else\n";
            yield translate(node.alternate);
        }
    },

    ForStatement: function* (node: ForStatement) {
        yield "for(";
        if (node.init) {
            yield translate(node.init);
        }

        yield ";";
        if (node.test) {
            yield translate(node.test);
        }

        yield ";";
        if (node.update) {
            yield translate(node.update);
        }

        yield ")\n";
        yield translate(node.body);
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

        if (node.left.type == "VariableDeclaration") {

            const decl = node.left.declarations[0];
            if (decl.id.type == "ArrayPattern") {
                node.left.declarations = decl.id.elements.map(x => ({
                    type: "VariableDeclarator",
                    id: x as Identifier,
                    init: null
                }));
            }

            // The last third case of foreach.
            yield "foreach(";

            for (let i = 0; i < node.left.declarations.length; i++) {
                const decl = node.left.declarations[i];
                if (decl.id.type == "Identifier") {
                    if (i > 0)
                        yield ", ";

                    yield decl.id.name;
                }
            }

            yield " in ";
            yield translate(node.right);
            yield ")\n"

            yield translate(node.body);
            return;

        }

        console.log(node)
        throw Error("The following for ... of loop cannot be converted.");
    },

    ForInStatement: function (node: ForInStatement) {

        if (node.left.type == "VariableDeclaration") {

            node.left.declarations.push({
                type: "VariableDeclarator",
                init: null,
                id: {
                    type: "Identifier",
                    name: "__v",
                }
            });

            const forOfNode: ForOfStatement = {...node, type: "ForOfStatement", await: false};
            return this.ForOfStatement(forOfNode);
        }

        console.log(node)
        throw Error("The following for ... of loop cannot be converted");
    },

    BreakStatement: function* (node: BreakStatement) {
        yield "break";
    },

    ContinueStatement: function* (node: ContinueStatement) {
        yield "continue";
    },

    VariableDeclaration: function* (node: VariableDeclaration) {

        const kind = node.kind;
        const nutKind = kind == "const" ? kind : "local";

        for (let i = 0; i < node.declarations.length; i++) {

            if (i > 0) {
                yield "\n";
            }

            const decl = node.declarations[i];
            // yield nutKind;
            yield "local ";
            yield translate(decl.id);

            if (decl.init) {
                yield ' = ';
                yield translate(decl.init);
            }
        }
    },

    AssignmentExpression: function* (node: AssignmentExpression) {
        yield translate(node.left);
        yield " ";
        yield node.operator;
        yield " ";
        yield translate(node.right);
    },

    ArrayExpression: function* (node: ArrayExpression) {

        yield "[";
        for (let i = 0; i < node.elements.length; i++) {

            const el = node.elements[i];
            if (!el)
                continue;

            if (i > 0)
                yield ", ";

            yield translate(el);
        }
        yield "]";
    },

    BinaryExpression: function* (node: BinaryExpression) {

        if (node.operator == "===") {
            // Squirrel doesn't support triple equal signs.
            node.operator = "==";
        }

        yield "(";
        yield translate(node.left);
        yield " ";
        yield node.operator;
        yield " ";
        yield translate(node.right);
        yield ")";
    },

    UnaryExpression: function* (node: UnaryExpression) {
        yield node.operator;
        yield translate(node.argument);
    },

    UpdateExpression: function* (node: UpdateExpression) {
        if (node.prefix)
            yield node.operator;

        yield translate(node.argument);

        if (!node.prefix)
            yield node.operator;
    },

    NewExpression: function* (node: NewExpression) {
        yield* nodeTranslators["CallExpression"](node);
    },

    CallExpression: function* (node: CallExpression) {
        yield translate(node.callee);
        yield "(";
        for (let i = 0; i < node.arguments.length; i++) {
            const arg = node.arguments[i];
            if (i > 0) {
                yield ", ";
            }

            yield translate(arg);
        }
        yield ")";
    },

    MemberExpression: function* (node: MemberExpression) {
        yield translate(node.object);

        if (node.computed) {
            yield "[";
            yield translate(node.property);
            yield "]";
            return;
        }

        yield ".";
        yield translate(node.property);
    },

    ImportDeclaration: function* (node: ImportDeclaration) {
        // If we include vjscript, this is to get native squirrel functions.
        // No need to actually import that.
        if (node.source.type == "Literal") {
            if (node.source.value == "vjscript")
                return;
        }
    }
};

function translate(node: BaseNode): string {

    const fn = nodeTranslators[node.type];
    if (!fn) {
        console.log(node);
        throw Error(`Node ${node.type} is not supported!`);
    }

    let fragments = [...fn.call(nodeTranslators, node)];
    fragments = fragments.filter(x => !!x);
    return fragments.join("");
}
