//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Node} from 'estree';
import {NodePath, traverse} from 'estree-toolkit';

import {Module} from './module';
import ArrayExpression from './nodes/ArrayExpression';
import ArrowFunctionExpression from './nodes/ArrowFunctionExpression';
import AssignmentExpression from './nodes/AssignmentExpression';
import AssignmentPattern from './nodes/AssignmentPattern';
import BinaryExpression from './nodes/BinaryExpression';
import BlockStatement from './nodes/BlockStatement';
import CallExpression from './nodes/CallExpression';
import ClassBody from './nodes/ClassBody';
import ClassDeclaration from './nodes/ClassDeclaration';
import ConditionalExpression from './nodes/ConditionalExpression';
import ExpressionStatement from './nodes/ExpressionStatement';
import ForInStatement from './nodes/ForInStatement';
import ForOfStatement from './nodes/ForOfStatement';
import ForStatement from './nodes/ForStatement';
import FunctionDeclaration from './nodes/FunctionDeclaration';
import FunctionExpression from './nodes/FunctionExpression';
import Identifier from './nodes/Identifier';
import IfStatement from './nodes/IfStatement';
import Literal from './nodes/Literal';
import LogicalExpression from './nodes/LogicalExpression';
import MemberExpression from './nodes/MemberExpression';
import MethodDefinition from './nodes/MethodDefinition';
import NewExpression from './nodes/NewExpression';
import {NodeHandler, TraverseState} from './nodes/NodeHandler';
import ObjectExpression from './nodes/ObjectExpression';
import Program from './nodes/Program';
import Property from './nodes/Property';
import PropertyDefinition from './nodes/PropertyDefinition';
import RestElement from './nodes/RestElement';
import ReturnStatement from './nodes/ReturnStatement';
import SequenceExpression from './nodes/SequenceExpression';
import Super from './nodes/Super';
import TemplateElement from './nodes/TemplateElement';
import TemplateLiteral from './nodes/TemplateLiteral';
import ThisExpression from './nodes/ThisExpression';
import ThrowStatement from './nodes/ThrowStatement';
import UnaryExpression from './nodes/UnaryExpression';
import UpdateExpression from './nodes/UpdateExpression';
import VariableDeclaration from './nodes/VariableDeclaration';
import VariableDeclarator from './nodes/VariableDeclarator';

const NodeHandlerMap = {
    ArrowFunctionExpression: ArrowFunctionExpression,
    ArrayExpression: ArrayExpression,
    AssignmentExpression: AssignmentExpression,
    AssignmentPattern: AssignmentPattern,
    BinaryExpression: BinaryExpression,
    BlockStatement: BlockStatement,
    CallExpression: CallExpression,
    ClassBody: ClassBody,
    ClassDeclaration: ClassDeclaration,
    ForStatement: ForStatement,
    ExpressionStatement: ExpressionStatement,
    ObjectExpression: ObjectExpression,
    Property: Property,
    ForInStatement: ForInStatement,
    ForOfStatement: ForOfStatement,
    ReturnStatement: ReturnStatement,
    ConditionalExpression: ConditionalExpression,
    FunctionDeclaration: FunctionDeclaration,
    FunctionExpression: FunctionExpression,
    UpdateExpression: UpdateExpression,
    ThrowStatement: ThrowStatement,
    Identifier: Identifier,
    IfStatement: IfStatement,
    Literal: Literal,
    LogicalExpression: LogicalExpression,
    MemberExpression: MemberExpression,
    MethodDefinition: MethodDefinition,
    NewExpression: NewExpression,
    Program: Program,
    PropertyDefinition: PropertyDefinition,
    RestElement: RestElement,
    SequenceExpression: SequenceExpression,
    Super: Super,
    ThisExpression: ThisExpression,
    TemplateLiteral: TemplateLiteral,
    TemplateElement: TemplateElement,
    UnaryExpression: UnaryExpression,
    VariableDeclaration: VariableDeclaration,
    VariableDeclarator: VariableDeclarator
};

const g_kNodeHandlerInstances = new Map<string, NodeHandler<never>>();

/**
 * Retrieve a handle for a provided node by its type.
 * @param node
 */
function handler<T extends Node>(node: T): NodeHandler<T> {
    const type = node.type;
    let handler = g_kNodeHandlerInstances.get(type);
    if (handler) {
        return handler;
    }

    const handlerType = NodeHandlerMap[type];
    if (!handlerType) {
        throw Error(`handler: Handler for ${node.type} does not exist!`);
    }

    handler = new handlerType();
    g_kNodeHandlerInstances.set(type, handler);
    return handler;
}

/**
 * Generate Squirrel code for the provided Node.
 * @param node
 */
export function generateCode(node: Node) {
    if (!node) {
        return '';
    }

    let fragments = [...handler(node).handleCodeGen(node)];
    fragments = fragments.filter(x => !!x);
    return fragments.join('');
}

const prepareVisitors = Object.keys(NodeHandlerMap)
    .reduce((a, v) => ({
        ...a,
        [v]: ((p: NodePath<Node>, s: TraverseState) => {

            // Make sure we don't traverse nodes which are in the branch of the removed node.
            if (p.find(x => x.removed)) {
                return;
            }

            handler(p.node).handlePrepare(p, s);
        })
    }), {});

/**
 * Prepare AST for being translated to Squirrel language.
 * @param node
 * @param module
 */
export function prepareSyntaxTree(node: Node, module?: Module) {
    // console.trace(`prepare on ${module.name}`);
    traverse(node, {
        $: {scope: true},
        ...prepareVisitors,
    }, {
        module: module,
        translator: module?.translator
    });
}