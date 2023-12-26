//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Script handle class for player entities.
     */
    class CBasePlayer extends CBaseCombatCharacter {
        /**
         * Whether the player is being forced by SetForceLocalDraw to be drawn.
         */
        public GetForceLocalDraw(): boolean;

        /**
         * Get a vector containing max bounds of the player in local space. The player's model scale will affect the result.
         */
        public GetPlayerMins(): Vector;

        /**
         * Get a vector containing min bounds of the player in local space. The player's model scale will affect the result.
         */
        public GetPlayerMaxs(): Vector;

        /**
         * Gets the current overlay material set by SetScriptOverlayMaterial.
         */
        public GetScriptOverlayMaterial(): string;

        /**
         * Returns true if the player is in noclip mode.
         */
        public IsNoclipping(): boolean;

        /**
         * Forces the player to be drawn as if they were in thirdperson.
         * @param forceDraw
         */
        public SetForceLocalDraw(forceDraw: boolean): void;

        /**
         * Sets the overlay material that can't be overriden by other overlays. E.g. Jarate.
         * @param material
         */
        public SetScriptOverlayMaterial(material: string): void;

        /**
         * Snap the player's eye angles to this.
         * @param angles
         */
        public SnapEyeAngles(angles: QAngle): void;

        /**
         * Ow! Punches the player's view.
         * @param angleOffset
         */
        public ViewPunch(angleOffset: QAngle): void;

        /**
         * Reset's the player's view punch if the offset stays below the given tolerance.
         * @param tolerance
         */
        public ViewPunchReset(tolerance: number): void;
    }
}