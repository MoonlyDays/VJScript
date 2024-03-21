//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {BlockStatement, ClassBody, PropertyDefinition} from 'estree';
import {is, NodePath} from 'estree-toolkit';
import {builders as b} from 'estree-toolkit';

import {generateCode} from '../handler';
import {getConstructorDefinition, hasPropertyDefinitionValue} from '../helpers/class';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<PropertyDefinition> {

    handlePrepare(path: NodePath<PropertyDefinition>) {
        const node = path.node;
        const key = node.key;

        if (!is.identifier(key)) {
            throw Error(`PropertyDefinition: Unhandled key type ${key.type}!`);
        }

        // If this property definition has some sort of value, it must be declared in the constructor.
        if (hasPropertyDefinitionValue(node)) {

            const classBody = path.findParent<ClassBody>(is.classBody);
            if (!classBody) {
                throw Error('PropertyDefinition: Is not contained inside a Class Body?');
            }

            const ctor = getConstructorDefinition(classBody);
            if (!ctor) {
                throw Error('PropertyDefinition: Containing Class Body without a Constructor?');
            }

            const assignment = b.assignmentExpression(
                '=',
                b.memberExpression(b.thisExpression(), node.key),
                node.value
            );

            const value = ctor.get('value');
            const body = value.get('body') as NodePath<BlockStatement>;
            body.unshiftContainer('body', [b.expressionStatement(assignment)]);
        }

        node.value = b.literal(null);
    }

    * handleCodeGen(node: PropertyDefinition): Generator<string, void, unknown> {
        if (node.static) {
            yield 'static ';
        }

        yield generateCode(node.key);

        if (node.value) {
            yield ' = ';
            yield generateCode(node.value);
        }
    }
}
