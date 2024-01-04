//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

/**
 * returns the absolute value of x as an integer
 * @param x
 */
export function abs(x: number): number;

/**
 * returns the arccosine of x
 * @param x
 */
export function acos(x: number): number;

/**
 * returns the arcsine of x
 * @param x
 */
export function asin(x: number): number;

/**
 * returns the arctangent of x
 * @param x
 */
export function atan(x: number): number;

/**
 * returns the arctangent of x/y
 * @param x
 * @param y
 */
export function atan2(x: number, y: number): number;

/**
 * returns a float value representing the smallest integer that is greater than or equal to x
 * @param x
 */
export function ceil(x: number): number;

/**
 * returns the cosine of x
 * @param x
 */
export function cos(x: number): number;

/**
 * returns the exponential value of the float parameter x
 * @param x
 */
export function exp(x: number): number;

/**
 * returns the absolute value of x as a float
 * @param x
 */
export function fabs(x: number): number;


/**
 * returns a float value representing the largest integer that is less than or equal to x
 * @param x
 */
export function floor(x: number): number;


/**
 * returns the natural logarithm of x
 * @param x
 */
export function log(x: number): number;

/**
 * returns the logarithm base-10 of x
 * @param x
 */
export function log10(x: number): number;

/**
 * returns x raised to the power of y
 * @param x
 * @param y
 */
export function pow(x: number, y: number): number;


/**
 * returns a pseudorandom integer in the range 0 to RAND_MAX
 */
export function rand(): number;


/**
 * returns the sine of x
 */
export function sin(x: number): number;

/**
 * returns the square root of x
 * @param x
 */
export function sqrt(x): number;


/**
 * sets the starting point for generating a series of pseudorandom integers
 * @param seed
 */
export function srand(seed: number): number


/**
 * returns the tangent of x
 * @param x
 */
export function tan(x: number): number;


/**
 * the maximum value that can be returned by the rand() function
 */
export const RAND_MAX: number;

/**
 * The numeric constant pi (3.141592) is the ratio of the circumference of a circle to its diameter
 */
export const PI: number;
