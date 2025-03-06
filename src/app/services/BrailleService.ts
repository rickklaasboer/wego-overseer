import {injectable} from 'tsyringe';

/**
 * braille
 * https://github.com/Nonemoticoner/braille
 *
 * Copyright (c) 2015-2018 Nonemoticoner
 * Licensed under the MIT license.
 */

const BRAILLE = {
    ' ': '⠀', // space bar to dot-0
    _: '⠸',
    '-': '⠤',
    ',': '⠠',
    ';': '⠰',
    ':': '⠱',
    '!': '⠮',
    '?': '⠹',
    '.': '⠨',
    '(': '⠷',
    '[': '⠪',
    '@': '⠈',
    '*': '⠡',
    '/': '⠌',
    "'": '⠄',
    '"': '⠐',
    '\\': '⠳',
    '&': '⠯',
    '%': '⠩',
    '^': '⠘',
    '+': '⠬',
    '<': '⠣',
    '>': '⠜',
    $: '⠫',
    '0': '⠴',
    '1': '⠂',
    '2': '⠆',
    '3': '⠒',
    '4': '⠲',
    '5': '⠢',
    '6': '⠖',
    '7': '⠶',
    '8': '⠦',
    '9': '⠔',
    A: '⠁',
    B: '⠃',
    C: '⠉',
    D: '⠙',
    E: '⠑',
    F: '⠋',
    G: '⠛',
    H: '⠓',
    I: '⠊',
    J: '⠚',
    K: '⠅',
    L: '⠇',
    M: '⠍',
    N: '⠝',
    O: '⠕',
    P: '⠏',
    Q: '⠟',
    R: '⠗',
    S: '⠎',
    T: '⠞',
    U: '⠥',
    V: '⠧',
    W: '⠺',
    X: '⠭',
    Z: '⠵',
    ']': '⠻',
    '#': '⠼',
    Y: '⠽',
    ')': '⠾',
    '=': '⠿',
};

const ASCII = {
    ' ': ' ', // space bar to space bar
    '⠀': ' ', // dot-0 to space bar
    '⠸': '_',
    '⠤': '-',
    '⠠': ',',
    '⠰': ';',
    '⠱': ':',
    '⠮': '!',
    '⠹': '?',
    '⠨': '.',
    '⠷': '(',
    '⠪': '[',
    '⠈': '@',
    '⠡': '*',
    '⠌': '/',
    '⠄': "'",
    '⠐': '"',
    '⠳': '\\',
    '⠯': '&',
    '⠩': '%',
    '⠘': '^',
    '⠬': '+',
    '⠣': '<',
    '⠜': '>',
    '⠫': '$',
    '⠴': '0',
    '⠂': '1',
    '⠆': '2',
    '⠒': '3',
    '⠲': '4',
    '⠢': '5',
    '⠖': '6',
    '⠶': '7',
    '⠦': '8',
    '⠔': '9',
    '⠁': 'A',
    '⠃': 'B',
    '⠉': 'C',
    '⠙': 'D',
    '⠑': 'E',
    '⠋': 'F',
    '⠛': 'G',
    '⠓': 'H',
    '⠊': 'I',
    '⠚': 'J',
    '⠅': 'K',
    '⠇': 'L',
    '⠍': 'M',
    '⠝': 'N',
    '⠕': 'O',
    '⠏': 'P',
    '⠟': 'Q',
    '⠗': 'R',
    '⠎': 'S',
    '⠞': 'T',
    '⠥': 'U',
    '⠧': 'V',
    '⠺': 'W',
    '⠭': 'X',
    '⠵': 'Z',
    '⠻': ']',
    '⠼': '#',
    '⠽': 'Y',
    '⠾': ')',
    '⠿': '=',
};

@injectable()
export default class BrailleService {
    public convert(character: keyof typeof BRAILLE): string {
        const key = character.toUpperCase() as keyof typeof BRAILLE;
        return BRAILLE[key] ? BRAILLE[key] : '?';
    }

    public read(symbol: keyof typeof ASCII): string {
        const key = symbol.toUpperCase() as keyof typeof ASCII;
        return ASCII[key] ? ASCII[key] : '?';
    }

    public toBraille(input: string): string {
        return input
            .split('')
            .map((char) => this.convert(char as keyof typeof BRAILLE))
            .join('');
    }

    public toText(input: string): string {
        return input
            .split('')
            .map((char) => this.read(char as keyof typeof ASCII))
            .join('');
    }
}
