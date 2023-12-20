import {Program, Syntax} from "esprima";
import * as estree from "estree";

type ESNodeType = keyof typeof Syntax;
type ESNodeMap = { [key in ESNodeType]: typeof estree["ArrayExpression"]; }
type ESNode = ESNodeMap[keyof ESNodeMap];

type ESNodeTranspiler<T extends ESNode> = (node: T) => string;
type ESNodeTranspilerMap = Map<ESNodeType, ESNodeTranspiler<ESNode>>;

export class JSToSquirrel {
    private syntax: ESNodeTranspilerMap = new Map();

    constructor() {
        this.addSyntax("VariableDeclaration", node => {
            console.log(node);
        })
    }

    protected addSyntax<K extends keyof ESNodeMap>(type: K, transpiler: ESNodeTranspiler<ESNodeMap[K]>) {
        this.syntax.set(type, transpiler);
    }

    protected transpileSyntax(node: ESNode): string {
        const type = node.type;
        const transpiler = this.syntax.get(type);
        if (!transpiler) {
            console.error(`Unsupported syntax ${type}. Cannot transpile to Squirrel.`);
            return;
        }

        return transpiler(node);
    }

    public transpile(program: Program) {
        return this.transpileSyntax(program);
    }
}