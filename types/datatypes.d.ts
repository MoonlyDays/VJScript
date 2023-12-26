//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    type NutTablePrimitive = number | string | boolean | unknown;
    type NutTableValue = NutTablePrimitive | NutTablePrimitive[] | NutTable;
    type NutTable = { [key: string]: NutTableValue };

    class Vector {
        x: number;
        y: number;
        z: number;

        constructor(x: number, y: number, z: number);
    }

    class QAngle {
        x: number;
        y: number;
        z: number;

        constructor(x: number, y: number, z: number);
    }
}