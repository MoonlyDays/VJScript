//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CBaseFlex} from './baseflex';

/**
 * Script handle class for non-playable combat characters operating under the NextBot system.
 */
export interface CBaseCombatCharacter extends CBaseFlex {
    /**
     * Return the last nav area occupied, NULL if unknown.
     */
    GetLastKnownArea(): unknown;
}