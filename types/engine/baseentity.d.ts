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
    interface CBaseEntity {
        /**
         * Behaves the same as KeyValueFromFloat, use that instead.
         * @param key
         * @param value
         */
        __KeyValueFromFloat(key: string, value: number): boolean;

        /**
         * Behaves the same as KeyValueFromInt, use that instead.
         * @param key
         * @param value
         */
        __KeyValueFromInt(key: string, value: number): boolean;

        /**
         * Behaves the same as KeyValueFromString, use that instead.
         * @param key
         * @param value
         */
        __KeyValueFromString(key: string, value: string): boolean;

        /**
         * Behaves the same as KeyValueFromVector, use that instead.
         * @param key
         * @param value
         */
        __KeyValueFromVector(key: string, value: Vector): boolean;

        /**
         * Adds the supplied flags to the Entity Flags in the entity. (m_iEFlags datamap)
         * See Constants.FEntityEFlags.
         * @param flags
         */
        AddEFlags(flags: number): void;

        /**
         * Adds the supplied flags to another separate player-related entity flags system in the entity. (m_fFlags datamap)
         * See Constants.FPlayer.
         * @param flags
         */
        AddFlag(flags: number): void;

        /**
         * Adds the supplied flags to the Solid Flags in the entity. (m_Collision.m_usSolidFlags datamap)
         * See Constants.FSolid.
         * @param flags
         */
        AddSolidFlags(flags: number): void;

        /**
         * Apply a Velocity Impulse as a world space impulse vector. Works for most physics-based objects including dropped weapons and even dropped Sandviches.
         * @param impulse
         */
        ApplyAbsVelocityImpulse(impulse: Vector): void;

        /**
         * Apply an Angular Velocity Impulse in entity local space. The direction of the input vector is the rotation axis, and the length is the magnitude of the impulse.
         * @param impulse
         */
        ApplyLocalAngularVelocityImpulse(impulse: Vector): void;

        /**
         * Acts like the BecomeRagdoll input, with the required impulse value applied as a force on the ragdoll. Does NOT spawn a prop_ragdoll or any other entity.
         * @param impulse
         */
        BecomeRagdollOnClient(impulse: Vector): boolean;

        /**
         * Sets the player-related entity flags to 0 on an entity, clearing them.
         */
        ClearFlags(): void;

        /**
         * Sets Solid Flags to 0 on an entity, clearing them.
         */
        ClearSolidFlags(): void;

        /**
         * Adds an I/O connection that will call the named function when the specified output fires.
         * @param output
         * @param func
         */
        ConnectOutput(output: string, func: string): void;

        /**
         * Removes the entity. Simply calls UTIL_Remove.
         */
        Destroy(): void;

        /**
         * Disable drawing and transmitting the entity to clients. (adds EF_NODRAW)
         */
        DisableDraw(): void;

        /**
         * Removes a connected script function from an I/O event.
         * @param output
         * @param func
         */
        DisconnectOutput(output: string, func: string): void;

        /**
         * Alternative dispatch spawn, same as the one in CEntities, for convenience.
         * @note Calling this on players will cause them to respawn.
         */
        DispatchSpawn(): void;

        /**
         * Plays a sound from this entity.
         * @param sound
         */
        EmitSound(sound: string): void;

        /**
         * Enable drawing and transmitting the entity to clients. (removes EF_NODRAW)
         */
        EnableDraw(): void;

        /**
         * Returns the entity index.
         */
        entindex(): number;

        /**
         * Returns the entity's eye angles. Acts like GetAbsAngles if the entity does not support it.
         */
        EyeAngles(): QAngle;

        /**
         * Get vector to eye position - absolute coords. Acts like GetOrigin if the entity does not support it.
         */
        EyePosition(): Vector;

        /**
         * Returns the most-recent entity parented to this one.
         * @tip: Example usage:
         *     for (local child = entity.FirstMoveChild(); child != null; child = child.NextMovePeer())
         */
        FirstMoveChild(): CBaseEntity | null;

        /**
         * Get the entity's pitch, yaw, and roll as QAngles.
         */
        GetAbsAngles(): QAngle;

        /**
         * Returns the current absolute velocity of the entity.
         */
        GetAbsVelocity(): Vector;

        /**
         * Get the entity's pitch, yaw, and roll as a Vector.
         */
        GetAngles(): Vector;

        /**
         *  Get the local angular velocity - returns a Vector of pitch, yaw, and roll.
         */
        GetAngularVelocity(): Vector;

        /**
         *  Returns any constant velocity currently being imparted onto the entity. This includes being pushed by effects like trigger_push and players standing on moving geometry like elevators. Should always returns a zero vector if the entity is not affected by any movement effects.
         */
        GetBaseVelocity(): Vector;

        /**
         * Get a vector containing max bounds, centered on object
         */
        GetBoundingMaxs(): Vector;

        /**
         * Get a vector containing max bounds, centered on object, taking the object's orientation into account
         * @Bug: This does not transform the bounds correctly and in some cases the bounding box will not cover the whole entity. As a workaround, use the non-oriented bounds and perform an AABB transformation using a matrix constructed from the entity's origin and angles.
         */
        GetBoundingMaxsOriented(): Vector;

        /**
         * Get a vector containing min bounds, centered on object
         */
        GetBoundingMins(): Vector;

        /**
         * Get a vector containing min bounds, centered on object, taking the object's orientation into account
         * @bug This does not transform the bounds correctly and in some cases the bounding box will not cover the whole entity. As a workaround, use the non-oriented bounds and perform an AABB transformation using a matrix constructed from the entity's origin and angles.
         */
        GetBoundingMinsOriented(): Vector;

        /**
         * Get vector to center of object - absolute coords
         */
        GetCenter(): Vector;

        GetClassname(): string;

        /**
         * Gets the current collision group of the entity.
         */
        GetCollisionGroup(): number;

        GetEFlags(): number;

        GetFlags(): number;

        /**
         * Get the entity as an EHANDLE
         */
        GetEntityHandle(): void;

        GetEntityIndex(): number;

        /**
         * Get the forward vector of the entity
         */
        GetForwardVector(): Vector;

        /**
         * Get PLAYER friction, ignored for objects
         */
        GetFriction(): number;

        GetGravity(): number;

        GetHealth(): number;

        /**
         * Get the right vector of the entity. This is purely for compatibility.
         */
        GetLeftVector(): Vector;

        GetLocalAngles(): QAngle;

        GetLocalOrigin(): Vector;

        /**
         * Get Entity relative velocity
         */
        GetLocalVelocity(): Vector;

        GetMaxHealth(): number;

        /**
         * Get a KeyValue class instance on this entity's model
         */
        GetModelKeyValues(): NutTable;

        /**
         *  Returns the name of the model
         */
        GetModelName(): string;

        /**
         * If in hierarchy, retrieves the entity's parent
         */
        GetMoveParent(): CBaseEntity | null;

        GetMoveType(): number;

        GetName(): string;

        /**
         * This is GetAbsOrigin with a funny script name for some reason. Not changing it for legacy compat though.
         */
        GetOrigin(): Vector;

        /**
         * Gets this entity's owner
         */
        GetOwner(): CBaseEntity | null;

        GetPhysAngularVelocity(): Vector;

        GetPhysVelocity(): Vector;

        /**
         * Get the entity name stripped of template unique decoration
         */
        GetPreTemplateName(): string;

        /**
         * Get the right vector of the entity
         */
        GetRightVector(): Vector;

        /**
         * If in hierarchy, walks up the hierarchy to find the root parent
         */
        GetRootMoveParent(): CBaseEntity | null;

        /**
         *  Retrieve the unique identifier used to refer to the entity within the scripting system.
         */
        GetScriptId(): string;

        /**
         * Retrieve the script-side data associated with an entity
         */

        GetScriptScope(): NutTable;

        /**
         * Retrieve the name of the current script think func
         */
        GetScriptThinkFunc(): string;

        GetSolid(): number;

        /**
         * Returns float duration of the sound. Actor model name is optional and can be left null.
         * @warning: Does not work on dedicated servers as they do not have audio libraries built-in to load sounds.
         * @param soundname
         * @param actormodelname
         * @constructor
         */
        GetSoundDuration(soundname: string, actormodelname: string): number;

        GetTeam(): number;

        /**
         * Get the up vector of the entity
         */
        GetUpVector(): Vector;

        GetVelocity(): Vector;

        /**
         * This function tells you how much of the entity is underwater. It returns a value of 0 if not underwater, 1 if the feet are (touching water brush), 2 if the waist is (center of the hull of the entity), and 3 if the head is (eyes position).
         * @note Some entities might not return 1 despite touching water. In some cases you might get 0 and 3 only, or sometimes 0, 2 and 3.
         */
        GetWaterLevel(): number;

        /**
         * It returns the type of water the entity is currently submerged in. 32 for water and 16 for slime.
         */
        GetWaterType(): number;

        IsEFlagSet(eflag: number): boolean;

        /**
         * Checks whether the entity is a player or not.
         */
        IsPlayer(): this is CBasePlayer;

        IsSolid(): boolean;

        IsSolidFlagSet(solidflag: number): boolean;

        /**
         * Checks whether the entity still exists. Useful when storing entity handles and needing to check if the entity was not deleted.
         * @note This function is never necessary to call on handles returned from built-in script functions, as they are guaranteed to be valid or null.
         */
        IsValid(): boolean;

        /**
         * Executes KeyValue with a float
         * @warning Does not update the internal network state of the entity, which can result in any desired visual changes being delayed for clients if used after spawning. Netprops can be used instead which correctly updates the networking state and results in an immediate update.
         * @param key
         * @param value
         */
        KeyValueFromFloat(key: string, value: number): boolean;

        /**
         * Executes KeyValue with an int
         * @warning Does not update the internal network state of the entity, which can result in any desired visual changes being delayed for clients if used after spawning. Netprops can be used instead which correctly updates the networking state and results in an immediate update.
         * @param key
         * @param value
         */
        KeyValueFromInt(key: string, value: number): boolean;

        /**
         * Executes KeyValue with a string
         * @warning Does not update the internal network state of the entity, which can result in any desired visual changes being delayed for clients if used after spawning. Netprops can be used instead which correctly updates the networking state and results in an immediate update.
         * @param key
         * @param value
         */
        KeyValueFromString(key: string, value: string): boolean;

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
        Kill(): void;

        /**
         * Returns the entity's local eye angles
         */
        LocalEyeAngles(): unknown;

        /**
         * Returns the next entity parented with the entity. Intended for iteration use with FirstMoveChild().
         */
        NextMovePeer(): CBaseEntity | null;

        /**
         * Precache a model
         * @note This has no return, unlike the global PrecacheModel function. Use the latter if you need the model index.
         * @param modelname
         */
        PrecacheModel(modelname: string): void;

        /**
         * Precache a sound script. Same as PrecacheSoundScript.
         * @param soundscript
         */
        PrecacheScriptSound(soundscript: string): void;

        /**
         * Precache a sound script. Same as PrecacheScriptSound.
         * @param soundscript
         */
        PrecacheSoundScript(soundscript: string): void;

        RemoveEFlags(eflags: number): void;

        RemoveFlag(flags: number): void;

        RemoveSolidFlags(solidflags: number): void;

        /**
         * Set entity pitch, yaw, roll as QAngles
         * @note Does not work on players, use SnapEyeAngles instead.
         * @param angles
         */
        SetAbsAngles(angles: QAngle): void;

        /**
         * Sets the current absolute velocity of the entity.
         * @note Does nothing on VPhysics objects (such as prop_physics). For those, use SetPhysVelocity instead.
         * @param velocity
         */
        SetAbsVelocity(velocity: Vector): void;

        /**
         * Sets the absolute origin of the entity.
         * @param origin
         */
        SetAbsOrigin(origin: Vector): void;

        /**
         * Set entity angles
         * @param pitch
         * @param yaw
         * @param roll
         */
        SetAngles(pitch: number, yaw: number, roll: number): void;

        /**
         * Set the local angular velocity.
         * @param pitch
         * @param yaw
         * @param roll
         */
        SetAngularVelocity(pitch: number, yaw: number, roll: number): void;

        /**
         * Set the current collision group of the entity.
         * See Constants.ECollisionGroup
         * @param collision_group
         * @constructor
         */
        SetCollisionGroup(collision_group: number): void;

        /**
         * Enables drawing if you pass true, disables drawing if you pass false.
         * @param toggle
         */
        SetDrawEnabled(toggle: boolean): void;

        SetEFlags(eflags: number): void;

        /**
         * Set the orientation of the entity to have this forward vector
         * @param forward
         */
        SetForwardVector(forward: Vector): void;

        SetFriction(friction: number): void;

        SetGravity(gravity: number): void;

        SetHealth(health: number): void;

        SetLocalAngles(angles: QAngle): void;

        SetLocalOrigin(origin: Vector): void;

        /**
         * Sets the maximum health this entity can have. Does not update the current health, so SetHealth should be used afterwards.
         * @note Does nothing on players. Add the max health additive bonus attribute via AddCustomAttribute instead.
         * @param health
         */
        SetMaxHealth(health: number): void;

        /**
         * Set a model for this entity.
         * @warning ake sure the model was already precached before using this function or otherwise the game will crash! Alternatively, SetModelSimple will precache the entity for you.
         */
        SetModel(model: string): void;

        SetMoveType(movetype: number, movecollide: number): void;

        SetOrigin(origin: Vector): void;

        /**
         * Sets this entity's owner
         * @param entity
         */
        SetOwner(entity: CBaseEntity): void;

        SetPhysAngularVelocity(angular_velocity: Vector): void;

        SetPhysVelocity(velocity: Vector): void;

        /**
         * Sets the bounding box's scale for this entity.
         * @warning If any component of mins/maxs is backwards (i.e. mins.x > maxs.x), the engine will exit with a fatal error.
         * @param mins
         * @param maxs
         */
        SetSize(mins: Vector, maxs: Vector): void;

        SetSolid(solid: number): void;

        SetSolidFlags(solid_flags: number): void;

        /**
         * Sets entity team.
         * @note Use ForceChangeTeam on players instead.
         * @param team
         */
        SetTeam(team: number): void;

        SetVelocity(velocity: Vector): void;

        /**
         * This sets how much of the entity is underwater. Setting it to 0 means it is not underwater, 1 if the feet are (touching water brush), 2 if the waist is (center of the hull of the entity), and 3 if the head is (eyes position).
         * @param water_level
         */
        SetWaterLevel(water_level: number): void;

        /**
         *  Set the type of water the entity is currently submerged in. Generic values to use are 32 for water and 16 for slime.
         * @param water_type
         */
        SetWaterType(water_type: number): void;

        /**
         *  Stops a sound on this entity.
         * @param sound_name
         */
        StopSound(sound_name: string): void;

        /**
         * Deals damage to the entity.
         * @param flDamage
         * @param nDamageType
         * @param hAttacker
         */
        TakeDamage(flDamage: number, nDamageType: number, hAttacker: CBaseEntity): void;

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
        TakeDamageEx(hInflictor: CBaseEntity, hAttacker: CBaseEntity, hWeapon: CBaseEntity, vecDamageForce: Vector, vecDamagePosition: Vector, flDamage: number, nDamageType: number): void;

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
        TakeDamageCustom(hInflictor: CBaseEntity, hAttacker: CBaseEntity, hWeapon: CBaseEntity, vecDamageForce: Vector, vecDamagePosition: Vector, flDamage: number, nDamageType: number, nCustomDamageType: number): void;

        /**
         * Teleports this entity. For this function, set the bools to false if you want that entity's property unchanged. (do not use null arguments!)
         * @param use_origin
         * @param origin
         * @param use_angles
         * @param angles
         * @param use_velocity
         * @param velocity
         */
        Teleport(use_origin: boolean, origin: Vector, use_angles: boolean, angles: QAngle, use_velocity: boolean, velocity: Vector): void;

        /**
         *  Clear the current script scope for this entity
         */
        TerminateScriptScope(): void;

        ToggleFlag(flags: number): void;

        /**
         * Ensure that an entity's script scope has been created.
         * @tip On players, this only needs to be called once. Script scopes remain permanent on players until their entity is removed, i.e. disconnected. The best place to call this is in the player_spawn event when params.team equals 0 (unassigned). The event is always fired once for team unassigned when the player entity spawns. Similarly, for engineer buildings, this function can also be called once. The player_builtobject is fired when an engineer building is created (or re-placed after moving, but this shouldn't matter).
         */
        ValidateScriptScope(): boolean;

    }
}