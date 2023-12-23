type NutTablePrimitive = number | string | boolean;
type NutTableValue = NutTablePrimitive | NutTablePrimitive[] | NutTable;
type NutTable = { [key: string]: NutTableValue };
type ScriptScope = { [key: string]: unknown }

//------------------------------------------------------------------------------------
// Squirrel Native
//------------------------------------------------------------------------------------
declare const RAND_MAX: number;

declare class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number);
}

declare class QAngle {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number);
}

//------------------------------------------------------------------------------------
// Globals
//------------------------------------------------------------------------------------
/**
 * Sets a function in the entity's script to rerun by itself constantly. Pass null as the function name to remove a think function. The default think interval is 0.1s, unless overridden by returning a different time interval in seconds in the think function
 * @tip Return -1 to think every tick. Do not return 0, this will give inconsistent intervals.
 * @note: If trying to clear a think function while inside a think function, this function alone will not work as the think function is restored on the entity after it's finished. NetProps.SetPropString(self, "m_iszScriptThinkFunction", ""); must be used to fully clear the think function.
 * @warning: This can apply to events if they are chained from a think function, for example killing a player with TakeDamage and then trying to clear the think function in player_death event. The think function will not be cleared unless the line above is also added.
 * @note Adding a think function will clear the EFL_NO_THINK_FUNCTION eflag, but the eflag can be added afterwards and the script think will still work.
 * @bug The think function name stored in the entity is not reset if null is passed as the function name. However this is harmless, and it will only show a warning in console.
 * @param ent
 * @param funcName
 */
declare function AddThinkToEnt(ent: CBaseEntity, funcName: string): void;

declare function AddToScriptHelp(): unknown;

declare function AllowThirdPersonCamera(): boolean;

declare function ArePlayersInHell(): boolean;

/**
 * Test value and if not true, throws exception, optionally with message.
 * @param value
 * @param optionalMessage
 */
declare function Assert(value: boolean, optionalMessage?: string): void;

/**
 * Empties the tables of game event callback functions.
 */
declare function ClearGameEventCallbacks(): void;

/**
 * Create a prop
 * @param classname
 * @param origin
 * @param model_name
 * @param activity
 */
declare function CreateProp(classname: string, origin: Vector, model_name: string, activity: number): CBaseEntity;

/**
 * Create a scene entity to play the specified scene.
 * @param scene
 */
declare function CreateSceneEntity(scene: string): CBaseEntity;

/**
 * The current level of the developer console variable.
 */
declare function developer(): number;

declare function SpawnEntityFromTable(name: EntityClassName, table: NutTable): CBaseEntity | null;

/**
 * Dispatches a one-off particle system
 * @bug The angles parameter is incorrectly defined as a Vector type rather than QAngle.
 * @bug This does not precache the particle! As a result, custom particles may show as a burst of red Xs instead. To precache a particle, use the following function:
 * ```
 * function PrecacheParticle(name)
 * {
 *     PrecacheEntityFromTable({ classname: "info_particle_system", effect_name: name })
 * }
 * ```
 * @bug To spawn particles that require to be tied to an entity, or require following a specific attachment, use a trigger_particle entity. Example:
 * ```
 * local entity = GetListenServerHost();
 * local particle_name = entity.GetTeam() == 2 ? "spy_start_disguise_red" : "spy_start_disguise_blue";
 * local particle = SpawnEntityFromTable("trigger_particle",
 * {
 *     particle_name = particle_name,
 *     attachment_type = 1, // PATTACH_ABSORIGIN_FOLLOW,
 *     spawnflags = 64 // allow everything
 * });
 * EntFireByHandle(particle, "StartTouch", "!activator", -1, entity, entity);
 * EntFireByHandle(particle, "Kill", "", -1, null, null);
 * ```
 * @note The effect will only appear for players that were in the PVS of the origin, at the time of dispatch. Use info_particle_system if everyone must see it.
 * @param name
 * @param origin
 * @param angles
 * @constructor
 */
declare function DispatchParticleEffect(name: string, origin: Vector, angles: Vector): void;

/**
 * Generate an entity I/O event. The caller and activator argument takes a CBaseEntity script handle, and entities assigned can receive inputs with target set to !self, or !activator / !caller.
 * @tip Use a -1 delay to consistently fire it at the end of the frame. 0 delay might bring inconsistent timing.
 * @note Does not work if the target string is point_servercommand.
 * @param target
 * @param action
 * @param value
 * @param delay
 * @param activator
 * @param caller
 * @constructor
 */
declare function DoEntFire(target: string, action: string, value: string, delay: number, activator: CBaseEntity, caller: CBaseEntity): void;

/**
 * Execute a script and put all its content for the argument passed to thescopeparameter. The file must have the .nut extension.
 * @warning Do not put uppercase letters in the path, doing so will cause Linux to fail loading the script from loose directories.
 * @param file
 * @param scope
 * @constructor
 */
declare function DoIncludeScript(file: string, scope?: NutTable): void;

/**
 * Wrapper for DoIncludeScript.
 * @param file
 * @param scope
 * @constructor
 */
declare function IncludeScript(file: string, scope?: NutTable): void;

//------------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------------
declare abstract class Constants {
    public static readonly EBotType: {
        readonly TF_BOT_TYPE: 1337;
    };

    public static readonly ECollisionGroup: {
        readonly COLLISION_GROUP_NONE: 0;
        readonly COLLISION_GROUP_DEBRIS: 1;
        readonly COLLISION_GROUP_DEBRIS_TRIGGER: 2;
        readonly COLLISION_GROUP_INTERACTIVE_DEBRIS: 3;
        readonly COLLISION_GROUP_INTERACTIVE: 4;
        readonly COLLISION_GROUP_PLAYER: 5;
        readonly COLLISION_GROUP_BREAKABLE_GLASS: 6;
        readonly COLLISION_GROUP_VEHICLE: 7;
        readonly COLLISION_GROUP_PLAYER_MOVEMENT: 8;
        readonly COLLISION_GROUP_NPC: 9;
        readonly COLLISION_GROUP_IN_VEHICLE: 10;
        readonly COLLISION_GROUP_WEAPON: 11;
        readonly COLLISION_GROUP_VEHICLE_CLIP: 12;
        readonly COLLISION_GROUP_PROJECTILE: 13;
        readonly COLLISION_GROUP_DOOR_BLOCKER: 14;
        readonly COLLISION_GROUP_PASSABLE_DOOR: 15;
        readonly COLLISION_GROUP_DISSOLVING: 16;
        readonly COLLISION_GROUP_PUSHAWAY: 17;
        readonly COLLISION_GROUP_NPC_ACTOR: 18;
        readonly COLLISION_GROUP_NPC_SCRIPTED: 19;
        readonly LAST_SHARED_COLLISION_GROUP: 20;

        readonly TFCOLLISIONGROUP_GRENADES: 20;
        readonly TFCOLLISION_GROUP_OBJECT: 21;
        readonly TFCOLLISION_GROUP_OBJECT_SOLIDTOPLAYERMOVEMENT: 22;
        readonly TFCOLLISION_GROUP_COMBATOBJECT: 23;
        readonly TFCOLLISION_GROUP_ROCKETS: 24;
        readonly TFCOLLISION_GROUP_RESPAWNROOMS: 25;
        readonly TFCOLLISION_GROUP_TANK: 26;
        readonly TFCOLLISION_GROUP_ROCKET_BUT_NOT_WITH_OTHER_ROCKETS: 27;
    };

    public static readonly ECritType: {
        readonly CRIT_NONE: 0;
        readonly CRIT_MINI: 1;
        readonly CRIT_FULL: 2;
    };

    public static readonly EHitGroup: {
        readonly HITGROUP_GENERIC: null | 0;
        readonly HITGROUP_HEAD: 1;
        readonly HITGROUP_CHEST: 2;
        readonly HITGROUP_STOMACH: 3;
        readonly HITGROUP_LEFTARM: 4;
        readonly HITGROUP_RIGHTARM: 5;
        readonly HITGROUP_LEFTLEG: 6;
        readonly HITGROUP_RIGHTLEG: 7;
        readonly HITGROUP_GEAR: 10;
    };

    public static readonly EHoliday: {
        readonly kHoliday_None: 0;
        readonly kHoliday_TFBirthday: 1;
        readonly kHoliday_Halloween: 2;
        readonly kHoliday_Christmas: 3;
        readonly kHoliday_CommunityUpdate: 4;
        readonly kHoliday_EOTL: 5;
        readonly kHoliday_Valentines: 6;
        readonly kHoliday_MeetThePyro: 7;
        readonly kHoliday_FullMoon: 8;
        readonly kHoliday_HalloweenOrFullMoon: 9;
        readonly kHoliday_HalloweenOrFullMoonOrValentines: 10;
        readonly kHoliday_AprilFools: 11;
        readonly kHoliday_Soldier: 12;
        readonly kHoliday_Summer: 13;
        readonly kHolidayCount: 14;
    };

    public static readonly EHudNotify: {
        readonly HUD_PRINTNOTIFY: 1;
        readonly HUD_PRINTCONSOLE: 2;
        readonly HUD_PRINTTALK: 3;
        readonly HUD_PRINTCENTER: 4;
    };

    public static readonly EMoveCollide: {
        readonly MOVECOLLIDE_DEFAULT: 0;
        readonly MOVECOLLIDE_FLY_BOUNCE: 1;
        readonly MOVECOLLIDE_FLY_CUSTOM: 2;
        readonly MOVECOLLIDE_FLY_SLIDE: 3;
        readonly MOVECOLLIDE_MAX_BITS: 3;
        readonly MOVECOLLIDE_COUNT: 4;
    };

    public static readonly EMoveTypes: {
        readonly MOVETYPE_NONE: 0;
        readonly MOVETYPE_ISOMETRIC: 1;
        readonly MOVETYPE_WALK: 2;
        readonly MOVETYPE_STEP: 3;
        readonly MOVETYPE_FLY: 4;
        readonly MOVETYPE_FLYGRAVITY: 5;
        readonly MOVETYPE_VPHYSICS: 6;
        readonly MOVETYPE_PUSH: 7;
        readonly MOVETYPE_NOCLIP: 8;
        readonly MOVETYPE_LADDER: 9;
        readonly MOVETYPE_OBSERVER: 10;
        readonly MOVETYPE_CUSTOM: 11;
        readonly MOVETYPE_LAST: 11;
    };

    public static readonly ENavCornerType: {
        readonly NORTH_WEST: 0;
        readonly NORTH_EAST: 1;
        readonly SOUTH_EAST: 2;
        readonly SOUTH_WEST: 3;
        readonly NUM_CORNERS: 4;
    };

    public static readonly ENavDirType: {
        readonly NORTH: 0;
        readonly EAST: 1;
        readonly SOUTH: 2;
        readonly WEST: 3;
        readonly NUM_DIRECTIONS: 4;
    };

    public static readonly ENavRelativeDirType: {
        readonly FORWARD: 0;
        readonly RIGHT: 1;
        readonly BACKWARD: 2;
        readonly LEFT: 3;
        readonly UP: 4;
        readonly DOWN: 5;
        readonly NUM_RELATIVE_DIRECTIONS: 6;
    };

    public static readonly ENavTraverseType: {
        readonly GO_NORTH: 0;
        readonly GO_EAST: 1;
        readonly GO_SOUTH: 2;
        readonly GO_WEST: 3;
        readonly GO_LADDER_UP: 4;
        readonly GO_LADDER_DOWN: 5;
        readonly GO_JUMP: 6;
        readonly GO_ELEVATOR_UP: 7;
        readonly GO_ELEVATOR_DOWN: 8;
        readonly NUM_TRAVERSE_TYPES: 9;
    };

    public static readonly ERenderFx: {
        readonly kRenderFxNone: 0;
        readonly kRenderFxPulseSlow: 1;
        readonly kRenderFxPulseFast: 2;
        readonly kRenderFxPulseSlowWide: 3;
        readonly kRenderFxPulseFastWide: 4;
        readonly kRenderFxFadeSlow: 5;
        readonly kRenderFxFadeFast: 6;
        readonly kRenderFxSolidSlow: 7;
        readonly kRenderFxSolidFast: 8;
        readonly kRenderFxStrobeSlow: 9;
        readonly kRenderFxStrobeFast: 10;
        readonly kRenderFxStrobeFaster: 11;
        readonly kRenderFxFlickerSlow: 12;
        readonly kRenderFxFlickerFast: 13;
        readonly kRenderFxNoDissipation: 14;
        readonly kRenderFxDistort: 15;
        readonly kRenderFxHologram: 16;
        readonly kRenderFxExplode: 17;
        readonly kRenderFxGlowShell: 18;
        readonly kRenderFxClampMinScale: 19;
        readonly kRenderFxEnvRain: 20;
        readonly kRenderFxEnvSnow: 21;
        readonly kRenderFxSpotlight: 22;
        readonly kRenderFxRagdoll: 23;
        readonly kRenderFxPulseFastWider: 24;
        readonly kRenderFxMax: 25;
    };

    public static readonly ERenderMode: {
        readonly kRenderNormal: 0;
        readonly kRenderTransColor: 1;
        readonly kRenderTransTexture: 2;
        readonly kRenderGlow: 3;
        readonly kRenderTransAlpha: 4;
        readonly kRenderTransAdd: 5;
        readonly kRenderEnvironmental: 6;
        readonly kRenderTransAddFrameBlend: 7;
        readonly kRenderTransAlphaAdd: 8;
        readonly kRenderWorldGlow: 9;
        readonly kRenderNone: 10;
        readonly kRenderModeCount: 11;
    };

    public static readonly ERoundState: {
        readonly GR_STATE_INIT: 0;
        readonly GR_STATE_PREGAME: 1;
        readonly GR_STATE_STARTGAME: 2;
        readonly GR_STATE_PREROUND: 3;
        readonly GR_STATE_RND_RUNNING: 4;
        readonly GR_STATE_TEAM_WIN: 5;
        readonly GR_STATE_RESTART: 6;
        readonly GR_STATE_STALEMATE: 7;
        readonly GR_STATE_GAME_OVER: 8;
        readonly GR_STATE_BONUS: 9;
        readonly GR_STATE_BETWEEN_RNDS: 10;
        readonly GR_NUM_ROUND_STATES: 11;
    };

    public static readonly EScriptRecipientFilter: {
        readonly RECIPIENT_FILTER_DEFAULT: 0;
        readonly RECIPIENT_FILTER_PAS_ATTENUATION: 1;
        readonly RECIPIENT_FILTER_PAS: 2;
        readonly RECIPIENT_FILTER_PVS: 3;
        readonly RECIPIENT_FILTER_SINGLE_PLAYER: 4;
        readonly RECIPIENT_FILTER_GLOBAL: 5;
        readonly RECIPIENT_FILTER_TEAM: 6;
    };

    public static readonly ESolidType: {
        readonly SOLID_NONE: 0;
        readonly SOLID_BSP: 1;
        readonly SOLID_BBOX: 2;
        readonly SOLID_OBB: 3;
        readonly SOLID_OBB_YAW: 4;
        readonly SOLID_CUSTOM: 5;
        readonly SOLID_VPHYSICS: 6;
        readonly SOLID_LAST: 7;
    };

    public static readonly ESpectatorMode: {
        readonly OBS_MODE_NONE: 0;
        readonly OBS_MODE_DEATHCAM: 1;
        readonly OBS_MODE_FREEZECAM: 2;
        readonly OBS_MODE_FIXED: 3;
        readonly OBS_MODE_IN_EYE: 4;
        readonly OBS_MODE_CHASE: 5;
        readonly OBS_MODE_POI: 6;
        readonly OBS_MODE_ROAMING: 7;
        readonly NUM_OBSERVER_MODES: 8;
    };

    public static readonly EStopwatchState: {
        readonly STOPWATCH_CAPTURE_TIME_NOT_SET: 0;
        readonly STOPWATCH_RUNNING: 1;
        readonly STOPWATCH_OVERTIME: 2;
    };

    public static readonly ETFBotDifficultyType: {
        readonly EASY: 0;
        readonly NORMAL: 1;
        readonly HARD: 2;
        readonly EXPERT: 3;
        readonly NUM_DIFFICULTY_LEVELS: 4;
        readonly UNDEFINED: -1;
    };

    public static readonly ETFClass: {
        readonly TF_CLASS_UNDEFINED: 0;
        readonly TF_CLASS_SCOUT: 1;
        readonly TF_CLASS_SNIPER: 2;
        readonly TF_CLASS_SOLDIER: 3;
        readonly TF_CLASS_DEMOMAN: 4;
        readonly TF_CLASS_MEDIC: 5;
        readonly TF_CLASS_HEAVYWEAPONS: 6;
        readonly TF_CLASS_PYRO: 7;
        readonly TF_CLASS_SPY: 8;
        readonly TF_CLASS_ENGINEER: 9;
        readonly TF_CLASS_CIVILIAN: 10;
        readonly TF_CLASS_COUNT_ALL: 11;
        readonly TF_CLASS_RANDOM: 12;
    };

    public static readonly ETFCond: {
        readonly TF_COND_AIMING: 0;
        readonly TF_COND_ZOOMED: 1;
        readonly TF_COND_DISGUISING: 2;
        readonly TF_COND_DISGUISED: 3;
        readonly TF_COND_STEALTHED: 4;
        readonly TF_COND_INVULNERABLE: 5;
        readonly TF_COND_TELEPORTED: 6;
        readonly TF_COND_TAUNTING: 7;
        readonly TF_COND_INVULNERABLE_WEARINGOFF: 8;
        readonly TF_COND_STEALTHED_BLINK: 9;
        readonly TF_COND_SELECTED_TO_TELEPORT: 10;
        readonly TF_COND_CRITBOOSTED: 11;
        readonly TF_COND_TMPDAMAGEBONUS: 12;
        readonly TF_COND_FEIGN_DEATH: 13;
        readonly TF_COND_PHASE: 14;
        readonly TF_COND_STUNNED: 15;
        readonly TF_COND_OFFENSEBUFF: 16;
        readonly TF_COND_SHIELD_CHARGE: 17;
        readonly TF_COND_DEMO_BUFF: 18;
        readonly TF_COND_ENERGY_BUFF: 19;
        readonly TF_COND_RADIUSHEAL: 20;
        readonly TF_COND_HEALTH_BUFF: 21;
        readonly TF_COND_BURNING: 22;
        readonly TF_COND_HEALTH_OVERHEALED: 23;
        readonly TF_COND_URINE: 24;
        readonly TF_COND_BLEEDING: 25;
        readonly TF_COND_DEFENSEBUFF: 26;
        readonly TF_COND_MAD_MILK: 27;
        readonly TF_COND_MEGAHEAL: 28;
        readonly TF_COND_REGENONDAMAGEBUFF: 29;
        readonly TF_COND_MARKEDFORDEATH: 30;
        readonly TF_COND_NOHEALINGDAMAGEBUFF: 31;
        readonly TF_COND_SPEED_BOOST: 32;
        readonly TF_COND_CRITBOOSTED_PUMPKIN: 33;
        readonly TF_COND_CRITBOOSTED_USER_BUFF: 34;
        readonly TF_COND_CRITBOOSTED_DEMO_CHARGE: 35;
        readonly TF_COND_SODAPOPPER_HYPE: 36;
        readonly TF_COND_CRITBOOSTED_FIRST_BLOOD: 37;
        readonly TF_COND_CRITBOOSTED_BONUS_TIME: 38;
        readonly TF_COND_CRITBOOSTED_CTF_CAPTURE: 39;
        readonly TF_COND_CRITBOOSTED_ON_KILL: 40;
        readonly TF_COND_CANNOT_SWITCH_FROM_MELEE: 41;
        readonly TF_COND_DEFENSEBUFF_NO_CRIT_BLOCK: 42;
        readonly TF_COND_REPROGRAMMED: 43;
        readonly TF_COND_CRITBOOSTED_RAGE_BUFF: 44;
        readonly TF_COND_DEFENSEBUFF_HIGH: 45;
        readonly TF_COND_SNIPERCHARGE_RAGE_BUFF: 46;
        readonly TF_COND_DISGUISE_WEARINGOFF: 47;
        readonly TF_COND_MARKEDFORDEATH_SILENT: 48;
        readonly TF_COND_DISGUISED_AS_DISPENSER: 49;
        readonly TF_COND_SAPPED: 50;
        readonly TF_COND_INVULNERABLE_HIDE_UNLESS_DAMAGED: 51;
        readonly TF_COND_INVULNERABLE_USER_BUFF: 52;
        readonly TF_COND_HALLOWEEN_BOMB_HEAD: 53;
        readonly TF_COND_HALLOWEEN_THRILLER: 54;
        readonly TF_COND_RADIUSHEAL_ON_DAMAGE: 55;
        readonly TF_COND_CRITBOOSTED_CARD_EFFECT: 56;
        readonly TF_COND_INVULNERABLE_CARD_EFFECT: 57;
        readonly TF_COND_MEDIGUN_UBER_BULLET_RESIST: 58;
        readonly TF_COND_MEDIGUN_UBER_BLAST_RESIST: 59;
        readonly TF_COND_MEDIGUN_UBER_FIRE_RESIST: 60;
        readonly TF_COND_MEDIGUN_SMALL_BULLET_RESIST: 61;
        readonly TF_COND_MEDIGUN_SMALL_BLAST_RESIST: 62;
        readonly TF_COND_MEDIGUN_SMALL_FIRE_RESIST: 63;
        readonly TF_COND_STEALTHED_USER_BUFF: 64;
        readonly TF_COND_MEDIGUN_DEBUFF: 65;
        readonly TF_COND_STEALTHED_USER_BUFF_FADING: 66;
        readonly TF_COND_BULLET_IMMUNE: 67;
        readonly TF_COND_BLAST_IMMUNE: 68;
        readonly TF_COND_FIRE_IMMUNE: 69;
        readonly TF_COND_PREVENT_DEATH: 70;
        readonly TF_COND_MVM_BOT_STUN_RADIOWAVE: 71;
        readonly TF_COND_HALLOWEEN_SPEED_BOOST: 72;
        readonly TF_COND_HALLOWEEN_QUICK_HEAL: 73;
        readonly TF_COND_HALLOWEEN_GIANT: 74;
        readonly TF_COND_HALLOWEEN_TINY: 75;
        readonly TF_COND_HALLOWEEN_IN_HELL: 76;
        readonly TF_COND_HALLOWEEN_GHOST_MODE: 77;
        readonly TF_COND_MINICRITBOOSTED_ON_KILL: 78;
        readonly TF_COND_OBSCURED_SMOKE: 79;
        readonly TF_COND_PARACHUTE_ACTIVE: 80;
        readonly TF_COND_BLASTJUMPING: 81;
        readonly TF_COND_HALLOWEEN_KART: 82;
        readonly TF_COND_HALLOWEEN_KART_DASH: 83;
        readonly TF_COND_BALLOON_HEAD: 84;
        readonly TF_COND_MELEE_ONLY: 85;
        readonly TF_COND_SWIMMING_CURSE: 86;
        readonly TF_COND_FREEZE_INPUT: 87;
        readonly TF_COND_HALLOWEEN_KART_CAGE: 88;
        readonly TF_COND_DONOTUSE_0: 89;
        readonly TF_COND_RUNE_STRENGTH: 90;
        readonly TF_COND_RUNE_HASTE: 91;
        readonly TF_COND_RUNE_REGEN: 92;
        readonly TF_COND_RUNE_RESIST: 93;
        readonly TF_COND_RUNE_VAMPIRE: 94;
        readonly TF_COND_RUNE_REFLECT: 95;
        readonly TF_COND_RUNE_PRECISION: 96;
        readonly TF_COND_RUNE_AGILITY: 97;
        readonly TF_COND_GRAPPLINGHOOK: 98;
        readonly TF_COND_GRAPPLINGHOOK_SAFEFALL: 99;
        readonly TF_COND_GRAPPLINGHOOK_LATCHED: 100;
        readonly TF_COND_GRAPPLINGHOOK_BLEEDING: 101;
        readonly TF_COND_AFTERBURN_IMMUNE: 102;
        readonly TF_COND_RUNE_KNOCKOUT: 103;
        readonly TF_COND_RUNE_IMBALANCE: 104;
        readonly TF_COND_CRITBOOSTED_RUNE_TEMP: 105;
        readonly TF_COND_PASSTIME_INTERCEPTION: 106;
        readonly TF_COND_SWIMMING_NO_EFFECTS: 107;
        readonly TF_COND_PURGATORY: 108;
        readonly TF_COND_RUNE_KING: 109;
        readonly TF_COND_RUNE_PLAGUE: 110;
        readonly TF_COND_RUNE_SUPERNOVA: 111;
        readonly TF_COND_PLAGUE: 112;
        readonly TF_COND_KING_BUFFED: 113;
        readonly TF_COND_TEAM_GLOWS: 114;
        readonly TF_COND_KNOCKED_INTO_AIR: 115;
        readonly TF_COND_COMPETITIVE_WINNER: 116;
        readonly TF_COND_COMPETITIVE_LOSER: 117;
        readonly TF_COND_HEALING_DEBUFF: 118;
        readonly TF_COND_PASSTIME_PENALTY_DEBUFF: 119;
        readonly TF_COND_GRAPPLED_TO_PLAYER: 120;
        readonly TF_COND_GRAPPLED_BY_PLAYER: 121;
        readonly TF_COND_PARACHUTE_DEPLOYED: 122;
        readonly TF_COND_GAS: 123;
        readonly TF_COND_BURNING_PYRO: 124;
        readonly TF_COND_ROCKETPACK: 125;
        readonly TF_COND_LOST_FOOTING: 126;
        readonly TF_COND_AIR_CURRENT: 127;
        readonly TF_COND_HALLOWEEN_HELL_HEAL: 128;
        readonly TF_COND_POWERUPMODE_DOMINANT: 129;
        readonly TF_COND_IMMUNE_TO_PUSHBACK: 130;
        readonly TF_COND_INVALID: -1;
    };

    public static readonly ETFDmgCustom: {
        readonly TF_DMG_CUSTOM_NONE: 0;
        readonly TF_DMG_CUSTOM_HEADSHOT: 1;
        readonly TF_DMG_CUSTOM_BACKSTAB: 2;
        readonly TF_DMG_CUSTOM_BURNING: 3;
        readonly TF_DMG_WRENCH_FIX: 4;
        readonly TF_DMG_CUSTOM_MINIGUN: 5;
        readonly TF_DMG_CUSTOM_SUICIDE: 6;
        readonly TF_DMG_CUSTOM_TAUNTATK_HADOUKEN: 7;
        readonly TF_DMG_CUSTOM_BURNING_FLARE: 8;
        readonly TF_DMG_CUSTOM_TAUNTATK_HIGH_NOON: 9;
        readonly TF_DMG_CUSTOM_TAUNTATK_GRAND_SLAM: 10;
        readonly TF_DMG_CUSTOM_PENETRATE_MY_TEAM: 11;
        readonly TF_DMG_CUSTOM_PENETRATE_ALL_PLAYERS: 12;
        readonly TF_DMG_CUSTOM_TAUNTATK_FENCING: 13;
        readonly TF_DMG_CUSTOM_PENETRATE_NONBURNING_TEAMMATE: 14;
        readonly TF_DMG_CUSTOM_TAUNTATK_ARROW_STAB: 15;
        readonly TF_DMG_CUSTOM_TELEFRAG: 16;
        readonly TF_DMG_CUSTOM_BURNING_ARROW: 17;
        readonly TF_DMG_CUSTOM_FLYINGBURN: 18;
        readonly TF_DMG_CUSTOM_PUMPKIN_BOMB: 19;
        readonly TF_DMG_CUSTOM_DECAPITATION: 20;
        readonly TF_DMG_CUSTOM_TAUNTATK_GRENADE: 21;
        readonly TF_DMG_CUSTOM_BASEBALL: 22;
        readonly TF_DMG_CUSTOM_CHARGE_IMPACT: 23;
        readonly TF_DMG_CUSTOM_TAUNTATK_BARBARIAN_SWING: 24;
        readonly TF_DMG_CUSTOM_AIR_STICKY_BURST: 25;
        readonly TF_DMG_CUSTOM_DEFENSIVE_STICKY: 26;
        readonly TF_DMG_CUSTOM_PICKAXE: 27;
        readonly TF_DMG_CUSTOM_ROCKET_DIRECTHIT: 28;
        readonly TF_DMG_CUSTOM_TAUNTATK_UBERSLICE: 29;
        readonly TF_DMG_CUSTOM_PLAYER_SENTRY: 30;
        readonly TF_DMG_CUSTOM_STANDARD_STICKY: 31;
        readonly TF_DMG_CUSTOM_SHOTGUN_REVENGE_CRIT: 32;
        readonly TF_DMG_CUSTOM_TAUNTATK_ENGINEER_GUITAR_SMASH: 33;
        readonly TF_DMG_CUSTOM_BLEEDING: 34;
        readonly TF_DMG_CUSTOM_GOLD_WRENCH: 35;
        readonly TF_DMG_CUSTOM_CARRIED_BUILDING: 36;
        readonly TF_DMG_CUSTOM_COMBO_PUNCH: 37;
        readonly TF_DMG_CUSTOM_TAUNTATK_ENGINEER_ARM_KILL: 38;
        readonly TF_DMG_CUSTOM_FISH_KILL: 39;
        readonly TF_DMG_CUSTOM_TRIGGER_HURT: 40;
        readonly TF_DMG_CUSTOM_DECAPITATION_BOSS: 41;
        readonly TF_DMG_CUSTOM_STICKBOMB_EXPLOSION: 42;
        readonly TF_DMG_CUSTOM_AEGIS_ROUND: 43;
        readonly TF_DMG_CUSTOM_FLARE_EXPLOSION: 44;
        readonly TF_DMG_CUSTOM_BOOTS_STOMP: 45;
        readonly TF_DMG_CUSTOM_PLASMA: 46;
        readonly TF_DMG_CUSTOM_PLASMA_CHARGED: 47;
        readonly TF_DMG_CUSTOM_PLASMA_GIB: 48;
        readonly TF_DMG_CUSTOM_PRACTICE_STICKY: 49;
        readonly TF_DMG_CUSTOM_EYEBALL_ROCKET: 50;
        readonly TF_DMG_CUSTOM_HEADSHOT_DECAPITATION: 51;
        readonly TF_DMG_CUSTOM_TAUNTATK_ARMAGEDDON: 52;
        readonly TF_DMG_CUSTOM_FLARE_PELLET: 53;
        readonly TF_DMG_CUSTOM_CLEAVER: 54;
        readonly TF_DMG_CUSTOM_CLEAVER_CRIT: 55;
        readonly TF_DMG_CUSTOM_SAPPER_RECORDER_DEATH: 56;
        readonly TF_DMG_CUSTOM_MERASMUS_PLAYER_BOMB: 57;
        readonly TF_DMG_CUSTOM_MERASMUS_GRENADE: 58;
        readonly TF_DMG_CUSTOM_MERASMUS_ZAP: 59;
        readonly TF_DMG_CUSTOM_MERASMUS_DECAPITATION: 60;
        readonly TF_DMG_CUSTOM_CANNONBALL_PUSH: 61;
        readonly TF_DMG_CUSTOM_TAUNTATK_ALLCLASS_GUITAR_RIFF: 62;
        readonly TF_DMG_CUSTOM_THROWABLE: 63;
        readonly TF_DMG_CUSTOM_THROWABLE_KILL: 64;
        readonly TF_DMG_CUSTOM_SPELL_TELEPORT: 65;
        readonly TF_DMG_CUSTOM_SPELL_SKELETON: 66;
        readonly TF_DMG_CUSTOM_SPELL_MIRV: 67;
        readonly TF_DMG_CUSTOM_SPELL_METEOR: 68;
        readonly TF_DMG_CUSTOM_SPELL_LIGHTNING: 69;
        readonly TF_DMG_CUSTOM_SPELL_FIREBALL: 70;
        readonly TF_DMG_CUSTOM_SPELL_MONOCULUS: 71;
        readonly TF_DMG_CUSTOM_SPELL_BLASTJUMP: 72;
        readonly TF_DMG_CUSTOM_SPELL_BATS: 73;
        readonly TF_DMG_CUSTOM_SPELL_TINY: 74;
        readonly TF_DMG_CUSTOM_KART: 75;
        readonly TF_DMG_CUSTOM_GIANT_HAMMER: 76;
        readonly TF_DMG_CUSTOM_RUNE_REFLECT: 77;
        readonly TF_DMG_CUSTOM_DRAGONS_FURY_IGNITE: 78;
        readonly TF_DMG_CUSTOM_DRAGONS_FURY_BONUS_BURNING: 79;
        readonly TF_DMG_CUSTOM_SLAP_KILL: 80;
        readonly TF_DMG_CUSTOM_CROC: 81;
        readonly TF_DMG_CUSTOM_TAUNTATK_GASBLAST: 82;
        readonly TF_DMG_CUSTOM_AXTINGUISHER_BOOSTED: 83;
        readonly TF_DMG_CUSTOM_KRAMPUS_MELEE: 84;
        readonly TF_DMG_CUSTOM_KRAMPUS_RANGED: 85;
        readonly TF_DMG_CUSTOM_END: 86;
    };

    public static readonly ETFTeam: {
        readonly TEAM_UNASSIGNED: null | 0;
        readonly TEAM_SPECTATOR: 1;
        readonly TF_TEAM_PVE_DEFENDERS: 2;
        readonly TF_TEAM_RED: 2;
        readonly TF_TEAM_BLUE: 3;
        readonly TF_TEAM_PVE_INVADERS: 3;
        readonly TF_TEAM_COUNT: 4;
        readonly TF_TEAM_PVE_INVADERS_GIANTS: 4;
        readonly TEAM_ANY: -2;
        readonly TEAM_INVALID: -1;
    };

    public static readonly Math: {
        readonly Zero: 0;
        readonly Epsilon: 1.19209e-07;
        readonly GoldenRatio: 1.61803;
        readonly One: 1;
        readonly Sqrt2: 1.41421;
        readonly Sqrt3: 1.73205;
        readonly E: 2.71828;
        readonly Pi: 3.14159;
        readonly Tau: 6.28319;
    };

    public static readonly Server: {
        readonly DIST_EPSILON: 0.03125;
        readonly MAX_PLAYERS: 101;
        readonly MAX_EDICTS: 2048;
    };

    public static readonly FButtons: {
        readonly IN_ATTACK: 1;
        readonly IN_JUMP: 2;
        readonly IN_DUCK: 4;
        readonly IN_FORWARD: 8;
        readonly IN_BACK: 16;
        readonly IN_USE: 32;
        readonly IN_CANCEL: 64;
        readonly IN_LEFT: 128;
        readonly IN_RIGHT: 256;
        readonly IN_MOVELEFT: 512;
        readonly IN_MOVERIGHT: 1024;
        readonly IN_ATTACK2: 2048;
        readonly IN_RUN: 4096;
        readonly IN_RELOAD: 8192;
        readonly IN_ALT1: 16384;
        readonly IN_ALT2: 32768;
        readonly IN_SCORE: 65536;
        readonly IN_SPEED: 131072;
        readonly IN_WALK: 262144;
        readonly IN_ZOOM: 524288;
        readonly IN_WEAPON1: 1048576;
        readonly IN_WEAPON2: 2097152;
        readonly IN_BULLRUSH: 4194304;
        readonly IN_GRENADE1: 8388608;
        readonly IN_GRENADE2: 16777216;
        readonly IN_ATTACK3: 33554432;
    };

    public static readonly FContents: {
        readonly CONTENTS_EMPTY: 0 | null;
        readonly CONTENTS_SOLID: 1;
        readonly CONTENTS_WINDOW: 2;
        readonly CONTENTS_AUX: 4;
        readonly CONTENTS_GRATE: 8;
        readonly CONTENTS_SLIME: 16;
        readonly CONTENTS_WATER: 32;
        readonly CONTENTS_BLOCKLOS: 64;
        readonly CONTENTS_OPAQUE: 128;
        readonly LAST_VISIBLE_CONTENTS: 128;
        readonly ALL_VISIBLE_CONTENTS: 255;
        readonly CONTENTS_TESTFOGVOLUME: 256;
        readonly CONTENTS_UNUSED: 512;
        readonly CONTENTS_UNUSED6: 1024;
        readonly CONTENTS_TEAM1: 2048;
        readonly CONTENTS_TEAM2: 4096;
        readonly CONTENTS_IGNORE_NODRAW_OPAQUE: 8192;
        readonly CONTENTS_MOVEABLE: 16384;
        readonly CONTENTS_AREAPORTAL: 32768;
        readonly CONTENTS_PLAYERCLIP: 65536;
        readonly CONTENTS_MONSTERCLIP: 131072;
        readonly CONTENTS_CURRENT_0: 262144;
        readonly CONTENTS_CURRENT_90: 524288;
        readonly CONTENTS_CURRENT_180: 1048576;
        readonly CONTENTS_CURRENT_270: 2097152;
        readonly CONTENTS_CURRENT_UP: 4194304;
        readonly CONTENTS_CURRENT_DOWN: 8388608;
        readonly CONTENTS_ORIGIN: 16777216;
        readonly CONTENTS_MONSTER: 33554432;
        readonly CONTENTS_DEBRIS: 67108864;
        readonly CONTENTS_DETAIL: 134217728;
        readonly CONTENTS_TRANSLUCENT: 268435456;
        readonly CONTENTS_LADDER: 536870912;
        readonly CONTENTS_HITBOX: 1073741824;
    };

    public static readonly FDmgType: {
        readonly DMG_GENERIC: null | 0;
        readonly DMG_CRUSH: 1;
        readonly DMG_BULLET: 2;
        readonly DMG_SLASH: 4;
        readonly DMG_BURN: 8;
        readonly DMG_VEHICLE: 16;
        readonly DMG_FALL: 32;
        readonly DMG_BLAST: 64;
        readonly DMG_CLUB: 128;
        readonly DMG_SHOCK: 256;
        readonly DMG_SONIC: 512;
        readonly DMG_ENERGYBEAM: 1024;
        readonly DMG_PREVENT_PHYSICS_FORCE: 2048;
        readonly DMG_NEVERGIB: 4096;
        readonly DMG_ALWAYSGIB: 8192;
        readonly DMG_DROWN: 16384;
        readonly DMG_PARALYZE: 32768;
        readonly DMG_NERVEGAS: 65536;
        readonly DMG_POISON: 131072;
        readonly DMG_RADIATION: 262144;
        readonly DMG_DROWNRECOVER: 524288;
        readonly DMG_ACID: 1048576;
        readonly DMG_SLOWBURN: 2097152;
        readonly DMG_REMOVENORAGDOLL: 4194304;
        readonly DMG_PHYSGUN: 8388608;
        readonly DMG_PLASMA: 16777216;
        readonly DMG_AIRBOAT: 33554432;
        readonly DMG_DISSOLVE: 67108864;
        readonly DMG_BLAST_SURFACE: 134217728;
        readonly DMG_DIRECT: 268435456;
        readonly DMG_BUCKSHOT: 536870912;
    };

    public static readonly FEntityEffects: {
        readonly EF_BONEMERGE: 1;
        readonly EF_BRIGHTLIGHT: 2;
        readonly EF_DIMLIGHT: 4;
        readonly EF_NOINTERP: 8;
        readonly EF_MAX_BITS: 10;
        readonly EF_NOSHADOW: 16;
        readonly EF_NODRAW: 32;
        readonly EF_NORECEIVESHADOW: 64;
        readonly EF_BONEMERGE_FASTCULL: 128;
        readonly EF_ITEM_BLINK: 256;
        readonly EF_PARENT_ANIMATES: 512;
    };

    public static readonly FEntityEFlags: {
        readonly EFL_KILLME: 1;
        readonly EFL_DORMANT: 2;
        readonly EFL_NOCLIP_ACTIVE: 4;
        readonly EFL_SETTING_UP_BONES: 8;
        readonly EFL_HAS_PLAYER_CHILD: 16;
        readonly EFL_KEEP_ON_RECREATE_ENTITIES: 16;
        readonly EFL_DIRTY_SHADOWUPDATE: 32;
        readonly EFL_NOTIFY: 64;
        readonly EFL_FORCE_CHECK_TRANSMIT: 128;
        readonly EFL_BOT_FROZEN: 256;
        readonly EFL_SERVER_ONLY: 512;
        readonly EFL_NO_AUTO_EDICT_ATTACH: 1024;
        readonly EFL_DIRTY_ABSTRANSFORM: 2048;
        readonly EFL_DIRTY_ABSVELOCITY: 4096;
        readonly EFL_DIRTY_ABSANGVELOCITY: 8192;
        readonly EFL_DIRTY_SURROUNDING_COLLISION_BOUNDS: 16384;
        readonly EFL_DIRTY_SPATIAL_PARTITION: 32768;
        readonly EFL_FORCE_ALLOW_MOVEPARENT: 65536;
        readonly EFL_IN_SKYBOX: 131072;
        readonly EFL_USE_PARTITION_WHEN_NOT_SOLID: 262144;
        readonly EFL_TOUCHING_FLUID: 524288;
        readonly EFL_IS_BEING_LIFTED_BY_BARNACLE: 1048576;
        readonly EFL_NO_ROTORWASH_PUSH: 2097152;
        readonly EFL_NO_THINK_FUNCTION: 4194304;
        readonly EFL_NO_GAME_PHYSICS_SIMULATION: 8388608;
        readonly EFL_CHECK_UNTOUCH: 16777216;
        readonly EFL_DONTBLOCKLOS: 33554432;
        readonly EFL_DONTWALKON: 67108864;
        readonly EFL_NO_DISSOLVE: 134217728;
        readonly EFL_NO_MEGAPHYSCANNON_RAGDOLL: 268435456;
        readonly EFL_NO_WATER_VELOCITY_CHANGE: 536870912;
        readonly EFL_NO_PHYSCANNON_INTERACTION: 1073741824;
        readonly EFL_NO_DAMAGE_FORCES: 2147483648;
    };

    public static readonly FHideHUD: {
        readonly HIDEHUD_WEAPONSELECTION: 1;
        readonly HIDEHUD_FLASHLIGHT: 2;
        readonly HIDEHUD_ALL: 4;
        readonly HIDEHUD_HEALTH: 8;
        readonly HIDEHUD_PLAYERDEAD: 16;
        readonly HIDEHUD_BITCOUNT: 17;
        readonly HIDEHUD_NEEDSUIT: 32;
        readonly HIDEHUD_MISCSTATUS: 64;
        readonly HIDEHUD_CHAT: 128;
        readonly HIDEHUD_CROSSHAIR: 256;
        readonly HIDEHUD_VEHICLE_CROSSHAIR: 512;
        readonly HIDEHUD_INVEHICLE: 1024;
        readonly HIDEHUD_BONUS_PROGRESS: 2048;
        readonly HIDEHUD_BUILDING_STATUS: 4096;
        readonly HIDEHUD_CLOAK_AND_FEIGN: 8192;
        readonly HIDEHUD_PIPES_AND_CHARGE: 16384;
        readonly HIDEHUD_METAL: 32768;
        readonly HIDEHUD_TARGET_ID: 65536;
    };

    public static readonly FNavAttributeType: {
        readonly NAV_MESH_INVALID: 0;
        readonly NAV_MESH_CROUCH: 1;
        readonly NAV_MESH_JUMP: 2;
        readonly NAV_MESH_PRECISE: 4;
        readonly NAV_MESH_NO_JUMP: 8;
        readonly NAV_MESH_STOP: 16;
        readonly NAV_MESH_RUN: 32;
        readonly NAV_MESH_WALK: 64;
        readonly NAV_MESH_AVOID: 128;
        readonly NAV_MESH_TRANSIENT: 256;
        readonly NAV_MESH_DONT_HIDE: 512;
        readonly NAV_MESH_STAND: 1024;
        readonly NAV_MESH_NO_HOSTAGES: 2048;
        readonly NAV_MESH_STAIRS: 4096;
        readonly NAV_MESH_NO_MERGE: 8192;
        readonly NAV_MESH_OBSTACLE_TOP: 16384;
        readonly NAV_MESH_CLIFF: 32768;
        readonly NAV_MESH_FIRST_CUSTOM: 65536;
        readonly NAV_MESH_LAST_CUSTOM: 67108864;
        readonly NAV_MESH_FUNC_COST: 536870912;
        readonly NAV_MESH_HAS_ELEVATOR: 1073741824;
        readonly NAV_MESH_NAV_BLOCKER: 2147483648;
    };

    public static readonly FPlayer: {
        readonly FL_ONGROUND: 1;
        readonly FL_DUCKING: 2;
        readonly FL_ANIMDUCKING: 4;
        readonly FL_WATERJUMP: 8;
        readonly PLAYER_FLAG_BITS: 11;
        readonly FL_ONTRAIN: 16;
        readonly FL_INRAIN: 32;
        readonly FL_FROZEN: 64;
        readonly FL_ATCONTROLS: 128;
        readonly FL_CLIENT: 256;
        readonly FL_FAKECLIENT: 512;
        readonly FL_INWATER: 1024;
        readonly FL_FLY: 2048;
        readonly FL_SWIM: 4096;
        readonly FL_CONVEYOR: 8192;
        readonly FL_NPC: 16384;
        readonly FL_GODMODE: 32768;
        readonly FL_NOTARGET: 65536;
        readonly FL_AIMTARGET: 131072;
        readonly FL_PARTIALGROUND: 262144;
        readonly FL_STATICPROP: 524288;
        readonly FL_GRAPHED: 1048576;
        readonly FL_GRENADE: 2097152;
        readonly FL_STEPMOVEMENT: 4194304;
        readonly FL_DONTTOUCH: 8388608;
        readonly FL_BASEVELOCITY: 16777216;
        readonly FL_WORLDBRUSH: 33554432;
        readonly FL_OBJECT: 67108864;
        readonly FL_KILLME: 134217728;
        readonly FL_ONFIRE: 268435456;
        readonly FL_DISSOLVING: 536870912;
        readonly FL_TRANSRAGDOLL: 1073741824;
        readonly FL_UNBLOCKABLE_BY_PLAYER: 2147483648;
    };

    public static readonly FSolid: {
        readonly FSOLID_CUSTOMRAYTEST: 1;
        readonly FSOLID_CUSTOMBOXTEST: 2;
        readonly FSOLID_NOT_SOLID: 4;
        readonly FSOLID_TRIGGER: 8;
        readonly FSOLID_MAX_BITS: 10;
        readonly FSOLID_NOT_STANDABLE: 16;
        readonly FSOLID_VOLUME_CONTENTS: 32;
        readonly FSOLID_FORCE_WORLD_ALIGNED: 64;
        readonly FSOLID_USE_TRIGGER_BOUNDS: 128;
        readonly FSOLID_ROOT_PARENT_ALIGNED: 256;
        readonly FSOLID_TRIGGER_TOUCH_DEBRIS: 512;
    };

    public static readonly FSurf: {
        readonly SURF_LIGHT: 1;
        readonly SURF_SKY2D: 2;
        readonly SURF_SKY: 4;
        readonly SURF_WARP: 8;
        readonly SURF_TRANS: 16;
        readonly SURF_NOPORTAL: 32;
        readonly SURF_TRIGGER: 64;
        readonly SURF_NODRAW: 128;
        readonly SURF_HINT: 256;
        readonly SURF_SKIP: 512;
        readonly SURF_NOLIGHT: 1024;
        readonly SURF_BUMPLIGHT: 2048;
        readonly SURF_NOSHADOWS: 4096;
        readonly SURF_NODECALS: 8192;
        readonly SURF_NOCHOP: 16384;
        readonly SURF_HITBOX: 32768;
    };

    public static readonly FTaunts: {
        readonly TAUNT_BASE_WEAPON: 0;
        readonly TAUNT_MISC_ITEM: 1;
        readonly TAUNT_SHOW_ITEM: 2;
        readonly TAUNT_LONG: 3;
        readonly TAUNT_SPECIAL: 4;
    };

    public static readonly FTFBotAttributeType: {
        readonly REMOVE_ON_DEATH: 1;
        readonly AGGRESSIVE: 2;
        readonly IS_NPC: 4;
        readonly SUPPRESS_FIRE: 8;
        readonly DISABLE_DODGE: 16;
        readonly BECOME_SPECTATOR_ON_DEATH: 32;
        readonly QUOTA_MANANGED: 64;
        readonly RETAIN_BUILDINGS: 128;
        readonly SPAWN_WITH_FULL_CHARGE: 256;
        readonly ALWAYS_CRIT: 512;
        readonly IGNORE_ENEMIES: 1024;
        readonly HOLD_FIRE_UNTIL_FULL_RELOAD: 2048;
        readonly PRIORITIZE_DEFENSE: 4096;
        readonly ALWAYS_FIRE_WEAPON: 8192;
        readonly TELEPORT_TO_HINT: 16384;
        readonly MINIBOSS: 32768;
        readonly USE_BOSS_HEALTH_BAR: 65536;
        readonly IGNORE_FLAG: 131072;
        readonly AUTO_JUMP: 262144;
        readonly AIR_CHARGE_ONLY: 524288;
        readonly PREFER_VACCINATOR_BULLETS: 1048576;
        readonly PREFER_VACCINATOR_BLAST: 2097152;
        readonly PREFER_VACCINATOR_FIRE: 4194304;
        readonly BULLET_IMMUNE: 8388608;
        readonly BLAST_IMMUNE: 16777216;
        readonly FIRE_IMMUNE: 33554432;
        readonly PARACHUTE: 67108864;
        readonly PROJECTILE_SHIELD: 134217728;
    };

    public static readonly FTFNavAttributeType: {
        readonly TF_NAV_INVALID: 0;
        readonly TF_NAV_BLOCKED: 1;
        readonly TF_NAV_SPAWN_ROOM_RED: 2;
        readonly TF_NAV_SPAWN_ROOM_BLUE: 4;
        readonly TF_NAV_SPAWN_ROOM_EXIT: 8;
        readonly TF_NAV_HAS_AMMO: 16;
        readonly TF_NAV_HAS_HEALTH: 32;
        readonly TF_NAV_CONTROL_POINT: 64;
        readonly TF_NAV_BLUE_SENTRY_DANGER: 128;
        readonly TF_NAV_RED_SENTRY_DANGER: 256;
        readonly TF_NAV_BLUE_SETUP_GATE: 2048;
        readonly TF_NAV_RED_SETUP_GATE: 4096;
        readonly TF_NAV_BLOCKED_AFTER_POINT_CAPTURE: 8192;
        readonly TF_NAV_BLOCKED_UNTIL_POINT_CAPTURE: 16384;
        readonly TF_NAV_BLUE_ONE_WAY_DOOR: 32768;
        readonly TF_NAV_RED_ONE_WAY_DOOR: 65536;
        readonly TF_NAV_WITH_SECOND_POINT: 131072;
        readonly TF_NAV_WITH_THIRD_POINT: 262144;
        readonly TF_NAV_WITH_FOURTH_POINT: 524288;
        readonly TF_NAV_WITH_FIFTH_POINT: 1048576;
        readonly TF_NAV_SNIPER_SPOT: 2097152;
        readonly TF_NAV_SENTRY_SPOT: 4194304;
        readonly TF_NAV_ESCAPE_ROUTE: 8388608;
        readonly TF_NAV_ESCAPE_ROUTE_VISIBLE: 16777216;
        readonly TF_NAV_NO_SPAWNING: 33554432;
        readonly TF_NAV_RESCUE_CLOSET: 67108864;
        readonly TF_NAV_BOMB_CAN_DROP_HERE: 134217728;
        readonly TF_NAV_DOOR_NEVER_BLOCKS: 268435456;
        readonly TF_NAV_DOOR_ALWAYS_BLOCKS: 536870912;
        readonly TF_NAV_UNBLOCKABLE: 1073741824;
        readonly TF_NAV_PERSISTENT_ATTRIBUTES: 1988098048;
    };
}

//------------------------------------------------------------------------------------
// CEntities
//------------------------------------------------------------------------------------
/**
 * An interface to find and iterate over the script handles for the entities in play. To iterate over a set of entities, pass null to the previous parameter in the appropriate method to start an iteration. A reference to a previously-found entity can be used instead to continue a search.
 */
declare class CEntities {
    /**
     * Creates an entity by classname.
     * @param classname
     */
    public CreateByClassname(classname: EntityClassName): CBaseEntity;

    /**
     * Dispatches spawn of an entity! Use this on entities created via CreateByClassname to actually spawn them into the world.
     * @note Calling this on players will cause them to respawn.
     * @param entity
     */
    public DispatchSpawn(entity: CBaseEntity): void;

    /**
     * Find entities by the string of their classname keyvalue. Pass 'null' value to start an iteration, or reference to a previously found entity to continue a search.
     * @note The classname keyvalue of an entity can be manipulated and does not necessarily reflect its code class. There might be entities that have a different classname than the one they are created with. For example, you can spawn a "prop_dynamic" then change its classname to "my_prop", and it will retain the functionality of its code class while also not showing up when searching for "prop_dynamic".
     * @param entity
     * @param classname
     */
    public FindByClassname(entity: CBaseEntity | null, classname: EntityClassName): CBaseEntity | null;

    /**
     * Find entities by classname nearest to a point within a radius.
     * @param classname
     * @param center
     * @param radius
     */
    public FindByClassnameNearest(classname: EntityClassName, center: Vector, radius: number): CBaseEntity | null;

    /**
     * Find entities by classname within a radius. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.
     * @param previous
     * @param classname
     * @param center
     * @param radius
     */
    public FindByClassnameWithin(previous: CBaseEntity | null, classname: EntityClassName, center: Vector, radius: number): CBaseEntity | null;

    /**
     * Find entities by the string of their model keyvalue. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.
     * @param previous
     * @param modelname
     */
    public FindByModel(previous: CBaseEntity | null, modelname: string): CBaseEntity | null;

    /**
     * Find entities by the string of their targetname keyvalue. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.
     * @param previous
     * @param targetname
     */
    public FindByName(previous: CBaseEntity | null, targetname: string): CBaseEntity | null;

    /**
     * Find entities by targetname nearest to a point within a radius.
     * @param targetname
     * @param center
     * @param radius
     */
    public FindByNameNearest(targetname: string, center: Vector, radius: number): CBaseEntity | null;

    /**
     * Find entities by targetname within a radius. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search
     * @param previous
     * @param targetname
     * @param center
     * @param radius
     */
    public FindByNameWithin(previous: CBaseEntity | null, targetname: string, center: Vector, radius: number): CBaseEntity | null;

    /**
     * Find entities by the string of their target keyvalue. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search
     * @param previous
     * @param target
     */
    public FindByTarget(previous: CBaseEntity | null, target: string): CBaseEntity | null;

    /**
     * Find entities within a radius. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search
     * @param previous
     * @param center
     * @param radius
     */
    public FindInSphere(previous: CBaseEntity | null, center: Vector, radius: number): CBaseEntity | null

    /**
     * Begin an iteration over the list of entities
     */
    public First(): CBaseEntity | null;

    /**
     * At the given reference of a previously-found entity, returns the next one after it in the list.
     * @param previous
     */
    public Next(previous: CBaseEntity): CBaseEntity | null;
}

/**
 * Provides access to currently spawned entities
 */
declare const Entities: CEntities;

//------------------------------------------------------------------------------------
// Entity Classes
//------------------------------------------------------------------------------------
/**
 * This is a script handle class for entities. All entities have a script handle using this class, sometimes as one of its subclasses.
 */
declare class CBaseEntity {
    /**
     * Behaves the same as KeyValueFromFloat, use that instead.
     * @param key
     * @param value
     */
    public __KeyValueFromFloat(key: string, value: number): boolean;

    /**
     * Behaves the same as KeyValueFromInt, use that instead.
     * @param key
     * @param value
     */
    public __KeyValueFromInt(key: string, value: number): boolean;

    /**
     * Behaves the same as KeyValueFromString, use that instead.
     * @param key
     * @param value
     */
    public __KeyValueFromString(key: string, value: string): boolean;

    /**
     * Behaves the same as KeyValueFromVector, use that instead.
     * @param key
     * @param value
     */
    public __KeyValueFromVector(key: string, value: Vector): boolean;

    /**
     * Adds the supplied flags to the Entity Flags in the entity. (m_iEFlags datamap)
     * See Constants.FEntityEFlags.
     * @param flags
     */
    public AddEFlags(flags: number): void;

    /**
     * Adds the supplied flags to another separate player-related entity flags system in the entity. (m_fFlags datamap)
     * See Constants.FPlayer.
     * @param flags
     */
    public AddFlag(flags: number): void;

    /**
     * Adds the supplied flags to the Solid Flags in the entity. (m_Collision.m_usSolidFlags datamap)
     * See Constants.FSolid.
     * @param flags
     */
    public AddSolidFlags(flags: number): void;

    /**
     * Apply a Velocity Impulse as a world space impulse vector. Works for most physics-based objects including dropped weapons and even dropped Sandviches.
     * @param impulse
     */
    public ApplyAbsVelocityImpulse(impulse: Vector): void;

    /**
     * Apply an Angular Velocity Impulse in entity local space. The direction of the input vector is the rotation axis, and the length is the magnitude of the impulse.
     * @param impulse
     */
    public ApplyLocalAngularVelocityImpulse(impulse: Vector): void;

    /**
     * Acts like the BecomeRagdoll input, with the required impulse value applied as a force on the ragdoll. Does NOT spawn a prop_ragdoll or any other entity.
     * @param impulse
     */
    public BecomeRagdollOnClient(impulse: Vector): boolean;

    /**
     * Sets the player-related entity flags to 0 on an entity, clearing them.
     */
    public ClearFlags(): void;

    /**
     * Sets Solid Flags to 0 on an entity, clearing them.
     */
    public ClearSolidFlags(): void;

    /**
     * Adds an I/O connection that will call the named function when the specified output fires.
     * @param output
     * @param func
     */
    public ConnectOutput(output: string, func: string): void;

    /**
     * Removes the entity. Simply calls UTIL_Remove.
     */
    public Destroy(): void;

    /**
     * Disable drawing and transmitting the entity to clients. (adds EF_NODRAW)
     */
    public DisableDraw(): void;

    /**
     * Removes a connected script function from an I/O event.
     * @param output
     * @param func
     */
    public DisconnectOutput(output: string, func: string): void;

    /**
     * Alternative dispatch spawn, same as the one in CEntities, for convenience.
     * @note Calling this on players will cause them to respawn.
     */
    public DispatchSpawn(): void;

    /**
     * Plays a sound from this entity.
     * @param sound
     */
    public EmitSound(sound: string): void;

    /**
     * Enable drawing and transmitting the entity to clients. (removes EF_NODRAW)
     */
    public EnableDraw(): void;

    /**
     * Returns the entity index.
     */
    public entindex(): number;

    /**
     * Returns the entity's eye angles. Acts like GetAbsAngles if the entity does not support it.
     */
    public EyeAngles(): QAngle;

    /**
     * Get vector to eye position - absolute coords. Acts like GetOrigin if the entity does not support it.
     */
    public EyePosition(): Vector;

    /**
     * Returns the most-recent entity parented to this one.
     * @tip: Example usage:
     *     for (local child = entity.FirstMoveChild(); child != null; child = child.NextMovePeer())
     */
    public FirstMoveChild(): CBaseEntity | null;

    /**
     * Get the entity's pitch, yaw, and roll as QAngles.
     */
    public GetAbsAngles(): QAngle;

    /**
     * Returns the current absolute velocity of the entity.
     */
    public GetAbsVelocity(): Vector;

    /**
     * Get the entity's pitch, yaw, and roll as a Vector.
     */
    public GetAngles(): Vector;

    /**
     *  Get the local angular velocity - returns a Vector of pitch, yaw, and roll.
     */
    public GetAngularVelocity(): Vector;

    /**
     *  Returns any constant velocity currently being imparted onto the entity. This includes being pushed by effects like trigger_push and players standing on moving geometry like elevators. Should always returns a zero vector if the entity is not affected by any movement effects.
     */
    public GetBaseVelocity(): Vector;

    /**
     * Get a vector containing max bounds, centered on object
     */
    public GetBoundingMaxs(): Vector;

    /**
     * Get a vector containing max bounds, centered on object, taking the object's orientation into account
     * @Bug: This does not transform the bounds correctly and in some cases the bounding box will not cover the whole entity. As a workaround, use the non-oriented bounds and perform an AABB transformation using a matrix constructed from the entity's origin and angles.
     */
    public GetBoundingMaxsOriented(): Vector;

    /**
     * Get a vector containing min bounds, centered on object
     */
    public GetBoundingMins(): Vector;

    /**
     * Get a vector containing min bounds, centered on object, taking the object's orientation into account
     * @bug This does not transform the bounds correctly and in some cases the bounding box will not cover the whole entity. As a workaround, use the non-oriented bounds and perform an AABB transformation using a matrix constructed from the entity's origin and angles.
     */
    public GetBoundingMinsOriented(): Vector;

    /**
     * Get vector to center of object - absolute coords
     */
    public GetCenter(): Vector;

    public GetClassname(): string;

    /**
     * Gets the current collision group of the entity.
     */
    public GetCollisionGroup(): number;

    public GetEFlags(): number;

    public GetFlags(): number;

    /**
     * Get the entity as an EHANDLE
     */
    public GetEntityHandle(): void;

    public GetEntityIndex(): number;

    /**
     * Get the forward vector of the entity
     */
    public GetForwardVector(): Vector;

    /**
     * Get PLAYER friction, ignored for objects
     */
    public GetFriction(): number;

    public GetGravity(): number;

    public GetHealth(): number;

    /**
     * Get the right vector of the entity. This is purely for compatibility.
     */
    public GetLeftVector(): Vector;

    public GetLocalAngles(): QAngle;

    public GetLocalOrigin(): Vector;

    /**
     * Get Entity relative velocity
     */
    public GetLocalVelocity(): Vector;

    public GetMaxHealth(): number;

    /**
     * Get a KeyValue class instance on this entity's model
     */
    public GetModelKeyValues(): NutTable;

    /**
     *  Returns the name of the model
     */
    public GetModelName(): string;

    /**
     * If in hierarchy, retrieves the entity's parent
     */
    public GetMoveParent(): CBaseEntity | null;

    public GetMoveType(): number;

    public GetName(): string;

    /**
     * This is GetAbsOrigin with a funny script name for some reason. Not changing it for legacy compat though.
     */
    public GetOrigin(): Vector;

    /**
     * Gets this entity's owner
     */
    public GetOwner(): CBaseEntity | null;

    public GetPhysAngularVelocity(): Vector;

    public GetPhysVelocity(): Vector;

    /**
     * Get the entity name stripped of template unique decoration
     */
    public GetPreTemplateName(): string;

    /**
     * Get the right vector of the entity
     */
    public GetRightVector(): Vector;

    /**
     * If in hierarchy, walks up the hierarchy to find the root parent
     */
    public GetRootMoveParent(): CBaseEntity | null;

    /**
     *  Retrieve the unique identifier used to refer to the entity within the scripting system.
     */
    public GetScriptId(): string;

    /**
     * Retrieve the script-side data associated with an entity
     */

    public GetScriptScope(): NutTable;

    /**
     * Retrieve the name of the current script think func
     */
    public GetScriptThinkFunc(): string;

    public GetSolid(): number;

    /**
     * Returns float duration of the sound. Actor model name is optional and can be left null.
     * @warning: Does not work on dedicated servers as they do not have audio libraries built-in to load sounds.
     * @param soundname
     * @param actormodelname
     * @constructor
     */
    public GetSoundDuration(soundname: string, actormodelname: string): number;

    public GetTeam(): number;

    /**
     * Get the up vector of the entity
     */
    public GetUpVector(): Vector;

    public GetVelocity(): Vector;

    /**
     * This function tells you how much of the entity is underwater. It returns a value of 0 if not underwater, 1 if the feet are (touching water brush), 2 if the waist is (center of the hull of the entity), and 3 if the head is (eyes position).
     * @note Some entities might not return 1 despite touching water. In some cases you might get 0 and 3 only, or sometimes 0, 2 and 3.
     */
    public GetWaterLevel(): number;

    /**
     * It returns the type of water the entity is currently submerged in. 32 for water and 16 for slime.
     */
    public GetWaterType(): number;

    public IsEFlagSet(eflag: number): boolean;

    /**
     * Checks whether the entity is a player or not.
     */
    public IsPlayer(): this is CBasePlayer;

    public IsSolid(): boolean;

    public IsSolidFlagSet(solidflag: number): boolean;

    /**
     * Checks whether the entity still exists. Useful when storing entity handles and needing to check if the entity was not deleted.
     * @note This function is never necessary to call on handles returned from built-in script functions, as they are guaranteed to be valid or null.
     */
    public IsValid(): boolean;

    /**
     * Executes KeyValue with a float
     * @warning Does not update the internal network state of the entity, which can result in any desired visual changes being delayed for clients if used after spawning. Netprops can be used instead which correctly updates the networking state and results in an immediate update.
     * @param key
     * @param value
     */
    public KeyValueFromFloat(key: string, value: number): boolean;

    /**
     * Executes KeyValue with an int
     * @warning Does not update the internal network state of the entity, which can result in any desired visual changes being delayed for clients if used after spawning. Netprops can be used instead which correctly updates the networking state and results in an immediate update.
     * @param key
     * @param value
     */
    public KeyValueFromInt(key: string, value: number): boolean;

    /**
     * Executes KeyValue with a string
     * @warning Does not update the internal network state of the entity, which can result in any desired visual changes being delayed for clients if used after spawning. Netprops can be used instead which correctly updates the networking state and results in an immediate update.
     * @param key
     * @param value
     */
    public KeyValueFromString(key: string, value: string): boolean;

    /**
     * Executes KeyValue with a vector
     * @warning Does not update the internal network state of the entity, which can result in any desired visual changes being delayed for clients if used after spawning. Netprops can be used instead which correctly updates the networking state and results in an immediate update.
     * @param key
     * @param value
     */
    KeyValueFromVector(key: string, value: Vector): boolean;

    /**
     * Removes the entity. Equivalent of firing the Kill I/O input, but instantaneous.
     */
    public Kill(): void;

    /**
     * Returns the entity's local eye angles
     */
    public LocalEyeAngles(): unknown;

    /**
     * Returns the next entity parented with the entity. Intended for iteration use with FirstMoveChild().
     */
    public NextMovePeer(): CBaseEntity | null;

    /**
     * Precache a model
     * @note This has no return, unlike the global PrecacheModel function. Use the latter if you need the model index.
     * @param modelname
     */
    public PrecacheModel(modelname: string): void;

    /**
     * Precache a sound script. Same as PrecacheSoundScript.
     * @param soundscript
     */
    public PrecacheScriptSound(soundscript: string): void;

    /**
     * Precache a sound script. Same as PrecacheScriptSound.
     * @param soundscript
     */
    public PrecacheSoundScript(soundscript: string): void;

    public RemoveEFlags(eflags: number): void;

    public RemoveFlag(flags: number): void;

    public RemoveSolidFlags(solidflags: number): void;

    /**
     * Set entity pitch, yaw, roll as QAngles
     * @note Does not work on players, use SnapEyeAngles instead.
     * @param angles
     */
    public SetAbsAngles(angles: QAngle): void;

    /**
     * Sets the current absolute velocity of the entity.
     * @note Does nothing on VPhysics objects (such as prop_physics). For those, use SetPhysVelocity instead.
     * @param velocity
     */
    public SetAbsVelocity(velocity: Vector): void;

    /**
     * Sets the absolute origin of the entity.
     * @param origin
     */
    public SetAbsOrigin(origin: Vector): void;

    /**
     * Set entity angles
     * @param pitch
     * @param yaw
     * @param roll
     */
    public SetAngles(pitch: number, yaw: number, roll: number): void;

    /**
     * Set the local angular velocity.
     * @param pitch
     * @param yaw
     * @param roll
     */
    public SetAngularVelocity(pitch: number, yaw: number, roll: number): void;

    /**
     * Set the current collision group of the entity.
     * See Constants.ECollisionGroup
     * @param collision_group
     * @constructor
     */
    public SetCollisionGroup(collision_group: number): void;

    /**
     * Enables drawing if you pass true, disables drawing if you pass false.
     * @param toggle
     */
    public SetDrawEnabled(toggle: boolean): void;

    public SetEFlags(eflags: number): void;

    /**
     * Set the orientation of the entity to have this forward vector
     * @param forward
     */
    public SetForwardVector(forward: Vector): void;

    public SetFriction(friction: number): void;

    public SetGravity(gravity: number): void;

    public SetHealth(health: number): void;

    public SetLocalAngles(angles: QAngle): void;

    public SetLocalOrigin(origin: Vector): void;

    /**
     * Sets the maximum health this entity can have. Does not update the current health, so SetHealth should be used afterwards.
     * @note Does nothing on players. Add the max health additive bonus attribute via AddCustomAttribute instead.
     * @param health
     */
    public SetMaxHealth(health: number): void;

    /**
     * Set a model for this entity.
     * @warning ake sure the model was already precached before using this function or otherwise the game will crash! Alternatively, SetModelSimple will precache the entity for you.
     */
    public SetModel(model: string): void;

    public SetMoveType(movetype: number, movecollide: number): void;

    public SetOrigin(origin: Vector): void;

    /**
     * Sets this entity's owner
     * @param entity
     */
    public SetOwner(entity: CBaseEntity): void;

    public SetPhysAngularVelocity(angular_velocity: Vector): void;

    public SetPhysVelocity(velocity: Vector): void;

    /**
     * Sets the bounding box's scale for this entity.
     * @warning If any component of mins/maxs is backwards (i.e. mins.x > maxs.x), the engine will exit with a fatal error.
     * @param mins
     * @param maxs
     */
    public SetSize(mins: Vector, maxs: Vector): void;

    public SetSolid(solid: number): void;

    public SetSolidFlags(solid_flags: number): void;

    /**
     * Sets entity team.
     * @note Use ForceChangeTeam on players instead.
     * @param team
     */
    public SetTeam(team: number): void;

    public SetVelocity(velocity: Vector): void;

    /**
     * This sets how much of the entity is underwater. Setting it to 0 means it is not underwater, 1 if the feet are (touching water brush), 2 if the waist is (center of the hull of the entity), and 3 if the head is (eyes position).
     * @param water_level
     */
    public SetWaterLevel(water_level: number): void;

    /**
     *  Set the type of water the entity is currently submerged in. Generic values to use are 32 for water and 16 for slime.
     * @param water_type
     */
    public SetWaterType(water_type: number): void;

    /**
     *  Stops a sound on this entity.
     * @param sound_name
     */
    public StopSound(sound_name: string): void;

    /**
     * Deals damage to the entity.
     * @param flDamage
     * @param nDamageType
     * @param hAttacker
     */
    public TakeDamage(flDamage: number, nDamageType: number, hAttacker: CBaseEntity): void;

    /**
     * Extended version of TakeDamage.
     * @note If vecDamageForce is Vector(0, 0, 0), the game will automatically calculate it from vecDamagePosition and flDamage. However, specifying a custom damage force requires a really, really big value to have visible effect (in the hundreds of thousands).
     * @param hInflictor
     * @param hAttacker
     * @param hWeapon
     * @param vecDamageForce
     * @param vecDamagePosition
     * @param flDamage
     * @param nDamageType
     */
    public TakeDamageEx(hInflictor: CBaseEntity, hAttacker: CBaseEntity, hWeapon: CBaseEntity, vecDamageForce: Vector, vecDamagePosition: Vector, flDamage: number, nDamageType: number): void;

    /**
     * Extended version of TakeDamageEx that can apply a custom damage type.
     * @param hInflictor
     * @param hAttacker
     * @param hWeapon
     * @param vecDamageForce
     * @param vecDamagePosition
     * @param flDamage
     * @param nDamageType
     * @param nCustomDamageType
     */
    public TakeDamageCustom(hInflictor: CBaseEntity, hAttacker: CBaseEntity, hWeapon: CBaseEntity, vecDamageForce: Vector, vecDamagePosition: Vector, flDamage: number, nDamageType: number, nCustomDamageType: number): void;

    /**
     * Teleports this entity. For this function, set the bools to false if you want that entity's property unchanged. (do not use null arguments!)
     * @param use_origin
     * @param origin
     * @param use_angles
     * @param angles
     * @param use_velocity
     * @param velocity
     */
    public Teleport(use_origin: boolean, origin: Vector, use_angles: boolean, angles: QAngle, use_velocity: boolean, velocity: Vector): void;

    /**
     *  Clear the current script scope for this entity
     */
    public TerminateScriptScope(): void;

    public ToggleFlag(flags: number): void;

    /**
     * Ensure that an entity's script scope has been created.
     * @tip On players, this only needs to be called once. Script scopes remain permanent on players until their entity is removed, i.e. disconnected. The best place to call this is in the player_spawn event when params.team equals 0 (unassigned). The event is always fired once for team unassigned when the player entity spawns. Similarly, for engineer buildings, this function can also be called once. The player_builtobject is fired when an engineer building is created (or re-placed after moving, but this shouldn't matter).
     */
    public ValidateScriptScope(): boolean;

}

declare class CBaseAnimating extends CBaseEntity {
    /**
     * Dispatch animation events to a CBaseAnimating entity.
     * @param entity
     */
    public DispatchAnimEvents(entity: CBaseEntity): void;

    /**
     * Find a bodygroup ID by name. Returns -1 if the bodygroup does not exist.
     * @param name
     */
    public FindBodygroupByName(name: string): number;

    /**
     * Get an attachment's angles as a QAngle, by ID.
     * @param ID
     */
    public GetAttachmentAngles(ID: number): QAngle

    /**
     *    Get an attachment's parent bone index by ID.
     * @param ID
     */
    public GetAttachmentBone(ID: number): number;

    /**
     * Get an attachment's origin as a Vector, by ID.
     * @param ID
     */
    public GetAttachmentOrigin(ID: number): Vector

    /**
     * Get the bodygroup value by bodygroup ID.
     * @param ID
     */
    public GetBodygroup(ID: number): number;

    /**
     * Get the bodygroup's name by ID
     * @param ID
     */
    public GetBodygroupName(ID: number): string;

    /**
     * Get the bodygroup's name by group and part.
     * @param group
     * @param part
     */
    public GetBodygroupPartName(group: number, part: number): string;

    /**
     * Get the bone's angles as a QAngle, by ID.
     * @param ID
     */
    public GetBoneAngles(ID: number): QAngle;

    /**
     *    Get the bone's origin Vector by ID.
     * @param ID
     */
    public GetBoneOrigin(ID: number): number;

    /**
     *    Gets the model's current animation cycle rate.
     */
    public GetCycle(): number;

    /**
     * Get the model's scale.
     */
    public GetModelScale(): number;

    /**
     *    Get the current animation's playback rate.
     */
    public GetPlaybackRate(): number;

    /**
     * Get the current-playing sequence's ID.
     */
    public GetSequence(): number;

    /**
     * Get the activity name for a sequence by sequence ID.
     * @param ID
     */
    public GetSequenceActivityName(ID: number): string;

    /**
     * Get a sequence duration in seconds by sequence ID.
     * @param ID
     */
    public GetSequenceDuration(ID: number): number;

    /**
     * Get a sequence name by sequence ID.
     * @param ID
     */
    public GetSequenceName(ID: number): string;

    /**
     * Gets the current skin index.
     */
    public GetSkin(): number;

    /**
     * Ask whether the main sequence is done playing.
     */
    public IsSequenceFinished(): boolean;

    /**
     * Get the named activity index. Returns -1 if the activity does not exist.
     * @param activity
     */
    public LookupActivity(activity: string): number;

    /**
     * @param name
     */
    public LookupAttachment(name: string): number;

    /**
     * Get the named bone index. Returns -1 if the bone does not exist.
     * @param bone
     */
    public LookupBone(bone: string): number;

    /**
     * Gets the pose parameter's index. Returns -1 if the pose parameter does not exist.
     */
    public LookupPoseParameter(name: string): number;

    /**
     * Looks up a sequence by names of sequences or activities. Returns -1 if the sequence does not exist.
     * @param name
     */
    public LookupSequence(name: string): number;

    /**
     * Reset a sequence by sequence ID. If the ID is different than the current sequence, switch to the new sequence.
     * @param ID
     */
    public ResetSequence(ID: number): void;

    /**
     * Set the bodygroup by ID.
     * @param ID
     * @param value
     */
    public SetBodygroup(ID: number, value: number): void;

    /**
     * Sets the model's current animation cycle from 0 to 1.
     * @note Does not work correctly on prop_dynamic. It will set the value (it interacts with DefaultAnim loop checking; set it to 1.0 and it restarts, and if set on a think function to anything less than 1.0 and it will stop looping) but the animation cycle visually won't be affected by it. You can set it to any value and the animation will not be on the desired cycle.
     * @param cycle
     */
    public SetCycle(cycle: number): void;

    /**
     * Set a model for this entity. Matches easier behaviour of the SetModel input, automatically precaches, maintains sequence/cycle if possible.
     * @param model_name
     */
    public SetModelSimple(model_name: string): void;

    /**
     * Changes a model's scale over time. Set the change duration to 0.0 to change the scale instantly.
     * @param scale
     * @param change_duration
     */
    public SetModelScale(scale: number, change_duration: number): void;

    /**
     * Set the current animation's playback rate.
     * @param rate
     */
    public SetPlaybackRate(rate: number): void;

    /**
     * Sets a pose parameter value. Returns the effective value after clamping or looping.
     * @param ID
     * @param value
     */
    public SetPoseParameter(ID: number, value: number): number;

    /**
     * Plays a sequence by sequence ID.
     * @warning This can cause animation stutters when transitioning between sequences. Using ResetSequence instead will prevent this. Only tested on base_boss.
     * @bug Does not set obj_sentrygun sequences correctly, use ResetSequence instead.
     * @param ID
     */
    public SetSequence(ID: number): void;

    /**
     * Sets the model's skin.
     * @param index
     */
    public SetSkin(index: number): void;

    /**
     * Stop the current animation (same as SetPlaybackRate 0.0)
     * @constructor
     */
    public StopAnimation(): void;

    /**
     * Advance animation frame to some time in the future with an automatically calculated interval
     * @constructor
     */
    public StudioFrameAdvance(): void;

    /**
     * Advance animation frame to some time in the future with a manual interval
     * @param dt
     * @constructor
     */
    public StudioFrameAdvanceManual(dt: number): void;
}


declare class CBaseFlex extends CBaseAnimating {
    public PlayScene(scene_file: string, delay: number): number;
}

declare class CBaseCombatCharacter extends CBaseFlex {
    // public GetLastKnownArea(): unknown;
}

declare class CBasePlayer extends CBaseCombatCharacter {
    public GetForceLocalDraw(): boolean;

    public GetPlayerMins(): Vector;

    public GetPlayerMaxs(): Vector;

    public GetScriptOverlayMaterial(): string;

    public IsNoclipping(): boolean;

    public SetForceLocalDraw(forceDraw: boolean): void;

    public SetScriptOverlayMaterial(material: string): void;

    public SnapEyeAngles(angles: QAngle): void;

    public ViewPunch(angleOffset: QAngle): void;

    public ViewPunchReset(tolerance: number): void;
}

declare class CTFPlayer extends CBasePlayer {
    public BleedPlayer(duration: number): void;

    public GetPlayerClass(): number;
}

declare function PlayerInstanceFromIndex(index: number): CBasePlayer | null;

declare function GetListenServerHost<T extends CBasePlayer = CTFPlayer>(): T | null;

declare function printf(format: string, ...args: any[]): void;

declare function printl(message: string): void;

declare function realPrintl(message: string): void;

declare function ShowMessage(message: string): void;

declare type EntityClassName = '_firesmoke'
    | '_plasma'
    | 'ai_ally_speech_manager'
    | 'ai_battle_line'
    | 'ai_changehintgroup'
    | 'ai_changetarget'
    | 'ai_goal_assault'
    | 'ai_goal_follow'
    | 'ai_goal_lead'
    | 'ai_goal_lead_weapon'
    | 'ai_goal_standoff'
    | 'ai_hint'
    | 'ai_network'
    | 'ai_relationship'
    | 'ai_script_conditions'
    | 'ai_sound'
    | 'ai_speechfilter'
    | 'aiscripted_schedule'
    | 'aitesthull'
    | 'ambient_generic'
    | 'assault_assaultpoint'
    | 'assault_rallypoint'
    | 'bot_action_point'
    | 'bot_controller'
    | 'bot_generator'
    | 'bot_hint_engineer_nest'
    | 'bot_hint_sentrygun'
    | 'bot_hint_sniper_spot'
    | 'bot_hint_teleporter_exit'
    | 'bot_proxy'
    | 'bot_roster'
    | 'color_correction'
    | 'color_correction_volume'
    | 'cycler'
    | 'cycler_actor'
    | 'cycler_flex'
    | 'dispenser_touch_trigger'
    | 'dynamic_prop'
    | 'entity_bird'
    | 'entity_blocker'
    | 'entity_carrier'
    | 'entity_croc'
    | 'entity_medigun_shield'
    | 'entity_revive_marker'
    | 'entity_rocket'
    | 'entity_saucer'
    | 'entity_sign'
    | 'entity_soldier_statue'
    | 'entity_spawn_manager'
    | 'entity_spawn_point'
    | 'entityflame'
    | 'env_beam'
    | 'env_beverage'
    | 'env_blood'
    | 'env_bubbles'
    | 'env_credits'
    | 'env_cubemap'
    | 'env_debughistory'
    | 'env_detail_controller'
    | 'env_dustpuff'
    | 'env_dusttrail'
    | 'env_effectscript'
    | 'env_embers'
    | 'env_entity_dissolver'
    | 'env_entity_igniter'
    | 'env_entity_maker'
    | 'env_explosion'
    | 'env_fade'
    | 'env_fire'
    | 'env_fire_trail'
    | 'env_firesensor'
    | 'env_firesource'
    | 'env_fog_controller'
    | 'env_funnel'
    | 'env_global'
    | 'env_glow'
    | 'env_gunfire'
    | 'env_hudhint'
    | 'env_laser'
    | 'env_laserdot'
    | 'env_lightglow'
    | 'env_message'
    | 'env_microphone'
    | 'env_movieexplosion'
    | 'env_muzzleflash'
    | 'env_particle_performance_monitor'
    | 'env_particle_trail'
    | 'env_particlefire'
    | 'env_particlelight'
    | 'env_particlescript'
    | 'env_particlesmokegrenade'
    | 'env_physexplosion'
    | 'env_physimpact'
    | 'env_physwire'
    | 'env_player_surface_trigger'
    | 'env_projectedtexture'
    | 'env_quadraticbeam'
    | 'env_ragdoll_boogie'
    | 'env_rockettrail'
    | 'env_rotorshooter'
    | 'env_rotorwash_emitter'
    | 'env_screeneffect'
    | 'env_screenoverlay'
    | 'env_shake'
    | 'env_shooter'
    | 'env_smokestack'
    | 'env_smoketrail'
    | 'env_sniperdot'
    | 'env_soundscape'
    | 'env_soundscape_proxy'
    | 'env_soundscape_triggerable'
    | 'env_spark'
    | 'env_splash'
    | 'env_sporeexplosion'
    | 'env_sporetrail'
    | 'env_sprite'
    | 'env_sprite_oriented'
    | 'env_spritetrail'
    | 'env_steam'
    | 'env_steamjet'
    | 'env_sun'
    | 'env_texturetoggle'
    | 'env_tonemap_controller'
    | 'env_tracer'
    | 'env_viewpunch'
    | 'env_wind'
    | 'env_zoom'
    | 'event_queue_saveload_proxy'
    | 'eyeball_boss'
    | 'filter_activator_class'
    | 'filter_activator_mass_greater'
    | 'filter_activator_name'
    | 'filter_activator_tfteam'
    | 'filter_damage_type'
    | 'filter_enemy'
    | 'filter_multi'
    | 'filter_tf_bot_has_tag'
    | 'filter_tf_class'
    | 'filter_tf_condition'
    | 'filter_tf_damaged_by_weapon_in_slot'
    | 'filter_tf_player_can_cap'
    | 'fish'
    | 'funCBaseFlex'
    | 'func_areaportal'
    | 'func_areaportalwindow'
    | 'func_breakable'
    | 'func_breakable_surf'
    | 'func_brush'
    | 'func_button'
    | 'func_capturezone'
    | 'func_changeclass'
    | 'func_clip_vphysics'
    | 'func_conveyor'
    | 'func_croc'
    | 'func_detail'
    | 'func_door'
    | 'func_door_rotating'
    | 'func_dustcloud'
    | 'func_dustmotes'
    | 'func_fish_pool'
    | 'func_flag_alert'
    | 'func_flagdetectionzone'
    | 'func_forcefield'
    | 'func_guntarget'
    | 'func_illusionary'
    | 'func_instance'
    | 'func_instance_parms'
    | 'func_ladderendpoint'
    | 'func_lod'
    | 'func_monitor'
    | 'func_movelinear'
    | 'func_nav_avoid'
    | 'func_nav_avoidance_obstacle'
    | 'func_nav_blocker'
    | 'func_nav_prefer'
    | 'func_nav_prerequisite'
    | 'func_nobuild'
    | 'func_nogrenades'
    | 'func_occluder'
    | 'func_passtime_goal'
    | 'func_passtime_goalie_zone'
    | 'func_passtime_no_ball_zone'
    | 'func_physbox'
    | 'func_platrot'
    | 'func_powerupvolume'
    | 'func_precipitation'
    | 'func_proprrespawnzone'
    | 'func_reflective_glass'
    | 'func_regenerate'
    | 'func_respawnflag'
    | 'func_respawnroom'
    | 'func_respawnroomvisualizer'
    | 'func_rot_button'
    | 'func_rotating'
    | 'func_smokevolume'
    | 'func_suggested_build'
    | 'func_tanktrain'
    | 'func_tfbot_hint'
    | 'func_trackautochange'
    | 'func_trackchange'
    | 'func_tracktrain'
    | 'func_traincontrols'
    | 'func_upgradestation'
    | 'func_useableladder'
    | 'func_vehicleclip'
    | 'func_viscluster'
    | 'func_wall'
    | 'func_wall_toggle'
    | 'func_water_analog'
    | 'game_end'
    | 'game_forcerespawn'
    | 'game_gib_manager'
    | 'game_intro_viewpoint'
    | 'game_player_equip'
    | 'game_player_team'
    | 'game_ragdoll_manager'
    | 'game_round_win'
    | 'game_score'
    | 'game_text'
    | 'game_text_tf'
    | 'game_ui'
    | 'game_weapon_manager'
    | 'game_zone_player'
    | 'ghost'
    | 'gibshooter'
    | 'halloween_fortune_teller'
    | 'halloween_souls_pack'
    | 'halloween_zapper'
    | 'hammer_updateignorelist'
    | 'headless_hatman'
    | 'hightower_teleport_vortex'
    | 'info_camera_link'
    | 'info_constraint_anchor'
    | 'info_hint'
    | 'info_intermission'
    | 'info_ladder_dismount'
    | 'info_landmark'
    | 'info_lighting'
    | 'info_mass_center'
    | 'info_no_dynamic_shadow'
    | 'info_node'
    | 'info_node_air'
    | 'info_node_air_hint'
    | 'info_node_climb'
    | 'info_node_hint'
    | 'info_node_link'
    | 'info_node_link_controller'
    | 'info_npc_spawn_destination'
    | 'info_null'
    | 'info_observer_point'
    | 'info_overlay'
    | 'info_overlay_accessor'
    | 'info_overlay_transition'
    | 'info_particle_system'
    | 'info_passtime_ball_spawn'
    | 'info_player_deathmatch'
    | 'info_player_start'
    | 'info_player_teamspawn'
    | 'info_populator'
    | 'info_powerup_spawn'
    | 'info_projecteddecal'
    | 'info_radial_link_controller'
    | 'info_target'
    | 'info_teleport_destination'
    | 'infodecal'
    | 'instanced_scripted_scene'
    | 'item_ammopack_full'
    | 'item_ammopack_medium'
    | 'item_ammopack_small'
    | 'item_bonuspack'
    | 'item_currencypack_custom'
    | 'item_currencypack_large'
    | 'item_currencypack_medium'
    | 'item_currencypack_small'
    | 'item_healthammokit'
    | 'item_healthkit_full'
    | 'item_healthkit_medium'
    | 'item_healthkit_small'
    | 'item_powerup_crit'
    | 'item_powerup_rune'
    | 'item_powerup_rune_temp'
    | 'item_powerup_uber'
    | 'item_sodacan'
    | 'item_teamflag'
    | 'item_teamflag_return_icon'
    | 'keyframe_rope'
    | 'keyframe_track'
    | 'light'
    | 'light_dynamic'
    | 'light_environment'
    | 'light_spot'
    | 'logic_active_autosave'
    | 'logic_auto'
    | 'logic_autosave'
    | 'logic_branch'
    | 'logic_branch_listener'
    | 'logic_case'
    | 'logic_choreographed_scene'
    | 'logic_collision_pair'
    | 'logic_compare'
    | 'logic_lineto'
    | 'logic_measure_movement'
    | 'logic_multicompare'
    | 'logic_navigation'
    | 'logic_playerproxy'
    | 'logic_proximity'
    | 'logic_relay'
    | 'logic_scene_list_manager'
    | 'logic_timer'
    | 'mapobj_cart_dispenser'
    | 'material_modify_control'
    | 'math_colorblend'
    | 'math_counter'
    | 'math_remap'
    | 'merasmus'
    | 'merasmus_dancer'
    | 'momentary_rot_button'
    | 'monster_furniture'
    | 'monster_generic'
    | 'move_keyframed'
    | 'move_rope'
    | 'move_track'
    | 'npc_concussiongrenade'
    | 'npc_contactgrenade'
    | 'npc_furniture'
    | 'npc_handgrenade'
    | 'npc_maker'
    | 'npc_puppet'
    | 'npc_template_maker'
    | 'npc_vehicledriver'
    | 'obj_attachment_sapper'
    | 'obj_dispenser'
    | 'obj_sentrygun'
    | 'obj_teleporter'
    | 'passtime_ball'
    | 'passtime_logic'
    | 'path_corner'
    | 'path_corner_crash'
    | 'path_track'
    | 'pd_dispenser'
    | 'phys_ballsocket'
    | 'phys_constraint'
    | 'phys_constraintsystem'
    | 'phys_convert'
    | 'phys_hinge'
    | 'phys_keepupright'
    | 'phys_lengthconstraint'
    | 'phys_magnet'
    | 'phys_motor'
    | 'phys_pulleyconstraint'
    | 'phys_ragdollconstraint'
    | 'phys_ragdollmagnet'
    | 'phys_slideconstraint'
    | 'phys_spring'
    | 'phys_thruster'
    | 'phys_torque'
    | 'physics_cannister'
    | 'player'
    | 'player_loadsaved'
    | 'player_manager'
    | 'player_speedmod'
    | 'player_weaponstrip'
    | 'point_anglesensor'
    | 'point_angularvelocitysensor'
    | 'point_bonusmaps_accessor'
    | 'point_camera'
    | 'point_clientcommand'
    | 'point_commentary_node'
    | 'point_devshot_camera'
    | 'point_enable_motion_fixup'
    | 'point_gamestats_counter'
    | 'point_hurt'
    | 'point_intermission'
    | 'point_message'
    | 'point_playermoveconstraint'
    | 'point_populator_interface'
    | 'point_posecontroller'
    | 'point_proximity_sensor'
    | 'point_servercommand'
    | 'point_spotlight'
    | 'point_teleport'
    | 'point_template'
    | 'point_tesla'
    | 'point_velocitysensor'
    | 'point_viewcontrol'
    | 'populator_internal_spawn_point'
    | 'prop_detail'
    | 'prop_door_rotating'
    | 'prop_dynamic'
    | 'prop_dynamic_ornament'
    | 'prop_dynamic_override'
    | 'prop_physics'
    | 'prop_physics_multiplayer'
    | 'prop_physics_override'
    | 'prop_ragdoll'
    | 'prop_soccer_ball'
    | 'prop_static'
    | 'prop_vehicle'
    | 'prop_vehicle_driveable'
    | 'rd_robot_dispenser'
    | 'scene_manager'
    | 'script_intro'
    | 'scripted_scene'
    | 'scripted_sentence'
    | 'scripted_sequence'
    | 'scripted_target'
    | 'shadow_control'
    | 'simple_bot'
    | 'simple_physics_brush'
    | 'simple_physics_prop'
    | 'sky_camera'
    | 'soundent'
    | 'tank_boss'
    | 'tank_destruction'
    | 'tanktrain_ai'
    | 'tanktrain_aitarget'
    | 'team_control_point'
    | 'team_control_point_master'
    | 'team_control_point_round'
    | 'team_round_timer'
    | 'team_train_watcher'
    | 'test_traceline'
    | 'tf_ammo_pack'
    | 'tf_base_minigame'
    | 'tf_bonus_duck_pickup'
    | 'tf_bot'
    | 'tf_dropped_weapon'
    | 'tf_flame'
    | 'tf_flame_rocket'
    | 'tf_gamerules'
    | 'tf_generic_bomb'
    | 'tf_glow'
    | 'tf_halloween_gift_pickup'
    | 'tf_halloween_gift_spawn_location'
    | 'tf_halloween_minigame'
    | 'tf_halloween_minigame_falling_platforms'
    | 'tf_halloween_pickup'
    | 'tf_logic_arena'
    | 'tf_logic_bonusround'
    | 'tf_logic_boss_battle'
    | 'tf_logic_competitive'
    | 'tf_logic_cp_timer'
    | 'tf_logic_holiday'
    | 'tf_logic_hybrid_ctf_cp'
    | 'tf_logic_koth'
    | 'tf_logic_mann_vs_machine'
    | 'tf_logic_medieval'
    | 'tf_logic_minigames'
    | 'tf_logic_multiple_escort'
    | 'tf_logic_on_holiday'
    | 'tf_logic_player_destruction'
    | 'tf_logic_raid'
    | 'tf_logic_robot_destruction'
    | 'tf_logic_training_mode'
    | 'tf_mann_vs_machine_stats'
    | 'tf_merasmus_trick_or_treat_prop'
    | 'tf_objective_resource'
    | 'tf_pda_expansion_dispenser'
    | 'tf_pda_expansion_teleporter'
    | 'tf_player_manager'
    | 'tf_point_nav_interface'
    | 'tf_point_weapon_mimic'
    | 'tf_populator'
    | 'tf_powerup_bottle'
    | 'tf_projectile_arrow'
    | 'tf_projectile_ball_ornament'
    | 'tf_projectile_balloffire'
    | 'tf_projectile_cleaver'
    | 'tf_projectile_energy_ball'
    | 'tf_projectile_energy_ring'
    | 'tf_projectile_flare'
    | 'tf_projectile_grapplinghook'
    | 'tf_projectile_healing_bolt'
    | 'tf_projectile_jar'
    | 'tf_projectile_jar_gas'
    | 'tf_projectile_jar_milk'
    | 'tf_projectile_lightningorb'
    | 'tf_projectile_pipe'
    | 'tf_projectile_pipe_remote'
    | 'tf_projectile_rocket'
    | 'tf_projectile_sentryrocket'
    | 'tf_projectile_spellbats'
    | 'tf_projectile_spellfireball'
    | 'tf_projectile_spellkartbats'
    | 'tf_projectile_spellkartorb'
    | 'tf_projectile_spellmeteorshower'
    | 'tf_projectile_spellmirv'
    | 'tf_projectile_spellpumpkin'
    | 'tf_projectile_spellspawnboss'
    | 'tf_projectile_spellspawnhorde'
    | 'tf_projectile_spellspawnzombie'
    | 'tf_projectile_spelltransposeteleport'
    | 'tf_projectile_stun_ball'
    | 'tf_projectile_syringe'
    | 'tf_projectile_throwable'
    | 'tf_projectile_throwable_breadmonster'
    | 'tf_projectile_throwable_brick'
    | 'tf_projectile_throwable_repel'
    | 'tf_pumpkin_bomb'
    | 'tf_ragdoll'
    | 'tf_robot_destruction_robot'
    | 'tf_robot_destruction_robot_spawn'
    | 'tf_robot_destruction_spawn_group'
    | 'tf_spawner'
    | 'tf_spell_meteorshowerspawner'
    | 'tf_spell_pickup'
    | 'tf_target_dummy'
    | 'tf_taunt_prop'
    | 'tf_team'
    | 'tf_teleport_location'
    | 'tf_template_stun_drone'
    | 'tf_viewmodel'
    | 'tf_weapon_base'
    | 'tf_weapon_bat'
    | 'tf_weapon_bat_fish'
    | 'tf_weapon_bat_giftwrap'
    | 'tf_weapon_bat_wood'
    | 'tf_weapon_bonesaw'
    | 'tf_weapon_bottle'
    | 'tf_weapon_breakable_sign'
    | 'tf_weapon_buff_item'
    | 'tf_weapon_builder'
    | 'tf_weapon_cannon'
    | 'tf_weapon_charged_smg'
    | 'tf_weapon_cleaver'
    | 'tf_weapon_club'
    | 'tf_weapon_compound_bow'
    | 'tf_weapon_crossbow'
    | 'tf_weapon_drg_pomson'
    | 'tf_weapon_fireaxe'
    | 'tf_weapon_fists'
    | 'tf_weapon_flamethrower'
    | 'tf_weapon_flaregun'
    | 'tf_weapon_flaregun_revenge'
    | 'tf_weapon_grapplinghook'
    | 'tf_weapon_grenadelauncher'
    | 'tf_weapon_handgun_scout_primary'
    | 'tf_weapon_handgun_scout_secondary'
    | 'tf_weapon_invis'
    | 'tf_weapon_jar'
    | 'tf_weapon_jar_gas'
    | 'tf_weapon_jar_milk'
    | 'tf_weapon_katana'
    | 'tf_weapon_knife'
    | 'tf_weapon_laser_pointer'
    | 'tf_weapon_lunchbox'
    | 'tf_weapon_lunchbox_drink'
    | 'tf_weapon_mechanical_arm'
    | 'tf_weapon_medigun'
    | 'tf_weapon_minigun'
    | 'tf_weapon_parachute'
    | 'tf_weapon_parachute_primary'
    | 'tf_weapon_parachute_secondary'
    | 'tf_weapon_particle_cannon'
    | 'tf_weapon_passtime_gun'
    | 'tf_weapon_pda_engineer_build'
    | 'tf_weapon_pda_engineer_destroy'
    | 'tf_weapon_pda_spy'
    | 'tf_weapon_pep_brawler_blaster'
    | 'tf_weapon_pipebomblauncher'
    | 'tf_weapon_pistol'
    | 'tf_weapon_pistol_scout'
    | 'tf_weapon_raygun'
    | 'tf_weapon_revolver'
    | 'tf_weapon_robot_arm'
    | 'tf_weapon_rocketlauncher'
    | 'tf_weapon_rocketlauncher_airstrike'
    | 'tf_weapon_rocketlauncher_directhit'
    | 'tf_weapon_rocketlauncher_fireball'
    | 'tf_weapon_rocketpack'
    | 'tf_weapon_sapper'
    | 'tf_weapon_scattergun'
    | 'tf_weapon_sentry_revenge'
    | 'tf_weapon_shotgun_building_rescue'
    | 'tf_weapon_shotgun_hwg'
    | 'tf_weapon_shotgun_primary'
    | 'tf_weapon_shotgun_pyro'
    | 'tf_weapon_shotgun_soldier'
    | 'tf_weapon_shovel'
    | 'tf_weapon_slap'
    | 'tf_weapon_smg'
    | 'tf_weapon_sniperrifle'
    | 'tf_weapon_sniperrifle_classic'
    | 'tf_weapon_sniperrifle_decap'
    | 'tf_weapon_soda_popper'
    | 'tf_weapon_spellbook'
    | 'tf_weapon_stickbomb'
    | 'tf_weapon_sword'
    | 'tf_weapon_syringegun_medic'
    | 'tf_weapon_wrench'
    | 'tf_weaponbase_grenade_proj'
    | 'tf_weaponbase_melee'
    | 'tf_weaponbase_merasmus_grenade'
    | 'tf_wearable'
    | 'tf_wearable_campaign_item'
    | 'tf_wearable_demoshield'
    | 'tf_wearable_levelable_item'
    | 'tf_wearable_razorback'
    | 'tf_wearable_robot_arm'
    | 'tf_wearable_vm'
    | 'tf_zombie'
    | 'tf_zombie_spawner'
    | 'training_annotation'
    | 'training_prop_dynamic'
    | 'trigger_add_or_remove_tf_player_attributes'
    | 'trigger_add_tf_player_condition'
    | 'trigger_apply_impulse'
    | 'trigger_autosave'
    | 'trigger_bot_tag'
    | 'trigger_capture_area'
    | 'trigger_catapult'
    | 'trigger_changelevel'
    | 'trigger_gravity'
    | 'trigger_hurt'
    | 'trigger_ignite'
    | 'trigger_ignite_arrows'
    | 'trigger_impact'
    | 'trigger_look'
    | 'trigger_multiple'
    | 'trigger_once'
    | 'trigger_particle'
    | 'trigger_passtime_ball'
    | 'trigger_player_respawn_override'
    | 'trigger_playermovement'
    | 'trigger_proximity'
    | 'trigger_push'
    | 'trigger_rd_vault_trigger'
    | 'trigger_remove'
    | 'trigger_remove_tf_player_condition'
    | 'trigger_serverragdoll'
    | 'trigger_soundscape'
    | 'trigger_stun'
    | 'trigger_teleport'
    | 'trigger_timer_door'
    | 'trigger_transition'
    | 'trigger_wind'
    | 'vgui_screen'
    | 'vgui_screen_team'
    | 'vgui_slideshow_display'
    | 'vote_controller'
    | 'water_lod_control'
    | 'wearable_item'
    | 'wheel_of_doom'
    | 'wheel_of_doom_spiral'
    | 'worldspawn'
    | string;