//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {QAngle, Vector} from '../datatypes';
import {CBaseEntity} from './baseentity';

/**
 * Script handle class for animatable entities, such as props.
 */
export interface CBaseAnimating extends CBaseEntity {
    /**
     * Dispatch animation events to a CBaseAnimating entity.
     * @param entity
     */
    DispatchAnimEvents(entity: CBaseEntity): void;

    /**
     * Find a bodygroup ID by name. Returns -1 if the bodygroup does not exist.
     * @param name
     */
    FindBodygroupByName(name: string): number;

    /**
     * Get an attachment's angles as a QAngle, by ID.
     * @param ID
     */
    GetAttachmentAngles(ID: number): QAngle;

    /**
     *    Get an attachment's parent bone index by ID.
     * @param ID
     */
    GetAttachmentBone(ID: number): number;

    /**
     * Get an attachment's origin as a Vector, by ID.
     * @param ID
     */
    GetAttachmentOrigin(ID: number): Vector;

    /**
     * Get the bodygroup value by bodygroup ID.
     * @param ID
     */
    GetBodygroup(ID: number): number;

    /**
     * Get the bodygroup's name by ID
     * @param ID
     */
    GetBodygroupName(ID: number): string;

    /**
     * Get the bodygroup's name by group and part.
     * @param group
     * @param part
     */
    GetBodygroupPartName(group: number, part: number): string;

    /**
     * Get the bone's angles as a QAngle, by ID.
     * @param ID
     */
    GetBoneAngles(ID: number): QAngle;

    /**
     *    Get the bone's origin Vector by ID.
     * @param ID
     */
    GetBoneOrigin(ID: number): number;

    /**
     *    Gets the model's current animation cycle rate.
     */
    GetCycle(): number;

    /**
     * Get the model's scale.
     */
    GetModelScale(): number;

    /**
     *    Get the current animation's playback rate.
     */
    GetPlaybackRate(): number;

    /**
     * Get the current-playing sequence's ID.
     */
    GetSequence(): number;

    /**
     * Get the activity name for a sequence by sequence ID.
     * @param ID
     */
    GetSequenceActivityName(ID: number): string;

    /**
     * Get a sequence duration in seconds by sequence ID.
     * @param ID
     */
    GetSequenceDuration(ID: number): number;

    /**
     * Get a sequence name by sequence ID.
     * @param ID
     */
    GetSequenceName(ID: number): string;

    /**
     * Gets the current skin index.
     */
    GetSkin(): number;

    /**
     * Ask whether the main sequence is done playing.
     */
    IsSequenceFinished(): boolean;

    /**
     * Get the named activity index. Returns -1 if the activity does not exist.
     * @param activity
     */
    LookupActivity(activity: string): number;

    /**
     * @param name
     */
    LookupAttachment(name: string): number;

    /**
     * Get the named bone index. Returns -1 if the bone does not exist.
     * @param bone
     */
    LookupBone(bone: string): number;

    /**
     * Gets the pose parameter's index. Returns -1 if the pose parameter does not exist.
     */
    LookupPoseParameter(name: string): number;

    /**
     * Looks up a sequence by names of sequences or activities. Returns -1 if the sequence does not exist.
     * @param name
     */
    LookupSequence(name: string): number;

    /**
     * Reset a sequence by sequence ID. If the ID is different than the current sequence, switch to the new sequence.
     * @param ID
     */
    ResetSequence(ID: number): void;

    /**
     * Set the bodygroup by ID.
     * @param ID
     * @param value
     */
    SetBodygroup(ID: number, value: number): void;

    /**
     * Sets the model's current animation cycle from 0 to 1.
     * @note Does not work correctly on prop_dynamic. It will set the value (it interacts with DefaultAnim loop checking; set it to 1.0 and it restarts, and if set on a think function to anything less than 1.0 and it will stop looping) but the animation cycle visually won't be affected by it. You can set it to any value and the animation will not be on the desired cycle.
     * @param cycle
     */
    SetCycle(cycle: number): void;

    /**
     * Set a model for this entity. Matches easier behaviour of the SetModel input, automatically precaches, maintains sequence/cycle if possible.
     * @param model_name
     */
    SetModelSimple(model_name: string): void;

    /**
     * Changes a model's scale over time. Set the change duration to 0.0 to change the scale instantly.
     * @param scale
     * @param change_duration
     */
    SetModelScale(scale: number, change_duration: number): void;

    /**
     * Set the current animation's playback rate.
     * @param rate
     */
    SetPlaybackRate(rate: number): void;

    /**
     * Sets a pose parameter value. Returns the effective value after clamping or looping.
     * @param ID
     * @param value
     */
    SetPoseParameter(ID: number, value: number): number;

    /**
     * Plays a sequence by sequence ID.
     * @warning This can cause animation stutters when transitioning between sequences. Using ResetSequence instead will prevent this. Only tested on base_boss.
     * @bug Does not set obj_sentrygun sequences correctly, use ResetSequence instead.
     * @param ID
     */
    SetSequence(ID: number): void;

    /**
     * Sets the model's skin.
     * @param index
     */
    SetSkin(index: number): void;

    /**
     * Stop the current animation (same as SetPlaybackRate 0.0)
     * @constructor
     */
    StopAnimation(): void;

    /**
     * Advance animation frame to some time in the future with an automatically calculated interval
     * @constructor
     */
    StudioFrameAdvance(): void;

    /**
     * Advance animation frame to some time in the future with a manual interval
     * @param dt
     * @constructor
     */
    StudioFrameAdvanceManual(dt: number): void;
}
