//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * returns the absolute value of x as an integer
     * @param x
     */
    function abs(x: number): number;

    /**
     * returns the arccosine of x
     * @param x
     */
    function acos(x: number): number;

    /**
     * returns the arcsine of x
     * @param x
     */
    function asin(x: number): number;

    /**
     * returns the arctangent of x
     * @param x
     */
    function atan(x: number): number;

    /**
     * returns the arctangent of x/y
     * @param x
     * @param y
     */
    function atan2(x: number, y: number): number;

    /**
     * returns a float value representing the smallest integer that is greater than or equal to x
     * @param x
     */
    function ceil(x: number): number;

    /**
     * returns the cosine of x
     * @param x
     */
    function cos(x: number): number;

    /**
     * returns the exponential value of the float parameter x
     * @param x
     */
    function exp(x: number): number;

    /**
     * returns the absolute value of x as a float
     * @param x
     */
    function fabs(x: number): number;


    /**
     * returns a float value representing the largest integer that is less than or equal to x
     * @param x
     */
    function floor(x: number): number;


    /**
     * returns the natural logarithm of x
     * @param x
     */
    function log(x: number): number;

    /**
     * returns the logarithm base-10 of x
     * @param x
     */
    function log10(x: number): number;

    /**
     * returns x raised to the power of y
     * @param x
     * @param y
     */
    function pow(x: number, y: number): number;


    /**
     * returns a pseudorandom integer in the range 0 to RAND_MAX
     */
    function rand(): number;


    /**
     * returns the sine of x
     */
    function sin(x: number): number;

    /**
     * returns the square root of x
     * @param x
     */
    function sqrt(x): number;


    /**
     * sets the starting point for generating a series of pseudorandom integers
     * @param seed
     */
    function srand(seed: number): number


    /**
     * returns the tangent of x
     * @param x
     */
    function tan(x: number): number;


    /**
     * the maximum value that can be returned by the rand() function
     */
    const RAND_MAX: number;

    /**
     * The numeric constant pi (3.141592) is the ratio of the circumference of a circle to its diameter
     */
    const PI: number;
}