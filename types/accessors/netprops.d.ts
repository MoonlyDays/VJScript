//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Allows reading and updating the network properties of an entity.
     */
    const NetProps: CNetPropManager;
}

/**
 * Allows reading and updating the network properties and datamaps of an entity.
 * If the entity has multiple netprops with the same name, the data table name can be prepended with a dot to specify which one to use (e.g. "m_itTimer.m_timestamp").
 *
 * @tip
 * - Resources for finding netprops and datamaps of entities:
 * - Interactive viewer of netprops: https://jackz.me/netprops/tf2
 * - Formatted list of netprops and datamaps: https://sigwiki.potato.tf/index.php/Entity_Properties
 * - Raw list of netprops and datamaps: https://www.invalidvertex.com/tf2dump.php
 * - Better raw list of datamaps that includes type information: https://cdn.discordapp.com/attachments/1039243316920844428/1095872595049599056/dump_datamaps.txt
 * @warning Each netprop has a set size in bits, exceeding the size may desync the clients from the server causing unpredictable behavior.
 * @note Netprops containing the substring EntityQuality or AccountID are banned and cannot be set nor fetched, to prevent spoofing economy items as legitimate.
 */
declare interface CNetPropManager {
    /**
     * Returns the size of an netprop array, or -1.
     * @param entity
     * @param propertyName
     */
    GetPropArraySize(entity: CBaseEntity, propertyName: string): number;

    /**
     * Reads an ECBaseEntity-valued netprop (21 bit integer). Returns the script of: CBaseEntity the entity.
     * @param entity
     * @param propertyName
     */
    GetPropEntity(entity: CBaseEntity, propertyName: string): CBaseEntity;

    /**
     * Reads an ECBaseEntity-valued netprop (21 bit integer) from an array. Returns the script of: CBaseEntity the entity.
     * @param entity
     * @param propertyName
     * @param arrayElement
     */
    GetPropEntityArray(entity: CBaseEntity, propertyName: string, arrayElement: number): CBaseEntity;

    /**
     * Reads a boolean-valued netprop.
     * @param entity
     * @param propertyName
     */
    GetPropBool(entity: CBaseEntity, propertyName: string): boolean;

    /**
     * Reads a boolean-valued netprop from an array.
     * @param entity
     * @param propertyName
     * @param arrayElement
     */
    GetPropBoolArray(entity: CBaseEntity, propertyName: string, arrayElement: number): boolean;

    /**
     * Reads a number-valued netprop.
     * @param entity
     * @param propertyName
     */
    GetPropFloat(entity: CBaseEntity, propertyName: string): number;

    /**
     * Reads a number-valued netprop from an array.
     * @param entity
     * @param propertyName
     * @param arrayElement
     */
    GetPropFloatArray(entity: CBaseEntity, propertyName: string, arrayElement: number): number;

    /**
     * Fills in a passed table with property info for the provided entity.
     * @param entity
     * @param propertyName
     * @param arrayElement
     * @param table
     */
    GetPropInfo(entity: CBaseEntity, propertyName: string, arrayElement: number, table: NutTable): boolean;

    /**
     * Reads an integer-valued netprop.
     * @param entity
     * @param propertyName
     */
    GetPropInt(entity: CBaseEntity, propertyName: string): number;

    /**
     * Reads an integer-valued netprop from an array.
     * @param entity
     * @param propertyName
     * @param arrayElement
     */
    GetPropIntArray(entity: CBaseEntity, propertyName: string, arrayElement: number): number;

    /**
     * Reads an string-valued netprop.
     * @param entity
     * @param propertyName
     */
    GetPropString(entity: CBaseEntity, propertyName: string): string;

    /**
     * Reads an string-valued netprop from an array.
     * @param entity
     * @param propertyName
     * @param arrayElement
     */
    GetPropStringArray(entity: CBaseEntity, propertyName: string, arrayElement: number): string;

    /**
     * Returns the name of the netprop type as a string.
     * @param entity
     * @param propertyName
     */
    GetPropType(entity: CBaseEntity, propertyName: string): string;

    /**
     * Reads a 3D vector-valued netprop.
     * @param entity
     * @param propertyName
     */
    GetPropVector(entity: CBaseEntity, propertyName: string): Vector;

    /**
     * Reads a 3D vector-valued netprop from an array.
     * @param entity
     * @param propertyName
     * @param arrayElement
     */
    GetPropVectorArray(entity: CBaseEntity, propertyName: string, arrayElement: number): Vector;

    /**
     * Fills in a passed table with all props of a specified type for the provided
     * entity (set iPropType to 0 for SendTable or 1 for DataMap)
     * @param entity
     * @param iPropType
     * @param table
     */
    GetTable(entity: CBaseEntity, iPropType: number, table: NutTable): void;

    /**
     * Checks if a netprop exists.
     * @param entity
     * @param propertyName
     */
    HasProp(entity: CBaseEntity, propertyName: string): boolean;

    /**
     * Sets a netprop to the specified boolean.
     * @param entity
     * @param propertyName
     * @param value
     */
    SetPropBool(entity: CBaseEntity, propertyName: string, value: boolean): void;

    /**
     * Sets a netprop from an array to the specified boolean.
     * @param entity
     * @param propertyName
     * @param value
     * @param arrayElement
     */
    SetPropBoolArray(entity: CBaseEntity, propertyName: string, value: boolean, arrayElement: number): void;

    /**
     * Sets an ECBaseEntity-valued netprop (21 bit integer) to reference the specified entity.
     * @param entity
     * @param propertyName
     * @param value
     */
    SetPropEntity(entity: CBaseEntity, propertyName: string, value: CBaseEntity): void;

    /**
     * Sets an ECBaseEntity-valued netprop (21 bit integer) from an array to reference the specified entity.
     * @param entity
     * @param propertyName
     * @param value
     * @param arrayElement
     */
    SetPropEntityArray(entity: CBaseEntity, propertyName: string, value: CBaseEntity, arrayElement: number): void;

    /**
     * Sets a netprop to the specified number.
     * @param entity
     * @param propertyName
     * @param value
     */
    SetPropFloat(entity: CBaseEntity, propertyName: string, value: number): void;

    /**
     * Sets a netprop from an array to the specified number.
     * @param entity
     * @param propertyName
     * @param value
     * @param arrayElement
     */
    SetPropFloatArray(entity: CBaseEntity, propertyName: string, value: number, arrayElement: number): void;

    /**
     * Sets a netprop to the specified integer.
     * @warning Do not override m_iTeamNum netprops on players or Engineer buildings
     * permanently. Use ForceChangeTeam or SetTeam or respectively. Not doing so will
     * result in unpredictable server crashes later on. Overriding m_iTeamNum temporarily
     * and then reverting it in the same frame is safe however.
     * @param entity
     * @param propertyName
     * @param value
     */
    SetPropInt(entity: CBaseEntity, propertyName: string, value: number): void;

    /**
     * Sets a netprop from an array to the specified integer.
     * @param entity
     * @param propertyName
     * @param value
     * @param arrayElement
     */
    SetPropIntArray(entity: CBaseEntity, propertyName: string, value: number, arrayElement: number): void;

    /**
     * Sets a netprop to the specified string.
     * @param entity
     * @param propertyName
     * @param value
     */
    SetPropString(entity: CBaseEntity, propertyName: string, value: string): void;

    /**
     * Sets a netprop from an array to the specified string.
     * @param entity
     * @param propertyName
     * @param value
     * @param arrayElement
     */
    SetPropStringArray(entity: CBaseEntity, propertyName: string, value: string, arrayElement: number): void;

    /**
     * Sets a netprop to the specified vector.
     * @param entity
     * @param propertyName
     * @param value
     */
    SetPropVector(entity: CBaseEntity, propertyName: string, value: Vector): void;

    /**
     * Sets a netprop from an array to the specified vector.
     * @param entity
     * @param propertyName
     * @param value
     * @param arrayElement
     */
    SetPropVectorArray(entity: CBaseEntity, propertyName: string, value: Vector, arrayElement: number): void;
}