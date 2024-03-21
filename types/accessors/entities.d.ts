//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Vector} from '../datatypes';
import {CBaseEntity} from '../engine/baseentity';

/**
 * Provides access to currently spawned entities
 */
export const Entities: CEntities;

/**
 * An interface to find and iterate over the script handles for the entities in
 * play. To iterate over a set of entities, pass null to the previous parameter
 * in the appropriate method to start an iteration. A reference to a previously-found
 * entity can be used instead to continue a search.ts.
 */
export declare interface CEntities {
    /**
     * Creates an entity by classname.
     * @param classname
     */
    CreateByClassname(classname: EntityClassName): CBaseEntity;

    /**
     * Dispatches spawn of an entity! Use this on entities created via CreateByClassname to actually spawn them into the world.
     * @note Calling this on players will cause them to respawn.
     * @param entity
     */
    DispatchSpawn(entity: CBaseEntity): void;

    /**
     * Find entities by the string of their classname keyvalue. Pass 'null' value to start an iteration, or reference to a previously found entity to continue a search.ts.
     * @note The classname keyvalue of an entity can be manipulated and does not necessarily reflect its code class. There might be entities that have a different classname than the one they are created with. For example, you can spawn a "prop_dynamic" then change its classname to "my_prop", and it will retain the functionality of its code class while also not showing up when searching for "prop_dynamic".
     * @param entity
     * @param classname
     */
    FindByClassname<T extends CBaseEntity = CBaseEntity>(entity: CBaseEntity | null, classname: EntityClassName): T | null;

    /**
     * Find entities by classname nearest to a point within a radius.
     * @param classname
     * @param center
     * @param radius
     */
    FindByClassnameNearest<T extends CBaseEntity = CBaseEntity>(classname: EntityClassName, center: Vector, radius: number): T | null;

    /**
     * Find entities by classname within a radius. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.ts.
     * @param previous
     * @param classname
     * @param center
     * @param radius
     */
    FindByClassnameWithin<T extends CBaseEntity = CBaseEntity>(previous: CBaseEntity | null, classname: EntityClassName, center: Vector, radius: number): T | null;

    /**
     * Find entities by the string of their model keyvalue. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.ts.
     * @param previous
     * @param modelname
     */
    FindByModel<T extends CBaseEntity = CBaseEntity>(previous: CBaseEntity | null, modelname: string): T | null;

    /**
     * Find entities by the string of their targetname keyvalue. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.ts.
     * @param previous
     * @param targetname
     */
    FindByName<T extends CBaseEntity = CBaseEntity>(previous: CBaseEntity | null, targetname: string): T | null;

    /**
     * Find entities by targetname nearest to a point within a radius.
     * @param targetname
     * @param center
     * @param radius
     */
    FindByNameNearest<T extends CBaseEntity = CBaseEntity>(targetname: string, center: Vector, radius: number): T | null;

    /**
     * Find entities by targetname within a radius. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.ts
     * @param previous
     * @param targetname
     * @param center
     * @param radius
     */
    FindByNameWithin<T extends CBaseEntity = CBaseEntity>(previous: CBaseEntity | null, targetname: string, center: Vector, radius: number): T | null;

    /**
     * Find entities by the string of their target keyvalue. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.ts
     * @param previous
     * @param target
     */
    FindByTarget<T extends CBaseEntity = CBaseEntity>(previous: CBaseEntity | null, target: string): T | null;

    /**
     * Find entities within a radius. Pass 'null' to start an iteration, or reference to a previously found entity to continue a search.ts
     * @param previous
     * @param center
     * @param radius
     */
    FindInSphere<T extends CBaseEntity = CBaseEntity>(previous: CBaseEntity | null, center: Vector, radius: number): T | null;

    /**
     * Begin an iteration over the list of entities
     */
    First(): CBaseEntity | null;

    /**
     * At the given reference of a previously-found entity, returns the next one after it in the list.
     * @param previous
     */
    Next<T extends CBaseEntity = CBaseEntity>(previous: CBaseEntity): T | null;
}


export type EntityClassName =
    '_firesmoke' |
    '_plasma' |
    'ai_ally_speech_manager' |
    'ai_battle_line' |
    'ai_changehintgroup' |
    'ai_changetarget' |
    'ai_goal_assault' |
    'ai_goal_follow' |
    'ai_goal_lead' |
    'ai_goal_lead_weapon' |
    'ai_goal_standoff' |
    'ai_hint' |
    'ai_network' |
    'ai_relationship' |
    'ai_script_conditions' |
    'ai_sound' |
    'ai_speechfilter' |
    'aiscripted_schedule' |
    'aitesthull' |
    'ambient_generic' |
    'assault_assaultpoint' |
    'assault_rallypoint' |
    'bot_action_point' |
    'bot_controller' |
    'bot_generator' |
    'bot_hint_engineer_nest' |
    'bot_hint_sentrygun' |
    'bot_hint_sniper_spot' |
    'bot_hint_teleporter_exit' |
    'bot_proxy' |
    'bot_roster' |
    'color_correction' |
    'color_correction_volume' |
    'cycler' |
    'cycler_actor' |
    'cycler_flex' |
    'dispenser_touch_trigger' |
    'dynamic_prop' |
    'entity_bird' |
    'entity_blocker' |
    'entity_carrier' |
    'entity_croc' |
    'entity_medigun_shield' |
    'entity_revive_marker' |
    'entity_rocket' |
    'entity_saucer' |
    'entity_sign' |
    'entity_soldier_statue' |
    'entity_spawn_manager' |
    'entity_spawn_point' |
    'entityflame' |
    'env_beam' |
    'env_beverage' |
    'env_blood' |
    'env_bubbles' |
    'env_credits' |
    'env_cubemap' |
    'env_debughistory' |
    'env_detail_controller' |
    'env_dustpuff' |
    'env_dusttrail' |
    'env_effectscript' |
    'env_embers' |
    'env_entity_dissolver' |
    'env_entity_igniter' |
    'env_entity_maker' |
    'env_explosion' |
    'env_fade' |
    'env_fire' |
    'env_fire_trail' |
    'env_firesensor' |
    'env_firesource' |
    'env_fog_controller' |
    'env_funnel' |
    'env_global' |
    'env_glow' |
    'env_gunfire' |
    'env_hudhint' |
    'env_laser' |
    'env_laserdot' |
    'env_lightglow' |
    'env_message' |
    'env_microphone' |
    'env_movieexplosion' |
    'env_muzzleflash' |
    'env_particle_performance_monitor' |
    'env_particle_trail' |
    'env_particlefire' |
    'env_particlelight' |
    'env_particlescript' |
    'env_particlesmokegrenade' |
    'env_physexplosion' |
    'env_physimpact' |
    'env_physwire' |
    'env_player_surface_trigger' |
    'env_projectedtexture' |
    'env_quadraticbeam' |
    'env_ragdoll_boogie' |
    'env_rockettrail' |
    'env_rotorshooter' |
    'env_rotorwash_emitter' |
    'env_screeneffect' |
    'env_screenoverlay' |
    'env_shake' |
    'env_shooter' |
    'env_smokestack' |
    'env_smoketrail' |
    'env_sniperdot' |
    'env_soundscape' |
    'env_soundscape_proxy' |
    'env_soundscape_triggerable' |
    'env_spark' |
    'env_splash' |
    'env_sporeexplosion' |
    'env_sporetrail' |
    'env_sprite' |
    'env_sprite_oriented' |
    'env_spritetrail' |
    'env_steam' |
    'env_steamjet' |
    'env_sun' |
    'env_texturetoggle' |
    'env_tonemap_controller' |
    'env_tracer' |
    'env_viewpunch' |
    'env_wind' |
    'env_zoom' |
    'event_queue_saveload_proxy' |
    'eyeball_boss' |
    'filter_activator_class' |
    'filter_activator_mass_greater' |
    'filter_activator_name' |
    'filter_activator_tfteam' |
    'filter_damage_type' |
    'filter_enemy' |
    'filter_multi' |
    'filter_tf_bot_has_tag' |
    'filter_tf_class' |
    'filter_tf_condition' |
    'filter_tf_damaged_by_weapon_in_slot' |
    'filter_tf_player_can_cap' |
    'fish' |
    'funCBaseFlex' |
    'func_areaportal' |
    'func_areaportalwindow' |
    'func_breakable' |
    'func_breakable_surf' |
    'func_brush' |
    'func_button' |
    'func_capturezone' |
    'func_changeclass' |
    'func_clip_vphysics' |
    'func_conveyor' |
    'func_croc' |
    'func_detail' |
    'func_door' |
    'func_door_rotating' |
    'func_dustcloud' |
    'func_dustmotes' |
    'func_fish_pool' |
    'func_flag_alert' |
    'func_flagdetectionzone' |
    'func_forcefield' |
    'func_guntarget' |
    'func_illusionary' |
    'func_instance' |
    'func_instance_parms' |
    'func_ladderendpoint' |
    'func_lod' |
    'func_monitor' |
    'func_movelinear' |
    'func_nav_avoid' |
    'func_nav_avoidance_obstacle' |
    'func_nav_blocker' |
    'func_nav_prefer' |
    'func_nav_prerequisite' |
    'func_nobuild' |
    'func_nogrenades' |
    'func_occluder' |
    'func_passtime_goal' |
    'func_passtime_goalie_zone' |
    'func_passtime_no_ball_zone' |
    'func_physbox' |
    'func_platrot' |
    'func_powerupvolume' |
    'func_precipitation' |
    'func_proprrespawnzone' |
    'func_reflective_glass' |
    'func_regenerate' |
    'func_respawnflag' |
    'func_respawnroom' |
    'func_respawnroomvisualizer' |
    'func_rot_button' |
    'func_rotating' |
    'func_smokevolume' |
    'func_suggested_build' |
    'func_tanktrain' |
    'func_tfbot_hint' |
    'func_trackautochange' |
    'func_trackchange' |
    'func_tracktrain' |
    'func_traincontrols' |
    'func_upgradestation' |
    'func_useableladder' |
    'func_vehicleclip' |
    'func_viscluster' |
    'func_wall' |
    'func_wall_toggle' |
    'func_water_analog' |
    'game_end' |
    'game_forcerespawn' |
    'game_gib_manager' |
    'game_intro_viewpoint' |
    'game_player_equip' |
    'game_player_team' |
    'game_ragdoll_manager' |
    'game_round_win' |
    'game_score' |
    'game_text' |
    'game_text_tf' |
    'game_ui' |
    'game_weapon_manager' |
    'game_zone_player' |
    'ghost' |
    'gibshooter' |
    'halloween_fortune_teller' |
    'halloween_souls_pack' |
    'halloween_zapper' |
    'hammer_updateignorelist' |
    'headless_hatman' |
    'hightower_teleport_vortex' |
    'info_camera_link' |
    'info_constraint_anchor' |
    'info_hint' |
    'info_intermission' |
    'info_ladder_dismount' |
    'info_landmark' |
    'info_lighting' |
    'info_mass_center' |
    'info_no_dynamic_shadow' |
    'info_node' |
    'info_node_air' |
    'info_node_air_hint' |
    'info_node_climb' |
    'info_node_hint' |
    'info_node_link' |
    'info_node_link_controller' |
    'info_npc_spawn_destination' |
    'info_null' |
    'info_observer_point' |
    'info_overlay' |
    'info_overlay_accessor' |
    'info_overlay_transition' |
    'info_particle_system' |
    'info_passtime_ball_spawn' |
    'info_player_deathmatch' |
    'info_player_start' |
    'info_player_teamspawn' |
    'info_populator' |
    'info_powerup_spawn' |
    'info_projecteddecal' |
    'info_radial_link_controller' |
    'info_target' |
    'info_teleport_destination' |
    'infodecal' |
    'instanced_scripted_scene' |
    'item_ammopack_full' |
    'item_ammopack_medium' |
    'item_ammopack_small' |
    'item_bonuspack' |
    'item_currencypack_custom' |
    'item_currencypack_large' |
    'item_currencypack_medium' |
    'item_currencypack_small' |
    'item_healthammokit' |
    'item_healthkit_full' |
    'item_healthkit_medium' |
    'item_healthkit_small' |
    'item_powerup_crit' |
    'item_powerup_rune' |
    'item_powerup_rune_temp' |
    'item_powerup_uber' |
    'item_sodacan' |
    'item_teamflag' |
    'item_teamflag_return_icon' |
    'keyframe_rope' |
    'keyframe_track' |
    'light' |
    'light_dynamic' |
    'light_environment' |
    'light_spot' |
    'logic_active_autosave' |
    'logic_auto' |
    'logic_autosave' |
    'logic_branch' |
    'logic_branch_listener' |
    'logic_case' |
    'logic_choreographed_scene' |
    'logic_collision_pair' |
    'logic_compare' |
    'logic_lineto' |
    'logic_measure_movement' |
    'logic_multicompare' |
    'logic_navigation' |
    'logic_playerproxy' |
    'logic_proximity' |
    'logic_relay' |
    'logic_scene_list_manager' |
    'logic_timer' |
    'mapobj_cart_dispenser' |
    'material_modify_control' |
    'math_colorblend' |
    'math_counter' |
    'math_remap' |
    'merasmus' |
    'merasmus_dancer' |
    'momentary_rot_button' |
    'monster_furniture' |
    'monster_generic' |
    'move_keyframed' |
    'move_rope' |
    'move_track' |
    'npc_concussiongrenade' |
    'npc_contactgrenade' |
    'npc_furniture' |
    'npc_handgrenade' |
    'npc_maker' |
    'npc_puppet' |
    'npc_template_maker' |
    'npc_vehicledriver' |
    'obj_attachment_sapper' |
    'obj_dispenser' |
    'obj_sentrygun' |
    'obj_teleporter' |
    'passtime_ball' |
    'passtime_logic' |
    'path_corner' |
    'path_corner_crash' |
    'path_track' |
    'pd_dispenser' |
    'phys_ballsocket' |
    'phys_constraint' |
    'phys_constraintsystem' |
    'phys_convert' |
    'phys_hinge' |
    'phys_keepupright' |
    'phys_lengthconstraint' |
    'phys_magnet' |
    'phys_motor' |
    'phys_pulleyconstraint' |
    'phys_ragdollconstraint' |
    'phys_ragdollmagnet' |
    'phys_slideconstraint' |
    'phys_spring' |
    'phys_thruster' |
    'phys_torque' |
    'physics_cannister' |
    'player' |
    'player_loadsaved' |
    'player_manager' |
    'player_speedmod' |
    'player_weaponstrip' |
    'point_anglesensor' |
    'point_angularvelocitysensor' |
    'point_bonusmaps_accessor' |
    'point_camera' |
    'point_clientcommand' |
    'point_commentary_node' |
    'point_devshot_camera' |
    'point_enable_motion_fixup' |
    'point_gamestats_counter' |
    'point_hurt' |
    'point_intermission' |
    'point_message' |
    'point_playermoveconstraint' |
    'point_populator_interface' |
    'point_posecontroller' |
    'point_proximity_sensor' |
    'point_servercommand' |
    'point_spotlight' |
    'point_teleport' |
    'point_template' |
    'point_tesla' |
    'point_velocitysensor' |
    'point_viewcontrol' |
    'populator_internal_spawn_point' |
    'prop_detail' |
    'prop_door_rotating' |
    'prop_dynamic' |
    'prop_dynamic_ornament' |
    'prop_dynamic_override' |
    'prop_physics' |
    'prop_physics_multiplayer' |
    'prop_physics_override' |
    'prop_ragdoll' |
    'prop_soccer_ball' |
    'prop_static' |
    'prop_vehicle' |
    'prop_vehicle_driveable' |
    'rd_robot_dispenser' |
    'scene_manager' |
    'script_intro' |
    'scripted_scene' |
    'scripted_sentence' |
    'scripted_sequence' |
    'scripted_target' |
    'shadow_control' |
    'simple_bot' |
    'simple_physics_brush' |
    'simple_physics_prop' |
    'sky_camera' |
    'soundent' |
    'tank_boss' |
    'tank_destruction' |
    'tanktrain_ai' |
    'tanktrain_aitarget' |
    'team_control_point' |
    'team_control_point_master' |
    'team_control_point_round' |
    'team_round_timer' |
    'team_train_watcher' |
    'test_traceline' |
    'tf_ammo_pack' |
    'tf_base_minigame' |
    'tf_bonus_duck_pickup' |
    'tf_bot' |
    'tf_dropped_weapon' |
    'tf_flame' |
    'tf_flame_rocket' |
    'tf_gamerules' |
    'tf_generic_bomb' |
    'tf_glow' |
    'tf_halloween_gift_pickup' |
    'tf_halloween_gift_spawn_location' |
    'tf_halloween_minigame' |
    'tf_halloween_minigame_falling_platforms' |
    'tf_halloween_pickup' |
    'tf_logic_arena' |
    'tf_logic_bonusround' |
    'tf_logic_boss_battle' |
    'tf_logic_competitive' |
    'tf_logic_cp_timer' |
    'tf_logic_holiday' |
    'tf_logic_hybrid_ctf_cp' |
    'tf_logic_koth' |
    'tf_logic_mann_vs_machine' |
    'tf_logic_medieval' |
    'tf_logic_minigames' |
    'tf_logic_multiple_escort' |
    'tf_logic_on_holiday' |
    'tf_logic_player_destruction' |
    'tf_logic_raid' |
    'tf_logic_robot_destruction' |
    'tf_logic_training_mode' |
    'tf_mann_vs_machine_stats' |
    'tf_merasmus_trick_or_treat_prop' |
    'tf_objective_resource' |
    'tf_pda_expansion_dispenser' |
    'tf_pda_expansion_teleporter' |
    'tf_player_manager' |
    'tf_point_nav_interface' |
    'tf_point_weapon_mimic' |
    'tf_populator' |
    'tf_powerup_bottle' |
    'tf_projectile_arrow' |
    'tf_projectile_ball_ornament' |
    'tf_projectile_balloffire' |
    'tf_projectile_cleaver' |
    'tf_projectile_energy_ball' |
    'tf_projectile_energy_ring' |
    'tf_projectile_flare' |
    'tf_projectile_grapplinghook' |
    'tf_projectile_healing_bolt' |
    'tf_projectile_jar' |
    'tf_projectile_jar_gas' |
    'tf_projectile_jar_milk' |
    'tf_projectile_lightningorb' |
    'tf_projectile_pipe' |
    'tf_projectile_pipe_remote' |
    'tf_projectile_rocket' |
    'tf_projectile_sentryrocket' |
    'tf_projectile_spellbats' |
    'tf_projectile_spellfireball' |
    'tf_projectile_spellkartbats' |
    'tf_projectile_spellkartorb' |
    'tf_projectile_spellmeteorshower' |
    'tf_projectile_spellmirv' |
    'tf_projectile_spellpumpkin' |
    'tf_projectile_spellspawnboss' |
    'tf_projectile_spellspawnhorde' |
    'tf_projectile_spellspawnzombie' |
    'tf_projectile_spelltransposeteleport' |
    'tf_projectile_stun_ball' |
    'tf_projectile_syringe' |
    'tf_projectile_throwable' |
    'tf_projectile_throwable_breadmonster' |
    'tf_projectile_throwable_brick' |
    'tf_projectile_throwable_repel' |
    'tf_pumpkin_bomb' |
    'tf_ragdoll' |
    'tf_robot_destruction_robot' |
    'tf_robot_destruction_robot_spawn' |
    'tf_robot_destruction_spawn_group' |
    'tf_spawner' |
    'tf_spell_meteorshowerspawner' |
    'tf_spell_pickup' |
    'tf_target_dummy' |
    'tf_taunt_prop' |
    'tf_team' |
    'tf_teleport_location' |
    'tf_template_stun_drone' |
    'tf_viewmodel' |
    'tf_weapon_base' |
    'tf_weapon_bat' |
    'tf_weapon_bat_fish' |
    'tf_weapon_bat_giftwrap' |
    'tf_weapon_bat_wood' |
    'tf_weapon_bonesaw' |
    'tf_weapon_bottle' |
    'tf_weapon_breakable_sign' |
    'tf_weapon_buff_item' |
    'tf_weapon_builder' |
    'tf_weapon_cannon' |
    'tf_weapon_charged_smg' |
    'tf_weapon_cleaver' |
    'tf_weapon_club' |
    'tf_weapon_compound_bow' |
    'tf_weapon_crossbow' |
    'tf_weapon_drg_pomson' |
    'tf_weapon_fireaxe' |
    'tf_weapon_fists' |
    'tf_weapon_flamethrower' |
    'tf_weapon_flaregun' |
    'tf_weapon_flaregun_revenge' |
    'tf_weapon_grapplinghook' |
    'tf_weapon_grenadelauncher' |
    'tf_weapon_handgun_scout_primary' |
    'tf_weapon_handgun_scout_secondary' |
    'tf_weapon_invis' |
    'tf_weapon_jar' |
    'tf_weapon_jar_gas' |
    'tf_weapon_jar_milk' |
    'tf_weapon_katana' |
    'tf_weapon_knife' |
    'tf_weapon_laser_pointer' |
    'tf_weapon_lunchbox' |
    'tf_weapon_lunchbox_drink' |
    'tf_weapon_mechanical_arm' |
    'tf_weapon_medigun' |
    'tf_weapon_minigun' |
    'tf_weapon_parachute' |
    'tf_weapon_parachute_primary' |
    'tf_weapon_parachute_secondary' |
    'tf_weapon_particle_cannon' |
    'tf_weapon_passtime_gun' |
    'tf_weapon_pda_engineer_build' |
    'tf_weapon_pda_engineer_destroy' |
    'tf_weapon_pda_spy' |
    'tf_weapon_pep_brawler_blaster' |
    'tf_weapon_pipebomblauncher' |
    'tf_weapon_pistol' |
    'tf_weapon_pistol_scout' |
    'tf_weapon_raygun' |
    'tf_weapon_revolver' |
    'tf_weapon_robot_arm' |
    'tf_weapon_rocketlauncher' |
    'tf_weapon_rocketlauncher_airstrike' |
    'tf_weapon_rocketlauncher_directhit' |
    'tf_weapon_rocketlauncher_fireball' |
    'tf_weapon_rocketpack' |
    'tf_weapon_sapper' |
    'tf_weapon_scattergun' |
    'tf_weapon_sentry_revenge' |
    'tf_weapon_shotgun_building_rescue' |
    'tf_weapon_shotgun_hwg' |
    'tf_weapon_shotgun_primary' |
    'tf_weapon_shotgun_pyro' |
    'tf_weapon_shotgun_soldier' |
    'tf_weapon_shovel' |
    'tf_weapon_slap' |
    'tf_weapon_smg' |
    'tf_weapon_sniperrifle' |
    'tf_weapon_sniperrifle_classic' |
    'tf_weapon_sniperrifle_decap' |
    'tf_weapon_soda_popper' |
    'tf_weapon_spellbook' |
    'tf_weapon_stickbomb' |
    'tf_weapon_sword' |
    'tf_weapon_syringegun_medic' |
    'tf_weapon_wrench' |
    'tf_weaponbase_grenade_proj' |
    'tf_weaponbase_melee' |
    'tf_weaponbase_merasmus_grenade' |
    'tf_wearable' |
    'tf_wearable_campaign_item' |
    'tf_wearable_demoshield' |
    'tf_wearable_levelable_item' |
    'tf_wearable_razorback' |
    'tf_wearable_robot_arm' |
    'tf_wearable_vm' |
    'tf_zombie' |
    'tf_zombie_spawner' |
    'training_annotation' |
    'training_prop_dynamic' |
    'trigger_add_or_remove_tf_player_attributes' |
    'trigger_add_tf_player_condition' |
    'trigger_apply_impulse' |
    'trigger_autosave' |
    'trigger_bot_tag' |
    'trigger_capture_area' |
    'trigger_catapult' |
    'trigger_changelevel' |
    'trigger_gravity' |
    'trigger_hurt' |
    'trigger_ignite' |
    'trigger_ignite_arrows' |
    'trigger_impact' |
    'trigger_look' |
    'trigger_multiple' |
    'trigger_once' |
    'trigger_particle' |
    'trigger_passtime_ball' |
    'trigger_player_respawn_override' |
    'trigger_playermovement' |
    'trigger_proximity' |
    'trigger_push' |
    'trigger_rd_vault_trigger' |
    'trigger_remove' |
    'trigger_remove_tf_player_condition' |
    'trigger_serverragdoll' |
    'trigger_soundscape' |
    'trigger_stun' |
    'trigger_teleport' |
    'trigger_timer_door' |
    'trigger_transition' |
    'trigger_wind' |
    'vgui_screen' |
    'vgui_screen_team' |
    'vgui_slideshow_display' |
    'vote_controller' |
    'water_lod_control' |
    'wearable_item' |
    'wheel_of_doom' |
    'wheel_of_doom_spiral' |
    'worldspawn' |
    string;