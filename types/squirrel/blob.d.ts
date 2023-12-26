//--------------------------------------------------------------------------------------------------
// Copyright (C) Moonly Days                                                                       -
// https://github.com/MoonlyDays                                                                   -
//--------------------------------------------------------------------------------------------------

export {};

type BlobNumberType =
    'c' | 99 |
    'b' | 98 |
    's' | 115 |
    'w' | 119 |
    'i' | 105 |
    'f' | 102 |
    'd' | 100;

type BlobSeekType =
    'e' | 101 |
    'c' | 99 |
    'b' | 98;

declare global {
    /**
     * casts a float to a int
     * @param f
     */
    function castf2i(f: number): number

    /**
     * casts a int to a float
     * @param n
     */
    function casti2f(n: number): number;

    /**
     * swap the byte order of a number (like it would be a 16bits integer)
     * @param n
     */
    function swap2(n: number): number;

    /**
     * swap the byte order of an integer
     * @param n
     */
    function swap4(n: number): number;

    /**
     * swaps the byteorder of a float
     * @param n
     */
    function swapfloat(n: number): number;

    class blob {
        constructor(size: number);

        public eos(): void;

        public flush(): void;

        public len(): void;

        public readblob(size: number): blob;

        public readn(type: BlobNumberType): unknown;

        public resize(size: number): void;

        public seek(offset: number, offsetBasis?: BlobSeekType): number;

        public swap2(): void;

        public swap4(): void;

        public tell(): number;

        public writeblob(src: blob): void;

        public writen(n: number, type: BlobNumberType): void;
    }
}