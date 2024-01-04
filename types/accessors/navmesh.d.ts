//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

import {NutTable, Vector} from '../datatypes';
import {CBaseEntity} from '../engine/baseentity';
import {CTFNavArea} from '../engine/tfnavarea';

/**
 * Provides access to the maps NavMesh and NavAreas.
 */
export const NavMesh: CNavMesh;

/**
 * An interface to collect nav areas from, especially for pathfinding needs.
 */
export interface CNavMesh {
    /**
     * get nav area from ray
     * @param startpos
     * @param endpos
     * @param ignoreAreaID
     */
    FindNavAreaAlongRay(startpos: Vector, endpos: Vector, ignoreAreaID: CTFNavArea): CTFNavArea;

    /**
     * fills a passed in table of all nav areas
     * @param table
     */
    GetAllAreas(table: NutTable): void;

    /**
     * fills a passed in table of all nav areas that have the specified attributes
     * @param bits
     * @param table
     */
    GetAreasWithAttributes(bits: number, table: NutTable): void;

    /**
     * given a position in the world, return the nav area that is closest to or below that height.
     * @param origin
     * @param flBeneath
     */
    GetNavArea(origin: Vector, flBeneath: number): CTFNavArea;

    /**
     * get nav area by ID
     * @param areaID
     */
    GetNavAreaByID(areaID: number): CTFNavArea;

    /**
     * return total number of nav areas
     */
    GetNavAreaCount(): number;

    /**
     * Fills the table with areas from a path. Returns whether a path was found. If 'endArea' is NULL, will compute a path as close as possible to 'goalPos'.
     * @param startArea
     * @param endArea
     * @param goalPos
     * @param flMaxPathLength
     * @param teamID
     * @param ignoreNavBlockers
     * @param table
     */
    GetNavAreasFromBuildPath(startArea: CTFNavArea, endArea: CTFNavArea | null, goalPos: Vector, flMaxPathLength: number, teamID: number, ignoreNavBlockers: boolean, table: NutTable): boolean;

    /**
     * fills a passed in table of nav areas within radius
     * @param origin
     * @param radius
     * @param table
     */
    GetNavAreasInRadius(origin: Vector, radius: number, table: NutTable): void;

    /**
     * fills passed in table with areas overlapping entity's extent
     * @param entity
     * @param table
     */
    GetNavAreasOverlappingEntityExtent(entity: CBaseEntity, table: NutTable): void;

    /**
     * given a position in the world, return the nav area that is closest to or below that height.
     * @param origin
     * @param maxDist
     * @param checkLOS
     * @param checkGround
     */
    GetNearestNavArea(origin: Vector, maxDist: number, checkLOS: boolean, checkGround: boolean): CTFNavArea;

    /**
     * fills a passed in table of all obstructing entities
     * @param table
     */
    GetObstructingEntities(table: NutTable): void;

    /**
     * returns true if a path exists
     * @param startArea
     * @param endArea
     * @param goalPos
     * @param flMaxPathLength
     * @param teamID
     * @param ignoreNavBlockers
     */
    NavAreaBuildPath(startArea: CTFNavArea, endArea: CTFNavArea, goalPos: Vector, flMaxPathLength: number, teamID: number, ignoreNavBlockers: boolean): boolean;

    /**
     * compute distance between two areas. Return -1 if can't reach 'endArea' from 'startArea'
     * @param startArea
     * @param endArea
     * @param flMaxPathLength
     */
    NavAreaTravelDistance(startArea: CTFNavArea, endArea: CTFNavArea, flMaxPathLength: number): number;

    /**
     * registers avoidance obstacle
     * @param entity
     */
    RegisterAvoidanceObstacle(entity: CBaseEntity): void;

    /**
     * unregisters avoidance obstacle
     * @param entity
     */
    UnregisterAvoidanceObstacle(entity: CBaseEntity): void;
}