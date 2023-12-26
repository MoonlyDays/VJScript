//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    class CBaseCombatCharacter extends CBaseFlex {
        /**
         * Return the last nav area occupied, NULL if unknown.
         */
        public GetLastKnownArea(): unknown;
    }
}