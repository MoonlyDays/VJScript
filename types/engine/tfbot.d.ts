//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {CBaseCombatWeapon} from './basecombatweapon';
import {CBaseEntity} from './baseentity';
import {NextBotCombatCharacter} from './nextbotcombatcharacter';
import {CTFNavArea} from './tfnavarea';
import {CTFPlayer} from './tfplayer';

/**
 * Script class handle for bot-controlled players aka tf_bot. Beep boop.
 */
export interface CTFBot extends CTFPlayer, NextBotCombatCharacter {
    /**
     * Sets attribute flags on this TFBot
     */
    AddBotAttribute(attribute: number): void;

    /**
     * Adds a bot tag
     */
    AddBotTag(tag: string): void;

    /**
     * Adds weapon restriction flags
     */
    AddWeaponRestriction(flags: number): void;

    /**
     * Clears all attribute flags on this TFBot
     */
    ClearAllBotAttributes(): void;

    /**
     * Clears bot tags
     */
    ClearAllBotTags(): void;

    /**
     * Removes all weapon restriction flags
     */
    ClearAllWeaponRestrictions(): void;

    /**
     * Clear current focus
     */
    ClearAttentionFocus(): void;

    /**
     * Notice the threat after a delay in seconds
     */
    DelayedThreatNotice(threat: CBaseEntity, delay: number): void;

    /**
     * Forces the current squad to be entirely disbanded by everyone
     */
    DisbandCurrentSquad(): void;

    /**
     * Get the nav area of the closest vantage point (within distance)
     */
    FindVantagePoint(max_distance: number): CTFNavArea;

    /**
     * Give me an item!
     */
    GenerateAndWearItem(item_name: string): void;

    /**
     * Sets the home nav area of the bot
     */
    GetHomeArea(): CTFNavArea;

    /**
     * Returns the bot's difficulty level
     */
    GetDifficulty(): number;

    /**
     * Gets the max vision range override for the bot
     * @warning MaxVisionRange overrides, as well as certain other bot modifiers, can persist after a bot has been moved to spectator and assigned a new class/loadout in MvM! Identifying MvM bots by the MaxVisionRange override set in a popfile may not be reliable.
     */
    GetMaxVisionRangeOverride(): number;

    /**
     * Gets the nearest known sappable target
     */
    GetNearestKnownSappableTarget(): CBaseEntity;

    /**
     * Return the nav area of where we spawned
     */
    GetSpawnArea(): CTFNavArea;

    /**
     * Gets our formation error coefficient.
     */
    GetSquadFormationError(): number;

    /**
     * Checks if this TFBot has the given attributes
     */
    HasBotAttribute(attribute: number): boolean;

    /**
     * Checks if this TFBot has the given bot tag
     */
    HasBotTag(tag: string): boolean;

    /**
     * Checks if this TFBot has the given weapon restriction flags
     */
    HasWeaponRestriction(flags: number): boolean;

    IsAmmoFull(): boolean;

    IsAmmoLow(): boolean;

    /**
     * Is our attention focused right now?
     */
    IsAttentionFocused(): boolean;

    /**
     * Is our attention focused on this entity
     */
    IsAttentionFocusedOn(entity: CBaseEntity): boolean;

    /**
     * Returns true/false if the bot's difficulty level matches.
     */
    IsDifficulty(difficulty: number): boolean;

    /**
     * Checks if we are in a squad
     */
    IsInASquad(): boolean;

    /**
     * Checks if the given weapon is restricted for use on the bot
     */
    IsWeaponRestricted(weapon: CBaseCombatWeapon): boolean;

    /**
     * Makes us leave the current squad (if any)
     */
    LeaveSquad(): void;

    PressAltFireButton(duration: number): void;

    PressFireButton(duration: number): void;

    PressSpecialFireButton(duration: number): void;

    /**
     * Removes attribute flags on this TFBot
     */
    RemoveBotAttribute(attribute: number): void;

    /**
     * Removes a bot tag
     */
    RemoveBotTag(tag: string): void;

    /**
     * Removes weapon restriction flags
     */
    RemoveWeaponRestriction(flags: number): void;

    /**
     * Sets our current attention focus to this entity
     */
    SetAttentionFocus(entity: CBaseEntity): void;

    /**
     * Sets if the bot should automatically jump, and how often.
     */
    SetAutoJump(minTime: number, maxTime: number): void;

    /**
     * Sets the bots difficulty level
     */
    SetDifficulty(difficulty: number): void;

    /**
     * Set the home nav area of the bot, may be null.
     */
    SetHomeArea(area: CTFNavArea): void;

    /**
     * Sets max vision range override for the bot
     */
    SetMaxVisionRangeOverride(range: number): void;

    /**
     * Sets the scale override for the bot
     */
    SetScaleOverride(scale: number): void;

    /**
     * Sets if the bot should build instantly
     */
    SetShouldQuickBuild(toggle: boolean): void;

    /**
     * Sets our formation error coefficient.
     */
    SetSquadFormationError(coefficient: number): void;

    /**
     * Returns if the bot should automatically jump
     */
    ShouldAutoJump(): boolean;

    /**
     * Returns if the bot should build instantly
     */
    ShouldQuickBuild(): boolean;

    UpdateDelayedThreatNotices(): void;
}
