//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {QAngle, Vector} from '../datatypes';
import {CBaseCombatWeapon} from './basecombatweapon';
import {CBaseEntity} from './baseentity';
import {CBaseMultiplayerPlayer} from './basemultiplayerplayer';


/**
 * Script class: handle for player entities of Team Fortress 2.
 */
export interface CTFPlayer extends CBaseMultiplayerPlayer {
    AddCond(cond: number): void;

    AddCondEx(cond: number, duration: number, provider: CBaseEntity): void;

    /**
     * Kaching! Give the player some cash for game modes with upgrades, ie. MvM
     */
    AddCurrency(amount: number): void;

    /**
     * Add a custom attribute to the player. Set duration to -1 for the attribute to be applied forever.
     * @note This does not work when applied in the player_spawn event, because custom attributes are cleared immediately after the event. As a workaround, it can be applied with a delay. See the example code.
     */
    AddCustomAttribute(name: string, value: number, duration: number): void;

    /**
     * Hides a hud element based on Constants.FHideHUD
     */
    AddHudHideFlags(flags: number): void;

    /**
     * Apply a view punch along the pitch angle. Used to flinch players when hit. If the player is a fully charged scoped-in sniper and the weapon has the aiming_no_flinch attribute, the punch will not apply. Returns true if the punch was applied.
     */
    ApplyPunchImpulseX(impulse: number): boolean;

    /**
     * Make a player bleed for a set duration of time.
     */
    BleedPlayer(duration: number): void;

    /**
     * Make a player bleed for a set duration of time, or forever, with specific damage per tick and damage_custom index.
     */
    BleedPlayerEx(duration: number, damage: number, endless: boolean, nCustomDamageType: number): void;

    /**
     * Cancels any taunt in progress
     */
    CancelTaunt(): void;

    /**
     * Can the player air dash/double jump?
     */
    CanAirDash(): boolean;

    CanBeDebuffed(): boolean;

    CanBreatheUnderwater(): boolean;

    /**
     * Can the player duck?
     */
    CanDuck(): boolean;

    /**
     * Can the player get wet by jarate/milk?
     */
    CanGetWet(): boolean;

    /**
     * Can the player jump?
     */
    CanJump(): boolean;

    ClearCustomModelRotation(): void;

    ClearSpells(): void;

    /**
     * Stops active taunt from damaging or cancels Rock-Paper-Scissors result
     */
    ClearTauntAttack(): void;

    /**
     * Can the player move?
     */
    CanPlayerMove(): boolean;

    /**
     * Performs taunts attacks if available. Player must be already taunting and taunt must have a valid attack assigned (taunt attack name attribute)
     */
    DoTauntAttack(): void;

    /**
     * Force player to drop the flag.
     */ DropFlag(silent: boolean): void;

    /**
     * Force player to drop the rune.
     * @tip This can be abused to spawn arbitrary Mannpower powerups. See the example.
     */
    DropRune(apply_force: boolean, team: number): void;

    /**
     * Stops a looping taunt (obeys minimum time rules and plays outro animation if available)
     */
    EndLongTaunt(): void;

    /**
     * Equips a wearble on the viewmodel. Intended to be used with tf_wearable_vm entities.
     */
    EquipWearableViewModel(ent: CBaseEntity): void;

    ExtinguishPlayerBurning(): void;

    /**
     * Makes eg. a heavy go AAAAAAAAAAaAaa like they are firing their minigun.
     * @note This only works in a few situations as it requires certain gameplay conditions to be true. An example of when this will work: when the player is invulnerable.
     * @bug Unfortunately does not work for Heavy's minigun due to the above quirk.
     */
    FiringTalk(): void;

    /**
     * Force player to change their team. Setting the to: boolean true will not remove nemesis relationships or reset the player's class, as well as not slaying the player.
     * @note This will not work if a player is in a duel. Setting the m_bIsCoaching netprop to true on the player and reverting it afterwards is a workaround.
     */
    ForceChangeTeam(team: number, full_team_switch: boolean): void;

    /**
     * Force regenerates and respawns the player
     */
    ForceRegenerateAndRespawn(): void;

    /**
     * Force respawns the player
     */
    ForceRespawn(): void;

    /**
     * Get the player's current weapon
     */
    GetActiveWeapon(): CBaseCombatWeapon;

    GetBackstabs(): number;

    GetBonusPoints(): number;

    GetBotType(): number;

    GetBuildingsDestroyed(): number;

    GetCaptures(): number;

    /**
     * Gets the eye height of the player
     */
    GetClassEyeHeight(): Vector;

    /**
     * Returns duration of the condition. Returns 0 if the cond is not applied. Returns -1 if the cond is infinite.
     */
    GetCondDuration(cond: number): number;

    /**
     * Get player's cash for game modes with upgrades, ie. MvM
     */
    GetCurrency(): number;

    GetCurrentTauntMoveSpeed(): number;

    GetDefenses(): number;

    GetDisguiseAmmoCount(): number;

    GetDisguiseTarget(): CBaseEntity;

    GetDisguiseTeam(): number;

    GetDominations(): number;

    /**
     * What entity is the player grappling?
     */
    GetGrapplingHookTarget(): CBaseEntity;

    GetHeadshots(): number;

    GetHealPoints(): number;

    /**
     * Who is the medic healing?
     */
    GetHealTarget(): CBaseEntity;

    /**
     * Gets current hidden hud elements
     */
    GetHudHideFlags(): number;

    GetInvulns(): number;

    GetKillAssists(): number;

    GetLastWeapon(): CBaseCombatWeapon;

    /**
     * Get next change class time.
     */
    GetNextChangeClassTime(): number;

    /**
     * Get next change team time.
     */
    GetNextChangeTeamTime(): number;

    /**
     * Get next health regen time.
     */
    GetNextRegenTime(): number;

    GetPlayerClass(): number;

    GetRageMeter(): number;

    GetResupplyPoints(): number;

    GetRevenge(): number;

    GetScoutHypeMeter(): number;

    GetSpyCloakMeter(): number;

    GetTeleports(): number;

    /**
     * Timestamp until a taunt attack "lasts". 0 if unavailable
     */
    GetTauntAttackTime(): number;

    /**
     * Timestamp until taunt is stopped
     */
    GetTauntRemoveTime(): number;

    /**
     * Timestamp when kart was reversed
     */
    GetVehicleReverseTime(): number;

    /**
     * When did the player last call medic
     */
    GetTimeSinceCalledForMedic(): number;

    GrantOrRemoveAllUpgrades(remove: boolean, refund: boolean): void;

    /**
     * Currently holding an item? Eg. capture flag
     * @tip Fetch the m_hItem netprop to get the entity handle.
     */
    HasItem(): boolean;

    /**
     * Spoofs a taunt command from the player, as if they selected this taunt.
     */
    HandleTauntCommand(taunt_slot: number): void;

    IgnitePlayer(): void;

    InAirDueToExplosion(): boolean;

    InAirDueToKnockback(): boolean;

    InCond(cond: number): boolean;

    IsAirDashing(): boolean;

    /**
     * Returns true if the taunt will be stopped
     */
    IsAllowedToRemoveTaunt(): boolean;

    IsAllowedToTaunt(): boolean;

    IsBotOfType(type: number): boolean;

    /**
     * Is this player calling for medic?
     */
    IsCallingForMedic(): boolean;

    IsCarryingRune(): boolean;

    IsControlStunned(): boolean;

    IsCritBoosted(): boolean;

    IsFakeClient(): boolean;

    IsFireproof(): boolean;

    IsFullyInvisible(): boolean;

    IsHypeBuffed(): boolean;

    IsImmuneToPushback(): boolean;

    IsInspecting(): boolean;

    IsInvulnerable(): boolean;

    IsJumping(): boolean;

    /**
     * Is this player an MvM mini-boss?
     */
    IsMiniBoss(): boolean;

    IsParachuteEquipped(): boolean;

    /**
     * Returns true if we placed a sapper in the last few moments
     */
    IsPlacingSapper(): boolean;

    IsRageDraining(): boolean;

    IsRegenerating(): boolean;

    /**
     * Returns true if we are currently sapping
     */
    IsSapping(): boolean;

    IsSnared(): boolean;

    IsStealthed(): boolean;

    IsTaunting(): boolean;

    IsUsingActionSlot(): boolean;

    IsViewingCYOAPDA(): boolean;

    IsViewingCYOAPDA(): boolean;

    /**
     * Resupplies a player. If refill health/ammo is set, clears negative conds, gives back player health/ammo
     */
    Regenerate(refill_health_ammo: boolean): void;

    /**
     * @bug This does not actually remove all items. It only drops the passtime ball, intelligence, disables radius healing, and hides the Spy invis watch.
     * @param unused
     */
    RemoveAllItems(unused: boolean): void;

    /**
     * Remove all player objects. Eg. dispensers/sentries.
     */
    RemoveAllObjects(explode: boolean): void;

    /**
     * Removes a condition. Does not remove a condition if the minimum duration has not passed. Does nothing if the condition isn't added (interally does InCond check).
     */
    RemoveCond(cond: number): void;

    /**
     * Extended version of above function. Allows forcefully removing the condition even if minimum duration is not met.
     */
    RemoveCondEx(cond: number, ignoreDuration: boolean): void;

    /**
     * Take away money from a player for reasons such as ie. spending.
     */
    RemoveCurrency(amount: number): void;

    /**
     * Remove a custom attribute to the player
     */
    RemoveCustomAttribute(name: string): void;

    /**
     * Undisguise a spy.
     */
    RemoveDisguise(): void;

    /**
     * Unhides a hud element based on Constants.FHideHUD
     */
    RemoveHudHideFlags(flags: number): void;

    /**
     * Un-invisible a spy.
     */
    RemoveInvisibility(): void;

    RemoveTeleportEffect(): void;

    ResetScores(): void;

    RollRareSpell(): void;

    SetCondDuration(cond: number, duration: number): void;

    /**
     * Set player's cash for game modes with upgrades, ie. MvM
     */
    SetCurrency(amount: number): void;

    SetCurrentTauntMoveSpeed(speed: number): void;

    SetCustomModel(model_name: string): void;

    SetCustomModelOffset(offset: Vector): void;

    SetCustomModelRotates(toggle: boolean): void;

    SetCustomModelRotation(angles: QAngle): void;

    SetCustomModelVisibleToSelf(toggle: boolean): void;

    SetCustomModelWithClassAnimations(model_name: string): void;

    SetDisguiseAmmoCount(count: number): void;

    SetForcedTauntCam(toggle: number): void;

    /**
     * Set the player's target grapple entity
     */
    SetGrapplingHookTarget(entity: CBaseEntity, bleed: boolean): void;

    /**
     * Force hud hide flags to a value based on Constants.FHideHUD
     */
    SetHudHideFlags(flags: number): void;

    /**
     * Make this player an MvM mini-boss.
     */
    SetIsMiniBoss(toggle: boolean): void;

    /**
     * Set next change class time.
     */
    SetNextChangeClassTime(time: number): void;

    /**
     * Set next change team time.
     */
    SetNextChangeTeamTime(time: number): void;

    /**
     * Set next available resupply time.
     */
    SetNextRegenTime(time: number): void;

    /**
     * Sets the player class. Updates the player's visuals and model.
     * @note Does not force the class to be changed and can be buggy for server-side scripts. This can be resolved by calling NetProps.SetPropnumber(player, "m_Shared.m_iDesiredPlayerClass", classIndex) after SetPlayerClass and before ForceRegenerateAndRespawn. This resolves issues like the player respawning as their "desired" class instead or loadout showing the desired class rather than what they are.
     * @note Does not regenerate class properties, such as health or weapons. This can be done by calling ForceRegenerateAndRespawn afterwards.
     * @warning If the player is not respawned, the hitbox set will be used from the old class! Calling SetCustomModel with a blank parameter is sufficient to update it.
     */
    SetPlayerClass(classIdx: number): void;

    /**
     * Sets rage meter from 0 - 100.
     */
    SetRageMeter(percent: number): void;

    /**
     * Rig the result of Rock-Paper-Scissors (0 - rock, 1 - paper, 2 - scissors)
     * @param result
     */
    SetRPSResult(result: number): void;

    /**
     * Sets hype meter from 0 - 100.
     */
    SetScoutHypeMeter(percent: number): void;

    /**
     * Sets cloakmeter from 0 - 100.
     * */
    SetSpyCloakMeter(number): void;

    /**
     * Set the timestamp when kart was reversed
     * */
    SetVehicleReverseTime(time: number): void;

    SetUseBossHealthBar(toggle: boolean): void;

    /**
     * Stops current taunt. If remove_prop is true, the taunt prop will be immediately deleted instead of potentially delaying
     */
    StopTaunt(remove_prop: boolean): void;

    /**
     * Performs a taunt if allowed. For taunt index, see Constants.FTaunts. For concepts, see MP_CONCEPT
     * List. Concept is the "voiceline" index to use with the taunt. For TAUNT_SHOW_ITEM and TAUNT_BASE_WEAPON
     * this is set automatically. TAUNT_LONG is not supported.
     * @tip TAUNT_MISC_ITEM with a concept of MP_CONCEPT_TAUNT_LAUGH will make the player laugh. Concept MP_CONCEPT_TAUNT_REPLAY will play the replay taunt.
     */
    Taunt(taunt_index: number, taunt_concept: number): void;

    /**
     * Make the player attempt to pick up a building in front of them
     */
    TryToPickupBuilding(): boolean;

    UpdateSkin(skin: number): void;

    WasInCond(cond: number): boolean;

    Weapon_CanUse(weapon: CBaseCombatWeapon): boolean;

    /**
     * Does nothing!
     */
    Weapon_Drop(weapon: CBaseCombatWeapon): void;

    /**
     * Does nothing!
     */
    Weapon_DropEx(weapon: CBaseCombatWeapon, target: Vector, velocity: Vector): void;

    Weapon_Equip(weapon: CBaseCombatWeapon): void;

    Weapon_SetLast(weapon: CBaseCombatWeapon): void;

    Weapon_ShootPosition(): Vector;

    Weapon_Switch(weapon: CBaseCombatWeapon): void;
}
