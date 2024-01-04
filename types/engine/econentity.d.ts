//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CBaseAnimating} from './baseanimating';

/**
 * Script handle class for economic exquisite equippables, meaning hats and weapons.
 */
export interface CEconEntity extends CBaseAnimating {
    /**
     * Add an attribute to the entity. Set duration to -1 for the attribute to be applied forever.
     * @param name
     * @param value
     * @param duration
     */
    AddAttribute(name: string, value: number, duration: number): void;

    /**
     * Remove an attribute from the entity.
     * @param name
     */
    RemoveAttribute(name: string): void;

    /**
     * Relinks attributes to provisioners, e.g. calling this on a weapon will add it's attributes to the player.
     */
    ReapplyProvision(): void;
}
