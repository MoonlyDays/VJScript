//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {

    function BeginScriptDebug(): void;

    function EndScriptDebug(): void;

    function ScriptDebugAddTextFilter(): void;

    function ScriptDebugAddTrace(): void;

    function ScriptDebugAddWatch(): void;

    function ScriptDebugAddWatches(): void;

    function ScriptDebugAddWatchPattern(): void;

    function ScriptDebugClearTraces(): void;

    function ScriptDebugClearWatches(): void;

    function ScriptDebugDefaultWatchColor(): void;

    function ScriptDebugDraw(): void;

    function ScriptDebugDrawWatches(): void;

    function ScriptDebugDumpKeys(): void;

    function ScriptDebugHook(): void;

    function ScriptDebugIterateKeys(): void;

    function ScriptDebugIterateKeysRecursive(): void;

    function ScriptDebugRemoveTextFilter(): void;

    function ScriptDebugRemoveTrace(): void;

    function ScriptDebugRemoveWatch(): void;

    function ScriptDebugRemoveWatches(): void;

    function ScriptDebugRemoveWatchPattern(): void;

    function ScriptDebugText(): void;

    function ScriptDebugTextDraw(): void;

    function ScriptDebugTextPrint(): void;

    function ScriptDebugTextTrace(): void;

    function ScriptDebugTraceAll(): void;

    function ScriptDebugWatches(): void;

    function __VScriptServerDebugHook(): void;
}