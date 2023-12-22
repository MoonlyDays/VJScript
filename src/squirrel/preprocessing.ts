import {Program, Syntax} from "esprima";
import {BaseNode, Identifier, MemberExpression} from "estree";
import {isNodeOfType} from "./shared";

type FlattenIdentifierPath = string | string[];
type RenameSyntaxNode = Identifier | MemberExpression;
type RenameRule = [FlattenIdentifierPath, FlattenIdentifierPath];
type RenameMap = RenameRule[];

/**
 * List of JavaScript identifier patterns, which should be renamed
 * to keep parity with Squirrel
 */
const RenameMap: RenameMap = [
    [[null, "toString"], [null, "tostring"]],
    [["console", "log"], "printl"],
    [["Math", "PI"], "PI"],

    [["Math", "abs"], "fabs"],
    [["Math", "acos"], "acos"],
    // acosh: "acosh",
    [["Math", "asin"], "asin"],
    // asinh: "asinh",
    [["Math", "atan"], "atan"],
    [["Math", "atan2"], "atan2"],
    // atanh: "atanh",
    // cbrt: "cbrt",
    [["Math", "ceil"], "ceil"],
    // clz32: "clz32",
    [["Math", "cos"], "cos"],
    // cosh: "cosh",
    [["Math", "exp"], "exp"],
    // expm1: "expm1",
    [["Math", "floor"], "floor"],
    // fround: "fround",
    // hypot: "hypot",
    // imul: "imul",
    [["Math", "log"], "log"],
    [["Math", "log10"], "log10"],
    // log1p: "log1p",
    // log2: "log2",
    // max: "max",
    // "min": "min"
    [["Math", "pow"], "pow"],
    // random: "random",
    // "round": "round",
    // sign: "sign",
    [["Math", "sin"], "sin"],
    // sinh: "sinh",
    [["Math", "sqrt"], "sqrt"],
    [["Math", "tan"], "tan"],
    // tanh: "tanh",
    // trunc: "trunc"
];


const PreprocessorMap = {
    Identifier: (ctx: NodeContext<Identifier>) => {
        tryRenameNode(ctx);
    },
    MemberExpression: (ctx: NodeContext<MemberExpression>) => {
        tryRenameNode(ctx);
    }
}

interface NodeContext<T extends BaseNode = BaseNode> {
    node: T;
    parent?: NodeContext
}

export const preprocess = (program: Program) => {
    preprocessRecursively({node: program});
}

const preprocessRecursively = (ctx: NodeContext) => {
    preprocessNode(ctx);

    const node = ctx.node;
    for (const k in node) {
        const v = node[k];
        if (!v) continue;

        if (typeof v == "object") {
            if ("type" in v) {
                node[k] = preprocessNodeWithContext(v, ctx);
                continue;
            }

            if (Array.isArray(v)) {
                for (const i in v) {
                    const v2 = v[i];
                    if (!v2) continue;
                    node[k][i] = preprocessNodeWithContext(v2, ctx);
                }
            }
        }
    }
}

const preprocessNodeWithContext = (node: BaseNode, parent: NodeContext) => {
    const ctx = {node, parent};
    preprocessRecursively(ctx);
    return ctx.node;
}

const preprocessNode = (ctx: NodeContext) => {
    const type = ctx.node.type;
    const fn = PreprocessorMap[type] || null;
    if (!fn) return;

    fn.call(PreprocessorMap, ctx);
}

//---------------------------------------------------------
// Identifier Renames
//---------------------------------------------------------
const tryRenameNode = (ctx: NodeContext<RenameSyntaxNode>): RenameSyntaxNode => {

    const node = ctx.node;
    const nodePath = getFlattedIdentifierPath(node);
    if (nodePath == false)
        return;

    const rule = findRenameRuleForPath(node, nodePath);
    if (!rule)
        return;

    const renamePath = typeof rule[1] == "string"
        ? [rule[1]]
        : rule[1];

    let prev: MemberExpression | Identifier;
    for (let i = 0; i < renamePath.length; i++) {

        const nodeItem = nodePath[i];
        const renameItem = renamePath[i];

        const item = renameItem || nodeItem;
        const ident: Identifier = {
            type: "Identifier",
            name: item
        };

        if (!prev) {
            prev = ident;
            continue;
        }
        prev = {
            type: "MemberExpression",
            computed: false,
            optional: false,
            object: prev,
            property: ident
        };
    }

    ctx.node = prev;
}

const findRenameRuleForPath = (node: RenameSyntaxNode, nodePath: FlattenIdentifierPath): RenameRule | undefined => {

    for (const rule of RenameMap) {

        // Get the pattern which we must compare.
        const pattern = typeof rule[0] == "string"
            ? [rule[0]]
            : rule[0];

        if (pattern.length != nodePath.length)
            continue;

        let ruleMatched = true;
        for (let i = 0; i < pattern.length; i++) {
            const patternItem = pattern[i];
            if (!patternItem)
                continue;

            if (patternItem != nodePath[i]) {
                ruleMatched = false;
                break;
            }
        }

        if (ruleMatched)
            return rule;
    }

    return;
}

const getFlattedIdentifierPath = (node: BaseNode): false | string[] => {

    if (isNodeOfType(node, "MemberExpression")) {
        // Member expression must not be computed,
        // for us to be able to generate identifier path.
        if (node.computed)
            return false;

        // Object must be an identifier for this to work.
        const object = node.object;
        if (object.type != "Identifier")
            return false;

        const property = node.property;
        const propPath = getFlattedIdentifierPath(property);
        // Can't generate the path of the property, then we
        // can't build the entire path.
        if (propPath === false)
            return false;

        return [object.name, ...propPath];
    }

    if (isNodeOfType(node, "Identifier")) {
        return [node.name];
    }

    return false;
}
