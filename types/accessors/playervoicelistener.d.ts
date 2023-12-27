//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Tracks if any player is using voice and for how long.
     */
    const PlayerVoiceListener: CPlayerVoiceListener;
}

/**
 * Tracks if any player is using voice and for how long.
 */
declare interface CPlayerVoiceListener {
    /**
     * Returns the number of seconds the player has been continuously speaking.
     */
    GetPlayerSpeechDuration(playerIndex: number): number;

    /**
     * Returns whether the player specified is speaking.
     */
    IsPlayerSpeaking(playerIndex: number): boolean;
}