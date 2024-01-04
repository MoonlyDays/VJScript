//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {Vector} from '../datatypes';
import {CBaseEntity} from './baseentity';


/**
 * Script handle class for env_entity_maker.
 */
export interface CEnvEntityMaker extends CBaseEntity {
    /**
     * Create an entity at the location of the maker
     */
    SpawnEntity(): void;

    /**
     * Create an entity at the location of a specified entity instance.
     */
    SpawnEntityAtEntityOrigin(entity: CBaseEntity): void;

    /**
     * Create an entity at a specified location and orientation, orientation is Euler angle in degrees (pitch, yaw,
     * roll).
     */
    SpawnEntityAtLocation(origin: Vector, orientation: Vector): void;

    /**
     * Create an entity at the location of a named entity. If multiple entities have the same name, only the one
     * with the lowest entity index will be targeted.
     */
    SpawnEntityAtNamedEntityOrigin(targetname: string): void;
}

/**
 * Script handle class for point_template.
 */
export interface CPointTemplate extends CBaseEntity {

}

/**
 * Script handle class for func_tracktrain.
 */
interface CFuncTrackTrain extends CBaseEntity {
    /**
     * Get a position on the track X seconds in the future.
     * @param {number} x
     * @param {number} speed
     * @returns {Vector}
     */
    GetFuturePosition(x: number, speed: number): Vector;
}
