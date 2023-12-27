//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    /**
     * Pra: number client message. If you pass null instead of a valid player, the message will be sent to all clients. When printing to chat (HUD_PRINTTALK), the color of the text can be changed by inserting this sequence: \x07RRGGBB where RR GG BB is the hexadecimal format of the color. Transparency can be specified by a different sequence: \x08RRGGBBAA, where RR GG BB AA is the hexadecimal format of the color + alpha. All text following this sequence will be colored. Multiple sequences can be used in combination. If using color sequences, there MUST be a color sequence at the beginning of the string, or color codes won't work!.
     * @warning Will not accept these escape sequences. As a result, you cannot prcolored: number text with a simple RunScriptCode input. <br/>
     * Workaround:
     * - See the VScript Examples page for a workaround that replaces a normal character with \x07 at run-time
     * @tip Standard chat colors:
     * - Default: FBECCB
     * - RED: FF3F3F
     * - BLUE: 99CCFF
     * - Unassigned/spectator: CCCCCC
     * @param player
     * @param destination
     * @param message
     * @constructor
     */
    function ClientPrint(player: CBasePlayer, destination: number, message: string): void;

    /**
     * Draw a debug overlay box.
     */
    function DebugDrawBox(origin: Vector, min: Vector, max: Vector, r: number, g: number, b: number, alpha: number, duration: number): void;

    /**
     * Draw a debug oriented box (cent, min, max, angles(p,y,r), vRgb, a, duration).
     */
    function DebugDrawBoxAngles(origin: Vector, min: Vector, max: Vector, direction: QAngle, rgb: Vector, alpha: number, duration: number): void;

    /**
     * Draw a debug forward box.
     */
    function DebugDrawBoxDirection(center: Vector, min: Vector, max: Vector, forward: Vector, rgb: Vector, alpha: number, duration: number): void;

    /**
     * Draw a debug circle.
     */
    function DebugDrawCircle(center: Vector, rgb: Vector, alpha: number, radius: number, ztest: boolean, duration: number): void;

    /**
     * Try to clear all the debug overlay info.
     */
    function DebugDrawClear(): void;

    /**
     * Draw a debug overlay line.
     */
    function DebugDrawLine(start: Vector, end: Vector, red: number, green: number, blue: number, zTest: boolean, time: number): void;

    /**
     * Draw a debug line using color vec.
     */
    function DebugDrawLine_vCol(start: Vector, end: Vector, rgb: Vector, ztest: boolean, duration: number): void;

    /**
     * Draw text with a line offset.
     */
    function DebugDrawScreenTextLine(x: number, y: number, lineOffset: number, text: string, r: number, g: number, b: number, a: number, duration: number): void;

    /**
     * Draw text on the screen, starting on the position of origin.
     */
    function DebugDrawText(origin: Vector, text: string, useViewCheck: boolean, duration: number): void;

    /**
     * Dumps a scope's contents and expands all tables and arrays; this is what the ent_script_dump command uses.
     * @tip You can use this to printables: number/arrays.
     */
    function __DumpScope(indentation: number, scope: NutTable): void;

    /**
     * Dumps information about a class or instance.
     */
    function DumpObject(object: object): void;

    /**
     * Prints message to console without any line feed after.
     */
    function Msg(message: string): void;

    /**
     * Prints message to console with C style formatting. The line feed is not included.
     */
    function printf(format: string, ...args: unknown[]): void;

    /**
     * Prints message to console with a line feed after.
     */
    function printl(message: string): void;

    /**
     * Identical to print. print seems to be a wrapper for this.
     */
    function realPrint(message: string): void;

    /**
     * Calling this will have the specified player send the message to chat, either to teamOnly (true) or to everyone.
     * @param player
     * @param message
     * @param teamOnly
     */
    function Say(player: CBasePlayer, message: string, teamOnly: boolean): void;

    /**
     * Print a hud message on all clients
     * @bug Non=functional.
     * @param message
     */
    function ShowMessage(message: string): void;
}