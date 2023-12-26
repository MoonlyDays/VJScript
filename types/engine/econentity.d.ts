//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Script handle class for economic exquisite equippables, meaning hats and weapons.
     */
    class CEconEntity extends CBaseAnimating {
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
        public RemoveAttribute(name: string): void;

        /**
         * Relinks attributes to provisioners, e.g. calling this on a weapon will add it's attributes to the player.
         */
        public ReapplyProvision(): void;
    }
}