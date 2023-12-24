//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {
    ArrayExpression, ArrowFunctionExpression, AssignmentExpression,
    AwaitExpression, BinaryExpression,
    BlockStatement, BreakStatement, CallExpression,
    CatchClause, ChainExpression, ClassBody,
    ClassDeclaration, ClassExpression, ConditionalExpression,
    ContinueStatement, DebuggerStatement, DoWhileStatement,
    EmptyStatement, ExportAllDeclaration, ExportDefaultDeclaration,
    ExportNamedDeclaration, ExportSpecifier, ExpressionStatement,
    ForInStatement, ForOfStatement, ForStatement,
    FunctionDeclaration, FunctionExpression, Identifier,
    IfStatement, ImportDeclaration, ImportDefaultSpecifier,
    ImportExpression, ImportNamespaceSpecifier, ImportSpecifier,
    LabeledStatement, Literal, LogicalExpression,
    MemberExpression, MetaProperty, MethodDefinition,
    NewExpression, ObjectExpression, Pattern,
    PrivateIdentifier, Program, Property,
    PropertyDefinition, ReturnStatement, SequenceExpression,
    SpreadElement, StaticBlock, Super,
    SwitchCase, SwitchStatement, TaggedTemplateExpression,
    TemplateElement, TemplateLiteral, ThisExpression,
    ThrowStatement, TryStatement, UnaryExpression,
    UpdateExpression, VariableDeclaration, VariableDeclarator,
    WhileStatement, WithStatement, YieldExpression
} from 'esprima-next';

export type ESTreeNode = ESTreeNodeMap[keyof ESTreeNodeMap];

export type ESTreeNodeMap = {
    // AssignmentProperty: AssignmentProperty;
    CatchClause: CatchClause;
    ClassDeclaration: ClassDeclaration;
    ClassExpression: ClassExpression;
    ClassBody: ClassBody;

    // Expression: Expression;
    ArrayExpression: ArrayExpression;
    AssignmentExpression: AssignmentExpression;
    AwaitExpression: AwaitExpression;
    BinaryExpression: BinaryExpression;
    CallExpression: CallExpression;
    ChainExpression: ChainExpression;
    ConditionalExpression: ConditionalExpression;
    ImportExpression: ImportExpression;
    LogicalExpression: LogicalExpression;
    MemberExpression: MemberExpression;
    MetaProperty: MetaProperty;
    NewExpression: NewExpression;
    ObjectExpression: ObjectExpression;
    SequenceExpression: SequenceExpression;
    TaggedTemplateExpression: TaggedTemplateExpression;
    TemplateLiteral: TemplateLiteral;
    ThisExpression: ThisExpression;
    UnaryExpression: UnaryExpression;
    UpdateExpression: UpdateExpression;
    YieldExpression: YieldExpression;

    // Function: Function;
    FunctionDeclaration: FunctionDeclaration;
    FunctionExpression: FunctionExpression;
    ArrowFunctionExpression: ArrowFunctionExpression;

    Identifier: Identifier;
    Literal: Literal;
    MethodDefinition: MethodDefinition;

    // ModuleDeclaration: ModuleDeclaration;
    ImportDeclaration: ImportDeclaration;
    ExportNamedDeclaration: ExportNamedDeclaration;
    ExportDefaultDeclaration: ExportDefaultDeclaration;
    ExportAllDeclaration: ExportAllDeclaration;

    // ModuleSpecifier: ModuleSpecifier;
    ImportSpecifier: ImportSpecifier;
    ImportDefaultSpecifier: ImportDefaultSpecifier;
    ImportNamespaceSpecifier: ImportNamespaceSpecifier;
    ExportSpecifier: ExportSpecifier;

    Pattern: Pattern;
    PrivateIdentifier: PrivateIdentifier;
    Program: Program;
    Property: Property;
    PropertyDefinition: PropertyDefinition;
    SpreadElement: SpreadElement;

    // Statement: Statement;
    ExpressionStatement: ExpressionStatement;
    BlockStatement: BlockStatement;
    StaticBlock: StaticBlock;
    EmptyStatement: EmptyStatement;
    DebuggerStatement: DebuggerStatement;
    WithStatement: WithStatement;
    ReturnStatement: ReturnStatement;
    LabeledStatement: LabeledStatement;
    BreakStatement: BreakStatement;
    ContinueStatement: ContinueStatement;
    IfStatement: IfStatement;
    SwitchStatement: SwitchStatement;
    ThrowStatement: ThrowStatement;
    TryStatement: TryStatement;
    WhileStatement: WhileStatement;
    DoWhileStatement: DoWhileStatement;
    ForStatement: ForStatement;
    ForInStatement: ForInStatement;
    ForOfStatement: ForOfStatement;

    Super: Super;
    SwitchCase: SwitchCase;
    TemplateElement: TemplateElement;
    VariableDeclaration: VariableDeclaration;
    VariableDeclarator: VariableDeclarator;
};