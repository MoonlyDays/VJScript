/** Provides an interface to read and change the values of console readonly variables: .; */
// declare let Convars: Convars;
/** Provides access to currently readonly spawned: e;readonly ntities: .; */
// declare readonly let: E;ntities: CEntities;
/** Allows manipulation readonly of: e;ntity output readonly data: .; */
// declare readonly let: E;ntityOutputs: CScriptEntityOutputs;
/** Provides access to the maps NavMesh and readonly NavAreas: .; */
// declare let NavMesh: CNavMesh;
/** Allows reading and updating the network properties of readonly an: e;readonly ntity: .; */

// declare let NetProps: CNetPropManager;
/** Tracks if any player is using voice and for how readonly long: .; */
// declare let PlayerVoiceListener: PlayerVoiceListener;

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
    }

    public static readonly ECritType: {
        readonly CRIT_NONE: 0;
        readonly CRIT_MINI: 1;
        readonly CRIT_FULL: 2;
    }

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
    }

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
    }

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
    }

    public static readonly ENavCornerType: {
        readonly NORTH_WEST: 0;
        readonly NORTH_EAST: 1;
        readonly SOUTH_EAST: 2;
        readonly SOUTH_WEST: 3;
        readonly NUM_CORNERS: 4;
    }

    public static readonly ENavDirType: {
        readonly NORTH: 0;
        readonly EAST: 1;
        readonly SOUTH: 2;
        readonly WEST: 3;
        readonly NUM_DIRECTIONS: 4;
    }

    public static readonly ENavRelativeDirType: {
        readonly FORWARD: 0;
        readonly RIGHT: 1;
        readonly BACKWARD: 2;
        readonly LEFT: 3;
        readonly UP: 4;
        readonly DOWN: 5;
        readonly NUM_RELATIVE_DIRECTIONS: 6;
    }

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
    }

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
    }

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
    }

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
    }

    public static readonly EScriptRecipientFilter: {
        readonly RECIPIENT_FILTER_DEFAULT: 0;
        readonly RECIPIENT_FILTER_PAS_ATTENUATION: 1;
        readonly RECIPIENT_FILTER_PAS: 2;
        readonly RECIPIENT_FILTER_PVS: 3;
        readonly RECIPIENT_FILTER_SINGLE_PLAYER: 4;
        readonly RECIPIENT_FILTER_GLOBAL: 5;
        readonly RECIPIENT_FILTER_TEAM: 6;
    }

    public static readonly ESolidType: {
        readonly SOLID_NONE: 0;
        readonly SOLID_BSP: 1;
        readonly SOLID_BBOX: 2;
        readonly SOLID_OBB: 3;
        readonly SOLID_OBB_YAW: 4;
        readonly SOLID_CUSTOM: 5;
        readonly SOLID_VPHYSICS: 6;
        readonly SOLID_LAST: 7;
    }

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
    }

    public static readonly EStopwatchState: {
        readonly STOPWATCH_CAPTURE_TIME_NOT_SET: 0;
        readonly STOPWATCH_RUNNING: 1;
        readonly STOPWATCH_OVERTIME: 2;
    }

    public static readonly ETFBotDifficultyType: {
        readonly EASY: 0;
        readonly NORMAL: 1;
        readonly HARD: 2;
        readonly EXPERT: 3;
        readonly NUM_DIFFICULTY_LEVELS: 4;
        readonly UNDEFINED: -1;
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    public static readonly Server: {
        readonly DIST_EPSILON: 0.03125;
        readonly MAX_PLAYERS: 101;
        readonly MAX_EDICTS: 2048;
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

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
    }

    public static readonly FTaunts: {
        readonly TAUNT_BASE_WEAPON: 0;
        readonly TAUNT_MISC_ITEM: 1;
        readonly TAUNT_SHOW_ITEM: 2;
        readonly TAUNT_LONG: 3;
        readonly TAUNT_SPECIAL: 4;
    }

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
    }

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
    }
}

declare class CBaseEntity {
    public KeyValueFromFloat(key: string, value: number): boolean;

    public KeyValueFromInt(key: string, value: number): boolean;

    public KeyValueFromString(key: string, value: string): boolean;

    public KeyValueFromVector(key: string, value: Vector): boolean;

    public Kill(): void;
}

declare class CBaseAnimating extends CBaseEntity {

}


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
