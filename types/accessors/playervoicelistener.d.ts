//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------


/**
 * Tracks if any player is using voice and for how long.
 */
export const PlayerVoiceListener: CPlayerVoiceListener;

/**
 * Tracks if any player is using voice and for how long.
 */
export interface CPlayerVoiceListener {
    /**
     * Returns the number of seconds the player has been continuously speaking.
     */
    GetPlayerSpeechDuration(playerIndex: number): number;

    /**
     * Returns whether the player specified is speaking.
     */
    IsPlayerSpeaking(playerIndex: number): boolean;
}