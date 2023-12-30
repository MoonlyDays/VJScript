//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, Node, Program, Statement} from 'estree';
import {builders as b, is, NodePath, traverse} from 'estree-toolkit';
import {ESTree, parseScript} from 'meriyah';

import {IdentifierRenameList, RenameRuleAlias, RenameRuleDeclare} from './config';
import {MeriyahParseOptions} from './helpers';
import {IdentifierPattern} from './identifier';

export interface ExtraDeclaration {
    Program: ESTree.Program;
    Identifier: Identifier;
}

const g_kExtraDeclarations = new Map<string, ExtraDeclaration>();

export function renameNode(path: NodePath) {

    const rule = IdentifierRenameList.find(path);
    if (!rule)
        return;

    const nodePattern = IdentifierPattern.fromPath(path);
    if (nodePattern.hasBinding(path))
        return;

    // Given rule is a declaration.
    if ('declaration' in rule) {
        createDeclaration(path, rule);
        return;
    }

    renameDeclaration(path, rule);
}

const renameDeclaration = (path: NodePath, rule: RenameRuleAlias) => {
    const match = rule.pattern.match(path);

    const renamedPattern = new IdentifierPattern();
    for (const item of rule.rename.items) {

        if (typeof item == 'string' && item.startsWith('$')) {
            const idx = Number(item.slice(1));
            renamedPattern.push(...match[idx]);
            continue;
        }

        renamedPattern.push(item);
    }

    const node = renamedPattern.codeGenerate();
    path.replaceWith(node);
};

const createDeclaration = (path: NodePath, rule: RenameRuleDeclare) => {
    const encodedPattern = rule.pattern.toString();
    let declaration = g_kExtraDeclarations.get(encodedPattern);

    if (!declaration) {
        const declCode = rule.declaration;
        const declProgram = parseScript(declCode, MeriyahParseOptions);
        const declBody = declProgram.body;
        if (declBody.length > 1) {
            throw Error('More than one declaration is not allowed in Declare config.');
        }

        let desiredDeclareIdent = `__js_${rule.pattern.items.join('_')}`;
        desiredDeclareIdent = desiredDeclareIdent.replace(/[0-9]/g, '');

        const declare = declBody[0] as Statement;
        const normalDeclare = normalizeDeclarationNode(declare, path, desiredDeclareIdent);
        const declareIdent = extractDeclarationIdent(normalDeclare);

        if (!declareIdent) {
            throw Error('Could not extract an identifier from the declaration.');
        }

        declaration = {Program: declProgram, Identifier: declareIdent};
        g_kExtraDeclarations.set(encodedPattern, declaration);
    }

    path.replaceWith(declaration.Identifier);
};

function extractDeclarationIdent(node: Node) {

    if (is.variableDeclaration(node)) {
        const decl = node.declarations[0];
        const id = decl.id;
        if (is.identifier(id))
            return id;
    }

    if (is.functionDeclaration(node)) {
        return node.id;
    }
}

function normalizeDeclarationNode(node: Node, path: NodePath, desiredDeclareIdent: string) {

    if (is.expressionStatement(node)) {
        const expr = node.expression;
        return normalizeDeclarationNode(expr, path, desiredDeclareIdent);
    }

    if (is.arrowFunctionExpression(node)) {
        const body = is.blockStatement(node.body) ? node.body : b.blockStatement([b.returnStatement(node.body)]);
        const ident = path.scope.generateUidIdentifier(desiredDeclareIdent);
        const decl = b.functionDeclaration(ident, node.params, body);
        return normalizeDeclarationNode(decl, path, desiredDeclareIdent);
    }

    if (is.functionDeclaration(node)) {
        const programPath = path.scope.getProgramScope().path as NodePath<Program>;
        programPath.unshiftContainer('body', [node]);
        return node;
    }

    if (is.literal(node)) {
        if (is.expressionStatement(path.parent)) {
            const ident = path.scope.generateUidIdentifier(desiredDeclareIdent);
            const expr = b.variableDeclaration(
                'const',
                [b.variableDeclarator(ident, node)]
            );

            return normalizeDeclarationNode(expr, path, desiredDeclareIdent);
        }
    }

    if (is.variableDeclaration(node)) {
        const programPath = path.scope.getProgramScope().path as NodePath<Program>;
        programPath.unshiftContainer('body', [node]);
        return node;
    }
}
