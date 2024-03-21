//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Program, Statement} from 'estree';

import {NodeHandler, TraverseState} from './NodeHandler';
import {GeneratorHelpers} from "../helpers/GeneratorHelpers";
import {is, NodePath} from "estree-toolkit";
import {LookupHelpers} from "../helpers/LookupHelpers";

export default class extends NodeHandler<Program> {

    handlePrepare(path: NodePath<Program>, state: TraverseState) {
        const body = path.get("body");
        let length = body.length;

        for (let i = 0; i < length; i++) {
            const stmt = body[i] as NodePath<Statement>;
            if (!is.expressionStatement(stmt))
                continue;

            const expr = stmt.get("expression");
            if (!is.assignmentExpression(expr))
                continue;

            const deepest = LookupHelpers.deepestIdentifier(expr.get("left")) as NodePath;
            if (!is.identifier(deepest))
                continue;

            const deepestNode = deepest.node;
            if (deepestNode.name != "exports")
                continue;

            stmt.remove();
            length--;
            i--;
            path.pushContainer("body", [stmt.cloneNode()]);
        }

    }

    handleCodeGen(node: Program): Generator<string, void, unknown> {
        return GeneratorHelpers.body(node);
    }
}