//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

/**
 * Identifiers with this prefix are treated as "global" and will be declared in root scope.
 * This is a powerful modifier, so it should be avoided.
 */
export const IDENTIFIER_MODIFIER_GLOBAL = '__global_';
/**
 * This prefix indicates that a given identifier was polyfilled by the compiler.
 */
export const IDENTIFIER_MODIFIER_POLYFILLED = '__js_';

export const IDENTIFIER_DEFAULT_EXPORT = 'default';