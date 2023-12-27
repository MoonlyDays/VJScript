//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Allows manipulation of entity output data
     */
    const EntityOutputs: CScriptEntityOutputs;
}

/**
 * Allows reading and manipulation of entity output data.
 */
declare interface CScriptEntityOutputs {
    /**
     * Adds a new output to the entity.
     */
    AddOutput(entity: CBaseEntity, outputName: string, targetName: string, inputName: string, parameter: string, delay: number, timesToFire: number): void;

    /**
     * Returns the number of array elements.
     */
    GetNumElements(entity: CBaseEntity, outputName: string): number;

    /**
     * Fills the passed table with output information.
     */
    GetOutputTable(entity: CBaseEntity, outputName: string, table: NutTable, arrayElement: number): void;

    /**
     * Returns true if an action exists for the output.
     */
    HasAction(entity: CBaseEntity, outputName: string): boolean;

    /**
     * Returns true if the output exists.
     */
    HasOutput(entity: CBaseEntity, outputName: string): boolean;

    /**
     * Removes an output from the entity.
     * @note The order of the internal output data may change after this is performed, which can be problematic if iterating outputs. As a workaround, all the outputs can be stored in an array of tables first and then removed while iterating the array.
     */
    RemoveOutput(entity: CBaseEntity, outputName: string, targetName: string, inputName: string, parameter: string): void;
}