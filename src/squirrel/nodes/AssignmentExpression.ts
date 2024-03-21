//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {AssignmentExpression, AssignmentOperator, ClassBody, Pattern} from 'estree';
import {builders as b, is, NodePath} from 'estree-toolkit';

import {ClassHelpers} from '../helpers/ClassHelpers';
import {GeneratorHelpers} from '../helpers/GeneratorHelpers';
import {LookupHelpers} from '../helpers/LookupHelpers';
import {PatternHelpers} from '../helpers/PatternHelpers';
import {NodeHandler} from './NodeHandler';

export default class extends NodeHandler<AssignmentExpression> {

    handlePrepare(path: NodePath<AssignmentExpression>) {

        const node = path.node;
        if (is.arrayPattern(node.left)) {
            PatternHelpers.destructureArray(
                node.left, node.right, path,
                (k, v) =>
                    b.assignmentExpression(node.operator, k, v)
            );
            return;
        }

        if (is.objectPattern(node.left)) {
            PatternHelpers.destructureObject(
                node.left, node.right, path,
                (k, v) =>
                    b.assignmentExpression(node.operator, k, v));
            return;
        }

        // Handle nullish coalescing assignment operator.
        if (node.operator == '??=') {
            if (is.expression(node.left)) {
                // Replace it with another assignment expression inside a null checking if block.
                path.replaceWith(b.ifStatement(
                    b.binaryExpression('==', node.left, b.literal(null)),
                    b.expressionStatement(b.assignmentExpression('=', node.left, node.right))
                ));
                return;
            }

            throw Error('AssignmentExpression: left side of the nullish coalescing assignment operator is not an expression?');
        }

        if (this.shouldUseSlotOperator(path)) {
            // Hack to change the operator to Squirrel slot creation operator "<-" so that typescript
            // doesn't scream at us about an invalid operator.
            (node.operator as AssignmentOperator | '<-') = '<-';
        }

        this.handleClassPropertyAssignment(path);
    }

    handleCodeGen(node: AssignmentExpression): Generator<string, void, unknown> {
        return GeneratorHelpers.binaryOperatorExpression(node);
    }


    /**
     * If we assign to some property of a class, make sure that class if actually declared.
     * @param path
     */
    handleClassPropertyAssignment(path: NodePath<AssignmentExpression>) {

        // Special case for assigning value to a class field.
        const classBodyPath = path.findParent<ClassBody>(is.classBody);
        if (!classBodyPath)
            return;

        const leftPath = path.get('left');
        const deepestMemberExpr = LookupHelpers.deepestMemberExpression(leftPath);
        if (!is.memberExpression(deepestMemberExpr))
            return;

        const objectPath = deepestMemberExpr.get('object');
        const propPath = deepestMemberExpr.get('property');

        if (is.thisExpression(objectPath) && is.identifier(propPath)) {
            ClassHelpers.ensurePropertyDefinition(classBodyPath, propPath.node.name);
        }
    }

    /**
     * Determine if we should use a slot operator for the given assignment expression.
     * @param path
     */
    shouldUseSlotOperator(path: NodePath<AssignmentExpression>) {

        // If we assign to a previously declared identifier, we don't need to use the slot operator.
        const leftPath = path.get('left') as NodePath<Pattern>;
        if (is.identifier(leftPath)) {
            if (leftPath.scope.hasBinding(leftPath.node.name)) {
                return false;
            }
        }

        // If an object is "this" keyword, and property is some sort of identifier,
        // and we're inside a class body, we can't use slot operator.
        const classBody = path.findParent<ClassBody>(is.classBody);
        if (classBody) {

            // Find the deepest member expression.
            if (is.memberExpression(leftPath)) {

                const object = leftPath.get('object');
                const prop = leftPath.get('property');

                if (is.thisExpression(object) && is.identifier(prop)) {
                    return false;
                }
            }
        }

        return true;
    }


}
