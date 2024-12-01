"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/sonic-boom";
exports.ids = ["vendor-chunks/sonic-boom"];
exports.modules = {

/***/ "(ssr)/./node_modules/sonic-boom/index.js":
/*!******************************************!*\
  !*** ./node_modules/sonic-boom/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst fs = __webpack_require__(/*! fs */ \"fs\")\nconst EventEmitter = __webpack_require__(/*! events */ \"events\")\nconst inherits = (__webpack_require__(/*! util */ \"util\").inherits)\nconst path = __webpack_require__(/*! path */ \"path\")\nconst sleep = __webpack_require__(/*! atomic-sleep */ \"(ssr)/./node_modules/atomic-sleep/index.js\")\n\nconst BUSY_WRITE_TIMEOUT = 100\n\n// 16 KB. Don't write more than docker buffer size.\n// https://github.com/moby/moby/blob/513ec73831269947d38a644c278ce3cac36783b2/daemon/logger/copier.go#L13\nconst MAX_WRITE = 16 * 1024\n\nfunction openFile (file, sonic) {\n  sonic._opening = true\n  sonic._writing = true\n  sonic._asyncDrainScheduled = false\n\n  // NOTE: 'error' and 'ready' events emitted below only relevant when sonic.sync===false\n  // for sync mode, there is no way to add a listener that will receive these\n\n  function fileOpened (err, fd) {\n    if (err) {\n      sonic._reopening = false\n      sonic._writing = false\n      sonic._opening = false\n\n      if (sonic.sync) {\n        process.nextTick(() => {\n          if (sonic.listenerCount('error') > 0) {\n            sonic.emit('error', err)\n          }\n        })\n      } else {\n        sonic.emit('error', err)\n      }\n      return\n    }\n\n    sonic.fd = fd\n    sonic.file = file\n    sonic._reopening = false\n    sonic._opening = false\n    sonic._writing = false\n\n    if (sonic.sync) {\n      process.nextTick(() => sonic.emit('ready'))\n    } else {\n      sonic.emit('ready')\n    }\n\n    if (sonic._reopening) {\n      return\n    }\n\n    // start\n    if (!sonic._writing && sonic._len > sonic.minLength && !sonic.destroyed) {\n      actualWrite(sonic)\n    }\n  }\n\n  const flags = sonic.append ? 'a' : 'w'\n  const mode = sonic.mode\n\n  if (sonic.sync) {\n    try {\n      if (sonic.mkdir) fs.mkdirSync(path.dirname(file), { recursive: true })\n      const fd = fs.openSync(file, flags, mode)\n      fileOpened(null, fd)\n    } catch (err) {\n      fileOpened(err)\n      throw err\n    }\n  } else if (sonic.mkdir) {\n    fs.mkdir(path.dirname(file), { recursive: true }, (err) => {\n      if (err) return fileOpened(err)\n      fs.open(file, flags, mode, fileOpened)\n    })\n  } else {\n    fs.open(file, flags, mode, fileOpened)\n  }\n}\n\nfunction SonicBoom (opts) {\n  if (!(this instanceof SonicBoom)) {\n    return new SonicBoom(opts)\n  }\n\n  let { fd, dest, minLength, maxLength, maxWrite, sync, append = true, mode, mkdir, retryEAGAIN } = opts || {}\n\n  fd = fd || dest\n\n  this._bufs = []\n  this._len = 0\n  this.fd = -1\n  this._writing = false\n  this._writingBuf = ''\n  this._ending = false\n  this._reopening = false\n  this._asyncDrainScheduled = false\n  this._hwm = Math.max(minLength || 0, 16387)\n  this.file = null\n  this.destroyed = false\n  this.minLength = minLength || 0\n  this.maxLength = maxLength || 0\n  this.maxWrite = maxWrite || MAX_WRITE\n  this.sync = sync || false\n  this.append = append || false\n  this.mode = mode\n  this.retryEAGAIN = retryEAGAIN || (() => true)\n  this.mkdir = mkdir || false\n\n  if (typeof fd === 'number') {\n    this.fd = fd\n    process.nextTick(() => this.emit('ready'))\n  } else if (typeof fd === 'string') {\n    openFile(fd, this)\n  } else {\n    throw new Error('SonicBoom supports only file descriptors and files')\n  }\n  if (this.minLength >= this.maxWrite) {\n    throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`)\n  }\n\n  this.release = (err, n) => {\n    if (err) {\n      if (err.code === 'EAGAIN' && this.retryEAGAIN(err, this._writingBuf.length, this._len - this._writingBuf.length)) {\n        if (this.sync) {\n          // This error code should not happen in sync mode, because it is\n          // not using the underlining operating system asynchronous functions.\n          // However it happens, and so we handle it.\n          // Ref: https://github.com/pinojs/pino/issues/783\n          try {\n            sleep(BUSY_WRITE_TIMEOUT)\n            this.release(undefined, 0)\n          } catch (err) {\n            this.release(err)\n          }\n        } else {\n          // Let's give the destination some time to process the chunk.\n          setTimeout(() => {\n            fs.write(this.fd, this._writingBuf, 'utf8', this.release)\n          }, BUSY_WRITE_TIMEOUT)\n        }\n      } else {\n        this._writing = false\n\n        this.emit('error', err)\n      }\n      return\n    }\n    this.emit('write', n)\n\n    this._len -= n\n    this._writingBuf = this._writingBuf.slice(n)\n\n    if (this._writingBuf.length) {\n      if (!this.sync) {\n        fs.write(this.fd, this._writingBuf, 'utf8', this.release)\n        return\n      }\n\n      try {\n        do {\n          const n = fs.writeSync(this.fd, this._writingBuf, 'utf8')\n          this._len -= n\n          this._writingBuf = this._writingBuf.slice(n)\n        } while (this._writingBuf)\n      } catch (err) {\n        this.release(err)\n        return\n      }\n    }\n\n    const len = this._len\n    if (this._reopening) {\n      this._writing = false\n      this._reopening = false\n      this.reopen()\n    } else if (len > this.minLength) {\n      actualWrite(this)\n    } else if (this._ending) {\n      if (len > 0) {\n        actualWrite(this)\n      } else {\n        this._writing = false\n        actualClose(this)\n      }\n    } else {\n      this._writing = false\n      if (this.sync) {\n        if (!this._asyncDrainScheduled) {\n          this._asyncDrainScheduled = true\n          process.nextTick(emitDrain, this)\n        }\n      } else {\n        this.emit('drain')\n      }\n    }\n  }\n\n  this.on('newListener', function (name) {\n    if (name === 'drain') {\n      this._asyncDrainScheduled = false\n    }\n  })\n}\n\nfunction emitDrain (sonic) {\n  const hasListeners = sonic.listenerCount('drain') > 0\n  if (!hasListeners) return\n  sonic._asyncDrainScheduled = false\n  sonic.emit('drain')\n}\n\ninherits(SonicBoom, EventEmitter)\n\nSonicBoom.prototype.write = function (data) {\n  if (this.destroyed) {\n    throw new Error('SonicBoom destroyed')\n  }\n\n  const len = this._len + data.length\n  const bufs = this._bufs\n\n  if (this.maxLength && len > this.maxLength) {\n    this.emit('drop', data)\n    return this._len < this._hwm\n  }\n\n  if (\n    bufs.length === 0 ||\n    bufs[bufs.length - 1].length + data.length > this.maxWrite\n  ) {\n    bufs.push('' + data)\n  } else {\n    bufs[bufs.length - 1] += data\n  }\n\n  this._len = len\n\n  if (!this._writing && this._len >= this.minLength) {\n    actualWrite(this)\n  }\n\n  return this._len < this._hwm\n}\n\nSonicBoom.prototype.flush = function () {\n  if (this.destroyed) {\n    throw new Error('SonicBoom destroyed')\n  }\n\n  if (this._writing || this.minLength <= 0) {\n    return\n  }\n\n  if (this._bufs.length === 0) {\n    this._bufs.push('')\n  }\n\n  actualWrite(this)\n}\n\nSonicBoom.prototype.reopen = function (file) {\n  if (this.destroyed) {\n    throw new Error('SonicBoom destroyed')\n  }\n\n  if (this._opening) {\n    this.once('ready', () => {\n      this.reopen(file)\n    })\n    return\n  }\n\n  if (this._ending) {\n    return\n  }\n\n  if (!this.file) {\n    throw new Error('Unable to reopen a file descriptor, you must pass a file to SonicBoom')\n  }\n\n  this._reopening = true\n\n  if (this._writing) {\n    return\n  }\n\n  const fd = this.fd\n  this.once('ready', () => {\n    if (fd !== this.fd) {\n      fs.close(fd, (err) => {\n        if (err) {\n          return this.emit('error', err)\n        }\n      })\n    }\n  })\n\n  openFile(file || this.file, this)\n}\n\nSonicBoom.prototype.end = function () {\n  if (this.destroyed) {\n    throw new Error('SonicBoom destroyed')\n  }\n\n  if (this._opening) {\n    this.once('ready', () => {\n      this.end()\n    })\n    return\n  }\n\n  if (this._ending) {\n    return\n  }\n\n  this._ending = true\n\n  if (this._writing) {\n    return\n  }\n\n  if (this._len > 0 && this.fd >= 0) {\n    actualWrite(this)\n  } else {\n    actualClose(this)\n  }\n}\n\nSonicBoom.prototype.flushSync = function () {\n  if (this.destroyed) {\n    throw new Error('SonicBoom destroyed')\n  }\n\n  if (this.fd < 0) {\n    throw new Error('sonic boom is not ready yet')\n  }\n\n  if (!this._writing && this._writingBuf.length > 0) {\n    this._bufs.unshift(this._writingBuf)\n    this._writingBuf = ''\n  }\n\n  while (this._bufs.length) {\n    const buf = this._bufs[0]\n    try {\n      this._len -= fs.writeSync(this.fd, buf, 'utf8')\n      this._bufs.shift()\n    } catch (err) {\n      if (err.code !== 'EAGAIN' || !this.retryEAGAIN(err, buf.length, this._len - buf.length)) {\n        throw err\n      }\n\n      sleep(BUSY_WRITE_TIMEOUT)\n    }\n  }\n}\n\nSonicBoom.prototype.destroy = function () {\n  if (this.destroyed) {\n    return\n  }\n  actualClose(this)\n}\n\nfunction actualWrite (sonic) {\n  const release = sonic.release\n  sonic._writing = true\n  sonic._writingBuf = sonic._writingBuf || sonic._bufs.shift() || ''\n\n  if (sonic.sync) {\n    try {\n      const written = fs.writeSync(sonic.fd, sonic._writingBuf, 'utf8')\n      release(null, written)\n    } catch (err) {\n      release(err)\n    }\n  } else {\n    fs.write(sonic.fd, sonic._writingBuf, 'utf8', release)\n  }\n}\n\nfunction actualClose (sonic) {\n  if (sonic.fd === -1) {\n    sonic.once('ready', actualClose.bind(null, sonic))\n    return\n  }\n\n  sonic.destroyed = true\n  sonic._bufs = []\n\n  if (sonic.fd !== 1 && sonic.fd !== 2) {\n    fs.close(sonic.fd, done)\n  } else {\n    setImmediate(done)\n  }\n\n  function done (err) {\n    if (err) {\n      sonic.emit('error', err)\n      return\n    }\n\n    if (sonic._ending && !sonic._writing) {\n      sonic.emit('finish')\n    }\n    sonic.emit('close')\n  }\n}\n\n/**\n * These export configurations enable JS and TS developers\n * to consumer SonicBoom in whatever way best suits their needs.\n * Some examples of supported import syntax includes:\n * - `const SonicBoom = require('SonicBoom')`\n * - `const { SonicBoom } = require('SonicBoom')`\n * - `import * as SonicBoom from 'SonicBoom'`\n * - `import { SonicBoom } from 'SonicBoom'`\n * - `import SonicBoom from 'SonicBoom'`\n */\nSonicBoom.SonicBoom = SonicBoom\nSonicBoom.default = SonicBoom\nmodule.exports = SonicBoom\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvc29uaWMtYm9vbS9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBWTs7QUFFWixXQUFXLG1CQUFPLENBQUMsY0FBSTtBQUN2QixxQkFBcUIsbUJBQU8sQ0FBQyxzQkFBUTtBQUNyQyxpQkFBaUIsa0RBQXdCO0FBQ3pDLGFBQWEsbUJBQU8sQ0FBQyxrQkFBTTtBQUMzQixjQUFjLG1CQUFPLENBQUMsZ0VBQWM7O0FBRXBDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMERBQTBELGlCQUFpQjtBQUMzRTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixtQ0FBbUMsaUJBQWlCO0FBQ3BEO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxRQUFRLDBGQUEwRjs7QUFFbEc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxjQUFjO0FBQ2hGOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0EsZUFBZSxZQUFZO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Ac2UtMi9uZXh0anMvLi9ub2RlX21vZHVsZXMvc29uaWMtYm9vbS9pbmRleC5qcz8wM2ExIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJylcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpXG5jb25zdCBpbmhlcml0cyA9IHJlcXVpcmUoJ3V0aWwnKS5pbmhlcml0c1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3Qgc2xlZXAgPSByZXF1aXJlKCdhdG9taWMtc2xlZXAnKVxuXG5jb25zdCBCVVNZX1dSSVRFX1RJTUVPVVQgPSAxMDBcblxuLy8gMTYgS0IuIERvbid0IHdyaXRlIG1vcmUgdGhhbiBkb2NrZXIgYnVmZmVyIHNpemUuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbW9ieS9tb2J5L2Jsb2IvNTEzZWM3MzgzMTI2OTk0N2QzOGE2NDRjMjc4Y2UzY2FjMzY3ODNiMi9kYWVtb24vbG9nZ2VyL2NvcGllci5nbyNMMTNcbmNvbnN0IE1BWF9XUklURSA9IDE2ICogMTAyNFxuXG5mdW5jdGlvbiBvcGVuRmlsZSAoZmlsZSwgc29uaWMpIHtcbiAgc29uaWMuX29wZW5pbmcgPSB0cnVlXG4gIHNvbmljLl93cml0aW5nID0gdHJ1ZVxuICBzb25pYy5fYXN5bmNEcmFpblNjaGVkdWxlZCA9IGZhbHNlXG5cbiAgLy8gTk9URTogJ2Vycm9yJyBhbmQgJ3JlYWR5JyBldmVudHMgZW1pdHRlZCBiZWxvdyBvbmx5IHJlbGV2YW50IHdoZW4gc29uaWMuc3luYz09PWZhbHNlXG4gIC8vIGZvciBzeW5jIG1vZGUsIHRoZXJlIGlzIG5vIHdheSB0byBhZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgcmVjZWl2ZSB0aGVzZVxuXG4gIGZ1bmN0aW9uIGZpbGVPcGVuZWQgKGVyciwgZmQpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBzb25pYy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgICAgIHNvbmljLl93cml0aW5nID0gZmFsc2VcbiAgICAgIHNvbmljLl9vcGVuaW5nID0gZmFsc2VcblxuICAgICAgaWYgKHNvbmljLnN5bmMpIHtcbiAgICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgaWYgKHNvbmljLmxpc3RlbmVyQ291bnQoJ2Vycm9yJykgPiAwKSB7XG4gICAgICAgICAgICBzb25pYy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb25pYy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNvbmljLmZkID0gZmRcbiAgICBzb25pYy5maWxlID0gZmlsZVxuICAgIHNvbmljLl9yZW9wZW5pbmcgPSBmYWxzZVxuICAgIHNvbmljLl9vcGVuaW5nID0gZmFsc2VcbiAgICBzb25pYy5fd3JpdGluZyA9IGZhbHNlXG5cbiAgICBpZiAoc29uaWMuc3luYykge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiBzb25pYy5lbWl0KCdyZWFkeScpKVxuICAgIH0gZWxzZSB7XG4gICAgICBzb25pYy5lbWl0KCdyZWFkeScpXG4gICAgfVxuXG4gICAgaWYgKHNvbmljLl9yZW9wZW5pbmcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHN0YXJ0XG4gICAgaWYgKCFzb25pYy5fd3JpdGluZyAmJiBzb25pYy5fbGVuID4gc29uaWMubWluTGVuZ3RoICYmICFzb25pYy5kZXN0cm95ZWQpIHtcbiAgICAgIGFjdHVhbFdyaXRlKHNvbmljKVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGZsYWdzID0gc29uaWMuYXBwZW5kID8gJ2EnIDogJ3cnXG4gIGNvbnN0IG1vZGUgPSBzb25pYy5tb2RlXG5cbiAgaWYgKHNvbmljLnN5bmMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKHNvbmljLm1rZGlyKSBmcy5ta2RpclN5bmMocGF0aC5kaXJuYW1lKGZpbGUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxuICAgICAgY29uc3QgZmQgPSBmcy5vcGVuU3luYyhmaWxlLCBmbGFncywgbW9kZSlcbiAgICAgIGZpbGVPcGVuZWQobnVsbCwgZmQpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBmaWxlT3BlbmVkKGVycilcbiAgICAgIHRocm93IGVyclxuICAgIH1cbiAgfSBlbHNlIGlmIChzb25pYy5ta2Rpcikge1xuICAgIGZzLm1rZGlyKHBhdGguZGlybmFtZShmaWxlKSwgeyByZWN1cnNpdmU6IHRydWUgfSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIGZpbGVPcGVuZWQoZXJyKVxuICAgICAgZnMub3BlbihmaWxlLCBmbGFncywgbW9kZSwgZmlsZU9wZW5lZClcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGZzLm9wZW4oZmlsZSwgZmxhZ3MsIG1vZGUsIGZpbGVPcGVuZWQpXG4gIH1cbn1cblxuZnVuY3Rpb24gU29uaWNCb29tIChvcHRzKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTb25pY0Jvb20pKSB7XG4gICAgcmV0dXJuIG5ldyBTb25pY0Jvb20ob3B0cylcbiAgfVxuXG4gIGxldCB7IGZkLCBkZXN0LCBtaW5MZW5ndGgsIG1heExlbmd0aCwgbWF4V3JpdGUsIHN5bmMsIGFwcGVuZCA9IHRydWUsIG1vZGUsIG1rZGlyLCByZXRyeUVBR0FJTiB9ID0gb3B0cyB8fCB7fVxuXG4gIGZkID0gZmQgfHwgZGVzdFxuXG4gIHRoaXMuX2J1ZnMgPSBbXVxuICB0aGlzLl9sZW4gPSAwXG4gIHRoaXMuZmQgPSAtMVxuICB0aGlzLl93cml0aW5nID0gZmFsc2VcbiAgdGhpcy5fd3JpdGluZ0J1ZiA9ICcnXG4gIHRoaXMuX2VuZGluZyA9IGZhbHNlXG4gIHRoaXMuX3Jlb3BlbmluZyA9IGZhbHNlXG4gIHRoaXMuX2FzeW5jRHJhaW5TY2hlZHVsZWQgPSBmYWxzZVxuICB0aGlzLl9od20gPSBNYXRoLm1heChtaW5MZW5ndGggfHwgMCwgMTYzODcpXG4gIHRoaXMuZmlsZSA9IG51bGxcbiAgdGhpcy5kZXN0cm95ZWQgPSBmYWxzZVxuICB0aGlzLm1pbkxlbmd0aCA9IG1pbkxlbmd0aCB8fCAwXG4gIHRoaXMubWF4TGVuZ3RoID0gbWF4TGVuZ3RoIHx8IDBcbiAgdGhpcy5tYXhXcml0ZSA9IG1heFdyaXRlIHx8IE1BWF9XUklURVxuICB0aGlzLnN5bmMgPSBzeW5jIHx8IGZhbHNlXG4gIHRoaXMuYXBwZW5kID0gYXBwZW5kIHx8IGZhbHNlXG4gIHRoaXMubW9kZSA9IG1vZGVcbiAgdGhpcy5yZXRyeUVBR0FJTiA9IHJldHJ5RUFHQUlOIHx8ICgoKSA9PiB0cnVlKVxuICB0aGlzLm1rZGlyID0gbWtkaXIgfHwgZmFsc2VcblxuICBpZiAodHlwZW9mIGZkID09PSAnbnVtYmVyJykge1xuICAgIHRoaXMuZmQgPSBmZFxuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4gdGhpcy5lbWl0KCdyZWFkeScpKVxuICB9IGVsc2UgaWYgKHR5cGVvZiBmZCA9PT0gJ3N0cmluZycpIHtcbiAgICBvcGVuRmlsZShmZCwgdGhpcylcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBzdXBwb3J0cyBvbmx5IGZpbGUgZGVzY3JpcHRvcnMgYW5kIGZpbGVzJylcbiAgfVxuICBpZiAodGhpcy5taW5MZW5ndGggPj0gdGhpcy5tYXhXcml0ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgbWluTGVuZ3RoIHNob3VsZCBiZSBzbWFsbGVyIHRoYW4gbWF4V3JpdGUgKCR7dGhpcy5tYXhXcml0ZX0pYClcbiAgfVxuXG4gIHRoaXMucmVsZWFzZSA9IChlcnIsIG4pID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBpZiAoZXJyLmNvZGUgPT09ICdFQUdBSU4nICYmIHRoaXMucmV0cnlFQUdBSU4oZXJyLCB0aGlzLl93cml0aW5nQnVmLmxlbmd0aCwgdGhpcy5fbGVuIC0gdGhpcy5fd3JpdGluZ0J1Zi5sZW5ndGgpKSB7XG4gICAgICAgIGlmICh0aGlzLnN5bmMpIHtcbiAgICAgICAgICAvLyBUaGlzIGVycm9yIGNvZGUgc2hvdWxkIG5vdCBoYXBwZW4gaW4gc3luYyBtb2RlLCBiZWNhdXNlIGl0IGlzXG4gICAgICAgICAgLy8gbm90IHVzaW5nIHRoZSB1bmRlcmxpbmluZyBvcGVyYXRpbmcgc3lzdGVtIGFzeW5jaHJvbm91cyBmdW5jdGlvbnMuXG4gICAgICAgICAgLy8gSG93ZXZlciBpdCBoYXBwZW5zLCBhbmQgc28gd2UgaGFuZGxlIGl0LlxuICAgICAgICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Bpbm9qcy9waW5vL2lzc3Vlcy83ODNcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2xlZXAoQlVTWV9XUklURV9USU1FT1VUKVxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKHVuZGVmaW5lZCwgMClcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZShlcnIpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIExldCdzIGdpdmUgdGhlIGRlc3RpbmF0aW9uIHNvbWUgdGltZSB0byBwcm9jZXNzIHRoZSBjaHVuay5cbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGZzLndyaXRlKHRoaXMuZmQsIHRoaXMuX3dyaXRpbmdCdWYsICd1dGY4JywgdGhpcy5yZWxlYXNlKVxuICAgICAgICAgIH0sIEJVU1lfV1JJVEVfVElNRU9VVClcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fd3JpdGluZyA9IGZhbHNlXG5cbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgIH1cbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmVtaXQoJ3dyaXRlJywgbilcblxuICAgIHRoaXMuX2xlbiAtPSBuXG4gICAgdGhpcy5fd3JpdGluZ0J1ZiA9IHRoaXMuX3dyaXRpbmdCdWYuc2xpY2UobilcblxuICAgIGlmICh0aGlzLl93cml0aW5nQnVmLmxlbmd0aCkge1xuICAgICAgaWYgKCF0aGlzLnN5bmMpIHtcbiAgICAgICAgZnMud3JpdGUodGhpcy5mZCwgdGhpcy5fd3JpdGluZ0J1ZiwgJ3V0ZjgnLCB0aGlzLnJlbGVhc2UpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0cnkge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgY29uc3QgbiA9IGZzLndyaXRlU3luYyh0aGlzLmZkLCB0aGlzLl93cml0aW5nQnVmLCAndXRmOCcpXG4gICAgICAgICAgdGhpcy5fbGVuIC09IG5cbiAgICAgICAgICB0aGlzLl93cml0aW5nQnVmID0gdGhpcy5fd3JpdGluZ0J1Zi5zbGljZShuKVxuICAgICAgICB9IHdoaWxlICh0aGlzLl93cml0aW5nQnVmKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHRoaXMucmVsZWFzZShlcnIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGxlbiA9IHRoaXMuX2xlblxuICAgIGlmICh0aGlzLl9yZW9wZW5pbmcpIHtcbiAgICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5fcmVvcGVuaW5nID0gZmFsc2VcbiAgICAgIHRoaXMucmVvcGVuKClcbiAgICB9IGVsc2UgaWYgKGxlbiA+IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgICBhY3R1YWxXcml0ZSh0aGlzKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fZW5kaW5nKSB7XG4gICAgICBpZiAobGVuID4gMCkge1xuICAgICAgICBhY3R1YWxXcml0ZSh0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fd3JpdGluZyA9IGZhbHNlXG4gICAgICAgIGFjdHVhbENsb3NlKHRoaXMpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3dyaXRpbmcgPSBmYWxzZVxuICAgICAgaWYgKHRoaXMuc3luYykge1xuICAgICAgICBpZiAoIXRoaXMuX2FzeW5jRHJhaW5TY2hlZHVsZWQpIHtcbiAgICAgICAgICB0aGlzLl9hc3luY0RyYWluU2NoZWR1bGVkID0gdHJ1ZVxuICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZW1pdERyYWluLCB0aGlzKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXQoJ2RyYWluJylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aGlzLm9uKCduZXdMaXN0ZW5lcicsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKG5hbWUgPT09ICdkcmFpbicpIHtcbiAgICAgIHRoaXMuX2FzeW5jRHJhaW5TY2hlZHVsZWQgPSBmYWxzZVxuICAgIH1cbiAgfSlcbn1cblxuZnVuY3Rpb24gZW1pdERyYWluIChzb25pYykge1xuICBjb25zdCBoYXNMaXN0ZW5lcnMgPSBzb25pYy5saXN0ZW5lckNvdW50KCdkcmFpbicpID4gMFxuICBpZiAoIWhhc0xpc3RlbmVycykgcmV0dXJuXG4gIHNvbmljLl9hc3luY0RyYWluU2NoZWR1bGVkID0gZmFsc2VcbiAgc29uaWMuZW1pdCgnZHJhaW4nKVxufVxuXG5pbmhlcml0cyhTb25pY0Jvb20sIEV2ZW50RW1pdHRlcilcblxuU29uaWNCb29tLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gIGlmICh0aGlzLmRlc3Ryb3llZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignU29uaWNCb29tIGRlc3Ryb3llZCcpXG4gIH1cblxuICBjb25zdCBsZW4gPSB0aGlzLl9sZW4gKyBkYXRhLmxlbmd0aFxuICBjb25zdCBidWZzID0gdGhpcy5fYnVmc1xuXG4gIGlmICh0aGlzLm1heExlbmd0aCAmJiBsZW4gPiB0aGlzLm1heExlbmd0aCkge1xuICAgIHRoaXMuZW1pdCgnZHJvcCcsIGRhdGEpXG4gICAgcmV0dXJuIHRoaXMuX2xlbiA8IHRoaXMuX2h3bVxuICB9XG5cbiAgaWYgKFxuICAgIGJ1ZnMubGVuZ3RoID09PSAwIHx8XG4gICAgYnVmc1tidWZzLmxlbmd0aCAtIDFdLmxlbmd0aCArIGRhdGEubGVuZ3RoID4gdGhpcy5tYXhXcml0ZVxuICApIHtcbiAgICBidWZzLnB1c2goJycgKyBkYXRhKVxuICB9IGVsc2Uge1xuICAgIGJ1ZnNbYnVmcy5sZW5ndGggLSAxXSArPSBkYXRhXG4gIH1cblxuICB0aGlzLl9sZW4gPSBsZW5cblxuICBpZiAoIXRoaXMuX3dyaXRpbmcgJiYgdGhpcy5fbGVuID49IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgYWN0dWFsV3JpdGUodGhpcylcbiAgfVxuXG4gIHJldHVybiB0aGlzLl9sZW4gPCB0aGlzLl9od21cbn1cblxuU29uaWNCb29tLnByb3RvdHlwZS5mbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb25pY0Jvb20gZGVzdHJveWVkJylcbiAgfVxuXG4gIGlmICh0aGlzLl93cml0aW5nIHx8IHRoaXMubWluTGVuZ3RoIDw9IDApIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0aGlzLl9idWZzLmxlbmd0aCA9PT0gMCkge1xuICAgIHRoaXMuX2J1ZnMucHVzaCgnJylcbiAgfVxuXG4gIGFjdHVhbFdyaXRlKHRoaXMpXG59XG5cblNvbmljQm9vbS5wcm90b3R5cGUucmVvcGVuID0gZnVuY3Rpb24gKGZpbGUpIHtcbiAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb25pY0Jvb20gZGVzdHJveWVkJylcbiAgfVxuXG4gIGlmICh0aGlzLl9vcGVuaW5nKSB7XG4gICAgdGhpcy5vbmNlKCdyZWFkeScsICgpID0+IHtcbiAgICAgIHRoaXMucmVvcGVuKGZpbGUpXG4gICAgfSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0aGlzLl9lbmRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICghdGhpcy5maWxlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gcmVvcGVuIGEgZmlsZSBkZXNjcmlwdG9yLCB5b3UgbXVzdCBwYXNzIGEgZmlsZSB0byBTb25pY0Jvb20nKVxuICB9XG5cbiAgdGhpcy5fcmVvcGVuaW5nID0gdHJ1ZVxuXG4gIGlmICh0aGlzLl93cml0aW5nKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBjb25zdCBmZCA9IHRoaXMuZmRcbiAgdGhpcy5vbmNlKCdyZWFkeScsICgpID0+IHtcbiAgICBpZiAoZmQgIT09IHRoaXMuZmQpIHtcbiAgICAgIGZzLmNsb3NlKGZkLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbWl0KCdlcnJvcicsIGVycilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cbiAgb3BlbkZpbGUoZmlsZSB8fCB0aGlzLmZpbGUsIHRoaXMpXG59XG5cblNvbmljQm9vbS5wcm90b3R5cGUuZW5kID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5kZXN0cm95ZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1NvbmljQm9vbSBkZXN0cm95ZWQnKVxuICB9XG5cbiAgaWYgKHRoaXMuX29wZW5pbmcpIHtcbiAgICB0aGlzLm9uY2UoJ3JlYWR5JywgKCkgPT4ge1xuICAgICAgdGhpcy5lbmQoKVxuICAgIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAodGhpcy5fZW5kaW5nKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB0aGlzLl9lbmRpbmcgPSB0cnVlXG5cbiAgaWYgKHRoaXMuX3dyaXRpbmcpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIGlmICh0aGlzLl9sZW4gPiAwICYmIHRoaXMuZmQgPj0gMCkge1xuICAgIGFjdHVhbFdyaXRlKHRoaXMpXG4gIH0gZWxzZSB7XG4gICAgYWN0dWFsQ2xvc2UodGhpcylcbiAgfVxufVxuXG5Tb25pY0Jvb20ucHJvdG90eXBlLmZsdXNoU3luYyA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdTb25pY0Jvb20gZGVzdHJveWVkJylcbiAgfVxuXG4gIGlmICh0aGlzLmZkIDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc29uaWMgYm9vbSBpcyBub3QgcmVhZHkgeWV0JylcbiAgfVxuXG4gIGlmICghdGhpcy5fd3JpdGluZyAmJiB0aGlzLl93cml0aW5nQnVmLmxlbmd0aCA+IDApIHtcbiAgICB0aGlzLl9idWZzLnVuc2hpZnQodGhpcy5fd3JpdGluZ0J1ZilcbiAgICB0aGlzLl93cml0aW5nQnVmID0gJydcbiAgfVxuXG4gIHdoaWxlICh0aGlzLl9idWZzLmxlbmd0aCkge1xuICAgIGNvbnN0IGJ1ZiA9IHRoaXMuX2J1ZnNbMF1cbiAgICB0cnkge1xuICAgICAgdGhpcy5fbGVuIC09IGZzLndyaXRlU3luYyh0aGlzLmZkLCBidWYsICd1dGY4JylcbiAgICAgIHRoaXMuX2J1ZnMuc2hpZnQoKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKGVyci5jb2RlICE9PSAnRUFHQUlOJyB8fCAhdGhpcy5yZXRyeUVBR0FJTihlcnIsIGJ1Zi5sZW5ndGgsIHRoaXMuX2xlbiAtIGJ1Zi5sZW5ndGgpKSB7XG4gICAgICAgIHRocm93IGVyclxuICAgICAgfVxuXG4gICAgICBzbGVlcChCVVNZX1dSSVRFX1RJTUVPVVQpXG4gICAgfVxuICB9XG59XG5cblNvbmljQm9vbS5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuZGVzdHJveWVkKSB7XG4gICAgcmV0dXJuXG4gIH1cbiAgYWN0dWFsQ2xvc2UodGhpcylcbn1cblxuZnVuY3Rpb24gYWN0dWFsV3JpdGUgKHNvbmljKSB7XG4gIGNvbnN0IHJlbGVhc2UgPSBzb25pYy5yZWxlYXNlXG4gIHNvbmljLl93cml0aW5nID0gdHJ1ZVxuICBzb25pYy5fd3JpdGluZ0J1ZiA9IHNvbmljLl93cml0aW5nQnVmIHx8IHNvbmljLl9idWZzLnNoaWZ0KCkgfHwgJydcblxuICBpZiAoc29uaWMuc3luYykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB3cml0dGVuID0gZnMud3JpdGVTeW5jKHNvbmljLmZkLCBzb25pYy5fd3JpdGluZ0J1ZiwgJ3V0ZjgnKVxuICAgICAgcmVsZWFzZShudWxsLCB3cml0dGVuKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmVsZWFzZShlcnIpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZzLndyaXRlKHNvbmljLmZkLCBzb25pYy5fd3JpdGluZ0J1ZiwgJ3V0ZjgnLCByZWxlYXNlKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFjdHVhbENsb3NlIChzb25pYykge1xuICBpZiAoc29uaWMuZmQgPT09IC0xKSB7XG4gICAgc29uaWMub25jZSgncmVhZHknLCBhY3R1YWxDbG9zZS5iaW5kKG51bGwsIHNvbmljKSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIHNvbmljLmRlc3Ryb3llZCA9IHRydWVcbiAgc29uaWMuX2J1ZnMgPSBbXVxuXG4gIGlmIChzb25pYy5mZCAhPT0gMSAmJiBzb25pYy5mZCAhPT0gMikge1xuICAgIGZzLmNsb3NlKHNvbmljLmZkLCBkb25lKVxuICB9IGVsc2Uge1xuICAgIHNldEltbWVkaWF0ZShkb25lKVxuICB9XG5cbiAgZnVuY3Rpb24gZG9uZSAoZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgc29uaWMuZW1pdCgnZXJyb3InLCBlcnIpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoc29uaWMuX2VuZGluZyAmJiAhc29uaWMuX3dyaXRpbmcpIHtcbiAgICAgIHNvbmljLmVtaXQoJ2ZpbmlzaCcpXG4gICAgfVxuICAgIHNvbmljLmVtaXQoJ2Nsb3NlJylcbiAgfVxufVxuXG4vKipcbiAqIFRoZXNlIGV4cG9ydCBjb25maWd1cmF0aW9ucyBlbmFibGUgSlMgYW5kIFRTIGRldmVsb3BlcnNcbiAqIHRvIGNvbnN1bWVyIFNvbmljQm9vbSBpbiB3aGF0ZXZlciB3YXkgYmVzdCBzdWl0cyB0aGVpciBuZWVkcy5cbiAqIFNvbWUgZXhhbXBsZXMgb2Ygc3VwcG9ydGVkIGltcG9ydCBzeW50YXggaW5jbHVkZXM6XG4gKiAtIGBjb25zdCBTb25pY0Jvb20gPSByZXF1aXJlKCdTb25pY0Jvb20nKWBcbiAqIC0gYGNvbnN0IHsgU29uaWNCb29tIH0gPSByZXF1aXJlKCdTb25pY0Jvb20nKWBcbiAqIC0gYGltcG9ydCAqIGFzIFNvbmljQm9vbSBmcm9tICdTb25pY0Jvb20nYFxuICogLSBgaW1wb3J0IHsgU29uaWNCb29tIH0gZnJvbSAnU29uaWNCb29tJ2BcbiAqIC0gYGltcG9ydCBTb25pY0Jvb20gZnJvbSAnU29uaWNCb29tJ2BcbiAqL1xuU29uaWNCb29tLlNvbmljQm9vbSA9IFNvbmljQm9vbVxuU29uaWNCb29tLmRlZmF1bHQgPSBTb25pY0Jvb21cbm1vZHVsZS5leHBvcnRzID0gU29uaWNCb29tXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/sonic-boom/index.js\n");

/***/ })

};
;