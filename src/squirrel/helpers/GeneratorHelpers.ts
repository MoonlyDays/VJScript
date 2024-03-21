import {Function as FunctionNode, Node} from "estree";
import {codeGen} from "../handler";
import {is} from "estree-toolkit";

export const GeneratorHelpers = {

    /**
     * Generate code for a normal function.
     * @param node
     */
    * function(node: FunctionNode) {
        yield 'function';

        // Check if there is an identifier.
        if ('id' in node && node.id) {
            yield ' ';
            yield codeGen(node.id);
        }

        yield ' (';
        yield node.params.map(x => codeGen(x)).join(', ');
        yield ') ';

        yield codeGen(node.body);
    },

    /**
     * Generate code for a binary operator.
     * @param node
     */
    * binaryOperatorExpression(node: { operator: string, left: Node, right: Node }) {
        yield codeGen(node.left);
        yield ' ';
        yield node.operator;
        yield ' ';
        yield codeGen(node.right);
    },

    _scopeDepth: 0,

    /**
     * Wrap generator function inside an inner scope.
     * @param generator
     */
    * withScope(generator: () => Generator<string, void, unknown>) {

        // Check the generator is empty, without actually
        // iterating over it.
        if (generator().next().done) {
            yield '{}';
            return;
        }

        this._scopeDepth++;
        yield '{\n';
        yield* generator();
        yield '}';
        this._scopeDepth--;
    },

    /**
     * Generate body of the node.
     * @param node
     */
    * body(node: { body: Node[] }) {
        for (const element of node.body) {
            let code = codeGen(element);

            if (this._scopeDepth > 0) {
                code = code.split('\n').map(x => '    ' + x).join('\n');
            }

            yield code;
            if (is.statement(element))
                yield ';';

            yield '\n';
        }
    },

    /**
     * Generate a list of arguments.
     * @param args
     */
    * arguments(args: Node[]) {
        yield args.map(x => codeGen(x)).join(', ');
    }
}