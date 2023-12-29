//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

interface BaseAttributes {
    Type: string;
    Attributes: { [key: string]: string[] };
}

export interface IdentifierAttributes extends BaseAttributes {
    Type: 'Identifier';
}

export interface FunctionAttributes extends BaseAttributes {
    Type: 'Function';
    Params: { [key: number]: IdentifierAttributes }
}

export type NodeAttributes =
    IdentifierAttributes |
    FunctionAttributes;