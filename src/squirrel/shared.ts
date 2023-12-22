import {BaseNode, BlockStatement, ExpressionMap, ModuleDeclaration, NodeMap, Statement} from "estree";
import {Syntax} from "esprima";

type SymbolRenameMapIdentifier = string | [string, string];
type SymbolRenameMembers = [string, SymbolRenameMapIdentifier][];
type SymbolRenameMap = {
    [key: string]: SymbolRenameMembers | SymbolRenameMapIdentifier;
}

export type ESTreeNodeMap = ExpressionMap & NodeMap;

export const isNodeOfType = <T extends keyof ESTreeNodeMap>(node: BaseNode, type: T): node is ESTreeNodeMap[T] => {
    return node.type == type;
}

/**
 * All identifier or member accessors that should be
 * renamed to their Squirrel counterparts.
 */
export const SymbolRenameMap: SymbolRenameMap = {

    // Debugging and printing utilities
    console: [
        ["log", "printf"]
    ],

    // Math related functions, replace
    // them with Squirrel counterpart.
    Math: [
        // ["E", "MATH_E"],
        // ["LN10", "MATH_LN10"],
        // ["LN2", "MATH_LN2"],
        // ["LOG10E", "MATH_LOG10E"],
        // ["LOG2E", "MATH_LOG2E"],
        ["PI", "PI"],
        // ["SQRT1_2", "MATH_SQRT1_2"],
        // ["SQRT2", "MATH_SQRT2"],

        ["PI", "PI"],
        ["abs", "fabs"],
        ["acos", "acos"],
        // acosh: "acosh",
        ["asin", "asin"],
        // asinh: "asinh",
        ["atan", "atan"],
        ["atan2", "atan2"],
        // atanh: "atanh",
        // cbrt: "cbrt",
        ["ceil", "ceil"],
        // clz32: "clz32",
        ["cos", "cos"],
        // cosh: "cosh",
        ["exp", "exp"],
        // expm1: "expm1",
        ["floor", "floor"],
        // fround: "fround",
        // hypot: "hypot",
        // imul: "imul",
        ["log", "log"],
        ["log10", "log10"],
        // log1p: "log1p",
        // log2: "log2",
        // max: "max",
        // "min": "min"
        ["pow", "pow"],
        // random: "random",
        // "round": "round",
        // sign: "sign",
        ["sin", "sin"],
        // sinh: "sinh",
        ["sqrt", "sqrt"],
        ["tan", "tan"],
        // tanh: "tanh",
        // trunc: "trunc"

    ],
    // Asterisk is a wildcard that can take form
    // of any object.
    "*": [
        ["toString", ["", "tostring"]]
    ]
};