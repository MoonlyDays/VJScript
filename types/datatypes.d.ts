//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export type NutTablePrimitive = number | string | boolean | unknown;
export type NutTableValue = NutTablePrimitive | NutTablePrimitive[] | NutTable;
export type NutTable = { [key: string]: NutTableValue };

/**
 * Quaternion represents rotations in three-dimensional space.
 */
export class Quaternion {
    x: number;
    y: number;
    z: number;
    w: number;

    /**
     * Creates a new quaternion of the form w + xi + yj + zk.
     * @param x
     * @param y
     * @param z
     * @param w
     */
    constructor(x?: number, y?: number, z?: number, w?: number);

    /**
     * The 4D scalar product of two quaternions. represents the angle between the quaternions in the range [1, 0].
     * @param factor
     */
    Dot(factor: Quaternion): number;

    /**
     * Returns a quaternion with the complimentary rotation.
     */
    Invert(): Quaternion;

    /**
     * Normalizes the quaternion.
     */
    Norm(): number;

    /**
     * Recomputes the quaternion from the supplied Euler angles.
     * @param pitch
     * @param yaw
     * @param roll
     */
    SetPitchYawRoll(pitch: number, yaw: number, roll: number): void;

    /**
     * Returns a string with the values separated by one space.
     */
    ToKVString(): string;

    /**
     * Returns the angles resulting from the rotation.
     */
    ToQAngle(): QAngle;
}

export class Vector {
    x: number;
    y: number;
    z: number;

    /**
     * Creates a new vector with the specified Cartesian coordiantes.
     * @param x
     * @param y
     * @param z
     */
    constructor(x: number, y: number, z: number);

    /**
     * The vector product of two vectors. Returns a vector orthogonal to the input vectors.
     * @param factor
     */
    Cross(factor: Vector): Vector;

    /**
     * The scalar product of two vectors.
     * @param factor
     */
    Dot(factor: Vector): number;

    /**
     * Magnitude of the vector.
     */
    Length(): number;

    /**
     * The magnitude of the vector squared. Faster than the above method.
     * @tip This can be used to quickly check if the vector is equal to 0 0 0, by checking if the magnitude is 0.
     */
    LengthSqr(): number;

    /**
     * Returns the magnitude of the vector on the x-y plane. Meant to be used when working with the client's HUD.
     */
    Length2D(): number;

    /**
     * Returns the square of the magnitude of the vector on the x-y plane. Faster than the above method.
     */
    Length2DSqr(): number;

    /**
     * Normalizes the vector in place and returns it's length.
     */
    Norm(): number;

    /**
     * Scales the vector magnitude.
     * @param factor
     */
    Scale(factor: number): Vector;

    /**
     * Returns a string without separations commas.
     */
    ToKVString(): string;
}

export class QAngle {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number);

    /**
     * Returns the Forward Vector of the angles.
     */
    Forward(): Vector;

    /**
     * Returns the left Vector of the angles.
     */
    Left(): Vector;

    /**
     * Returns the pitch angle in degrees.
     */
    Pitch(): number;

    /**
     * Returns the roll angle in degrees.
     */
    Roll(): number;

    /**
     * Returns a string with the values separated by one space.
     */
    ToKVString(): string;

    /**
     * Returns a quaternion representaion of the orientation.
     */
    ToQuat(): Quaternion;

    /**
     * Returns the Up Vector of the angles.
     */
    Up(): Vector;

    /**
     * Returns the yaw angle in degrees.
     */
    Yaw(): number;
}