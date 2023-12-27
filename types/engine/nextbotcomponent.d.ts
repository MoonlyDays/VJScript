//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Base script handle class for any interfaces belonging to an individual NextBotCombatCharacter entity.
     */
    interface INextBotComponent {
        /**
         * Recomputes the component update interval
         */
        ComputeUpdateInterval(): boolean;

        /**
         * Returns the component update interval
         */
        GetUpdateInterval(): number;

        /**
         * Resets the internal update state
         */
        Reset(): void;
    }
}