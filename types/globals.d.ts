//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Sets a function in the entity's script to rerun by itself constantly. Pass null as
     * the function name to remove a think function. The default think interval is 0.1s,
     * unless overridden by returning a different time interval in seconds in the think function
     * @tip Return -1 to think every tick. Do not return 0, this will give inconsistent intervals.
     * @confirm This issue has only been observed on players
     * @note If trying to clear a think function while inside a think function, this function alone
     * will not work as the think function is restored on the entity after it's finished.
     * `NetProps.SetPropString(self, "m_iszScriptThinkFunction", "");` must be used to fully clear the think function.
     * @warning This can apply to events if they are chained from a think function, for example killing a player
     * with TakeDamage and then trying to clear the think function in player_death event. The think
     * function will not be cleared unless the line above is also added.
     * @note Some entities are sensitive to when this think function executes within a frame. A notable
     * example is modifying the tf_player_manager entity. The think function must be applied to
     * the manager entity for netprop changes to work correctly, and not any other entity, otherwise
     * modifying its properties will be inconsistent.
     * @bug The think function name stored in the entity is not reset if null is passed as the function
     * name. However, this is harmless, and it will only show a warning in console.
     */
    function AddThinkToEnt(entity: CBaseEntity, FuncName: string): void;

    function AddToScriptHelp(): void;

    function AllowThirdPersonCamera(): boolean;

    function ArePlayersInHell(): boolean;

    /**
     * Test value and if not true, throws exception, optionally with message.
     */
    function Assert(value: boolean, message?: string): void;

    /**
     * Empties the tables of game event callback functions.
     */
    function ClearGameEventCallbacks(): void;

    /**
     * Create a prop
     */
    function CreateProp(classname: string, origin: Vector, model_name: string, activity: number): CBaseAnimating;

    /**
     * Create a scene entity to play the specified scene.
     */
    function CreateSceneEntity(scene: string): CBaseEntity;

    /**
     * The current level of the developer console variable.
     */
    function developer(): number;

    /**
     * Dispatches a one-off particle system
     */
    function DispatchParticleEffect(name: string, origin: Vector, angles: Vector): void;

    function Document(symbolOrTable: unknown, itemIfSymbol?: unknown, descriptionIfSymbol?: string): void;

    /**
     * Generate an entity I/O event. The caller and activator argument takes a CBaseEntity
     * script handle, and entities assigned can receive inputs with target set to !self, or
     * !activator / !caller.
     * @tip Use a -1 delay to consistently fire it at the end of the frame. 0 delay might bring inconsistent timing.
     * @note Does not work if the target string is point_servercommand.
     */
    function DoEntFire(target: string, action: string, value: string, delay: number, activator: CBaseEntity, caller: CBaseEntity): void;

    /**
     * Execute a script and put all its content for the argument passed to thescopeparameter.
     * The file must have the .nut extension.
     * @warninf Do not put uppercase letters in the path, doing so will cause Linux to fail loading the script from loose directories.
     */
    function DoIncludeScript(file: string, scope?: NutTable): boolean;

    /**
     * Wrapper for DoIncludeScript.
     */
    function IncludeScript(file: string, scope ?: NutTable): boolean;

    /**
     * Play named sound on an entity using configurations similar to ambient_generic. Soundlevel is in decibels,
     * see this page for real world equivalents.
     * @tip Sounds may be hard to hear even at full volume. Naming custom sounds according to the soundmixer can be used to make them naturally louder.
     * @tip To convert radius in Hammer units to decibels (similar to ambient_generic), use the following formula:
     * ```
     * local soundlevel = (40 + (20 * log10(radius / 36.0))).tointeger();
     * ```
     */
    function EmitAmbientSoundOn(soundName: string, volume: number, soundlevel: number, pitch: number, entity: CBaseEntity): void;

    /**
     * Stop named sound on an entity using configurations similar to ambient_generic.
     */
    function StopAmbientSoundOn(soundName: string, entity: CBaseEntity): void;

    /**
     * Play a sound. Takes in a script table of params: sound_name, channel, volume, sound_level, flags, pitch, special_dsp, origin, delay, sound_time, entity, speaker_entity, filter_type, filter_param. All parameters are optional except sound_name. See the main page for more details.
     */
    function EmitSoundEx(table: NutTable): void;

    /**
     * Play named sound on Entity.
     * @deprecated Legacy only, use EmitSoundEx.
     */
    function EmitSoundOn(soundScript: string, entity: CBaseEntity): void;

    /**
     * Stop named sound on an entity.
     */
    function StopSoundOn(soundScript: string, entity: CBaseEntity): void;

    /**
     * Play named sound only on the client for the specified player.
     * @note This only supports soundscripts. Legacy only, use EmitSoundEx.
     */
    function EmitSoundOnClient(soundScript: string, player: CBasePlayer): void;

    /**
     * Wrapper for DoEntFire() that setsactivator to null, but has nocallerparam.
     * @tip Use a -1 delay to consistently fire it at the end of the frame. 0 delay might bring inconsistent timing.
     * @note Does not work if the target string is point_servercommand.
     */
    function EntFire(target: string, action: string, value?: string, delay?: number, activator?: CBaseEntity): void;

    /**
     * Generate an entity i/o event. First parameter is an entity instance.
     * @tip Use a -1 delay to consistently fire it at the end of the frame. 0 delay might bring inconsistent timing.
     */
    function EntFireByHandle(entity: CBaseEntity, action: string, value: string, delay: number, activator: CBaseEntity, caller: CBaseEntity): void;

    /**
     * Turn an entity index integer to an HScript representing that entity's script instance.
     */
    function EntIndexToHScript(entIndex: number): CBaseEntity;

    /**
     * Reads a string from file located in the game's scriptdata folder. Returns the string from the file,
     * null if no file or file is greater than 16384 bytes.
     * @note Files packed inside the BSP cannot be read.
     * @note This opens files in text mode, therefore binary files will not be parsed correctly.
     */
    function FileToString(file: string): string;

    function FindCircularReference(): unknown;

    function FindCircularReferences(): unknown[];

    /**
     * Fire a game event to a listening callback function in script. Parameters are passed in a squirrel table.
     * @note The name might be misleading. This does not fire an event that the game will pick up, the function that sends a real game event is named SendGlobalGameEvent.
     */
    function FireGameEvent(name: string, table: NutTable): boolean;

    /**
     * Fire a script hook to a listening callback function in script. Parameters are passed in a squirrel table.
     */
    function FireScriptHook(name: string, table: NutTable): boolean;

    /**
     * Wrapper for __RunEventCallbacks()
     */
    function FireScriptEvent(event: string, params: NutTable): void;

    /**
     * Whether to force on MvM-styled upgrades on/off. 0 -> default, 1 -> force off, 2 -> force on
     */
    function ForceEnableUpgrades(state: number): void;

    /**
     * Forces payload pushing logic. 0 -> default, 1 -> force off, 2 -> force on
     */
    function ForceEscortPushLogic(state: number): void;

    /**
     * May a flag be captured?
     */
    function FlagsMayBeCapped(): boolean;

    /**
     * Get the time spent on the server in the last frame
     */
    function FrameTime(): number;

    /**
     * Does the current gamemode have currency?
     */
    function GameModeUsesCurrency(): boolean;

    /**
     * Does the current gamemode have minibosses?
     */
    function GameModeUsesMiniBosses(): boolean;

    /**
     * Does the current gamemode have upgrades?
     */
    function GameModeUsesUpgrades(): boolean;
}