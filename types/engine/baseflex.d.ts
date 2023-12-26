//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

declare global {
    class CBaseFlex extends CBaseAnimating {
        /**
         * Play the specified .vcd file, causing the related characters to speak and subtitles to play.
         * @tip Open tf2_misc_dir.vpk and browse the files in scripts/talker/... to find .vcd files. Alternatively, use the rr_debugresponses 1 command with developer 1 to find .vcds from in-game voicelines.
         * @param scene_file
         * @param delay
         */
        public PlayScene(scene_file: string, delay: number): number;
    }
}