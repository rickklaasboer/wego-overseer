/*
MIT License

Copyright (c) 2024 Sjors van Holst

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation images (the "Software"), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
function isLetter(char: string) {
    return /^\p{L}/u.test(char);
}

function isUpperCase(char: string) {
    return char === char.toUpperCase();
}

export function getCapitalPercentage(str: string): number {
    let totalLetters = 0;
    let upperLetters = 0;

    for (const currentLetter of str) {
        if (!isLetter(currentLetter)) continue;

        if (isUpperCase(currentLetter)) {
            upperLetters++;
        }

        totalLetters++;
    }

    return upperLetters / totalLetters;
}

export function InitModifierParam() {
    return (target: {[key: string]: any}, key: string): void => {
        let value = target[key];
        let sum = 0;

        const getter = () => value;
        const setter = (next: number | Record<string, number>) => {
            if (typeof next === 'object') {
                sum = Object.values(next).reduce((a, b) => a + b);
            }

            // @ts-ignore
            if (next < 0 || sum < 0 || next > 1 || sum > 1) {
                throw new Error(
                    `${key} modifier value must be a number between 0 and 1`,
                );
            }

            value = next;
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}

export function isUri(value: string): boolean {
    if (!value) return false;

    // Check for illegal characters
    if (/[^a-z0-9:/?#[\]@!$&'()*+,;=.-_~%]/i.test(value)) {
        return false;
    }

    // Check for hex escapes that aren't complete
    if (/%[^0-9a-f]/i.test(value) || /%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) {
        return false;
    }

    // Directly from RFC 3986
    const split = value.match(
        /(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
    );

    if (!split) return false;

    const [, scheme, authority, path] = split;

    // Scheme and path are required, though the path can be empty
    if (!(scheme && scheme.length && path.length >= 0)) return false;

    // If authority is present, the path must be empty or begin with a /
    if (authority && authority.length) {
        if (!(path.length === 0 || /^\//.test(path))) return false;
    } else if (/^\/\//.test(path)) {
        // If authority is not present, the path must not start with //
        return false;
    }

    // Scheme must begin with a letter, then consist of letters, digits, +, ., or -
    if (!/^[a-z][a-z0-9+\-.]*$/.test(scheme.toLowerCase())) return false;

    return true;
}

export function isAt(value: string): boolean {
    // Check if the first character is '@'
    const first = value.charAt(0);
    return first === '@';
}
