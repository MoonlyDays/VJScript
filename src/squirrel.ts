import * as path from "path";
import {Program} from "esprima";
import {
    ArrayExpression, AssignmentExpression, BaseNode,
    BinaryExpression, BlockStatement, BreakStatement,
    CallExpression, ConditionalExpression, ContinueStatement,
    ExpressionStatement, ForInStatement, ForOfStatement,
    ForStatement, FunctionDeclaration, FunctionExpression,
    Identifier, IfStatement, ImportDeclaration,
    Literal, LogicalExpression, MemberExpression,
    NewExpression, ObjectExpression, Property,
    TemplateLiteral, ThisExpression, UnaryExpression,
    UpdateExpression, VariableDeclaration, WhileStatement
} from "estree";

let currentScopeDepth = 0;
const nodeTranslators = {

    Identifier: function* (node: Identifier) {
        yield node.name;
    },

    Literal: function* (node: Literal) {
        yield JSON.stringify(node.value);
    },

    Property: function* (node: Property) {
        yield squirrel(node.key);
        yield " = ";
        yield squirrel(node.value);
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
                yield squirrel(expr);
            }
        }
    },

    BlockStatement: function* (node: BlockStatement, addBrackets = true) {

        if (addBrackets) {
            yield "{\n";
            currentScopeDepth++;
        }

        for (const element of node.body) {
            let code = squirrel(element);

            if (currentScopeDepth > 0) {
                code = code.split("\n").map(x => "  " + x).join("\n");
            }

            yield code;
            yield '\n';
        }

        if (addBrackets) {
            currentScopeDepth--;
            yield "}\n";
        }
    },

    Program: function (node: Program) {
        return this.BlockStatement(node, false);
    },

    ExpressionStatement: function* (node: ExpressionStatement) {
        // Directives are not added to the source code.
        if ("directive" in node) {
            return;
        }

        yield squirrel(node.expression);
    },

    IfStatement: function* (node: IfStatement) {

        yield "if (";
        yield squirrel(node.test);
        yield ")\n";
        yield squirrel(node.consequent);

        if (node.alternate) {
            yield "else\n";
            yield squirrel(node.alternate);
        }
    },

    WhileStatement: function* (node: WhileStatement) {
        yield "while ("
        yield squirrel(node.test);
        yield ") ";
        yield squirrel(node.body);
    },

    ForStatement: function* (node: ForStatement) {
        yield "for(";
        if (node.init) {
            yield squirrel(node.init);
        }

        yield ";";
        if (node.test) {
            yield squirrel(node.test);
        }

        yield ";";
        if (node.update) {
            yield squirrel(node.update);
        }

        yield ")\n";
        yield squirrel(node.body);
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
            yield squirrel(node.right);
            yield ")\n"

            yield squirrel(node.body);
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
            yield squirrel(decl.id);

            if (decl.init) {
                yield ' = ';
                yield squirrel(decl.init);
            }
        }
    },

    AssignmentExpression: function* (node: AssignmentExpression) {

        yield squirrel(node.left);

        if (node.left.type == "MemberExpression") {
            yield " <- ";
        } else {
            yield " = ";
        }

        yield squirrel(node.right);
    },

    ArrayExpression: function* (node: ArrayExpression) {

        yield "[";
        for (let i = 0; i < node.elements.length; i++) {

            const el = node.elements[i];
            if (!el)
                continue;

            if (i > 0)
                yield ", ";

            yield squirrel(el);
        }
        yield "]";
    },

    ObjectExpression: function* (node: ObjectExpression) {
        yield "{\n";
        for (let i = 0; i < node.properties.length; i++) {
            const prop = node.properties[i];
            yield "  ";
            yield squirrel(prop);
            yield ",\n";
        }
        yield "}";
    },

    BinaryExpression: function* (node: BinaryExpression) {

        if (node.operator == "===") {
            // Squirrel doesn't support triple equal signs.
            node.operator = "==";
        }

        yield "(";
        yield squirrel(node.left);
        yield " ";
        yield node.operator;
        yield " ";
        yield squirrel(node.right);
        yield ")";
    },

    FunctionExpression: function* (node: FunctionExpression) {
        yield "function ";

        if (node.id) {
            yield squirrel(node.id);
        }

        yield "(";
        yield node.params.map(x => squirrel(x)).join(", ");
        yield ") ";

        yield squirrel(node.body);
    },

    UnaryExpression: function* (node: UnaryExpression) {
        yield node.operator;
        yield squirrel(node.argument);
    },

    UpdateExpression: function* (node: UpdateExpression) {
        if (node.prefix)
            yield node.operator;

        yield squirrel(node.argument);

        if (!node.prefix)
            yield node.operator;
    },

    ConditionalExpression: function* (node: ConditionalExpression) {
        yield "(";
        yield squirrel(node.test);
        yield " ? ";
        yield squirrel(node.consequent);
        yield " : ";
        yield squirrel(node.alternate);
        yield ")";
    },

    LogicalExpression: function* (node: LogicalExpression) {
        yield "(";
        yield squirrel(node.left);
        yield " ";
        yield node.operator;
        yield " ";
        yield squirrel(node.right);
        yield ")";
    },

    NewExpression: function* (node: NewExpression) {
        yield* nodeTranslators["CallExpression"](node);
    },

    ThisExpression: function* (node: ThisExpression) {
        yield "this";
    },

    CallExpression: function* (node: CallExpression) {
        yield squirrel(node.callee);
        yield "(";
        for (let i = 0; i < node.arguments.length; i++) {
            const arg = node.arguments[i];
            if (i > 0) {
                yield ", ";
            }

            yield squirrel(arg);
        }
        yield ")";
    },

    MemberExpression: function* (node: MemberExpression) {

        yield squirrel(node.object);
        if (node.computed) {
            yield "[";
            yield squirrel(node.property);
            yield "]";
            return;
        }

        yield ".";
        yield squirrel(node.property);
    },

    ImportDeclaration: function* (node: ImportDeclaration) {
    },

    FunctionDeclaration: function* (node: FunctionDeclaration) {
        yield* this.FunctionExpression(node);
    }
};

export const toSquirrel = (scriptPath: string, node: Program) => {

    let code =
        '///----------------------------------------------------------------/\n' +
        '/// This code was automatically generated using VJScript.          /\n' +
        '/// VJScript is an automatic code translation tool from JavaScript /\n' +
        '/// to Squirrel.                                                   /\n' +
        '/// https://github.com/MoonlyDays/VJScript                         /\n' +
        '///----------------------------------------------------------------/\n' +
        '/// Source Script: ' + path.basename(scriptPath) + '\n' +
        '///----------------------------------------------------------------/\n\n';

    return code + squirrel(node);
}

function squirrel(node: BaseNode): string {

    const fn = nodeTranslators[node.type];
    if (!fn) {
        console.log(node);
        throw Error(`Node ${node.type} is not supported!`);
    }

    let fragments = [...fn.call(nodeTranslators, node)];
    fragments = fragments.filter(x => !!x);
    return fragments.join("");
}
