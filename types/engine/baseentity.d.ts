//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * This is a script handle class for entities. All entities have a script
     * handle using this class, sometimes as one of its subclasses.
     */
    class CBaseEntity {
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
}