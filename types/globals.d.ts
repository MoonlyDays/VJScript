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
    function AddThinkToEnt<T extends CBaseEntity>(entity: T, thinkFn: string | ((ent: T) => number)): void;

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
     * @warning Do not put uppercase letters in the path, doing so will cause Linux to fail loading the script from
     *     loose directories.
     */
    function DoIncludeScript(file: string, scope?: NutTable): boolean;

    /**
     * Wrapper for DoIncludeScript.
     */
    function IncludeScript(file: string, scope ?: NutTable): boolean;

    /**
     * Play named sound on an entity using configurations similar to ambient_generic. Soundlevel is in decibels,
     * see this page for real world equivalents.
     * @tip Sounds may be hard to hear even at full volume. Naming custom sounds according to the soundmixer can be
     *     used to make them naturally louder.
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
     * Play a sound. Takes in a script table of params: sound_name, channel, volume, sound_level, flags, pitch,
     * special_dsp, origin, delay, sound_time, entity, speaker_entity, filter_type, filter_param. All parameters are
     * optional except sound_name. See the main page for more details.
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
     * Generate an entity I/O event. The caller and activator argument takes a CBaseEntity script handle, and entities
     * assigned can receive inputs with target set to !self, or !activator / !caller.
     * @tip Use a -1 delay to consistently fire it at the end of the frame. 0 delay might bring inconsistent timing.
     * @note Does not work if the target string is point_servercommand.
     * @param {string} target
     * @param {string} action
     * @param {string} value
     * @param {number} delay
     * @param {CBaseEntity} activator
     * @constructor
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
     * Reads a from: string file located in the game's scriptdata folder. Returns the from: string the file,
     * null if no file or file is greater than 16384 bytes.
     * @note Files packed inside the BSP cannot be read.
     * @note This opens files in text mode, therefore binary files will not be parsed correctly.
     */
    function FileToString(file: string): string;

    function FindCircularReference(): unknown;

    function FindCircularReferences(): unknown[];

    /**
     * Fire a game event to a listening callback function in script. Parameters are passed in a squirrel table.
     * @note The name might be misleading. This does not fire an event that the game will pick up, the function that
     *     sends a real game event is named SendGlobalGameEvent.
     */
    function FireGameEvent(name: string, table: NutTable): boolean;

    /**
     * Fire a script hook to a listening callback function in script. Parameters are passed in a squirrel table.
     */
    function FireScriptHook(name: string, table: NutTable): boolean;

    /**
     * Wrapper for __RunEventCallbacks()
     * @param {string} event
     * @param {NutTable} params
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

    /**
     * Get class limit for class. See Constants.ETFClass.
     */
    function GetClassLimit(classIdx: number): number;

    /**
     *  Gets the level of 'developer'
     */
    function GetDeveloperLevel(): number;

    /**
     * Returns the engines current frame count
     */
    function GetFrameCount(): number;

    /**
     * Returns the Friction on a player entity, meaningless if not a player
     */
    function GetFriction(player: CTFPlayer): number;

    function GetFunctionSignature(func: unknown, prefix: string): string;

    function GetGravityMultiplier(): number;

    /**
     * Get the local player on a listen server.
     */
    function GetListenServerHost<T extends CBasePlayer = CBasePlayer>(): T;

    function GetMannVsMachineAlarmStatus(): boolean;

    /**
     * Get the name of the map.
     */
    function GetMapName(): string;

    /**
     * Returns the index of the named model.
     * @param {string} filename
     * @returns {number}
     */
    function GetModelIndex(filename: string): number;

    function GetOvertimeAllowedForCTF(): boolean;

    /**
     * Returns the Angular velocity of the entity.
     * @deprecated Deprecated, use the GetPhysAngularVelocity method on the entity instead.
     * @param {CBaseEntity} entity
     * @returns {Vector}
     * @constructor
     */
    function GetPhysAngularVelocity(entity: CBaseEntity): Vector;

    /**
     * Returns the velocity of the entity.
     * @deprecated Deprecated, use the GetPhysVelocity method on the entity instead.
     * @param {CBaseEntity} entity
     * @returns {Vector}
     * @constructor
     */
    function GetPhysVelocity(entity: CBaseEntity): Vector;

    /**
     * Given a user id, return the entity, or null.
     * @note The 'fake' SourceTV player will always be returned as null.
     * @param {number} userid
     * @template T
     * @returns {T}
     * @constructor
     */
    function GetPlayerFromUserID<T extends CBasePlayer = CBasePlayer>(userid: number): T;

    /**
     * Get current round state. See Constants.ERoundState.
     */
    function GetRoundState(): number;

    /**
     * Returns duration: number of the sound. Actor model name is optional and can be left null.
     * @note Actor model name is likely a leftover from  Half-Life 2
     * @warning Does not work on dedicated servers as they do not have audio libraries built-in to load sounds.
     * @param {string} soundname
     * @param {string} actormodelname
     * @returns {number}
     * @constructor
     */
    function GetSoundDuration(soundname: string, actormodelname: string): number;

    /**
     * Get the current stopwatch state. See Constants.EStopwatchState.
     * @returns {number}
     * @constructor
     */
    function GetStopWatchState(): number;

    /**
     * Who won!
     * @returns {number}
     * @constructor
     */
    function GetWinningTeam(): number;

    function HaveStopWatchWinner(): boolean;

    /**
     * Are we in the pre-match/setup state?
     */
    function InMatchStartCountdown(): boolean;

    /**
     * Currently in overtime?
     */
    function InOvertime(): boolean;

    function IsAttackDefenseMode(): boolean;

    /**
     * Are we in birthday mode?
     */
    function IsBirthday(): boolean;

    /**
     * Playing competitive?
     */
    function IsCompetitiveMode(): boolean;

    /**
     * Returns true if this server is a dedicated server.
     */
    function IsDedicatedServer(): boolean;

    /**
     * The absence of arena, mvm, tournament mode, etc
     */
    function IsDefaultGameMode(): boolean;

    /**
     * Is the given holiday active? See Constants.EHoliday.
     */
    function IsHolidayActive(holiday: number): boolean;

    /**
     * Playing a holiday map? See Constants.EHoliday.
     */
    function IsHolidayMap(holiday: number): boolean;

    /**
     * Playing arena mode?
     */
    function IsInArenaMode(): boolean;

    /**
     * Playing king of the hill mode?
     */
    function IsInKothMode(): boolean;

    /**
     * Playing medieval mode?
     */
    function IsInMedievalMode(): boolean;

    /**
     * Are we waiting for some stragglers?
     */
    function IsInWaitingForPlayers(): boolean;

    /**
     * Playing MvM? Beep boop
     */
    function IsMannVsMachineMode(): boolean;

    /**
     * Are players allowed to refund their upgrades?
     */
    function IsMannVsMachineRespecEnabled(): boolean;

    /**
     * Playing casual?
     */
    function IsMatchTypeCasual(): boolean;

    /**
     * Playing competitive?
     */
    function IsMatchTypeCompetitive(): boolean;

    /**
     * Checks if the modelname is precached.
     */
    function IsModelPrecached(modelname: string): boolean;

    /**
     * Checks if the soundname is precached.
     */
    function IsSoundPrecached(soundname: string): boolean;

    /**
     * No ball games.
     */
    function IsPasstimeMode(): boolean;

    /**
     * Is this player/entity a bot.
     */
    function IsPlayerABot(player: CBasePlayer): boolean;

    /**
     * Playing powerup mode? Not compatible with MvM
     */
    function IsPowerupMode(): boolean;

    function IsPVEModeActive(): boolean;

    /**
     * If an engie places a building, will it immediately upgrade? Eg. MvM pre-round etc.
     */
    function IsQuickBuildTime(): boolean;

    function IsTruceActive(): boolean;

    function IsUsingGrapplingHook(): boolean;

    function IsUsingSpells(): boolean;

    function IsWeakref(): boolean;

    /**
     * Fills out a table with the local time (second, minute, hour, day, month, year, dayofweek, dayofyear,
     * daylightsavings)
     */
    function LocalTime(out: NutTable): void;

    function MakeNamespace(): void;

    function MapHasMatchSummaryStage(): boolean;

    function MatchmakingShouldUseStopwatchMode(): boolean;

    /**
     * Get the current number of max clients set by the maxplayers command.
     * @bug The return value is mistakenly defined as a number. It is best to use .tointeger() after calling this.
     */
    function MaxClients(): number;

    /**
     * Object from world is put into the "Held" slot of the player.
     * @warning it will smoothly interpolate from where it is to the players hand - which is a bit goofy if it is on
     *     other side of level.
     * @note Does nothing in  Team Fortress 2 as the code is not implemented.
     */
    function PickupObject(player: CBasePlayer, entity: CBaseEntity): void;

    /**
     * Get a script handle of a player using the player index.
     * @note The 'fake' SourceTV player will always be returned as null.
     */
    function PlayerInstanceFromIndex(index: number): CBasePlayer;

    function PlayerReadyStatus_ArePlayersOnTeamReady(team: number): boolean;

    function PlayerReadyStatus_HaveMinPlayersToEnable(): boolean;

    function PlayerReadyStatus_ResetState(): void;

    function PlayersAreOnMatchSummaryStage(): boolean;

    /**
     * Are points able to be captured?
     */
    function PointsMayBeCaptured(): boolean;

    /**
     * Precache an entity from KeyValues in a table. Internally this function creates the entity, fire DispatchSpawn
     * and removes it instantly. Returns false if the table has no classname key, if the value of classname is null or
     * empty, or if the entity failed to be created.
     */
    function PrecacheEntityFromTable(keyvalues: NutTable): boolean;

    /**
     * Precache a model and return index of the model. Returns -1 if null or empty filename is passed in. Missing
     * models will still return a new index.
     */
    function PrecacheModel(filename: string): number;

    /**
     * Precache a soundscript. Returns false if soundscript is missing, or if a null or empty sound name is passed in.
     */
    function PrecacheScriptSound(soundName: string): boolean;

    /**
     * Precache a raw sound. Returns false if a null or empty sound name is passed in.
     */
    function PrecacheSound(soundName: string): boolean;

    /**
     * Equivalent to running script_help command.
     */
    function PrintHelp(): void;

    /**
     * Generate a random floating-point number within a range, inclusive.
     */
    function RandomFloat(min: number, max: number): number;

    /**
     * Generate a random integer within a range, inclusive.
     */
    function RandomInt(min: number, max: number): number;

    function RegisterFunctionDocumentation(func: unknown, name: string, signature: string, description: string): void;

    /**
     * uses to register event callbacks to the C++ code. Register as a listener for a game event from script. It's what
     * __CollectGameEventCallbacks() uses to register event callbacks to the C++ code.
     * @note This cannot be used to register non-existent game events.
     */
    function RegisterScriptGameEventListener(eventName: string): void;

    /**
     * Register as a listener for a script hook from script.
     */
    function RegisterScriptHookListener(name: string): void;

    function RetrieveNativeSignature(func: unknown): string;

    /**
     * Rotate a QAngle by another QAngle.
     */
    function RotateOrientation(angle: QAngle, rotate: QAngle): QAngle;

    /**
     * Rotate the input Vector around an origin.
     * @bug This is not calculated correctly and the rotation will always be relative to (0, 0, 0). As a workaround,
     *     subtract the origin from the input, call this function and then add the origin back which will perform the
     *     expected result.
     */
    function RotatePosition(origin: Vector, rotation: QAngle, input: Vector): Vector;

    /**
     * Start a customisable screenfade. If no player is specified, the fade will apply to all players.
     */
    function ScreenFade(player: CBasePlayer, red: number, green: number, blue: number, alpha: number, fadeTime: number, fadeHold: number, flags: number): void;

    /**
     * Start a customisable screenshake; eCommand( SHAKE_START = 0, SHAKE_STOP = 1 ).
     */
    function ScreenShake(vecCenter: Vector, flAmplitude: number, flFrequency: number, flDuration: number, flRadius: number, eCommand: number, bAirShake: boolean): void;

    /**
     * Returns whether script hooks are currently enabled.
     */
    function ScriptHooksEnabled(): boolean;

    /**
     * Sends a real game event to everything. Parameters are passed in a squirrel table.
     * @warning Certain events that are usually clientside only will not work when fired by this function, with an
     *     error complaining that "no listeners are registered for this event". However, defining an empty event
     *     listener will make it work.
     * @warning Events that upload statistics to Steam servers such as player_escort_score can take as long as 1
     *     millisecond to execute! This can be prevented by temporarily giving the player the FL_FAKECLIENT flag and
     *     reverting it afterwards (however be careful not to revert it on actual bots!). Example:
     * ```
     * local is_bot = player.IsFakeClient();
     * if (!is_bot) player.AddFlag(Constants.FPlayer.FL_FAKECLIENT);
     *
     * SendGlobalGameEvent("player_escort_score",
     * {
     *     player = player.entindex(),
     *     points = 1
     * });
     *
     * if (!is_bot) player.RemoveFlag(Constants.FPlayer.FL_FAKECLIENT);
     * ```
     */
    function SendGlobalGameEvent(event_name: string, params: NutTable): boolean;

    /**
     * Issues a command to the local client, as if they typed in the command in their console. Does nothing on
     * dedicated servers.
     */
    function SendToConsole(command: string): void;

    /**
     * Issues a command to the server, as if typed in the console.
     * @note This obeys the behavior of the sv_allow_point_servercommand convar. By default, this command will do
     *     nothing unless the server has this command to set to "always"
     */
    function SendToServerConsole(command: string): void;

    /**
     * Copy of SendToServerConsole with another name for compat.
     */
    function SendToConsoleServer(command: string): void;

    /**
     * Sets a USERINFO client ConVar for a fakeclient.
     * @tip This can be used to change the name of a bot by using the name cvar.
     */
    function SetFakeClientConVarValue(bot: CTFBot, cvar: string, value: string): void;

    function SetGravityMultiplier(multiplier: number): void;

    function SetMannVsMachineAlarmStatus(status: boolean): void;

    function SetOvertimeAllowedForCTF(state: boolean): void;

    function SetPlayersInHell(state: boolean): void;

    /**
     * Sets the current skybox texture. The path is relative to "materials/skybox/". Only the main name of a skybox
     * texture is needed, for example "sky_gravel_01".
     */
    function SetSkyboxTexture(texture: string): void;

    function SetUsingSpells(state: boolean): void;

    /**
     * Spawn entity from KeyValues in table - 'name' is entity name, rest are KeyValues for spawn.
     * @note Multiple keys of the same name can be specified by appending the key with an incremental #x suffix.
     * Example:
     * ```
     * SpawnEntityFromTable("logic_timer", {
     *     targetname = "cool"
     *     RefireTime = 60
     *     "OnTimer#1" = "entity,Trigger,,0,-1"
     *     "OnTimer#2" = "somethingelse,Disable,,0,-1"
     * })
     * ```
     * @note parentname is not resolved and therefore will not work. Instead, use SpawnEntityGroupFromTable for that
     *     purpose.
     * @tip If spawning multiple entities at once, use SpawnEntityGroupFromTable as it will be more efficient.
     * @warning If using commas inside the parameter field of an output key, it will not be parsed correctly as the
     *     comma will be treated as delimiter. To fix this, a special delimiter also supported by the game can be used
     *     named 'ESC'. This cannot be typed on a keyboard normally, and must be copied from another source. The
     *     easiest way is to download the following text file, and copy + paste the character in a supporting editor
     *     such as Notepad++. Example (the character will not display correctly on this page):
     * ```
     * "OnTrigger#5": "res,RunScriptCode,NetProps.SetPropString(self, `m_iszMvMPopfileName`, `test`),0,-1"
     * ```
     * would instead be changed to
     * ```
     * "OnTrigger#5": "res�RunScriptCode�NetProps.SetPropString(self, `m_iszMvMPopfileName`, `test`)�0�-1"
     * ```
     * @note If using a complex model, usually custom models, it might cause stutters to the server when spawning it.
     *     To work around this issue instead spawn it with CreateByClassname and set its netprops manually, and don't
     *     forget to make sure the model is precached properly too.
     */
    function SpawnEntityFromTable(name: string, keyvalues: NutTable): CBaseEntity;


    /**
     * Hierarchically spawn an entity group from a set of spawn tables. This computes a spawn order for entities so
     * that parenting is resolved correctly. The table for this must take the following format. group can be any name,
     * as long as it's unique. Each group can only contain one entity. (The table is formatted like this as otherwise
     * it wouldn't be possible to spawn multiple entities of the same classname). The function always returns true,
     * even if entity spawning fails.
     * ```
     * {
     *     <group> =
     *     {
     *         <classname> =
     *         {
     *             // key - values
     *         }
     *     },
     *     // ...
     * }
     * ```
     * Example usage:
     * ```
     * SpawnEntityGroupFromTable(
     * {
     *    a =
     *    {
     *        info_particle_system =
     *        {
     *            origin = GetListenServerHost().GetOrigin(),
     *            parentname = "mytarget",
     *            effect_name = "soldierbuff_blue_soldier",
     *            start_active = true
     *        }
     *    },
     *    b =
     *    {
     *        info_particle_system =
     *        {
     *            origin = GetListenServerHost().GetOrigin(),
     *            parentname = "mytarget",
     *            effect_name = "soldierbuff_red_soldier",
     *            start_active = true
     *        }
     *    },
     * });
     * ```
     */
    function SpawnEntityGroupFromTable(groups: NutTable): boolean;

    /**
     * Stores a string as a file, located in the game's scriptdata folder.
     * @note This writes files in text mode, therefore binary files will not be written correctly.
     * @warning If writing multi-line strings directly, this may cause issues due to Window's encoding new lines as
     *     \r\n, but Mac/Linux encodes as \n. This can be fixed by setting EOL encoding to Unix in your text editor.
     */
    function StringToFile(file: string, string: string): void;

    /**
     * Get the current server time in seconds
     */
    function Time(): number;

    /**
     * Return fraction along line that hits world or models
     */
    function TraceLine(start: Vector, end: Vector, ignore: CBaseEntity): number;

    /**
     * Input Table: start, end, mask (optional), ignore (optional)
     * Output Table: pos, fraction, hit, enthit, allsolid, startpos, endpos, startsolid, plane_normal, plane_dist,
     * surface_name, surface_flags, surface_props Returns false if start or end is not specified.
     * @warning allsolid, enthit and startsolid output parameters may not exist depending on the inputs and results of
     *     the trace. Check if they exist first before using.
     * @note Default mask is `MASK_VISIBLE_AND_NPCS`, which is the combination of the following;
     * ```
     * CONTENTS_SOLID|CONTENTS_MOVEABLE|CONTENTS_OPAQUE|CONTENTS_MONSTER|CONTENTS_IGNORE_NODRAW_OPAQUE
     * ```
     * @note By default this will trace against the bounding box of models only. Add CONTENTS_HITBOX to the mask to
     *     instead perform precise hitbox tests.
     * @tip Traces can only ignore 1 entity at a time. For more flexible filtering, see this library.
     * @tip To trace against triggers, you will need to revert the trigger's collision group to `COLLISION_GROUP_NONE`,
     *     remove `FSOLID_NOT_SOLID` solid flags and then revert after the trace.
     * @param {NutTable} traceTable
     * @returns {boolean}
     */
    function TraceLineEx(traceTable: NutTable): boolean;

    /**
     * given 2 points & ent to ignore, return fraction along line that hits world, models, players or npcs
     */
    function TraceLinePlayersIncluded(from: Vector, to: Vector, ignore: CBaseEntity): number;

    /**
     Input Table: start, end, mask (optional), ignore (optional)
     Output Table: pos, fraction, hit, enthit, allsolid, startpos, endpos, startsolid, plane_normal, plane_dist,
     surface_name, surface_flags, surface_props Returns false if start or end is not specified.
     @warning allsolid, enthit and startsolid output parameters may not exist depending on the inputs and results of
      the trace. Check if they exist first before using.
     @note Default mask is `MASK_VISIBLE_AND_NPCS`, which is the combination of the following;
      ```
      CONTENTS_SOLID|CONTENTS_MOVEABLE|CONTENTS_OPAQUE|CONTENTS_MONSTER|CONTENTS_IGNORE_NODRAW_OPAQUE
      ```
     @tip Traces can only ignore 1 entity at a time. For more flexible filtering, see this library.
     @tip To trace against triggers, you will need to revert the trigger's collision group to `COLLISION_GROUP_NONE`,
      remove `FSOLID_NOT_SOLID` solid flags and then revert after the trace.
     @param {NutTable} traceTable
     @returns {boolean}
     */
    function TraceHull(traceTable: NutTable): boolean;

    /**
     * Generate a string guaranteed to be unique across the life of the script VM, with an optional root string. Useful
     * for adding data to tables when not sure what keys are already in use in that table.
     */
    function UniqueString(input: string): string;

    /**
     * Unknown; presumably an internal function called by `UniqueString`, so call that instead.
     */
    function DoUniqueString(input: string): string;

    function UsePlayerReadyStatusMode(): boolean;

    /**
     * Creates a new scope with the name of value in the submitted table (includes unique params).
     */
    function VSquirrel_OnCreateScope(value: unknown, scope: NutTable): NutTable;

    /**
     * Removes a scope created via VSquirrel_OnCreateScope.
     */
    function VSquirrel_OnReleaseScope(createdScope: NutTable): void;

    /**
     * Overloaded function. It's only used for this: __CollectEventCallbacks(scope, "OnGameEvent_",
     * "GameEventCallbacks", ::RegisterScriptGameEventListener)
     * @param scope
     * @param prefix
     * @param globalTableName
     * @param regFunc
     */
    function __CollectEventCallbacks(scope: unknown, prefix: string, globalTableName: string, regFunc: unknown): void;

    /**
     * Wrapper that registers callbacks for both OnGameEvent_x and OnScriptEvent_ functions. Done using the
     * __CollectEventCallbacks function.
     */
    function __CollectGameEventCallbacks(scope: NutTable): void;

    function __ReplaceClosures(script: unknown, scope: unknown): void;

    /**
     * Call all functions in the callback array for the given game event
     */
    function __RunEventCallbacks(event: string, params: unknown, prefix: string, globalTableName: string, bWarnIfMissing: boolean): void;

    /**
     * Wrapper for __RunEventCallbacks()
     */
    function __RunGameEventCallbacks(event: string, params: unknown): void;

    function __RunScriptHookCallbacks(event: string, param: unknown): void;
}