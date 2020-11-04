let lookup = [];
let revLookup = [];
let Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
let code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (let i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
/**
 * Base64加密解密
 */
let Base64 = {
    placeHoldersCount: function (b64) {
        let len = b64.length;
        if (len % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // the number of equal signs (place holders)
        // if there are two placeholders, than the two characters before it
        // represent one byte
        // if there is only one, then the three characters before it represent 2 bytes
        // this is just a cheap hack to not do indexOf twice
        return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
    },
    /**
     * Takes a base64 string and returns length of byte array
     */
    byteLength: function (b64) {
        // base64 is 4/3 + up to two characters of the original data
        return (b64.length * 3 / 4) - this.placeHoldersCount(b64);
    },
    /**
     * Takes a base64 string and returns a byte array
     */
    toByteArray: function (b64) {
        let i, l, tmp, placeHolders, arr;
        let len = b64.length;
        placeHolders = this.placeHoldersCount(b64);
        arr = new Arr((len * 3 / 4) - placeHolders);
        // if there are placeholders, only get up to the last complete 4 chars
        l = placeHolders > 0 ? len - 4 : len;
        let L = 0;
        for (i = 0; i < l; i += 4) {
            tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
            arr[L++] = (tmp >> 16) & 0xFF;
            arr[L++] = (tmp >> 8) & 0xFF;
            arr[L++] = tmp & 0xFF;
        }
        if (placeHolders === 2) {
            tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
            arr[L++] = tmp & 0xFF;
        } else if (placeHolders === 1) {
            tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
            arr[L++] = (tmp >> 8) & 0xFF;
            arr[L++] = tmp & 0xFF;
        }
        return arr;
    },
    tripletToBase64: function (num) {
        return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
    },
    encodeChunk: function (uint8, start, end) {
        let tmp;
        let output = [];
        for (let i = start; i < end; i += 3) {
            tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
            output.push(this.tripletToBase64(tmp));
        }
        return output.join('');
    },
    /**
     * Takes a byte array and returns a base64 string
     */
    fromByteArray: function (uint8) {
        let tmp;
        let len = uint8.length;
        let extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
        let output = '';
        let parts = [];
        let maxChunkLength = 16383 // must be multiple of 3
        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(this.encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
        }
        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            tmp = uint8[len - 1];
            output += lookup[tmp >> 2];
            output += lookup[(tmp << 4) & 0x3F];
            output += '==';
        } else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
            output += lookup[tmp >> 10];
            output += lookup[(tmp >> 4) & 0x3F];
            output += lookup[(tmp << 2) & 0x3F];
            output += '=';
        }
        parts.push(output);
        return parts.join('');
    }
}
export default Base64;
