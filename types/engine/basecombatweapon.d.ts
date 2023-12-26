//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Script handle class for any weapon entities that can be part of a player's inventory.
     * Team Fortress 2's weapons leave Clip2 unused, so those functions can be ignored
     */
    class CBaseCombatWeapon extends CBaseAnimating {

        /**
         * Can this weapon be selected
         */
        public CanBeSelected(): boolean;

        /**
         * Current ammo in clip1
         */
        public Clip1(): number;

        /**
         * Current ammo in clip2
         */
        public Clip2(): number;

        /**
         * Default size of clip1
         */
        public GetDefaultClip1(): number;

        /**
         * Default size of clip2
         */
        public GetDefaultClip2(): number;

        /**
         * Max size of clip1
         */
        public GetMaxClip1(): number;

        /**
         * Max size of clip2
         */
        public GetMaxClip2(): number;

        /**
         * Gets the weapon's name
         */
        public GetName(): string;

        /**
         * Gets the weapon's current position
         */
        public GetPosition(): number;

        /**
         * Current primary ammo count if no clip is used or to give a player if they pick up this weapon legacy style (not TF)
         */
        public GetPrimaryAmmoCount(): number;

        /** Returns the primary ammo type */
        public GetPrimaryAmmoType(): number;

        /** Gets the weapon's print name */
        public GetPrintName(): string;

        /** Current secondary ammo count if no clip is used or to give a player if they pick up this weapon legacy style (not TF) */
        public GetSecondaryAmmoCount(): number;

        /** Returns the secondary ammo type */
        public GetSecondaryAmmoType(): number;

        /** Gets the weapon's current slot */
        public GetSlot(): number;

        /** Get the weapon subtype */
        public GetSubType(): number;

        /** Get the weapon flags */
        public GetWeaponFlags(): number;

        /** Get the weapon weighting/importance */
        public GetWeight(): number;

        /** Do we have any ammo? */
        public HasAnyAmmo(): boolean;

        /** Do we have any primary ammo? */
        public HasPrimaryAmmo(): boolean;

        /** Do we have any secondary ammo? */
        public HasSecondaryAmmo(): boolean;

        /** Are we allowed to switch to this weapon? */
        public IsAllowedToSwitch(): boolean;

        /** Returns whether this is a melee weapon */
        public IsMeleeWeapon(): boolean;

        /** Force a primary attack */
        public PrimaryAttack(): void;

        /**
         * Force a secondary attack
         * @tip This allows arbitrarily firing weapons that do not actually belong to any player. This can be useful for creating entities that might not fully work on their own, for example rockets. Most weapons will work as long as the m_hOwner netprop on the weapon is set to an existing player. Weapons spawned manually might also need SetClip(-1), and m_flNextPrimaryAttack (or m_flSecondaryPrimaryAttack) set to 0 before calling this function to always allow firing without delays.
         * @warning Hitscan and melee weapons require lag compensation information to be present, or the game will crash! Calling this from a player's think function or OnTakeDamage hook (whose source is a player's hitscan weapon) is sufficient. Alternatively, lag compensation can be temporarily disabled which allows calling this function from anywhere, with the side effect of poor hit registration for high latency players. This can be achieved by setting the m_bLagCompensation netprop on the player to to false, calling this function, and reverting it back to true.
         * @warning This will play the weapon's fire sound to everyone except the owner. If the sound is desired, the sound can be played to the owner exclusively via EmitSoundEx. If the sound is not desired, it can be stopped by calling StopSound after this function.
         */
        public SecondaryAttack(): void;

        /**
         * Set current ammo in clip1.
         * @param amount
         */
        public SetClip1(amount: number): void;

        /**
         * Set current ammo in clip2.
         * @param amount
         */
        public SetClip2(amount: number): void;

        /**
         * Sets a custom view model for this weapon by model name.
         * @param model_name
         */
        public SetCustomViewModel(model_name: string): void;

        /**
         * Sets a custom view model for this weapon by modelindex.
         * @param model_index
         */
        public SetCustomViewModelModelIndex(model_index: number): void;

        /**
         * Set the weapon subtype
         * @param subtype
         */
        public SetSubType(subtype: number): void;

        /**
         * Do we use clips for ammo 1?
         */
        public UsesClipsForAmmo1(): boolean;

        /**
         * Do we use clips for ammo 2?
         */
        public UsesClipsForAmmo2(): boolean;

        /**
         * Do we use primary ammo?
         */
        public UsesPrimaryAmmo(): boolean;

        /**
         * Do we use secondary ammo?
         */
        public UsesSecondaryAmmo(): boolean;

        /**
         * Is this weapon visible in weapon selection
         */
        public VisibleInWeaponSelection(): boolean;
    }
}