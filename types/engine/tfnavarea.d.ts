//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Script handle class for areas part of the navigation mesh.
     */
    interface CTFNavArea {
        /**
         * Add areas that connect TO this area by a ONE-WAY link
         * @param area
         * @param dir
         */
        AddIncomingConnection(area: CTFNavArea, dir: number): void;

        /**
         * Clear TF-specific area attribute bits.
         * @param bits
         */
        ClearAttributeTF(bits: number): void;

        /**
         * Compute closest point within the "portal" between to an area's direction from the given position.
         * @param to
         * @param dir
         * @param closePos
         */
        ComputeClosestPointInPortal(to: CTFNavArea, dir: number, closePos: Vector): Vector;

        /**
         * Return direction from this area to the given point.
         * @param point
         */
        ComputeDirection(point: Vector): number;

        /**
         * Connect this area to given area in given direction.
         * @param area
         * @param dir
         */
        ConnectTo(area: CTFNavArea, dir: number): void;

        /**
         * Return true if other area is on or above this area, but no others.
         * @param area
         */
        Contains(area: CTFNavArea): boolean;

        /**
         * Return true if given point is on or above this area, but no others.
         * @param point
         */
        ContainsOrigin(point: Vector): boolean;

        /**
         * Draw area as a filled rectangle of the given color.
         * @param r
         * @param g
         * @param b
         * @param a
         * @param duration
         * @param noDepthTest
         * @param margin
         */
        DebugDrawFilled(r: number, g: number, b: number, a: number, duration: number, noDepthTest: boolean, margin: number): void;

        /**
         * Disconnect this area from given area.
         * @param area
         */
        Disconnect(area: CTFNavArea): void;

        /**
         * Get random origin within extent of area.
         */
        FindRandomSpot(): Vector;

        /**
         * Return the n'th adjacent area in the given direction
         * @param dir
         * @param n
         */
        GetAdjacentArea(dir: number, n: number): CTFNavArea;

        /**
         * Fills a passed in table with all adjacent areas in the given direction.
         * @param dir
         * @param table
         */
        GetAdjacentAreas(dir: number, table: NutTable): void;

        /**
         * Get the number of adjacent areas in the given direction.
         * @param dir
         */
        GetAdjacentCount(dir: number): number;

        /**
         * Get area attribute bits.
         */
        GetAttributes(): number;

        /**
         * Returns the maximum height of the obstruction above the ground.
         */
        GetAvoidanceObstacleHeight(): number;

        /**
         * Get center origin of area.
         */
        GetCenter(): Vector;

        /**
         * Get corner origin of area.
         * @param dir
         */
        GetCorner(dir: number): Vector;

        /**
         * Return shortest distance between point and this area.
         * @param pos
         */
        GetDistanceSquaredToPoint(pos: Vector): number;

        /**
         * Returns the door entity above the area.
         */
        GetDoor(): CBaseEntity;

        /**
         * Returns the elevator if in an elevator's path.
         */
        GetElevator(): CBaseEntity;

        /**
         * Fills table with a collection of areas reachable via elevator from this area.
         * @param table
         */
        GetElevatorAreas(table: NutTable): void;

        /**
         * Get area ID.
         */
        GetID(): number;

        /**
         * Fills a passed in table with areas connected TO this area by a ONE-WAY link (ie: we have no connection back to them).
         * @param dir
         * @param table
         */
        GetIncomingConnections(dir: number, table: NutTable): void;

        /**
         * Returns the area just prior to this one in the search path.
         */
        GetParent(): CTFNavArea;

        /**
         * Returns how we get from parent to us.
         */
        GetParentHow(): number;

        /**
         * Get place name if it exists, null otherwise.
         */
        GetPlaceName(): string;

        /**
         * Return number of players of given team currently within this area (team of zero means any/all).
         * @param team
         */
        GetPlayerCount(team: number): number;

        /**
         * Return a random adjacent area in the given direction.
         * @param dir
         */
        GetRandomAdjacentArea(dir: number): CTFNavArea;

        /**
         * Return the area size along the X axis.
         */
        GetSizeX(): number;

        /**
         * Return the area size along the Y axis.
         */
        GetSizeY(): number;

        /**
         * Gets the travel distance to the MvM bomb target.
         */
        GetTravelDistanceToBombTarget(): number;

        /**
         * Return Z of area at (x,y) of 'pos'
         * @param pos
         */
        GetZ(pos: Vector): number;

        /**
         * Has TF-specific area attribute bits of the given ones.
         * @param bits
         */
        HasAttributeTF(bits: number): boolean;

        /**
         * Has area attribute bits of the given ones?.
         * @param bits
         */
        HasAttributes(bits: number): boolean;

        /**
         * Returns true if there's a large, immobile object obstructing this area
         * @param maxheight
         */
        HasAvoidanceObstacle(maxheight: number): boolean;

        /**
         * Return true if team is blocked in this area.
         * @param team
         * @param affectsFlow
         */
        IsBlocked(team: number, affectsFlow: boolean): boolean;

        /**
         * Returns true if area is a bottleneck. (tiny narrow areas with only one path)
         */
        IsBottleneck(): boolean;

        /**
         * Return true if given area is completely visible from somewhere in this area by someone on the team.
         * @param team
         */
        IsCompletelyVisibleToTeam(team: number): boolean;

        /**
         * Return true if this area is connected to other area in given
         * direction. (If you set direction to -1 or 4, it will
         * automatically check all directions for a connection).
         * @param area
         * @param dir
         */
        IsConnected(area: CTFNavArea, dir: number): boolean;

        /**
         * Return true if this area and given. area are approximately co-planar
         * @param area
         */
        IsCoplanar(area: CTFNavArea): boolean;

        /**
         * Return true if this area is marked to have continuous damage.
         */
        IsDamaging(): boolean;

        /**
         * Return true if this area is badly formed.
         */
        IsDegenerate(): boolean;

        /**
         * Return true if there are no bi-directional links on the given side.
         * @param dir
         */
        IsEdge(dir: number): boolean;

        /**
         * Return true if this area is approximately flat.
         */
        IsFlat(): boolean;

        /**
         * Return true if 'area' overlaps our 2D extents.
         * @param area
         */
        IsOverlapping(area: CTFNavArea): boolean;

        /**
         * Return true if 'pos' is within 2D extents of area.
         * @param pos
         * @param tolerance
         */
        IsOverlappingOrigin(pos: Vector, tolerance: number): boolean;

        /**
         * Return true if any portion of this area is visible to anyone on the given team.
         * @param team
         */
        IsPotentiallyVisibleToTeam(team: number): boolean;

        /**
         * Is this area reachable by the given team?
         * @param team
         */
        IsReachableByTeam(team: number): boolean;

        /**
         * Return true if this area is approximately square.
         */
        IsRoughlySquare(): boolean;

        /**
         * Is this nav area marked with the current marking scope?
         */
        IsTFMarked(): boolean;

        /**
         * Return true if area is underwater.
         */
        IsUnderwater(): boolean;

        /**
         * Returns true if area is valid for wandering population.
         */
        IsValidForWanderingPopulation(): boolean;

        /**
         * Return true if area is visible from the given eyepoint.
         * @param point
         */
        IsVisible(point: Vector): boolean;

        /**
         * Mark this area as blocked for team.
         * @param team
         */
        MarkAsBlocked(team: number): void;

        /**
         * Mark this area is damaging for the next 'duration' seconds.
         * @param duration
         */
        MarkAsDamaging(duration: number): void;

        /**
         * Marks the obstructed status of the nav area.
         * @param height
         */
        MarkObstacleToAvoid(height: number): void;

        /**
         * Removes area attribute bits.
         * @param bits
         */
        RemoveAttributes(bits: number): void;

        /**
         * Removes all connections in directions to left and right of specified direction.
         * @param dir
         */
        RemoveOrthogonalConnections(dir: number): void;

        /**
         * Set TF-specific area attributes.
         * @param bits
         */
        SetAttributeTF(bits: number): void;

        /**
         * Set area attribute bits.
         * @param bits
         */
        SetAttributes(bits: number): void;

        /**
         * Set place name. If you pass null, the place name will be set to nothing.
         * @param name
         */
        SetPlaceName(name: string): void;

        /**
         * Mark this nav area with the current marking scope.
         */
        TFMark(): void;

        /**
         * Unblocks this area.
         */
        UnblockArea(): void;
    }
}