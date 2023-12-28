//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Identifier, Program} from 'estree';
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

        const programPath = path.findParent<Program>(is.program);
        if (!programPath) {
            throw Error('Program path not found for declaration?');
        }

        let desiredDeclareIdent = `__js_${rule.pattern.items.join('_')}`;
        desiredDeclareIdent = desiredDeclareIdent.replace(/[0-9]/g, '');
        desiredDeclareIdent = desiredDeclareIdent.toLowerCase();
        let declareIdentPath: NodePath<Identifier>;

        traverse(declProgram, {
            $: {scope: true},

            ArrowFunctionExpression: path => {
                const node = path.node;
                const body = is.blockStatement(node.body) ? node.body : b.blockStatement([b.returnStatement(node.body)]);
                const ident = programPath.scope.generateUidIdentifier(desiredDeclareIdent);
                path.replaceWith(b.functionDeclaration(ident, node.params, body));
            },

            FunctionDeclaration: path => {
                declareIdentPath = path.get('id');
                programPath.unshiftContainer('body', [path.node]);
                programPath.scope.crawl();
            },

            Literal: path => {
                if (is.expressionStatement(path.parent)) {
                    const ident = programPath.scope.generateUidIdentifier(desiredDeclareIdent);
                    path.parentPath.replaceWith(b.variableDeclaration('const', [b.variableDeclarator(ident, path.cloneNode())]));
                }
            },

            VariableDeclaration: path => {
                programPath.unshiftContainer('body', [path.node]);
                programPath.scope.crawl();
            },

            VariableDeclarator: path => {
                const id = path.get('id');
                if (is.identifier(id)) {
                    declareIdentPath = id;
                }
            }
        });

        if (!declareIdentPath) {
            console.log(declProgram.body[0]);
            throw Error('Could not extract an identifier from the declaration.');
        }

        declaration = {Program: declProgram, Identifier: declareIdentPath.node};
        g_kExtraDeclarations.set(encodedPattern, declaration);
    }

    path.replaceWith(declaration.Identifier);
};
