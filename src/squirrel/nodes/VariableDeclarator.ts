//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, Literal, VariableDeclarator} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {generate} from '../handler';
import {isRequireCallExpression} from '../helpers/identify';
import {replaceArrayPattern,replaceObjectPattern} from '../helpers/patterns';
import {deepestIdentifier} from '../identifier';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<VariableDeclarator> {

    handlePrepare(path: NodePath<VariableDeclarator>) {
        const node = path.node;

        const id = node.id;
        if (is.arrayPattern(id)) {
            replaceArrayPattern(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }

        if (is.objectPattern(id)) {
            replaceObjectPattern(
                id, node.init, path,
                (k, v) => b.variableDeclarator(k, v),
                path.parentPath
            );
            return;
        }

        handleRequireCallExpression(path);
    }

    * handleGenerate(node: VariableDeclarator): Generator<string, void, unknown> {
        yield generate(node.id);
        if (node.init) {
            yield ' = ';
            yield generate(node.init);
        }
    }
}

function handleRequireCallExpression(path: NodePath<VariableDeclarator>) {

    const initPath = deepestIdentifier(path.get('init'));
    if (!isRequireCallExpression(initPath))
        return;

    const node = path.node;
    const parentPath = path.parentPath;
    if (!is.variableDeclaration(parentPath)) {
        throw Error('VariableDeclarator: not inside a Declaration?');
    }

    if (parentPath.node.declarations.length > 1) {
        throw Error('VariableDeclarator: Declaration with a require call should\'ve been split up.');
    }

    const id = node.id;
    const init = initPath.node;

    // get the source.
    const source = init.arguments[0] as Literal;

    if (is.identifier(id)) {
        const a = parentPath.replaceWith(b.importDeclaration([
            b.importNamespaceSpecifier(id)
        ], source));
    }
}