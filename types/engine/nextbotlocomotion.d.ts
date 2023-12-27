//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * The interface for interacting with a specific NextBot's movement brain.
     */
    interface ILocomotion extends INextBotComponent {
        /**
         * The primary locomotive method. Goal determines the destination position to move towards. goalWeight determines the priority of this path, you can set this to 1.0 generally speaking.
         * @tip To make the entity move smoothly towards its destination make sure to put this under a think function.
         */
        Approach(goal: Vector, goalWeight: number): void;

        /**
         * Reset stuck status to un-stuck. Reason message is shown when debugging nextbots.
         */
        ClearStuckStatus(reason: string): void;

        /**
         * Initiate a jump to an adjacent high ledge, return false if climb can't start
         */
        ClimbUpToLedge(goalPos: Vector, goalForward: Vector, obstacle: CBaseEntity): boolean;

        /**
         * Returns false if no time has elapsed
         */
        ComputeUpdateInterval(): boolean;

        /**
         * Move the bot to the precise given position immediately, updating internal state
         */
        DriveTo(pos: Vector): void;

        /**
         * Rotate body to face towards target
         * @tip To make the entity look smoothly towards a spot make sure to put this under a think function, as using the function only once makes the entity only look towards it a bit but not fully, rotating ever so slightly.
         */
        FaceTowards(target: Vector): void;

        /**
         * If the locomotor cannot jump over the gap, returns the fraction of the jumpable ray
         */
        FractionPotentialGap(from: Vector, to: Vector): number;

        /**
         * If the locomotor could not move along the line given, returns the fraction of the walkable ray. If immediately is true, breakables are considered non-traverseable
         */
        FractionPotentiallyTraversable(from: Vector, to: Vector, immediately: boolean): number;

        /**
         * Distance at which we will die if we fall
         */
        GetDeathDropHeight(): number;

        /**
         * Get desired speed for locomotor movement
         */
        GetDesiredSpeed(): number;

        /**
         * Return position of feet - the driving point where the bot contacts the ground
         */
        GetFeet(): Vector;

        /**
         * Return the current ground entity or NULL if not on the ground
         */
        GetGround(): CBaseEntity;

        /**
         * Return unit in: vector XY plane describing our direction of motion - even if we are currently not moving
         */
        GetGroundMotionVector(): Vector;

        /**
         * Surface normal of the ground we are in contact with
         */
        GetGroundNormal(): Vector;

        /**
         * Return current world space speed in XY plane
         */
        GetGroundSpeed(): number;

        /**
         * Return maximum acceleration of locomotor
         */
        GetMaxAcceleration(): number;

        /**
         * Return maximum deceleration of locomotor
         */
        GetMaxDeceleration(): number;

        /**
         * Return maximum height of a jump.
         * @tip If using a base_boss entity, as there is currently no available method to modify this value, you can fire the input SetMaxJumpHeight to change it.
         */
        GetMaxJumpHeight(): number;

        /**
         * Return unit describing: vector our direction of motion - even if we are currently not moving
         */
        GetMotionVector(): Vector;

        /**
         * Get maximum running speed
         */
        GetRunSpeed(): number;

        /**
         * Return current world space speed (magnitude of velocity)
         * @constructor
         */
        GetSpeed(): number;

        /**
         * Get maximum speed bot can reach, regardless of desired speed
         */
        GetSpeedLimit(): number;

        /**
         * If delta Z is lower than this, we can step up the surface (like a stair step),
         * but if delta Z is greater than this, we have to jump to get up.
         * @tip If using a base_boss entity, as there is currently no available method to modify this value, you can fire the input SetStepHeight to change it.
         */
        GetStepHeight(): number;

        /**
         * Return how long we've been stuck
         */
        GetStuckDuration(): number;

        /**
         * Return Z component of unit normal of steepest traversable slope
         */
        GetTraversableSlopeLimit(): number;

        /**
         * Returns time between updates
         */
        GetUpdateInterval(): number;

        /**
         * Return current world space velocity
         */
        GetVelocity(): Vector;

        /**
         * Get maximum walking speed
         */
        GetWalkSpeed(): number;

        /**
         * Checks if there is a possible gap that will need to be jumped over. Returns fraction of ray from 0 to 1.
         */
        HasPotentialGap(from: Vector, to: Vector): number;

        /**
         * Return true if this bot can climb arbitrary geometry it encounters
         */
        IsAbleToClimb(): boolean;

        /**
         * Return true if this bot can jump across gaps in its path
         */
        IsAbleToJumpAcrossGaps(): boolean;

        /**
         * Return true if given area can be used for navigation
         */
        IsAreaTraversable(area: CTFNavArea): boolean;

        /**
         * Return true if we have tried to Approach() or DriveTo() very recently
         */
        IsAttemptingToMove(): boolean;

        /**
         * Is jumping in any form
         */
        IsClimbingOrJumping(): boolean;

        /**
         * Is climbing up to a high ledge
         */
        IsClimbingUpToLedge(): boolean;

        /**
         * Return true if the entity is: handle traversable. If immediately is true, breakables are considered non-traverseable
         */
        IsEntityTraversable(entity: CBaseEntity, immediately: boolean): boolean;

        /**
         * Return true if there is a gap at this position.
         * @note forward is unused.
         */
        IsGap(pos: Vector, forward: Vector): boolean;

        /**
         * Is jumping across a gap to the far side
         */
        IsJumpingAcrossGap(): boolean;

        /**
         * Return true if standing on something
         */
        IsOnGround(): boolean;

        /**
         * Checks if this locomotor could potentially move along the line given. Returns
         * fraction of trace result (1 = clear). If immediately is true, breakables are
         * considered non-traverseable
         */
        IsPotentiallyTraversable(from: Vector, to: Vector, immediately: boolean): number;

        /**
         * Is running?
         */
        IsRunning(): boolean;

        /**
         * Is in the middle of a complex action (climbing a ladder, climbing a ledge, jumping, etc) that shouldn't be interrupted
         */
        IsScrambling(): boolean;

        /**
         * Return true if bot is stuck. If the locomotor cannot make progress, it becomes
         * stuck and can only leave this stuck state by successfully movingand becoming un-stuck.
         */
        IsStuck(): boolean;

        /**
         * Initiate a simple undirected jump in the air
         */
        Jump(): void;

        /**
         * Initiate a jump across an empty volume of space to far side
         * @note goalForward is unused.
         */
        JumpAcrossGap(goalPos: Vector, goalForward: Vector): void;

        /**
         * Manually run the OnLandOnGround callback. Typically invoked when bot lands on the ground after being in the air
         */
        OnLandOnGround(ground: CBaseEntity): void;

        /**
         * Manually run the OnLeaveGround callback. Typically invoked when bot leaves ground for any reason
         */
        OnLeaveGround(ground: CBaseEntity): void;

        /**
         * Resets motion, stuck state etc
         */
        Reset(): void;

        /**
         * Set desired movement speed to running
         */
        Run(): void;

        /**
         * Set desired speed for locomotor movement
         */
        SetDesiredSpeed(speed: number): void;

        /**
         * Set maximum speed bot can reach, regardless of desired speed
         */
        SetSpeedLimit(limit: number): void;

        /**
         * Set desired movement speed to stopped
         */
        Stop(): void;

        /**
         * Set desired movement speed to walking
         */
        Walk(): void;
    }
}