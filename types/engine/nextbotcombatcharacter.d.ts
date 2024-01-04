//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CBaseCombatCharacter} from './basecombatcharacter';
import {CBaseEntity} from './baseentity';
import {INextBotComponent} from './nextbotcomponent';
import {ILocomotion} from './nextbotlocomotion';


/**
 * Script handle class for non-playable combat characters operating under the NextBot system.
 */
export interface NextBotCombatCharacter extends CBaseCombatCharacter {
    /**
     * Clear immobile status
     */
    ClearImmobileStatus(): void;

    /**
     * Flag this bot for update
     * @param toggle
     */
    FlagForUpdate(toggle: boolean): void;

    /**
     * Get this bot's body interface
     */
    GetBodyInterface(): INextBotComponent;

    /**
     * Get this bot's id
     */
    GetBotId(): number;

    /**
     * How long have we been immobile
     */
    GetImmobileDuration(): number;

    /**
     * Return units/second below which this actor is considered immobile
     */
    GetImmobileSpeedThreshold(): number;

    /**
     * Get this bot's intention interface
     */
    GetIntentionInterface(): INextBotComponent;

    /**
     * Get this bot's locomotion interface
     */
    GetLocomotionInterface(): ILocomotion;

    /**
     * Get last update tick
     */
    GetTickLastUpdate(): number;

    /**
     * Get this bot's vision interface
     */
    GetVisionInterface(): INextBotComponent;

    /**
     * Return true if given entity is our enemy
     * @param entity
     */
    IsEnemy(entity: CBaseEntity): boolean;

    /**
     * Is this bot flagged for update
     */
    IsFlaggedForUpdate(): boolean;

    /**
     * Return true if given entity is our friend
     * @param entity
     */
    IsFriend(entity: CBaseEntity): boolean;

    /**
     * Return true if we haven't moved in awhile
     */
    IsImmobile(): boolean;
}
