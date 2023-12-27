//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Script handle class for non-playable combat characters operating under the NextBot system.
     */
    interface CBaseCombatCharacter extends CBaseFlex {
        /**
         * Return the last nav area occupied, NULL if unknown.
         */
        GetLastKnownArea(): unknown;
    }
}