"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@metamask";
exports.ids = ["vendor-chunks/@metamask"];
exports.modules = {

/***/ "(ssr)/./node_modules/@metamask/safe-event-emitter/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@metamask/safe-event-emitter/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst events_1 = __webpack_require__(/*! events */ \"events\");\nfunction safeApply(handler, context, args) {\n    try {\n        Reflect.apply(handler, context, args);\n    }\n    catch (err) {\n        // Throw error after timeout so as not to interrupt the stack\n        setTimeout(() => {\n            throw err;\n        });\n    }\n}\nfunction arrayClone(arr) {\n    const n = arr.length;\n    const copy = new Array(n);\n    for (let i = 0; i < n; i += 1) {\n        copy[i] = arr[i];\n    }\n    return copy;\n}\nclass SafeEventEmitter extends events_1.EventEmitter {\n    emit(type, ...args) {\n        let doError = type === 'error';\n        const events = this._events;\n        if (events !== undefined) {\n            doError = doError && events.error === undefined;\n        }\n        else if (!doError) {\n            return false;\n        }\n        // If there is no 'error' event listener then throw.\n        if (doError) {\n            let er;\n            if (args.length > 0) {\n                [er] = args;\n            }\n            if (er instanceof Error) {\n                // Note: The comments on the `throw` lines are intentional, they show\n                // up in Node's output if this results in an unhandled exception.\n                throw er; // Unhandled 'error' event\n            }\n            // At least give some kind of context to the user\n            const err = new Error(`Unhandled error.${er ? ` (${er.message})` : ''}`);\n            err.context = er;\n            throw err; // Unhandled 'error' event\n        }\n        const handler = events[type];\n        if (handler === undefined) {\n            return false;\n        }\n        if (typeof handler === 'function') {\n            safeApply(handler, this, args);\n        }\n        else {\n            const len = handler.length;\n            const listeners = arrayClone(handler);\n            for (let i = 0; i < len; i += 1) {\n                safeApply(listeners[i], this, args);\n            }\n        }\n        return true;\n    }\n}\nexports[\"default\"] = SafeEventEmitter;\n//# sourceMappingURL=index.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvQG1ldGFtYXNrL3NhZmUtZXZlbnQtZW1pdHRlci9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQkFBaUIsbUJBQU8sQ0FBQyxzQkFBUTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQSxxREFBcUQsVUFBVSxXQUFXLFFBQVE7QUFDbEY7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixTQUFTO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFlO0FBQ2YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac2UtMi9uZXh0anMvLi9ub2RlX21vZHVsZXMvQG1ldGFtYXNrL3NhZmUtZXZlbnQtZW1pdHRlci9pbmRleC5qcz9iMDEwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuZnVuY3Rpb24gc2FmZUFwcGx5KGhhbmRsZXIsIGNvbnRleHQsIGFyZ3MpIHtcbiAgICB0cnkge1xuICAgICAgICBSZWZsZWN0LmFwcGx5KGhhbmRsZXIsIGNvbnRleHQsIGFyZ3MpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIC8vIFRocm93IGVycm9yIGFmdGVyIHRpbWVvdXQgc28gYXMgbm90IHRvIGludGVycnVwdCB0aGUgc3RhY2tcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyKSB7XG4gICAgY29uc3QgbiA9IGFyci5sZW5ndGg7XG4gICAgY29uc3QgY29weSA9IG5ldyBBcnJheShuKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgICAgICBjb3B5W2ldID0gYXJyW2ldO1xuICAgIH1cbiAgICByZXR1cm4gY29weTtcbn1cbmNsYXNzIFNhZmVFdmVudEVtaXR0ZXIgZXh0ZW5kcyBldmVudHNfMS5FdmVudEVtaXR0ZXIge1xuICAgIGVtaXQodHlwZSwgLi4uYXJncykge1xuICAgICAgICBsZXQgZG9FcnJvciA9IHR5cGUgPT09ICdlcnJvcic7XG4gICAgICAgIGNvbnN0IGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgICAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkb0Vycm9yID0gZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghZG9FcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgICAgICAgaWYgKGRvRXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBlcjtcbiAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBbZXJdID0gYXJncztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8gTm90ZTogVGhlIGNvbW1lbnRzIG9uIHRoZSBgdGhyb3dgIGxpbmVzIGFyZSBpbnRlbnRpb25hbCwgdGhleSBzaG93XG4gICAgICAgICAgICAgICAgLy8gdXAgaW4gTm9kZSdzIG91dHB1dCBpZiB0aGlzIHJlc3VsdHMgaW4gYW4gdW5oYW5kbGVkIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihgVW5oYW5kbGVkIGVycm9yLiR7ZXIgPyBgICgke2VyLm1lc3NhZ2V9KWAgOiAnJ31gKTtcbiAgICAgICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgICAgICB0aHJvdyBlcnI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcbiAgICAgICAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgc2FmZUFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHNhZmVBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IFNhZmVFdmVudEVtaXR0ZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/@metamask/safe-event-emitter/index.js\n");

/***/ })

};
;