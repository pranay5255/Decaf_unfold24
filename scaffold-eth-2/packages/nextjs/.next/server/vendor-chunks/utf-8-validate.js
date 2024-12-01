"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/utf-8-validate";
exports.ids = ["vendor-chunks/utf-8-validate"];
exports.modules = {

/***/ "(ssr)/./node_modules/utf-8-validate/fallback.js":
/*!*************************************************!*\
  !*** ./node_modules/utf-8-validate/fallback.js ***!
  \*************************************************/
/***/ ((module) => {

eval("\n\n/**\n * Checks if a given buffer contains only correct UTF-8.\n * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by\n * Markus Kuhn.\n *\n * @param {Buffer} buf The buffer to check\n * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`\n * @public\n */\nfunction isValidUTF8(buf) {\n  const len = buf.length;\n  let i = 0;\n\n  while (i < len) {\n    if ((buf[i] & 0x80) === 0x00) {  // 0xxxxxxx\n      i++;\n    } else if ((buf[i] & 0xe0) === 0xc0) {  // 110xxxxx 10xxxxxx\n      if (\n        i + 1 === len ||\n        (buf[i + 1] & 0xc0) !== 0x80 ||\n        (buf[i] & 0xfe) === 0xc0  // overlong\n      ) {\n        return false;\n      }\n\n      i += 2;\n    } else if ((buf[i] & 0xf0) === 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx\n      if (\n        i + 2 >= len ||\n        (buf[i + 1] & 0xc0) !== 0x80 ||\n        (buf[i + 2] & 0xc0) !== 0x80 ||\n        buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 ||  // overlong\n        buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0  // surrogate (U+D800 - U+DFFF)\n      ) {\n        return false;\n      }\n\n      i += 3;\n    } else if ((buf[i] & 0xf8) === 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx\n      if (\n        i + 3 >= len ||\n        (buf[i + 1] & 0xc0) !== 0x80 ||\n        (buf[i + 2] & 0xc0) !== 0x80 ||\n        (buf[i + 3] & 0xc0) !== 0x80 ||\n        buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 ||  // overlong\n        buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4  // > U+10FFFF\n      ) {\n        return false;\n      }\n\n      i += 4;\n    } else {\n      return false;\n    }\n  }\n\n  return true;\n}\n\nmodule.exports = isValidUTF8;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdXRmLTgtdmFsaWRhdGUvZmFsbGJhY2suanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQixZQUFZLFNBQVM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLE1BQU0sc0NBQXNDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxzQ0FBc0M7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTSxzQ0FBc0M7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac2UtMi9uZXh0anMvLi9ub2RlX21vZHVsZXMvdXRmLTgtdmFsaWRhdGUvZmFsbGJhY2suanM/MWY2NiJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgZ2l2ZW4gYnVmZmVyIGNvbnRhaW5zIG9ubHkgY29ycmVjdCBVVEYtOC5cbiAqIFBvcnRlZCBmcm9tIGh0dHBzOi8vd3d3LmNsLmNhbS5hYy51ay8lN0VtZ2syNS91Y3MvdXRmOF9jaGVjay5jIGJ5XG4gKiBNYXJrdXMgS3Vobi5cbiAqXG4gKiBAcGFyYW0ge0J1ZmZlcn0gYnVmIFRoZSBidWZmZXIgdG8gY2hlY2tcbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgYnVmYCBjb250YWlucyBvbmx5IGNvcnJlY3QgVVRGLTgsIGVsc2UgYGZhbHNlYFxuICogQHB1YmxpY1xuICovXG5mdW5jdGlvbiBpc1ZhbGlkVVRGOChidWYpIHtcbiAgY29uc3QgbGVuID0gYnVmLmxlbmd0aDtcbiAgbGV0IGkgPSAwO1xuXG4gIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgaWYgKChidWZbaV0gJiAweDgwKSA9PT0gMHgwMCkgeyAgLy8gMHh4eHh4eHhcbiAgICAgIGkrKztcbiAgICB9IGVsc2UgaWYgKChidWZbaV0gJiAweGUwKSA9PT0gMHhjMCkgeyAgLy8gMTEweHh4eHggMTB4eHh4eHhcbiAgICAgIGlmIChcbiAgICAgICAgaSArIDEgPT09IGxlbiB8fFxuICAgICAgICAoYnVmW2kgKyAxXSAmIDB4YzApICE9PSAweDgwIHx8XG4gICAgICAgIChidWZbaV0gJiAweGZlKSA9PT0gMHhjMCAgLy8gb3ZlcmxvbmdcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGkgKz0gMjtcbiAgICB9IGVsc2UgaWYgKChidWZbaV0gJiAweGYwKSA9PT0gMHhlMCkgeyAgLy8gMTExMHh4eHggMTB4eHh4eHggMTB4eHh4eHhcbiAgICAgIGlmIChcbiAgICAgICAgaSArIDIgPj0gbGVuIHx8XG4gICAgICAgIChidWZbaSArIDFdICYgMHhjMCkgIT09IDB4ODAgfHxcbiAgICAgICAgKGJ1ZltpICsgMl0gJiAweGMwKSAhPT0gMHg4MCB8fFxuICAgICAgICBidWZbaV0gPT09IDB4ZTAgJiYgKGJ1ZltpICsgMV0gJiAweGUwKSA9PT0gMHg4MCB8fCAgLy8gb3ZlcmxvbmdcbiAgICAgICAgYnVmW2ldID09PSAweGVkICYmIChidWZbaSArIDFdICYgMHhlMCkgPT09IDB4YTAgIC8vIHN1cnJvZ2F0ZSAoVStEODAwIC0gVStERkZGKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaSArPSAzO1xuICAgIH0gZWxzZSBpZiAoKGJ1ZltpXSAmIDB4ZjgpID09PSAweGYwKSB7ICAvLyAxMTExMHh4eCAxMHh4eHh4eCAxMHh4eHh4eCAxMHh4eHh4eFxuICAgICAgaWYgKFxuICAgICAgICBpICsgMyA+PSBsZW4gfHxcbiAgICAgICAgKGJ1ZltpICsgMV0gJiAweGMwKSAhPT0gMHg4MCB8fFxuICAgICAgICAoYnVmW2kgKyAyXSAmIDB4YzApICE9PSAweDgwIHx8XG4gICAgICAgIChidWZbaSArIDNdICYgMHhjMCkgIT09IDB4ODAgfHxcbiAgICAgICAgYnVmW2ldID09PSAweGYwICYmIChidWZbaSArIDFdICYgMHhmMCkgPT09IDB4ODAgfHwgIC8vIG92ZXJsb25nXG4gICAgICAgIGJ1ZltpXSA9PT0gMHhmNCAmJiBidWZbaSArIDFdID4gMHg4ZiB8fCBidWZbaV0gPiAweGY0ICAvLyA+IFUrMTBGRkZGXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBpICs9IDQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1ZhbGlkVVRGODtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/utf-8-validate/fallback.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/utf-8-validate/index.js":
/*!**********************************************!*\
  !*** ./node_modules/utf-8-validate/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\ntry {\n  module.exports = __webpack_require__(/*! node-gyp-build */ \"(ssr)/./node_modules/node-gyp-build/index.js\")(__dirname);\n} catch (e) {\n  module.exports = __webpack_require__(/*! ./fallback */ \"(ssr)/./node_modules/utf-8-validate/fallback.js\");\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvdXRmLTgtdmFsaWRhdGUvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWI7QUFDQSxtQkFBbUIsbUJBQU8sQ0FBQyxvRUFBZ0I7QUFDM0MsRUFBRTtBQUNGLEVBQUUseUdBQXNDO0FBQ3hDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQHNlLTIvbmV4dGpzLy4vbm9kZV9tb2R1bGVzL3V0Zi04LXZhbGlkYXRlL2luZGV4LmpzP2VmMjkiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG50cnkge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ25vZGUtZ3lwLWJ1aWxkJykoX19kaXJuYW1lKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2ZhbGxiYWNrJyk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/utf-8-validate/index.js\n");

/***/ })

};
;