//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {

    /**
     * Script handle representation of a model's $keyvalues block. All sub-keys are instances of the same class.
     */
    interface CScriptKeyValues {
        /**
         * Find a sub key by the key name.
         */
        FindKey(key: string): CScriptKeyValues;

        /**
         * Return the first sub key object.
         */
        GetFirstSubKey(): CScriptKeyValues;

        /**
         * Return the key value as a bool.
         */
        GetKeyBool(key: string): boolean;

        /**
         * Return the key value as a float.
         */
        GetKeyFloat(key: string): number;

        /**
         * Return the key value as an integer.
         */
        GetKeyInt(key: string): number;

        /**
         * Return the key value as a string.
         */
        GetKeyString(key: string): string;

        /**
         * Return the next neighbor key object to the one the method is called on.
         */
        GetNextKey(): CScriptKeyValues;

        /**
         * Returns true if the named key has no value.
         */
        IsKeyEmpty(key: string): boolean;

        /**
         *  Whether the handle belongs to a valid key.
         */
        IsValid(): boolean;

        /**
         * Releases the contents of the instance.
         */
        ReleaseKeyValues(): void;
    }
}