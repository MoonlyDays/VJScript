import {Function as FunctionNode, Node} from 'estree';
import {is} from 'estree-toolkit';

import {generateCode} from '../handler';

/**
 * Generate code for a normal function.
 * @param node
 */
export function* generateFunctionCode(node: FunctionNode) {
    yield 'function';

    // Check if there is an identifier.
    if ('id' in node && node.id) {
        yield ' ';
        yield generateCode(node.id);
    }

    yield ' (';
    yield node.params.map(x => generateCode(x)).join(', ');
    yield ') ';

    yield generateCode(node.body);
}

/**
 * Generate code for a binary operator.
 * @param node
 */
export function* generateBinaryOperatorExpressionCode(node: { operator: string, left: Node, right: Node }) {
    yield generateCode(node.left);
    yield ' ';
    yield node.operator;
    yield ' ';
    yield generateCode(node.right);
}

let _ScopeDepth = 0;

/**
 * Wrap generator function inside an inner scope.
 * @param generator
 */
export function* generateCodeWithScope(generator: () => Generator<string, void, unknown>) {

    // Check the generator is empty, without actually
    // iterating over it.
    if (generator().next().done) {
        yield '{}';
        return;
    }

    _ScopeDepth++;
    yield '{\n';
    yield* generator();
    yield '}';
    _ScopeDepth--;
}

/**
 * Generate body of the node.
 * @param node
 */
export function* generateBodyCode(node: { body: Node[] }) {
    for (const element of node.body) {
        let code = generateCode(element);

        if (_ScopeDepth > 0) {
            code = code.split('\n').map(x => '    ' + x).join('\n');
        }

        yield code;
        if (is.statement(element))
            yield ';';

        yield '\n';
    }
}

/**
 * Generate a list of arguments.
 * @param args
 */
export function* generateArgumentsCode(args: Node[]) {
    yield args.map(x => generateCode(x)).join(', ');
}
