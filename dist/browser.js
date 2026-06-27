(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from2, except, desc2) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from2[key], enumerable: !(desc2 = __getOwnPropDesc(from2, key)) || desc2.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/base64-js/index.js
  var require_base64_js = __commonJS({
    "node_modules/base64-js/index.js"(exports) {
      "use strict";
      exports.byteLength = byteLength;
      exports.toByteArray = toByteArray;
      exports.fromByteArray = fromByteArray;
      var lookup = [];
      var revLookup = [];
      var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
      var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i];
        revLookup[code.charCodeAt(i)] = i;
      }
      var i;
      var len;
      revLookup["-".charCodeAt(0)] = 62;
      revLookup["_".charCodeAt(0)] = 63;
      function getLens(b64) {
        var len2 = b64.length;
        if (len2 % 4 > 0) {
          throw new Error("Invalid string. Length must be a multiple of 4");
        }
        var validLen = b64.indexOf("=");
        if (validLen === -1) validLen = len2;
        var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
        return [validLen, placeHoldersLen];
      }
      function byteLength(b64) {
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function _byteLength(b64, validLen, placeHoldersLen) {
        return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
      }
      function toByteArray(b64) {
        var tmp;
        var lens = getLens(b64);
        var validLen = lens[0];
        var placeHoldersLen = lens[1];
        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
        var curByte = 0;
        var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
        var i2;
        for (i2 = 0; i2 < len2; i2 += 4) {
          tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
          arr[curByte++] = tmp >> 16 & 255;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 2) {
          tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
          arr[curByte++] = tmp & 255;
        }
        if (placeHoldersLen === 1) {
          tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
          arr[curByte++] = tmp >> 8 & 255;
          arr[curByte++] = tmp & 255;
        }
        return arr;
      }
      function tripletToBase64(num) {
        return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
      }
      function encodeChunk(uint8, start, end) {
        var tmp;
        var output = [];
        for (var i2 = start; i2 < end; i2 += 3) {
          tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
          output.push(tripletToBase64(tmp));
        }
        return output.join("");
      }
      function fromByteArray(uint8) {
        var tmp;
        var len2 = uint8.length;
        var extraBytes = len2 % 3;
        var parts = [];
        var maxChunkLength = 16383;
        for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
          parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
        }
        if (extraBytes === 1) {
          tmp = uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
          );
        } else if (extraBytes === 2) {
          tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
          parts.push(
            lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
          );
        }
        return parts.join("");
      }
    }
  });

  // node_modules/ieee754/index.js
  var require_ieee754 = __commonJS({
    "node_modules/ieee754/index.js"(exports) {
      exports.read = function(buffer, offset, isLE, mLen, nBytes) {
        var e, m;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var nBits = -7;
        var i = isLE ? nBytes - 1 : 0;
        var d = isLE ? -1 : 1;
        var s = buffer[offset + i];
        i += d;
        e = s & (1 << -nBits) - 1;
        s >>= -nBits;
        nBits += eLen;
        for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        m = e & (1 << -nBits) - 1;
        e >>= -nBits;
        nBits += mLen;
        for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
        }
        if (e === 0) {
          e = 1 - eBias;
        } else if (e === eMax) {
          return m ? NaN : (s ? -1 : 1) * Infinity;
        } else {
          m = m + Math.pow(2, mLen);
          e = e - eBias;
        }
        return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
      };
      exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
        var e, m, c;
        var eLen = nBytes * 8 - mLen - 1;
        var eMax = (1 << eLen) - 1;
        var eBias = eMax >> 1;
        var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
        var i = isLE ? 0 : nBytes - 1;
        var d = isLE ? 1 : -1;
        var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
        value = Math.abs(value);
        if (isNaN(value) || value === Infinity) {
          m = isNaN(value) ? 1 : 0;
          e = eMax;
        } else {
          e = Math.floor(Math.log(value) / Math.LN2);
          if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
          }
          if (e + eBias >= 1) {
            value += rt / c;
          } else {
            value += rt * Math.pow(2, 1 - eBias);
          }
          if (value * c >= 2) {
            e++;
            c /= 2;
          }
          if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
          } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
          } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
          }
        }
        for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
        }
        e = e << mLen | m;
        eLen += mLen;
        for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
        }
        buffer[offset + i - d] |= s * 128;
      };
    }
  });

  // node_modules/buffer/index.js
  var require_buffer = __commonJS({
    "node_modules/buffer/index.js"(exports) {
      "use strict";
      var base64 = require_base64_js();
      var ieee754 = require_ieee754();
      var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
      exports.Buffer = Buffer3;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      var K_MAX_LENGTH = 2147483647;
      exports.kMaxLength = K_MAX_LENGTH;
      Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
      if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
        console.error(
          "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
        );
      }
      function typedArraySupport() {
        try {
          const arr = new Uint8Array(1);
          const proto = { foo: function() {
            return 42;
          } };
          Object.setPrototypeOf(proto, Uint8Array.prototype);
          Object.setPrototypeOf(arr, proto);
          return arr.foo() === 42;
        } catch (e) {
          return false;
        }
      }
      Object.defineProperty(Buffer3.prototype, "parent", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.buffer;
        }
      });
      Object.defineProperty(Buffer3.prototype, "offset", {
        enumerable: true,
        get: function() {
          if (!Buffer3.isBuffer(this)) return void 0;
          return this.byteOffset;
        }
      });
      function createBuffer(length) {
        if (length > K_MAX_LENGTH) {
          throw new RangeError('The value "' + length + '" is invalid for option "size"');
        }
        const buf2 = new Uint8Array(length);
        Object.setPrototypeOf(buf2, Buffer3.prototype);
        return buf2;
      }
      function Buffer3(arg, encodingOrOffset, length) {
        if (typeof arg === "number") {
          if (typeof encodingOrOffset === "string") {
            throw new TypeError(
              'The "string" argument must be of type string. Received type number'
            );
          }
          return allocUnsafe(arg);
        }
        return from2(arg, encodingOrOffset, length);
      }
      Buffer3.poolSize = 8192;
      function from2(value, encodingOrOffset, length) {
        if (typeof value === "string") {
          return fromString(value, encodingOrOffset);
        }
        if (ArrayBuffer.isView(value)) {
          return fromArrayView(value);
        }
        if (value == null) {
          throw new TypeError(
            "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
          );
        }
        if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
          return fromArrayBuffer(value, encodingOrOffset, length);
        }
        if (typeof value === "number") {
          throw new TypeError(
            'The "value" argument must not be of type number. Received type number'
          );
        }
        const valueOf = value.valueOf && value.valueOf();
        if (valueOf != null && valueOf !== value) {
          return Buffer3.from(valueOf, encodingOrOffset, length);
        }
        const b = fromObject(value);
        if (b) return b;
        if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
          return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
        }
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      Buffer3.from = function(value, encodingOrOffset, length) {
        return from2(value, encodingOrOffset, length);
      };
      Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
      Object.setPrototypeOf(Buffer3, Uint8Array);
      function assertSize(size) {
        if (typeof size !== "number") {
          throw new TypeError('"size" argument must be of type number');
        } else if (size < 0) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
      }
      function alloc(size, fill, encoding) {
        assertSize(size);
        if (size <= 0) {
          return createBuffer(size);
        }
        if (fill !== void 0) {
          return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
        }
        return createBuffer(size);
      }
      Buffer3.alloc = function(size, fill, encoding) {
        return alloc(size, fill, encoding);
      };
      function allocUnsafe(size) {
        assertSize(size);
        return createBuffer(size < 0 ? 0 : checked(size) | 0);
      }
      Buffer3.allocUnsafe = function(size) {
        return allocUnsafe(size);
      };
      Buffer3.allocUnsafeSlow = function(size) {
        return allocUnsafe(size);
      };
      function fromString(string, encoding) {
        if (typeof encoding !== "string" || encoding === "") {
          encoding = "utf8";
        }
        if (!Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        const length = byteLength(string, encoding) | 0;
        let buf2 = createBuffer(length);
        const actual = buf2.write(string, encoding);
        if (actual !== length) {
          buf2 = buf2.slice(0, actual);
        }
        return buf2;
      }
      function fromArrayLike(array) {
        const length = array.length < 0 ? 0 : checked(array.length) | 0;
        const buf2 = createBuffer(length);
        for (let i = 0; i < length; i += 1) {
          buf2[i] = array[i] & 255;
        }
        return buf2;
      }
      function fromArrayView(arrayView) {
        if (isInstance(arrayView, Uint8Array)) {
          const copy = new Uint8Array(arrayView);
          return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
        }
        return fromArrayLike(arrayView);
      }
      function fromArrayBuffer(array, byteOffset, length) {
        if (byteOffset < 0 || array.byteLength < byteOffset) {
          throw new RangeError('"offset" is outside of buffer bounds');
        }
        if (array.byteLength < byteOffset + (length || 0)) {
          throw new RangeError('"length" is outside of buffer bounds');
        }
        let buf2;
        if (byteOffset === void 0 && length === void 0) {
          buf2 = new Uint8Array(array);
        } else if (length === void 0) {
          buf2 = new Uint8Array(array, byteOffset);
        } else {
          buf2 = new Uint8Array(array, byteOffset, length);
        }
        Object.setPrototypeOf(buf2, Buffer3.prototype);
        return buf2;
      }
      function fromObject(obj) {
        if (Buffer3.isBuffer(obj)) {
          const len = checked(obj.length) | 0;
          const buf2 = createBuffer(len);
          if (buf2.length === 0) {
            return buf2;
          }
          obj.copy(buf2, 0, 0, len);
          return buf2;
        }
        if (obj.length !== void 0) {
          if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
            return createBuffer(0);
          }
          return fromArrayLike(obj);
        }
        if (obj.type === "Buffer" && Array.isArray(obj.data)) {
          return fromArrayLike(obj.data);
        }
      }
      function checked(length) {
        if (length >= K_MAX_LENGTH) {
          throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
        }
        return length | 0;
      }
      function SlowBuffer(length) {
        if (+length != length) {
          length = 0;
        }
        return Buffer3.alloc(+length);
      }
      Buffer3.isBuffer = function isBuffer(b) {
        return b != null && b._isBuffer === true && b !== Buffer3.prototype;
      };
      Buffer3.compare = function compare(a, b) {
        if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
        if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
        if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
          throw new TypeError(
            'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
          );
        }
        if (a === b) return 0;
        let x = a.length;
        let y = b.length;
        for (let i = 0, len = Math.min(x, y); i < len; ++i) {
          if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer3.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
          case "hex":
          case "utf8":
          case "utf-8":
          case "ascii":
          case "latin1":
          case "binary":
          case "base64":
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return true;
          default:
            return false;
        }
      };
      Buffer3.concat = function concat(list, length) {
        if (!Array.isArray(list)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        if (list.length === 0) {
          return Buffer3.alloc(0);
        }
        let i;
        if (length === void 0) {
          length = 0;
          for (i = 0; i < list.length; ++i) {
            length += list[i].length;
          }
        }
        const buffer = Buffer3.allocUnsafe(length);
        let pos = 0;
        for (i = 0; i < list.length; ++i) {
          let buf2 = list[i];
          if (isInstance(buf2, Uint8Array)) {
            if (pos + buf2.length > buffer.length) {
              if (!Buffer3.isBuffer(buf2)) buf2 = Buffer3.from(buf2);
              buf2.copy(buffer, pos);
            } else {
              Uint8Array.prototype.set.call(
                buffer,
                buf2,
                pos
              );
            }
          } else if (!Buffer3.isBuffer(buf2)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
          } else {
            buf2.copy(buffer, pos);
          }
          pos += buf2.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer3.isBuffer(string)) {
          return string.length;
        }
        if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
          return string.byteLength;
        }
        if (typeof string !== "string") {
          throw new TypeError(
            'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
          );
        }
        const len = string.length;
        const mustMatch = arguments.length > 2 && arguments[2] === true;
        if (!mustMatch && len === 0) return 0;
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "ascii":
            case "latin1":
            case "binary":
              return len;
            case "utf8":
            case "utf-8":
              return utf8ToBytes(string).length;
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return len * 2;
            case "hex":
              return len >>> 1;
            case "base64":
              return base64ToBytes(string).length;
            default:
              if (loweredCase) {
                return mustMatch ? -1 : utf8ToBytes(string).length;
              }
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        let loweredCase = false;
        if (start === void 0 || start < 0) {
          start = 0;
        }
        if (start > this.length) {
          return "";
        }
        if (end === void 0 || end > this.length) {
          end = this.length;
        }
        if (end <= 0) {
          return "";
        }
        end >>>= 0;
        start >>>= 0;
        if (end <= start) {
          return "";
        }
        if (!encoding) encoding = "utf8";
        while (true) {
          switch (encoding) {
            case "hex":
              return hexSlice(this, start, end);
            case "utf8":
            case "utf-8":
              return utf8Slice(this, start, end);
            case "ascii":
              return asciiSlice(this, start, end);
            case "latin1":
            case "binary":
              return latin1Slice(this, start, end);
            case "base64":
              return base64Slice(this, start, end);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return utf16leSlice(this, start, end);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = (encoding + "").toLowerCase();
              loweredCase = true;
          }
        }
      }
      Buffer3.prototype._isBuffer = true;
      function swap(b, n, m) {
        const i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer3.prototype.swap16 = function swap16() {
        const len = this.length;
        if (len % 2 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 16-bits");
        }
        for (let i = 0; i < len; i += 2) {
          swap(this, i, i + 1);
        }
        return this;
      };
      Buffer3.prototype.swap32 = function swap32() {
        const len = this.length;
        if (len % 4 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 32-bits");
        }
        for (let i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer3.prototype.swap64 = function swap64() {
        const len = this.length;
        if (len % 8 !== 0) {
          throw new RangeError("Buffer size must be a multiple of 64-bits");
        }
        for (let i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer3.prototype.toString = function toString() {
        const length = this.length;
        if (length === 0) return "";
        if (arguments.length === 0) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
      Buffer3.prototype.equals = function equals(b) {
        if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return Buffer3.compare(this, b) === 0;
      };
      Buffer3.prototype.inspect = function inspect() {
        let str = "";
        const max = exports.INSPECT_MAX_BYTES;
        str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
        if (this.length > max) str += " ... ";
        return "<Buffer " + str + ">";
      };
      if (customInspectSymbol) {
        Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
      }
      Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (isInstance(target, Uint8Array)) {
          target = Buffer3.from(target, target.offset, target.byteLength);
        }
        if (!Buffer3.isBuffer(target)) {
          throw new TypeError(
            'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
          );
        }
        if (start === void 0) {
          start = 0;
        }
        if (end === void 0) {
          end = target ? target.length : 0;
        }
        if (thisStart === void 0) {
          thisStart = 0;
        }
        if (thisEnd === void 0) {
          thisEnd = this.length;
        }
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
          throw new RangeError("out of range index");
        }
        if (thisStart >= thisEnd && start >= end) {
          return 0;
        }
        if (thisStart >= thisEnd) {
          return -1;
        }
        if (start >= end) {
          return 1;
        }
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        let x = thisEnd - thisStart;
        let y = end - start;
        const len = Math.min(x, y);
        const thisCopy = this.slice(thisStart, thisEnd);
        const targetCopy = target.slice(start, end);
        for (let i = 0; i < len; ++i) {
          if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
          }
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (buffer.length === 0) return -1;
        if (typeof byteOffset === "string") {
          encoding = byteOffset;
          byteOffset = 0;
        } else if (byteOffset > 2147483647) {
          byteOffset = 2147483647;
        } else if (byteOffset < -2147483648) {
          byteOffset = -2147483648;
        }
        byteOffset = +byteOffset;
        if (numberIsNaN(byteOffset)) {
          byteOffset = dir ? 0 : buffer.length - 1;
        }
        if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          else byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (dir) byteOffset = 0;
          else return -1;
        }
        if (typeof val === "string") {
          val = Buffer3.from(val, encoding);
        }
        if (Buffer3.isBuffer(val)) {
          if (val.length === 0) {
            return -1;
          }
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        } else if (typeof val === "number") {
          val = val & 255;
          if (typeof Uint8Array.prototype.indexOf === "function") {
            if (dir) {
              return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
              return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
          }
          return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        let indexSize = 1;
        let arrLength = arr.length;
        let valLength = val.length;
        if (encoding !== void 0) {
          encoding = String(encoding).toLowerCase();
          if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
            if (arr.length < 2 || val.length < 2) {
              return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf2, i2) {
          if (indexSize === 1) {
            return buf2[i2];
          } else {
            return buf2.readUInt16BE(i2 * indexSize);
          }
        }
        let i;
        if (dir) {
          let foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
              if (foundIndex === -1) foundIndex = i;
              if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
            } else {
              if (foundIndex !== -1) i -= i - foundIndex;
              foundIndex = -1;
            }
          }
        } else {
          if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
          for (i = byteOffset; i >= 0; i--) {
            let found = true;
            for (let j = 0; j < valLength; j++) {
              if (read(arr, i + j) !== read(val, j)) {
                found = false;
                break;
              }
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
        return this.indexOf(val, byteOffset, encoding) !== -1;
      };
      Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf2, string, offset, length) {
        offset = Number(offset) || 0;
        const remaining = buf2.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = Number(length);
          if (length > remaining) {
            length = remaining;
          }
        }
        const strLen = string.length;
        if (length > strLen / 2) {
          length = strLen / 2;
        }
        let i;
        for (i = 0; i < length; ++i) {
          const parsed = parseInt(string.substr(i * 2, 2), 16);
          if (numberIsNaN(parsed)) return i;
          buf2[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf2, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf2.length - offset), buf2, offset, length);
      }
      function asciiWrite(buf2, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf2, offset, length);
      }
      function base64Write(buf2, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf2, offset, length);
      }
      function ucs2Write(buf2, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf2.length - offset), buf2, offset, length);
      }
      Buffer3.prototype.write = function write(string, offset, length, encoding) {
        if (offset === void 0) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (length === void 0 && typeof offset === "string") {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else if (isFinite(offset)) {
          offset = offset >>> 0;
          if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === void 0) encoding = "utf8";
          } else {
            encoding = length;
            length = void 0;
          }
        } else {
          throw new Error(
            "Buffer.write(string, encoding, offset[, length]) is no longer supported"
          );
        }
        const remaining = this.length - offset;
        if (length === void 0 || length > remaining) length = remaining;
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
          throw new RangeError("Attempt to write outside buffer bounds");
        }
        if (!encoding) encoding = "utf8";
        let loweredCase = false;
        for (; ; ) {
          switch (encoding) {
            case "hex":
              return hexWrite(this, string, offset, length);
            case "utf8":
            case "utf-8":
              return utf8Write(this, string, offset, length);
            case "ascii":
            case "latin1":
            case "binary":
              return asciiWrite(this, string, offset, length);
            case "base64":
              return base64Write(this, string, offset, length);
            case "ucs2":
            case "ucs-2":
            case "utf16le":
            case "utf-16le":
              return ucs2Write(this, string, offset, length);
            default:
              if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
              encoding = ("" + encoding).toLowerCase();
              loweredCase = true;
          }
        }
      };
      Buffer3.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf2, start, end) {
        if (start === 0 && end === buf2.length) {
          return base64.fromByteArray(buf2);
        } else {
          return base64.fromByteArray(buf2.slice(start, end));
        }
      }
      function utf8Slice(buf2, start, end) {
        end = Math.min(buf2.length, end);
        const res = [];
        let i = start;
        while (i < end) {
          const firstByte = buf2[i];
          let codePoint = null;
          let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            let secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
              case 1:
                if (firstByte < 128) {
                  codePoint = firstByte;
                }
                break;
              case 2:
                secondByte = buf2[i + 1];
                if ((secondByte & 192) === 128) {
                  tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                  if (tempCodePoint > 127) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 3:
                secondByte = buf2[i + 1];
                thirdByte = buf2[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                  if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                    codePoint = tempCodePoint;
                  }
                }
                break;
              case 4:
                secondByte = buf2[i + 1];
                thirdByte = buf2[i + 2];
                fourthByte = buf2[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                  tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                  if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                    codePoint = tempCodePoint;
                  }
                }
            }
          }
          if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        const len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) {
          return String.fromCharCode.apply(String, codePoints);
        }
        let res = "";
        let i = 0;
        while (i < len) {
          res += String.fromCharCode.apply(
            String,
            codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
          );
        }
        return res;
      }
      function asciiSlice(buf2, start, end) {
        let ret = "";
        end = Math.min(buf2.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf2[i] & 127);
        }
        return ret;
      }
      function latin1Slice(buf2, start, end) {
        let ret = "";
        end = Math.min(buf2.length, end);
        for (let i = start; i < end; ++i) {
          ret += String.fromCharCode(buf2[i]);
        }
        return ret;
      }
      function hexSlice(buf2, start, end) {
        const len = buf2.length;
        if (!start || start < 0) start = 0;
        if (!end || end < 0 || end > len) end = len;
        let out = "";
        for (let i = start; i < end; ++i) {
          out += hexSliceLookupTable[buf2[i]];
        }
        return out;
      }
      function utf16leSlice(buf2, start, end) {
        const bytes = buf2.slice(start, end);
        let res = "";
        for (let i = 0; i < bytes.length - 1; i += 2) {
          res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
        }
        return res;
      }
      Buffer3.prototype.slice = function slice(start, end) {
        const len = this.length;
        start = ~~start;
        end = end === void 0 ? len : ~~end;
        if (start < 0) {
          start += len;
          if (start < 0) start = 0;
        } else if (start > len) {
          start = len;
        }
        if (end < 0) {
          end += len;
          if (end < 0) end = 0;
        } else if (end > len) {
          end = len;
        }
        if (end < start) end = start;
        const newBuf = this.subarray(start, end);
        Object.setPrototypeOf(newBuf, Buffer3.prototype);
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          checkOffset(offset, byteLength2, this.length);
        }
        let val = this[offset + --byteLength2];
        let mul = 1;
        while (byteLength2 > 0 && (mul *= 256)) {
          val += this[offset + --byteLength2] * mul;
        }
        return val;
      };
      Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
      };
      Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first2 = this[offset];
        const last = this[offset + 7];
        if (first2 === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const lo = first2 + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
        const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
        return BigInt(lo) + (BigInt(hi) << BigInt(32));
      });
      Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first2 = this[offset];
        const last = this[offset + 7];
        if (first2 === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const hi = first2 * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
        return (BigInt(hi) << BigInt(32)) + BigInt(lo);
      });
      Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let val = this[offset];
        let mul = 1;
        let i = 0;
        while (++i < byteLength2 && (mul *= 256)) {
          val += this[offset + i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) checkOffset(offset, byteLength2, this.length);
        let i = byteLength2;
        let mul = 1;
        let val = this[offset + --i];
        while (i > 0 && (mul *= 256)) {
          val += this[offset + --i] * mul;
        }
        mul *= 128;
        if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
        return val;
      };
      Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 1, this.length);
        if (!(this[offset] & 128)) return this[offset];
        return (255 - this[offset] + 1) * -1;
      };
      Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset] | this[offset + 1] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 2, this.length);
        const val = this[offset + 1] | this[offset] << 8;
        return val & 32768 ? val | 4294901760 : val;
      };
      Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first2 = this[offset];
        const last = this[offset + 7];
        if (first2 === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
        return (BigInt(val) << BigInt(32)) + BigInt(first2 + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
      });
      Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
        offset = offset >>> 0;
        validateNumber(offset, "offset");
        const first2 = this[offset];
        const last = this[offset + 7];
        if (first2 === void 0 || last === void 0) {
          boundsError(offset, this.length - 8);
        }
        const val = (first2 << 24) + // Overflow
        this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
        return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
      });
      Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        offset = offset >>> 0;
        if (!noAssert) checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf2, value, offset, ext, max, min) {
        if (!Buffer3.isBuffer(buf2)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf2.length) throw new RangeError("Index out of range");
      }
      Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let mul = 1;
        let i = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        byteLength2 = byteLength2 >>> 0;
        if (!noAssert) {
          const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
          checkInt(this, value, offset, byteLength2, maxBytes, 0);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          this[offset + i] = value / mul & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      function wrtBigUInt64LE(buf2, value, offset, min, max) {
        checkIntBI(value, min, max, buf2, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf2[offset++] = lo;
        lo = lo >> 8;
        buf2[offset++] = lo;
        lo = lo >> 8;
        buf2[offset++] = lo;
        lo = lo >> 8;
        buf2[offset++] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf2[offset++] = hi;
        hi = hi >> 8;
        buf2[offset++] = hi;
        hi = hi >> 8;
        buf2[offset++] = hi;
        hi = hi >> 8;
        buf2[offset++] = hi;
        return offset;
      }
      function wrtBigUInt64BE(buf2, value, offset, min, max) {
        checkIntBI(value, min, max, buf2, offset, 7);
        let lo = Number(value & BigInt(4294967295));
        buf2[offset + 7] = lo;
        lo = lo >> 8;
        buf2[offset + 6] = lo;
        lo = lo >> 8;
        buf2[offset + 5] = lo;
        lo = lo >> 8;
        buf2[offset + 4] = lo;
        let hi = Number(value >> BigInt(32) & BigInt(4294967295));
        buf2[offset + 3] = hi;
        hi = hi >> 8;
        buf2[offset + 2] = hi;
        hi = hi >> 8;
        buf2[offset + 1] = hi;
        hi = hi >> 8;
        buf2[offset] = hi;
        return offset + 8;
      }
      Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
      });
      Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = 0;
        let mul = 1;
        let sub = 0;
        this[offset] = value & 255;
        while (++i < byteLength2 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          const limit = Math.pow(2, 8 * byteLength2 - 1);
          checkInt(this, value, offset, byteLength2, limit - 1, -limit);
        }
        let i = byteLength2 - 1;
        let mul = 1;
        let sub = 0;
        this[offset + i] = value & 255;
        while (--i >= 0 && (mul *= 256)) {
          if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
          }
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength2;
      };
      Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
        if (value < 0) value = 255 + value + 1;
        this[offset] = value & 255;
        return offset + 1;
      };
      Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        return offset + 2;
      };
      Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
        return offset + 2;
      };
      Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
        return offset + 4;
      };
      Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (value < 0) value = 4294967295 + value + 1;
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
        return offset + 4;
      };
      Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
        return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
        return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
      });
      function checkIEEE754(buf2, value, offset, ext, max, min) {
        if (offset + ext > buf2.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf2, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf2, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        }
        ieee754.write(buf2, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf2, value, offset, littleEndian, noAssert) {
        value = +value;
        offset = offset >>> 0;
        if (!noAssert) {
          checkIEEE754(buf2, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        }
        ieee754.write(buf2, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
        if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
        if (!start) start = 0;
        if (!end && end !== 0) end = this.length;
        if (targetStart >= target.length) targetStart = target.length;
        if (!targetStart) targetStart = 0;
        if (end > 0 && end < start) end = start;
        if (end === start) return 0;
        if (target.length === 0 || this.length === 0) return 0;
        if (targetStart < 0) {
          throw new RangeError("targetStart out of bounds");
        }
        if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        if (end > this.length) end = this.length;
        if (target.length - targetStart < end - start) {
          end = target.length - targetStart + start;
        }
        const len = end - start;
        if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
          this.copyWithin(targetStart, start, end);
        } else {
          Uint8Array.prototype.set.call(
            target,
            this.subarray(start, end),
            targetStart
          );
        }
        return len;
      };
      Buffer3.prototype.fill = function fill(val, start, end, encoding) {
        if (typeof val === "string") {
          if (typeof start === "string") {
            encoding = start;
            start = 0;
            end = this.length;
          } else if (typeof end === "string") {
            encoding = end;
            end = this.length;
          }
          if (encoding !== void 0 && typeof encoding !== "string") {
            throw new TypeError("encoding must be a string");
          }
          if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
            throw new TypeError("Unknown encoding: " + encoding);
          }
          if (val.length === 1) {
            const code = val.charCodeAt(0);
            if (encoding === "utf8" && code < 128 || encoding === "latin1") {
              val = code;
            }
          }
        } else if (typeof val === "number") {
          val = val & 255;
        } else if (typeof val === "boolean") {
          val = Number(val);
        }
        if (start < 0 || this.length < start || this.length < end) {
          throw new RangeError("Out of range index");
        }
        if (end <= start) {
          return this;
        }
        start = start >>> 0;
        end = end === void 0 ? this.length : end >>> 0;
        if (!val) val = 0;
        let i;
        if (typeof val === "number") {
          for (i = start; i < end; ++i) {
            this[i] = val;
          }
        } else {
          const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
          const len = bytes.length;
          if (len === 0) {
            throw new TypeError('The value "' + val + '" is invalid for argument "value"');
          }
          for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
          }
        }
        return this;
      };
      var errors = {};
      function E(sym, getMessage, Base) {
        errors[sym] = class NodeError extends Base {
          constructor() {
            super();
            Object.defineProperty(this, "message", {
              value: getMessage.apply(this, arguments),
              writable: true,
              configurable: true
            });
            this.name = `${this.name} [${sym}]`;
            this.stack;
            delete this.name;
          }
          get code() {
            return sym;
          }
          set code(value) {
            Object.defineProperty(this, "code", {
              configurable: true,
              enumerable: true,
              value,
              writable: true
            });
          }
          toString() {
            return `${this.name} [${sym}]: ${this.message}`;
          }
        };
      }
      E(
        "ERR_BUFFER_OUT_OF_BOUNDS",
        function(name) {
          if (name) {
            return `${name} is outside of buffer bounds`;
          }
          return "Attempt to access memory outside buffer bounds";
        },
        RangeError
      );
      E(
        "ERR_INVALID_ARG_TYPE",
        function(name, actual) {
          return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
        },
        TypeError
      );
      E(
        "ERR_OUT_OF_RANGE",
        function(str, range, input) {
          let msg = `The value of "${str}" is out of range.`;
          let received = input;
          if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
            received = addNumericalSeparator(String(input));
          } else if (typeof input === "bigint") {
            received = String(input);
            if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
              received = addNumericalSeparator(received);
            }
            received += "n";
          }
          msg += ` It must be ${range}. Received ${received}`;
          return msg;
        },
        RangeError
      );
      function addNumericalSeparator(val) {
        let res = "";
        let i = val.length;
        const start = val[0] === "-" ? 1 : 0;
        for (; i >= start + 4; i -= 3) {
          res = `_${val.slice(i - 3, i)}${res}`;
        }
        return `${val.slice(0, i)}${res}`;
      }
      function checkBounds(buf2, offset, byteLength2) {
        validateNumber(offset, "offset");
        if (buf2[offset] === void 0 || buf2[offset + byteLength2] === void 0) {
          boundsError(offset, buf2.length - (byteLength2 + 1));
        }
      }
      function checkIntBI(value, min, max, buf2, offset, byteLength2) {
        if (value > max || value < min) {
          const n = typeof min === "bigint" ? "n" : "";
          let range;
          if (byteLength2 > 3) {
            if (min === 0 || min === BigInt(0)) {
              range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
            } else {
              range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
            }
          } else {
            range = `>= ${min}${n} and <= ${max}${n}`;
          }
          throw new errors.ERR_OUT_OF_RANGE("value", range, value);
        }
        checkBounds(buf2, offset, byteLength2);
      }
      function validateNumber(value, name) {
        if (typeof value !== "number") {
          throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
        }
      }
      function boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
          validateNumber(value, type);
          throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) {
          throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
        }
        throw new errors.ERR_OUT_OF_RANGE(
          type || "offset",
          `>= ${type ? 1 : 0} and <= ${length}`,
          value
        );
      }
      var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = str.split("=")[0];
        str = str.trim().replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) {
          str = str + "=";
        }
        return str;
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        let codePoint;
        const length = string.length;
        let leadSurrogate = null;
        const bytes = [];
        for (let i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              } else if (i + 1 === length) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
          } else if (leadSurrogate) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
          }
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(
              codePoint >> 6 | 192,
              codePoint & 63 | 128
            );
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(
              codePoint >> 12 | 224,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(
              codePoint >> 18 | 240,
              codePoint >> 12 & 63 | 128,
              codePoint >> 6 & 63 | 128,
              codePoint & 63 | 128
            );
          } else {
            throw new Error("Invalid code point");
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          byteArray.push(str.charCodeAt(i) & 255);
        }
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        let c, hi, lo;
        const byteArray = [];
        for (let i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        let i;
        for (i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isInstance(obj, type) {
        return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
      }
      function numberIsNaN(obj) {
        return obj !== obj;
      }
      var hexSliceLookupTable = (function() {
        const alphabet = "0123456789abcdef";
        const table = new Array(256);
        for (let i = 0; i < 16; ++i) {
          const i16 = i * 16;
          for (let j = 0; j < 16; ++j) {
            table[i16 + j] = alphabet[i] + alphabet[j];
          }
        }
        return table;
      })();
      function defineBigIntMethod(fn) {
        return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
      }
      function BufferBigIntNotDefined() {
        throw new Error("BigInt not supported");
      }
    }
  });

  // node_modules/@muze-nl/jsfs/src/Path.mjs
  var Path = class _Path {
    #value;
    constructor(path) {
      this.#value = _Path.collapse(path);
    }
    get value() {
      return this.#value;
    }
    toString() {
      return this.#value;
    }
    get length() {
      return this.#value.length;
    }
    static collapse(path, cwd = "") {
      if (path instanceof _Path) {
        return path.value;
      }
      if (typeof path !== "string") {
        throw new TypeError("path argument must be a string or an instance of Path");
      }
      if (cwd && !(cwd instanceof _Path)) {
        cwd = new _Path(cwd);
      }
      path = path.trim();
      if (path.length === 0) {
        return cwd.value;
      }
      if (_Path.isRelative(path)) {
        path = cwd + path;
      }
      let pathnames = _Path.reduce(path, (result2, entry) => {
        if (entry == "..") {
          result2.pop();
        } else if (entry !== ".") {
          result2.push(entry);
        }
        return result2;
      }, []);
      let result = "/";
      if (pathnames.length) {
        result += pathnames.join("/");
        if (_Path.isFolder(path)) {
          result += "/";
        }
      }
      return "" + result;
    }
    static isAbsolute(path) {
      if (path instanceof _Path) {
        return true;
      }
      return path.length && path[0] === "/";
    }
    static isRelative(path) {
      return !_Path.isAbsolute(path);
    }
    static isFolder(path) {
      if (path instanceof _Path) {
        path = path.value;
      }
      return path.length && path[path.length - 1] == "/";
    }
    static isPath(path) {
      if (path instanceof _Path) {
        return true;
      }
      if (typeof path !== "string") {
        return false;
      }
      path = path.trim();
      let u = new URL(path, document.location);
      return u.pathname == path;
    }
    static reduce(path, reducer, initial) {
      if (path instanceof _Path) {
        path = path.value;
      }
      return path.split("/").filter(Boolean).reduce(reducer, initial);
    }
    static map(path, callback) {
      if (path instanceof _Path) {
        path = path.value;
      }
      return path.split("/").filter(Boolean).map(callback);
    }
    static parent(path) {
      if (path instanceof _Path) {
        path = path.value;
      }
      path = path.split("/").filter(Boolean);
      path.pop();
      let result = "/";
      if (path.length) {
        result += path.join("/") + "/";
      }
      return result;
    }
    static filename(path) {
      if (path instanceof _Path) {
        path = path.value;
      }
      return path.split("/").filter(Boolean).pop();
    }
    static head(path) {
      if (path instanceof _Path) {
        path = path.value;
      }
      return path.split("/").filter(Boolean).shift();
    }
    static tail(path) {
      if (path instanceof _Path) {
        path = path.value;
      }
      path = path.split("/").filter(Boolean);
      path.shift();
      let result = "/";
      if (path.length) {
        result += path.join("/") + "/";
      }
      return result;
    }
  };

  // node_modules/@muze-nl/jsfs/src/FileSystem.mjs
  var FileSystem = class _FileSystem {
    #adapter;
    #path = "/";
    constructor(adapter) {
      this.#adapter = adapter;
      this.#path = this.#adapter.path;
    }
    get path() {
      return this.#path;
    }
    cd(path) {
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      return new _FileSystem(this.#adapter.cd(path));
    }
    async read(path, reader = null) {
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      if (typeof reader === "function") {
        if (!this.#adapter.supportsStreamingRead()) {
          throw new Error("Adapter " + this.#adapter.name + " does not support streaming reading.");
        }
        return this.#adapter.readStream(path, reader);
      } else {
        return this.#adapter.read(path);
      }
    }
    async write(path, contents, metadata = null) {
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      if (!this.#adapter.supportsWrite()) {
        throw new Error("Adapter " + this.#adapter.name + " is read only.");
      }
      if (typeof contents === "function") {
        if (!this.#adapter.supportsStreamingWrite()) {
          throw new Error("Adapter " + this.#adapter.name + " does not support streaming writing.");
        }
        return this.#adapter.writeStream(path, contents, metadata);
      } else if (typeof contents === "string") {
        return this.#adapter.write(path, contents, metadata);
      } else {
        throw new TypeError("Cannot write contents of type " + typeof contents);
      }
    }
    async remove(path) {
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      return this.#adapter.remove(path);
    }
    async exists(path) {
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      return this.#adapter.exists(path);
    }
    async list(path = "") {
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      return this.#adapter.list(path);
    }
    async mkdir(path = "") {
      if (!this.#adapter.supportsWrite()) {
        throw new Error("Adapter " + this.#adapter.name + " is read only.");
      }
      if (!this.#adapter.supportsDirectories) {
        throw new Error("Adapter " + this.#adapter.name + " does not support directories.");
      }
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      return this.#adapter.mkdir(path);
    }
    async rmdir(path = "") {
      if (!this.#adapter.supportsWrite()) {
        throw new Error("Adapter " + this.#adapter.name + " is read only.");
      }
      if (!this.#adapter.supportsDirectories) {
        throw new Error("Adapter " + this.#adapter.name + " does not support directories.");
      }
      if (!(path instanceof Path)) {
        path = new Path(Path.collapse(path, this.#path));
      }
      return this.#adapter.rmdir(path);
    }
  };

  // node_modules/@muze-nl/metro/src/metro.mjs
  var metro_exports = {};
  __export(metro_exports, {
    Client: () => Client,
    client: () => client,
    deepClone: () => deepClone,
    formdata: () => formdata,
    metroError: () => metroError,
    request: () => request,
    response: () => response,
    trace: () => trace,
    url: () => url
  });
  var metroURL = "https://metro.muze.nl/details/";
  if (!Symbol.metroProxy) {
    Symbol.metroProxy = Symbol("isProxy");
  }
  if (!Symbol.metroSource) {
    Symbol.metroSource = Symbol("source");
  }
  var Client = class _Client {
    clientOptions = {
      url: typeof window != "undefined" ? url(window.location) : url("https://localhost"),
      verbs: ["get", "post", "put", "delete", "patch", "head", "options", "query"]
    };
    static tracers = {};
    /**
     * @typedef {Object} ClientOptions
     * @property {Array} middlewares - list of middleware functions
     * @property {string|URL} url - default url of the client
     * @property {[string]} verbs - a list of verb methods to expose, e.g. ['get','post']
     * 
     * Constructs a new metro client. Can have any number of params.
     * @params {ClientOptions|URL|Function|Client}
     * @returns {Client} - A metro client object with given or default verb methods
     */
    constructor(...options) {
      for (let option of options) {
        if (typeof option == "string" || option instanceof String) {
          this.clientOptions.url = url(this.clientOptions.url.href, option);
        } else if (option instanceof _Client) {
          Object.assign(this.clientOptions, option.clientOptions);
        } else if (option instanceof Function) {
          this.#addMiddlewares([option]);
        } else if (option && typeof option == "object") {
          for (let param in option) {
            if (param == "middlewares") {
              this.#addMiddlewares(option[param]);
            } else if (param == "url") {
              this.clientOptions.url = url(this.clientOptions.url.href, option[param]);
            } else if (typeof option[param] == "function") {
              this.clientOptions[param] = option[param](this.clientOptions[param], this.clientOptions);
            } else {
              this.clientOptions[param] = option[param];
            }
          }
        }
      }
      for (const verb of this.clientOptions.verbs) {
        this[verb] = async function(...options2) {
          return this.fetch(request(
            this.clientOptions,
            ...options2,
            { method: verb.toUpperCase() }
          ));
        };
      }
    }
    #addMiddlewares(middlewares) {
      if (typeof middlewares == "function") {
        middlewares = [middlewares];
      }
      let index = middlewares.findIndex((m) => typeof m != "function");
      if (index >= 0) {
        throw metroError("metro.client: middlewares must be a function or an array of functions " + metroURL + "client/invalid-middlewares/", middlewares[index]);
      }
      if (!Array.isArray(this.clientOptions.middlewares)) {
        this.clientOptions.middlewares = [];
      }
      this.clientOptions.middlewares = this.clientOptions.middlewares.concat(middlewares);
    }
    /**
     * Mimics the standard browser fetch method, but uses any middleware installed through
     * the constructor.
     * @param {Request|string|Object} - Required. The URL or Request object, accepts all types that are accepted by metro.request
     * @param {Object} - Optional. Any object that is accepted by metro.request
     * @return {Promise<Response|*>} - The metro.response to this request, or any other result as changed by any included middleware.
     */
    fetch(req, options) {
      req = request(req, options);
      if (!req.url) {
        throw metroError("metro.client." + req.method.toLowerCase() + ": Missing url parameter " + metroURL + "client/fetch-missing-url/", req);
      }
      if (!options) {
        options = {};
      }
      if (!(typeof options === "object") || options instanceof String) {
        throw metroError("metro.client.fetch: Invalid options parameter " + metroURL + "client/fetch-invalid-options/", options);
      }
      const metrofetch = async function browserFetch(req2) {
        if (req2[Symbol.metroProxy]) {
          req2 = req2[Symbol.metroSource];
        }
        const res = await fetch(req2);
        return response(res);
      };
      let middlewares = [metrofetch].concat(this.clientOptions?.middlewares?.slice() || []);
      options = Object.assign({}, this.clientOptions, options);
      let next;
      for (let middleware of middlewares) {
        next = /* @__PURE__ */ (function(next2, middleware2) {
          return async function(req2) {
            let res;
            let tracers = Object.values(_Client.tracers);
            for (let tracer of tracers) {
              if (tracer.request) {
                tracer.request.call(tracer, req2, middleware2);
              }
            }
            res = await middleware2(req2, next2);
            for (let tracer of tracers) {
              if (tracer.response) {
                tracer.response.call(tracer, res, middleware2);
              }
            }
            return res;
          };
        })(next, middleware);
      }
      return next(req);
    }
    with(...options) {
      return new _Client(deepClone(this.clientOptions), ...options);
    }
    get location() {
      return this.clientOptions.url;
    }
  };
  function client(...options) {
    return new Client(...deepClone(options));
  }
  function getRequestParams(req, current) {
    let params = current || {};
    if (!params.url && current.url) {
      params.url = current.url;
    }
    for (let prop of [
      "method",
      "headers",
      "body",
      "mode",
      "credentials",
      "cache",
      "redirect",
      "referrer",
      "referrerPolicy",
      "integrity",
      "keepalive",
      "signal",
      "priority",
      "url"
    ]) {
      let value = req[prop];
      if (typeof value == "undefined" || value == null) {
        continue;
      }
      if (value?.[Symbol.metroProxy]) {
        value = value[Symbol.metroSource];
      }
      if (typeof value == "function") {
        params[prop] = value(params[prop], params);
      } else {
        if (prop == "url") {
          params.url = url(params.url, value);
        } else if (prop == "headers") {
          params.headers = new Headers(current.headers);
          if (!(value instanceof Headers)) {
            value = new Headers(req.headers);
          }
          for (let [key, val] of value.entries()) {
            params.headers.set(key, val);
          }
        } else {
          params[prop] = value;
        }
      }
    }
    if (req instanceof Request && req.data) {
      params.body = req.data;
    }
    return params;
  }
  function request(...options) {
    let requestParams = {
      url: typeof window != "undefined" ? url(window.location) : url("https://localhost/"),
      duplex: "half"
      // required when setting body to ReadableStream, just set it here by default already
    };
    for (let option of options) {
      if (typeof option == "string" || option instanceof URL || option instanceof URLSearchParams) {
        requestParams.url = url(requestParams.url, option);
      } else if (option && (option instanceof FormData || option instanceof ReadableStream || option instanceof Blob || option instanceof ArrayBuffer || option instanceof DataView)) {
        requestParams.body = option;
      } else if (option && typeof option == "object") {
        Object.assign(requestParams, getRequestParams(option, requestParams));
      }
    }
    let r = new Request(requestParams.url, requestParams);
    let data = requestParams.body;
    if (data) {
      if (typeof data == "object" && !(data instanceof String) && !(data instanceof ReadableStream) && !(data instanceof Blob) && !(data instanceof ArrayBuffer) && !(data instanceof DataView) && !(data instanceof FormData) && !(data instanceof URLSearchParams) && (typeof globalThis.TypedArray == "undefined" || !(data instanceof globalThis.TypedArray))) {
        if (typeof data.toString == "function") {
          requestParams.body = data.toString({ headers: r.headers });
          r = new Request(requestParams.url, requestParams);
        }
      }
    }
    Object.freeze(r);
    return new Proxy(r, {
      get(target, prop) {
        let result;
        switch (prop) {
          case Symbol.metroSource:
            result = target;
            break;
          case Symbol.metroProxy:
            result = true;
            break;
          case "with":
            result = function(...options2) {
              if (data) {
                options2.unshift({ body: data });
              }
              return request(target, ...options2);
            };
            break;
          case "data":
            result = data;
            break;
          default:
            if (target[prop] instanceof Function) {
              if (prop === "clone") {
              }
              result = target[prop].bind(target);
            } else {
              result = target[prop];
            }
            break;
        }
        return result;
      }
    });
  }
  function getResponseParams(res, current) {
    let params = current || {};
    if (!params.url && current.url) {
      params.url = current.url;
    }
    for (let prop of ["status", "statusText", "headers", "body", "url", "type", "redirected"]) {
      let value = res[prop];
      if (typeof value == "undefined" || value == null) {
        continue;
      }
      if (value?.[Symbol.metroProxy]) {
        value = value[Symbol.metroSource];
      }
      if (typeof value == "function") {
        params[prop] = value(params[prop], params);
      } else {
        if (prop == "url") {
          params.url = new URL(value, params.url || "https://localhost/");
        } else {
          params[prop] = value;
        }
      }
    }
    if (res instanceof Response && res.data) {
      params.body = res.data;
    }
    return params;
  }
  function response(...options) {
    let responseParams = {};
    for (let option of options) {
      if (typeof option == "string") {
        responseParams.body = option;
      } else if (option instanceof Response) {
        Object.assign(responseParams, getResponseParams(option, responseParams));
      } else if (option && typeof option == "object") {
        if (option instanceof FormData || option instanceof Blob || option instanceof ArrayBuffer || option instanceof DataView || option instanceof ReadableStream || option instanceof URLSearchParams || option instanceof String || typeof globalThis.TypedArray != "undefined" && option instanceof globalThis.TypedArray) {
          responseParams.body = option;
        } else {
          Object.assign(responseParams, getResponseParams(option, responseParams));
        }
      }
    }
    let data = void 0;
    if (responseParams.body) {
      data = responseParams.body;
    }
    if ([101, 204, 205, 304].includes(responseParams.status)) {
      responseParams.body = null;
    }
    let r = new Response(responseParams.body, responseParams);
    Object.freeze(r);
    return new Proxy(r, {
      get(target, prop) {
        let result;
        switch (prop) {
          case Symbol.metroProxy:
            result = true;
            break;
          case Symbol.metroSource:
            result = target;
            break;
          case "with":
            result = function(...options2) {
              return response(target, ...options2);
            };
            break;
          case "data":
            result = data;
            break;
          case "ok":
            result = target.status >= 200 && target.status < 400;
            break;
          default:
            if (typeof target[prop] == "function") {
              result = target[prop].bind(target);
            } else {
              result = target[prop];
            }
            break;
        }
        return result;
      }
    });
  }
  function appendSearchParams(url2, params) {
    if (typeof params == "function") {
      params(url2.searchParams, url2);
    } else {
      params = new URLSearchParams(params);
      params.forEach((value, key) => {
        url2.searchParams.append(key, value);
      });
    }
  }
  function url(...options) {
    let validParams = [
      "hash",
      "host",
      "hostname",
      "href",
      "password",
      "pathname",
      "port",
      "protocol",
      "username",
      "search",
      "searchParams"
    ];
    let u = new URL("https://localhost/");
    for (let option of options) {
      if (typeof option == "string" || option instanceof String) {
        u = new URL(option, u);
      } else if (option instanceof URL || typeof Location != "undefined" && option instanceof Location) {
        u = new URL(option);
      } else if (option instanceof URLSearchParams) {
        appendSearchParams(u, option);
      } else if (option && typeof option == "object") {
        for (let param in option) {
          switch (param) {
            case "search":
              if (typeof option.search == "function") {
                option.search(u.search, u);
              } else {
                u.search = new URLSearchParams(option.search);
              }
              break;
            case "searchParams":
              appendSearchParams(u, option.searchParams);
              break;
            default:
              if (!validParams.includes(param)) {
                throw metroError("metro.url: unknown url parameter " + metroURL + "url/unknown-param-name/", param);
              }
              if (typeof option[param] == "function") {
                option[param](u[param], u);
              } else if (typeof option[param] == "string" || option[param] instanceof String || typeof option[param] == "number" || option[param] instanceof Number || typeof option[param] == "boolean" || option[param] instanceof Boolean) {
                u[param] = "" + option[param];
              } else if (typeof option[param] == "object" && option[param].toString) {
                u[param] = option[param].toString();
              } else {
                throw metroError("metro.url: unsupported value for " + param + " " + metroURL + "url/unsupported-param-value/", options[param]);
              }
              break;
          }
        }
      } else {
        throw metroError("metro.url: unsupported option value " + metroURL + "url/unsupported-option-value/", option);
      }
    }
    Object.freeze(u);
    return new Proxy(u, {
      get(target, prop) {
        let result;
        switch (prop) {
          case Symbol.metroProxy:
            result = true;
            break;
          case Symbol.metroSource:
            result = target;
            break;
          case "with":
            result = function(...options2) {
              return url(target, ...options2);
            };
            break;
          case "filename":
            result = target.pathname.split("/").pop();
            break;
          case "folderpath":
            result = target.pathname.substring(0, target.pathname.lastIndexOf("\\") + 1);
            break;
          case "authority":
            result = target.username ?? "";
            result += target.password ? ":" + target.password : "";
            result += result ? "@" : "";
            result += target.hostname;
            result += target.port ? ":" + target.port : "";
            result += "/";
            result = target.protocol + "//" + result;
            break;
          case "origin":
            result = target.protocol + "//" + target.hostname;
            result += target.port ? ":" + target.port : "";
            result += "/";
            break;
          case "fragment":
            result = target.hash.substring(1);
            break;
          case "scheme":
            if (target.protocol) {
              result = target.protocol.substring(0, target.protocol.length - 1);
            } else {
              result = "";
            }
            break;
          default:
            if (target[prop] instanceof Function) {
              result = target[prop].bind(target);
            } else {
              result = target[prop];
            }
            break;
        }
        return result;
      }
    });
  }
  function formdata(...options) {
    var params = new FormData();
    for (let option of options) {
      if (option instanceof HTMLFormElement) {
        option = new FormData(option);
      }
      if (option instanceof FormData) {
        for (let entry of option.entries()) {
          params.append(entry[0], entry[1]);
        }
      } else if (option && typeof option == "object") {
        for (let entry of Object.entries(option)) {
          if (Array.isArray(entry[1])) {
            for (let value of entry[1]) {
              params.append(entry[0], value);
            }
          } else {
            params.append(entry[0], entry[1]);
          }
        }
      } else {
        throw new metroError("metro.formdata: unknown option type " + metroURL + "formdata/unknown-option-value/", option);
      }
    }
    Object.freeze(params);
    return new Proxy(params, {
      get(target, prop) {
        let result;
        switch (prop) {
          case Symbol.metroProxy:
            result = true;
            break;
          case Symbol.metroSource:
            result = target;
            break;
          //TODO: add toString() that can check
          //headers param: toString({headers:request.headers})
          //for the content-type
          case "with":
            result = function(...options2) {
              return formdata(target, ...options2);
            };
            break;
          default:
            if (target[prop] instanceof Function) {
              result = target[prop].bind(target);
            } else {
              result = target[prop];
            }
            break;
        }
        return result;
      }
    });
  }
  var metroConsole = {
    error: (message, ...details) => {
      console.error("\u24C2\uFE0F  ", message, ...details);
    },
    info: (message, ...details) => {
      console.info("\u24C2\uFE0F  ", message, ...details);
    },
    group: (name) => {
      console.group("\u24C2\uFE0F  " + name);
    },
    groupEnd: (name) => {
      console.groupEnd("\u24C2\uFE0F  " + name);
    }
  };
  function metroError(message, ...details) {
    metroConsole.error(message, ...details);
    return new Error(message, ...details);
  }
  var trace = {
    /**
     * Adds a named tracer function
     * @param {string} name - the name of the tracer
     * @param {Function} tracer - the tracer function to call
     */
    add(name, tracer) {
      Client.tracers[name] = tracer;
    },
    /**
     * Removes a named tracer function
     * @param {string} name
     */
    delete(name) {
      delete Client.tracers[name];
    },
    /**
     * Removes all tracer functions
     */
    clear() {
      Client.tracers = {};
    },
    /**
     * Returns a set of request and response tracer functions that use the
     * console.group feature to shows nested request/response pairs, with
     * most commonly needed information for debugging
     */
    group() {
      let group = 0;
      return {
        request: (req, middleware) => {
          group++;
          metroConsole.group(group);
          metroConsole.info(req?.url, req, middleware);
        },
        response: (res, middleware) => {
          metroConsole.info(res?.body ? res.body[Symbol.metroSource] : null, res, middleware);
          metroConsole.groupEnd(group);
          group--;
        }
      };
    }
  };
  function deepClone(object) {
    if (Array.isArray(object)) {
      return object.slice().map(deepClone);
    }
    if (object && typeof object === "object") {
      if (object.__proto__.constructor == Object || !object.__proto__) {
        let result = Object.assign({}, object);
        Object.keys(result).forEach((key) => {
          result[key] = deepClone(object[key]);
        });
        return result;
      } else {
        return object;
      }
    }
    return object;
  }

  // node_modules/@muze-nl/jsfs/src/Adapters/Http.mjs
  var HttpAdapter = class {
    #client;
    #path;
    constructor(metroClient, path = "/") {
      this.#client = client(metroClient);
      this.#path = new Path(path);
    }
    get name() {
      return "HttpAdapter";
    }
    get path() {
      return this.#path;
    }
    supportsWrite() {
      return true;
    }
    supportsStreamingWrite() {
      return supportsRequestStreams;
    }
    supportsStreamingRead() {
      return true;
    }
    supportsDirectories() {
      return false;
    }
    cd(path) {
      if (!Path.isPath(path)) {
        throw new TypeError(path + " is not a valid path");
      }
      if (Path.isRelative(path)) {
        path = Path.collapse(path, this.#path);
      }
      return new this.constructor(this.#client, path);
    }
    //FIXME: return a jsfs result object instead of http response
    async write(path, contents, metadata = null) {
      return this.#client.put({ body: contents });
    }
    writeStream(path, writer, metadata = null) {
      throw new Error("Not yet implemented");
    }
    async read(path) {
      let response2 = await this.#client.get(path);
      let result = {
        type: this.getMimetype(response2),
        name: Path.filename(path),
        http: {
          headers: response2.headers,
          status: response2.status,
          url: response2.url
        }
      };
      if (result.type.match(/text\/.*/)) {
        result.contents = await response2.text();
      } else if (result.type.match(/application\/json.*/)) {
        result.contents = await response2.json();
      } else {
        result.contents = await response2.blob();
      }
      return result;
    }
    readStream(path, reader) {
      throw new Error("Not yet implemented");
    }
    async exists(path) {
      return this.#client.head(path);
    }
    async remove(path) {
      return this.#client.delete(path);
    }
    async list(path) {
      let supportedContentTypes = [
        "text/html",
        "text/xhtml",
        "text/xhtml+xml",
        "text/xml"
      ];
      let result = await this.read(path);
      if (supportedContentTypes.includes(result.type.split(";")[0])) {
        var html = result.contents;
      } else {
        let url2 = this.getUrl(path);
        throw new TypeError("URL " + url2 + " is not of a supported content type", {
          cause: result
        });
      }
      let basePath = url(this.#client.clientOptions.url).pathname;
      let parentUrl = this.getUrl(path);
      let dom = document.createElement("template");
      dom.innerHTML = html;
      let links = dom.content.querySelectorAll("a[href]");
      return Array.from(links).map((link) => {
        let url2 = new URL(link.getAttribute("href"), parentUrl.href);
        link.href = url2.href;
        return {
          filename: Path.filename(link.pathname),
          path: link.pathname,
          name: link.innerText,
          href: link.href
        };
      }).filter((link) => {
        let testURL = new URL(link.href);
        testURL.pathname = Path.parent(testURL.pathname);
        return testURL.href === parentUrl.href;
      }).map((link) => {
        return {
          filename: link.filename,
          path: link.path.substring(basePath.length - 1),
          //TODO: Path.collapse() now always adds a trailing '/', so this works, but the added trailing / is probably not correct
          name: link.name
        };
      });
    }
    getUrl(path) {
      let basePath = url(this.#client.clientOptions.url).pathname;
      path = Path.collapse(basePath + Path.collapse(path));
      return new URL(path, this.#client.clientOptions.url);
    }
    getMimetype(response2) {
      if (response2.headers.has("Content-Type")) {
        return response2.headers.get("Content-Type");
      } else {
        return null;
      }
    }
  };
  var supportsRequestStreams = (async () => {
    const supportsStreamsInRequestObjects = !new Request(
      "",
      {
        body: new ReadableStream(),
        method: "POST",
        duplex: "half"
        // required in chrome
      }
    ).headers.has("Content-Type");
    if (!supportsStreamsInRequestObjects) {
      return false;
    }
    return fetch(
      "data:a/a;charset=utf-8,",
      {
        method: "POST",
        body: new ReadableStream(),
        duplex: "half"
      }
    ).then(() => true, () => false);
  })();

  // node_modules/@muze-nl/jsfs/src/index.mjs
  var jsfs2 = {
    fs: FileSystem,
    adapters: {
      https: HttpAdapter
    },
    path: Path
  };
  globalThis.jsfs = jsfs2;

  // node_modules/@muze-nl/metro/src/mw/json.mjs
  function jsonmw(options) {
    options = Object.assign({
      contentType: "application/json",
      reviver: null,
      replacer: null,
      space: ""
    }, options);
    return async function json(req, next) {
      if (!req.headers.get("Accept")) {
        req = req.with({
          headers: {
            "Accept": options.accept ?? options.contentType
          }
        });
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        if (req.data && typeof req.data == "object" && !(req.data instanceof ReadableStream)) {
          const contentType = req.headers.get("Content-Type");
          if (!contentType || isPlainText(contentType)) {
            req = req.with({
              headers: {
                "Content-Type": options.contentType
              }
            });
          }
          if (isJSON(req.headers.get("Content-Type"))) {
            req = req.with({
              body: JSON.stringify(req.data, options.replacer, options.space)
            });
          }
        }
      }
      let res = await next(req);
      if (res && isJSON(res.headers?.get("Content-Type"))) {
        let tempRes = res.clone();
        let body = await tempRes.text();
        try {
          let json2 = JSON.parse(body, options.reviver);
          return res.with({
            body: json2
          });
        } catch (e) {
        }
      }
      return res;
    };
  }
  var jsonRE = /^application\/([a-zA-Z0-9\-_]+\+)?json\b/;
  function isJSON(contentType) {
    return jsonRE.exec(contentType);
  }
  function isPlainText(contentType) {
    return /^text\/plain\b/.exec(contentType);
  }

  // node_modules/@muze-nl/metro/src/mw/thrower.mjs
  function throwermw(options) {
    return async function thrower(req, next) {
      let res = await next(req);
      if (!res.ok) {
        if (options && typeof options[res.status] == "function") {
          res = options[res.status].apply(res, req);
        } else {
          throw new Error(res.status + ": " + res.statusText, {
            cause: res
          });
        }
      }
      return res;
    };
  }

  // node_modules/@muze-nl/metro/src/mw/getdata.mjs
  function getdatamw() {
    return async function getdata(req, next) {
      let res = await next(req);
      if (res.ok && res.data) {
        return res.data;
      }
      return res;
    };
  }

  // node_modules/@muze-nl/metro/src/api.mjs
  var API = class extends Client {
    #methods = null;
    #base = "";
    constructor(base, methods, bind = null) {
      if (base instanceof Client) {
        super(base.clientOptions, throwermw(), getdatamw());
      } else {
        super(base, throwermw(), getdatamw());
      }
      if (!bind) {
        bind = this;
      }
      this.#methods = methods;
      this.#base = base;
      for (const methodName in methods) {
        if (typeof methods[methodName] == "function") {
          this[methodName] = methods[methodName].bind(bind);
        } else if (methods[methodName] && typeof methods[methodName] == "object" && (Object.getPrototypeOf(methods[methodName]) === null || Object.getPrototypeOf(methods[methodName]).constructor === Object)) {
          this[methodName] = new this.constructor(base, methods[methodName], bind);
        } else {
          this[methodName] = methods[methodName];
        }
      }
    }
    extend(methods) {
      return new this.constructor(this.#base, Object.assign({}, this.#methods, methods));
    }
  };
  var JsonAPI = class extends API {
    constructor(base, methods, bind = null) {
      if (base instanceof Client) {
        super(base.with(jsonmw()), methods, bind);
      } else {
        super(client(base, jsonmw()), methods, bind);
      }
    }
  };
  function api(...options) {
    return new API(...deepClone(options));
  }
  function jsonApi(...options) {
    return new JsonAPI(...deepClone(options));
  }

  // node_modules/@muze-nl/metro/src/everything.mjs
  var metro2 = Object.assign({}, metro_exports, {
    mw: {
      json: jsonmw,
      thrower: throwermw,
      getdata: getdatamw
    },
    api,
    jsonApi
  });
  if (!globalThis.metro) {
    globalThis.metro = metro2;
  }
  var everything_default = metro2;

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.mjs
  var oauth2_exports = {};
  __export(oauth2_exports, {
    base64url_encode: () => base64url_encode,
    createState: () => createState,
    default: () => oauth2mw,
    generateCodeChallenge: () => generateCodeChallenge,
    generateCodeVerifier: () => generateCodeVerifier,
    getExpires: () => getExpires,
    isAuthorized: () => isAuthorized,
    isExpired: () => isExpired,
    isRedirected: () => isRedirected
  });

  // node_modules/@muze-nl/assert/src/assert.mjs
  globalThis.assertEnabled = false;
  function enable() {
    globalThis.assertEnabled = true;
  }
  function disable() {
    globalThis.assertEnabled = false;
  }
  function assert(source, test) {
    if (globalThis.assertEnabled) {
      let problems = fails(source, test);
      if (problems) {
        console.error("\u{1F170}\uFE0F  Assertions failed because of:", problems, "in this source:", source);
        throw new Error("Assertions failed", {
          cause: { problems, source }
        });
      }
    }
  }
  function Optional(pattern) {
    return function _Optional(data, root, path) {
      if (typeof data != "undefined" && data != null && typeof pattern != "undefined") {
        return fails(data, pattern, root, path);
      }
    };
  }
  function Required(pattern) {
    return function _Required(data, root, path) {
      if (data == null || typeof data == "undefined") {
        return error("data is required", data, pattern || "any value", path);
      } else if (typeof pattern != "undefined") {
        return fails(data, pattern, root, path);
      } else {
        return false;
      }
    };
  }
  function Recommended(pattern) {
    return function _Recommended(data, root, path) {
      if (data == null || typeof data == "undefined") {
        warn("data does not contain recommended value", data, pattern, path);
        return false;
      } else {
        return fails(data, pattern, root, path);
      }
    };
  }
  function oneOf(...patterns) {
    return function _oneOf(data, root, path) {
      for (let pattern of patterns) {
        if (!fails(data, pattern, root, path)) {
          return false;
        }
      }
      return error("data does not match oneOf patterns", data, patterns, path);
    };
  }
  function anyOf(...patterns) {
    return function _anyOf(data, root, path) {
      if (!Array.isArray(data)) {
        return error("data is not an array", data, "anyOf", path);
      }
      for (let value of data) {
        if (oneOf(...patterns)(value)) {
          return error("data does not match anyOf patterns", value, patterns, path);
        }
      }
      return false;
    };
  }
  function allOf(...patterns) {
    return function _allOf(data, root, path) {
      let problems = [];
      for (let pattern of patterns) {
        problems = problems.concat(fails(data, pattern, root, path));
      }
      problems = problems.filter(Boolean);
      if (problems.length) {
        return error("data does not match all given patterns", data, patterns, path, problems);
      }
    };
  }
  function validURL(data, root, path) {
    try {
      if (data instanceof URL) {
        data = data.href;
      }
      let url2 = new URL(data);
      if (url2.href != data) {
        if (!(url2.href + "/" == data || url2.href == data + "/")) {
          return error("data is not a valid url", data, "validURL", path);
        }
      }
    } catch (e) {
      return error("data is not a valid url", data, "validURL", path);
    }
  }
  function validEmail(data, root, path) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
      return error("data is not a valid email", data, "validEmail", path);
    }
  }
  function instanceOf(constructor) {
    return function _instanceOf(data, root, path) {
      if (!(data instanceof constructor)) {
        return error("data is not an instanceof pattern", data, constructor, path);
      }
    };
  }
  function not(pattern) {
    return function _not(data, root, path) {
      if (!fails(data, pattern, root, path)) {
        return error("data matches pattern, when required not to", data, pattern, path);
      }
    };
  }
  function fails(data, pattern, root, path = "") {
    if (!root) {
      root = data;
    }
    let problems = [];
    if (pattern === Boolean) {
      if (typeof data != "boolean" && !(data instanceof Boolean)) {
        problems.push(error("data is not a boolean", data, pattern, path));
      }
    } else if (pattern === Number) {
      if (typeof data != "number" && !(data instanceof Number)) {
        problems.push(error("data is not a number", data, pattern, path));
      }
    } else if (pattern === String) {
      if (typeof data != "string" && !(data instanceof String)) {
        problems.push(error("data is not a string", data, pattern, path));
      }
      if (data == "") {
        problems.push(error("data is an empty string, which is not allowed", data, pattern, path));
      }
    } else if (pattern instanceof RegExp) {
      if (Array.isArray(data)) {
        let index = data.findIndex((element, index2) => fails(element, pattern, root, path + "[" + index2 + "]"));
        if (index > -1) {
          problems.push(error("data[" + index + "] does not match pattern", data[index], pattern, path + "[" + index + "]"));
        }
      } else if (typeof data == "undefined") {
        problems.push(error("data is undefined, should match pattern", data, pattern, path));
      } else if (!pattern.test(data)) {
        problems.push(error("data does not match pattern", data, pattern, path));
      }
    } else if (pattern instanceof Function) {
      let problem = pattern(data, root, path);
      if (problem) {
        if (Array.isArray(problem)) {
          problems = problems.concat(problem);
        } else {
          problems.push(problem);
        }
      }
    } else if (Array.isArray(pattern)) {
      if (!Array.isArray(data)) {
        problems.push(error("data is not an array", data, [], path));
      }
      for (let p of pattern) {
        for (let index of data.keys()) {
          let problem = fails(data[index], p, root, path + "[" + index + "]");
          if (Array.isArray(problem)) {
            problems = problems.concat(problem);
          } else if (problem) {
            problems.push(problem);
          }
        }
      }
    } else if (pattern && typeof pattern == "object") {
      if (Array.isArray(data)) {
        let index = data.findIndex((element, index2) => fails(element, pattern, root, path + "[" + index2 + "]"));
        if (index > -1) {
          problems.push(error("data[" + index + "] does not match pattern", data[index], pattern, path + "[" + index + "]"));
        }
      } else if (!data || typeof data != "object") {
        problems.push(error("data is not an object, pattern is", data, pattern, path));
      } else {
        if (data instanceof URLSearchParams) {
          data = Object.fromEntries(data);
        }
        if (pattern instanceof Function) {
          let result = fails(data, pattern, root, path);
          if (result) {
            problems = problems.concat(result);
          }
        } else {
          for (const [patternKey, subpattern] of Object.entries(pattern)) {
            let result = fails(data[patternKey], subpattern, root, path + "." + patternKey);
            if (result) {
              problems = problems.concat(result);
            }
          }
        }
      }
    } else {
      if (pattern != data) {
        problems.push(error("data and pattern are not equal", data, pattern, path));
      }
    }
    if (problems.length) {
      return problems;
    }
    return false;
  }
  function error(message, found, expected, path, problems) {
    let result = {
      path,
      message,
      found,
      expected
    };
    if (problems) {
      result.problems = problems;
    }
    return result;
  }
  function warn(message, data, pattern, path) {
    console.warn("\u{1F170}\uFE0F  Assert: " + path, message, pattern, data);
  }
  globalThis.assert = {
    warn,
    error,
    assert,
    enable,
    disable,
    Required,
    Recommended,
    Optional,
    oneOf,
    anyOf,
    allOf,
    validURL,
    validEmail,
    instanceOf,
    not,
    fails
  };

  // node_modules/@muze-nl/metro-oauth2/src/tokenstore.mjs
  function tokenStore(site) {
    let localState, localTokens;
    if (typeof localStorage !== "undefined") {
      localState = {
        get: () => localStorage.getItem("metro/state:" + site),
        set: (value) => localStorage.setItem("metro/state:" + site, value),
        has: () => localStorage.getItem("metro/state:" + site) !== null,
        delete: () => localStorage.remoteItem("metro/state:" + site)
      };
      localTokens = {
        get: (name) => JSON.parse(localStorage.getItem(site + ":" + name)),
        set: (name, value) => localStorage.setItem(site + ":" + name, JSON.stringify(value)),
        has: (name) => localStorage.getItem(site + ":" + name) !== null,
        delete: (name) => localStorage.removeItem(site + ":" + name)
      };
    } else {
      let stateMap = /* @__PURE__ */ new Map();
      localState = {
        get: () => stateMap.get("metro/state:" + site),
        set: (value) => stateMap.set("metro/state:" + site, value),
        has: () => stateMap.has("metro/state:" + site),
        delete: () => stateMap.delete("metro/state:" + site)
      };
      localTokens = /* @__PURE__ */ new Map();
    }
    return {
      state: localState,
      tokens: localTokens
    };
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.mjs
  function oauth2mw(options) {
    const defaultOptions = {
      client: client(),
      force_authorization: false,
      site: "default",
      oauth2_configuration: {
        authorization_endpoint: "/authorize",
        token_endpoint: "/token",
        redirect_uri: globalThis.document?.location.href,
        grant_type: "authorization_code",
        code_verifier: generateCodeVerifier(64)
      },
      authorize_callback: async (url2) => {
        if (window.location.href != url2.href) {
          window.location.replace(url2.href);
        }
        return false;
      }
    };
    assert(options, {});
    const oauth22 = Object.assign({}, defaultOptions.oauth2_configuration, options?.oauth2_configuration);
    options = Object.assign({}, defaultOptions, options);
    options.oauth2_configuration = oauth22;
    const store = tokenStore(options.site);
    if (!options.tokens) {
      options.tokens = store.tokens;
    }
    if (!options.state) {
      options.state = store.state;
    }
    assert(options, {
      oauth2_configuration: {
        client_id: Required(/.+/),
        grant_type: "authorization_code",
        authorization_endpoint: Required(validURL),
        token_endpoint: Required(validURL),
        redirect_uri: Required(validURL)
      }
    });
    for (let option in oauth22) {
      switch (option) {
        case "access_token":
        case "authorization_code":
        case "refresh_token":
          options.tokens.set(option, oauth22[option]);
          break;
      }
    }
    return async function(req, next) {
      if (options.force_authorization) {
        return oauth2authorized(req, next);
      }
      let res;
      try {
        res = await next(req);
        if (res.ok) {
          return res;
        }
      } catch (err) {
        switch (res?.status) {
          case 400:
          // Oauth2.1 RFC 3.2.4
          case 401:
            return oauth2authorized(req, next);
            break;
        }
        throw err;
      }
      if (!res.ok) {
        switch (res.status) {
          case 400:
          // Oauth2.1 RFC 3.2.4
          case 401:
            return oauth2authorized(req, next);
            break;
        }
      }
      return res;
    };
    async function oauth2authorized(req, next) {
      getTokensFromLocation();
      const accessToken = options.tokens.get("access_token");
      const refreshToken = options.tokens.get("refresh_token");
      const tokenIsExpired = isExpired(accessToken);
      if (!accessToken || tokenIsExpired && !refreshToken) {
        try {
          let token = await fetchAccessToken();
          if (!token) {
            return response("false");
          }
        } catch (e) {
          throw e;
        }
        return oauth2authorized(req, next);
      } else if (tokenIsExpired && refreshToken) {
        try {
          let token = await refreshAccessToken();
          if (!token) {
            return response("false");
          }
        } catch (e) {
          throw e;
        }
        return oauth2authorized(req, next);
      } else {
        req = request(req, {
          headers: {
            Authorization: accessToken.type + " " + accessToken.value
          }
        });
        return next(req);
      }
    }
    function getTokensFromLocation() {
      if (typeof window !== "undefined" && window?.location) {
        let url2 = url(window.location);
        let code, state, params;
        if (url2.searchParams.has("code")) {
          params = url2.searchParams;
          url2 = url2.with({ search: "" });
          history.pushState({}, "", url2.href);
        } else if (url2.hash) {
          let query = url2.hash.substr(1);
          params = new URLSearchParams("?" + query);
          url2 = url2.with({ hash: "" });
          history.pushState({}, "", url2.href);
        }
        if (params) {
          code = params.get("code");
          state = params.get("state");
          let storedState = options.state.get("metro/state");
          if (!state || state !== storedState) {
            return;
          }
          if (code) {
            options.tokens.set("authorization_code", code);
          }
        }
      }
    }
    async function fetchAccessToken() {
      if (oauth22.grant_type === "authorization_code" && !options.tokens.has("authorization_code")) {
        let authReqURL = await getAuthorizationCodeURL();
        if (!options.authorize_callback || typeof options.authorize_callback !== "function") {
          throw metroError("oauth2mw: oauth2 with grant_type:authorization_code requires a callback function in client options.authorize_callback");
        }
        let token = await options.authorize_callback(authReqURL);
        if (token) {
          options.tokens.set("authorization_code", token);
        } else {
          return false;
        }
      }
      let tokenReq = getAccessTokenRequest();
      let response2 = await options.client.post(tokenReq);
      if (!response2.ok) {
        let msg = await response2.text();
        throw metroError("OAuth2mw: fetch access_token: " + response2.status + ": " + response2.statusText + " (" + msg + ")", { cause: tokenReq });
      }
      let data = await response2.json();
      options.tokens.set("access_token", {
        value: data.access_token,
        expires: getExpires(data.expires_in),
        type: data.token_type,
        scope: data.scope
      });
      if (data.refresh_token) {
        let token = {
          value: data.refresh_token
        };
        options.tokens.set("refresh_token", token);
      }
      options.tokens.delete("authorization_code");
      return data;
    }
    async function refreshAccessToken() {
      let refreshTokenReq = getAccessTokenRequest("refresh_token");
      let response2 = await options.client.post(refreshTokenReq);
      if (!response2.ok) {
        throw metroError("OAuth2mw: refresh access_token: " + response2.status + ": " + response2.statusText, { cause: refreshTokenReq });
      }
      let data = await response2.json();
      options.tokens.set("access_token", {
        value: data.access_token,
        expires: getExpires(data.expires_in),
        type: data.token_type,
        scope: data.scope
      });
      if (data.refresh_token) {
        let token = {
          value: data.refresh_token
        };
        options.tokens.set("refresh_token", token);
      } else {
        return false;
      }
      return data;
    }
    async function getAuthorizationCodeURL() {
      if (!oauth22.authorization_endpoint) {
        throw metroError("oauth2mw: Missing options.oauth2_configuration.authorization_endpoint");
      }
      let url2 = url(oauth22.authorization_endpoint, { hash: "" });
      assert(oauth22, {
        client_id: /.+/,
        redirect_uri: /.+/,
        scope: /.*/
      });
      let search = {
        response_type: "code",
        // implicit flow uses 'token' here, but is not considered safe, so not supported
        client_id: oauth22.client_id,
        redirect_uri: oauth22.redirect_uri,
        state: oauth22.state || createState(40)
        // OAuth2.1 RFC says optional, but its a good idea to always add/check it
      };
      if (oauth22.response_type) {
        search.response_type = oauth22.response_type;
      }
      if (oauth22.response_mode) {
        search.response_mode = oauth22.response_mode;
      }
      options.state.set(search.state);
      if (oauth22.client_secret) {
        search.client_secret = oauth22.client_secret;
      }
      if (oauth22.code_verifier) {
        options.tokens.set("code_verifier", oauth22.code_verifier);
        search.code_challenge = await generateCodeChallenge(oauth22.code_verifier);
        search.code_challenge_method = "S256";
      }
      if (oauth22.scope) {
        search.scope = oauth22.scope;
      }
      if (oauth22.prompt) {
        search.prompt = oauth22.prompt;
      }
      return url(url2, { search });
    }
    function getAccessTokenRequest(grant_type = null) {
      assert(oauth22, {
        client_id: /.+/,
        redirect_uri: /.+/
      });
      if (!oauth22.token_endpoint) {
        throw metroError("oauth2mw: Missing options.endpoints.token url");
      }
      let url2 = url(oauth22.token_endpoint, { hash: "" });
      let params = {
        grant_type: grant_type || oauth22.grant_type,
        client_id: oauth22.client_id
      };
      if (oauth22.client_secret) {
        params.client_secret = oauth22.client_secret;
      }
      if (oauth22.scope) {
        params.scope = oauth22.scope;
      }
      switch (params.grant_type) {
        case "authorization_code":
          params.redirect_uri = oauth22.redirect_uri;
          params.code = options.tokens.get("authorization_code");
          const code_verifier = options.tokens.get("code_verifier");
          if (code_verifier) {
            params.code_verifier = code_verifier;
          }
          break;
        case "client_credentials":
          break;
        case "refresh_token":
          params.refresh_token = options.tokens.get("refresh_token");
          break;
        default:
          throw new Error("Unknown grant_type: ".oauth2.grant_type);
          break;
      }
      return request(url2, { method: "POST", body: new URLSearchParams(params) });
    }
  }
  function isExpired(token) {
    if (!token) {
      return true;
    }
    let expires = new Date(token.expires);
    let now = /* @__PURE__ */ new Date();
    return now.getTime() > expires.getTime();
  }
  function getExpires(duration) {
    if (duration instanceof Date) {
      return new Date(duration.getTime());
    }
    if (typeof duration === "number") {
      let date = /* @__PURE__ */ new Date();
      date.setSeconds(date.getSeconds() + duration);
      return date;
    }
    throw new TypeError("Unknown expires type " + duration);
  }
  function generateCodeVerifier(size = 64) {
    const code_verifier = new Uint8Array(size);
    globalThis.crypto.getRandomValues(code_verifier);
    return base64url_encode(code_verifier);
  }
  async function generateCodeChallenge(code_verifier) {
    const encoder2 = new TextEncoder();
    const data = encoder2.encode(code_verifier);
    const challenge = await globalThis.crypto.subtle.digest("SHA-256", data);
    return base64url_encode(challenge);
  }
  function base64url_encode(buffer) {
    const byteString = Array.from(new Uint8Array(buffer), (b) => String.fromCharCode(b)).join("");
    return btoa(byteString).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function createState(length) {
    const validChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomState = "";
    let counter = 0;
    while (counter < length) {
      randomState += validChars.charAt(Math.floor(Math.random() * validChars.length));
      counter++;
    }
    return randomState;
  }
  function isRedirected() {
    let url2 = new URL(document.location.href);
    if (!url2.searchParams.has("code")) {
      if (url2.hash) {
        let query = url2.hash.substr(1);
        const params = new URLSearchParams("?" + query);
        if (params.has("code")) {
          return true;
        }
      }
      return false;
    }
    return true;
  }
  function isAuthorized(tokens) {
    if (typeof tokens == "string") {
      tokens = tokenStore(tokens).tokens;
    }
    let accessToken = tokens.get("access_token");
    if (accessToken && !isExpired(accessToken)) {
      return true;
    }
    let refreshToken = tokens.get("refresh_token");
    if (refreshToken) {
      return true;
    }
    return false;
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.mockserver.mjs
  var oauth2_mockserver_exports = {};
  __export(oauth2_mockserver_exports, {
    default: () => oauth2mockserver
  });
  var baseResponse = {
    status: 200,
    statusText: "OK",
    headers: {
      "Content-Type": "application/json"
    }
  };
  var badRequest = (error3) => {
    return {
      status: 400,
      statusText: "Bad Request",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "invalid_request",
        error_description: error3
      })
    };
  };
  var error2;
  var pkce = {};
  function oauth2mockserver(options = {}) {
    const defaultOptions = {
      "PKCE": false,
      "DPoP": false
    };
    options = Object.assign({}, defaultOptions, options);
    return async (req, next) => {
      let url2 = everything_default.url(req.url);
      switch (url2.pathname) {
        case "/authorize/":
          if (error2 = fails(url2.searchParams, {
            response_type: "code",
            client_id: "mockClientId",
            state: Optional(/.*/)
          })) {
            return everything_default.response(badRequest(error2));
          }
          if (url2.searchParams.has("code_challenge")) {
            if (!url2.searchParams.has("code_challenge_method")) {
              return everything_default.response(badRequest("missing code_challenge_method"));
            }
            pkce.code_challenge = url2.searchParams.get("code_challenge");
            pkce.code_challenge_method = url2.searchParams.get("code_challenge_method");
          }
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              code: "mockAuthorizeToken",
              state: url2.searchParams.get("state")
            })
          });
          break;
        case "/token/":
          if (req.data instanceof URLSearchParams) {
            let body = {};
            req.data.forEach((value, key) => body[key] = value);
            req = req.with({ body });
          }
          if (error2 = fails(req, {
            method: "POST",
            data: {
              grant_type: oneOf("refresh_token", "authorization_code")
            }
          })) {
            return everything_default.response(badRequest(error2));
          }
          switch (req.data.grant_type) {
            case "refresh_token":
              if (error2 = fails(req.data, oneOf({
                refresh_token: "mockRefreshToken",
                client_id: "mockClientId",
                client_secret: "mockClientSecret"
              }, {
                refresh_token: "mockRefreshToken",
                client_id: "mockClientId",
                code_verifier: /.+/
              }))) {
                return everything_default.response(badRequest(error2));
              }
              break;
            case "access_token":
              if (error2 = fails(req.data, oneOf({
                client_id: "mockClientId",
                client_secret: "mockClientSecret"
              }, {
                client_id: "mockClientId",
                code_challenge: /.*/,
                //FIXME: check that this matches code_verifier
                code_challenge_method: "S256"
              }))) {
                return everything_default.response(badRequest(error2));
              }
              break;
          }
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              access_token: "mockAccessToken",
              token_type: "mockExample",
              expires_in: 3600,
              refresh_token: "mockRefreshToken",
              example_parameter: "mockExampleValue"
            })
          });
          break;
        case "/protected/":
          let auth = req.headers.get("Authorization");
          let [type, token] = auth ? auth.split(" ") : [];
          if (!token || token !== "mockAccessToken") {
            return everything_default.response({
              status: 401,
              statusText: "Forbidden",
              body: "401 Forbidden"
            });
          }
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              result: "Success"
            })
          });
          break;
        case "/public/":
          return everything_default.response(baseResponse, {
            body: JSON.stringify({
              result: "Success"
            })
          });
          break;
        default:
          return everything_default.response({
            status: 404,
            statusText: "not found",
            body: "404 Not Found " + url2
          });
          break;
      }
    };
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.discovery.mjs
  var oauth2_discovery_exports = {};
  __export(oauth2_discovery_exports, {
    default: () => makeClient
  });
  var validAlgorithms = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512"
  ];
  var validAuthMethods = [
    "client_secret_post",
    "client_secret_base",
    "client_secret_jwt",
    "private_key_jwt"
  ];
  var oauth_authorization_server_metadata = {
    issuer: Required(validURL),
    authorization_endpoint: Required(validURL),
    token_endpoint: Required(validURL),
    jwks_uri: Optional(validURL),
    registration_endpoint: Optional(validURL),
    scopes_supported: Recommended([]),
    response_types_supported: Required(anyOf("code", "token")),
    response_modes_supported: Optional([]),
    grant_types_supported: Optional([]),
    token_endpoint_auth_methods_supported: Optional([]),
    token_endpoint_auth_signing_alg_values_supported: Optional([]),
    service_documentation: Optional(validURL),
    ui_locales_supported: Optional([]),
    op_policy_uri: Optional(validURL),
    op_tos_uri: Optional(validURL),
    revocation_endpoint: Optional(validURL),
    revocation_endpoint_auth_methods_supported: Optional(validAuthMethods),
    revocation_endpoint_auth_signing_alg_values_supported: Optional(validAlgorithms),
    introspection_endpoint: Optional(validURL),
    introspection_endpoint_auth_methods_supported: Optional(validAuthMethods),
    introspection_endpoint_auth_signing_alg_values_supported: Optional(validAlgorithms),
    code_challendge_methods_supported: Optional([])
  };
  function makeClient(options = {}) {
    const defaultOptions = {
      client: everything_default.client()
    };
    options = Object.assign({}, defaultOptions, options);
    assert(options, {
      issuer: Required(validURL)
    });
    const oauth_authorization_server_configuration = fetchWellknownOauthAuthorizationServer(options.issuer);
    return options.client.with(options.issuer);
  }
  async function fetchWellknownOauthAuthorizationServer(issuer, client2) {
    let res = client2.get(everything_default.url(issuer, ".wellknown/oauth_authorization_server"));
    if (res.ok) {
      assert(res.headers.get("Content-Type"), /application\/json.*/);
      let configuration = await res.json();
      assert(configuration, oauth_authorization_server_metadata);
      return configuration;
    }
    throw everything_default.metroError("metro.oidcmw: Error while fetching " + issuer + ".wellknown/oauth_authorization_server", res);
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.popup.mjs
  function handleRedirect(origin = null) {
    let success = false;
    origin = origin || window.location.origin;
    let params = new URLSearchParams(window.location.search);
    if (!params.has("code") && window.location.hash) {
      let query = window.location.hash.substr(1);
      params = new URLSearchParams("?" + query);
    }
    let parent = window.parent !== window ? window.parent : window.opener;
    if (!parent) {
      console.error("No parent window found, cannot post authorization code (or error)");
    } else {
      if (params.has("code")) {
        parent.postMessage({
          authorization_code: params.get("code")
        }, origin);
        success = true;
      } else if (params.has("error")) {
        parent.postMessage({
          error: params.get("error")
        }, origin);
      } else {
        parent.postMessage({
          error: "Could not find an authorization_code"
        }, origin);
      }
    }
    return success;
  }
  function authorizePopup(authorizationCodeURL) {
    return new Promise((resolve, reject) => {
      addEventListener("message", (event) => {
        if (event.data.authorization_code) {
          resolve(event.data.authorization_code);
        } else if (event.data.error) {
          reject(event.data.error);
        } else {
          reject("Unknown authorization error");
        }
      }, { once: true });
      window.open(authorizationCodeURL);
    });
  }

  // node_modules/@muze-nl/metro-oauth2/src/keysstore.mjs
  function keysStore() {
    return new Promise((resolve, reject) => {
      const request2 = globalThis.indexedDB.open("metro", 1);
      request2.onupgradeneeded = () => request2.result.createObjectStore("keyPairs", { keyPath: "domain" });
      request2.onerror = (event) => {
        reject(event);
      };
      request2.onsuccess = (event) => {
        const db = event.target.result;
        resolve({
          set: function(value, key) {
            return new Promise((resolve2, reject2) => {
              const tx = db.transaction("keyPairs", "readwrite", { durability: "strict" });
              const objectStore = tx.objectStore("keyPairs");
              tx.oncomplete = () => {
                resolve2();
              };
              tx.onerror = reject2;
              objectStore.put(value, key);
            });
          },
          get: function(key) {
            return new Promise((resolve2, reject2) => {
              const tx = db.transaction("keyPairs", "readonly");
              const objectStore = tx.objectStore("keyPairs");
              const request3 = objectStore.get(key);
              request3.onsuccess = () => {
                resolve2(request3.result);
              };
              request3.onerror = reject2;
              tx.onerror = reject2;
            });
          },
          clear: function() {
            return new Promise((resolve2, reject2) => {
              const tx = db.transaction("keyPairs", "readwrite");
              const objectStore = tx.objectStore("keyPairs");
              const request3 = objectStore.clear();
              request3.onsuccess = () => {
                resolve2();
              };
              request3.onerror = reject2;
              tx.onerror = reject2;
            });
          }
        });
      };
    });
  }

  // node_modules/dpop/build/index.js
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  function buf(input) {
    if (typeof input === "string") {
      return encoder.encode(input);
    }
    return decoder.decode(input);
  }
  function checkRsaKeyAlgorithm(algorithm) {
    if (typeof algorithm.modulusLength !== "number" || algorithm.modulusLength < 2048) {
      throw new OperationProcessingError(`${algorithm.name} modulusLength must be at least 2048 bits`);
    }
  }
  function subtleAlgorithm(key) {
    switch (key.algorithm.name) {
      case "ECDSA":
        return { name: key.algorithm.name, hash: "SHA-256" };
      case "RSA-PSS":
        checkRsaKeyAlgorithm(key.algorithm);
        return {
          name: key.algorithm.name,
          saltLength: 256 >> 3
        };
      case "RSASSA-PKCS1-v1_5":
        checkRsaKeyAlgorithm(key.algorithm);
        return { name: key.algorithm.name };
      case "Ed25519":
        return { name: key.algorithm.name };
    }
    throw new UnsupportedOperationError();
  }
  async function jwt(header, claimsSet, key) {
    if (key.usages.includes("sign") === false) {
      throw new TypeError('private CryptoKey instances used for signing assertions must include "sign" in their "usages"');
    }
    const input = `${b64u(buf(JSON.stringify(header)))}.${b64u(buf(JSON.stringify(claimsSet)))}`;
    const signature = b64u(await crypto.subtle.sign(subtleAlgorithm(key), key, buf(input)));
    return `${input}.${signature}`;
  }
  var encodeBase64Url;
  if (Uint8Array.prototype.toBase64) {
    encodeBase64Url = (input) => {
      if (input instanceof ArrayBuffer) {
        input = new Uint8Array(input);
      }
      return input.toBase64({ alphabet: "base64url", omitPadding: true });
    };
  } else {
    const CHUNK_SIZE = 32768;
    encodeBase64Url = (input) => {
      if (input instanceof ArrayBuffer) {
        input = new Uint8Array(input);
      }
      const arr = [];
      for (let i = 0; i < input.byteLength; i += CHUNK_SIZE) {
        arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
      }
      return btoa(arr.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    };
  }
  function b64u(input) {
    return encodeBase64Url(input);
  }
  var UnsupportedOperationError = class extends Error {
    constructor(message) {
      var _a;
      super(message !== null && message !== void 0 ? message : "operation not supported");
      this.name = this.constructor.name;
      (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
    }
  };
  var OperationProcessingError = class extends Error {
    constructor(message) {
      var _a;
      super(message);
      this.name = this.constructor.name;
      (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
    }
  };
  function psAlg(key) {
    switch (key.algorithm.hash.name) {
      case "SHA-256":
        return "PS256";
      default:
        throw new UnsupportedOperationError("unsupported RsaHashedKeyAlgorithm hash name");
    }
  }
  function rsAlg(key) {
    switch (key.algorithm.hash.name) {
      case "SHA-256":
        return "RS256";
      default:
        throw new UnsupportedOperationError("unsupported RsaHashedKeyAlgorithm hash name");
    }
  }
  function esAlg(key) {
    switch (key.algorithm.namedCurve) {
      case "P-256":
        return "ES256";
      default:
        throw new UnsupportedOperationError("unsupported EcKeyAlgorithm namedCurve");
    }
  }
  function determineJWSAlgorithm(key) {
    switch (key.algorithm.name) {
      case "RSA-PSS":
        return psAlg(key);
      case "RSASSA-PKCS1-v1_5":
        return rsAlg(key);
      case "ECDSA":
        return esAlg(key);
      case "Ed25519":
        return "Ed25519";
      default:
        throw new UnsupportedOperationError("unsupported CryptoKey algorithm name");
    }
  }
  function isCryptoKey(key) {
    return key instanceof CryptoKey;
  }
  function isPrivateKey(key) {
    return isCryptoKey(key) && key.type === "private";
  }
  function isPublicKey(key) {
    return isCryptoKey(key) && key.type === "public";
  }
  function epochTime() {
    return Math.floor(Date.now() / 1e3);
  }
  async function generateProof(keypair, htu, htm, nonce, accessToken, additional) {
    const privateKey = keypair === null || keypair === void 0 ? void 0 : keypair.privateKey;
    const publicKey = keypair === null || keypair === void 0 ? void 0 : keypair.publicKey;
    if (!isPrivateKey(privateKey)) {
      throw new TypeError('"keypair.privateKey" must be a private CryptoKey');
    }
    if (!isPublicKey(publicKey)) {
      throw new TypeError('"keypair.publicKey" must be a public CryptoKey');
    }
    if (publicKey.extractable !== true) {
      throw new TypeError('"keypair.publicKey.extractable" must be true');
    }
    if (typeof htu !== "string") {
      throw new TypeError('"htu" must be a string');
    }
    if (typeof htm !== "string") {
      throw new TypeError('"htm" must be a string');
    }
    if (nonce !== void 0 && typeof nonce !== "string") {
      throw new TypeError('"nonce" must be a string or undefined');
    }
    if (accessToken !== void 0 && typeof accessToken !== "string") {
      throw new TypeError('"accessToken" must be a string or undefined');
    }
    if (additional !== void 0 && (typeof additional !== "object" || additional === null || Array.isArray(additional))) {
      throw new TypeError('"additional" must be an object');
    }
    return jwt({
      alg: determineJWSAlgorithm(privateKey),
      typ: "dpop+jwt",
      jwk: await publicJwk(publicKey)
    }, Object.assign(Object.assign({}, additional), {
      iat: epochTime(),
      jti: crypto.randomUUID(),
      htm,
      nonce,
      htu,
      ath: accessToken ? b64u(await crypto.subtle.digest("SHA-256", buf(accessToken))) : void 0
    }), privateKey);
  }
  async function publicJwk(key) {
    const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey("jwk", key);
    return { kty, crv, e, n, x, y };
  }
  async function generateKeyPair(alg, options) {
    var _a;
    let algorithm;
    if (typeof alg !== "string" || alg.length === 0) {
      throw new TypeError('"alg" must be a non-empty string');
    }
    switch (alg) {
      case "PS256":
        algorithm = {
          name: "RSA-PSS",
          hash: "SHA-256",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1])
        };
        break;
      case "RS256":
        algorithm = {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1])
        };
        break;
      case "ES256":
        algorithm = { name: "ECDSA", namedCurve: "P-256" };
        break;
      case "Ed25519":
        algorithm = { name: "Ed25519" };
        break;
      default:
        throw new UnsupportedOperationError();
    }
    return crypto.subtle.generateKey(algorithm, (_a = options === null || options === void 0 ? void 0 : options.extractable) !== null && _a !== void 0 ? _a : false, ["sign", "verify"]);
  }

  // node_modules/@muze-nl/metro-oauth2/src/oauth2.dpop.mjs
  function dpopmw(options) {
    assert(options, {
      site: Required(validURL),
      authorization_endpoint: Required(validURL),
      token_endpoint: Required(validURL),
      dpop_signing_alg_values_supported: Optional([])
      // this property is unfortunately rarely supported
    });
    return async (req, next) => {
      const keys = await keysStore();
      let keyInfo = await keys.get(options.site);
      if (!keyInfo) {
        let keyPair = await generateKeyPair("ES256");
        keyInfo = { domain: options.site, keyPair };
        await keys.set(keyInfo);
      }
      const url2 = everything_default.url(req.url);
      if (req.url.startsWith(options.authorization_endpoint)) {
        let params = req.body;
        if (params instanceof URLSearchParams || params instanceof FormData) {
          params.set("dpop_jkt", keyInfo.keyPair.publicKey);
        } else {
          params.dpop_jkt = keyInfo.keyPair.publicKey;
        }
      } else if (req.url.startsWith(options.token_endpoint)) {
        const dpopHeader = await generateProof(keyInfo.keyPair, req.url, req.method);
        req = req.with({
          headers: {
            "DPoP": dpopHeader
          }
        });
      } else if (req.headers.has("Authorization")) {
        const nonce = localStorage.getItem(url2.host + ":nonce") || void 0;
        const accessToken = req.headers.get("Authorization").split(" ")[1];
        const dpopHeader = await generateProof(keyInfo.keyPair, req.url, req.method, nonce, accessToken);
        req = req.with({
          headers: {
            "Authorization": "DPoP " + accessToken,
            "DPoP": dpopHeader
          }
        });
      }
      let response2 = await next(req);
      if (response2.headers.get("DPoP-Nonce")) {
        localStorage.setItem(url2.host + ":nonce", response2.headers.get("DPoP-Nonce"));
      }
      return response2;
    };
  }

  // node_modules/@muze-nl/metro-oauth2/src/browser.mjs
  var oauth2 = Object.assign({}, oauth2_exports, {
    oauth2mw,
    mockserver: oauth2_mockserver_exports,
    discover: oauth2_discovery_exports,
    tokenstore: tokenStore,
    dpopmw,
    keysstore: keysStore,
    authorizePopup,
    popupHandleRedirect: handleRedirect
  });
  if (!globalThis.metro.oauth2) {
    globalThis.metro.oauth2 = oauth2;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidc.util.mjs
  var MustHave = (...options) => (value, root) => {
    if (options.filter((o) => root.hasOwnKey(o)).length > 0) {
      return false;
    }
    return error("root data must have all of", root, options);
  };
  var MustInclude = (...options) => (value) => {
    if (Array.isArray(value) && options.filter((o) => !value.includes(o)).length == 0) {
      return false;
    } else {
      return error("data must be an array which includes", value, options);
    }
  };
  var validJWA = [
    "HS256",
    "HS384",
    "HS512",
    "RS256",
    "RS384",
    "RS512",
    "ES256",
    "ES384",
    "ES512"
  ];
  var validAuthMethods2 = [
    "client_secret_post",
    "client_secret_basic",
    "client_secret_jwt",
    "private_key_jwt"
  ];

  // node_modules/@muze-nl/metro-oidc/src/oidc.discovery.mjs
  async function oidcDiscovery(options = {}) {
    assert(options, {
      client: Optional(instanceOf(everything_default.client().constructor)),
      issuer: Required(validURL)
    });
    const defaultOptions = {
      client: everything_default.client().with(throwermw()).with(jsonmw()),
      requireDynamicRegistration: false
    };
    options = Object.assign({}, defaultOptions, options);
    const TestSucceeded = false;
    function MustUseHTTPS(url2) {
      return TestSucceeded;
    }
    const openid_provider_metadata = {
      issuer: Required(allOf(options.issuer, MustUseHTTPS)),
      authorization_endpoint: Required(validURL),
      token_endpoint: Required(validURL),
      userinfo_endpoint: Recommended(validURL),
      // todo: test for https protocol
      jwks_uri: Required(validURL),
      registration_endpoint: options.requireDynamicRegistration ? Required(validURL) : Recommended(validURL),
      scopes_supported: Recommended(MustInclude("openid")),
      response_types_supported: options.requireDynamicRegistration ? Required(MustInclude("code", "id_token", "id_token token")) : Required([]),
      response_modes_supported: Optional([]),
      grant_types_supported: options.requireDynamicRegistration ? Optional(MustInclude("authorization_code")) : Optional([]),
      acr_values_supported: Optional([]),
      subject_types_supported: Required([]),
      id_token_signing_alg_values_supported: Required(MustInclude("RS256")),
      id_token_encryption_alg_values_supported: Optional([]),
      id_token_encryption_enc_values_supported: Optional([]),
      userinfo_signing_alg_values_supported: Optional([]),
      userinfo_encryption_alg_values_supported: Optional([]),
      userinfo_encryption_enc_values_supported: Optional([]),
      request_object_signing_alg_values_supported: Optional(MustInclude("RS256")),
      // not testing for 'none'
      request_object_encryption_alg_values_supported: Optional([]),
      request_object_encryption_enc_values_supported: Optional([]),
      token_endpoint_auth_methods_supported: Optional(anyOf(...validAuthMethods2)),
      token_endpoint_auth_signing_alg_values_supported: Optional(MustInclude("RS256"), not(MustInclude("none"))),
      display_values_supported: Optional(anyOf("page", "popup", "touch", "wap")),
      claim_types_supported: Optional(anyOf("normal", "aggregated", "distributed")),
      claims_supported: Recommended([]),
      service_documentation: Optional(validURL),
      claims_locales_supported: Optional([]),
      ui_locales_supported: Optional([]),
      claims_parameter_supported: Optional(Boolean),
      request_parameter_supported: Optional(Boolean),
      request_uri_parameter_supported: Optional(Boolean),
      op_policy_uri: Optional(validURL),
      op_tos_uri: Optional(validURL)
    };
    const configURL = everything_default.url(options.issuer, ".well-known/openid-configuration");
    const response2 = await options.client.get(
      // https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfigurationRequest
      // note: this allows path components in the options.issuer url
      configURL
    );
    const openid_config = response2.data;
    assert(openid_config, openid_provider_metadata);
    assert(openid_config.issuer, options.issuer);
    return openid_config;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidc.register.mjs
  async function register(options) {
    const openid_client_metadata = {
      redirect_uris: Required([validURL]),
      response_types: Optional([]),
      grant_types: Optional(anyOf("authorization_code", "refresh_token")),
      //TODO: match response_types with grant_types
      application_type: Optional(oneOf("native", "web")),
      contacts: Optional([validEmail]),
      client_name: Optional(String),
      logo_uri: Optional(validURL),
      client_uri: Optional(validURL),
      policy_uri: Optional(validURL),
      tos_uri: Optional(validURL),
      jwks_uri: Optional(validURL, not(MustHave("jwks"))),
      jwks: Optional(validURL, not(MustHave("jwks_uri"))),
      sector_identifier_uri: Optional(validURL),
      subject_type: Optional(String),
      id_token_signed_response_alg: Optional(oneOf(...validJWA)),
      id_token_encrypted_response_alg: Optional(oneOf(...validJWA)),
      id_token_encrypted_response_enc: Optional(oneOf(...validJWA), MustHave("id_token_encrypted_response_alg")),
      userinfo_signed_response_alg: Optional(oneOf(...validJWA)),
      userinfo_encrypted_response_alg: Optional(oneOf(...validJWA)),
      userinfo_encrypted_response_enc: Optional(oneOf(...validJWA), MustHave("userinfo_encrypted_response_alg")),
      request_object_signing_alg: Optional(oneOf(...validJWA)),
      request_object_encryption_alg: Optional(oneOf(...validJWA)),
      request_object_encryption_enc: Optional(oneOf(...validJWA)),
      token_endpoint_auth_method: Optional(oneOf(...validAuthMethods2)),
      token_endpoint_auth_signing_alg: Optional(oneOf(...validJWA)),
      default_max_age: Optional(Number),
      require_auth_time: Optional(Boolean),
      default_acr_values: Optional([String]),
      initiate_login_uri: Optional([validURL]),
      request_uris: Optional([validURL])
    };
    assert(options, {
      client: Optional(instanceOf(everything_default.client().constructor)),
      registration_endpoint: validURL,
      client_info: openid_client_metadata
    });
    const defaultOptions = {
      client: everything_default.client().with(throwermw()).with(jsonmw()),
      client_info: {
        redirect_uris: [globalThis.document?.location.href]
      }
    };
    options = Object.assign({}, defaultOptions, options);
    if (!options.client_info) {
      options.client_info = {};
    }
    if (!options.client_info.redirect_uris) {
      options.client_info.redirect_uris = [globalThis.document?.location.href];
    }
    let response2 = await options.client.post(options.registration_endpoint, {
      body: options.client_info
    });
    let info = response2.data;
    if (!info.client_id || !info.client_secret) {
      throw everything_default.metroError("metro.oidc: Error: dynamic registration of client failed, no client_id or client_secret returned", response2);
    }
    options.client_info = Object.assign(options.client_info, info);
    return options.client_info;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidc.store.mjs
  function oidcStore(site) {
    let store;
    if (typeof localStorage !== "undefined") {
      store = {
        get: (name) => JSON.parse(localStorage.getItem("metro/oidc:" + site + ":" + name)),
        set: (name, value) => localStorage.setItem("metro/oidc:" + site + ":" + name, JSON.stringify(value)),
        has: (name) => localStorage.getItem("metro/oidc:" + site + ":" + name) !== null
      };
    } else {
      let storeMap = /* @__PURE__ */ new Map();
      store = {
        get: (name) => JSON.parse(storeMap.get("metro/oidc:" + site + ":" + name) || null),
        set: (name, value) => storeMap.set("metro/oidc:" + site + ":" + name, JSON.stringify(value)),
        has: (name) => storeMap.has("metro/oidc:" + site + ":" + name)
      };
    }
    return store;
  }

  // node_modules/@muze-nl/metro-oidc/src/oidcmw.mjs
  function oidcmw(options = {}) {
    const defaultOptions = {
      client: client(),
      force_authorization: false,
      use_dpop: true,
      authorize_callback: async (url2) => {
        if (window.location.href != url2.href) {
          window.location.replace(url2.href);
        }
        return false;
      }
    };
    options = Object.assign({}, defaultOptions, options);
    assert(options, {
      client: Required(instanceOf(client().constructor)),
      // required because it is set in defaultOptions
      client_info: Required(),
      issuer: Required(validURL),
      oauth2: Optional({}),
      openid_configuration: Optional()
    });
    if (!options.store) {
      options.store = oidcStore(options.issuer);
    }
    if (!options.openid_configuration && options.store.has("openid_configuration")) {
      options.openid_configuration = options.store.get("openid_configuration");
    }
    if (!options.client_info?.client_id && options.store.has("client_info")) {
      options.client_info = options.store.get("client_info");
    }
    return async (req, next) => {
      let res;
      if (!options.force_authorization) {
        try {
          res = await next(req);
        } catch (err) {
          if (res.status != 401 && res.status != 403) {
            throw err;
          }
        }
        if (res.ok || res.status != 401 && res.status != 403) {
          return res;
        }
      }
      if (!options.openid_configuration) {
        options.openid_configuration = await oidcDiscovery({
          issuer: options.issuer
        });
        options.store.set("openid_configuration", options.openid_configuration);
      }
      if (!options.client_info?.client_id) {
        if (!options.openid_configuration.registration_endpoint) {
          throw metroError("metro.oidcmw: Error: issuer " + options.issuer + " does not support dynamic client registration, but you haven't specified a client_id");
        }
        options.client_info = await register({
          registration_endpoint: options.openid_configuration.registration_endpoint,
          client_info: options.client_info
        });
        options.store.set("client_info", options.client_info);
      }
      const scope = options.scope || "openid";
      const oauth2Options = Object.assign(
        {
          site: options.issuer,
          client: options.client,
          force_authorization: true,
          authorize_callback: options.authorize_callback,
          oauth2_configuration: {
            client_id: options.client_info?.client_id,
            client_secret: options.client_info?.client_secret,
            grant_type: "authorization_code",
            response_type: "code",
            response_mode: "query",
            authorization_endpoint: options.openid_configuration.authorization_endpoint,
            token_endpoint: options.openid_configuration.token_endpoint,
            scope,
            //FIXME: should only use scopes supported by server
            redirect_uri: options.client_info.redirect_uris[0]
          }
        }
        //...
      );
      const storeIdToken = async (req2, next2) => {
        const res2 = await next2(req2);
        const contentType = res2.headers.get("content-type");
        if (contentType?.startsWith("application/json")) {
          let id_token = res2.data?.id_token;
          if (!id_token) {
            const res22 = res2.clone();
            try {
              let data = await res22.json();
              if (data && data.id_token) {
                id_token = data.id_token;
              }
            } catch (e) {
            }
          }
          if (id_token) {
            options.store.set("id_token", id_token);
          }
        }
        return res2;
      };
      let oauth2client = options.client.with(options.issuer).with(storeIdToken);
      if (options.use_dpop) {
        const dpopOptions = {
          site: options.issuer,
          authorization_endpoint: options.openid_configuration.authorization_endpoint,
          token_endpoint: options.openid_configuration.token_endpoint,
          dpop_signing_alg_values_supported: options.openid_configuration.dpop_signing_alg_values_supported
        };
        oauth2client = oauth2client.with(dpopmw(dpopOptions));
        oauth2Options.client = oauth2client;
      }
      oauth2client = oauth2client.with(oauth2mw(oauth2Options));
      res = await oauth2client.fetch(req);
      return res;
    };
  }
  function isRedirected2() {
    return isRedirected();
  }
  function idToken(options) {
    if (!options.store) {
      if (!options.issuer) {
        throw metroError("Must supply options.issuer or options.store to get the id_token");
      }
      options.store = oidcStore(options.issuer);
    }
    return options.store.get("id_token");
  }

  // node_modules/@muze-nl/metro-oidc/src/browser.mjs
  var oidc = {
    oidcmw,
    discover: oidcDiscovery,
    register,
    isRedirected: isRedirected2,
    idToken
  };
  if (!globalThis.metro.oidc) {
    globalThis.metro.oidc = oidc;
  }
  var browser_default2 = oidc;

  // node_modules/@muze-nl/oldm-core/src/oldm.mjs
  var oldm_exports = {};
  __export(oldm_exports, {
    BlankNode: () => BlankNode,
    Collection: () => Collection,
    Context: () => Context,
    Graph: () => Graph,
    NamedNode: () => NamedNode,
    default: () => oldm2,
    first: () => first,
    many: () => many,
    one: () => one,
    prefixes: () => prefixes,
    rdfType: () => rdfType
  });
  function oldm2(options) {
    return new Context(options);
  }
  var rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
  var prefixes = {
    acl: "http://www.w3.org/ns/auth/acl#",
    acp: "http://www.w3.org/ns/solid/acp#",
    dcterms: "http://purl.org/dc/terms/",
    foaf: "http://xmlns.com/foaf/0.1/",
    ldn: "https://www.w3.org/ns/ldn#",
    ldp: "http://www.w3.org/ns/ldp#",
    notify: "http://www.w3.org/ns/solid/notifications#",
    oidc: "http://www.w3.org/ns/solid/oidc#",
    owl: "http://www.w3.org/2002/07/owl#",
    pim: "http://www.w3.org/ns/pim/space#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    rdfs: "http://www.w3.org/2000/01/rdf-schema#",
    schema: "http://schema.org/",
    solid: "http://www.w3.org/ns/solid/terms#",
    stat: "http://www.w3.org/ns/posix/stat#",
    turtle: "http://www.w3.org/ns/iana/media-types/text/turtle#",
    vcard: "http://www.w3.org/2006/vcard/ns#",
    xsd: "http://www.w3.org/2001/XMLSchema#"
  };
  function one(values2, whichOne = "last") {
    let result = values2;
    if (Array.isArray(values2)) {
      if (whichOne == "last") {
        result = values2[values2.length - 1];
      } else if (whichOne == "first") {
        result = values2[0];
      } else if (typeof whichOne == "function") {
        result = whichOne(values2);
      } else {
        throw new Error("Unknown value for whichOne parameter");
      }
    }
    return result;
  }
  function many(values2) {
    if (Array.isArray(values2)) {
      return values2;
    }
    if (values2 == null) {
      return [];
    }
    return [values2];
  }
  function first(...values2) {
    for (const value of values2) {
      if (value !== null && value !== void 0) {
        return value;
      }
    }
    return null;
  }
  function values(value) {
    if (Array.isArray(value) && !(value instanceof Collection)) {
      return value;
    }
    if (value === void 0) {
      return [];
    }
    return [value];
  }
  function mergeValue(existing, value) {
    const result = values(existing);
    for (const item of values(value)) {
      if (!result.some((existingItem) => sameValue(existingItem, item))) {
        result.push(item);
      }
    }
    if (result.length == 0) {
      return void 0;
    }
    if (result.length == 1) {
      return result[0];
    }
    return result;
  }
  function sameValue(left, right) {
    if (left === right) {
      return true;
    }
    if (left instanceof NamedNode && right instanceof NamedNode) {
      return left.id == right.id;
    }
    if (left instanceof NamedNode && typeof right == "string") {
      return left.id == right;
    }
    if (typeof left == "string" && right instanceof NamedNode) {
      return left == right.id;
    }
    if (left instanceof Collection && right instanceof Collection) {
      return left.length == right.length && left.every((item, index) => sameValue(item, right[index]));
    }
    if (isLiteral(left) && isLiteral(right)) {
      return String(left) == String(right) && left?.type == right?.type && left?.language == right?.language;
    }
    return false;
  }
  function sameSourceValue(left, right) {
    if (left === right) {
      return true;
    }
    if (left instanceof NamedNode && right instanceof NamedNode) {
      return left.id == right.id;
    }
    if (left instanceof NamedNode && typeof right == "string") {
      return left.id == right;
    }
    if (typeof left == "string" && right instanceof NamedNode) {
      return left == right.id;
    }
    if (left instanceof Collection && right instanceof Collection) {
      return left.length == right.length && left.every((item, index) => sameSourceValue(item, right[index]));
    }
    if (isLiteral(left) && isLiteral(right)) {
      const leftType = left?.type;
      const rightType = right?.type;
      const leftLanguage = left?.language;
      const rightLanguage = right?.language;
      return String(left) == String(right) && (!leftType || !rightType || leftType == rightType) && (!leftLanguage || !rightLanguage || leftLanguage == rightLanguage);
    }
    return false;
  }
  function resolveValue(value, subjects, context) {
    if (value instanceof Collection) {
      const collection = new Collection(context);
      for (const item of value) {
        collection.push(resolveValue(item, subjects, context));
      }
      return collection;
    }
    if (Array.isArray(value)) {
      return value.map((item) => resolveValue(item, subjects, context));
    }
    if (value instanceof NamedNode && subjects[value.id]) {
      return subjects[value.id];
    }
    return value;
  }
  function isLiteral(value) {
    return value instanceof String || value instanceof Number || typeof value == "boolean" || typeof value == "string" || typeof value == "number";
  }
  var Context = class {
    #buildingSubjects = false;
    constructor(options) {
      const clientPrefixes = options?.prefixes ?? {};
      this.prefixes = { ...prefixes, ...clientPrefixes };
      this.prefixOrder = [
        ...Object.keys(clientPrefixes),
        ...Object.keys(prefixes).filter((prefix) => !(prefix in clientPrefixes))
      ];
      if (!this.prefixes["xsd"]) {
        this.prefixes["xsd"] = "http://www.w3.org/2001/XMLSchema#";
        this.prefixOrder.push("xsd");
      }
      this.parser = options?.parser;
      this.writer = options?.writer;
      this.graphs = [];
      this.graphsByUrl = /* @__PURE__ */ Object.create(null);
      this.defaultGraph = options?.defaultGraph ?? null;
      this.separator = options?.separator ?? "$";
      Object.defineProperty(this, "subjects", {
        get() {
          return this.getSubjects();
        }
      });
      Object.defineProperty(this, "data", {
        get() {
          return Object.values(this.subjects);
        }
      });
    }
    parse(input, url2, type) {
      const { quads, prefixes: prefixes2 } = this.parser(input, url2, type);
      if (prefixes2) {
        for (let prefix in prefixes2) {
          let prefixURL = prefixes2[prefix];
          if (prefixURL.match(/^http(s?):\/\/$/i)) {
            prefixURL += url2.substring(prefixURL.length);
          } else try {
            prefixURL = new URL(prefixes2[prefix], url2).href;
          } catch (err) {
            console.error("Could not parse prefix", prefixes2[prefix], err.message);
          }
          if (!this.prefixes[prefix]) {
            this.prefixes[prefix] = prefixURL;
            this.prefixOrder.push(prefix);
          }
        }
      }
      return this.addGraph(new Graph(quads, url2, type, prefixes2, this));
    }
    addGraph(graph) {
      if (!graph?.url) {
        throw new Error("Cannot add graph without a url");
      }
      const existing = this.graphsByUrl[graph.url];
      if (existing) {
        const index = this.graphs.indexOf(existing);
        if (index >= 0) {
          this.graphs[index] = graph;
        }
      } else {
        this.graphs.push(graph);
      }
      this.graphsByUrl[graph.url] = graph;
      return graph;
    }
    graph(url2) {
      return this.graphsByUrl[this.fullURI(url2)];
    }
    set(subject, predicate, value, options = {}) {
      return this.resolveGraph(subject, options).set(subject, predicate, value);
    }
    add(subject, predicate, value, options = {}) {
      return this.resolveGraph(subject, options).add(subject, predicate, value);
    }
    delete(subject, predicate = null, value = void 0, options = {}) {
      const graph = this.resolveGraph(subject, options);
      if (arguments.length < 3) {
        return graph.delete(subject, predicate);
      }
      return graph.delete(subject, predicate, value);
    }
    resolveGraph(subject, options = {}) {
      if (options.graph) {
        return this.getGraphOption(options.graph);
      }
      if (subject instanceof BlankNode && subject.graph instanceof Graph) {
        return subject.graph;
      }
      const id = this.subjectID(subject);
      if (id) {
        const exactGraph = this.graphsByUrl[id];
        if (exactGraph) {
          return exactGraph;
        }
        const documentGraph = this.graphsByUrl[this.documentURL(id)];
        if (documentGraph) {
          return documentGraph;
        }
        const subjectSources = this.graphs.filter((graph) => graph.subjects[id]);
        if (subjectSources.length == 1) {
          return subjectSources[0];
        }
        if (subjectSources.length > 1) {
          throw new Error(`Cannot choose a source graph for ${id}. Use context.set/add/delete(..., { graph }) or graph.set/add/delete(...) to choose one explicitly.`);
        }
      }
      if (this.defaultGraph) {
        return this.getGraphOption(this.defaultGraph);
      }
      if (this.graphs.length == 1) {
        return this.graphs[0];
      }
      throw new Error("Cannot choose a source graph. Use context.set/add/delete(..., { graph }) or graph.set/add/delete(...) to choose one explicitly.");
    }
    getGraphOption(graph) {
      if (graph instanceof Graph) {
        if (!this.graphs.includes(graph)) {
          throw new Error("The selected graph is not part of this context");
        }
        return graph;
      }
      const resolved = this.graph(graph);
      if (!resolved) {
        throw new Error(`Unknown graph: ${graph}`);
      }
      return resolved;
    }
    documentURL(id) {
      try {
        const url2 = new URL(id);
        url2.hash = "";
        return url2.href;
      } catch (err) {
        return id;
      }
    }
    sources(subject, predicate = null, value = void 0) {
      if (!subject) {
        return [...this.graphs];
      }
      if (subject instanceof BlankNode && !(subject instanceof NamedNode)) {
        return this.sourcesForBlankNode(subject, predicate, value, arguments.length >= 3);
      }
      const id = this.subjectID(subject);
      if (!id) {
        return [];
      }
      return this.graphs.filter((graph) => {
        const graphSubject = graph.subjects[id];
        return graphSubject && this.subjectHasSource(graphSubject, predicate, value, arguments.length >= 3);
      });
    }
    sourcesForBlankNode(subject, predicate, value, hasValue) {
      const graph = subject.graph;
      if (!(graph instanceof Graph)) {
        return [];
      }
      if (this.subjectHasSource(subject, predicate, value, hasValue)) {
        return [graph];
      }
      return [];
    }
    subjectHasSource(subject, predicate, value, hasValue) {
      if (!predicate) {
        return true;
      }
      const property = this.propertyName(predicate);
      if (!(property in subject)) {
        return false;
      }
      if (!hasValue) {
        return true;
      }
      return values(subject[property]).some((item) => sameSourceValue(item, value));
    }
    subjectID(subject) {
      if (subject?.id) {
        return this.fullURI(subject.id);
      }
      if (typeof subject == "string") {
        return this.fullURI(subject);
      }
      return null;
    }
    propertyName(predicate) {
      if (predicate?.id) {
        predicate = predicate.id;
      }
      if (predicate == "a" || predicate == rdfType || this.fullURI(predicate) == rdfType) {
        return "a";
      }
      return this.shortURI(this.fullURI(predicate));
    }
    get(shortID) {
      return this.subjects[this.fullURI(shortID)];
    }
    getSubjects() {
      const subjects = /* @__PURE__ */ Object.create(null);
      this.#buildingSubjects = true;
      try {
        for (const graph of this.graphs) {
          for (const id of Object.keys(graph.subjects)) {
            if (!subjects[id]) {
              subjects[id] = this.contextSubject(new NamedNode(id, this));
            }
          }
        }
        for (const graph of this.graphs) {
          for (const [id, subject] of Object.entries(graph.subjects)) {
            this.mergeSubject(subjects[id], subject, subjects);
          }
        }
      } finally {
        this.#buildingSubjects = false;
      }
      return subjects;
    }
    mergeSubject(target, source, subjects) {
      for (const [predicate, value] of Object.entries(source)) {
        if (predicate == "id") {
          continue;
        }
        target[predicate] = mergeValue(
          target[predicate],
          resolveValue(value, subjects, this)
        );
      }
    }
    contextSubject(subject) {
      const context = this;
      return new Proxy(subject, {
        set(target, property, value, receiver) {
          if (context.#buildingSubjects || typeof property == "symbol" || property == "id" || property == "graph") {
            return Reflect.set(target, property, value, receiver);
          }
          context.set(target.id, property, value);
          context.updateContextProperty(target, property);
          return true;
        },
        deleteProperty(target, property) {
          if (context.#buildingSubjects || typeof property == "symbol" || property == "id" || property == "graph") {
            return Reflect.deleteProperty(target, property);
          }
          context.delete(target.id, property);
          context.updateContextProperty(target, property);
          return true;
        }
      });
    }
    updateContextProperty(target, property) {
      const updated = this.get(target.id);
      if (updated && property in updated) {
        target[property] = updated[property];
      } else {
        delete target[property];
      }
    }
    fullURI(shortURI, separator = null) {
      if (!separator) {
        separator = this.separator;
      }
      const [prefix, path] = shortURI.split(separator);
      if (path && this.prefixes[prefix]) {
        return this.prefixes[prefix] + path;
      }
      return shortURI;
    }
    shortURI(fullURI, separator = null) {
      if (!separator) {
        separator = this.separator;
      }
      for (const prefix of this.prefixOrder) {
        if (fullURI.startsWith(this.prefixes[prefix])) {
          return prefix + separator + fullURI.substring(this.prefixes[prefix].length);
        }
      }
      return fullURI;
    }
    setType(literal2, shortType) {
      if (!shortType) {
        return literal2;
      }
      if (typeof literal2 == "string") {
        literal2 = new String(literal2);
      } else if (typeof literal2 == "number") {
        literal2 = new Number(literal2);
      }
      if (typeof literal2 !== "object") {
        throw new Error("cannot set type on ", literal2, shortType);
      }
      literal2.type = shortType;
      return literal2;
    }
    getType(literal2) {
      if (literal2 && typeof literal2 == "object") {
        return literal2.type;
      }
      return null;
    }
  };
  var Graph = class {
    #blankNodes = /* @__PURE__ */ Object.create(null);
    constructor(quads, url2, mimetype, prefixes2, context) {
      this.mimetype = mimetype;
      this.url = url2;
      this.prefixes = prefixes2;
      this.context = context;
      this.subjects = /* @__PURE__ */ Object.create(null);
      for (let quad2 of quads) {
        let subject;
        if (quad2.subject.termType == "BlankNode") {
          let shortPred = this.shortURI(quad2.predicate.id, ":");
          let shortObj;
          switch (shortPred) {
            case "rdf:first":
              subject = this.addCollection(quad2.subject.id);
              shortObj = quad2.object.id ? this.shortURI(quad2.object.id, ":") : null;
              if (shortObj != "rdf:nil") {
                const value = this.getValue(quad2.object);
                if (value) {
                  subject.push(value);
                }
              }
              continue;
            case "rdf:rest":
              this.#blankNodes[quad2.object.id] = this.#blankNodes[quad2.subject.id];
              continue;
            default:
              subject = this.addBlankNode(quad2.subject.id);
              break;
          }
        } else {
          subject = this.addNamedNode(quad2.subject.id);
        }
        subject.addPredicate(quad2.predicate.id, quad2.object);
      }
      if (this.subjects[url2]) {
        this.primary = this.subjects[url2];
      } else {
        this.primary = null;
      }
      Object.defineProperty(this, "data", {
        get() {
          return Object.values(this.subjects);
        }
      });
    }
    addNamedNode(uri) {
      let absURI = new URL(uri, this.url).href;
      if (!this.subjects[absURI]) {
        this.subjects[absURI] = new NamedNode(absURI, this);
      }
      return this.subjects[absURI];
    }
    addBlankNode(id) {
      if (!this.#blankNodes[id]) {
        this.#blankNodes[id] = new BlankNode(this);
      }
      return this.#blankNodes[id];
    }
    addCollection(id) {
      if (!this.#blankNodes[id]) {
        this.#blankNodes[id] = new Collection(this);
      }
      return this.#blankNodes[id];
    }
    write() {
      return this.context.writer(this);
    }
    get(shortID) {
      return this.subjects[this.fullURI(shortID)];
    }
    set(subject, predicate, value) {
      const node = this.ensureSubject(subject);
      const property = this.context.propertyName(predicate);
      if (property == "a") {
        node.a = this.normalizeTypeValues(value);
      } else {
        node[property] = this.normalizeValues(value);
      }
      return node;
    }
    add(subject, predicate, value) {
      const node = this.ensureSubject(subject);
      const property = this.context.propertyName(predicate);
      const newValue = property == "a" ? this.normalizeTypeValues(value) : this.normalizeValues(value);
      node[property] = mergeValue(node[property], newValue);
      return node;
    }
    delete(subject, predicate = null, value = void 0) {
      const node = this.findSubject(subject);
      if (!node) {
        return false;
      }
      if (!predicate) {
        if (node.id) {
          delete this.subjects[node.id];
          if (this.primary === node) {
            this.primary = null;
          }
        }
        return true;
      }
      const property = this.context.propertyName(predicate);
      if (!(property in node)) {
        return false;
      }
      if (arguments.length < 3) {
        delete node[property];
        return true;
      }
      const deleteValues = property == "a" ? values(this.normalizeTypeValues(value)) : values(this.normalizeValues(value));
      const remaining = values(node[property]).filter((item) => !deleteValues.some((deleteValue) => sameValue(item, deleteValue)));
      if (remaining.length == values(node[property]).length) {
        return false;
      }
      if (remaining.length == 0) {
        delete node[property];
      } else if (remaining.length == 1) {
        node[property] = remaining[0];
      } else {
        node[property] = remaining;
      }
      return true;
    }
    ensureSubject(subject) {
      if (subject instanceof BlankNode && !(subject instanceof NamedNode)) {
        if (subject.graph !== this) {
          throw new Error("Cannot write a blank node into a different graph");
        }
        return subject;
      }
      if (subject instanceof NamedNode) {
        return this.addNamedNode(subject.id);
      }
      return this.addNamedNode(this.fullURI(subject));
    }
    findSubject(subject) {
      if (subject instanceof BlankNode && !(subject instanceof NamedNode)) {
        return subject.graph === this ? subject : null;
      }
      const id = subject?.id ? subject.id : this.fullURI(subject);
      return this.subjects[id];
    }
    normalizeValues(value) {
      if (Array.isArray(value) && !(value instanceof Collection)) {
        return value.map((item) => this.normalizeValue(item));
      }
      return this.normalizeValue(value);
    }
    normalizeValue(value) {
      if (value instanceof Collection) {
        const collection = new Collection(this);
        for (const item of value) {
          collection.push(this.normalizeValue(item));
        }
        return collection;
      }
      if (value instanceof NamedNode) {
        return this.addNamedNode(value.id);
      }
      if (value instanceof BlankNode) {
        if (value.graph !== this) {
          throw new Error("Cannot write a blank node into a different graph");
        }
        return value;
      }
      if (this.looksLikeURI(value)) {
        return this.addNamedNode(this.fullURI(value));
      }
      return value;
    }
    normalizeTypeValues(value) {
      if (Array.isArray(value) && !(value instanceof Collection)) {
        return value.map((item) => this.normalizeTypeValue(item));
      }
      return this.normalizeTypeValue(value);
    }
    normalizeTypeValue(value) {
      if (value instanceof NamedNode) {
        return this.shortURI(value.id);
      }
      return this.shortURI(this.fullURI(value));
    }
    looksLikeURI(value) {
      if (typeof value != "string") {
        return false;
      }
      if (/^[a-z][a-z0-9+.-]*:/i.test(value)) {
        return true;
      }
      const [prefix, path] = value.split(this.context.separator);
      return Boolean(path && this.context.prefixes[prefix]);
    }
    fullURI(shortURI, separator = null) {
      if (!separator) {
        separator = this.context.separator;
      }
      const [prefix, path] = shortURI.split(separator);
      if (path) {
        if (this.context.prefixes[prefix]) {
          return this.context.prefixes[prefix] + path;
        }
        if (this.prefixes[prefix]) {
          return this.prefixes[prefix] + path;
        }
      }
      return shortURI;
    }
    shortURI(fullURI, separator = null) {
      if (!separator) {
        separator = this.context.separator;
      }
      for (const prefix of this.context.prefixOrder) {
        if (fullURI.startsWith(this.context.prefixes[prefix])) {
          return prefix + separator + fullURI.substring(this.context.prefixes[prefix].length);
        }
      }
      if (this.url && fullURI.startsWith(this.url)) {
        return fullURI.substring(this.url.length);
      }
      return fullURI;
    }
    /**
     * This sets the type of a literal, usually one of the xsd types
     */
    setType(literal2, type) {
      const shortType = this.shortURI(type);
      return this.context.setType(literal2, shortType);
    }
    /**
     * This returns the type of a literal, or null
     */
    getType(literal2) {
      return this.context.getType(literal2);
    }
    setLanguage(literal2, language) {
      if (typeof literal2 == "string") {
        literal2 = new String(literal2);
      } else if (typeof literal2 == "number") {
        literal2 = new Number(literal2);
      }
      if (typeof literal2 !== "object") {
        throw new Error("cannot set language on ", literal2);
      }
      literal2.language = language;
      return literal2;
    }
    getValue(object) {
      let result;
      if (object.termType == "Literal") {
        result = object.value;
        let datatype = object.datatype?.id;
        if (datatype) {
          result = this.setType(result, datatype);
        }
        let language = object.language;
        if (language) {
          result = this.setLanguage(result, language);
        }
      } else if (object.termType == "BlankNode") {
        result = this.addBlankNode(object.id);
      } else {
        result = this.addNamedNode(object.id);
      }
      return result;
    }
  };
  var BlankNode = class {
    constructor(graph) {
      Object.defineProperty(this, "graph", {
        value: graph,
        writable: false,
        enumerable: false
      });
    }
    addPredicate(predicate, object) {
      if (predicate.id) {
        predicate = predicate.id;
      }
      if (predicate == rdfType) {
        let type = this.graph.shortURI(object.id);
        this.addType(type);
      } else {
        const value = this.graph.getValue(object);
        predicate = this.graph.shortURI(predicate);
        if (!this[predicate]) {
          this[predicate] = value;
        } else if (Array.isArray(this[predicate])) {
          this[predicate].push(value);
        } else {
          this[predicate] = [this[predicate], value];
        }
      }
    }
    /**
     * Adds a rdfType value, stored in this.a
     * Subjects can have more than one type (or class), unlike literals
     * The type value can be any URI, xsdTypes are unexpected here
     */
    addType(type) {
      if (!this.a) {
        this.a = type;
      } else {
        if (!Array.isArray(this.a)) {
          this.a = [this.a];
        }
        this.a.push(type);
      }
    }
  };
  var NamedNode = class extends BlankNode {
    constructor(id, graph) {
      super(graph);
      Object.defineProperty(this, "id", {
        value: id,
        writable: false,
        enumerable: true
      });
    }
  };
  var Collection = class extends Array {
    constructor(graph) {
      super();
      Object.defineProperty(this, "graph", {
        value: graph,
        writable: false,
        enumerable: false
      });
    }
  };

  // node_modules/@muze-nl/oldm-n3/src/oldm-n3.mjs
  var oldm_n3_exports = {};
  __export(oldm_n3_exports, {
    n3Parser: () => n3Parser,
    n3Writer: () => n3Writer
  });

  // node_modules/n3/src/N3Lexer.js
  var import_buffer = __toESM(require_buffer());

  // node_modules/n3/src/IRIs.js
  var RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  var XSD = "http://www.w3.org/2001/XMLSchema#";
  var SWAP = "http://www.w3.org/2000/10/swap/";
  var IRIs_default = {
    xsd: {
      decimal: `${XSD}decimal`,
      boolean: `${XSD}boolean`,
      double: `${XSD}double`,
      integer: `${XSD}integer`,
      string: `${XSD}string`
    },
    rdf: {
      type: `${RDF}type`,
      nil: `${RDF}nil`,
      first: `${RDF}first`,
      rest: `${RDF}rest`,
      langString: `${RDF}langString`,
      dirLangString: `${RDF}dirLangString`,
      reifies: `${RDF}reifies`
    },
    owl: {
      sameAs: "http://www.w3.org/2002/07/owl#sameAs"
    },
    r: {
      forSome: `${SWAP}reify#forSome`,
      forAll: `${SWAP}reify#forAll`
    },
    log: {
      implies: `${SWAP}log#implies`,
      isImpliedBy: `${SWAP}log#isImpliedBy`
    }
  };

  // node_modules/n3/src/N3Lexer.js
  var { xsd } = IRIs_default;
  var escapeSequence = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{8})|\\([^])/g;
  var escapeReplacements = {
    "\\": "\\",
    "'": "'",
    '"': '"',
    "n": "\n",
    "r": "\r",
    "t": "	",
    "f": "\f",
    "b": "\b",
    "_": "_",
    "~": "~",
    ".": ".",
    "-": "-",
    "!": "!",
    "$": "$",
    "&": "&",
    "(": "(",
    ")": ")",
    "*": "*",
    "+": "+",
    ",": ",",
    ";": ";",
    "=": "=",
    "/": "/",
    "?": "?",
    "#": "#",
    "@": "@",
    "%": "%"
  };
  var illegalIriChars = /[\x00-\x20<>\\"\{\}\|\^\`]/;
  function isSurrogateCodePoint(charCode) {
    return charCode >= 55296 && charCode <= 57343;
  }
  var lineModeRegExps = {
    _iri: true,
    _unescapedIri: true,
    _simpleQuotedString: true,
    _langcode: true,
    _dircode: true,
    _blank: true,
    _newline: true,
    _comment: true,
    _whitespace: true,
    _endOfFile: true
  };
  var invalidRegExp = /$0^/;
  var N3Lexer = class {
    constructor(options) {
      this._iri = /^<((?:[^ <>{}\\]|\\[uU])+)>[ \t]*/;
      this._unescapedIri = /^<([^\x00-\x20<>\\"\{\}\|\^\`]*)>[ \t]*/;
      this._simpleQuotedString = /^"([^"\\\r\n]*)"(?=[^"])/;
      this._simpleApostropheString = /^'([^'\\\r\n]*)'(?=[^'])/;
      this._langcode = /^@([a-z]+(?:-[a-z0-9]+)*)(?=[^a-z0-9])/i;
      this._dircode = /^--(ltr)|(rtl)/;
      this._prefix = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:(?=[#\s<])/;
      this._prefixed = /^((?:[A-Za-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)?:((?:(?:[0-:A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])(?:(?:[\.\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~])*(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff]|%[0-9a-fA-F]{2}|\\[!#-\/;=?\-@_~]))?)?)(?:[ \t]+|(?=\.?[,;!\^\s#()\[\]\{\}"'<>]))/;
      this._variable = /^\?(?:(?:[A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:[\-0-:A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?=[.,;!\^\s#()\[\]\{\}"'<>])/;
      this._blank = /^_:((?:[0-9A-Z_a-z\xc0-\xd6\xd8-\xf6\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c\u200d\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])(?:\.?[\-0-9A-Z_a-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u037f-\u1fff\u200c\u200d\u203f\u2040\u2070-\u218f\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd]|[\ud800-\udb7f][\udc00-\udfff])*)(?:[ \t]+|(?=\.?[,;:\s#()\[\]\{\}"'<>]))/;
      this._number = /^[\-+]?(?:(\d+\.\d*|\.?\d+)[eE][\-+]?|\d*(\.)?)\d+(?=\.?[,;:\s#()\[\]\{\}"'<>])/;
      this._boolean = /^(?:true|false)(?=[.,;\s#()\[\]\{\}"'<>])/;
      this._atKeyword = /^@[a-z]+(?=[\s#<:])/i;
      this._keyword = /^(?:PREFIX|BASE|VERSION|GRAPH)(?=[\s#<])/i;
      this._shortPredicates = /^a(?=[\s#()\[\]\{\}"'<>])/;
      this._newline = /^[ \t]*(?:#[^\n\r]*)?(?:\r\n|\n|\r)[ \t]*/;
      this._comment = /#([^\n\r]*)/;
      this._whitespace = /^[ \t]+/;
      this._endOfFile = /^(?:#[^\n\r]*)?$/;
      options = options || {};
      this._isImpliedBy = options.isImpliedBy;
      if (this._lineMode = !!options.lineMode) {
        this._n3Mode = false;
        for (const key in this) {
          if (!(key in lineModeRegExps) && this[key] instanceof RegExp)
            this[key] = invalidRegExp;
        }
      } else {
        this._n3Mode = options.n3 !== false;
      }
      this.comments = !!options.comments;
      this._literalClosingPos = 0;
    }
    // ## Private methods
    // ### `_tokenizeToEnd` tokenizes as for as possible, emitting tokens through the callback
    _tokenizeToEnd(callback, inputFinished) {
      let input = this._input;
      let currentLineLength = input.length;
      while (true) {
        let whiteSpaceMatch, comment;
        while (whiteSpaceMatch = this._newline.exec(input)) {
          if (this.comments && (comment = this._comment.exec(whiteSpaceMatch[0])))
            emitToken("comment", comment[1], "", this._line, whiteSpaceMatch[0].length);
          input = input.substr(whiteSpaceMatch[0].length, input.length);
          currentLineLength = input.length;
          this._line++;
        }
        if (!whiteSpaceMatch && (whiteSpaceMatch = this._whitespace.exec(input)))
          input = input.substr(whiteSpaceMatch[0].length, input.length);
        if (this._endOfFile.test(input)) {
          if (inputFinished) {
            if (this.comments && (comment = this._comment.exec(input)))
              emitToken("comment", comment[1], "", this._line, input.length);
            input = null;
            emitToken("eof", "", "", this._line, 0);
          }
          return this._input = input;
        }
        const line = this._line, firstChar = input[0];
        let type = "", value = "", prefix = "", match = null, matchLength = 0, inconclusive = false;
        switch (firstChar) {
          case "^":
            if (input.length < 3)
              break;
            else if (input[1] === "^") {
              this._previousMarker = "^^";
              input = input.substr(2);
              if (input[0] !== "<") {
                inconclusive = true;
                break;
              }
            } else {
              if (this._n3Mode) {
                matchLength = 1;
                type = "^";
              }
              break;
            }
          // Fall through in case the type is an IRI
          case "<":
            if (match = this._unescapedIri.exec(input))
              type = "IRI", value = match[1];
            else if (match = this._iri.exec(input)) {
              value = this._unescape(match[1]);
              if (value === null || illegalIriChars.test(value))
                return reportSyntaxError(this);
              type = "IRI";
            } else if (input.length > 2 && input[1] === "<" && input[2] === "(")
              type = "<<(", matchLength = 3;
            else if (!this._lineMode && input.length > (inputFinished ? 1 : 2) && input[1] === "<")
              type = "<<", matchLength = 2;
            else if (this._n3Mode && input.length > 1 && input[1] === "=") {
              matchLength = 2;
              if (this._isImpliedBy) type = "abbreviation", value = "<";
              else type = "inverse", value = ">";
            }
            break;
          case ">":
            if (input.length > 1 && input[1] === ">")
              type = ">>", matchLength = 2;
            break;
          case "_":
            if ((match = this._blank.exec(input)) || inputFinished && (match = this._blank.exec(`${input} `)))
              type = "blank", prefix = "_", value = match[1];
            break;
          case '"':
            if (match = this._simpleQuotedString.exec(input))
              value = match[1];
            else {
              ({ value, matchLength } = this._parseLiteral(input));
              if (value === null)
                return reportSyntaxError(this);
            }
            if (match !== null || matchLength !== 0) {
              type = "literal";
              this._literalClosingPos = 0;
            }
            break;
          case "'":
            if (!this._lineMode) {
              if (match = this._simpleApostropheString.exec(input))
                value = match[1];
              else {
                ({ value, matchLength } = this._parseLiteral(input));
                if (value === null)
                  return reportSyntaxError(this);
              }
              if (match !== null || matchLength !== 0) {
                type = "literal";
                this._literalClosingPos = 0;
              }
            }
            break;
          case "?":
            if (this._n3Mode && (match = this._variable.exec(input)))
              type = "var", value = match[0];
            break;
          case "@":
            if (this._previousMarker === "literal" && (match = this._langcode.exec(input)) && match[1] !== "version")
              type = "langcode", value = match[1];
            else if (match = this._atKeyword.exec(input))
              type = match[0];
            break;
          case ".":
            if (input.length === 1 ? inputFinished : input[1] < "0" || input[1] > "9") {
              type = ".";
              matchLength = 1;
              break;
            }
          // Fall through to numerical case (could be a decimal dot)
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
          case "+":
          case "-":
            if (input[1] === "-") {
              if (this._previousMarker === "langcode" && (match = this._dircode.exec(input)))
                type = "dircode", matchLength = 2, value = match[1] || match[2], matchLength = value.length + 2;
              break;
            }
            if (match = this._number.exec(input) || inputFinished && (match = this._number.exec(`${input} `))) {
              type = "literal", value = match[0];
              prefix = typeof match[1] === "string" ? xsd.double : typeof match[2] === "string" ? xsd.decimal : xsd.integer;
            }
            break;
          case "B":
          case "b":
          case "p":
          case "P":
          case "G":
          case "g":
          case "V":
          case "v":
            if (match = this._keyword.exec(input))
              type = match[0].toUpperCase();
            else
              inconclusive = true;
            break;
          case "f":
          case "t":
            if (match = this._boolean.exec(input))
              type = "literal", value = match[0], prefix = xsd.boolean;
            else
              inconclusive = true;
            break;
          case "a":
            if (match = this._shortPredicates.exec(input))
              type = "abbreviation", value = "a";
            else
              inconclusive = true;
            break;
          case "=":
            if (this._n3Mode && input.length > 1) {
              type = "abbreviation";
              if (input[1] !== ">")
                matchLength = 1, value = "=";
              else
                matchLength = 2, value = ">";
            }
            break;
          case "!":
            if (!this._n3Mode)
              break;
          case ")":
            if (!inputFinished && (input.length === 1 || input.length === 2 && input[1] === ">")) {
              break;
            }
            if (input.length > 2 && input[1] === ">" && input[2] === ">") {
              type = ")>>", matchLength = 3;
              break;
            }
          case ",":
          case ";":
          case "[":
          case "]":
          case "(":
          case "}":
          case "~":
            if (!this._lineMode) {
              matchLength = 1;
              type = firstChar;
            }
            break;
          case "{":
            if (!this._lineMode && input.length >= 2) {
              if (input[1] === "|")
                type = "{|", matchLength = 2;
              else
                type = firstChar, matchLength = 1;
            }
            break;
          case "|":
            if (input.length >= 2 && input[1] === "}")
              type = "|}", matchLength = 2;
            break;
          default:
            inconclusive = true;
        }
        if (inconclusive) {
          if ((this._previousMarker === "@prefix" || this._previousMarker === "PREFIX") && (match = this._prefix.exec(input)))
            type = "prefix", value = match[1] || "";
          else if ((match = this._prefixed.exec(input)) || inputFinished && (match = this._prefixed.exec(`${input} `)))
            type = "prefixed", prefix = match[1] || "", value = this._unescape(match[2]);
        }
        if (this._previousMarker === "^^") {
          switch (type) {
            case "prefixed":
              type = "type";
              break;
            case "IRI":
              type = "typeIRI";
              break;
            default:
              type = "";
          }
        }
        if (!type) {
          if (inputFinished || !/^'''|^"""/.test(input) && /\n|\r/.test(input))
            return reportSyntaxError(this);
          else
            return this._input = input;
        }
        const length = matchLength || match[0].length;
        const token = emitToken(type, value, prefix, line, length);
        this.previousToken = token;
        this._previousMarker = type;
        input = input.substr(length, input.length);
      }
      function emitToken(type, value, prefix, line, length) {
        const start = input ? currentLineLength - input.length : currentLineLength;
        const end = start + length;
        const token = { type, value, prefix, line, start, end };
        callback(null, token);
        return token;
      }
      function reportSyntaxError(self) {
        callback(self._syntaxError(/^\S*/.exec(input)[0]));
      }
    }
    // ### `_unescape` replaces N3 escape codes by their corresponding characters
    _unescape(item) {
      let invalid = false;
      const replaced = item.replace(escapeSequence, (sequence, unicode4, unicode8, escapedChar) => {
        if (typeof unicode4 === "string") {
          const charCode = Number.parseInt(unicode4, 16);
          if (isSurrogateCodePoint(charCode)) {
            invalid = true;
            return "";
          }
          return String.fromCharCode(charCode);
        }
        if (typeof unicode8 === "string") {
          let charCode = Number.parseInt(unicode8, 16);
          if (isSurrogateCodePoint(charCode)) {
            invalid = true;
            return "";
          }
          return charCode <= 65535 ? String.fromCharCode(Number.parseInt(unicode8, 16)) : String.fromCharCode(55296 + ((charCode -= 65536) >> 10), 56320 + (charCode & 1023));
        }
        if (escapedChar in escapeReplacements)
          return escapeReplacements[escapedChar];
        invalid = true;
        return "";
      });
      return invalid ? null : replaced;
    }
    // ### `_parseLiteral` parses a literal into an unescaped value
    _parseLiteral(input) {
      if (input.length >= 3) {
        const opening = input.match(/^(?:"""|"|'''|'|)/)[0];
        const openingLength = opening.length;
        let closingPos = Math.max(this._literalClosingPos, openingLength);
        while ((closingPos = input.indexOf(opening, closingPos)) > 0) {
          let backslashCount = 0;
          while (input[closingPos - backslashCount - 1] === "\\")
            backslashCount++;
          if (backslashCount % 2 === 0) {
            const raw = input.substring(openingLength, closingPos);
            const lines = raw.split(/\r\n|\r|\n/).length - 1;
            const matchLength = closingPos + openingLength;
            if (openingLength === 1 && lines !== 0 || openingLength === 3 && this._lineMode)
              break;
            this._line += lines;
            return { value: this._unescape(raw), matchLength };
          }
          closingPos++;
        }
        this._literalClosingPos = input.length - openingLength + 1;
      }
      return { value: "", matchLength: 0 };
    }
    // ### `_syntaxError` creates a syntax error for the given issue
    _syntaxError(issue) {
      this._input = null;
      const err = new Error(`Unexpected "${issue}" on line ${this._line}.`);
      err.context = {
        token: void 0,
        line: this._line,
        previousToken: this.previousToken
      };
      return err;
    }
    // ### Strips off any starting UTF BOM mark.
    _readStartingBom(input) {
      return input.startsWith("\uFEFF") ? input.substr(1) : input;
    }
    // ## Public methods
    // ### `tokenize` starts the transformation of an N3 document into an array of tokens.
    // The input can be a string or a stream.
    tokenize(input, callback) {
      this._line = 1;
      if (typeof input === "string") {
        this._input = this._readStartingBom(input);
        if (typeof callback === "function")
          queueMicrotask(() => this._tokenizeToEnd(callback, true));
        else {
          const tokens = [];
          let error3;
          this._tokenizeToEnd((e, t) => e ? error3 = e : tokens.push(t), true);
          if (error3) throw error3;
          return tokens;
        }
      } else {
        this._pendingBuffer = null;
        if (typeof input.setEncoding === "function")
          input.setEncoding("utf8");
        input.on("data", (data) => {
          if (this._input !== null && data.length !== 0) {
            if (this._pendingBuffer) {
              data = import_buffer.Buffer.concat([this._pendingBuffer, data]);
              this._pendingBuffer = null;
            }
            if (data[data.length - 1] & 128) {
              this._pendingBuffer = data;
            } else {
              if (typeof this._input === "undefined")
                this._input = this._readStartingBom(typeof data === "string" ? data : data.toString());
              else
                this._input += data;
              this._tokenizeToEnd(callback, false);
            }
          }
        });
        input.on("end", () => {
          if (typeof this._input === "string")
            this._tokenizeToEnd(callback, true);
        });
        input.on("error", callback);
      }
    }
  };

  // node_modules/n3/src/N3DataFactory.js
  var { rdf, xsd: xsd2 } = IRIs_default;
  var DEFAULTGRAPH;
  var _blankNodeCounter = 0;
  var DataFactory = {
    namedNode,
    blankNode,
    variable,
    literal,
    defaultGraph,
    quad,
    triple: quad,
    fromTerm,
    fromQuad
  };
  var N3DataFactory_default = DataFactory;
  var Term = class _Term {
    constructor(id) {
      this.id = id;
    }
    // ### The value of this term
    get value() {
      return this.id;
    }
    // ### Returns whether this object represents the same term as the other
    equals(other) {
      if (other instanceof _Term)
        return this.id === other.id;
      return !!other && this.termType === other.termType && this.value === other.value;
    }
    // ### Implement hashCode for Immutable.js, since we implement `equals`
    // https://immutable-js.com/docs/v4.0.0/ValueObject/#hashCode()
    hashCode() {
      return 0;
    }
    // ### Returns a plain object representation of this term
    toJSON() {
      return {
        termType: this.termType,
        value: this.value
      };
    }
  };
  var NamedNode2 = class extends Term {
    // ### The term type of this term
    get termType() {
      return "NamedNode";
    }
  };
  var Literal = class _Literal extends Term {
    // ### The term type of this term
    get termType() {
      return "Literal";
    }
    // ### The text value of this literal
    get value() {
      return this.id.substring(1, this.id.lastIndexOf('"'));
    }
    // ### The language of this literal
    get language() {
      const id = this.id;
      let atPos = id.lastIndexOf('"') + 1;
      const dirPos = id.lastIndexOf("--");
      return atPos < id.length && id[atPos++] === "@" ? (dirPos > atPos ? id.substr(0, dirPos) : id).substr(atPos).toLowerCase() : "";
    }
    // ### The direction of this literal
    get direction() {
      const id = this.id;
      const endPos = id.lastIndexOf('"');
      const dirPos = id.lastIndexOf("--");
      return dirPos > endPos && dirPos + 2 < id.length ? id.substr(dirPos + 2).toLowerCase() : "";
    }
    // ### The datatype IRI of this literal
    get datatype() {
      return new NamedNode2(this.datatypeString);
    }
    // ### The datatype string of this literal
    get datatypeString() {
      const id = this.id, dtPos = id.lastIndexOf('"') + 1;
      const char = dtPos < id.length ? id[dtPos] : "";
      return char === "^" ? id.substr(dtPos + 2) : (
        // If "@" follows, return rdf:langString or rdf:dirLangString; xsd:string otherwise
        char !== "@" ? xsd2.string : id.indexOf("--", dtPos) > 0 ? rdf.dirLangString : rdf.langString
      );
    }
    // ### Returns whether this object represents the same term as the other
    equals(other) {
      if (other instanceof _Literal)
        return this.id === other.id;
      return !!other && !!other.datatype && this.termType === other.termType && this.value === other.value && this.language === other.language && (this.direction === other.direction || this.direction === "" && !other.direction) && this.datatype.value === other.datatype.value;
    }
    toJSON() {
      return {
        termType: this.termType,
        value: this.value,
        language: this.language,
        direction: this.direction,
        datatype: { termType: "NamedNode", value: this.datatypeString }
      };
    }
  };
  var BlankNode2 = class extends Term {
    constructor(name) {
      super(`_:${name}`);
    }
    // ### The term type of this term
    get termType() {
      return "BlankNode";
    }
    // ### The name of this blank node
    get value() {
      return this.id.substr(2);
    }
  };
  var Variable = class extends Term {
    constructor(name) {
      super(`?${name}`);
    }
    // ### The term type of this term
    get termType() {
      return "Variable";
    }
    // ### The name of this variable
    get value() {
      return this.id.substr(1);
    }
  };
  var DefaultGraph = class extends Term {
    constructor() {
      super("");
      return DEFAULTGRAPH || this;
    }
    // ### The term type of this term
    get termType() {
      return "DefaultGraph";
    }
    // ### Returns whether this object represents the same term as the other
    equals(other) {
      return this === other || !!other && this.termType === other.termType;
    }
  };
  DEFAULTGRAPH = new DefaultGraph();
  var Quad = class extends Term {
    constructor(subject, predicate, object, graph) {
      super("");
      this._subject = subject;
      this._predicate = predicate;
      this._object = object;
      this._graph = graph || DEFAULTGRAPH;
    }
    // ### The term type of this term
    get termType() {
      return "Quad";
    }
    get subject() {
      return this._subject;
    }
    get predicate() {
      return this._predicate;
    }
    get object() {
      return this._object;
    }
    get graph() {
      return this._graph;
    }
    // ### Returns a plain object representation of this quad
    toJSON() {
      return {
        termType: this.termType,
        subject: this._subject.toJSON(),
        predicate: this._predicate.toJSON(),
        object: this._object.toJSON(),
        graph: this._graph.toJSON()
      };
    }
    // ### Returns whether this object represents the same quad as the other
    equals(other) {
      return !!other && this._subject.equals(other.subject) && this._predicate.equals(other.predicate) && this._object.equals(other.object) && this._graph.equals(other.graph);
    }
  };
  function namedNode(iri) {
    return new NamedNode2(iri);
  }
  function blankNode(name) {
    return new BlankNode2(name || `n3-${_blankNodeCounter++}`);
  }
  function literal(value, languageOrDataType) {
    if (typeof languageOrDataType === "string")
      return new Literal(`"${value}"@${languageOrDataType.toLowerCase()}`);
    if (languageOrDataType !== void 0 && !("termType" in languageOrDataType)) {
      return new Literal(`"${value}"@${languageOrDataType.language.toLowerCase()}${languageOrDataType.direction ? `--${languageOrDataType.direction.toLowerCase()}` : ""}`);
    }
    let datatype = languageOrDataType ? languageOrDataType.value : "";
    if (datatype === "") {
      if (typeof value === "boolean")
        datatype = xsd2.boolean;
      else if (typeof value === "number") {
        if (Number.isFinite(value))
          datatype = Number.isInteger(value) ? xsd2.integer : xsd2.double;
        else {
          datatype = xsd2.double;
          if (!Number.isNaN(value))
            value = value > 0 ? "INF" : "-INF";
        }
      }
    }
    return datatype === "" || datatype === xsd2.string ? new Literal(`"${value}"`) : new Literal(`"${value}"^^${datatype}`);
  }
  function variable(name) {
    return new Variable(name);
  }
  function defaultGraph() {
    return DEFAULTGRAPH;
  }
  function quad(subject, predicate, object, graph) {
    return new Quad(subject, predicate, object, graph);
  }
  function fromTerm(term) {
    if (term instanceof Term)
      return term;
    switch (term.termType) {
      case "NamedNode":
        return namedNode(term.value);
      case "BlankNode":
        return blankNode(term.value);
      case "Variable":
        return variable(term.value);
      case "DefaultGraph":
        return DEFAULTGRAPH;
      case "Literal":
        return literal(term.value, term.language || term.datatype);
      case "Quad":
        return fromQuad(term);
      default:
        throw new Error(`Unexpected termType: ${term.termType}`);
    }
  }
  function fromQuad(inQuad) {
    if (inQuad instanceof Quad)
      return inQuad;
    if (inQuad.termType !== "Quad")
      throw new Error(`Unexpected termType: ${inQuad.termType}`);
    return quad(fromTerm(inQuad.subject), fromTerm(inQuad.predicate), fromTerm(inQuad.object), fromTerm(inQuad.graph));
  }

  // node_modules/n3/src/N3Parser.js
  var blankNodePrefix = 0;
  var N3Parser = class _N3Parser {
    constructor(options) {
      this._contextStack = [];
      this._graph = null;
      options = options || {};
      this._setBase(options.baseIRI);
      options.factory && initDataFactory(this, options.factory);
      const format = typeof options.format === "string" ? options.format.match(/\w*$/)[0].toLowerCase() : "", isTurtle = /turtle/.test(format), isTriG = /trig/.test(format), isNTriples = /triple/.test(format), isNQuads = /quad/.test(format), isN3 = this._n3Mode = /n3/.test(format), isLineMode = isNTriples || isNQuads;
      if (!(this._supportsNamedGraphs = !(isTurtle || isN3)))
        this._readPredicateOrNamedGraph = this._readPredicate;
      this._supportsQuads = !(isTurtle || isTriG || isNTriples || isN3);
      this._isImpliedBy = options.isImpliedBy;
      if (isLineMode)
        this._resolveRelativeIRI = (iri) => {
          return null;
        };
      this._blankNodePrefix = typeof options.blankNodePrefix !== "string" ? "" : options.blankNodePrefix.replace(/^(?!_:)/, "_:");
      this._lexer = options.lexer || new N3Lexer({ lineMode: isLineMode, n3: isN3, isImpliedBy: this._isImpliedBy });
      this._explicitQuantifiers = !!options.explicitQuantifiers;
      this._parseUnsupportedVersions = !!options.parseUnsupportedVersions;
      this._version = options.version;
    }
    // ## Static class methods
    // ### `_resetBlankNodePrefix` restarts blank node prefix identification
    static _resetBlankNodePrefix() {
      blankNodePrefix = 0;
    }
    // ## Private methods
    // ### `_setBase` sets the base IRI to resolve relative IRIs
    _setBase(baseIRI) {
      if (!baseIRI) {
        this._base = "";
        this._basePath = "";
      } else {
        const fragmentPos = baseIRI.indexOf("#");
        if (fragmentPos >= 0)
          baseIRI = baseIRI.substr(0, fragmentPos);
        this._base = baseIRI;
        this._basePath = baseIRI.indexOf("/") < 0 ? baseIRI : baseIRI.replace(/[^\/?]*(?:\?.*)?$/, "");
        baseIRI = baseIRI.match(/^(?:([a-z][a-z0-9+.-]*:))?(?:\/\/[^\/]*)?/i);
        this._baseRoot = baseIRI[0];
        this._baseScheme = baseIRI[1];
      }
    }
    // ### `_saveContext` stores the current parsing context
    // when entering a new scope (list, blank node, formula)
    _saveContext(type, graph, subject, predicate, object) {
      const n3Mode = this._n3Mode;
      this._contextStack.push({
        type,
        subject,
        predicate,
        object,
        graph,
        inverse: n3Mode ? this._inversePredicate : false,
        blankPrefix: n3Mode ? this._prefixes._ : "",
        quantified: n3Mode ? this._quantified : null
      });
      if (n3Mode) {
        this._inversePredicate = false;
        this._prefixes._ = this._graph ? `${this._graph.value}.` : ".";
        this._quantified = Object.create(this._quantified);
      }
    }
    // ### `_restoreContext` restores the parent context
    // when leaving a scope (list, blank node, formula)
    _restoreContext(type, token) {
      const context = this._contextStack.pop();
      if (!context || context.type !== type)
        return this._error(`Unexpected ${token.type}`, token);
      this._subject = context.subject;
      this._predicate = context.predicate;
      this._object = context.object;
      this._graph = context.graph;
      if (this._n3Mode) {
        this._inversePredicate = context.inverse;
        this._prefixes._ = context.blankPrefix;
        this._quantified = context.quantified;
      }
    }
    // ### `_readBeforeTopContext` is called once only at the start of parsing.
    _readBeforeTopContext(token) {
      if (this._version && !this._isValidVersion(this._version))
        return this._error(`Detected unsupported version as media type parameter: "${this._version}"`, token);
      return this._readInTopContext(token);
    }
    // ### `_readInTopContext` reads a token when in the top context
    _readInTopContext(token) {
      switch (token.type) {
        // If an EOF token arrives in the top context, signal that we're done
        case "eof":
          if (this._graph !== null)
            return this._error("Unclosed graph", token);
          delete this._prefixes._;
          return this._callback(null, null, this._prefixes);
        // It could be a prefix declaration
        case "PREFIX":
          this._sparqlStyle = true;
        case "@prefix":
          return this._readPrefix;
        // It could be a base declaration
        case "BASE":
          this._sparqlStyle = true;
        case "@base":
          return this._readBaseIRI;
        // It could be a version declaration
        case "VERSION":
          this._sparqlStyle = true;
        case "@version":
          return this._readVersion;
        // It could be a graph
        case "{":
          if (this._supportsNamedGraphs) {
            this._graph = "";
            this._subject = null;
            return this._readSubject;
          }
        case "GRAPH":
          if (this._supportsNamedGraphs)
            return this._readNamedGraphLabel;
        // Otherwise, the next token must be a subject
        default:
          return this._readSubject(token);
      }
    }
    // ### `_readEntity` reads an IRI, prefixed name, blank node, or variable
    _readEntity(token, quantifier) {
      let value;
      switch (token.type) {
        // Read a relative or absolute IRI
        case "IRI":
        case "typeIRI":
          const iri = this._resolveIRI(token.value);
          if (iri === null)
            return this._error("Invalid IRI", token);
          value = this._factory.namedNode(iri);
          break;
        // Read a prefixed name
        case "type":
        case "prefixed":
          const prefix = this._prefixes[token.prefix];
          if (prefix === void 0)
            return this._error(`Undefined prefix "${token.prefix}:"`, token);
          value = this._factory.namedNode(prefix + token.value);
          break;
        // Read a blank node
        case "blank":
          value = this._factory.blankNode(this._prefixes[token.prefix] + token.value);
          break;
        // Read a variable
        case "var":
          value = this._factory.variable(token.value.substr(1));
          break;
        // Everything else is not an entity
        default:
          return this._error(`Expected entity but got ${token.type}`, token);
      }
      if (!quantifier && this._n3Mode && value.id in this._quantified)
        value = this._quantified[value.id];
      return value;
    }
    // ### `_readSubject` reads a quad's subject
    _readSubject(token) {
      this._predicate = null;
      switch (token.type) {
        case "[":
          this._saveContext(
            "blank",
            this._graph,
            this._subject = this._factory.blankNode(),
            null,
            null
          );
          return this._readBlankNodeHead;
        case "(":
          const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
          if (parent.type === "<<") {
            return this._error("Unexpected list in reified triple", token);
          }
          this._saveContext("list", this._graph, this.RDF_NIL, null, null);
          this._subject = null;
          return this._readListItem;
        case "{":
          if (!this._n3Mode)
            return this._error("Unexpected graph", token);
          this._saveContext(
            "formula",
            this._graph,
            this._graph = this._factory.blankNode(),
            null,
            null
          );
          return this._readSubject;
        case "}":
          return this._readPunctuation(token);
        case "@forSome":
          if (!this._n3Mode)
            return this._error('Unexpected "@forSome"', token);
          this._subject = null;
          this._predicate = this.N3_FORSOME;
          this._quantifier = "blankNode";
          return this._readQuantifierList;
        case "@forAll":
          if (!this._n3Mode)
            return this._error('Unexpected "@forAll"', token);
          this._subject = null;
          this._predicate = this.N3_FORALL;
          this._quantifier = "variable";
          return this._readQuantifierList;
        case "literal":
          if (!this._n3Mode)
            return this._error("Unexpected literal", token);
          if (token.prefix.length === 0) {
            this._literalValue = token.value;
            return this._completeSubjectLiteral;
          } else
            this._subject = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
          break;
        case "<<(":
          if (!this._n3Mode)
            return this._error("Disallowed triple term as subject", token);
          this._saveContext("<<(", this._graph, null, null, null);
          this._graph = null;
          return this._readSubject;
        case "<<":
          this._saveContext("<<", this._graph, null, null, null);
          this._graph = null;
          return this._readSubject;
        default:
          if ((this._subject = this._readEntity(token)) === void 0)
            return;
          if (this._n3Mode)
            return this._getPathReader(this._readPredicateOrNamedGraph);
      }
      return this._readPredicateOrNamedGraph;
    }
    // ### `_readPredicate` reads a quad's predicate
    _readPredicate(token) {
      const type = token.type;
      switch (type) {
        case "inverse":
          this._inversePredicate = true;
        case "abbreviation":
          this._predicate = this.ABBREVIATIONS[token.value];
          break;
        case ".":
        case "]":
        case "}":
        case "|}":
          if (this._predicate === null)
            return this._error(`Unexpected ${type}`, token);
          this._subject = null;
          return type === "]" ? this._readBlankNodeTail(token) : this._readPunctuation(token);
        case ";":
          return this._predicate !== null ? this._readPredicate : this._error("Expected predicate but got ;", token);
        case "[":
          if (this._n3Mode) {
            this._saveContext(
              "blank",
              this._graph,
              this._subject,
              this._subject = this._factory.blankNode(),
              null
            );
            return this._readBlankNodeHead;
          }
        case "blank":
          if (!this._n3Mode)
            return this._error("Disallowed blank node as predicate", token);
        default:
          if ((this._predicate = this._readEntity(token)) === void 0)
            return;
      }
      this._validAnnotation = true;
      return this._readObject;
    }
    // ### `_readObject` reads a quad's object
    _readObject(token) {
      switch (token.type) {
        case "literal":
          if (token.prefix.length === 0) {
            this._literalValue = token.value;
            return this._readDataTypeOrLang;
          } else
            this._object = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
          break;
        case "[":
          this._saveContext(
            "blank",
            this._graph,
            this._subject,
            this._predicate,
            this._subject = this._factory.blankNode()
          );
          return this._readBlankNodeHead;
        case "(":
          const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
          if (parent.type === "<<") {
            return this._error("Unexpected list in reified triple", token);
          }
          this._saveContext("list", this._graph, this._subject, this._predicate, this.RDF_NIL);
          this._subject = null;
          return this._readListItem;
        case "{":
          if (!this._n3Mode)
            return this._error("Unexpected graph", token);
          this._saveContext(
            "formula",
            this._graph,
            this._subject,
            this._predicate,
            this._graph = this._factory.blankNode()
          );
          return this._readSubject;
        case "<<(":
          this._saveContext("<<(", this._graph, this._subject, this._predicate, null);
          this._graph = null;
          return this._readSubject;
        case "<<":
          this._saveContext("<<", this._graph, this._subject, this._predicate, null);
          this._graph = null;
          return this._readSubject;
        default:
          if ((this._object = this._readEntity(token)) === void 0)
            return;
          if (this._n3Mode)
            return this._getPathReader(this._getContextEndReader());
      }
      return this._getContextEndReader();
    }
    // ### `_readPredicateOrNamedGraph` reads a quad's predicate, or a named graph
    _readPredicateOrNamedGraph(token) {
      return token.type === "{" ? this._readGraph(token) : this._readPredicate(token);
    }
    // ### `_readGraph` reads a graph
    _readGraph(token) {
      if (token.type !== "{")
        return this._error(`Expected graph but got ${token.type}`, token);
      this._graph = this._subject, this._subject = null;
      return this._readSubject;
    }
    // ### `_readBlankNodeHead` reads the head of a blank node
    _readBlankNodeHead(token) {
      if (token.type === "]") {
        this._subject = null;
        return this._readBlankNodeTail(token);
      } else {
        const stack = this._contextStack, parentParent = stack.length > 1 && stack[stack.length - 2];
        if (parentParent.type === "<<") {
          return this._error("Unexpected compound blank node expression in reified triple", token);
        }
        this._predicate = null;
        return this._readPredicate(token);
      }
    }
    // ### `_readBlankNodeTail` reads the end of a blank node
    _readBlankNodeTail(token) {
      if (token.type !== "]")
        return this._readBlankNodePunctuation(token);
      if (this._subject !== null)
        this._emit(this._subject, this._predicate, this._object, this._graph);
      const empty = this._predicate === null;
      this._restoreContext("blank", token);
      if (this._object !== null)
        return this._getContextEndReader();
      else if (this._predicate !== null)
        return this._readObject;
      else
        return empty ? this._readPredicateOrNamedGraph : this._readPredicateAfterBlank;
    }
    // ### `_readPredicateAfterBlank` reads a predicate after an anonymous blank node
    _readPredicateAfterBlank(token) {
      switch (token.type) {
        case ".":
        case "}":
          this._subject = null;
          return this._readPunctuation(token);
        default:
          return this._readPredicate(token);
      }
    }
    // ### `_readListItem` reads items from a list
    _readListItem(token) {
      let item = null, list = null, next = this._readListItem;
      const previousList = this._subject, stack = this._contextStack, parent = stack[stack.length - 1];
      switch (token.type) {
        case "[":
          this._saveContext(
            "blank",
            this._graph,
            list = this._factory.blankNode(),
            this.RDF_FIRST,
            this._subject = item = this._factory.blankNode()
          );
          next = this._readBlankNodeHead;
          break;
        case "(":
          this._saveContext(
            "list",
            this._graph,
            list = this._factory.blankNode(),
            this.RDF_FIRST,
            this.RDF_NIL
          );
          this._subject = null;
          break;
        case ")":
          this._restoreContext("list", token);
          if (stack.length !== 0 && stack[stack.length - 1].type === "list")
            this._emit(this._subject, this._predicate, this._object, this._graph);
          if (this._predicate === null) {
            next = this._readPredicate;
            if (this._subject === this.RDF_NIL)
              return next;
          } else {
            next = this._getContextEndReader();
            if (this._object === this.RDF_NIL)
              return next;
          }
          list = this.RDF_NIL;
          break;
        case "literal":
          if (token.prefix.length === 0) {
            this._literalValue = token.value;
            next = this._readListItemDataTypeOrLang;
          } else {
            item = this._factory.literal(token.value, this._factory.namedNode(token.prefix));
            next = this._getContextEndReader();
          }
          break;
        case "{":
          if (!this._n3Mode)
            return this._error("Unexpected graph", token);
          this._saveContext(
            "formula",
            this._graph,
            this._subject,
            this._predicate,
            this._graph = this._factory.blankNode()
          );
          return this._readSubject;
        case "<<":
          this._saveContext("<<", this._graph, null, null, null);
          this._graph = null;
          next = this._readSubject;
          break;
        default:
          if ((item = this._readEntity(token)) === void 0)
            return;
      }
      if (list === null)
        this._subject = list = this._factory.blankNode();
      if (token.type === "<<")
        stack[stack.length - 1].subject = this._subject;
      if (previousList === null) {
        if (parent.predicate === null)
          parent.subject = list;
        else
          parent.object = list;
      } else {
        this._emit(previousList, this.RDF_REST, list, this._graph);
      }
      if (item !== null) {
        if (this._n3Mode && (token.type === "IRI" || token.type === "prefixed")) {
          this._saveContext("item", this._graph, list, this.RDF_FIRST, item);
          this._subject = item, this._predicate = null;
          return this._getPathReader(this._readListItem);
        }
        this._emit(list, this.RDF_FIRST, item, this._graph);
      }
      return next;
    }
    // ### `_readDataTypeOrLang` reads an _optional_ datatype or language
    _readDataTypeOrLang(token) {
      return this._completeObjectLiteral(token, false);
    }
    // ### `_readListItemDataTypeOrLang` reads an _optional_ datatype or language in a list
    _readListItemDataTypeOrLang(token) {
      return this._completeObjectLiteral(token, true);
    }
    // ### `_completeLiteral` completes a literal with an optional datatype or language
    _completeLiteral(token, component) {
      let literal2 = this._factory.literal(this._literalValue);
      let readCb;
      switch (token.type) {
        // Create a datatyped literal
        case "type":
        case "typeIRI":
          const datatype = this._readEntity(token);
          if (datatype === void 0) return;
          if (datatype.value === IRIs_default.rdf.langString || datatype.value === IRIs_default.rdf.dirLangString) {
            return this._error("Detected illegal (directional) languaged-tagged string with explicit datatype", token);
          }
          literal2 = this._factory.literal(this._literalValue, datatype);
          token = null;
          break;
        // Create a language-tagged string
        case "langcode":
          if (token.value.split("-").some((t) => t.length > 8))
            return this._error("Detected language tag with subtag longer than 8 characters", token);
          literal2 = this._factory.literal(this._literalValue, token.value);
          this._literalLanguage = token.value;
          token = null;
          readCb = this._readDirCode.bind(this, component);
          break;
      }
      return { token, literal: literal2, readCb };
    }
    _readDirCode(component, listItem, token) {
      if (token.type === "dircode") {
        const term = this._factory.literal(this._literalValue, { language: this._literalLanguage, direction: token.value });
        if (component === "subject")
          this._subject = term;
        else
          this._object = term;
        this._literalLanguage = void 0;
        token = null;
      }
      if (component === "subject")
        return token === null ? this._readPredicateOrNamedGraph : this._readPredicateOrNamedGraph(token);
      return this._completeObjectLiteralPost(token, listItem);
    }
    // Completes a literal in subject position
    _completeSubjectLiteral(token) {
      const completed = this._completeLiteral(token, "subject");
      this._subject = completed.literal;
      if (completed.readCb)
        return completed.readCb.bind(this, false);
      return this._readPredicateOrNamedGraph;
    }
    // Completes a literal in object position
    _completeObjectLiteral(token, listItem) {
      const completed = this._completeLiteral(token, "object");
      if (!completed)
        return;
      this._object = completed.literal;
      if (completed.readCb)
        return completed.readCb.bind(this, listItem);
      return this._completeObjectLiteralPost(completed.token, listItem);
    }
    _completeObjectLiteralPost(token, listItem) {
      if (listItem)
        this._emit(this._subject, this.RDF_FIRST, this._object, this._graph);
      if (token === null)
        return this._getContextEndReader();
      else {
        this._readCallback = this._getContextEndReader();
        return this._readCallback(token);
      }
    }
    // ### `_readFormulaTail` reads the end of a formula
    _readFormulaTail(token) {
      if (token.type !== "}")
        return this._readPunctuation(token);
      if (this._subject !== null)
        this._emit(this._subject, this._predicate, this._object, this._graph);
      this._restoreContext("formula", token);
      return this._object === null ? this._readPredicate : this._getContextEndReader();
    }
    // ### `_readPunctuation` reads punctuation between quads or quad parts
    _readPunctuation(token) {
      let next, graph = this._graph, startingAnnotation = false;
      const subject = this._subject, inversePredicate = this._inversePredicate;
      switch (token.type) {
        // A closing brace ends a graph
        case "}":
          if (this._graph === null)
            return this._error("Unexpected graph closing", token);
          if (this._n3Mode)
            return this._readFormulaTail(token);
          this._graph = null;
        // A dot just ends the statement, without sharing anything with the next
        case ".":
          this._subject = null;
          this._tripleTerm = null;
          next = this._contextStack.length ? this._readSubject : this._readInTopContext;
          if (inversePredicate) this._inversePredicate = false;
          break;
        // Semicolon means the subject is shared; predicate and object are different
        case ";":
          next = this._readPredicate;
          break;
        // Comma means both the subject and predicate are shared; the object is different
        case ",":
          next = this._readObject;
          break;
        // ~ is allowed in the annotation syntax
        case "~":
          next = this._readReifierInAnnotation;
          startingAnnotation = true;
          break;
        // {| means that the current triple is annotated with predicate-object pairs.
        case "{|":
          this._subject = this._readTripleTerm();
          this._validAnnotation = false;
          startingAnnotation = true;
          next = this._readPredicate;
          break;
        // |} means that the current reified triple in annotation syntax is finalized.
        case "|}":
          if (!this._annotation)
            return this._error("Unexpected annotation syntax closing", token);
          if (!this._validAnnotation)
            return this._error("Annotation block can not be empty", token);
          this._subject = null;
          this._annotation = false;
          next = this._readPunctuation;
          break;
        default:
          if (this._supportsQuads && this._graph === null && (graph = this._readEntity(token)) !== void 0) {
            next = this._readQuadPunctuation;
            break;
          }
          return this._error(`Expected punctuation to follow "${this._object.id}"`, token);
      }
      if (subject !== null && (!startingAnnotation || startingAnnotation && !this._annotation)) {
        const predicate = this._predicate, object = this._object;
        if (!inversePredicate)
          this._emit(subject, predicate, object, graph);
        else
          this._emit(object, predicate, subject, graph);
      }
      if (startingAnnotation) {
        this._annotation = true;
      }
      return next;
    }
    // ### `_readBlankNodePunctuation` reads punctuation in a blank node
    _readBlankNodePunctuation(token) {
      let next;
      switch (token.type) {
        // Semicolon means the subject is shared; predicate and object are different
        case ";":
          next = this._readPredicate;
          break;
        // Comma means both the subject and predicate are shared; the object is different
        case ",":
          next = this._readObject;
          break;
        default:
          return this._error(`Expected punctuation to follow "${this._object.id}"`, token);
      }
      this._emit(this._subject, this._predicate, this._object, this._graph);
      return next;
    }
    // ### `_readQuadPunctuation` reads punctuation after a quad
    _readQuadPunctuation(token) {
      if (token.type !== ".")
        return this._error("Expected dot to follow quad", token);
      return this._readInTopContext;
    }
    // ### `_readPrefix` reads the prefix of a prefix declaration
    _readPrefix(token) {
      if (token.type !== "prefix")
        return this._error("Expected prefix to follow @prefix", token);
      this._prefix = token.value;
      return this._readPrefixIRI;
    }
    // ### `_readPrefixIRI` reads the IRI of a prefix declaration
    _readPrefixIRI(token) {
      if (token.type !== "IRI")
        return this._error(`Expected IRI to follow prefix "${this._prefix}:"`, token);
      const prefixNode = this._readEntity(token);
      this._prefixes[this._prefix] = prefixNode.value;
      this._prefixCallback(this._prefix, prefixNode);
      return this._readDeclarationPunctuation;
    }
    // ### `_readBaseIRI` reads the IRI of a base declaration
    _readBaseIRI(token) {
      const iri = token.type === "IRI" && this._resolveIRI(token.value);
      if (!iri)
        return this._error("Expected valid IRI to follow base declaration", token);
      this._setBase(iri);
      return this._readDeclarationPunctuation;
    }
    // ### `_isValidVersion` checks if the given version is valid for this parser to handle.
    _isValidVersion(version) {
      return this._parseUnsupportedVersions || _N3Parser.SUPPORTED_VERSIONS.includes(version);
    }
    // ### `_readVersion` reads version string declaration
    _readVersion(token) {
      if (token.type !== "literal")
        return this._error("Expected literal to follow version declaration", token);
      if (token.end - token.start !== token.value.length + 2)
        return this._error("Version declarations must use single quotes", token);
      this._versionCallback(token.value);
      if (!this._isValidVersion(token.value))
        return this._error(`Detected unsupported version: "${token.value}"`, token);
      return this._readDeclarationPunctuation;
    }
    // ### `_readNamedGraphLabel` reads the label of a named graph
    _readNamedGraphLabel(token) {
      switch (token.type) {
        case "IRI":
        case "blank":
        case "prefixed":
          return this._readSubject(token), this._readGraph;
        case "[":
          return this._readNamedGraphBlankLabel;
        default:
          return this._error("Invalid graph label", token);
      }
    }
    // ### `_readNamedGraphLabel` reads a blank node label of a named graph
    _readNamedGraphBlankLabel(token) {
      if (token.type !== "]")
        return this._error("Invalid graph label", token);
      this._subject = this._factory.blankNode();
      return this._readGraph;
    }
    // ### `_readDeclarationPunctuation` reads the punctuation of a declaration
    _readDeclarationPunctuation(token) {
      if (this._sparqlStyle) {
        this._sparqlStyle = false;
        return this._readInTopContext(token);
      }
      if (token.type !== ".")
        return this._error("Expected declaration to end with a dot", token);
      return this._readInTopContext;
    }
    // Reads a list of quantified symbols from a @forSome or @forAll statement
    _readQuantifierList(token) {
      let entity;
      switch (token.type) {
        case "IRI":
        case "prefixed":
          if ((entity = this._readEntity(token, true)) !== void 0)
            break;
        default:
          return this._error(`Unexpected ${token.type}`, token);
      }
      if (!this._explicitQuantifiers)
        this._quantified[entity.id] = this._factory[this._quantifier](this._factory.blankNode().value);
      else {
        if (this._subject === null)
          this._emit(
            this._graph || this.DEFAULTGRAPH,
            this._predicate,
            this._subject = this._factory.blankNode(),
            this.QUANTIFIERS_GRAPH
          );
        else
          this._emit(
            this._subject,
            this.RDF_REST,
            this._subject = this._factory.blankNode(),
            this.QUANTIFIERS_GRAPH
          );
        this._emit(this._subject, this.RDF_FIRST, entity, this.QUANTIFIERS_GRAPH);
      }
      return this._readQuantifierPunctuation;
    }
    // Reads punctuation from a @forSome or @forAll statement
    _readQuantifierPunctuation(token) {
      if (token.type === ",")
        return this._readQuantifierList;
      else {
        if (this._explicitQuantifiers) {
          this._emit(this._subject, this.RDF_REST, this.RDF_NIL, this.QUANTIFIERS_GRAPH);
          this._subject = null;
        }
        this._readCallback = this._getContextEndReader();
        return this._readCallback(token);
      }
    }
    // ### `_getPathReader` reads a potential path and then resumes with the given function
    _getPathReader(afterPath) {
      this._afterPath = afterPath;
      return this._readPath;
    }
    // ### `_readPath` reads a potential path
    _readPath(token) {
      switch (token.type) {
        // Forward path
        case "!":
          return this._readForwardPath;
        // Backward path
        case "^":
          return this._readBackwardPath;
        // Not a path; resume reading where we left off
        default:
          const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
          if (parent && parent.type === "item") {
            const item = this._subject;
            this._restoreContext("item", token);
            this._emit(this._subject, this.RDF_FIRST, item, this._graph);
          }
          return this._afterPath(token);
      }
    }
    // ### `_readForwardPath` reads a '!' path
    _readForwardPath(token) {
      let subject, predicate;
      const object = this._factory.blankNode();
      if ((predicate = this._readEntity(token)) === void 0)
        return;
      if (this._predicate === null)
        subject = this._subject, this._subject = object;
      else
        subject = this._object, this._object = object;
      this._emit(subject, predicate, object, this._graph);
      return this._readPath;
    }
    // ### `_readBackwardPath` reads a '^' path
    _readBackwardPath(token) {
      const subject = this._factory.blankNode();
      let predicate, object;
      if ((predicate = this._readEntity(token)) === void 0)
        return;
      if (this._predicate === null)
        object = this._subject, this._subject = subject;
      else
        object = this._object, this._object = subject;
      this._emit(subject, predicate, object, this._graph);
      return this._readPath;
    }
    // ### `_readTripleTermTail` reads the end of a triple term
    _readTripleTermTail(token) {
      if (token.type !== ")>>")
        return this._error(`Expected )>> but got ${token.type}`, token);
      const quad2 = this._factory.quad(
        this._subject,
        this._predicate,
        this._object,
        this._graph || this.DEFAULTGRAPH
      );
      this._restoreContext("<<(", token);
      if (this._subject === null) {
        this._subject = quad2;
        return this._readPredicate;
      } else {
        this._object = quad2;
        return this._getContextEndReader();
      }
    }
    // ### `_readReifiedTripleTailOrReifier` reads a reifier or the end of a nested reified triple
    _readReifiedTripleTailOrReifier(token) {
      if (token.type === "~") {
        return this._readReifier;
      }
      return this._readReifiedTripleTail(token);
    }
    // ### `_readReifiedTripleTail` reads the end of a nested reified triple
    _readReifiedTripleTail(token) {
      if (token.type !== ">>")
        return this._error(`Expected >> but got ${token.type}`, token);
      this._tripleTerm = null;
      const reifier = this._readTripleTerm();
      this._restoreContext("<<", token);
      const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
      if (parent && parent.type === "list") {
        this._emit(this._subject, this.RDF_FIRST, reifier, this._graph);
        return this._getContextEndReader();
      } else if (this._subject === null) {
        this._subject = reifier;
        return this._readPredicateOrReifierTripleEnd;
      } else {
        this._object = reifier;
        return this._getContextEndReader();
      }
    }
    _readPredicateOrReifierTripleEnd(token) {
      if (token.type === ".") {
        this._subject = null;
        return this._readPunctuation(token);
      }
      return this._readPredicate(token);
    }
    // ### `_readReifier` reads the triple term identifier after a tilde when in a reifying triple.
    _readReifier(token) {
      this._reifier = this._readEntity(token);
      return this._readReifiedTripleTail;
    }
    // ### `_readReifier` reads the optional triple term identifier after a tilde when in annotation syntax.
    _readReifierInAnnotation(token) {
      if (token.type === "IRI" || token.type === "typeIRI" || token.type === "type" || token.type === "prefixed" || token.type === "blank" || token.type === "var") {
        this._reifier = this._readEntity(token);
        return this._readPunctuation;
      }
      this._readTripleTerm();
      this._subject = null;
      return this._readPunctuation(token);
    }
    _readTripleTerm() {
      const stack = this._contextStack, parent = stack.length && stack[stack.length - 1];
      const parentGraph = parent ? parent.graph : void 0;
      const reifier = this._reifier || this._factory.blankNode();
      this._reifier = null;
      this._tripleTerm = this._tripleTerm || this._factory.quad(this._subject, this._predicate, this._object);
      this._emit(reifier, this.RDF_REIFIES, this._tripleTerm, parentGraph || this.DEFAULTGRAPH);
      return reifier;
    }
    // ### `_getContextEndReader` gets the next reader function at the end of a context
    _getContextEndReader() {
      const contextStack = this._contextStack;
      if (!contextStack.length)
        return this._readPunctuation;
      switch (contextStack[contextStack.length - 1].type) {
        case "blank":
          return this._readBlankNodeTail;
        case "list":
          return this._readListItem;
        case "formula":
          return this._readFormulaTail;
        case "<<(":
          return this._readTripleTermTail;
        case "<<":
          return this._readReifiedTripleTailOrReifier;
      }
    }
    // ### `_emit` sends a quad through the callback
    _emit(subject, predicate, object, graph) {
      this._callback(null, this._factory.quad(subject, predicate, object, graph || this.DEFAULTGRAPH));
    }
    // ### `_error` emits an error message through the callback
    _error(message, token) {
      const err = new Error(`${message} on line ${token.line}.`);
      err.context = {
        token,
        line: token.line,
        previousToken: this._lexer.previousToken
      };
      this._callback(err);
      this._callback = noop;
    }
    // ### `_resolveIRI` resolves an IRI against the base path
    _resolveIRI(iri) {
      return /^[a-z][a-z0-9+.-]*:/i.test(iri) ? iri : this._resolveRelativeIRI(iri);
    }
    // ### `_resolveRelativeIRI` resolves an IRI against the base path,
    // assuming that a base path has been set and that the IRI is indeed relative
    _resolveRelativeIRI(iri) {
      if (!iri.length)
        return this._base;
      switch (iri[0]) {
        // Resolve relative fragment IRIs against the base IRI
        case "#":
          return this._base + iri;
        // Resolve relative query string IRIs by replacing the query string
        case "?":
          return this._base.replace(/(?:\?.*)?$/, iri);
        // Resolve root-relative IRIs at the root of the base IRI
        case "/":
          return (iri[1] === "/" ? this._baseScheme : this._baseRoot) + this._removeDotSegments(iri);
        // Resolve all other IRIs at the base IRI's path
        default:
          return /^[^/:]*:/.test(iri) ? null : this._removeDotSegments(this._basePath + iri);
      }
    }
    // ### `_removeDotSegments` resolves './' and '../' path segments in an IRI as per RFC3986
    _removeDotSegments(iri) {
      if (!/(^|\/)\.\.?($|[/#?])/.test(iri))
        return iri;
      const length = iri.length;
      let result = "", i = -1, pathStart = -1, segmentStart = 0, next = "/";
      while (i < length) {
        switch (next) {
          // The path starts with the first slash after the authority
          case ":":
            if (pathStart < 0) {
              if (iri[++i] === "/" && iri[++i] === "/")
                while ((pathStart = i + 1) < length && iri[pathStart] !== "/")
                  i = pathStart;
            }
            break;
          // Don't modify a query string or fragment
          case "?":
          case "#":
            i = length;
            break;
          // Handle '/.' or '/..' path segments
          case "/":
            if (iri[i + 1] === ".") {
              next = iri[++i + 1];
              switch (next) {
                // Remove a '/.' segment
                case "/":
                  result += iri.substring(segmentStart, i - 1);
                  segmentStart = i + 1;
                  break;
                // Remove a trailing '/.' segment
                case void 0:
                case "?":
                case "#":
                  return result + iri.substring(segmentStart, i) + iri.substr(i + 1);
                // Remove a '/..' segment
                case ".":
                  next = iri[++i + 1];
                  if (next === void 0 || next === "/" || next === "?" || next === "#") {
                    result += iri.substring(segmentStart, i - 2);
                    if ((segmentStart = result.lastIndexOf("/")) >= pathStart)
                      result = result.substr(0, segmentStart);
                    if (next !== "/")
                      return `${result}/${iri.substr(i + 1)}`;
                    segmentStart = i + 1;
                  }
              }
            }
        }
        next = iri[++i];
      }
      return result + iri.substring(segmentStart);
    }
    // ## Public methods
    // ### `parse` parses the N3 input and emits each parsed quad through the onQuad callback.
    parse(input, quadCallback, prefixCallback, versionCallback) {
      let onQuad, onPrefix, onComment, onVersion;
      if (quadCallback && (quadCallback.onQuad || quadCallback.onPrefix || quadCallback.onComment || quadCallback.onVersion)) {
        onQuad = quadCallback.onQuad;
        onPrefix = quadCallback.onPrefix;
        onComment = quadCallback.onComment;
        onVersion = quadCallback.onVersion;
      } else {
        onQuad = quadCallback;
        onPrefix = prefixCallback;
        onVersion = versionCallback;
      }
      this._readCallback = this._readBeforeTopContext;
      this._sparqlStyle = false;
      this._prefixes = /* @__PURE__ */ Object.create(null);
      this._prefixes._ = this._blankNodePrefix ? this._blankNodePrefix.substr(2) : `b${blankNodePrefix++}_`;
      this._prefixCallback = onPrefix || noop;
      this._versionCallback = onVersion || noop;
      this._inversePredicate = false;
      this._quantified = /* @__PURE__ */ Object.create(null);
      if (!onQuad) {
        const quads = [];
        let error3;
        this._callback = (e, t) => {
          e ? error3 = e : t && quads.push(t);
        };
        this._lexer.tokenize(input).every((token) => {
          return this._readCallback = this._readCallback(token);
        });
        if (error3) throw error3;
        return quads;
      }
      let processNextToken = (error3, token) => {
        if (error3 !== null)
          this._callback(error3), this._callback = noop;
        else if (this._readCallback)
          this._readCallback = this._readCallback(token);
      };
      if (onComment) {
        this._lexer.comments = true;
        processNextToken = (error3, token) => {
          if (error3 !== null)
            this._callback(error3), this._callback = noop;
          else if (this._readCallback) {
            if (token.type === "comment")
              onComment(token.value);
            else
              this._readCallback = this._readCallback(token);
          }
        };
      }
      this._callback = onQuad;
      this._lexer.tokenize(input, processNextToken);
    }
  };
  function noop() {
  }
  function initDataFactory(parser, factory) {
    parser._factory = factory;
    parser.DEFAULTGRAPH = factory.defaultGraph();
    parser.RDF_FIRST = factory.namedNode(IRIs_default.rdf.first);
    parser.RDF_REST = factory.namedNode(IRIs_default.rdf.rest);
    parser.RDF_NIL = factory.namedNode(IRIs_default.rdf.nil);
    parser.RDF_REIFIES = factory.namedNode(IRIs_default.rdf.reifies);
    parser.N3_FORALL = factory.namedNode(IRIs_default.r.forAll);
    parser.N3_FORSOME = factory.namedNode(IRIs_default.r.forSome);
    parser.ABBREVIATIONS = {
      "a": factory.namedNode(IRIs_default.rdf.type),
      "=": factory.namedNode(IRIs_default.owl.sameAs),
      ">": factory.namedNode(IRIs_default.log.implies),
      "<": factory.namedNode(IRIs_default.log.isImpliedBy)
    };
    parser.QUANTIFIERS_GRAPH = factory.namedNode("urn:n3:quantifiers");
  }
  N3Parser.SUPPORTED_VERSIONS = [
    "1.2",
    "1.2-basic",
    "1.1"
  ];
  initDataFactory(N3Parser.prototype, N3DataFactory_default);

  // node_modules/n3/src/N3Util.js
  function isDefaultGraph(term) {
    return !!term && term.termType === "DefaultGraph";
  }

  // node_modules/n3/src/Util.js
  function escapeRegex(regex) {
    return regex.replace(/[\]\/\(\)\*\+\?\.\\\$]/g, "\\$&");
  }

  // node_modules/n3/src/BaseIRI.js
  var BASE_UNSUPPORTED = /^:?[^:?#]*(?:[?#]|$)|^file:|^[^:]*:\/*[^?#]+?\/(?:\.\.?(?:\/|$)|\/)/i;
  var SUFFIX_SUPPORTED = /^(?:(?:[^/?#]{3,}|\.?[^/?#.]\.?)(?:\/[^/?#]{3,}|\.?[^/?#.]\.?)*\/?)?(?:[?#]|$)/;
  var CURRENT = "./";
  var PARENT = "../";
  var QUERY = "?";
  var FRAGMENT = "#";
  var BaseIRI = class _BaseIRI {
    constructor(base) {
      this.base = base;
      this._baseLength = 0;
      this._baseMatcher = null;
      this._pathReplacements = new Array(base.length + 1);
    }
    static supports(base) {
      return !BASE_UNSUPPORTED.test(base);
    }
    _getBaseMatcher() {
      if (this._baseMatcher)
        return this._baseMatcher;
      if (!_BaseIRI.supports(this.base))
        return this._baseMatcher = /.^/;
      const scheme = /^[^:]*:\/*/.exec(this.base)[0];
      const regexHead = ["^", escapeRegex(scheme)];
      const regexTail = [];
      const segments = [], segmenter = /[^/?#]*([/?#])/y;
      let segment, query = 0, fragment = 0, last = segmenter.lastIndex = scheme.length;
      while (!query && !fragment && (segment = segmenter.exec(this.base))) {
        if (segment[1] === FRAGMENT)
          fragment = segmenter.lastIndex - 1;
        else {
          regexHead.push(escapeRegex(segment[0]), "(?:");
          regexTail.push(")?");
          if (segment[1] !== QUERY)
            segments.push(last = segmenter.lastIndex);
          else {
            query = last = segmenter.lastIndex;
            fragment = this.base.indexOf(FRAGMENT, query);
            this._pathReplacements[query] = QUERY;
          }
        }
      }
      for (let i = 0; i < segments.length; i++)
        this._pathReplacements[segments[i]] = PARENT.repeat(segments.length - i - 1);
      this._pathReplacements[segments[segments.length - 1]] = CURRENT;
      this._baseLength = fragment > 0 ? fragment : this.base.length;
      regexHead.push(
        escapeRegex(this.base.substring(last, this._baseLength)),
        query ? "(?:#|$)" : "(?:[?#]|$)"
      );
      return this._baseMatcher = new RegExp([...regexHead, ...regexTail].join(""));
    }
    toRelative(iri) {
      const match = this._getBaseMatcher().exec(iri);
      if (!match)
        return iri;
      const length = match[0].length;
      if (length === this._baseLength && length === iri.length)
        return "";
      const parentPath = this._pathReplacements[length];
      if (parentPath) {
        const suffix = iri.substring(length);
        if (parentPath !== QUERY && !SUFFIX_SUPPORTED.test(suffix))
          return iri;
        if (parentPath === CURRENT && /^[^?#]/.test(suffix))
          return suffix;
        return parentPath + suffix;
      }
      return iri.substring(length - 1);
    }
  };

  // node_modules/n3/src/N3Writer.js
  var DEFAULTGRAPH2 = N3DataFactory_default.defaultGraph();
  var { rdf: rdf2, xsd: xsd3 } = IRIs_default;
  var escape = /["\\\t\n\r\b\f\u0000-\u0019\ud800-\udbff]/;
  var escapeAll = /["\\\t\n\r\b\f\u0000-\u0019]|[\ud800-\udbff][\udc00-\udfff]/g;
  var escapedCharacters = {
    "\\": "\\\\",
    '"': '\\"',
    "	": "\\t",
    "\n": "\\n",
    "\r": "\\r",
    "\b": "\\b",
    "\f": "\\f"
  };
  var SerializedTerm = class extends Term {
    // Pretty-printed nodes are not equal to any other node
    // (e.g., [] does not equal [])
    equals(other) {
      return other === this;
    }
  };
  var N3Writer = class {
    constructor(outputStream, options) {
      this._prefixRegex = /$0^/;
      if (outputStream && typeof outputStream.write !== "function")
        options = outputStream, outputStream = null;
      options = options || {};
      this._lists = options.lists;
      if (!outputStream) {
        let output = "";
        this._outputStream = {
          write(chunk, encoding, done) {
            output += chunk;
            done && done();
          },
          end: (done) => {
            done && done(null, output);
          }
        };
        this._endStream = true;
      } else {
        this._outputStream = outputStream;
        this._endStream = options.end === void 0 ? true : !!options.end;
      }
      this._subject = null;
      if (!/triple|quad/i.test(options.format)) {
        this._lineMode = false;
        this._graph = DEFAULTGRAPH2;
        this._prefixIRIs = /* @__PURE__ */ Object.create(null);
        options.prefixes && this.addPrefixes(options.prefixes);
        if (options.baseIRI) {
          this._baseIri = new BaseIRI(options.baseIRI);
        }
      } else {
        this._lineMode = true;
        this._writeQuad = this._writeQuadLine;
      }
    }
    // ## Private methods
    // ### Whether the current graph is the default graph
    get _inDefaultGraph() {
      return DEFAULTGRAPH2.equals(this._graph);
    }
    // ### `_write` writes the argument to the output stream
    _write(string, callback) {
      this._outputStream.write(string, "utf8", callback);
    }
    // ### `_writeQuad` writes the quad to the output stream
    _writeQuad(subject, predicate, object, graph, done) {
      try {
        if (!graph.equals(this._graph)) {
          this._write((this._subject === null ? "" : this._inDefaultGraph ? ".\n" : "\n}\n") + (DEFAULTGRAPH2.equals(graph) ? "" : `${this._encodeIriOrBlank(graph)} {
`));
          this._graph = graph;
          this._subject = null;
        }
        if (subject.equals(this._subject)) {
          if (predicate.equals(this._predicate))
            this._write(`, ${this._encodeObject(object)}`, done);
          else
            this._write(`;
    ${this._encodePredicate(this._predicate = predicate)} ${this._encodeObject(object)}`, done);
        } else
          this._write(`${(this._subject === null ? "" : ".\n") + this._encodeSubject(this._subject = subject)} ${this._encodePredicate(this._predicate = predicate)} ${this._encodeObject(object)}`, done);
      } catch (error3) {
        done && done(error3);
      }
    }
    // ### `_writeQuadLine` writes the quad to the output stream as a single line
    _writeQuadLine(subject, predicate, object, graph, done) {
      delete this._prefixMatch;
      this._write(this.quadToString(subject, predicate, object, graph), done);
    }
    // ### `quadToString` serializes a quad as a string
    quadToString(subject, predicate, object, graph) {
      return `${this._encodeSubject(subject)} ${this._encodeIriOrBlank(predicate)} ${this._encodeObject(object)}${graph && graph.value ? ` ${this._encodeIriOrBlank(graph)} .
` : " .\n"}`;
    }
    // ### `quadsToString` serializes an array of quads as a string
    quadsToString(quads) {
      let quadsString = "";
      for (const quad2 of quads)
        quadsString += this.quadToString(quad2.subject, quad2.predicate, quad2.object, quad2.graph);
      return quadsString;
    }
    // ### `_encodeSubject` represents a subject
    _encodeSubject(entity) {
      return entity.termType === "Quad" ? this._encodeQuad(entity) : this._encodeIriOrBlank(entity);
    }
    // ### `_encodeIriOrBlank` represents an IRI or blank node
    _encodeIriOrBlank(entity) {
      if (entity.termType !== "NamedNode") {
        if (this._lists && entity.value in this._lists)
          entity = this.list(this._lists[entity.value]);
        return "id" in entity ? entity.id : `_:${entity.value}`;
      }
      let iri = entity.value;
      if (this._baseIri) {
        iri = this._baseIri.toRelative(iri);
      }
      if (escape.test(iri))
        iri = iri.replace(escapeAll, characterReplacer);
      const prefixMatch = this._prefixRegex.exec(iri);
      return !prefixMatch ? `<${iri}>` : !prefixMatch[1] ? iri : this._prefixIRIs[prefixMatch[1]] + prefixMatch[2];
    }
    // ### `_encodeLiteral` represents a literal
    _encodeLiteral(literal2) {
      let value = literal2.value;
      if (escape.test(value))
        value = value.replace(escapeAll, characterReplacer);
      const direction = literal2.direction ? `--${literal2.direction}` : "";
      if (literal2.language)
        return `"${value}"@${literal2.language}${direction}`;
      if (this._lineMode) {
        if (literal2.datatype.value === xsd3.string)
          return `"${value}"`;
      } else {
        switch (literal2.datatype.value) {
          case xsd3.string:
            return `"${value}"`;
          case xsd3.boolean:
            if (value === "true" || value === "false")
              return value;
            break;
          case xsd3.integer:
            if (/^[+-]?\d+$/.test(value))
              return value;
            break;
          case xsd3.decimal:
            if (/^[+-]?\d*\.\d+$/.test(value))
              return value;
            break;
          case xsd3.double:
            if (/^[+-]?(?:\d+\.\d*|\.?\d+)[eE][+-]?\d+$/.test(value))
              return value;
            break;
        }
      }
      return `"${value}"^^${this._encodeIriOrBlank(literal2.datatype)}`;
    }
    // ### `_encodePredicate` represents a predicate
    _encodePredicate(predicate) {
      return predicate.value === rdf2.type ? "a" : this._encodeIriOrBlank(predicate);
    }
    // ### `_encodeObject` represents an object
    _encodeObject(object) {
      switch (object.termType) {
        case "Quad":
          return this._encodeQuad(object);
        case "Literal":
          return this._encodeLiteral(object);
        default:
          return this._encodeIriOrBlank(object);
      }
    }
    // ### `_encodeQuad` encodes an RDF-star quad
    _encodeQuad({ subject, predicate, object, graph }) {
      return `<<(${this._encodeSubject(subject)} ${this._encodePredicate(predicate)} ${this._encodeObject(object)}${isDefaultGraph(graph) ? "" : ` ${this._encodeIriOrBlank(graph)}`})>>`;
    }
    // ### `_blockedWrite` replaces `_write` after the writer has been closed
    _blockedWrite() {
      throw new Error("Cannot write because the writer has been closed.");
    }
    // ### `addQuad` adds the quad to the output stream
    addQuad(subject, predicate, object, graph, done) {
      if (object === void 0)
        this._writeQuad(subject.subject, subject.predicate, subject.object, subject.graph, predicate);
      else if (typeof graph === "function")
        this._writeQuad(subject, predicate, object, DEFAULTGRAPH2, graph);
      else
        this._writeQuad(subject, predicate, object, graph || DEFAULTGRAPH2, done);
    }
    // ### `addQuads` adds the quads to the output stream
    addQuads(quads) {
      for (let i = 0; i < quads.length; i++)
        this.addQuad(quads[i]);
    }
    // ### `addPrefix` adds the prefix to the output stream
    addPrefix(prefix, iri, done) {
      const prefixes2 = {};
      prefixes2[prefix] = iri;
      this.addPrefixes(prefixes2, done);
    }
    // ### `addPrefixes` adds the prefixes to the output stream
    addPrefixes(prefixes2, done) {
      if (!this._prefixIRIs)
        return done && done();
      let hasPrefixes = false;
      for (let prefix in prefixes2) {
        let iri = prefixes2[prefix];
        if (typeof iri !== "string")
          iri = iri.value;
        hasPrefixes = true;
        if (this._subject !== null) {
          this._write(this._inDefaultGraph ? ".\n" : "\n}\n");
          this._subject = null, this._graph = "";
        }
        this._prefixIRIs[iri] = prefix += ":";
        this._write(`@prefix ${prefix} <${iri}>.
`);
      }
      if (hasPrefixes) {
        let IRIlist = "", prefixList = "";
        for (const prefixIRI in this._prefixIRIs) {
          IRIlist += IRIlist ? `|${prefixIRI}` : prefixIRI;
          prefixList += (prefixList ? "|" : "") + this._prefixIRIs[prefixIRI];
        }
        IRIlist = escapeRegex(IRIlist, /[\]\/\(\)\*\+\?\.\\\$]/g, "\\$&");
        this._prefixRegex = new RegExp(`^(?:${prefixList})[^/]*$|^(${IRIlist})([_a-zA-Z0-9][\\-_a-zA-Z0-9]*)$`);
      }
      this._write(hasPrefixes ? "\n" : "", done);
    }
    // ### `blank` creates a blank node with the given content
    blank(predicate, object) {
      let children = predicate, child, length;
      if (predicate === void 0)
        children = [];
      else if (predicate.termType)
        children = [{ predicate, object }];
      else if (!("length" in predicate))
        children = [predicate];
      switch (length = children.length) {
        // Generate an empty blank node
        case 0:
          return new SerializedTerm("[]");
        // Generate a non-nested one-triple blank node
        case 1:
          child = children[0];
          if (!(child.object instanceof SerializedTerm))
            return new SerializedTerm(`[ ${this._encodePredicate(child.predicate)} ${this._encodeObject(child.object)} ]`);
        // Generate a multi-triple or nested blank node
        default:
          let contents = "[";
          for (let i = 0; i < length; i++) {
            child = children[i];
            if (child.predicate.equals(predicate))
              contents += `, ${this._encodeObject(child.object)}`;
            else {
              contents += `${(i ? ";\n  " : "\n  ") + this._encodePredicate(child.predicate)} ${this._encodeObject(child.object)}`;
              predicate = child.predicate;
            }
          }
          return new SerializedTerm(`${contents}
]`);
      }
    }
    // ### `list` creates a list node with the given content
    list(elements) {
      const length = elements && elements.length || 0, contents = new Array(length);
      for (let i = 0; i < length; i++)
        contents[i] = this._encodeObject(elements[i]);
      return new SerializedTerm(`(${contents.join(" ")})`);
    }
    // ### `end` signals the end of the output stream
    end(done) {
      if (this._subject !== null) {
        this._write(this._inDefaultGraph ? ".\n" : "\n}\n");
        this._subject = null;
      }
      this._write = this._blockedWrite;
      let singleDone = done && ((error3, result) => {
        singleDone = null, done(error3, result);
      });
      if (this._endStream) {
        try {
          return this._outputStream.end(singleDone);
        } catch (error3) {
        }
      }
      singleDone && singleDone();
    }
  };
  function characterReplacer(character) {
    let result = escapedCharacters[character];
    if (result === void 0) {
      if (character.length === 1) {
        result = character.charCodeAt(0).toString(16);
        result = "\\u0000".substr(0, 6 - result.length) + result;
      } else {
        result = ((character.charCodeAt(0) - 55296) * 1024 + character.charCodeAt(1) + 9216).toString(16);
        result = "\\U00000000".substr(0, 10 - result.length) + result;
      }
    }
    return result;
  }

  // node_modules/@muze-nl/oldm-n3/src/oldm-n3.mjs
  var n3Parser = (input, uri, type) => {
    const parser = new N3Parser({
      baseIRI: uri,
      blankNodePrefix: "",
      format: type
    });
    let prefixes2 = /* @__PURE__ */ Object.create(null);
    const quads = parser.parse(input, null, (prefix, url2) => {
      prefixes2[prefix] = url2.id;
    });
    return { quads, prefixes: prefixes2 };
  };
  var n3Writer = (source) => {
    return new Promise((resolve, reject) => {
      const writer = new N3Writer({
        format: source.mimetype,
        prefixes: { ...source.prefixes }
      });
      const xsd4 = source.prefixes.xsd;
      const { quad: quad2, namedNode: namedNode2, literal: literal2, blankNode: blankNode2 } = N3DataFactory_default;
      const writeClassNames = (id, subject) => {
        let classNames = subject.a;
        if (!classNames) {
          return;
        }
        if (!Array.isArray(classNames)) {
          classNames = [classNames];
        }
        if (classNames?.length) {
          for (let name of classNames) {
            name = source.fullURI(name);
            writer.addQuad(quad2(
              namedNode2(id),
              namedNode2(rdfType),
              namedNode2(name)
            ));
          }
        }
      };
      const writeProperties = (id, subject) => {
        if (!subject) {
          return;
        }
        let preds = getPredicates(subject);
        for (let pred of preds) {
          if (pred.predicate.id == "id" || pred.predicate.id == "a") {
            continue;
          }
          if (!Array.isArray(pred.object)) {
            pred.object = [pred.object];
          }
          for (let o of pred.object) {
            writer.addQuad(quad2(
              namedNode2(id),
              pred.predicate,
              o
            ));
          }
        }
      };
      const getPredicates = (object) => {
        let preds = [];
        Object.entries(object).forEach((entry) => {
          const predicate = entry[0];
          let object2 = entry[1];
          const fullPred = source.fullURI(predicate);
          let pred = {
            predicate: namedNode2(fullPred)
          };
          if (object2 instanceof Collection) {
            pred.object = getCollection(object2);
          } else if (Array.isArray(object2)) {
            pred.object = getArray(object2);
          } else if (object2 instanceof NamedNode) {
            pred.object = namedNode2(object2.id);
          } else if (object2 instanceof BlankNode) {
            pred.object = getBlankNode(object2);
          } else if (isLiteral2(object2)) {
            pred.object = getLiteral(object2);
          } else {
            console.log("oldm-ns: encountered unknown object", object2, predicate);
          }
          preds.push(pred);
        });
        return preds;
      };
      const getLiteral = (object) => {
        let type = source.getType(object) || void 0;
        if (type) {
          if (type == xsd4 + source.context.separator + "string" || type == xsd4 + source.context.separator + "number") {
            type = void 0;
          } else {
            type = source.fullURI(type);
          }
          type = namedNode2(type);
        } else {
          let language = object?.language;
          if (language) {
            type = language;
          }
        }
        if (object instanceof String) {
          object = "" + object;
        } else if (object instanceof Number) {
          object = +object;
        }
        return literal2(object, type);
      };
      const isLiteral2 = (value) => {
        return value instanceof String || value instanceof Number || typeof value == "boolean" || typeof value == "string" || typeof value == "number";
      };
      const getCollection = (object) => {
        let list = [];
        for (let value of object) {
          if (isLiteral2(value)) {
            list.push(getLiteral(value));
          } else if (value.id) {
            list.push(namedNode2(value.id));
          } else {
            list.push(getBlankNode(value));
          }
        }
        return writer.list(list);
      };
      const getBlankNode = (object) => {
        return writer.blank(getPredicates(object));
      };
      const getArray = (object) => {
        let list = [];
        for (const o of object) {
          if (isLiteral2(o)) {
            list.push(getLiteral(o));
          } else if (o instanceof NamedNode) {
            list.push(namedNode2(o.id));
          } else if (o instanceof BlankNode) {
            list.push(getBlankNode(o));
          } else if (o instanceof Collection) {
            list.push(getCollection(o));
          }
        }
        return list;
      };
      Object.entries(source.subjects).forEach(([id, subject]) => {
        id = source.shortURI(id, ":");
        writeClassNames(id, subject);
        writeProperties(id, subject);
      });
      writer.end((error3, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error3);
        }
      });
    });
  };

  // node_modules/@muze-nl/oldm/src/index.mjs
  var { default: _coreDefault, ...core } = oldm_exports;
  var oldm3 = {
    context(options = {}) {
      const {
        parser = n3Parser,
        writer = n3Writer,
        ...contextOptions
      } = options;
      return oldm2({
        ...contextOptions,
        parser,
        writer
      });
    },
    ...core,
    ...oldm_n3_exports
  };
  globalThis.oldm = oldm3;
  var src_default = oldm3;

  // node_modules/@muze-nl/jaqt/src/jaqt.mjs
  function isPrimitiveWrapper(data) {
    return [String, Boolean, Number, BigInt].includes(data?.constructor);
  }
  function getSelectFn(filter) {
    let fns = [];
    if (filter instanceof Function) {
      fns.push(filter);
    } else for (const [filterKey, filterValue] of Object.entries(filter)) {
      if (filterValue instanceof Function) {
        fns.push((data) => {
          if (filterKey == "_") {
            return filterValue(data, filterKey, "select");
          } else {
            return {
              [filterKey]: filterValue(data, filterKey, "select")
            };
          }
        });
      } else if (!isPrimitiveWrapper(filterValue)) {
        fns.push((data) => {
          if (filterKey == "_") {
            return from(data[filterKey]).select(filterValue);
          } else {
            return {
              [filterKey]: from(data[filterKey]).select(filterValue)
            };
          }
        });
      } else {
        fns.push(() => {
          if (filterKey == "_") {
            return filterValue;
          } else {
            return {
              [filterKey]: filterValue
            };
          }
        });
      }
    }
    if (fns.length == 1) {
      return fns[0];
    }
    return (data) => {
      let result = {};
      for (let fn of fns) {
        Object.assign(result, fn(data));
      }
      return result;
    };
  }
  function getMatchFn(pattern) {
    let fns = [];
    if (Array.isArray(pattern)) {
      fns.push(anyOf2(...pattern));
    } else if (pattern instanceof RegExp) {
      fns.push((data) => pattern.test(data));
    } else if (pattern instanceof Function) {
      fns.push((data) => pattern(data));
    } else if (!isPrimitiveWrapper(pattern)) {
      let patternMatches = {};
      for (const [wKey, wVal] of Object.entries(pattern)) {
        patternMatches[wKey] = getMatchFn(wVal);
      }
      let matchFn = (data) => {
        if (Array.isArray(data)) {
          return data.filter((element) => matchFn(element)).length > 0;
        }
        if (isPrimitiveWrapper(data)) {
          return false;
        }
        for (let wKey in patternMatches) {
          let patternMatchFn = patternMatches[wKey];
          if (!patternMatchFn(data?.[wKey])) {
            return false;
          }
        }
        return true;
      };
      fns.push(matchFn);
    } else {
      fns.push((data) => {
        if (Array.isArray(data)) {
          return data.filter((element) => pattern == element).length > 0;
        } else {
          return pattern == data;
        }
      });
    }
    if (fns.length == 1) {
      return fns[0];
    }
    return (data) => {
      for (let fn of fns) {
        if (!fn(data)) {
          return false;
        }
      }
      return true;
    };
  }
  var asc = Symbol("asc");
  var desc = Symbol("desc");
  function getSortFn(pattern) {
    let comparisons = Object.entries(pattern);
    let fns = [];
    for (let [key, compare] of comparisons) {
      if (compare instanceof Function) {
        fns.push(compare);
      } else if (compare === asc) {
        fns.push((a, b) => a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0);
      } else if (compare === desc) {
        fns.push((a, b) => a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0);
      } else if (!isPrimitiveWrapper(compare)) {
        let subFn = getSortFn(compare);
        fns.push((a, b) => subFn(a[key], b[key]));
      } else {
        throw new Error("Unknown sort order", compare);
      }
    }
    if (fns.length == 1) {
      return fns[0];
    }
    return (a, b) => {
      for (let fn of fns) {
        let result = fn(a, b);
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    };
  }
  function getAggregateFn(filter) {
    let fns = [];
    if (filter instanceof Function) {
      fns.push(filter);
    } else for (const [filterKey, filterValue] of Object.entries(filter)) {
      if (filterValue instanceof Function) {
        fns.push((a, o, i, l) => {
          if (isPrimitiveWrapper(a)) {
            a = {};
          }
          if (o.reduce) {
            a[filterKey] = o.reduce(filterValue, a[filterKey] || []);
          } else {
            a[filterKey] = filterValue(a[filterKey] || [], o, i, l);
          }
          return a;
        });
      } else if (!isPrimitiveWrapper(filterValue)) {
        fns.push((a, o) => {
          if (isPrimitiveWrapper(a)) {
            a = {};
          }
          a[filterKey] = from(o[filterKey]).reduce(filterValue, []);
          return a;
        });
      } else {
        fns.push((a) => {
          if (isPrimitiveWrapper(a)) {
            a = {};
          }
          a[filterKey] = filterValue;
          return a;
        });
      }
    }
    if (fns.length == 1) {
      return fns[0];
    }
    return (a, o, i, l) => {
      let result = {};
      for (let fn of fns) {
        Object.assign(result, fn(a, o, i, l));
      }
      return result;
    };
  }
  function getMatchingGroups(data, pointerFn) {
    let result = {};
    for (let entity of data) {
      let groups = pointerFn(entity);
      if (!Array.isArray(groups)) {
        groups = [groups];
      }
      for (let group of groups) {
        if (typeof group != "string" && !(group instanceof String)) {
          console.warn("JAQT: groupBy(selector) can only handle string values, got:", group);
          continue;
        }
        if (!result[group]) {
          result[group] = [];
        }
        result[group].push(entity);
      }
    }
    return result;
  }
  function groupBy(data, pointerFunctions) {
    let pointerFn = pointerFunctions.shift();
    if (typeof pointerFn == "string") {
      pointerFn = _[pointerFn];
    }
    if (typeof pointerFn != "function") {
      throw new Error("groupBy parameters must be either a property name or a pointer function (e.g.: _.name)");
    }
    let groups = getMatchingGroups(data, pointerFn);
    if (pointerFunctions.length) {
      for (let group in groups) {
        groups[group] = groupBy(groups[group], pointerFunctions);
      }
    }
    return groups;
  }
  function anyOf2(...patterns) {
    let matchFns = patterns.map((pattern) => getMatchFn(pattern));
    return (data) => matchFns.some((fn) => fn(data));
  }
  var FunctionProxyHandler = {
    apply(target, thisArg, argumentsList) {
      let result = target.apply(thisArg, argumentsList);
      if (typeof result === "object") {
        return new Proxy(result, DataProxyHandler);
      }
      return result;
    }
  };
  var DataProxyHandler = {
    get(target, property) {
      let result = null;
      if (typeof property === "symbol") {
        result = target[property];
      }
      if (Array.isArray(target)) {
        switch (property) {
          case "where":
            result = function(shape) {
              let matchFn = getMatchFn(shape);
              return new Proxy(
                target.filter((element) => matchFn(element)),
                DataProxyHandler
              );
            };
            break;
          case "select":
            result = function(filter) {
              let selectFn = getSelectFn(filter);
              return new Proxy(
                target.map(selectFn),
                DataProxyHandler
              );
            };
            break;
          case "reduce":
            result = function(pattern, initial = []) {
              let aggregateFn = getAggregateFn(pattern);
              let temp = target.reduce(aggregateFn, initial);
              if (Array.isArray(temp)) {
                return new Proxy(temp, DataProxyHandler);
              } else if (!isPrimitiveWrapper(temp)) {
                return new Proxy(temp, GroupByProxyHandler);
              } else {
                return temp;
              }
            };
            break;
          case "orderBy":
            result = function(pattern) {
              let sortFn = getSortFn(pattern);
              return new Proxy(
                target.toSorted(sortFn),
                DataProxyHandler
              );
            };
            break;
          case "groupBy":
            result = function(...groups) {
              let temp = groupBy(target, groups);
              return new Proxy(
                temp,
                GroupByProxyHandler
              );
            };
            break;
        }
      }
      if (!result && target && typeof target === "object") {
        if (property === "select") {
          result = function(filter) {
            let selector = getSelectFn(filter);
            return new Proxy(selector(target), DataProxyHandler);
          };
        }
      }
      if (!result && target && typeof target[property] === "function") {
        result = new Proxy(target[property], FunctionProxyHandler);
      }
      if (!result) {
        result = target[property];
      }
      return result;
    }
  };
  var GroupByProxyHandler = {
    get(target, property) {
      let result = null;
      switch (property) {
        case "select":
          result = function(filter) {
            let selectFn = getSelectFn(filter);
            let result2 = {};
            for (let group in target) {
              if (Array.isArray(target[group])) {
                result2[group] = new Proxy(target[group].map(selectFn), DataProxyHandler);
              } else {
                result2[group] = new Proxy(target[group], GroupByProxyHandler);
              }
            }
            return result2;
          };
          break;
        case "reduce":
          result = function(pattern, initial = []) {
            let aggregateFn = getAggregateFn(pattern);
            let result2 = {};
            for (let group in target) {
              if (Array.isArray(target[group])) {
                let temp = target[group].reduce(aggregateFn, initial);
                if (Array.isArray(temp)) {
                  result2[group] = new Proxy(temp, DataProxyHandler);
                } else if (!isPrimitiveWrapper(temp)) {
                  result2[group] = new Proxy(temp, GroupByProxyHandler);
                } else {
                  result2[group] = temp;
                }
              } else {
                result2[group] = new Proxy(target[group], GroupByProxyHandler);
              }
            }
            return result2;
          };
          break;
        default:
          if (Array.isArray(target[property])) {
            result = from(target[property]);
          } else {
            result = target[property];
          }
          break;
      }
      return result;
    }
  };
  var EmptyHandler = {
    get(target, property) {
      let result = null;
      switch (property) {
        case "where":
          result = function() {
            return new Proxy(new Null(), EmptyHandler);
          };
          break;
        case "reduce":
        case "select":
          result = function() {
            return null;
          };
          break;
        case "orderBy":
          result = function() {
            return new Proxy(new Null(), EmptyHandler);
          };
          break;
        case "groupBy":
          result = function() {
            return new Proxy(new Null(), EmptyHandler);
          };
          break;
      }
      if (!result && typeof target?.[property] == "function") {
        result = target[property];
      }
      return result;
    }
  };
  var Null = class {
    toJSON() {
      return null;
    }
  };
  function from(data) {
    if (!data || typeof data !== "object") {
      return new Proxy(new Null(), EmptyHandler);
    }
    return new Proxy(data, DataProxyHandler);
  }
  function getPointerFn(path) {
    return (data, key) => {
      if (path?.length > 0) {
        let localPath = path.slice();
        let prop = localPath.shift();
        while (prop) {
          if (Array.isArray(data) && parseInt(prop) != prop) {
            localPath.unshift(prop);
            return data.map(getPointerFn(localPath));
          } else if (typeof data?.[prop] != "undefined") {
            data = data[prop];
          } else {
            data = null;
          }
          prop = localPath.shift();
        }
        return data;
      } else if (key && key !== "_") {
        if (typeof data?.[key] != "undefined") {
          return data[key];
        } else {
          return null;
        }
      } else {
        return data;
      }
    };
  }
  var pointerHandler = (path) => {
    if (!path) {
      path = [];
    }
    return {
      get(target, property) {
        if (property == "constructor" || typeof property == "symbol") {
          return target[property];
        }
        let newpath = path.concat([property]);
        return new Proxy(getPointerFn(newpath), pointerHandler(newpath));
      },
      apply(target, thisArg, argumentsList) {
        let result = target(...argumentsList);
        if (Array.isArray(result)) {
          result = result.flat(Infinity);
        }
        return result;
      }
    };
  };
  var _ = new Proxy(getPointerFn(), pointerHandler());

  // node_modules/@muze-nl/metro-oldm/src/oldmmw.mjs
  function oldmmw2(options) {
    options = Object.assign({
      contentType: "text/turtle",
      prefixes: {
        "ldp": "http://www.w3.org/ns/ldp#",
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "dct": "http://purl.org/dc/terms/",
        "stat": "http://www.w3.org/ns/posix/stat#",
        "turtle": "http://www.w3.org/ns/iana/media-types/text/turtle#",
        "schem": "https://schema.org/",
        "solid": "http://www.w3.org/ns/solid/terms#",
        "acl": "http://www.w3.org/ns/auth/acl#",
        "pims": "http://www.w3.org/ns/pim/space#",
        "vcard": "http://www.w3.org/2006/vcard/ns#",
        "foaf": "http://xmlns.com/foaf/0.1/"
      },
      parser: src_default.n3Parser,
      writer: src_default.n3Writer
    }, options);
    if (!options.prefixes["ldp"]) {
      options.prefixes["ldp"] = "http://www.w3.org/ns/ldp#";
    }
    const context = src_default.context(options);
    return async function oldmmw3(req, next) {
      if (!req.headers.get("Accept")) {
        req = req.with({
          headers: {
            "Accept": options.accept ?? options.contentType
          }
        });
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        if (req.data && typeof req.data == "object" && !(req.data instanceof ReadableStream)) {
          const contentType = req.headers.get("Content-Type");
          if (!contentType || isPlainText2(contentType)) {
            req = req.with({
              headers: {
                "Content-Type": options.contentType
              }
            });
          }
          if (isLinkedData(req.headers.get("Content-Type"))) {
            req = req.with({
              body: await context.writer(req.data)
            });
          }
        }
      }
      let res = await next(req);
      if (res && isLinkedData(res.headers?.get("Content-Type"))) {
        let tempRes = res.clone();
        let body = await tempRes.text();
        try {
          let ld = context.parse(body, req.url, res.headers.get("Content-Type"));
          return res.with({
            body: ld
          });
        } catch (e) {
        }
      }
      return res;
    };
  }
  var mimetypes = [
    /^text\/turtle\b/,
    /^application\/n-quads\b/,
    /^text\/x-nquads\b/,
    /^appliction\/n-triples\b/,
    /^application\/trig\b/
  ];
  function isLinkedData(contentType) {
    for (const re of mimetypes) {
      if (re.exec(contentType)) {
        return true;
      }
    }
    return false;
  }
  function isPlainText2(contentType) {
    return /^text\/plain\b/.exec(contentType);
  }

  // node_modules/@muze-nl/metro-oldm/src/index.mjs
  var src_default2 = oldmmw2;

  // src/SolidAdapter.js
  var SolidAdapter = class extends HttpAdapter {
    #client;
    #path;
    constructor(metroClient, path = "/", solidConfiguration = {}) {
      metroClient = client(metroClient).with(browser_default2.oidcmw(solidConfiguration)).with(src_default2(solidConfiguration));
      path = Path.collapse(path);
      super(metroClient, path);
      this.#client = metroClient;
      this.#path = path;
    }
    get name() {
      return "SolidAdapter";
    }
    supportsDirectories() {
      return true;
    }
    async read(path) {
      let response2 = await this.#client.get(Path.collapse(path, this.#path));
      let result = {
        type: this.getMimetype(response2),
        name: Path.filename(path),
        http: {
          headers: response2.headers,
          status: response2.status,
          url: response2.url
        }
      };
      if (response2.data) {
        result.data = response2.data;
      }
      if (result.type.match(/text\/.*/)) {
        result.contents = await response2.text();
      } else if (result.type.match(/application\/json.*/)) {
        result.contents = await response2.json();
      } else {
        result.contents = await response2.blob();
      }
      return result;
    }
    async list(path) {
      let result = await this.read(path);
      if (result.data) {
        if (!result.data.primary?.ldp$contains) {
          throw new Error(path + " could not find ldp container", { cause: result });
        }
        return from(result.data.primary.ldp$contains).where({
          a: "ldp$Resource"
        }).select({
          filename: (o) => jsfs.path.filename(metro.url(o.id).pathname),
          path: (o) => metro.url(o.id).pathname,
          type: (o) => o.a.includes("ldp$Container") ? "folder" : "file"
        });
      } else {
        throw new Error(path + " could not be parsed", { cause: result });
      }
    }
    async mkdir(path) {
      this.#client.put(Path.collapse(path, this.#path));
    }
    async rmdir(path) {
      this.#client.delete(Path.collapse(path, this.#path));
    }
  };

  // src/SolidClient.js
  async function solidClient(webid, options) {
    const response2 = await metro.client(oldmmw(options), metro.mw.getdata()).get(webid);
    const profile = response2?.primary;
    if (!profile || !profile.solid$oidcIssuer) {
      throw new Error("solidClient: " + webid + " did not return valid solid profile");
    }
    if (!options.issuer) {
      options.issuer = oldm.one(profile.solid$oidcIssuer)?.id;
    }
    const storage = oldm.many(profile.space$storage).map((s) => new jsfs.fs(new SolidAdapter(s.id, "/", options)));
    return metro.api(
      metro.client(metro.oidc.oidcmw(options), oldmmw(options)),
      {
        profile,
        issuer: oldm.one(profile.solid$oidcIssuer)?.id,
        inbox: oldm.one(profile.ldp$inbox)?.id,
        id: function() {
          return metro.oidc.idToken(this.issuer);
        },
        logout: async function() {
          throw new Error("not yet implemented");
        },
        storage
      }
    );
  }

  // src/browser.js
  var browser_default3 = {
    adapter: SolidAdapter,
    client: solidClient
  };
  globalThis.solidClient = solidClient;
  globalThis.SolidAdapter = SolidAdapter;
})();
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
//# sourceMappingURL=browser.js.map
