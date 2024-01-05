//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Node} from 'estree';
import {NodePath, traverse} from 'estree-toolkit';

import {Module} from './module';
import ArrowFunctionExpression from './nodes/ArrowFunctionExpression';
import AssignmentExpression from './nodes/AssignmentExpression';
import AssignmentPattern from './nodes/AssignmentPattern';
import BinaryExpression from './nodes/BinaryExpression';
import BlockStatement from './nodes/BlockStatement';
import CallExpression from './nodes/CallExpression';
import ClassBody from './nodes/ClassBody';
import ClassDeclaration from './nodes/ClassDeclaration';
import ExpressionStatement from './nodes/ExpressionStatement';
import ForInStatement from './nodes/ForInStatement';
import ForOfStatement from './nodes/ForOfStatement';
import FunctionDeclaration from './nodes/FunctionDeclaration';
import FunctionExpression from './nodes/FunctionExpression';
import Identifier from './nodes/Identifier';
import IfStatement from './nodes/IfStatement';
import ImportDefaultSpecifier from './nodes/ImportDefaultSpecifier';
import Literal from './nodes/Literal';
import LogicalExpression from './nodes/LogicalExpression';
import MemberExpression from './nodes/MemberExpression';
import MethodDefinition from './nodes/MethodDefinition';
import NewExpression from './nodes/NewExpression';
import {NodeHandler, TraverseState} from './nodes/NodeHandler';
import Program from './nodes/Program';
import PropertyDefinition from './nodes/PropertyDefinition';
import RestElement from './nodes/RestElement';
import SequenceExpression from './nodes/SequenceExpression';
import Super from './nodes/Super';
import ThisExpression from './nodes/ThisExpression';
import ThrowStatement from './nodes/ThrowStatement';
import UnaryExpression from './nodes/UnaryExpression';
import UpdateExpression from './nodes/UpdateExpression';
import VariableDeclaration from './nodes/VariableDeclaration';
import VariableDeclarator from './nodes/VariableDeclarator';

const NodeHandlerMap = {
    ArrowFunctionExpression: ArrowFunctionExpression,
    AssignmentExpression: AssignmentExpression,
    AssignmentPattern: AssignmentPattern,
    BinaryExpression: BinaryExpression,
    BlockStatement: BlockStatement,
    CallExpression: CallExpression,
    ClassBody: ClassBody,
    ClassDeclaration: ClassDeclaration,
    ExpressionStatement: ExpressionStatement,
    ForInStatement: ForInStatement,
    ForOfStatement: ForOfStatement,
    FunctionDeclaration: FunctionDeclaration,
    FunctionExpression: FunctionExpression,
    UpdateExpression: UpdateExpression,
    ThrowStatement: ThrowStatement,
    Identifier: Identifier,
    IfStatement: IfStatement,
    ImportDefaultSpecifier: ImportDefaultSpecifier,
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
    UnaryExpression: UnaryExpression,
    VariableDeclaration: VariableDeclaration,
    VariableDeclarator: VariableDeclarator
};

const nodeHandleInstances = new Map<string, NodeHandler<never>>();

function handler<T extends Node>(node: T): NodeHandler<T> {
    const type = node.type;
    let handler = nodeHandleInstances.get(type);
    if (handler) {
        return handler;
    }

    const handlerType = NodeHandlerMap[type];
    if (!handlerType) {
        throw Error(`handler: Handler for ${node.type} does not exist!`);
    }

    handler = new handlerType();
    nodeHandleInstances.set(type, handler);
    return handler;
}


export function generate(node: Node) {

    let fragments = [...handler(node).handleGenerate(node)];
    fragments = fragments.filter(x => !!x);
    return fragments.join('');
}

export function prepare(node: Node, module?: Module) {

    const generated = Object.keys(NodeHandlerMap);
    traverse(node, {
        $: {scope: true},
        [generated.join('|')]: (path: NodePath<Node>, state: TraverseState) => {
            handler(path.node).handlePrepare(path, state);
        }
    }, {
        module: module
    });

}