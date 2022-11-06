var fabric = fabric || { version: '5.2.1' };
if (
  ('undefined' != typeof exports
    ? (exports.fabric = fabric)
    : 'function' == typeof define &&
      define.amd &&
      define([], function () {
        return fabric;
      }),
  'undefined' != typeof document && 'undefined' != typeof window)
)
  (fabric.document =
    document instanceof
    ('undefined' != typeof HTMLDocument ? HTMLDocument : Document)
      ? document
      : document.implementation.createHTMLDocument('')),
    (fabric.window = window);
else {
  var jsdom = require('jsdom'),
    virtualWindow = new jsdom.JSDOM(
      decodeURIComponent(
        '%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'
      ),
      { features: { FetchExternalResources: ['img'] }, resources: 'usable' }
    ).window;
  (fabric.document = virtualWindow.document),
    (fabric.jsdomImplForWrapper =
      require('jsdom/lib/jsdom/living/generated/utils').implForWrapper),
    (fabric.nodeCanvas = require('jsdom/lib/jsdom/utils').Canvas),
    (fabric.window = virtualWindow),
    (DOMParser = fabric.window.DOMParser);
}
(fabric.isTouchSupported =
  'ontouchstart' in fabric.window ||
  'ontouchstart' in fabric.document ||
  (fabric.window &&
    fabric.window.navigator &&
    fabric.window.navigator.maxTouchPoints > 0)),
  (fabric.isLikelyNode =
    'undefined' != typeof Buffer && 'undefined' == typeof window),
  (fabric.SHARED_ATTRIBUTES = [
    'display',
    'transform',
    'fill',
    'fill-opacity',
    'fill-rule',
    'opacity',
    'stroke',
    'stroke-dasharray',
    'stroke-linecap',
    'stroke-dashoffset',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'id',
    'paint-order',
    'vector-effect',
    'instantiated_by_use',
    'clip-path'
  ]),
  (fabric.DPI = 96),
  (fabric.reNum = '(?:[-+]?(?:\\d+|\\d*\\.\\d+)(?:[eE][-+]?\\d+)?)'),
  (fabric.commaWsp = '(?:\\s+,?\\s*|,\\s*)'),
  (fabric.rePathCommand =
    /([-+]?((\d+\.\d+)|((\d+)|(\.\d+)))(?:[eE][-+]?\d+)?)/gi),
  (fabric.reNonWord = /[ \n\.,;!\?\-]/),
  (fabric.fontPaths = {}),
  (fabric.iMatrix = [1, 0, 0, 1, 0, 0]),
  (fabric.svgNS = 'http://www.w3.org/2000/svg'),
  (fabric.perfLimitSizeTotal = 2097152),
  (fabric.maxCacheSideLimit = 4096),
  (fabric.minCacheSideLimit = 256),
  (fabric.charWidthsCache = {}),
  (fabric.textureSize = 2048),
  (fabric.disableStyleCopyPaste = !1),
  (fabric.enableGLFiltering = !0),
  (fabric.devicePixelRatio =
    fabric.window.devicePixelRatio ||
    fabric.window.webkitDevicePixelRatio ||
    fabric.window.mozDevicePixelRatio ||
    1),
  (fabric.browserShadowBlurConstant = 1),
  (fabric.arcToSegmentsCache = {}),
  (fabric.boundsOfCurveCache = {}),
  (fabric.cachesBoundsOfCurve = !0),
  (fabric.forceGLPutImageData = !1),
  (fabric.initFilterBackend = function () {
    return fabric.enableGLFiltering &&
      fabric.isWebglSupported &&
      fabric.isWebglSupported(fabric.textureSize)
      ? (console.log('max texture size: ' + fabric.maxTextureSize),
        new fabric.WebglFilterBackend({ tileSize: fabric.textureSize }))
      : fabric.Canvas2dFilterBackend
      ? new fabric.Canvas2dFilterBackend()
      : void 0;
  });
'undefined' != typeof document &&
  'undefined' != typeof window &&
  (window.fabric = fabric);
!(function () {
  function t(t, e) {
    if (this.__eventListeners[t]) {
      var r = this.__eventListeners[t];
      e ? (r[r.indexOf(e)] = !1) : fabric.util.array.fill(r, !1);
    }
  }
  function e(t, e) {
    if (
      (this.__eventListeners || (this.__eventListeners = {}),
      1 === arguments.length)
    )
      for (var r in t) this.on(r, t[r]);
    else
      this.__eventListeners[t] || (this.__eventListeners[t] = []),
        this.__eventListeners[t].push(e);
    return this;
  }
  function r(t, e) {
    var r = function () {
      e.apply(this, arguments), this.off(t, r);
    }.bind(this);
    this.on(t, r);
  }
  function n(t, e) {
    if (1 === arguments.length) for (var n in t) r.call(this, n, t[n]);
    else r.call(this, t, e);
    return this;
  }
  function i(e, r) {
    if (!this.__eventListeners) return this;
    if (0 === arguments.length)
      for (e in this.__eventListeners) t.call(this, e);
    else if (1 === arguments.length && 'object' == typeof arguments[0])
      for (var n in e) t.call(this, n, e[n]);
    else t.call(this, e, r);
    return this;
  }
  function a(t, e) {
    if (!this.__eventListeners) return this;
    var r = this.__eventListeners[t];
    if (!r) return this;
    for (var n = 0, i = r.length; i > n; n++) r[n] && r[n].call(this, e || {});
    return (
      (this.__eventListeners[t] = r.filter(function (t) {
        return t !== !1;
      })),
      this
    );
  }
  fabric.Observable = { fire: a, on: e, once: n, off: i };
})();
fabric.Collection = {
  _objects: [],
  add: function () {
    if (
      (this._objects.push.apply(this._objects, arguments), this._onObjectAdded)
    )
      for (var t = 0, e = arguments.length; e > t; t++)
        this._onObjectAdded(arguments[t]);
    return this.renderOnAddRemove && this.requestRenderAll(), this;
  },
  insertAt: function (t, e, r) {
    var n = this._objects;
    return (
      r ? (n[e] = t) : n.splice(e, 0, t),
      this._onObjectAdded && this._onObjectAdded(t),
      this.renderOnAddRemove && this.requestRenderAll(),
      this
    );
  },
  remove: function () {
    for (
      var t, e = this._objects, r = !1, n = 0, i = arguments.length;
      i > n;
      n++
    )
      (t = e.indexOf(arguments[n])),
        -1 !== t &&
          ((r = !0),
          e.splice(t, 1),
          this._onObjectRemoved && this._onObjectRemoved(arguments[n]));
    return this.renderOnAddRemove && r && this.requestRenderAll(), this;
  },
  forEachObject: function (t, e) {
    for (var r = this.getObjects(), n = 0, i = r.length; i > n; n++)
      t.call(e, r[n], n, r);
    return this;
  },
  getObjects: function (t) {
    return 'undefined' == typeof t
      ? this._objects.concat()
      : this._objects.filter(function (e) {
          return e.type === t;
        });
  },
  item: function (t) {
    return this._objects[t];
  },
  isEmpty: function () {
    return 0 === this._objects.length;
  },
  size: function () {
    return this._objects.length;
  },
  contains: function (t, e) {
    return this._objects.indexOf(t) > -1
      ? !0
      : e
      ? this._objects.some(function (e) {
          return 'function' == typeof e.contains && e.contains(t, !0);
        })
      : !1;
  },
  complexity: function () {
    return this._objects.reduce(function (t, e) {
      return (t += e.complexity ? e.complexity() : 0);
    }, 0);
  }
};
fabric.CommonMethods = {
  _setOptions: function (t) {
    for (var e in t) this.set(e, t[e]);
  },
  _initGradient: function (t, e) {
    !t ||
      !t.colorStops ||
      t instanceof fabric.Gradient ||
      this.set(e, new fabric.Gradient(t));
  },
  _initPattern: function (t, e, r) {
    !t || !t.source || t instanceof fabric.Pattern
      ? r && r()
      : this.set(e, new fabric.Pattern(t, r));
  },
  _setObject: function (t) {
    for (var e in t) this._set(e, t[e]);
  },
  set: function (t, e) {
    return 'object' == typeof t ? this._setObject(t) : this._set(t, e), this;
  },
  _set: function (t, e) {
    this[t] = e;
  },
  toggle: function (t) {
    var e = this.get(t);
    return 'boolean' == typeof e && this.set(t, !e), this;
  },
  get: function (t) {
    return this[t];
  }
};
!(function (e) {
  var t = Math.sqrt,
    r = Math.atan2,
    i = Math.pow,
    a = Math.PI / 180,
    n = Math.PI / 2;
  fabric.util = {
    cos: function (e) {
      if (0 === e) return 1;
      0 > e && (e = -e);
      var t = e / n;
      switch (t) {
        case 1:
        case 3:
          return 0;
        case 2:
          return -1;
      }
      return Math.cos(e);
    },
    sin: function (e) {
      if (0 === e) return 0;
      var t = e / n,
        r = 1;
      switch ((0 > e && (r = -1), t)) {
        case 1:
          return r;
        case 2:
          return 0;
        case 3:
          return -r;
      }
      return Math.sin(e);
    },
    removeFromArray: function (e, t) {
      var r = e.indexOf(t);
      return -1 !== r && e.splice(r, 1), e;
    },
    getRandomInt: function (e, t) {
      return Math.floor(Math.random() * (t - e + 1)) + e;
    },
    degreesToRadians: function (e) {
      return e * a;
    },
    radiansToDegrees: function (e) {
      return e / a;
    },
    rotatePoint: function (e, t, r) {
      var i = new fabric.Point(e.x - t.x, e.y - t.y),
        a = fabric.util.rotateVector(i, r);
      return new fabric.Point(a.x, a.y).addEquals(t);
    },
    rotateVector: function (e, t) {
      var r = fabric.util.sin(t),
        i = fabric.util.cos(t),
        a = e.x * i - e.y * r,
        n = e.x * r + e.y * i;
      return { x: a, y: n };
    },
    createVector: function (e, t) {
      return new fabric.Point(t.x - e.x, t.y - e.y);
    },
    calcAngleBetweenVectors: function (e, t) {
      return Math.acos(
        (e.x * t.x + e.y * t.y) / (Math.hypot(e.x, e.y) * Math.hypot(t.x, t.y))
      );
    },
    getHatVector: function (e) {
      return new fabric.Point(e.x, e.y).multiply(1 / Math.hypot(e.x, e.y));
    },
    getBisector: function (e, t, r) {
      var i = fabric.util.createVector(e, t),
        a = fabric.util.createVector(e, r),
        n = fabric.util.calcAngleBetweenVectors(i, a),
        c = fabric.util.calcAngleBetweenVectors(
          fabric.util.rotateVector(i, n),
          a
        ),
        o = (n * (0 === c ? 1 : -1)) / 2;
      return {
        vector: fabric.util.getHatVector(fabric.util.rotateVector(i, o)),
        angle: n
      };
    },
    projectStrokeOnPoints: function (e, t, r) {
      var i = [],
        a = t.strokeWidth / 2,
        n = t.strokeUniform
          ? new fabric.Point(1 / t.scaleX, 1 / t.scaleY)
          : new fabric.Point(1, 1),
        c = function (e) {
          var t = a / Math.hypot(e.x, e.y);
          return new fabric.Point(e.x * t * n.x, e.y * t * n.y);
        };
      return e.length <= 1
        ? i
        : (e.forEach(function (o, f) {
            var l,
              s,
              u = new fabric.Point(o.x, o.y);
            0 === f
              ? ((s = e[f + 1]),
                (l = r
                  ? c(fabric.util.createVector(s, u)).addEquals(u)
                  : e[e.length - 1]))
              : f === e.length - 1
              ? ((l = e[f - 1]),
                (s = r ? c(fabric.util.createVector(l, u)).addEquals(u) : e[0]))
              : ((l = e[f - 1]), (s = e[f + 1]));
            var d,
              b,
              h = fabric.util.getBisector(u, l, s),
              m = h.vector,
              p = h.angle;
            return 'miter' === t.strokeLineJoin &&
              ((d = -a / Math.sin(p / 2)),
              (b = new fabric.Point(m.x * d * n.x, m.y * d * n.y)),
              Math.hypot(b.x, b.y) / a <= t.strokeMiterLimit)
              ? (i.push(u.add(b)), void i.push(u.subtract(b)))
              : ((d = -a * Math.SQRT2),
                (b = new fabric.Point(m.x * d * n.x, m.y * d * n.y)),
                i.push(u.add(b)),
                void i.push(u.subtract(b)));
          }),
          i);
    },
    transformPoint: function (e, t, r) {
      return r
        ? new fabric.Point(t[0] * e.x + t[2] * e.y, t[1] * e.x + t[3] * e.y)
        : new fabric.Point(
            t[0] * e.x + t[2] * e.y + t[4],
            t[1] * e.x + t[3] * e.y + t[5]
          );
    },
    makeBoundingBoxFromPoints: function (e, t) {
      if (t)
        for (var r = 0; r < e.length; r++)
          e[r] = fabric.util.transformPoint(e[r], t);
      var i = [e[0].x, e[1].x, e[2].x, e[3].x],
        a = fabric.util.array.min(i),
        n = fabric.util.array.max(i),
        c = n - a,
        o = [e[0].y, e[1].y, e[2].y, e[3].y],
        f = fabric.util.array.min(o),
        l = fabric.util.array.max(o),
        s = l - f;
      return { left: a, top: f, width: c, height: s };
    },
    invertTransform: function (e) {
      var t = 1 / (e[0] * e[3] - e[1] * e[2]),
        r = [t * e[3], -t * e[1], -t * e[2], t * e[0]],
        i = fabric.util.transformPoint({ x: e[4], y: e[5] }, r, !0);
      return (r[4] = -i.x), (r[5] = -i.y), r;
    },
    toFixed: function (e, t) {
      return parseFloat(Number(e).toFixed(t));
    },
    parseUnit: function (e, t) {
      var r = /\D{0,2}$/.exec(e),
        i = parseFloat(e);
      switch ((t || (t = fabric.Text.DEFAULT_SVG_FONT_SIZE), r[0])) {
        case 'mm':
          return (i * fabric.DPI) / 25.4;
        case 'cm':
          return (i * fabric.DPI) / 2.54;
        case 'in':
          return i * fabric.DPI;
        case 'pt':
          return (i * fabric.DPI) / 72;
        case 'pc':
          return ((i * fabric.DPI) / 72) * 12;
        case 'em':
          return i * t;
        default:
          return i;
      }
    },
    falseFunction: function () {
      return !1;
    },
    getKlass: function (e, t) {
      return (
        (e = fabric.util.string.camelize(
          e.charAt(0).toUpperCase() + e.slice(1)
        )),
        fabric.util.resolveNamespace(t)[e]
      );
    },
    getSvgAttributes: function (e) {
      var t = ['instantiated_by_use', 'style', 'id', 'class'];
      switch (e) {
        case 'linearGradient':
          t = t.concat([
            'x1',
            'y1',
            'x2',
            'y2',
            'gradientUnits',
            'gradientTransform'
          ]);
          break;
        case 'radialGradient':
          t = t.concat([
            'gradientUnits',
            'gradientTransform',
            'cx',
            'cy',
            'r',
            'fx',
            'fy',
            'fr'
          ]);
          break;
        case 'stop':
          t = t.concat(['offset', 'stop-color', 'stop-opacity']);
      }
      return t;
    },
    resolveNamespace: function (t) {
      if (!t) return fabric;
      var r,
        i = t.split('.'),
        a = i.length,
        n = e || fabric.window;
      for (r = 0; a > r; ++r) n = n[i[r]];
      return n;
    },
    loadImage: function (e, t, r, i) {
      if (!e) return void (t && t.call(r, e));
      var a = fabric.util.createImage(),
        n = function () {
          t && t.call(r, a, !1), (a = a.onload = a.onerror = null);
        };
      (a.onload = n),
        (a.onerror = function () {
          fabric.log('Error loading ' + a.src),
            t && t.call(r, null, !0),
            (a = a.onload = a.onerror = null);
        }),
        0 !== e.indexOf('data') &&
          void 0 !== i &&
          null !== i &&
          (a.crossOrigin = i),
        'data:image/svg' === e.substring(0, 14) &&
          ((a.onload = null), fabric.util.loadImageInDom(a, n)),
        (a.src = e);
    },
    loadImageInDom: function (e, t) {
      var r = fabric.document.createElement('div');
      (r.style.width = r.style.height = '1px'),
        (r.style.left = r.style.top = '-100%'),
        (r.style.position = 'absolute'),
        r.appendChild(e),
        fabric.document.querySelector('body').appendChild(r),
        (e.onload = function () {
          t(), r.parentNode.removeChild(r), (r = null);
        });
    },
    enlivenObjects: function (e, t, r, i) {
      function a() {
        ++c === o &&
          t &&
          t(
            n.filter(function (e) {
              return e;
            })
          );
      }
      e = e || [];
      var n = [],
        c = 0,
        o = e.length;
      return o
        ? void e.forEach(function (e, t) {
            if (!e || !e.type) return void a();
            var c = fabric.util.getKlass(e.type, r);
            c.fromObject(e, function (r, c) {
              c || (n[t] = r), i && i(e, r, c), a();
            });
          })
        : void (t && t(n));
    },
    enlivenObjectEnlivables: function (e, t, r) {
      var i = fabric.Object.ENLIVEN_PROPS.filter(function (t) {
        return !!e[t];
      });
      fabric.util.enlivenObjects(
        i.map(function (t) {
          return e[t];
        }),
        function (e) {
          var a = {};
          i.forEach(function (r, i) {
            (a[r] = e[i]), t && (t[r] = e[i]);
          }),
            r && r(a);
        }
      );
    },
    enlivenPatterns: function (e, t) {
      function r() {
        ++a === n && t && t(i);
      }
      e = e || [];
      var i = [],
        a = 0,
        n = e.length;
      return n
        ? void e.forEach(function (e, t) {
            e && e.source
              ? new fabric.Pattern(e, function (e) {
                  (i[t] = e), r();
                })
              : ((i[t] = e), r());
          })
        : void (t && t(i));
    },
    groupSVGElements: function (e, t, r) {
      var i;
      return e && 1 === e.length
        ? e[0]
        : (t &&
            (t.width && t.height
              ? (t.centerPoint = { x: t.width / 2, y: t.height / 2 })
              : (delete t.width, delete t.height)),
          (i = new fabric.Group(e, t)),
          'undefined' != typeof r && (i.sourcePath = r),
          i);
    },
    populateWithProperties: function (e, t, r) {
      if (r && Array.isArray(r))
        for (var i = 0, a = r.length; a > i; i++)
          r[i] in e && (t[r[i]] = e[r[i]]);
    },
    createCanvasElement: function () {
      return fabric.document.createElement('canvas');
    },
    copyCanvasElement: function (e) {
      var t = fabric.util.createCanvasElement();
      return (
        (t.width = e.width),
        (t.height = e.height),
        t.getContext('2d').drawImage(e, 0, 0),
        t
      );
    },
    toDataURL: function (e, t, r) {
      return e.toDataURL('image/' + t, r);
    },
    createImage: function () {
      return fabric.document.createElement('img');
    },
    multiplyTransformMatrices: function (e, t, r) {
      return [
        e[0] * t[0] + e[2] * t[1],
        e[1] * t[0] + e[3] * t[1],
        e[0] * t[2] + e[2] * t[3],
        e[1] * t[2] + e[3] * t[3],
        r ? 0 : e[0] * t[4] + e[2] * t[5] + e[4],
        r ? 0 : e[1] * t[4] + e[3] * t[5] + e[5]
      ];
    },
    qrDecompose: function (e) {
      var n = r(e[1], e[0]),
        c = i(e[0], 2) + i(e[1], 2),
        o = t(c),
        f = (e[0] * e[3] - e[2] * e[1]) / o,
        l = r(e[0] * e[2] + e[1] * e[3], c);
      return {
        angle: n / a,
        scaleX: o,
        scaleY: f,
        skewX: l / a,
        skewY: 0,
        translateX: e[4],
        translateY: e[5]
      };
    },
    calcRotateMatrix: function (e) {
      if (!e.angle) return fabric.iMatrix.concat();
      var t = fabric.util.degreesToRadians(e.angle),
        r = fabric.util.cos(t),
        i = fabric.util.sin(t);
      return [r, i, -i, r, 0, 0];
    },
    calcDimensionsMatrix: function (e) {
      var t = 'undefined' == typeof e.scaleX ? 1 : e.scaleX,
        r = 'undefined' == typeof e.scaleY ? 1 : e.scaleY,
        i = [e.flipX ? -t : t, 0, 0, e.flipY ? -r : r, 0, 0],
        a = fabric.util.multiplyTransformMatrices,
        n = fabric.util.degreesToRadians;
      return (
        e.skewX && (i = a(i, [1, 0, Math.tan(n(e.skewX)), 1], !0)),
        e.skewY && (i = a(i, [1, Math.tan(n(e.skewY)), 0, 1], !0)),
        i
      );
    },
    composeMatrix: function (e) {
      var t = [1, 0, 0, 1, e.translateX || 0, e.translateY || 0],
        r = fabric.util.multiplyTransformMatrices;
      return (
        e.angle && (t = r(t, fabric.util.calcRotateMatrix(e))),
        (1 !== e.scaleX ||
          1 !== e.scaleY ||
          e.skewX ||
          e.skewY ||
          e.flipX ||
          e.flipY) &&
          (t = r(t, fabric.util.calcDimensionsMatrix(e))),
        t
      );
    },
    resetObjectTransform: function (e) {
      (e.scaleX = 1),
        (e.scaleY = 1),
        (e.skewX = 0),
        (e.skewY = 0),
        (e.flipX = !1),
        (e.flipY = !1),
        e.rotate(0);
    },
    saveObjectTransform: function (e) {
      return {
        scaleX: e.scaleX,
        scaleY: e.scaleY,
        skewX: e.skewX,
        skewY: e.skewY,
        angle: e.angle,
        left: e.left,
        flipX: e.flipX,
        flipY: e.flipY,
        top: e.top
      };
    },
    isTransparent: function (e, t, r, i) {
      i > 0 && (t > i ? (t -= i) : (t = 0), r > i ? (r -= i) : (r = 0));
      var a,
        n,
        c = !0,
        o = e.getImageData(t, r, 2 * i || 1, 2 * i || 1),
        f = o.data.length;
      for (a = 3; f > a && ((n = o.data[a]), (c = 0 >= n), c !== !1); a += 4);
      return (o = null), c;
    },
    parsePreserveAspectRatioAttribute: function (e) {
      var t,
        r = 'meet',
        i = 'Mid',
        a = 'Mid',
        n = e.split(' ');
      return (
        n &&
          n.length &&
          ((r = n.pop()),
          'meet' !== r && 'slice' !== r
            ? ((t = r), (r = 'meet'))
            : n.length && (t = n.pop())),
        (i = 'none' !== t ? t.slice(1, 4) : 'none'),
        (a = 'none' !== t ? t.slice(5, 8) : 'none'),
        { meetOrSlice: r, alignX: i, alignY: a }
      );
    },
    clearFabricFontCache: function (e) {
      (e = (e || '').toLowerCase()),
        e
          ? fabric.charWidthsCache[e] && delete fabric.charWidthsCache[e]
          : (fabric.charWidthsCache = {});
    },
    limitDimsByArea: function (e, t) {
      var r = Math.sqrt(t * e),
        i = Math.floor(t / r);
      return { x: Math.floor(r), y: i };
    },
    capValue: function (e, t, r) {
      return Math.max(e, Math.min(t, r));
    },
    findScaleToFit: function (e, t) {
      return Math.min(t.width / e.width, t.height / e.height);
    },
    findScaleToCover: function (e, t) {
      return Math.max(t.width / e.width, t.height / e.height);
    },
    matrixToSVG: function (e) {
      return (
        'matrix(' +
        e
          .map(function (e) {
            return fabric.util.toFixed(e, fabric.Object.NUM_FRACTION_DIGITS);
          })
          .join(' ') +
        ')'
      );
    },
    removeTransformFromObject: function (e, t) {
      var r = fabric.util.invertTransform(t),
        i = fabric.util.multiplyTransformMatrices(r, e.calcOwnMatrix());
      fabric.util.applyTransformToObject(e, i);
    },
    addTransformToObject: function (e, t) {
      fabric.util.applyTransformToObject(
        e,
        fabric.util.multiplyTransformMatrices(t, e.calcOwnMatrix())
      );
    },
    applyTransformToObject: function (e, t) {
      var r = fabric.util.qrDecompose(t),
        i = new fabric.Point(r.translateX, r.translateY);
      (e.flipX = !1),
        (e.flipY = !1),
        e.set('scaleX', r.scaleX),
        e.set('scaleY', r.scaleY),
        (e.skewX = r.skewX),
        (e.skewY = r.skewY),
        (e.angle = r.angle),
        e.setPositionByOrigin(i, 'center', 'center');
    },
    sizeAfterTransform: function (e, t, r) {
      var i = e / 2,
        a = t / 2,
        n = [
          { x: -i, y: -a },
          { x: i, y: -a },
          { x: -i, y: a },
          { x: i, y: a }
        ],
        c = fabric.util.calcDimensionsMatrix(r),
        o = fabric.util.makeBoundingBoxFromPoints(n, c);
      return { x: o.width, y: o.height };
    },
    mergeClipPaths: function (e, t) {
      var r = e,
        i = t;
      r.inverted && !i.inverted && ((r = t), (i = e)),
        fabric.util.applyTransformToObject(
          i,
          fabric.util.multiplyTransformMatrices(
            fabric.util.invertTransform(r.calcTransformMatrix()),
            i.calcTransformMatrix()
          )
        );
      var a = r.inverted && i.inverted;
      return (
        a && (r.inverted = i.inverted = !1),
        new fabric.Group([r], { clipPath: i, inverted: a })
      );
    },
    hasStyleChanged: function (e, t, r) {
      return (
        (r = r || !1),
        e.fill !== t.fill ||
          e.stroke !== t.stroke ||
          e.strokeWidth !== t.strokeWidth ||
          e.fontSize !== t.fontSize ||
          e.fontFamily !== t.fontFamily ||
          e.fontWeight !== t.fontWeight ||
          e.fontStyle !== t.fontStyle ||
          e.deltaY !== t.deltaY ||
          (r &&
            (e.overline !== t.overline ||
              e.underline !== t.underline ||
              e.linethrough !== t.linethrough))
      );
    },
    stylesToArray: function (e, t) {
      for (
        var e = fabric.util.object.clone(e, !0),
          r = t.split('\n'),
          i = -1,
          a = {},
          n = [],
          c = 0;
        c < r.length;
        c++
      )
        if (e[c])
          for (var o = 0; o < r[c].length; o++) {
            i++;
            var f = e[c][o];
            if (f) {
              var l = fabric.util.hasStyleChanged(a, f, !0);
              l
                ? n.push({ start: i, end: i + 1, style: f })
                : n[n.length - 1].end++;
            }
            a = f || {};
          }
        else i += r[c].length;
      return n;
    },
    stylesFromArray: function (e, t) {
      if (!Array.isArray(e)) return e;
      for (
        var r = t.split('\n'), i = -1, a = 0, n = {}, c = 0;
        c < r.length;
        c++
      )
        for (var o = 0; o < r[c].length; o++)
          i++,
            e[a] &&
              e[a].start <= i &&
              i < e[a].end &&
              ((n[c] = n[c] || {}),
              (n[c][o] = Object.assign({}, e[a].style)),
              i === e[a].end - 1 && a++);
      return n;
    }
  };
})('undefined' != typeof exports ? exports : this);
!(function () {
  function t(t, e, r, a, n, i, c, o, f, u, s) {
    var l = fabric.util.cos(t),
      d = fabric.util.sin(t),
      h = fabric.util.cos(e),
      b = fabric.util.sin(e),
      m = r * n * h - a * i * b + c,
      p = a * n * h + r * i * b + o,
      y = u + f * (-r * n * d - a * i * l),
      v = s + f * (-a * n * d + r * i * l),
      g = m + f * (r * n * b + a * i * h),
      x = p + f * (a * n * b - r * i * h);
    return ['C', y, v, g, x, m, p];
  }
  function e(e, a, n, i, c, o, f) {
    var u = Math.PI,
      s = (f * u) / 180,
      l = fabric.util.sin(s),
      d = fabric.util.cos(s),
      h = 0,
      b = 0;
    (n = Math.abs(n)), (i = Math.abs(i));
    var m = -d * e * 0.5 - l * a * 0.5,
      p = -d * a * 0.5 + l * e * 0.5,
      y = n * n,
      v = i * i,
      g = p * p,
      x = m * m,
      w = y * v - y * g - v * x,
      M = 0;
    if (0 > w) {
      var P = Math.sqrt(1 - w / (y * v));
      (n *= P), (i *= P);
    } else M = (c === o ? -1 : 1) * Math.sqrt(w / (y * g + v * x));
    var C = (M * n * p) / i,
      k = (-M * i * m) / n,
      T = d * C - l * k + 0.5 * e,
      S = l * C + d * k + 0.5 * a,
      O = r(1, 0, (m - C) / n, (p - k) / i),
      F = r((m - C) / n, (p - k) / i, (-m - C) / n, (-p - k) / i);
    0 === o && F > 0 ? (F -= 2 * u) : 1 === o && 0 > F && (F += 2 * u);
    for (
      var E = Math.ceil(Math.abs((F / u) * 2)),
        Y = [],
        D = F / E,
        X = ((8 / 3) * Math.sin(D / 4) * Math.sin(D / 4)) / Math.sin(D / 2),
        j = O + D,
        I = 0;
      E > I;
      I++
    )
      (Y[I] = t(O, j, d, l, n, i, T, S, X, h, b)),
        (h = Y[I][5]),
        (b = Y[I][6]),
        (O = j),
        (j += D);
    return Y;
  }
  function r(t, e, r, a) {
    var n = Math.atan2(e, t),
      i = Math.atan2(a, r);
    return i >= n ? i - n : 2 * Math.PI - (n - i);
  }
  function a(t, e, r, a, n, i, c, o) {
    var f;
    if (
      fabric.cachesBoundsOfCurve &&
      ((f = k.call(arguments)), fabric.boundsOfCurveCache[f])
    )
      return fabric.boundsOfCurveCache[f];
    var u,
      s,
      l,
      d,
      h,
      b,
      m,
      p,
      y = Math.sqrt,
      v = Math.min,
      g = Math.max,
      x = Math.abs,
      w = [],
      M = [[], []];
    (s = 6 * t - 12 * r + 6 * n),
      (u = -3 * t + 9 * r - 9 * n + 3 * c),
      (l = 3 * r - 3 * t);
    for (var P = 0; 2 > P; ++P)
      if (
        (P > 0 &&
          ((s = 6 * e - 12 * a + 6 * i),
          (u = -3 * e + 9 * a - 9 * i + 3 * o),
          (l = 3 * a - 3 * e)),
        x(u) < 1e-12)
      ) {
        if (x(s) < 1e-12) continue;
        (d = -l / s), d > 0 && 1 > d && w.push(d);
      } else
        (m = s * s - 4 * l * u),
          0 > m ||
            ((p = y(m)),
            (h = (-s + p) / (2 * u)),
            h > 0 && 1 > h && w.push(h),
            (b = (-s - p) / (2 * u)),
            b > 0 && 1 > b && w.push(b));
    for (var C, T, S, O = w.length, F = O; O--; )
      (d = w[O]),
        (S = 1 - d),
        (C =
          S * S * S * t +
          3 * S * S * d * r +
          3 * S * d * d * n +
          d * d * d * c),
        (M[0][O] = C),
        (T =
          S * S * S * e +
          3 * S * S * d * a +
          3 * S * d * d * i +
          d * d * d * o),
        (M[1][O] = T);
    (M[0][F] = t), (M[1][F] = e), (M[0][F + 1] = c), (M[1][F + 1] = o);
    var E = [
      { x: v.apply(null, M[0]), y: v.apply(null, M[1]) },
      { x: g.apply(null, M[0]), y: g.apply(null, M[1]) }
    ];
    return fabric.cachesBoundsOfCurve && (fabric.boundsOfCurveCache[f] = E), E;
  }
  function n(t, r, a) {
    for (
      var n = a[1],
        i = a[2],
        c = a[3],
        o = a[4],
        f = a[5],
        u = a[6],
        s = a[7],
        l = e(u - t, s - r, n, i, o, f, c),
        d = 0,
        h = l.length;
      h > d;
      d++
    )
      (l[d][1] += t),
        (l[d][2] += r),
        (l[d][3] += t),
        (l[d][4] += r),
        (l[d][5] += t),
        (l[d][6] += r);
    return l;
  }
  function i(t) {
    var e,
      r,
      a,
      i,
      c,
      o,
      f = 0,
      u = 0,
      s = t.length,
      l = 0,
      d = 0,
      h = [];
    for (r = 0; s > r; ++r) {
      switch (((a = !1), (e = t[r].slice(0)), e[0])) {
        case 'l':
          (e[0] = 'L'), (e[1] += f), (e[2] += u);
        case 'L':
          (f = e[1]), (u = e[2]);
          break;
        case 'h':
          e[1] += f;
        case 'H':
          (e[0] = 'L'), (e[2] = u), (f = e[1]);
          break;
        case 'v':
          e[1] += u;
        case 'V':
          (e[0] = 'L'), (u = e[1]), (e[1] = f), (e[2] = u);
          break;
        case 'm':
          (e[0] = 'M'), (e[1] += f), (e[2] += u);
        case 'M':
          (f = e[1]), (u = e[2]), (l = e[1]), (d = e[2]);
          break;
        case 'c':
          (e[0] = 'C'),
            (e[1] += f),
            (e[2] += u),
            (e[3] += f),
            (e[4] += u),
            (e[5] += f),
            (e[6] += u);
        case 'C':
          (c = e[3]), (o = e[4]), (f = e[5]), (u = e[6]);
          break;
        case 's':
          (e[0] = 'S'), (e[1] += f), (e[2] += u), (e[3] += f), (e[4] += u);
        case 'S':
          'C' === i ? ((c = 2 * f - c), (o = 2 * u - o)) : ((c = f), (o = u)),
            (f = e[3]),
            (u = e[4]),
            (e[0] = 'C'),
            (e[5] = e[3]),
            (e[6] = e[4]),
            (e[3] = e[1]),
            (e[4] = e[2]),
            (e[1] = c),
            (e[2] = o),
            (c = e[3]),
            (o = e[4]);
          break;
        case 'q':
          (e[0] = 'Q'), (e[1] += f), (e[2] += u), (e[3] += f), (e[4] += u);
        case 'Q':
          (c = e[1]), (o = e[2]), (f = e[3]), (u = e[4]);
          break;
        case 't':
          (e[0] = 'T'), (e[1] += f), (e[2] += u);
        case 'T':
          'Q' === i ? ((c = 2 * f - c), (o = 2 * u - o)) : ((c = f), (o = u)),
            (e[0] = 'Q'),
            (f = e[1]),
            (u = e[2]),
            (e[1] = c),
            (e[2] = o),
            (e[3] = f),
            (e[4] = u);
          break;
        case 'a':
          (e[0] = 'A'), (e[6] += f), (e[7] += u);
        case 'A':
          (a = !0), (h = h.concat(n(f, u, e))), (f = e[6]), (u = e[7]);
          break;
        case 'z':
        case 'Z':
          (f = l), (u = d);
      }
      a || h.push(e), (i = e[0]);
    }
    return h;
  }
  function c(t, e, r, a) {
    return Math.sqrt((r - t) * (r - t) + (a - e) * (a - e));
  }
  function o(t) {
    return t * t * t;
  }
  function f(t) {
    return 3 * t * t * (1 - t);
  }
  function u(t) {
    return 3 * t * (1 - t) * (1 - t);
  }
  function s(t) {
    return (1 - t) * (1 - t) * (1 - t);
  }
  function l(t, e, r, a, n, i, c, l) {
    return function (d) {
      var h = o(d),
        b = f(d),
        m = u(d),
        p = s(d);
      return {
        x: c * h + n * b + r * m + t * p,
        y: l * h + i * b + a * m + e * p
      };
    };
  }
  function d(t, e, r, a, n, i, c, o) {
    return function (f) {
      var u = 1 - f,
        s = 3 * u * u * (r - t) + 6 * u * f * (n - r) + 3 * f * f * (c - n),
        l = 3 * u * u * (a - e) + 6 * u * f * (i - a) + 3 * f * f * (o - i);
      return Math.atan2(l, s);
    };
  }
  function h(t) {
    return t * t;
  }
  function b(t) {
    return 2 * t * (1 - t);
  }
  function m(t) {
    return (1 - t) * (1 - t);
  }
  function p(t, e, r, a, n, i) {
    return function (c) {
      var o = h(c),
        f = b(c),
        u = m(c);
      return { x: n * o + r * f + t * u, y: i * o + a * f + e * u };
    };
  }
  function y(t, e, r, a, n, i) {
    return function (c) {
      var o = 1 - c,
        f = 2 * o * (r - t) + 2 * c * (n - r),
        u = 2 * o * (a - e) + 2 * c * (i - a);
      return Math.atan2(u, f);
    };
  }
  function v(t, e, r) {
    var a,
      n,
      i = { x: e, y: r },
      o = 0;
    for (n = 1; 100 >= n; n += 1)
      (a = t(n / 100)), (o += c(i.x, i.y, a.x, a.y)), (i = a);
    return o;
  }
  function g(t, e) {
    for (
      var r,
        a,
        n,
        i = 0,
        o = 0,
        f = t.iterator,
        u = { x: t.x, y: t.y },
        s = 0.01,
        l = t.angleFinder;
      e > o && s > 1e-4;

    )
      (r = f(i)),
        (n = i),
        (a = c(u.x, u.y, r.x, r.y)),
        a + o > e ? ((i -= s), (s /= 2)) : ((u = r), (i += s), (o += a));
    return (r.angle = l(n)), r;
  }
  function x(t) {
    for (
      var e,
        r,
        a,
        n,
        i = 0,
        o = t.length,
        f = 0,
        u = 0,
        s = 0,
        h = 0,
        b = [],
        m = 0;
      o > m;
      m++
    ) {
      switch (((e = t[m]), (a = { x: f, y: u, command: e[0] }), e[0])) {
        case 'M':
          (a.length = 0), (s = f = e[1]), (h = u = e[2]);
          break;
        case 'L':
          (a.length = c(f, u, e[1], e[2])), (f = e[1]), (u = e[2]);
          break;
        case 'C':
          (r = l(f, u, e[1], e[2], e[3], e[4], e[5], e[6])),
            (n = d(f, u, e[1], e[2], e[3], e[4], e[5], e[6])),
            (a.iterator = r),
            (a.angleFinder = n),
            (a.length = v(r, f, u)),
            (f = e[5]),
            (u = e[6]);
          break;
        case 'Q':
          (r = p(f, u, e[1], e[2], e[3], e[4])),
            (n = y(f, u, e[1], e[2], e[3], e[4])),
            (a.iterator = r),
            (a.angleFinder = n),
            (a.length = v(r, f, u)),
            (f = e[3]),
            (u = e[4]);
          break;
        case 'Z':
        case 'z':
          (a.destX = s),
            (a.destY = h),
            (a.length = c(f, u, s, h)),
            (f = s),
            (u = h);
      }
      (i += a.length), b.push(a);
    }
    return b.push({ length: i, x: f, y: u }), b;
  }
  function w(t, e, r) {
    r || (r = x(t));
    for (var a = 0; e - r[a].length > 0 && a < r.length - 2; )
      (e -= r[a].length), a++;
    var n,
      i = r[a],
      c = e / i.length,
      o = i.command,
      f = t[a];
    switch (o) {
      case 'M':
        return { x: i.x, y: i.y, angle: 0 };
      case 'Z':
      case 'z':
        return (
          (n = new fabric.Point(i.x, i.y).lerp(
            new fabric.Point(i.destX, i.destY),
            c
          )),
          (n.angle = Math.atan2(i.destY - i.y, i.destX - i.x)),
          n
        );
      case 'L':
        return (
          (n = new fabric.Point(i.x, i.y).lerp(
            new fabric.Point(f[1], f[2]),
            c
          )),
          (n.angle = Math.atan2(f[2] - i.y, f[1] - i.x)),
          n
        );
      case 'C':
        return g(i, e);
      case 'Q':
        return g(i, e);
    }
  }
  function M(t) {
    var e,
      r,
      a,
      n,
      i,
      c = [],
      o = [],
      f = fabric.rePathCommand,
      u = '[-+]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][-+]?\\d+)?\\s*',
      s = '(' + u + ')' + fabric.commaWsp,
      l = '([01])' + fabric.commaWsp + '?',
      d = s + '?' + s + '?' + s + l + l + s + '?(' + u + ')',
      h = new RegExp(d, 'g');
    if (!t || !t.match) return c;
    i = t.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);
    for (var b, m = 0, p = i.length; p > m; m++) {
      (e = i[m]), (n = e.slice(1).trim()), (o.length = 0);
      var y = e.charAt(0);
      if (((b = [y]), 'a' === y.toLowerCase()))
        for (var v; (v = h.exec(n)); )
          for (var g = 1; g < v.length; g++) o.push(v[g]);
      else for (; (a = f.exec(n)); ) o.push(a[0]);
      for (var g = 0, x = o.length; x > g; g++)
        (r = parseFloat(o[g])), isNaN(r) || b.push(r);
      var w = T[y.toLowerCase()],
        M = S[y] || y;
      if (b.length - 1 > w)
        for (var P = 1, C = b.length; C > P; P += w)
          c.push([y].concat(b.slice(P, P + w))), (y = M);
      else c.push(b);
    }
    return c;
  }
  function P(t, e) {
    var r,
      a = [],
      n = new fabric.Point(t[0].x, t[0].y),
      i = new fabric.Point(t[1].x, t[1].y),
      c = t.length,
      o = 1,
      f = 0,
      u = c > 2;
    for (
      e = e || 0,
        u &&
          ((o = t[2].x < i.x ? -1 : t[2].x === i.x ? 0 : 1),
          (f = t[2].y < i.y ? -1 : t[2].y === i.y ? 0 : 1)),
        a.push(['M', n.x - o * e, n.y - f * e]),
        r = 1;
      c > r;
      r++
    ) {
      if (!n.eq(i)) {
        var s = n.midPointFrom(i);
        a.push(['Q', n.x, n.y, s.x, s.y]);
      }
      (n = t[r]), r + 1 < t.length && (i = t[r + 1]);
    }
    return (
      u &&
        ((o = n.x > t[r - 2].x ? 1 : n.x === t[r - 2].x ? 0 : -1),
        (f = n.y > t[r - 2].y ? 1 : n.y === t[r - 2].y ? 0 : -1)),
      a.push(['L', n.x + o * e, n.y + f * e]),
      a
    );
  }
  function C(t, e, r) {
    return (
      r &&
        (e = fabric.util.multiplyTransformMatrices(e, [
          1,
          0,
          0,
          1,
          -r.x,
          -r.y
        ])),
      t.map(function (t) {
        for (var r = t.slice(0), a = {}, n = 1; n < t.length - 1; n += 2)
          (a.x = t[n]),
            (a.y = t[n + 1]),
            (a = fabric.util.transformPoint(a, e)),
            (r[n] = a.x),
            (r[n + 1] = a.y);
        return r;
      })
    );
  }
  var k = Array.prototype.join,
    T = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7 },
    S = { m: 'l', M: 'L' };
  (fabric.util.joinPath = function (t) {
    return t
      .map(function (t) {
        return t.join(' ');
      })
      .join(' ');
  }),
    (fabric.util.parsePath = M),
    (fabric.util.makePathSimpler = i),
    (fabric.util.getSmoothPathFromPoints = P),
    (fabric.util.getPathSegmentsInfo = x),
    (fabric.util.getBoundsOfCurve = a),
    (fabric.util.getPointOnPath = w),
    (fabric.util.transformPath = C);
})();
!(function () {
  function t(t, e) {
    for (var r = i.call(arguments, 2), n = [], a = 0, c = t.length; c > a; a++)
      n[a] = r.length ? t[a][e].apply(t[a], r) : t[a][e].call(t[a]);
    return n;
  }
  function e(t, e) {
    return a(t, e, function (t, e) {
      return t >= e;
    });
  }
  function r(t, e) {
    return a(t, e, function (t, e) {
      return e > t;
    });
  }
  function n(t, e) {
    for (var r = t.length; r--; ) t[r] = e;
    return t;
  }
  function a(t, e, r) {
    if (t && 0 !== t.length) {
      var n = t.length - 1,
        a = e ? t[n][e] : t[n];
      if (e) for (; n--; ) r(t[n][e], a) && (a = t[n][e]);
      else for (; n--; ) r(t[n], a) && (a = t[n]);
      return a;
    }
  }
  var i = Array.prototype.slice;
  fabric.util.array = { fill: n, invoke: t, min: r, max: e };
})();
!(function () {
  function e(t, r, n) {
    if (n)
      if (!fabric.isLikelyNode && r instanceof Element) t = r;
      else if (r instanceof Array) {
        t = [];
        for (var a = 0, i = r.length; i > a; a++) t[a] = e({}, r[a], n);
      } else if (r && 'object' == typeof r)
        for (var c in r)
          'canvas' === c || 'group' === c
            ? (t[c] = null)
            : r.hasOwnProperty(c) && (t[c] = e({}, r[c], n));
      else t = r;
    else for (var c in r) t[c] = r[c];
    return t;
  }
  function t(t, r) {
    return e({}, t, r);
  }
  (fabric.util.object = { extend: e, clone: t }),
    fabric.util.object.extend(fabric.util, fabric.Observable);
})();
!(function () {
  function e(e) {
    return e.replace(/-+(.)?/g, function (e, t) {
      return t ? t.toUpperCase() : '';
    });
  }
  function t(e, t) {
    return (
      e.charAt(0).toUpperCase() + (t ? e.slice(1) : e.slice(1).toLowerCase())
    );
  }
  function r(e) {
    return e
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
  function n(e) {
    var t,
      r = 0,
      n = [];
    for (r = 0, t; r < e.length; r++) (t = a(e, r)) !== !1 && n.push(t);
    return n;
  }
  function a(e, t) {
    var r = e.charCodeAt(t);
    if (isNaN(r)) return '';
    if (55296 > r || r > 57343) return e.charAt(t);
    if (r >= 55296 && 56319 >= r) {
      if (e.length <= t + 1)
        throw 'High surrogate without following low surrogate';
      var n = e.charCodeAt(t + 1);
      if (56320 > n || n > 57343)
        throw 'High surrogate without following low surrogate';
      return e.charAt(t) + e.charAt(t + 1);
    }
    if (0 === t) throw 'Low surrogate without preceding high surrogate';
    var a = e.charCodeAt(t - 1);
    if (55296 > a || a > 56319)
      throw 'Low surrogate without preceding high surrogate';
    return !1;
  }
  fabric.util.string = {
    camelize: e,
    capitalize: t,
    escapeXml: r,
    graphemeSplit: n
  };
})();
!(function () {
  function t() {}
  function r(t) {
    for (var r = null, e = this; e.constructor.superclass; ) {
      var a = e.constructor.superclass.prototype[t];
      if (e[t] !== a) {
        r = a;
        break;
      }
      e = e.constructor.superclass.prototype;
    }
    return r
      ? arguments.length > 1
        ? r.apply(this, n.call(arguments, 1))
        : r.call(this)
      : console.log(
          'tried to callSuper ' + t + ', method not found in prototype chain',
          this
        );
  }
  function e() {
    function e() {
      this.initialize.apply(this, arguments);
    }
    var i = null,
      c = n.call(arguments, 0);
    'function' == typeof c[0] && (i = c.shift()),
      (e.superclass = i),
      (e.subclasses = []),
      i &&
        ((t.prototype = i.prototype),
        (e.prototype = new t()),
        i.subclasses.push(e));
    for (var u = 0, f = c.length; f > u; u++) o(e, c[u], i);
    return (
      e.prototype.initialize || (e.prototype.initialize = a),
      (e.prototype.constructor = e),
      (e.prototype.callSuper = r),
      e
    );
  }
  var n = Array.prototype.slice,
    a = function () {},
    i = (function () {
      for (var t in { toString: 1 }) if ('toString' === t) return !1;
      return !0;
    })(),
    o = function (t, r, e) {
      for (var n in r)
        (t.prototype[n] =
          n in t.prototype &&
          'function' == typeof t.prototype[n] &&
          (r[n] + '').indexOf('callSuper') > -1
            ? (function (t) {
                return function () {
                  var n = this.constructor.superclass;
                  this.constructor.superclass = e;
                  var a = r[t].apply(this, arguments);
                  return (
                    (this.constructor.superclass = n),
                    'initialize' !== t ? a : void 0
                  );
                };
              })(n)
            : r[n]),
          i &&
            (r.toString !== Object.prototype.toString &&
              (t.prototype.toString = r.toString),
            r.valueOf !== Object.prototype.valueOf &&
              (t.prototype.valueOf = r.valueOf));
    };
  fabric.util.createClass = e;
})();
!(function () {
  function t(t) {
    var e = t.changedTouches;
    return e && e[0] ? e[0] : t;
  }
  var e = !!fabric.document.createElement('div').attachEvent,
    r = ['touchstart', 'touchmove', 'touchend'];
  (fabric.util.addListener = function (t, r, n, i) {
    t && t.addEventListener(r, n, e ? !1 : i);
  }),
    (fabric.util.removeListener = function (t, r, n, i) {
      t && t.removeEventListener(r, n, e ? !1 : i);
    }),
    (fabric.util.getPointer = function (e) {
      var r = e.target,
        n = fabric.util.getScrollLeftTop(r),
        i = t(e);
      return { x: i.clientX + n.left, y: i.clientY + n.top };
    }),
    (fabric.util.isTouchEvent = function (t) {
      return r.indexOf(t.type) > -1 || 'touch' === t.pointerType;
    });
})();
!(function () {
  function t(t, e) {
    var r = t.style;
    if (!r) return t;
    if ('string' == typeof e)
      return (
        (t.style.cssText += ';' + e),
        e.indexOf('opacity') > -1
          ? a(t, e.match(/opacity:\s*(\d?\.?\d*)/)[1])
          : t
      );
    for (var n in e)
      if ('opacity' === n) a(t, e[n]);
      else {
        var i =
          'float' === n || 'cssFloat' === n
            ? 'undefined' == typeof r.styleFloat
              ? 'cssFloat'
              : 'styleFloat'
            : n;
        r.setProperty(i, e[n]);
      }
    return t;
  }
  var e = fabric.document.createElement('div'),
    r = 'string' == typeof e.style.opacity,
    n = 'string' == typeof e.style.filter,
    i = /alpha\s*\(\s*opacity\s*=\s*([^\)]+)\)/,
    a = function (t) {
      return t;
    };
  r
    ? (a = function (t, e) {
        return (t.style.opacity = e), t;
      })
    : n &&
      (a = function (t, e) {
        var r = t.style;
        return (
          t.currentStyle && !t.currentStyle.hasLayout && (r.zoom = 1),
          i.test(r.filter)
            ? ((e = e >= 0.9999 ? '' : 'alpha(opacity=' + 100 * e + ')'),
              (r.filter = r.filter.replace(i, e)))
            : (r.filter += ' alpha(opacity=' + 100 * e + ')'),
          t
        );
      }),
    (fabric.util.setStyle = t);
})();
!(function () {
  function t(t) {
    return 'string' == typeof t ? fabric.document.getElementById(t) : t;
  }
  function e(t, e) {
    var r = fabric.document.createElement(t);
    for (var n in e)
      'class' === n
        ? (r.className = e[n])
        : 'for' === n
        ? (r.htmlFor = e[n])
        : r.setAttribute(n, e[n]);
    return r;
  }
  function r(t, e) {
    t &&
      -1 === (' ' + t.className + ' ').indexOf(' ' + e + ' ') &&
      (t.className += (t.className ? ' ' : '') + e);
  }
  function n(t, r, n) {
    return (
      'string' == typeof r && (r = e(r, n)),
      t.parentNode && t.parentNode.replaceChild(r, t),
      r.appendChild(t),
      r
    );
  }
  function i(t) {
    for (
      var e = 0,
        r = 0,
        n = fabric.document.documentElement,
        i = fabric.document.body || { scrollLeft: 0, scrollTop: 0 };
      t &&
      (t.parentNode || t.host) &&
      ((t = t.parentNode || t.host),
      t === fabric.document
        ? ((e = i.scrollLeft || n.scrollLeft || 0),
          (r = i.scrollTop || n.scrollTop || 0))
        : ((e += t.scrollLeft || 0), (r += t.scrollTop || 0)),
      1 !== t.nodeType || 'fixed' !== t.style.position);

    );
    return { left: e, top: r };
  }
  function a(t) {
    var e,
      r,
      n = t && t.ownerDocument,
      a = { left: 0, top: 0 },
      o = { left: 0, top: 0 },
      c = {
        borderLeftWidth: 'left',
        borderTopWidth: 'top',
        paddingLeft: 'left',
        paddingTop: 'top'
      };
    if (!n) return o;
    for (var l in c) o[c[l]] += parseInt(d(t, l), 10) || 0;
    return (
      (e = n.documentElement),
      'undefined' != typeof t.getBoundingClientRect &&
        (a = t.getBoundingClientRect()),
      (r = i(t)),
      {
        left: a.left + r.left - (e.clientLeft || 0) + o.left,
        top: a.top + r.top - (e.clientTop || 0) + o.top
      }
    );
  }
  function o(t) {
    var e = fabric.jsdomImplForWrapper(t);
    return e._canvas || e._image;
  }
  function c(t) {
    if (fabric.isLikelyNode) {
      var e = fabric.jsdomImplForWrapper(t);
      e &&
        ((e._image = null),
        (e._canvas = null),
        (e._currentSrc = null),
        (e._attributes = null),
        (e._classList = null));
    }
  }
  function l(t, e) {
    (t.imageSmoothingEnabled =
      t.imageSmoothingEnabled ||
      t.webkitImageSmoothingEnabled ||
      t.mozImageSmoothingEnabled ||
      t.msImageSmoothingEnabled ||
      t.oImageSmoothingEnabled),
      (t.imageSmoothingEnabled = e);
  }
  var f,
    u = Array.prototype.slice,
    s = function (t) {
      return u.call(t, 0);
    };
  try {
    f = s(fabric.document.childNodes) instanceof Array;
  } catch (h) {}
  f ||
    (s = function (t) {
      for (var e = new Array(t.length), r = t.length; r--; ) e[r] = t[r];
      return e;
    });
  var d;
  (d =
    fabric.document.defaultView && fabric.document.defaultView.getComputedStyle
      ? function (t, e) {
          var r = fabric.document.defaultView.getComputedStyle(t, null);
          return r ? r[e] : void 0;
        }
      : function (t, e) {
          var r = t.style[e];
          return !r && t.currentStyle && (r = t.currentStyle[e]), r;
        }),
    (function () {
      function t(t) {
        return (
          'undefined' != typeof t.onselectstart &&
            (t.onselectstart = fabric.util.falseFunction),
          n
            ? (t.style[n] = 'none')
            : 'string' == typeof t.unselectable && (t.unselectable = 'on'),
          t
        );
      }
      function e(t) {
        return (
          'undefined' != typeof t.onselectstart && (t.onselectstart = null),
          n
            ? (t.style[n] = '')
            : 'string' == typeof t.unselectable && (t.unselectable = ''),
          t
        );
      }
      var r = fabric.document.documentElement.style,
        n =
          'userSelect' in r
            ? 'userSelect'
            : 'MozUserSelect' in r
            ? 'MozUserSelect'
            : 'WebkitUserSelect' in r
            ? 'WebkitUserSelect'
            : 'KhtmlUserSelect' in r
            ? 'KhtmlUserSelect'
            : '';
      (fabric.util.makeElementUnselectable = t),
        (fabric.util.makeElementSelectable = e);
    })(),
    (fabric.util.setImageSmoothing = l),
    (fabric.util.getById = t),
    (fabric.util.toArray = s),
    (fabric.util.addClass = r),
    (fabric.util.makeElement = e),
    (fabric.util.wrapElement = n),
    (fabric.util.getScrollLeftTop = i),
    (fabric.util.getElementOffset = a),
    (fabric.util.getNodeCanvas = o),
    (fabric.util.cleanUpJsdomNode = c);
})();
!(function () {
  function t(t, e) {
    return t + (/\?/.test(t) ? '&' : '?') + e;
  }
  function e() {}
  function r(r, n) {
    n || (n = {});
    var i = n.method ? n.method.toUpperCase() : 'GET',
      a = n.onComplete || function () {},
      o = new fabric.window.XMLHttpRequest(),
      c = n.body || n.parameters;
    return (
      (o.onreadystatechange = function () {
        4 === o.readyState && (a(o), (o.onreadystatechange = e));
      }),
      'GET' === i &&
        ((c = null),
        'string' == typeof n.parameters && (r = t(r, n.parameters))),
      o.open(i, r, !0),
      ('POST' === i || 'PUT' === i) &&
        o.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'),
      o.send(c),
      o
    );
  }
  fabric.util.request = r;
})();
(fabric.log = console.log), (fabric.warn = console.warn);
!(function () {
  function t() {
    return !1;
  }
  function e(t, e, r, n) {
    return -r * Math.cos((t / n) * (Math.PI / 2)) + r + e;
  }
  function r(r) {
    r || (r = {});
    var i,
      c = !1,
      u = function () {
        var t = fabric.runningAnimations.indexOf(i);
        return t > -1 && fabric.runningAnimations.splice(t, 1)[0];
      };
    return (
      (i = a(o(r), {
        cancel: function () {
          return (c = !0), u();
        },
        currentValue: 'startValue' in r ? r.startValue : 0,
        completionRate: 0,
        durationRate: 0
      })),
      fabric.runningAnimations.push(i),
      n(function (a) {
        var o,
          s = a || +new Date(),
          f = r.duration || 500,
          l = s + f,
          d = r.onChange || t,
          h = r.abort || t,
          b = r.onComplete || t,
          p = r.easing || e,
          m = 'startValue' in r ? r.startValue.length > 0 : !1,
          g = 'startValue' in r ? r.startValue : 0,
          y = 'endValue' in r ? r.endValue : 100,
          v =
            r.byValue ||
            (m
              ? g.map(function (t, e) {
                  return y[e] - g[e];
                })
              : y - g);
        r.onStart && r.onStart(),
          (function w(t) {
            o = t || +new Date();
            var e = o > l ? f : o - s,
              r = e / f,
              a = m
                ? g.map(function (t, r) {
                    return p(e, g[r], v[r], f);
                  })
                : p(e, g, v, f),
              x = Math.abs(m ? (a[0] - g[0]) / v[0] : (a - g) / v);
            return (
              (i.currentValue = m ? a.slice() : a),
              (i.completionRate = x),
              (i.durationRate = r),
              c
                ? void 0
                : h(a, x, r)
                ? void u()
                : o > l
                ? ((i.currentValue = m ? y.slice() : y),
                  (i.completionRate = 1),
                  (i.durationRate = 1),
                  d(m ? y.slice() : y, 1, 1),
                  b(y, 1, 1),
                  void u())
                : (d(a, x, r), void n(w))
            );
          })(s);
      }),
      i.cancel
    );
  }
  function n() {
    return u.apply(fabric.window, arguments);
  }
  function i() {
    return s.apply(fabric.window, arguments);
  }
  var a = fabric.util.object.extend,
    o = fabric.util.object.clone,
    c = [];
  fabric.util.object.extend(c, {
    cancelAll: function () {
      var t = this.splice(0);
      return (
        t.forEach(function (t) {
          t.cancel();
        }),
        t
      );
    },
    cancelByCanvas: function (t) {
      if (!t) return [];
      var e = this.filter(function (e) {
        return 'object' == typeof e.target && e.target.canvas === t;
      });
      return (
        e.forEach(function (t) {
          t.cancel();
        }),
        e
      );
    },
    cancelByTarget: function (t) {
      var e = this.findAnimationsByTarget(t);
      return (
        e.forEach(function (t) {
          t.cancel();
        }),
        e
      );
    },
    findAnimationIndex: function (t) {
      return this.indexOf(this.findAnimation(t));
    },
    findAnimation: function (t) {
      return this.find(function (e) {
        return e.cancel === t;
      });
    },
    findAnimationsByTarget: function (t) {
      return t
        ? this.filter(function (e) {
            return e.target === t;
          })
        : [];
    }
  });
  var u =
      fabric.window.requestAnimationFrame ||
      fabric.window.webkitRequestAnimationFrame ||
      fabric.window.mozRequestAnimationFrame ||
      fabric.window.oRequestAnimationFrame ||
      fabric.window.msRequestAnimationFrame ||
      function (t) {
        return fabric.window.setTimeout(t, 1e3 / 60);
      },
    s = fabric.window.cancelAnimationFrame || fabric.window.clearTimeout;
  (fabric.util.animate = r),
    (fabric.util.requestAnimFrame = n),
    (fabric.util.cancelAnimFrame = i),
    (fabric.runningAnimations = c);
})();
!(function () {
  function t(t, e, r) {
    var n =
      'rgba(' +
      parseInt(t[0] + r * (e[0] - t[0]), 10) +
      ',' +
      parseInt(t[1] + r * (e[1] - t[1]), 10) +
      ',' +
      parseInt(t[2] + r * (e[2] - t[2]), 10);
    return (
      (n += ',' + (t && e ? parseFloat(t[3] + r * (e[3] - t[3])) : 1)),
      (n += ')')
    );
  }
  function e(e, r, n, i) {
    var a = new fabric.Color(e).getSource(),
      o = new fabric.Color(r).getSource(),
      c = i.onComplete,
      u = i.onChange;
    return (
      (i = i || {}),
      fabric.util.animate(
        fabric.util.object.extend(i, {
          duration: n || 500,
          startValue: a,
          endValue: o,
          byValue: o,
          easing: function (e, r, n, a) {
            var o = i.colorEasing
              ? i.colorEasing(e, a)
              : 1 - Math.cos((e / a) * (Math.PI / 2));
            return t(r, n, o);
          },
          onComplete: function (e, r, n) {
            return c ? c(t(o, o, 0), r, n) : void 0;
          },
          onChange: function (e, r, n) {
            if (u) {
              if (Array.isArray(e)) return u(t(e, e, 0), r, n);
              u(e, r, n);
            }
          }
        })
      )
    );
  }
  fabric.util.animateColor = e;
})();
!(function () {
  function t(t, e, n, r) {
    return (
      t < Math.abs(e)
        ? ((t = e), (r = n / 4))
        : (r =
            0 === e && 0 === t
              ? (n / (2 * Math.PI)) * Math.asin(1)
              : (n / (2 * Math.PI)) * Math.asin(e / t)),
      { a: t, c: e, p: n, s: r }
    );
  }
  function e(t, e, n) {
    return (
      t.a *
      Math.pow(2, 10 * (e -= 1)) *
      Math.sin((2 * (e * n - t.s) * Math.PI) / t.p)
    );
  }
  function n(t, e, n, r) {
    return n * ((t = t / r - 1) * t * t + 1) + e;
  }
  function r(t, e, n, r) {
    return (
      (t /= r / 2),
      1 > t ? (n / 2) * t * t * t + e : (n / 2) * ((t -= 2) * t * t + 2) + e
    );
  }
  function i(t, e, n, r) {
    return n * (t /= r) * t * t * t + e;
  }
  function a(t, e, n, r) {
    return -n * ((t = t / r - 1) * t * t * t - 1) + e;
  }
  function o(t, e, n, r) {
    return (
      (t /= r / 2),
      1 > t
        ? (n / 2) * t * t * t * t + e
        : (-n / 2) * ((t -= 2) * t * t * t - 2) + e
    );
  }
  function c(t, e, n, r) {
    return n * (t /= r) * t * t * t * t + e;
  }
  function u(t, e, n, r) {
    return n * ((t = t / r - 1) * t * t * t * t + 1) + e;
  }
  function s(t, e, n, r) {
    return (
      (t /= r / 2),
      1 > t
        ? (n / 2) * t * t * t * t * t + e
        : (n / 2) * ((t -= 2) * t * t * t * t + 2) + e
    );
  }
  function f(t, e, n, r) {
    return -n * Math.cos((t / r) * (Math.PI / 2)) + n + e;
  }
  function l(t, e, n, r) {
    return n * Math.sin((t / r) * (Math.PI / 2)) + e;
  }
  function h(t, e, n, r) {
    return (-n / 2) * (Math.cos((Math.PI * t) / r) - 1) + e;
  }
  function d(t, e, n, r) {
    return 0 === t ? e : n * Math.pow(2, 10 * (t / r - 1)) + e;
  }
  function p(t, e, n, r) {
    return t === r ? e + n : n * (-Math.pow(2, (-10 * t) / r) + 1) + e;
  }
  function b(t, e, n, r) {
    return 0 === t
      ? e
      : t === r
      ? e + n
      : ((t /= r / 2),
        1 > t
          ? (n / 2) * Math.pow(2, 10 * (t - 1)) + e
          : (n / 2) * (-Math.pow(2, -10 * --t) + 2) + e);
  }
  function m(t, e, n, r) {
    return -n * (Math.sqrt(1 - (t /= r) * t) - 1) + e;
  }
  function g(t, e, n, r) {
    return n * Math.sqrt(1 - (t = t / r - 1) * t) + e;
  }
  function y(t, e, n, r) {
    return (
      (t /= r / 2),
      1 > t
        ? (-n / 2) * (Math.sqrt(1 - t * t) - 1) + e
        : (n / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + e
    );
  }
  function v(n, r, i, a) {
    var o = 1.70158,
      c = 0,
      u = i;
    if (0 === n) return r;
    if (((n /= a), 1 === n)) return r + i;
    c || (c = 0.3 * a);
    var s = t(u, i, c, o);
    return -e(s, n, a) + r;
  }
  function w(e, n, r, i) {
    var a = 1.70158,
      o = 0,
      c = r;
    if (0 === e) return n;
    if (((e /= i), 1 === e)) return n + r;
    o || (o = 0.3 * i);
    var u = t(c, r, o, a);
    return (
      u.a *
        Math.pow(2, -10 * e) *
        Math.sin((2 * (e * i - u.s) * Math.PI) / u.p) +
      u.c +
      n
    );
  }
  function x(n, r, i, a) {
    var o = 1.70158,
      c = 0,
      u = i;
    if (0 === n) return r;
    if (((n /= a / 2), 2 === n)) return r + i;
    c || (c = 0.3 * a * 1.5);
    var s = t(u, i, c, o);
    return 1 > n
      ? -0.5 * e(s, n, a) + r
      : s.a *
          Math.pow(2, -10 * (n -= 1)) *
          Math.sin((2 * (n * a - s.s) * Math.PI) / s.p) *
          0.5 +
          s.c +
          r;
  }
  function M(t, e, n, r, i) {
    return (
      void 0 === i && (i = 1.70158), n * (t /= r) * t * ((i + 1) * t - i) + e
    );
  }
  function C(t, e, n, r, i) {
    return (
      void 0 === i && (i = 1.70158),
      n * ((t = t / r - 1) * t * ((i + 1) * t + i) + 1) + e
    );
  }
  function O(t, e, n, r, i) {
    return (
      void 0 === i && (i = 1.70158),
      (t /= r / 2),
      1 > t
        ? (n / 2) * t * t * (((i *= 1.525) + 1) * t - i) + e
        : (n / 2) * ((t -= 2) * t * (((i *= 1.525) + 1) * t + i) + 2) + e
    );
  }
  function S(t, e, n, r) {
    return n - P(r - t, 0, n, r) + e;
  }
  function P(t, e, n, r) {
    return (t /= r) < 1 / 2.75
      ? 7.5625 * n * t * t + e
      : 2 / 2.75 > t
      ? n * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + e
      : 2.5 / 2.75 > t
      ? n * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + e
      : n * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + e;
  }
  function T(t, e, n, r) {
    return r / 2 > t
      ? 0.5 * S(2 * t, 0, n, r) + e
      : 0.5 * P(2 * t - r, 0, n, r) + 0.5 * n + e;
  }
  fabric.util.ease = {
    easeInQuad: function (t, e, n, r) {
      return n * (t /= r) * t + e;
    },
    easeOutQuad: function (t, e, n, r) {
      return -n * (t /= r) * (t - 2) + e;
    },
    easeInOutQuad: function (t, e, n, r) {
      return (
        (t /= r / 2),
        1 > t ? (n / 2) * t * t + e : (-n / 2) * (--t * (t - 2) - 1) + e
      );
    },
    easeInCubic: function (t, e, n, r) {
      return n * (t /= r) * t * t + e;
    },
    easeOutCubic: n,
    easeInOutCubic: r,
    easeInQuart: i,
    easeOutQuart: a,
    easeInOutQuart: o,
    easeInQuint: c,
    easeOutQuint: u,
    easeInOutQuint: s,
    easeInSine: f,
    easeOutSine: l,
    easeInOutSine: h,
    easeInExpo: d,
    easeOutExpo: p,
    easeInOutExpo: b,
    easeInCirc: m,
    easeOutCirc: g,
    easeInOutCirc: y,
    easeInElastic: v,
    easeOutElastic: w,
    easeInOutElastic: x,
    easeInBack: M,
    easeOutBack: C,
    easeInOutBack: O,
    easeInBounce: S,
    easeOutBounce: P,
    easeInOutBounce: T
  };
})();
!(function (t) {
  'use strict';
  function e(t) {
    return t in k ? k[t] : t;
  }
  function r(t, e, r, n) {
    var i,
      a = Array.isArray(e);
    if (('fill' !== t && 'stroke' !== t) || 'none' !== e) {
      if ('strokeUniform' === t) return 'non-scaling-stroke' === e;
      if ('strokeDashArray' === t)
        e =
          'none' === e
            ? null
            : e.replace(/,/g, ' ').split(/\s+/).map(parseFloat);
      else if ('transformMatrix' === t)
        e =
          r && r.transformMatrix
            ? A(r.transformMatrix, b.parseTransformAttribute(e))
            : b.parseTransformAttribute(e);
      else if ('visible' === t)
        (e = 'none' !== e && 'hidden' !== e), r && r.visible === !1 && (e = !1);
      else if ('opacity' === t)
        (e = parseFloat(e)),
          r && 'undefined' != typeof r.opacity && (e *= r.opacity);
      else if ('textAnchor' === t)
        e = 'start' === e ? 'left' : 'end' === e ? 'right' : 'center';
      else if ('charSpacing' === t) i = (w(e, n) / n) * 1e3;
      else if ('paintFirst' === t) {
        var o = e.indexOf('fill'),
          c = e.indexOf('stroke'),
          e = 'fill';
        o > -1 && c > -1 && o > c
          ? (e = 'stroke')
          : -1 === o && c > -1 && (e = 'stroke');
      } else {
        if ('href' === t || 'xlink:href' === t || 'font' === t) return e;
        if ('imageSmoothing' === t) return 'optimizeQuality' === e;
        i = a ? e.map(w) : w(e, n);
      }
    } else e = '';
    return !a && isNaN(i) ? e : i;
  }
  function n(t) {
    return new RegExp('^(' + t.join('|') + ')\\b', 'i');
  }
  function i(t) {
    for (var e in O)
      if ('undefined' != typeof t[O[e]] && '' !== t[e]) {
        if ('undefined' == typeof t[e]) {
          if (!b.Object.prototype[e]) continue;
          t[e] = b.Object.prototype[e];
        }
        if (0 !== t[e].indexOf('url(')) {
          var r = new b.Color(t[e]);
          t[e] = r.setAlpha(x(r.getAlpha() * t[O[e]], 2)).toRgba();
        }
      }
    return t;
  }
  function a(t, e) {
    var r,
      n,
      i,
      a,
      o = [];
    for (i = 0, a = e.length; a > i; i++)
      (r = e[i]),
        (n = t.getElementsByTagName(r)),
        (o = o.concat(Array.prototype.slice.call(n)));
    return o;
  }
  function o(t, e) {
    var r, n;
    t.replace(/;\s*$/, '')
      .split(';')
      .forEach(function (t) {
        var i = t.split(':');
        (r = i[0].trim().toLowerCase()), (n = i[1].trim()), (e[r] = n);
      });
  }
  function c(t, e) {
    var r, n;
    for (var i in t)
      'undefined' != typeof t[i] &&
        ((r = i.toLowerCase()), (n = t[i]), (e[r] = n));
  }
  function s(t, e) {
    var r = {};
    for (var n in b.cssRules[e])
      if (u(t, n.split(' ')))
        for (var i in b.cssRules[e][n]) r[i] = b.cssRules[e][n][i];
    return r;
  }
  function u(t, e) {
    var r,
      n = !0;
    return (
      (r = f(t, e.pop())),
      r && e.length && (n = l(t, e)),
      r && n && 0 === e.length
    );
  }
  function l(t, e) {
    for (
      var r, n = !0;
      t.parentNode && 1 === t.parentNode.nodeType && e.length;

    )
      n && (r = e.pop()), (t = t.parentNode), (n = f(t, r));
    return 0 === e.length;
  }
  function f(t, e) {
    var r,
      n,
      i = t.nodeName,
      a = t.getAttribute('class'),
      o = t.getAttribute('id');
    if (
      ((r = new RegExp('^' + i, 'i')),
      (e = e.replace(r, '')),
      o &&
        e.length &&
        ((r = new RegExp('#' + o + '(?![a-zA-Z\\-]+)', 'i')),
        (e = e.replace(r, ''))),
      a && e.length)
    )
      for (a = a.split(' '), n = a.length; n--; )
        (r = new RegExp('\\.' + a[n] + '(?![a-zA-Z\\-]+)', 'i')),
          (e = e.replace(r, ''));
    return 0 === e.length;
  }
  function d(t, e) {
    var r;
    if ((t.getElementById && (r = t.getElementById(e)), r)) return r;
    var n,
      i,
      a,
      o = t.getElementsByTagName('*');
    for (i = 0, a = o.length; a > i; i++)
      if (((n = o[i]), e === n.getAttribute('id'))) return n;
  }
  function h(t) {
    for (var e = a(t, ['use', 'svg:use']), r = 0; e.length && r < e.length; ) {
      var n = e[r],
        i = n.getAttribute('xlink:href') || n.getAttribute('href');
      if (null === i) return;
      var o,
        c,
        s,
        u,
        l,
        f = i.slice(1),
        h = n.getAttribute('x') || 0,
        m = n.getAttribute('y') || 0,
        g = d(t, f).cloneNode(!0),
        v =
          (g.getAttribute('transform') || '') +
          ' translate(' +
          h +
          ', ' +
          m +
          ')',
        y = e.length,
        x = b.svgNS;
      if ((p(g), /^svg$/i.test(g.nodeName))) {
        var w = g.ownerDocument.createElementNS(x, 'g');
        for (s = 0, u = g.attributes, l = u.length; l > s; s++)
          (c = u.item(s)), w.setAttributeNS(x, c.nodeName, c.nodeValue);
        for (; g.firstChild; ) w.appendChild(g.firstChild);
        g = w;
      }
      for (s = 0, u = n.attributes, l = u.length; l > s; s++)
        (c = u.item(s)),
          'x' !== c.nodeName &&
            'y' !== c.nodeName &&
            'xlink:href' !== c.nodeName &&
            'href' !== c.nodeName &&
            ('transform' === c.nodeName
              ? (v = c.nodeValue + ' ' + v)
              : g.setAttribute(c.nodeName, c.nodeValue));
      g.setAttribute('transform', v),
        g.setAttribute('instantiated_by_use', '1'),
        g.removeAttribute('id'),
        (o = n.parentNode),
        o.replaceChild(g, n),
        e.length === y && r++;
    }
  }
  function p(t) {
    if (!b.svgViewBoxElementsRegEx.test(t.nodeName)) return {};
    var e,
      r,
      n,
      i,
      a = t.getAttribute('viewBox'),
      o = 1,
      c = 1,
      s = 0,
      u = 0,
      l = t.getAttribute('width'),
      f = t.getAttribute('height'),
      d = t.getAttribute('x') || 0,
      h = t.getAttribute('y') || 0,
      p = t.getAttribute('preserveAspectRatio') || '',
      m = !a || !(a = a.match(N)),
      g = !l || !f || '100%' === l || '100%' === f,
      v = m && g,
      y = {},
      x = '',
      A = 0,
      M = 0;
    if (
      ((y.width = 0),
      (y.height = 0),
      (y.toBeParsed = v),
      m &&
        (d || h) &&
        t.parentNode &&
        '#document' !== t.parentNode.nodeName &&
        ((x = ' translate(' + w(d) + ' ' + w(h) + ') '),
        (n = (t.getAttribute('transform') || '') + x),
        t.setAttribute('transform', n),
        t.removeAttribute('x'),
        t.removeAttribute('y')),
      v)
    )
      return y;
    if (m) return (y.width = w(l)), (y.height = w(f)), y;
    if (
      ((s = -parseFloat(a[1])),
      (u = -parseFloat(a[2])),
      (e = parseFloat(a[3])),
      (r = parseFloat(a[4])),
      (y.minX = s),
      (y.minY = u),
      (y.viewBoxWidth = e),
      (y.viewBoxHeight = r),
      g
        ? ((y.width = e), (y.height = r))
        : ((y.width = w(l)),
          (y.height = w(f)),
          (o = y.width / e),
          (c = y.height / r)),
      (p = b.util.parsePreserveAspectRatioAttribute(p)),
      'none' !== p.alignX &&
        ('meet' === p.meetOrSlice && (c = o = o > c ? c : o),
        'slice' === p.meetOrSlice && (c = o = o > c ? o : c),
        (A = y.width - e * o),
        (M = y.height - r * o),
        'Mid' === p.alignX && (A /= 2),
        'Mid' === p.alignY && (M /= 2),
        'Min' === p.alignX && (A = 0),
        'Min' === p.alignY && (M = 0)),
      1 === o && 1 === c && 0 === s && 0 === u && 0 === d && 0 === h)
    )
      return y;
    if (
      ((d || h) &&
        '#document' !== t.parentNode.nodeName &&
        (x = ' translate(' + w(d) + ' ' + w(h) + ') '),
      (n =
        x +
        ' matrix(' +
        o +
        ' 0 0 ' +
        c +
        ' ' +
        (s * o + A) +
        ' ' +
        (u * c + M) +
        ') '),
      'svg' === t.nodeName)
    ) {
      for (i = t.ownerDocument.createElementNS(b.svgNS, 'g'); t.firstChild; )
        i.appendChild(t.firstChild);
      t.appendChild(i);
    } else
      (i = t),
        i.removeAttribute('x'),
        i.removeAttribute('y'),
        (n = i.getAttribute('transform') + n);
    return i.setAttribute('transform', n), y;
  }
  function m(t, e) {
    for (; t && (t = t.parentNode); )
      if (
        t.nodeName &&
        e.test(t.nodeName.replace('svg:', '')) &&
        !t.getAttribute('instantiated_by_use')
      )
        return !0;
    return !1;
  }
  function g(t, e) {
    var r = [
        'gradientTransform',
        'x1',
        'x2',
        'y1',
        'y2',
        'gradientUnits',
        'cx',
        'cy',
        'r',
        'fx',
        'fy'
      ],
      n = 'xlink:href',
      i = e.getAttribute(n).slice(1),
      a = d(t, i);
    if (
      (a && a.getAttribute(n) && g(t, a),
      r.forEach(function (t) {
        a &&
          !e.hasAttribute(t) &&
          a.hasAttribute(t) &&
          e.setAttribute(t, a.getAttribute(t));
      }),
      !e.children.length)
    )
      for (var o = a.cloneNode(!0); o.firstChild; ) e.appendChild(o.firstChild);
    e.removeAttribute(n);
  }
  var b = t.fabric || (t.fabric = {}),
    v = b.util.object.extend,
    y = b.util.object.clone,
    x = b.util.toFixed,
    w = b.util.parseUnit,
    A = b.util.multiplyTransformMatrices,
    M = [
      'path',
      'circle',
      'polygon',
      'polyline',
      'ellipse',
      'rect',
      'line',
      'image',
      'text'
    ],
    S = ['symbol', 'image', 'marker', 'pattern', 'view', 'svg'],
    E = ['pattern', 'defs', 'symbol', 'metadata', 'clipPath', 'mask', 'desc'],
    C = ['symbol', 'g', 'a', 'svg', 'clipPath', 'defs'],
    k = {
      cx: 'left',
      x: 'left',
      r: 'radius',
      cy: 'top',
      y: 'top',
      display: 'visible',
      visibility: 'visible',
      transform: 'transformMatrix',
      'fill-opacity': 'fillOpacity',
      'fill-rule': 'fillRule',
      'font-family': 'fontFamily',
      'font-size': 'fontSize',
      'font-style': 'fontStyle',
      'font-weight': 'fontWeight',
      'letter-spacing': 'charSpacing',
      'paint-order': 'paintFirst',
      'stroke-dasharray': 'strokeDashArray',
      'stroke-dashoffset': 'strokeDashOffset',
      'stroke-linecap': 'strokeLineCap',
      'stroke-linejoin': 'strokeLineJoin',
      'stroke-miterlimit': 'strokeMiterLimit',
      'stroke-opacity': 'strokeOpacity',
      'stroke-width': 'strokeWidth',
      'text-decoration': 'textDecoration',
      'text-anchor': 'textAnchor',
      opacity: 'opacity',
      'clip-path': 'clipPath',
      'clip-rule': 'clipRule',
      'vector-effect': 'strokeUniform',
      'image-rendering': 'imageSmoothing'
    },
    O = { stroke: 'strokeOpacity', fill: 'fillOpacity' },
    P = 'font-size',
    T = 'clip-path';
  (b.svgValidTagNamesRegEx = n(M)),
    (b.svgViewBoxElementsRegEx = n(S)),
    (b.svgInvalidAncestorsRegEx = n(E)),
    (b.svgValidParentsRegEx = n(C)),
    (b.cssRules = {}),
    (b.gradientDefs = {}),
    (b.clipPaths = {}),
    (b.parseTransformAttribute = (function () {
      function t(t, e) {
        var r = b.util.cos(e[0]),
          n = b.util.sin(e[0]),
          i = 0,
          a = 0;
        3 === e.length && ((i = e[1]), (a = e[2])),
          (t[0] = r),
          (t[1] = n),
          (t[2] = -n),
          (t[3] = r),
          (t[4] = i - (r * i - n * a)),
          (t[5] = a - (n * i + r * a));
      }
      function e(t, e) {
        var r = e[0],
          n = 2 === e.length ? e[1] : e[0];
        (t[0] = r), (t[3] = n);
      }
      function r(t, e, r) {
        t[r] = Math.tan(b.util.degreesToRadians(e[0]));
      }
      function n(t, e) {
        (t[4] = e[0]), 2 === e.length && (t[5] = e[1]);
      }
      var i = b.iMatrix,
        a = b.reNum,
        o = b.commaWsp,
        c = '(?:(skewX)\\s*\\(\\s*(' + a + ')\\s*\\))',
        s = '(?:(skewY)\\s*\\(\\s*(' + a + ')\\s*\\))',
        u =
          '(?:(rotate)\\s*\\(\\s*(' +
          a +
          ')(?:' +
          o +
          '(' +
          a +
          ')' +
          o +
          '(' +
          a +
          '))?\\s*\\))',
        l = '(?:(scale)\\s*\\(\\s*(' + a + ')(?:' + o + '(' + a + '))?\\s*\\))',
        f =
          '(?:(translate)\\s*\\(\\s*(' +
          a +
          ')(?:' +
          o +
          '(' +
          a +
          '))?\\s*\\))',
        d =
          '(?:(matrix)\\s*\\(\\s*(' +
          a +
          ')' +
          o +
          '(' +
          a +
          ')' +
          o +
          '(' +
          a +
          ')' +
          o +
          '(' +
          a +
          ')' +
          o +
          '(' +
          a +
          ')' +
          o +
          '(' +
          a +
          ')\\s*\\))',
        h = '(?:' + d + '|' + f + '|' + l + '|' + u + '|' + c + '|' + s + ')',
        p = '(?:' + h + '(?:' + o + '*' + h + ')*)',
        m = '^\\s*(?:' + p + '?)\\s*$',
        g = new RegExp(m),
        v = new RegExp(h, 'g');
      return function (a) {
        var o = i.concat(),
          c = [];
        if (!a || (a && !g.test(a))) return o;
        a.replace(v, function (a) {
          var s = new RegExp(h).exec(a).filter(function (t) {
              return !!t;
            }),
            u = s[1],
            l = s.slice(2).map(parseFloat);
          switch (u) {
            case 'translate':
              n(o, l);
              break;
            case 'rotate':
              (l[0] = b.util.degreesToRadians(l[0])), t(o, l);
              break;
            case 'scale':
              e(o, l);
              break;
            case 'skewX':
              r(o, l, 2);
              break;
            case 'skewY':
              r(o, l, 1);
              break;
            case 'matrix':
              o = l;
          }
          c.push(o.concat()), (o = i.concat());
        });
        for (var s = c[0]; c.length > 1; )
          c.shift(), (s = b.util.multiplyTransformMatrices(s, c[0]));
        return s;
      };
    })());
  var N = new RegExp(
    '^\\s*(' +
      b.reNum +
      '+)\\s*,?\\s*(' +
      b.reNum +
      '+)\\s*,?\\s*(' +
      b.reNum +
      '+)\\s*,?\\s*(' +
      b.reNum +
      '+)\\s*$'
  );
  b.parseSVGDocument = function (t, e, r, n) {
    if (t) {
      h(t);
      var i,
        a,
        o = b.Object.__uid++,
        c = p(t),
        s = b.util.toArray(t.getElementsByTagName('*'));
      if (
        ((c.crossOrigin = n && n.crossOrigin),
        (c.svgUid = o),
        0 === s.length && b.isLikelyNode)
      ) {
        s = t.selectNodes('//*[name(.)!="svg"]');
        var u = [];
        for (i = 0, a = s.length; a > i; i++) u[i] = s[i];
        s = u;
      }
      var l = s.filter(function (t) {
        return (
          p(t),
          b.svgValidTagNamesRegEx.test(t.nodeName.replace('svg:', '')) &&
            !m(t, b.svgInvalidAncestorsRegEx)
        );
      });
      if (!l || (l && !l.length)) return void (e && e([], {}));
      var f = {};
      s
        .filter(function (t) {
          return 'clipPath' === t.nodeName.replace('svg:', '');
        })
        .forEach(function (t) {
          var e = t.getAttribute('id');
          f[e] = b.util
            .toArray(t.getElementsByTagName('*'))
            .filter(function (t) {
              return b.svgValidTagNamesRegEx.test(
                t.nodeName.replace('svg:', '')
              );
            });
        }),
        (b.gradientDefs[o] = b.getGradientDefs(t)),
        (b.cssRules[o] = b.getCSSRules(t)),
        (b.clipPaths[o] = f),
        b.parseElements(
          l,
          function (t, r) {
            e &&
              (e(t, c, r, s),
              delete b.gradientDefs[o],
              delete b.cssRules[o],
              delete b.clipPaths[o]);
          },
          y(c),
          r,
          n
        );
    }
  };
  var I = new RegExp(
    '(normal|italic)?\\s*(normal|small-caps)?\\s*(normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900)?\\s*(' +
      b.reNum +
      '(?:px|cm|mm|em|pt|pc|in)*)(?:\\/(normal|' +
      b.reNum +
      '))?\\s+(.*)'
  );
  v(b, {
    parseFontDeclaration: function (t, e) {
      var r = t.match(I);
      if (r) {
        var n = r[1],
          i = r[3],
          a = r[4],
          o = r[5],
          c = r[6];
        n && (e.fontStyle = n),
          i && (e.fontWeight = isNaN(parseFloat(i)) ? i : parseFloat(i)),
          a && (e.fontSize = w(a)),
          c && (e.fontFamily = c),
          o && (e.lineHeight = 'normal' === o ? 1 : o);
      }
    },
    getGradientDefs: function (t) {
      var e,
        r = [
          'linearGradient',
          'radialGradient',
          'svg:linearGradient',
          'svg:radialGradient'
        ],
        n = a(t, r),
        i = 0,
        o = {};
      for (i = n.length; i--; )
        (e = n[i]),
          e.getAttribute('xlink:href') && g(t, e),
          (o[e.getAttribute('id')] = e);
      return o;
    },
    parseAttributes: function (t, n, a) {
      if (t) {
        var o,
          c,
          u,
          l = {};
        'undefined' == typeof a && (a = t.getAttribute('svgUid')),
          t.parentNode &&
            b.svgValidParentsRegEx.test(t.parentNode.nodeName) &&
            (l = b.parseAttributes(t.parentNode, n, a));
        var f = n.reduce(function (e, r) {
            return (o = t.getAttribute(r)), o && (e[r] = o), e;
          }, {}),
          d = v(s(t, a), b.parseStyleAttribute(t));
        (f = v(f, d)),
          d[T] && t.setAttribute(T, d[T]),
          (c = u = l.fontSize || b.Text.DEFAULT_SVG_FONT_SIZE),
          f[P] && (f[P] = c = w(f[P], u));
        var h,
          p,
          m = {};
        for (var g in f) (h = e(g)), (p = r(h, f[g], l, c)), (m[h] = p);
        m && m.font && b.parseFontDeclaration(m.font, m);
        var y = v(l, m);
        return b.svgValidParentsRegEx.test(t.nodeName) ? y : i(y);
      }
    },
    parseElements: function (t, e, r, n, i) {
      new b.ElementsParser(t, e, r, n, i).parse();
    },
    parseStyleAttribute: function (t) {
      var e = {},
        r = t.getAttribute('style');
      return r ? ('string' == typeof r ? o(r, e) : c(r, e), e) : e;
    },
    parsePointsAttribute: function (t) {
      if (!t) return null;
      (t = t.replace(/,/g, ' ').trim()), (t = t.split(/\s+/));
      var e,
        r,
        n = [];
      for (e = 0, r = t.length; r > e; e += 2)
        n.push({ x: parseFloat(t[e]), y: parseFloat(t[e + 1]) });
      return n;
    },
    getCSSRules: function (t) {
      var e,
        r,
        n,
        i = t.getElementsByTagName('style'),
        a = {};
      for (e = 0, r = i.length; r > e; e++) {
        var o = i[e].textContent;
        (o = o.replace(/\/\*[\s\S]*?\*\//g, '')),
          '' !== o.trim() &&
            ((n = o.split('}')),
            (n = n.filter(function (t) {
              return t.trim();
            })),
            n.forEach(function (t) {
              var n = t.split('{'),
                i = {},
                o = n[1].trim(),
                c = o.split(';').filter(function (t) {
                  return t.trim();
                });
              for (e = 0, r = c.length; r > e; e++) {
                var s = c[e].split(':'),
                  u = s[0].trim(),
                  l = s[1].trim();
                i[u] = l;
              }
              (t = n[0].trim()),
                t.split(',').forEach(function (t) {
                  (t = t.replace(/^svg/i, '').trim()),
                    '' !== t &&
                      (a[t]
                        ? b.util.object.extend(a[t], i)
                        : (a[t] = b.util.object.clone(i)));
                });
            }));
      }
      return a;
    },
    loadSVGFromURL: function (t, e, r, n) {
      function i(t) {
        var i = t.responseXML;
        return i && i.documentElement
          ? void b.parseSVGDocument(
              i.documentElement,
              function (t, r, n, i) {
                e && e(t, r, n, i);
              },
              r,
              n
            )
          : (e && e(null), !1);
      }
      (t = t.replace(/^\n\s*/, '').trim()),
        new b.util.request(t, { method: 'get', onComplete: i });
    },
    loadSVGFromString: function (t, e, r, n) {
      var i = new b.window.DOMParser(),
        a = i.parseFromString(t.trim(), 'text/xml');
      b.parseSVGDocument(
        a.documentElement,
        function (t, r, n, i) {
          e(t, r, n, i);
        },
        r,
        n
      );
    }
  });
})('undefined' != typeof exports ? exports : this);
(fabric.ElementsParser = function (t, e, r, n, i, a) {
  (this.elements = t),
    (this.callback = e),
    (this.options = r),
    (this.reviver = n),
    (this.svgUid = (r && r.svgUid) || 0),
    (this.parsingOptions = i),
    (this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g),
    (this.doc = a);
}),
  (function (t) {
    (t.parse = function () {
      (this.instances = new Array(this.elements.length)),
        (this.numElements = this.elements.length),
        this.createObjects();
    }),
      (t.createObjects = function () {
        var t = this;
        this.elements.forEach(function (e, r) {
          e.setAttribute('svgUid', t.svgUid), t.createObject(e, r);
        });
      }),
      (t.findTag = function (t) {
        return fabric[
          fabric.util.string.capitalize(t.tagName.replace('svg:', ''))
        ];
      }),
      (t.createObject = function (t, e) {
        var r = this.findTag(t);
        if (r && r.fromElement)
          try {
            r.fromElement(t, this.createCallback(e, t), this.options);
          } catch (n) {
            fabric.log(n);
          }
        else this.checkIfDone();
      }),
      (t.createCallback = function (t, e) {
        var r = this;
        return function (n) {
          var i;
          r.resolveGradient(n, e, 'fill'),
            r.resolveGradient(n, e, 'stroke'),
            n instanceof fabric.Image &&
              n._originalElement &&
              (i = n.parsePreserveAspectRatioAttribute(e)),
            n._removeTransformMatrix(i),
            r.resolveClipPath(n, e),
            r.reviver && r.reviver(e, n),
            (r.instances[t] = n),
            r.checkIfDone();
        };
      }),
      (t.extractPropertyDefinition = function (t, e, r) {
        var n = t[e],
          i = this.regexUrl;
        if (i.test(n)) {
          i.lastIndex = 0;
          var a = i.exec(n)[1];
          return (i.lastIndex = 0), fabric[r][this.svgUid][a];
        }
      }),
      (t.resolveGradient = function (t, e, r) {
        var n = this.extractPropertyDefinition(t, r, 'gradientDefs');
        if (n) {
          var i = e.getAttribute(r + '-opacity'),
            a = fabric.Gradient.fromElement(n, t, i, this.options);
          t.set(r, a);
        }
      }),
      (t.createClipPathCallback = function (t, e) {
        return function (t) {
          t._removeTransformMatrix(), (t.fillRule = t.clipRule), e.push(t);
        };
      }),
      (t.resolveClipPath = function (t, e) {
        var r,
          n,
          i,
          a,
          o,
          c,
          s = this.extractPropertyDefinition(t, 'clipPath', 'clipPaths');
        if (s) {
          (a = []), (i = fabric.util.invertTransform(t.calcTransformMatrix()));
          for (
            var u = s[0].parentNode, l = e;
            l.parentNode && l.getAttribute('clip-path') !== t.clipPath;

          )
            l = l.parentNode;
          l.parentNode.appendChild(u);
          for (var f = 0; f < s.length; f++)
            (r = s[f]),
              (n = this.findTag(r)),
              n.fromElement(r, this.createClipPathCallback(t, a), this.options);
          (s = 1 === a.length ? a[0] : new fabric.Group(a)),
            (o = fabric.util.multiplyTransformMatrices(
              i,
              s.calcTransformMatrix()
            )),
            s.clipPath && this.resolveClipPath(s, l);
          var c = fabric.util.qrDecompose(o);
          (s.flipX = !1),
            (s.flipY = !1),
            s.set('scaleX', c.scaleX),
            s.set('scaleY', c.scaleY),
            (s.angle = c.angle),
            (s.skewX = c.skewX),
            (s.skewY = 0),
            s.setPositionByOrigin(
              { x: c.translateX, y: c.translateY },
              'center',
              'center'
            ),
            (t.clipPath = s);
        } else delete t.clipPath;
      }),
      (t.checkIfDone = function () {
        0 === --this.numElements &&
          ((this.instances = this.instances.filter(function (t) {
            return null != t;
          })),
          this.callback(this.instances, this.elements));
      });
  })(fabric.ElementsParser.prototype);
!(function (t) {
  'use strict';
  function e(t, e) {
    (this.x = t), (this.y = e);
  }
  var r = t.fabric || (t.fabric = {});
  return r.Point
    ? void r.warn('fabric.Point is already defined')
    : ((r.Point = e),
      void (e.prototype = {
        type: 'point',
        constructor: e,
        add: function (t) {
          return new e(this.x + t.x, this.y + t.y);
        },
        addEquals: function (t) {
          return (this.x += t.x), (this.y += t.y), this;
        },
        scalarAdd: function (t) {
          return new e(this.x + t, this.y + t);
        },
        scalarAddEquals: function (t) {
          return (this.x += t), (this.y += t), this;
        },
        subtract: function (t) {
          return new e(this.x - t.x, this.y - t.y);
        },
        subtractEquals: function (t) {
          return (this.x -= t.x), (this.y -= t.y), this;
        },
        scalarSubtract: function (t) {
          return new e(this.x - t, this.y - t);
        },
        scalarSubtractEquals: function (t) {
          return (this.x -= t), (this.y -= t), this;
        },
        multiply: function (t) {
          return new e(this.x * t, this.y * t);
        },
        multiplyEquals: function (t) {
          return (this.x *= t), (this.y *= t), this;
        },
        divide: function (t) {
          return new e(this.x / t, this.y / t);
        },
        divideEquals: function (t) {
          return (this.x /= t), (this.y /= t), this;
        },
        eq: function (t) {
          return this.x === t.x && this.y === t.y;
        },
        lt: function (t) {
          return this.x < t.x && this.y < t.y;
        },
        lte: function (t) {
          return this.x <= t.x && this.y <= t.y;
        },
        gt: function (t) {
          return this.x > t.x && this.y > t.y;
        },
        gte: function (t) {
          return this.x >= t.x && this.y >= t.y;
        },
        lerp: function (t, r) {
          return (
            'undefined' == typeof r && (r = 0.5),
            (r = Math.max(Math.min(1, r), 0)),
            new e(this.x + (t.x - this.x) * r, this.y + (t.y - this.y) * r)
          );
        },
        distanceFrom: function (t) {
          var e = this.x - t.x,
            r = this.y - t.y;
          return Math.sqrt(e * e + r * r);
        },
        midPointFrom: function (t) {
          return this.lerp(t);
        },
        min: function (t) {
          return new e(Math.min(this.x, t.x), Math.min(this.y, t.y));
        },
        max: function (t) {
          return new e(Math.max(this.x, t.x), Math.max(this.y, t.y));
        },
        toString: function () {
          return this.x + ',' + this.y;
        },
        setXY: function (t, e) {
          return (this.x = t), (this.y = e), this;
        },
        setX: function (t) {
          return (this.x = t), this;
        },
        setY: function (t) {
          return (this.y = t), this;
        },
        setFromPoint: function (t) {
          return (this.x = t.x), (this.y = t.y), this;
        },
        swap: function (t) {
          var e = this.x,
            r = this.y;
          (this.x = t.x), (this.y = t.y), (t.x = e), (t.y = r);
        },
        clone: function () {
          return new e(this.x, this.y);
        }
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  function e(t) {
    (this.status = t), (this.points = []);
  }
  var n = t.fabric || (t.fabric = {});
  return n.Intersection
    ? void n.warn('fabric.Intersection is already defined')
    : ((n.Intersection = e),
      (n.Intersection.prototype = {
        constructor: e,
        appendPoint: function (t) {
          return this.points.push(t), this;
        },
        appendPoints: function (t) {
          return (this.points = this.points.concat(t)), this;
        }
      }),
      (n.Intersection.intersectLineLine = function (t, r, i, a) {
        var o,
          s = (a.x - i.x) * (t.y - i.y) - (a.y - i.y) * (t.x - i.x),
          c = (r.x - t.x) * (t.y - i.y) - (r.y - t.y) * (t.x - i.x),
          u = (a.y - i.y) * (r.x - t.x) - (a.x - i.x) * (r.y - t.y);
        if (0 !== u) {
          var l = s / u,
            f = c / u;
          l >= 0 && 1 >= l && f >= 0 && 1 >= f
            ? ((o = new e('Intersection')),
              o.appendPoint(
                new n.Point(t.x + l * (r.x - t.x), t.y + l * (r.y - t.y))
              ))
            : (o = new e());
        } else o = new e(0 === s || 0 === c ? 'Coincident' : 'Parallel');
        return o;
      }),
      (n.Intersection.intersectLinePolygon = function (t, n, r) {
        var i,
          a,
          o,
          s,
          c = new e(),
          u = r.length;
        for (s = 0; u > s; s++)
          (i = r[s]),
            (a = r[(s + 1) % u]),
            (o = e.intersectLineLine(t, n, i, a)),
            c.appendPoints(o.points);
        return c.points.length > 0 && (c.status = 'Intersection'), c;
      }),
      (n.Intersection.intersectPolygonPolygon = function (t, n) {
        var r,
          i = new e(),
          a = t.length;
        for (r = 0; a > r; r++) {
          var o = t[r],
            s = t[(r + 1) % a],
            c = e.intersectLinePolygon(o, s, n);
          i.appendPoints(c.points);
        }
        return i.points.length > 0 && (i.status = 'Intersection'), i;
      }),
      void (n.Intersection.intersectPolygonRectangle = function (t, r, i) {
        var a = r.min(i),
          o = r.max(i),
          s = new n.Point(o.x, a.y),
          c = new n.Point(a.x, o.y),
          u = e.intersectLinePolygon(a, s, t),
          l = e.intersectLinePolygon(s, o, t),
          f = e.intersectLinePolygon(o, c, t),
          h = e.intersectLinePolygon(c, a, t),
          d = new e();
        return (
          d.appendPoints(u.points),
          d.appendPoints(l.points),
          d.appendPoints(f.points),
          d.appendPoints(h.points),
          d.points.length > 0 && (d.status = 'Intersection'),
          d
        );
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  function e(t) {
    t ? this._tryParsingColor(t) : this.setSource([0, 0, 0, 1]);
  }
  function r(t, e, r) {
    return (
      0 > r && (r += 1),
      r > 1 && (r -= 1),
      1 / 6 > r
        ? t + 6 * (e - t) * r
        : 0.5 > r
        ? e
        : 2 / 3 > r
        ? t + (e - t) * (2 / 3 - r) * 6
        : t
    );
  }
  var n = t.fabric || (t.fabric = {});
  return n.Color
    ? void n.warn('fabric.Color is already defined.')
    : ((n.Color = e),
      (n.Color.prototype = {
        _tryParsingColor: function (t) {
          var r;
          t in e.colorNameMap && (t = e.colorNameMap[t]),
            'transparent' === t && (r = [255, 255, 255, 0]),
            r || (r = e.sourceFromHex(t)),
            r || (r = e.sourceFromRgb(t)),
            r || (r = e.sourceFromHsl(t)),
            r || (r = [0, 0, 0, 1]),
            r && this.setSource(r);
        },
        _rgbToHsl: function (t, e, r) {
          (t /= 255), (e /= 255), (r /= 255);
          var i,
            a,
            o,
            s = n.util.array.max([t, e, r]),
            c = n.util.array.min([t, e, r]);
          if (((o = (s + c) / 2), s === c)) i = a = 0;
          else {
            var u = s - c;
            switch (((a = o > 0.5 ? u / (2 - s - c) : u / (s + c)), s)) {
              case t:
                i = (e - r) / u + (r > e ? 6 : 0);
                break;
              case e:
                i = (r - t) / u + 2;
                break;
              case r:
                i = (t - e) / u + 4;
            }
            i /= 6;
          }
          return [
            Math.round(360 * i),
            Math.round(100 * a),
            Math.round(100 * o)
          ];
        },
        getSource: function () {
          return this._source;
        },
        setSource: function (t) {
          this._source = t;
        },
        toRgb: function () {
          var t = this.getSource();
          return 'rgb(' + t[0] + ',' + t[1] + ',' + t[2] + ')';
        },
        toRgba: function () {
          var t = this.getSource();
          return 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',' + t[3] + ')';
        },
        toHsl: function () {
          var t = this.getSource(),
            e = this._rgbToHsl(t[0], t[1], t[2]);
          return 'hsl(' + e[0] + ',' + e[1] + '%,' + e[2] + '%)';
        },
        toHsla: function () {
          var t = this.getSource(),
            e = this._rgbToHsl(t[0], t[1], t[2]);
          return 'hsla(' + e[0] + ',' + e[1] + '%,' + e[2] + '%,' + t[3] + ')';
        },
        toHex: function () {
          var t,
            e,
            r,
            n = this.getSource();
          return (
            (t = n[0].toString(16)),
            (t = 1 === t.length ? '0' + t : t),
            (e = n[1].toString(16)),
            (e = 1 === e.length ? '0' + e : e),
            (r = n[2].toString(16)),
            (r = 1 === r.length ? '0' + r : r),
            t.toUpperCase() + e.toUpperCase() + r.toUpperCase()
          );
        },
        toHexa: function () {
          var t,
            e = this.getSource();
          return (
            (t = Math.round(255 * e[3])),
            (t = t.toString(16)),
            (t = 1 === t.length ? '0' + t : t),
            this.toHex() + t.toUpperCase()
          );
        },
        getAlpha: function () {
          return this.getSource()[3];
        },
        setAlpha: function (t) {
          var e = this.getSource();
          return (e[3] = t), this.setSource(e), this;
        },
        toGrayscale: function () {
          var t = this.getSource(),
            e = parseInt(
              (0.3 * t[0] + 0.59 * t[1] + 0.11 * t[2]).toFixed(0),
              10
            ),
            r = t[3];
          return this.setSource([e, e, e, r]), this;
        },
        toBlackWhite: function (t) {
          var e = this.getSource(),
            r = (0.3 * e[0] + 0.59 * e[1] + 0.11 * e[2]).toFixed(0),
            n = e[3];
          return (
            (t = t || 127),
            (r = Number(r) < Number(t) ? 0 : 255),
            this.setSource([r, r, r, n]),
            this
          );
        },
        overlayWith: function (t) {
          t instanceof e || (t = new e(t));
          var r,
            n = [],
            i = this.getAlpha(),
            a = 0.5,
            o = this.getSource(),
            s = t.getSource();
          for (r = 0; 3 > r; r++) n.push(Math.round(o[r] * (1 - a) + s[r] * a));
          return (n[3] = i), this.setSource(n), this;
        }
      }),
      (n.Color.reRGBa =
        /^rgba?\(\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*,\s*(\d{1,3}(?:\.\d+)?\%?)\s*(?:\s*,\s*((?:\d*\.?\d+)?)\s*)?\)$/i),
      (n.Color.reHSLa =
        /^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3}\%)\s*,\s*(\d{1,3}\%)\s*(?:\s*,\s*(\d+(?:\.\d+)?)\s*)?\)$/i),
      (n.Color.reHex =
        /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i),
      (n.Color.colorNameMap = {
        aliceblue: '#F0F8FF',
        antiquewhite: '#FAEBD7',
        aqua: '#00FFFF',
        aquamarine: '#7FFFD4',
        azure: '#F0FFFF',
        beige: '#F5F5DC',
        bisque: '#FFE4C4',
        black: '#000000',
        blanchedalmond: '#FFEBCD',
        blue: '#0000FF',
        blueviolet: '#8A2BE2',
        brown: '#A52A2A',
        burlywood: '#DEB887',
        cadetblue: '#5F9EA0',
        chartreuse: '#7FFF00',
        chocolate: '#D2691E',
        coral: '#FF7F50',
        cornflowerblue: '#6495ED',
        cornsilk: '#FFF8DC',
        crimson: '#DC143C',
        cyan: '#00FFFF',
        darkblue: '#00008B',
        darkcyan: '#008B8B',
        darkgoldenrod: '#B8860B',
        darkgray: '#A9A9A9',
        darkgrey: '#A9A9A9',
        darkgreen: '#006400',
        darkkhaki: '#BDB76B',
        darkmagenta: '#8B008B',
        darkolivegreen: '#556B2F',
        darkorange: '#FF8C00',
        darkorchid: '#9932CC',
        darkred: '#8B0000',
        darksalmon: '#E9967A',
        darkseagreen: '#8FBC8F',
        darkslateblue: '#483D8B',
        darkslategray: '#2F4F4F',
        darkslategrey: '#2F4F4F',
        darkturquoise: '#00CED1',
        darkviolet: '#9400D3',
        deeppink: '#FF1493',
        deepskyblue: '#00BFFF',
        dimgray: '#696969',
        dimgrey: '#696969',
        dodgerblue: '#1E90FF',
        firebrick: '#B22222',
        floralwhite: '#FFFAF0',
        forestgreen: '#228B22',
        fuchsia: '#FF00FF',
        gainsboro: '#DCDCDC',
        ghostwhite: '#F8F8FF',
        gold: '#FFD700',
        goldenrod: '#DAA520',
        gray: '#808080',
        grey: '#808080',
        green: '#008000',
        greenyellow: '#ADFF2F',
        honeydew: '#F0FFF0',
        hotpink: '#FF69B4',
        indianred: '#CD5C5C',
        indigo: '#4B0082',
        ivory: '#FFFFF0',
        khaki: '#F0E68C',
        lavender: '#E6E6FA',
        lavenderblush: '#FFF0F5',
        lawngreen: '#7CFC00',
        lemonchiffon: '#FFFACD',
        lightblue: '#ADD8E6',
        lightcoral: '#F08080',
        lightcyan: '#E0FFFF',
        lightgoldenrodyellow: '#FAFAD2',
        lightgray: '#D3D3D3',
        lightgrey: '#D3D3D3',
        lightgreen: '#90EE90',
        lightpink: '#FFB6C1',
        lightsalmon: '#FFA07A',
        lightseagreen: '#20B2AA',
        lightskyblue: '#87CEFA',
        lightslategray: '#778899',
        lightslategrey: '#778899',
        lightsteelblue: '#B0C4DE',
        lightyellow: '#FFFFE0',
        lime: '#00FF00',
        limegreen: '#32CD32',
        linen: '#FAF0E6',
        magenta: '#FF00FF',
        maroon: '#800000',
        mediumaquamarine: '#66CDAA',
        mediumblue: '#0000CD',
        mediumorchid: '#BA55D3',
        mediumpurple: '#9370DB',
        mediumseagreen: '#3CB371',
        mediumslateblue: '#7B68EE',
        mediumspringgreen: '#00FA9A',
        mediumturquoise: '#48D1CC',
        mediumvioletred: '#C71585',
        midnightblue: '#191970',
        mintcream: '#F5FFFA',
        mistyrose: '#FFE4E1',
        moccasin: '#FFE4B5',
        navajowhite: '#FFDEAD',
        navy: '#000080',
        oldlace: '#FDF5E6',
        olive: '#808000',
        olivedrab: '#6B8E23',
        orange: '#FFA500',
        orangered: '#FF4500',
        orchid: '#DA70D6',
        palegoldenrod: '#EEE8AA',
        palegreen: '#98FB98',
        paleturquoise: '#AFEEEE',
        palevioletred: '#DB7093',
        papayawhip: '#FFEFD5',
        peachpuff: '#FFDAB9',
        peru: '#CD853F',
        pink: '#FFC0CB',
        plum: '#DDA0DD',
        powderblue: '#B0E0E6',
        purple: '#800080',
        rebeccapurple: '#663399',
        red: '#FF0000',
        rosybrown: '#BC8F8F',
        royalblue: '#4169E1',
        saddlebrown: '#8B4513',
        salmon: '#FA8072',
        sandybrown: '#F4A460',
        seagreen: '#2E8B57',
        seashell: '#FFF5EE',
        sienna: '#A0522D',
        silver: '#C0C0C0',
        skyblue: '#87CEEB',
        slateblue: '#6A5ACD',
        slategray: '#708090',
        slategrey: '#708090',
        snow: '#FFFAFA',
        springgreen: '#00FF7F',
        steelblue: '#4682B4',
        tan: '#D2B48C',
        teal: '#008080',
        thistle: '#D8BFD8',
        tomato: '#FF6347',
        turquoise: '#40E0D0',
        violet: '#EE82EE',
        wheat: '#F5DEB3',
        white: '#FFFFFF',
        whitesmoke: '#F5F5F5',
        yellow: '#FFFF00',
        yellowgreen: '#9ACD32'
      }),
      (n.Color.fromRgb = function (t) {
        return e.fromSource(e.sourceFromRgb(t));
      }),
      (n.Color.sourceFromRgb = function (t) {
        var r = t.match(e.reRGBa);
        if (r) {
          var n =
              (parseInt(r[1], 10) / (/%$/.test(r[1]) ? 100 : 1)) *
              (/%$/.test(r[1]) ? 255 : 1),
            i =
              (parseInt(r[2], 10) / (/%$/.test(r[2]) ? 100 : 1)) *
              (/%$/.test(r[2]) ? 255 : 1),
            a =
              (parseInt(r[3], 10) / (/%$/.test(r[3]) ? 100 : 1)) *
              (/%$/.test(r[3]) ? 255 : 1);
          return [
            parseInt(n, 10),
            parseInt(i, 10),
            parseInt(a, 10),
            r[4] ? parseFloat(r[4]) : 1
          ];
        }
      }),
      (n.Color.fromRgba = e.fromRgb),
      (n.Color.fromHsl = function (t) {
        return e.fromSource(e.sourceFromHsl(t));
      }),
      (n.Color.sourceFromHsl = function (t) {
        var n = t.match(e.reHSLa);
        if (n) {
          var i,
            a,
            o,
            s = (((parseFloat(n[1]) % 360) + 360) % 360) / 360,
            c = parseFloat(n[2]) / (/%$/.test(n[2]) ? 100 : 1),
            u = parseFloat(n[3]) / (/%$/.test(n[3]) ? 100 : 1);
          if (0 === c) i = a = o = u;
          else {
            var l = 0.5 >= u ? u * (c + 1) : u + c - u * c,
              f = 2 * u - l;
            (i = r(f, l, s + 1 / 3)),
              (a = r(f, l, s)),
              (o = r(f, l, s - 1 / 3));
          }
          return [
            Math.round(255 * i),
            Math.round(255 * a),
            Math.round(255 * o),
            n[4] ? parseFloat(n[4]) : 1
          ];
        }
      }),
      (n.Color.fromHsla = e.fromHsl),
      (n.Color.fromHex = function (t) {
        return e.fromSource(e.sourceFromHex(t));
      }),
      (n.Color.sourceFromHex = function (t) {
        if (t.match(e.reHex)) {
          var r = t.slice(t.indexOf('#') + 1),
            n = 3 === r.length || 4 === r.length,
            i = 8 === r.length || 4 === r.length,
            a = n ? r.charAt(0) + r.charAt(0) : r.substring(0, 2),
            o = n ? r.charAt(1) + r.charAt(1) : r.substring(2, 4),
            s = n ? r.charAt(2) + r.charAt(2) : r.substring(4, 6),
            c = i ? (n ? r.charAt(3) + r.charAt(3) : r.substring(6, 8)) : 'FF';
          return [
            parseInt(a, 16),
            parseInt(o, 16),
            parseInt(s, 16),
            parseFloat((parseInt(c, 16) / 255).toFixed(2))
          ];
        }
      }),
      void (n.Color.fromSource = function (t) {
        var r = new e();
        return r.setSource(t), r;
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  function e(t, e) {
    var r = t.angle + j(Math.atan2(e.y, e.x)) + 360;
    return Math.round((r % 360) / 45);
  }
  function r(t, e) {
    var r = e.transform.target,
      n = r.canvas,
      i = D.util.object.clone(e);
    (i.target = r), n && n.fire('object:' + t, i), r.fire(t, e);
  }
  function n(t, e) {
    var r = e.canvas,
      n = r.uniScaleKey,
      i = t[n];
    return (r.uniformScaling && !i) || (!r.uniformScaling && i);
  }
  function i(t) {
    return t.originX === R && t.originY === R;
  }
  function a(t, e, r) {
    var n = t.lockScalingX,
      i = t.lockScalingY;
    return n && i
      ? !0
      : !e && (n || i) && r
      ? !0
      : n && 'x' === e
      ? !0
      : i && 'y' === e
      ? !0
      : !1;
  }
  function o(t, r, i) {
    var o = 'not-allowed',
      s = n(t, i),
      c = '';
    if (
      (0 !== r.x && 0 === r.y ? (c = 'x') : 0 === r.x && 0 !== r.y && (c = 'y'),
      a(i, c, s))
    )
      return o;
    var u = e(i, r);
    return O[u] + '-resize';
  }
  function s(t, r, n) {
    var i = 'not-allowed';
    if (0 !== r.x && n.lockSkewingY) return i;
    if (0 !== r.y && n.lockSkewingX) return i;
    var a = e(n, r) % 4;
    return T[a] + '-resize';
  }
  function c(t, e, r) {
    return t[r.canvas.altActionKey]
      ? I.skewCursorStyleHandler(t, e, r)
      : I.scaleCursorStyleHandler(t, e, r);
  }
  function u(t, e, r) {
    var n = t[r.canvas.altActionKey];
    return 0 === e.x
      ? n
        ? 'skewX'
        : 'scaleY'
      : 0 === e.y
      ? n
        ? 'skewY'
        : 'scaleX'
      : void 0;
  }
  function l(t, e, r) {
    return r.lockRotation ? 'not-allowed' : e.cursorStyle;
  }
  function f(t, e, r, n) {
    return { e: t, transform: e, pointer: { x: r, y: n } };
  }
  function h(t) {
    return function (e, r, n, i) {
      var a = r.target,
        o = a.getCenterPoint(),
        s = a.translateToOriginPoint(o, r.originX, r.originY),
        c = t(e, r, n, i);
      return a.setPositionByOrigin(s, r.originX, r.originY), c;
    };
  }
  function d(t, e) {
    return function (n, i, a, o) {
      var s = e(n, i, a, o);
      return s && r(t, f(n, i, a, o)), s;
    };
  }
  function g(t, e, r, n, i) {
    var a = t.target,
      o = a.controls[t.corner],
      s = a.canvas.getZoom(),
      c = a.padding / s,
      u = a.toLocalPoint(new D.Point(n, i), e, r);
    return (
      u.x >= c && (u.x -= c),
      u.x <= -c && (u.x += c),
      u.y >= c && (u.y -= c),
      u.y <= c && (u.y += c),
      (u.x -= o.offsetX),
      (u.y -= o.offsetY),
      u
    );
  }
  function p(t) {
    return t.flipX !== t.flipY;
  }
  function m(t, e, r, n, i) {
    if (0 !== t[e]) {
      var a = t._getTransformedDimensions()[n],
        o = (i / a) * t[r];
      t.set(r, o);
    }
  }
  function b(t, e, r, n) {
    var i,
      a = e.target,
      o = a._getTransformedDimensions(0, a.skewY),
      s = g(e, e.originX, e.originY, r, n),
      c = Math.abs(2 * s.x) - o.x,
      u = a.skewX;
    2 > c
      ? (i = 0)
      : ((i = j(Math.atan2(c / a.scaleX, o.y / a.scaleY))),
        e.originX === X && e.originY === B && (i = -i),
        e.originX === N && e.originY === Y && (i = -i),
        p(a) && (i = -i));
    var l = u !== i;
    if (l) {
      var f = a._getTransformedDimensions().y;
      a.set('skewX', i), m(a, 'skewY', 'scaleY', 'y', f);
    }
    return l;
  }
  function y(t, e, r, n) {
    var i,
      a = e.target,
      o = a._getTransformedDimensions(a.skewX, 0),
      s = g(e, e.originX, e.originY, r, n),
      c = Math.abs(2 * s.y) - o.y,
      u = a.skewY;
    2 > c
      ? (i = 0)
      : ((i = j(Math.atan2(c / a.scaleY, o.x / a.scaleX))),
        e.originX === X && e.originY === B && (i = -i),
        e.originX === N && e.originY === Y && (i = -i),
        p(a) && (i = -i));
    var l = u !== i;
    if (l) {
      var f = a._getTransformedDimensions().x;
      a.set('skewY', i), m(a, 'skewX', 'scaleX', 'x', f);
    }
    return l;
  }
  function v(t, e, r, n) {
    var i,
      a = e.target,
      o = a.skewX,
      s = e.originY;
    if (a.lockSkewingX) return !1;
    if (0 === o) {
      var c = g(e, R, R, r, n);
      i = c.x > 0 ? X : N;
    } else
      o > 0 && (i = s === Y ? X : N),
        0 > o && (i = s === Y ? N : X),
        p(a) && (i = i === X ? N : X);
    e.originX = i;
    var u = d('skewing', h(b));
    return u(t, e, r, n);
  }
  function x(t, e, r, n) {
    var i,
      a = e.target,
      o = a.skewY,
      s = e.originX;
    if (a.lockSkewingY) return !1;
    if (0 === o) {
      var c = g(e, R, R, r, n);
      i = c.y > 0 ? Y : B;
    } else
      o > 0 && (i = s === X ? Y : B),
        0 > o && (i = s === X ? B : Y),
        p(a) && (i = i === Y ? B : Y);
    e.originY = i;
    var u = d('skewing', h(y));
    return u(t, e, r, n);
  }
  function w(t, e, r, n) {
    var i = e,
      a = i.target,
      o = a.translateToOriginPoint(a.getCenterPoint(), i.originX, i.originY);
    if (a.lockRotation) return !1;
    var s = Math.atan2(i.ey - o.y, i.ex - o.x),
      c = Math.atan2(n - o.y, r - o.x),
      u = j(c - s + i.theta),
      l = !0;
    if (a.snapAngle > 0) {
      var f = a.snapAngle,
        h = a.snapThreshold || f,
        d = Math.ceil(u / f) * f,
        g = Math.floor(u / f) * f;
      Math.abs(u - g) < h ? (u = g) : Math.abs(u - d) < h && (u = d);
    }
    return (
      0 > u && (u = 360 + u), (u %= 360), (l = a.angle !== u), (a.angle = u), l
    );
  }
  function F(t, e, r, o, s) {
    s = s || {};
    var c,
      u,
      l,
      f,
      h,
      d,
      p = e.target,
      m = p.lockScalingX,
      b = p.lockScalingY,
      y = s.by,
      v = n(t, p),
      x = a(p, y, v),
      w = e.gestureScale;
    if (x) return !1;
    if (w) (u = e.scaleX * w), (l = e.scaleY * w);
    else {
      if (
        ((c = g(e, e.originX, e.originY, r, o)),
        (h = 'y' !== y ? L(c.x) : 1),
        (d = 'x' !== y ? L(c.y) : 1),
        e.signX || (e.signX = h),
        e.signY || (e.signY = d),
        p.lockScalingFlip && (e.signX !== h || e.signY !== d))
      )
        return !1;
      if (((f = p._getTransformedDimensions()), v && !y)) {
        var F = Math.abs(c.x) + Math.abs(c.y),
          A = e.original,
          k =
            Math.abs((f.x * A.scaleX) / p.scaleX) +
            Math.abs((f.y * A.scaleY) / p.scaleY),
          C = F / k;
        (u = A.scaleX * C), (l = A.scaleY * C);
      } else
        (u = Math.abs((c.x * p.scaleX) / f.x)),
          (l = Math.abs((c.y * p.scaleY) / f.y));
      i(e) && ((u *= 2), (l *= 2)),
        e.signX !== h &&
          'y' !== y &&
          ((e.originX = _[e.originX]), (u *= -1), (e.signX = h)),
        e.signY !== d &&
          'x' !== y &&
          ((e.originY = _[e.originY]), (l *= -1), (e.signY = d));
    }
    var E = p.scaleX,
      M = p.scaleY;
    return (
      y
        ? ('x' === y && p.set('scaleX', u), 'y' === y && p.set('scaleY', l))
        : (!m && p.set('scaleX', u), !b && p.set('scaleY', l)),
      E !== p.scaleX || M !== p.scaleY
    );
  }
  function A(t, e, r, n) {
    return F(t, e, r, n);
  }
  function k(t, e, r, n) {
    return F(t, e, r, n, { by: 'x' });
  }
  function C(t, e, r, n) {
    return F(t, e, r, n, { by: 'y' });
  }
  function E(t, e, r, n) {
    return t[e.target.canvas.altActionKey]
      ? I.skewHandlerX(t, e, r, n)
      : I.scalingY(t, e, r, n);
  }
  function M(t, e, r, n) {
    return t[e.target.canvas.altActionKey]
      ? I.skewHandlerY(t, e, r, n)
      : I.scalingX(t, e, r, n);
  }
  function S(t, e, r, n) {
    var a = e.target,
      o = g(e, e.originX, e.originY, r, n),
      s = a.strokeWidth / (a.strokeUniform ? a.scaleX : 1),
      c = i(e) ? 2 : 1,
      u = a.width,
      l = Math.abs((o.x * c) / a.scaleX) - s;
    return a.set('width', Math.max(l, 0)), u !== l;
  }
  function P(t, e, n, i) {
    var a = e.target,
      o = n - e.offsetX,
      s = i - e.offsetY,
      c = !a.get('lockMovementX') && a.left !== o,
      u = !a.get('lockMovementY') && a.top !== s;
    return (
      c && a.set('left', o),
      u && a.set('top', s),
      (c || u) && r('moving', f(t, e, n, i)),
      c || u
    );
  }
  var D = t.fabric || (t.fabric = {}),
    O = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne', 'e'],
    T = ['ns', 'nesw', 'ew', 'nwse'],
    I = {},
    X = 'left',
    Y = 'top',
    N = 'right',
    B = 'bottom',
    R = 'center',
    _ = { top: B, bottom: Y, left: N, right: X, center: R },
    j = D.util.radiansToDegrees,
    L =
      Math.sign ||
      function (t) {
        return (t > 0) - (0 > t) || +t;
      };
  (I.scaleCursorStyleHandler = o),
    (I.skewCursorStyleHandler = s),
    (I.scaleSkewCursorStyleHandler = c),
    (I.rotationWithSnapping = d('rotating', h(w))),
    (I.scalingEqually = d('scaling', h(A))),
    (I.scalingX = d('scaling', h(k))),
    (I.scalingY = d('scaling', h(C))),
    (I.scalingYOrSkewingX = E),
    (I.scalingXOrSkewingY = M),
    (I.changeWidth = d('resizing', h(S))),
    (I.skewHandlerX = v),
    (I.skewHandlerY = x),
    (I.dragHandler = P),
    (I.scaleOrSkewActionName = u),
    (I.rotationStyleHandler = l),
    (I.fireEvent = r),
    (I.wrapWithFixedAnchor = h),
    (I.wrapWithFireEvent = d),
    (I.getLocalPoint = g),
    (D.controlsUtils = I);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  function e(t, e, r, n, i) {
    n = n || {};
    var a,
      o = this.sizeX || n.cornerSize || i.cornerSize,
      s = this.sizeY || n.cornerSize || i.cornerSize,
      c =
        'undefined' != typeof n.transparentCorners
          ? n.transparentCorners
          : i.transparentCorners,
      u = c ? 'stroke' : 'fill',
      l = !c && (n.cornerStrokeColor || i.cornerStrokeColor),
      f = e,
      h = r;
    t.save(),
      (t.fillStyle = n.cornerColor || i.cornerColor),
      (t.strokeStyle = n.cornerStrokeColor || i.cornerStrokeColor),
      o > s
        ? ((a = o), t.scale(1, s / o), (h = (r * o) / s))
        : s > o
        ? ((a = s), t.scale(o / s, 1), (f = (e * s) / o))
        : (a = o),
      (t.lineWidth = 1),
      t.beginPath(),
      t.arc(f, h, a / 2, 0, 2 * Math.PI, !1),
      t[u](),
      l && t.stroke(),
      t.restore();
  }
  function r(t, e, r, n, a) {
    n = n || {};
    var o = this.sizeX || n.cornerSize || a.cornerSize,
      s = this.sizeY || n.cornerSize || a.cornerSize,
      c =
        'undefined' != typeof n.transparentCorners
          ? n.transparentCorners
          : a.transparentCorners,
      u = c ? 'stroke' : 'fill',
      l = !c && (n.cornerStrokeColor || a.cornerStrokeColor),
      f = o / 2,
      h = s / 2;
    t.save(),
      (t.fillStyle = n.cornerColor || a.cornerColor),
      (t.strokeStyle = n.cornerStrokeColor || a.cornerStrokeColor),
      (t.lineWidth = 1),
      t.translate(e, r),
      t.rotate(i(a.angle)),
      t[u + 'Rect'](-f, -h, o, s),
      l && t.strokeRect(-f, -h, o, s),
      t.restore();
  }
  var n = t.fabric || (t.fabric = {}),
    i = n.util.degreesToRadians,
    a = n.controlsUtils;
  (a.renderCircleControl = e), (a.renderSquareControl = r);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  function e(t) {
    for (var e in t) this[e] = t[e];
  }
  var r = t.fabric || (t.fabric = {});
  (r.Control = e),
    (r.Control.prototype = {
      visible: !0,
      actionName: 'scale',
      angle: 0,
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      sizeX: null,
      sizeY: null,
      touchSizeX: null,
      touchSizeY: null,
      cursorStyle: 'crosshair',
      withConnection: !1,
      actionHandler: function () {},
      mouseDownHandler: function () {},
      mouseUpHandler: function () {},
      getActionHandler: function () {
        return this.actionHandler;
      },
      getMouseDownHandler: function () {
        return this.mouseDownHandler;
      },
      getMouseUpHandler: function () {
        return this.mouseUpHandler;
      },
      cursorStyleHandler: function (t, e) {
        return e.cursorStyle;
      },
      getActionName: function (t, e) {
        return e.actionName;
      },
      getVisibility: function (t, e) {
        var r = t._controlsVisibility;
        return r && 'undefined' != typeof r[e] ? r[e] : this.visible;
      },
      setVisibility: function (t) {
        this.visible = t;
      },
      positionHandler: function (t, e) {
        var n = r.util.transformPoint(
          { x: this.x * t.x + this.offsetX, y: this.y * t.y + this.offsetY },
          e
        );
        return n;
      },
      calcCornerCoords: function (t, e, n, i, a) {
        var o,
          s,
          c,
          u,
          l = a ? this.touchSizeX : this.sizeX,
          f = a ? this.touchSizeY : this.sizeY;
        if (l && f && l !== f) {
          var h = Math.atan2(f, l),
            d = Math.sqrt(l * l + f * f) / 2,
            g = h - r.util.degreesToRadians(t),
            p = Math.PI / 2 - h - r.util.degreesToRadians(t);
          (o = d * r.util.cos(g)),
            (s = d * r.util.sin(g)),
            (c = d * r.util.cos(p)),
            (u = d * r.util.sin(p));
        } else {
          var m = l && f ? l : e;
          d = 0.7071067812 * m;
          var g = r.util.degreesToRadians(45 - t);
          (o = c = d * r.util.cos(g)), (s = u = d * r.util.sin(g));
        }
        return {
          tl: { x: n - u, y: i - c },
          tr: { x: n + o, y: i - s },
          bl: { x: n - o, y: i + s },
          br: { x: n + u, y: i + c }
        };
      },
      render: function (t, e, n, i, a) {
        switch (((i = i || {}), i.cornerStyle || a.cornerStyle)) {
          case 'circle':
            r.controlsUtils.renderCircleControl.call(this, t, e, n, i, a);
            break;
          default:
            r.controlsUtils.renderSquareControl.call(this, t, e, n, i, a);
        }
      }
    });
})('undefined' != typeof exports ? exports : this);
!(function () {
  function t(t, e) {
    var r,
      n,
      i,
      a,
      o = t.getAttribute('style'),
      s = t.getAttribute('offset') || 0;
    if (
      ((s = parseFloat(s) / (/%$/.test(s) ? 100 : 1)),
      (s = 0 > s ? 0 : s > 1 ? 1 : s),
      o)
    ) {
      var c = o.split(/\s*;\s*/);
      for ('' === c[c.length - 1] && c.pop(), a = c.length; a--; ) {
        var l = c[a].split(/\s*:\s*/),
          u = l[0].trim(),
          f = l[1].trim();
        'stop-color' === u ? (r = f) : 'stop-opacity' === u && (i = f);
      }
    }
    return (
      r || (r = t.getAttribute('stop-color') || 'rgb(0,0,0)'),
      i || (i = t.getAttribute('stop-opacity')),
      (r = new fabric.Color(r)),
      (n = r.getAlpha()),
      (i = isNaN(parseFloat(i)) ? 1 : parseFloat(i)),
      (i *= n * e),
      { offset: s, color: r.toRgb(), opacity: i }
    );
  }
  function e(t) {
    return {
      x1: t.getAttribute('x1') || 0,
      y1: t.getAttribute('y1') || 0,
      x2: t.getAttribute('x2') || '100%',
      y2: t.getAttribute('y2') || 0
    };
  }
  function r(t) {
    return {
      x1: t.getAttribute('fx') || t.getAttribute('cx') || '50%',
      y1: t.getAttribute('fy') || t.getAttribute('cy') || '50%',
      r1: 0,
      x2: t.getAttribute('cx') || '50%',
      y2: t.getAttribute('cy') || '50%',
      r2: t.getAttribute('r') || '50%'
    };
  }
  function n(t, e, r, n) {
    var i, a;
    Object.keys(e).forEach(function (t) {
      (i = e[t]),
        'Infinity' === i
          ? (a = 1)
          : '-Infinity' === i
          ? (a = 0)
          : ((a = parseFloat(e[t], 10)),
            'string' == typeof i &&
              /^(\d+\.\d+)%|(\d+)%$/.test(i) &&
              ((a *= 0.01),
              'pixels' === n &&
                (('x1' === t || 'x2' === t || 'r2' === t) &&
                  (a *= r.viewBoxWidth || r.width),
                ('y1' === t || 'y2' === t) &&
                  (a *= r.viewBoxHeight || r.height)))),
        (e[t] = a);
    });
  }
  var i = fabric.util.object.clone;
  (fabric.Gradient = fabric.util.createClass({
    offsetX: 0,
    offsetY: 0,
    gradientTransform: null,
    gradientUnits: 'pixels',
    type: 'linear',
    initialize: function (t) {
      t || (t = {}), t.coords || (t.coords = {});
      var e,
        r = this;
      Object.keys(t).forEach(function (e) {
        r[e] = t[e];
      }),
        this.id
          ? (this.id += '_' + fabric.Object.__uid++)
          : (this.id = fabric.Object.__uid++),
        (e = {
          x1: t.coords.x1 || 0,
          y1: t.coords.y1 || 0,
          x2: t.coords.x2 || 0,
          y2: t.coords.y2 || 0
        }),
        'radial' === this.type &&
          ((e.r1 = t.coords.r1 || 0), (e.r2 = t.coords.r2 || 0)),
        (this.coords = e),
        (this.colorStops = t.colorStops.slice());
    },
    addColorStop: function (t) {
      for (var e in t) {
        var r = new fabric.Color(t[e]);
        this.colorStops.push({
          offset: parseFloat(e),
          color: r.toRgb(),
          opacity: r.getAlpha()
        });
      }
      return this;
    },
    toObject: function (t) {
      var e = {
        type: this.type,
        coords: this.coords,
        colorStops: this.colorStops,
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        gradientUnits: this.gradientUnits,
        gradientTransform: this.gradientTransform
          ? this.gradientTransform.concat()
          : this.gradientTransform
      };
      return fabric.util.populateWithProperties(this, e, t), e;
    },
    toSVG: function (t, e) {
      var r,
        n,
        a,
        o,
        s = i(this.coords, !0),
        e = e || {},
        c = i(this.colorStops, !0),
        l = s.r1 > s.r2,
        u = this.gradientTransform
          ? this.gradientTransform.concat()
          : fabric.iMatrix.concat(),
        f = -this.offsetX,
        h = -this.offsetY,
        d = !!e.additionalTransform,
        p =
          'pixels' === this.gradientUnits
            ? 'userSpaceOnUse'
            : 'objectBoundingBox';
      if (
        (c.sort(function (t, e) {
          return t.offset - e.offset;
        }),
        'objectBoundingBox' === p
          ? ((f /= t.width), (h /= t.height))
          : ((f += t.width / 2), (h += t.height / 2)),
        'path' === t.type &&
          'percentage' !== this.gradientUnits &&
          ((f -= t.pathOffset.x), (h -= t.pathOffset.y)),
        (u[4] -= f),
        (u[5] -= h),
        (o = 'id="SVGID_' + this.id + '" gradientUnits="' + p + '"'),
        (o +=
          ' gradientTransform="' +
          (d ? e.additionalTransform + ' ' : '') +
          fabric.util.matrixToSVG(u) +
          '" '),
        'linear' === this.type
          ? (a = [
              '<linearGradient ',
              o,
              ' x1="',
              s.x1,
              '" y1="',
              s.y1,
              '" x2="',
              s.x2,
              '" y2="',
              s.y2,
              '">\n'
            ])
          : 'radial' === this.type &&
            (a = [
              '<radialGradient ',
              o,
              ' cx="',
              l ? s.x1 : s.x2,
              '" cy="',
              l ? s.y1 : s.y2,
              '" r="',
              l ? s.r1 : s.r2,
              '" fx="',
              l ? s.x2 : s.x1,
              '" fy="',
              l ? s.y2 : s.y1,
              '">\n'
            ]),
        'radial' === this.type)
      ) {
        if (l)
          for (c = c.concat(), c.reverse(), r = 0, n = c.length; n > r; r++)
            c[r].offset = 1 - c[r].offset;
        var g = Math.min(s.r1, s.r2);
        if (g > 0) {
          var m = Math.max(s.r1, s.r2),
            b = g / m;
          for (r = 0, n = c.length; n > r; r++)
            c[r].offset += b * (1 - c[r].offset);
        }
      }
      for (r = 0, n = c.length; n > r; r++) {
        var y = c[r];
        a.push(
          '<stop ',
          'offset="',
          100 * y.offset + '%',
          '" style="stop-color:',
          y.color,
          'undefined' != typeof y.opacity ? ';stop-opacity: ' + y.opacity : ';',
          '"/>\n'
        );
      }
      return (
        a.push(
          'linear' === this.type ? '</linearGradient>\n' : '</radialGradient>\n'
        ),
        a.join('')
      );
    },
    toLive: function (t) {
      var e,
        r,
        n,
        i = fabric.util.object.clone(this.coords);
      if (this.type) {
        for (
          'linear' === this.type
            ? (e = t.createLinearGradient(i.x1, i.y1, i.x2, i.y2))
            : 'radial' === this.type &&
              (e = t.createRadialGradient(i.x1, i.y1, i.r1, i.x2, i.y2, i.r2)),
            r = 0,
            n = this.colorStops.length;
          n > r;
          r++
        ) {
          var a = this.colorStops[r].color,
            o = this.colorStops[r].opacity,
            s = this.colorStops[r].offset;
          'undefined' != typeof o &&
            (a = new fabric.Color(a).setAlpha(o).toRgba()),
            e.addColorStop(s, a);
        }
        return e;
      }
    }
  })),
    fabric.util.object.extend(fabric.Gradient, {
      fromElement: function (i, a, o, s) {
        var c = parseFloat(o) / (/%$/.test(o) ? 100 : 1);
        (c = 0 > c ? 0 : c > 1 ? 1 : c), isNaN(c) && (c = 1);
        var l,
          u,
          f,
          h,
          d = i.getElementsByTagName('stop'),
          p =
            'userSpaceOnUse' === i.getAttribute('gradientUnits')
              ? 'pixels'
              : 'percentage',
          g = i.getAttribute('gradientTransform') || '',
          m = [],
          b = 0,
          y = 0;
        for (
          'linearGradient' === i.nodeName || 'LINEARGRADIENT' === i.nodeName
            ? ((l = 'linear'), (u = e(i)))
            : ((l = 'radial'), (u = r(i))),
            f = d.length;
          f--;

        )
          m.push(t(d[f], c));
        (h = fabric.parseTransformAttribute(g)),
          n(a, u, s, p),
          'pixels' === p && ((b = -a.left), (y = -a.top));
        var v = new fabric.Gradient({
          id: i.getAttribute('id'),
          type: l,
          coords: u,
          colorStops: m,
          gradientUnits: p,
          gradientTransform: h,
          offsetX: b,
          offsetY: y
        });
        return v;
      }
    });
})();
!(function () {
  'use strict';
  var t = fabric.util.toFixed;
  fabric.Pattern = fabric.util.createClass({
    repeat: 'repeat',
    offsetX: 0,
    offsetY: 0,
    crossOrigin: '',
    patternTransform: null,
    initialize: function (t, e) {
      if (
        (t || (t = {}),
        (this.id = fabric.Object.__uid++),
        this.setOptions(t),
        !t.source || (t.source && 'string' != typeof t.source))
      )
        return void (e && e(this));
      var r = this;
      (this.source = fabric.util.createImage()),
        fabric.util.loadImage(
          t.source,
          function (t, n) {
            (r.source = t), e && e(r, n);
          },
          null,
          this.crossOrigin
        );
    },
    toObject: function (e) {
      var r,
        n,
        i = fabric.Object.NUM_FRACTION_DIGITS;
      return (
        'string' == typeof this.source.src
          ? (r = this.source.src)
          : 'object' == typeof this.source &&
            this.source.toDataURL &&
            (r = this.source.toDataURL()),
        (n = {
          type: 'pattern',
          source: r,
          repeat: this.repeat,
          crossOrigin: this.crossOrigin,
          offsetX: t(this.offsetX, i),
          offsetY: t(this.offsetY, i),
          patternTransform: this.patternTransform
            ? this.patternTransform.concat()
            : null
        }),
        fabric.util.populateWithProperties(this, n, e),
        n
      );
    },
    toSVG: function (t) {
      var e = 'function' == typeof this.source ? this.source() : this.source,
        r = e.width / t.width,
        n = e.height / t.height,
        i = this.offsetX / t.width,
        a = this.offsetY / t.height,
        o = '';
      return (
        ('repeat-x' === this.repeat || 'no-repeat' === this.repeat) &&
          ((n = 1), a && (n += Math.abs(a))),
        ('repeat-y' === this.repeat || 'no-repeat' === this.repeat) &&
          ((r = 1), i && (r += Math.abs(i))),
        e.src ? (o = e.src) : e.toDataURL && (o = e.toDataURL()),
        '<pattern id="SVGID_' +
          this.id +
          '" x="' +
          i +
          '" y="' +
          a +
          '" width="' +
          r +
          '" height="' +
          n +
          '">\n<image x="0" y="0" width="' +
          e.width +
          '" height="' +
          e.height +
          '" xlink:href="' +
          o +
          '"></image>\n</pattern>\n'
      );
    },
    setOptions: function (t) {
      for (var e in t) this[e] = t[e];
    },
    toLive: function (t) {
      var e = this.source;
      if (!e) return '';
      if ('undefined' != typeof e.src) {
        if (!e.complete) return '';
        if (0 === e.naturalWidth || 0 === e.naturalHeight) return '';
      }
      return t.createPattern(e, this.repeat);
    }
  });
})();
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    r = e.util.toFixed;
  return e.Shadow
    ? void e.warn('fabric.Shadow is already defined.')
    : ((e.Shadow = e.util.createClass({
        color: 'rgb(0,0,0)',
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: !1,
        includeDefaultValues: !0,
        nonScaling: !1,
        initialize: function (t) {
          'string' == typeof t && (t = this._parseShadow(t));
          for (var r in t) this[r] = t[r];
          this.id = e.Object.__uid++;
        },
        _parseShadow: function (t) {
          var r = t.trim(),
            n = e.Shadow.reOffsetsAndBlur.exec(r) || [],
            i = r.replace(e.Shadow.reOffsetsAndBlur, '') || 'rgb(0,0,0)';
          return {
            color: i.trim(),
            offsetX: parseFloat(n[1], 10) || 0,
            offsetY: parseFloat(n[2], 10) || 0,
            blur: parseFloat(n[3], 10) || 0
          };
        },
        toString: function () {
          return [this.offsetX, this.offsetY, this.blur, this.color].join(
            'px '
          );
        },
        toSVG: function (t) {
          var n = 40,
            i = 40,
            a = e.Object.NUM_FRACTION_DIGITS,
            o = e.util.rotateVector(
              { x: this.offsetX, y: this.offsetY },
              e.util.degreesToRadians(-t.angle)
            ),
            s = 20,
            c = new e.Color(this.color);
          return (
            t.width &&
              t.height &&
              ((n = 100 * r((Math.abs(o.x) + this.blur) / t.width, a) + s),
              (i = 100 * r((Math.abs(o.y) + this.blur) / t.height, a) + s)),
            t.flipX && (o.x *= -1),
            t.flipY && (o.y *= -1),
            '<filter id="SVGID_' +
              this.id +
              '" y="-' +
              i +
              '%" height="' +
              (100 + 2 * i) +
              '%" x="-' +
              n +
              '%" width="' +
              (100 + 2 * n) +
              '%" >\n	<feGaussianBlur in="SourceAlpha" stdDeviation="' +
              r(this.blur ? this.blur / 2 : 0, a) +
              '"></feGaussianBlur>\n	<feOffset dx="' +
              r(o.x, a) +
              '" dy="' +
              r(o.y, a) +
              '" result="oBlur" ></feOffset>\n	<feFlood flood-color="' +
              c.toRgb() +
              '" flood-opacity="' +
              c.getAlpha() +
              '"/>\n	<feComposite in2="oBlur" operator="in" />\n	<feMerge>\n		<feMergeNode></feMergeNode>\n		<feMergeNode in="SourceGraphic"></feMergeNode>\n	</feMerge>\n</filter>\n'
          );
        },
        toObject: function () {
          if (this.includeDefaultValues)
            return {
              color: this.color,
              blur: this.blur,
              offsetX: this.offsetX,
              offsetY: this.offsetY,
              affectStroke: this.affectStroke,
              nonScaling: this.nonScaling
            };
          var t = {},
            r = e.Shadow.prototype;
          return (
            [
              'color',
              'blur',
              'offsetX',
              'offsetY',
              'affectStroke',
              'nonScaling'
            ].forEach(function (e) {
              this[e] !== r[e] && (t[e] = this[e]);
            }, this),
            t
          );
        }
      })),
      void (e.Shadow.reOffsetsAndBlur =
        /(?:\s|^)(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(-?\d+(?:\.\d*)?(?:px)?(?:\s?|$))?(\d+(?:\.\d*)?(?:px)?)?(?:\s?|$)(?:$|\s)/));
})('undefined' != typeof exports ? exports : this);
!(function () {
  'use strict';
  if (fabric.StaticCanvas)
    return void fabric.warn('fabric.StaticCanvas is already defined.');
  var t = fabric.util.object.extend,
    e = fabric.util.getElementOffset,
    r = fabric.util.removeFromArray,
    i = fabric.util.toFixed,
    n = fabric.util.transformPoint,
    a = fabric.util.invertTransform,
    o = fabric.util.getNodeCanvas,
    s = fabric.util.createCanvasElement,
    c = new Error('Could not initialize `canvas` element');
  (fabric.StaticCanvas = fabric.util.createClass(fabric.CommonMethods, {
    initialize: function (t, e) {
      e || (e = {}),
        (this.renderAndResetBound = this.renderAndReset.bind(this)),
        (this.requestRenderAllBound = this.requestRenderAll.bind(this)),
        this._initStatic(t, e);
    },
    backgroundColor: '',
    backgroundImage: null,
    overlayColor: '',
    overlayImage: null,
    includeDefaultValues: !0,
    stateful: !1,
    renderOnAddRemove: !0,
    controlsAboveOverlay: !1,
    allowTouchScrolling: !1,
    imageSmoothingEnabled: !0,
    viewportTransform: fabric.iMatrix.concat(),
    backgroundVpt: !0,
    overlayVpt: !0,
    enableRetinaScaling: !0,
    vptCoords: {},
    skipOffscreen: !0,
    clipPath: void 0,
    _initStatic: function (t, e) {
      var r = this.requestRenderAllBound;
      (this._objects = []),
        this._createLowerCanvas(t),
        this._initOptions(e),
        this.interactive || this._initRetinaScaling(),
        e.overlayImage && this.setOverlayImage(e.overlayImage, r),
        e.backgroundImage && this.setBackgroundImage(e.backgroundImage, r),
        e.backgroundColor && this.setBackgroundColor(e.backgroundColor, r),
        e.overlayColor && this.setOverlayColor(e.overlayColor, r),
        this.calcOffset();
    },
    _isRetinaScaling: function () {
      return fabric.devicePixelRatio > 1 && this.enableRetinaScaling;
    },
    getRetinaScaling: function () {
      return this._isRetinaScaling() ? Math.max(1, fabric.devicePixelRatio) : 1;
    },
    _initRetinaScaling: function () {
      if (this._isRetinaScaling()) {
        var t = fabric.devicePixelRatio;
        this.__initRetinaScaling(t, this.lowerCanvasEl, this.contextContainer),
          this.upperCanvasEl &&
            this.__initRetinaScaling(t, this.upperCanvasEl, this.contextTop);
      }
    },
    __initRetinaScaling: function (t, e, r) {
      e.setAttribute('width', this.width * t),
        e.setAttribute('height', this.height * t),
        r.scale(t, t);
    },
    calcOffset: function () {
      return (this._offset = e(this.lowerCanvasEl)), this;
    },
    setOverlayImage: function (t, e, r) {
      return this.__setBgOverlayImage('overlayImage', t, e, r);
    },
    setBackgroundImage: function (t, e, r) {
      return this.__setBgOverlayImage('backgroundImage', t, e, r);
    },
    setOverlayColor: function (t, e) {
      return this.__setBgOverlayColor('overlayColor', t, e);
    },
    setBackgroundColor: function (t, e) {
      return this.__setBgOverlayColor('backgroundColor', t, e);
    },
    __setBgOverlayImage: function (t, e, r, i) {
      return (
        'string' == typeof e
          ? fabric.util.loadImage(
              e,
              function (e, n) {
                if (e) {
                  var a = new fabric.Image(e, i);
                  (this[t] = a), (a.canvas = this);
                }
                r && r(e, n);
              },
              this,
              i && i.crossOrigin
            )
          : (i && e.setOptions(i),
            (this[t] = e),
            e && (e.canvas = this),
            r && r(e, !1)),
        this
      );
    },
    __setBgOverlayColor: function (t, e, r) {
      return (
        (this[t] = e),
        this._initGradient(e, t),
        this._initPattern(e, t, r),
        this
      );
    },
    _createCanvasElement: function () {
      var t = s();
      if (!t) throw c;
      if ((t.style || (t.style = {}), 'undefined' == typeof t.getContext))
        throw c;
      return t;
    },
    _initOptions: function (t) {
      var e = this.lowerCanvasEl;
      this._setOptions(t),
        (this.width = this.width || parseInt(e.width, 10) || 0),
        (this.height = this.height || parseInt(e.height, 10) || 0),
        this.lowerCanvasEl.style &&
          ((e.width = this.width),
          (e.height = this.height),
          (e.style.width = this.width + 'px'),
          (e.style.height = this.height + 'px'),
          (this.viewportTransform = this.viewportTransform.slice()));
    },
    _createLowerCanvas: function (t) {
      (this.lowerCanvasEl =
        t && t.getContext
          ? t
          : fabric.util.getById(t) || this._createCanvasElement()),
        fabric.util.addClass(this.lowerCanvasEl, 'lower-canvas'),
        (this._originalCanvasStyle = this.lowerCanvasEl.style),
        this.interactive && this._applyCanvasStyle(this.lowerCanvasEl),
        (this.contextContainer = this.lowerCanvasEl.getContext('2d'));
    },
    getWidth: function () {
      return this.width;
    },
    getHeight: function () {
      return this.height;
    },
    setWidth: function (t, e) {
      return this.setDimensions({ width: t }, e);
    },
    setHeight: function (t, e) {
      return this.setDimensions({ height: t }, e);
    },
    setDimensions: function (t, e) {
      var r;
      e = e || {};
      for (var i in t)
        (r = t[i]),
          e.cssOnly ||
            (this._setBackstoreDimension(i, t[i]),
            (r += 'px'),
            (this.hasLostContext = !0)),
          e.backstoreOnly || this._setCssDimension(i, r);
      return (
        this._isCurrentlyDrawing &&
          this.freeDrawingBrush &&
          this.freeDrawingBrush._setBrushStyles(this.contextTop),
        this._initRetinaScaling(),
        this.calcOffset(),
        e.cssOnly || this.requestRenderAll(),
        this
      );
    },
    _setBackstoreDimension: function (t, e) {
      return (
        (this.lowerCanvasEl[t] = e),
        this.upperCanvasEl && (this.upperCanvasEl[t] = e),
        this.cacheCanvasEl && (this.cacheCanvasEl[t] = e),
        (this[t] = e),
        this
      );
    },
    _setCssDimension: function (t, e) {
      return (
        (this.lowerCanvasEl.style[t] = e),
        this.upperCanvasEl && (this.upperCanvasEl.style[t] = e),
        this.wrapperEl && (this.wrapperEl.style[t] = e),
        this
      );
    },
    getZoom: function () {
      return this.viewportTransform[0];
    },
    setViewportTransform: function (t) {
      var e,
        r,
        i,
        n = this._activeObject,
        a = this.backgroundImage,
        o = this.overlayImage;
      for (
        this.viewportTransform = t, r = 0, i = this._objects.length;
        i > r;
        r++
      )
        (e = this._objects[r]), e.group || e.setCoords(!0);
      return (
        n && n.setCoords(),
        a && a.setCoords(!0),
        o && o.setCoords(!0),
        this.calcViewportBoundaries(),
        this.renderOnAddRemove && this.requestRenderAll(),
        this
      );
    },
    zoomToPoint: function (t, e) {
      var r = t,
        i = this.viewportTransform.slice(0);
      (t = n(t, a(this.viewportTransform))), (i[0] = e), (i[3] = e);
      var o = n(t, i);
      return (
        (i[4] += r.x - o.x), (i[5] += r.y - o.y), this.setViewportTransform(i)
      );
    },
    setZoom: function (t) {
      return this.zoomToPoint(new fabric.Point(0, 0), t), this;
    },
    absolutePan: function (t) {
      var e = this.viewportTransform.slice(0);
      return (e[4] = -t.x), (e[5] = -t.y), this.setViewportTransform(e);
    },
    relativePan: function (t) {
      return this.absolutePan(
        new fabric.Point(
          -t.x - this.viewportTransform[4],
          -t.y - this.viewportTransform[5]
        )
      );
    },
    getElement: function () {
      return this.lowerCanvasEl;
    },
    _onObjectAdded: function (t) {
      this.stateful && t.setupState(),
        t._set('canvas', this),
        t.setCoords(),
        this.fire('object:added', { target: t }),
        t.fire('added');
    },
    _onObjectRemoved: function (t) {
      this.fire('object:removed', { target: t }),
        t.fire('removed'),
        delete t.canvas;
    },
    clearContext: function (t) {
      return t.clearRect(0, 0, this.width, this.height), this;
    },
    getContext: function () {
      return this.contextContainer;
    },
    clear: function () {
      return (
        this.remove.apply(this, this.getObjects()),
        (this.backgroundImage = null),
        (this.overlayImage = null),
        (this.backgroundColor = ''),
        (this.overlayColor = ''),
        this._hasITextHandlers &&
          (this.off('mouse:up', this._mouseUpITextHandler),
          (this._iTextInstances = null),
          (this._hasITextHandlers = !1)),
        this.clearContext(this.contextContainer),
        this.fire('canvas:cleared'),
        this.renderOnAddRemove && this.requestRenderAll(),
        this
      );
    },
    renderAll: function () {
      var t = this.contextContainer;
      return this.renderCanvas(t, this._objects), this;
    },
    renderAndReset: function () {
      (this.isRendering = 0), this.renderAll();
    },
    requestRenderAll: function () {
      return (
        this.isRendering ||
          (this.isRendering = fabric.util.requestAnimFrame(
            this.renderAndResetBound
          )),
        this
      );
    },
    calcViewportBoundaries: function () {
      var t = {},
        e = this.width,
        r = this.height,
        i = a(this.viewportTransform);
      return (
        (t.tl = n({ x: 0, y: 0 }, i)),
        (t.br = n({ x: e, y: r }, i)),
        (t.tr = new fabric.Point(t.br.x, t.tl.y)),
        (t.bl = new fabric.Point(t.tl.x, t.br.y)),
        (this.vptCoords = t),
        t
      );
    },
    cancelRequestedRender: function () {
      this.isRendering &&
        (fabric.util.cancelAnimFrame(this.isRendering), (this.isRendering = 0));
    },
    renderCanvas: function (t, e) {
      var r = this.viewportTransform,
        i = this.clipPath;
      this.cancelRequestedRender(),
        this.calcViewportBoundaries(),
        this.clearContext(t),
        fabric.util.setImageSmoothing(t, this.imageSmoothingEnabled),
        this.fire('before:render', { ctx: t }),
        this._renderBackground(t),
        t.save(),
        t.transform(r[0], r[1], r[2], r[3], r[4], r[5]),
        this._renderObjects(t, e),
        t.restore(),
        !this.controlsAboveOverlay && this.interactive && this.drawControls(t),
        i &&
          ((i.canvas = this),
          i.shouldCache(),
          (i._transformDone = !0),
          i.renderCache({ forClipping: !0 }),
          this.drawClipPathOnCanvas(t)),
        this._renderOverlay(t),
        this.controlsAboveOverlay && this.interactive && this.drawControls(t),
        this.fire('after:render', { ctx: t });
    },
    drawClipPathOnCanvas: function (t) {
      var e = this.viewportTransform,
        r = this.clipPath;
      t.save(),
        t.transform(e[0], e[1], e[2], e[3], e[4], e[5]),
        (t.globalCompositeOperation = 'destination-in'),
        r.transform(t),
        t.scale(1 / r.zoomX, 1 / r.zoomY),
        t.drawImage(r._cacheCanvas, -r.cacheTranslationX, -r.cacheTranslationY),
        t.restore();
    },
    _renderObjects: function (t, e) {
      var r, i;
      for (r = 0, i = e.length; i > r; ++r) e[r] && e[r].render(t);
    },
    _renderBackgroundOrOverlay: function (t, e) {
      var r = this[e + 'Color'],
        i = this[e + 'Image'],
        n = this.viewportTransform,
        a = this[e + 'Vpt'];
      if (r || i) {
        if (r) {
          t.save(),
            t.beginPath(),
            t.moveTo(0, 0),
            t.lineTo(this.width, 0),
            t.lineTo(this.width, this.height),
            t.lineTo(0, this.height),
            t.closePath(),
            (t.fillStyle = r.toLive ? r.toLive(t, this) : r),
            a && t.transform(n[0], n[1], n[2], n[3], n[4], n[5]),
            t.transform(1, 0, 0, 1, r.offsetX || 0, r.offsetY || 0);
          var o = r.gradientTransform || r.patternTransform;
          o && t.transform(o[0], o[1], o[2], o[3], o[4], o[5]),
            t.fill(),
            t.restore();
        }
        i &&
          (t.save(),
          a && t.transform(n[0], n[1], n[2], n[3], n[4], n[5]),
          i.render(t),
          t.restore());
      }
    },
    _renderBackground: function (t) {
      this._renderBackgroundOrOverlay(t, 'background');
    },
    _renderOverlay: function (t) {
      this._renderBackgroundOrOverlay(t, 'overlay');
    },
    getCenter: function () {
      return { top: this.height / 2, left: this.width / 2 };
    },
    getCenterPoint: function () {
      return new fabric.Point(this.width / 2, this.height / 2);
    },
    centerObjectH: function (t) {
      return this._centerObject(
        t,
        new fabric.Point(this.getCenterPoint().x, t.getCenterPoint().y)
      );
    },
    centerObjectV: function (t) {
      return this._centerObject(
        t,
        new fabric.Point(t.getCenterPoint().x, this.getCenterPoint().y)
      );
    },
    centerObject: function (t) {
      var e = this.getCenterPoint();
      return this._centerObject(t, e);
    },
    viewportCenterObject: function (t) {
      var e = this.getVpCenter();
      return this._centerObject(t, e);
    },
    viewportCenterObjectH: function (t) {
      var e = this.getVpCenter();
      return (
        this._centerObject(t, new fabric.Point(e.x, t.getCenterPoint().y)), this
      );
    },
    viewportCenterObjectV: function (t) {
      var e = this.getVpCenter();
      return this._centerObject(t, new fabric.Point(t.getCenterPoint().x, e.y));
    },
    getVpCenter: function () {
      var t = this.getCenterPoint(),
        e = a(this.viewportTransform);
      return n(t, e);
    },
    _centerObject: function (t, e) {
      return (
        t.setPositionByOrigin(e, 'center', 'center'),
        t.setCoords(),
        this.renderOnAddRemove && this.requestRenderAll(),
        this
      );
    },
    toDatalessJSON: function (t) {
      return this.toDatalessObject(t);
    },
    toObject: function (t) {
      return this._toObjectMethod('toObject', t);
    },
    toDatalessObject: function (t) {
      return this._toObjectMethod('toDatalessObject', t);
    },
    _toObjectMethod: function (e, r) {
      var i = this.clipPath,
        n = { version: fabric.version, objects: this._toObjects(e, r) };
      return (
        i &&
          !i.excludeFromExport &&
          (n.clipPath = this._toObject(this.clipPath, e, r)),
        t(n, this.__serializeBgOverlay(e, r)),
        fabric.util.populateWithProperties(this, n, r),
        n
      );
    },
    _toObjects: function (t, e) {
      return this._objects
        .filter(function (t) {
          return !t.excludeFromExport;
        })
        .map(function (r) {
          return this._toObject(r, t, e);
        }, this);
    },
    _toObject: function (t, e, r) {
      var i;
      this.includeDefaultValues ||
        ((i = t.includeDefaultValues), (t.includeDefaultValues = !1));
      var n = t[e](r);
      return this.includeDefaultValues || (t.includeDefaultValues = i), n;
    },
    __serializeBgOverlay: function (t, e) {
      var r = {},
        i = this.backgroundImage,
        n = this.overlayImage,
        a = this.backgroundColor,
        o = this.overlayColor;
      return (
        a && a.toObject
          ? a.excludeFromExport || (r.background = a.toObject(e))
          : a && (r.background = a),
        o && o.toObject
          ? o.excludeFromExport || (r.overlay = o.toObject(e))
          : o && (r.overlay = o),
        i &&
          !i.excludeFromExport &&
          (r.backgroundImage = this._toObject(i, t, e)),
        n && !n.excludeFromExport && (r.overlayImage = this._toObject(n, t, e)),
        r
      );
    },
    svgViewportTransformation: !0,
    toSVG: function (t, e) {
      t || (t = {}), (t.reviver = e);
      var r = [];
      return (
        this._setSVGPreamble(r, t),
        this._setSVGHeader(r, t),
        this.clipPath &&
          r.push('<g clip-path="url(#' + this.clipPath.clipPathId + ')" >\n'),
        this._setSVGBgOverlayColor(r, 'background'),
        this._setSVGBgOverlayImage(r, 'backgroundImage', e),
        this._setSVGObjects(r, e),
        this.clipPath && r.push('</g>\n'),
        this._setSVGBgOverlayColor(r, 'overlay'),
        this._setSVGBgOverlayImage(r, 'overlayImage', e),
        r.push('</svg>'),
        r.join('')
      );
    },
    _setSVGPreamble: function (t, e) {
      e.suppressPreamble ||
        t.push(
          '<?xml version="1.0" encoding="',
          e.encoding || 'UTF-8',
          '" standalone="no" ?>\n',
          '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" ',
          '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
        );
    },
    _setSVGHeader: function (t, e) {
      var r,
        n = e.width || this.width,
        a = e.height || this.height,
        o = 'viewBox="0 0 ' + this.width + ' ' + this.height + '" ',
        s = fabric.Object.NUM_FRACTION_DIGITS;
      e.viewBox
        ? (o =
            'viewBox="' +
            e.viewBox.x +
            ' ' +
            e.viewBox.y +
            ' ' +
            e.viewBox.width +
            ' ' +
            e.viewBox.height +
            '" ')
        : this.svgViewportTransformation &&
          ((r = this.viewportTransform),
          (o =
            'viewBox="' +
            i(-r[4] / r[0], s) +
            ' ' +
            i(-r[5] / r[3], s) +
            ' ' +
            i(this.width / r[0], s) +
            ' ' +
            i(this.height / r[3], s) +
            '" ')),
        t.push(
          '<svg ',
          'xmlns="http://www.w3.org/2000/svg" ',
          'xmlns:xlink="http://www.w3.org/1999/xlink" ',
          'version="1.1" ',
          'width="',
          n,
          '" ',
          'height="',
          a,
          '" ',
          o,
          'xml:space="preserve">\n',
          '<desc>Created with Fabric.js ',
          fabric.version,
          '</desc>\n',
          '<defs>\n',
          this.createSVGFontFacesMarkup(),
          this.createSVGRefElementsMarkup(),
          this.createSVGClipPathMarkup(e),
          '</defs>\n'
        );
    },
    createSVGClipPathMarkup: function (t) {
      var e = this.clipPath;
      return e
        ? ((e.clipPathId = 'CLIPPATH_' + fabric.Object.__uid++),
          '<clipPath id="' +
            e.clipPathId +
            '" >\n' +
            this.clipPath.toClipPathSVG(t.reviver) +
            '</clipPath>\n')
        : '';
    },
    createSVGRefElementsMarkup: function () {
      var t = this,
        e = ['background', 'overlay'].map(function (e) {
          var r = t[e + 'Color'];
          if (r && r.toLive) {
            var i = t[e + 'Vpt'],
              n = t.viewportTransform,
              a = {
                width: t.width / (i ? n[0] : 1),
                height: t.height / (i ? n[3] : 1)
              };
            return r.toSVG(a, {
              additionalTransform: i ? fabric.util.matrixToSVG(n) : ''
            });
          }
        });
      return e.join('');
    },
    createSVGFontFacesMarkup: function () {
      var t,
        e,
        r,
        i,
        n,
        a,
        o,
        s,
        c,
        l = '',
        u = {},
        f = fabric.fontPaths,
        h = [];
      for (
        this._objects.forEach(function p(t) {
          h.push(t), t._objects && t._objects.forEach(p);
        }),
          s = 0,
          c = h.length;
        c > s;
        s++
      )
        if (
          ((t = h[s]),
          (e = t.fontFamily),
          -1 !== t.type.indexOf('text') &&
            !u[e] &&
            f[e] &&
            ((u[e] = !0), t.styles))
        ) {
          r = t.styles;
          for (n in r) {
            i = r[n];
            for (o in i)
              (a = i[o]), (e = a.fontFamily), !u[e] && f[e] && (u[e] = !0);
          }
        }
      for (var d in u)
        l += [
          '		@font-face {\n',
          "			font-family: '",
          d,
          "';\n",
          "			src: url('",
          f[d],
          "');\n",
          '		}\n'
        ].join('');
      return (
        l &&
          (l = [
            '	<style type="text/css">',
            '<![CDATA[\n',
            l,
            ']]>',
            '</style>\n'
          ].join('')),
        l
      );
    },
    _setSVGObjects: function (t, e) {
      var r,
        i,
        n,
        a = this._objects;
      for (i = 0, n = a.length; n > i; i++)
        (r = a[i]), r.excludeFromExport || this._setSVGObject(t, r, e);
    },
    _setSVGObject: function (t, e, r) {
      t.push(e.toSVG(r));
    },
    _setSVGBgOverlayImage: function (t, e, r) {
      this[e] &&
        !this[e].excludeFromExport &&
        this[e].toSVG &&
        t.push(this[e].toSVG(r));
    },
    _setSVGBgOverlayColor: function (t, e) {
      var r = this[e + 'Color'],
        i = this.viewportTransform,
        n = this.width,
        a = this.height;
      if (r)
        if (r.toLive) {
          var o = r.repeat,
            s = fabric.util.invertTransform(i),
            c = this[e + 'Vpt'],
            l = c ? fabric.util.matrixToSVG(s) : '';
          t.push(
            '<rect transform="' + l + ' translate(',
            n / 2,
            ',',
            a / 2,
            ')"',
            ' x="',
            r.offsetX - n / 2,
            '" y="',
            r.offsetY - a / 2,
            '" ',
            'width="',
            'repeat-y' === o || 'no-repeat' === o ? r.source.width : n,
            '" height="',
            'repeat-x' === o || 'no-repeat' === o ? r.source.height : a,
            '" fill="url(#SVGID_' + r.id + ')"',
            '></rect>\n'
          );
        } else
          t.push(
            '<rect x="0" y="0" width="100%" height="100%" ',
            'fill="',
            r,
            '"',
            '></rect>\n'
          );
    },
    sendToBack: function (t) {
      if (!t) return this;
      var e,
        i,
        n,
        a = this._activeObject;
      if (t === a && 'activeSelection' === t.type)
        for (n = a._objects, e = n.length; e--; )
          (i = n[e]), r(this._objects, i), this._objects.unshift(i);
      else r(this._objects, t), this._objects.unshift(t);
      return this.renderOnAddRemove && this.requestRenderAll(), this;
    },
    bringToFront: function (t) {
      if (!t) return this;
      var e,
        i,
        n,
        a = this._activeObject;
      if (t === a && 'activeSelection' === t.type)
        for (n = a._objects, e = 0; e < n.length; e++)
          (i = n[e]), r(this._objects, i), this._objects.push(i);
      else r(this._objects, t), this._objects.push(t);
      return this.renderOnAddRemove && this.requestRenderAll(), this;
    },
    sendBackwards: function (t, e) {
      if (!t) return this;
      var i,
        n,
        a,
        o,
        s,
        c = this._activeObject,
        l = 0;
      if (t === c && 'activeSelection' === t.type)
        for (s = c._objects, i = 0; i < s.length; i++)
          (n = s[i]),
            (a = this._objects.indexOf(n)),
            a > 0 + l &&
              ((o = a - 1), r(this._objects, n), this._objects.splice(o, 0, n)),
            l++;
      else
        (a = this._objects.indexOf(t)),
          0 !== a &&
            ((o = this._findNewLowerIndex(t, a, e)),
            r(this._objects, t),
            this._objects.splice(o, 0, t));
      return this.renderOnAddRemove && this.requestRenderAll(), this;
    },
    _findNewLowerIndex: function (t, e, r) {
      var i, n;
      if (r)
        for (i = e, n = e - 1; n >= 0; --n) {
          var a =
            t.intersectsWithObject(this._objects[n]) ||
            t.isContainedWithinObject(this._objects[n]) ||
            this._objects[n].isContainedWithinObject(t);
          if (a) {
            i = n;
            break;
          }
        }
      else i = e - 1;
      return i;
    },
    bringForward: function (t, e) {
      if (!t) return this;
      var i,
        n,
        a,
        o,
        s,
        c = this._activeObject,
        l = 0;
      if (t === c && 'activeSelection' === t.type)
        for (s = c._objects, i = s.length; i--; )
          (n = s[i]),
            (a = this._objects.indexOf(n)),
            a < this._objects.length - 1 - l &&
              ((o = a + 1), r(this._objects, n), this._objects.splice(o, 0, n)),
            l++;
      else
        (a = this._objects.indexOf(t)),
          a !== this._objects.length - 1 &&
            ((o = this._findNewUpperIndex(t, a, e)),
            r(this._objects, t),
            this._objects.splice(o, 0, t));
      return this.renderOnAddRemove && this.requestRenderAll(), this;
    },
    _findNewUpperIndex: function (t, e, r) {
      var i, n, a;
      if (r)
        for (i = e, n = e + 1, a = this._objects.length; a > n; ++n) {
          var o =
            t.intersectsWithObject(this._objects[n]) ||
            t.isContainedWithinObject(this._objects[n]) ||
            this._objects[n].isContainedWithinObject(t);
          if (o) {
            i = n;
            break;
          }
        }
      else i = e + 1;
      return i;
    },
    moveTo: function (t, e) {
      return (
        r(this._objects, t),
        this._objects.splice(e, 0, t),
        this.renderOnAddRemove && this.requestRenderAll()
      );
    },
    dispose: function () {
      return (
        this.isRendering &&
          (fabric.util.cancelAnimFrame(this.isRendering),
          (this.isRendering = 0)),
        this.forEachObject(function (t) {
          t.dispose && t.dispose();
        }),
        (this._objects = []),
        this.backgroundImage &&
          this.backgroundImage.dispose &&
          this.backgroundImage.dispose(),
        (this.backgroundImage = null),
        this.overlayImage &&
          this.overlayImage.dispose &&
          this.overlayImage.dispose(),
        (this.overlayImage = null),
        (this._iTextInstances = null),
        (this.contextContainer = null),
        this.lowerCanvasEl.classList.remove('lower-canvas'),
        fabric.util.setStyle(this.lowerCanvasEl, this._originalCanvasStyle),
        delete this._originalCanvasStyle,
        this.lowerCanvasEl.setAttribute('width', this.width),
        this.lowerCanvasEl.setAttribute('height', this.height),
        fabric.util.cleanUpJsdomNode(this.lowerCanvasEl),
        (this.lowerCanvasEl = void 0),
        this
      );
    },
    toString: function () {
      return (
        '#<fabric.Canvas (' +
        this.complexity() +
        '): { objects: ' +
        this._objects.length +
        ' }>'
      );
    }
  })),
    t(fabric.StaticCanvas.prototype, fabric.Observable),
    t(fabric.StaticCanvas.prototype, fabric.Collection),
    t(fabric.StaticCanvas.prototype, fabric.DataURLExporter),
    t(fabric.StaticCanvas, {
      EMPTY_JSON: '{"objects": [], "background": "white"}',
      supports: function (t) {
        var e = s();
        if (!e || !e.getContext) return null;
        var r = e.getContext('2d');
        if (!r) return null;
        switch (t) {
          case 'setLineDash':
            return 'undefined' != typeof r.setLineDash;
          default:
            return null;
        }
      }
    }),
    (fabric.StaticCanvas.prototype.toJSON =
      fabric.StaticCanvas.prototype.toObject),
    fabric.isLikelyNode &&
      ((fabric.StaticCanvas.prototype.createPNGStream = function () {
        var t = o(this.lowerCanvasEl);
        return t && t.createPNGStream();
      }),
      (fabric.StaticCanvas.prototype.createJPEGStream = function (t) {
        var e = o(this.lowerCanvasEl);
        return e && e.createJPEGStream(t);
      }));
})();
fabric.BaseBrush = fabric.util.createClass({
  color: 'rgb(0, 0, 0)',
  width: 1,
  shadow: null,
  strokeLineCap: 'round',
  strokeLineJoin: 'round',
  strokeMiterLimit: 10,
  strokeDashArray: null,
  limitedToCanvasSize: !1,
  _setBrushStyles: function (t) {
    (t.strokeStyle = this.color),
      (t.lineWidth = this.width),
      (t.lineCap = this.strokeLineCap),
      (t.miterLimit = this.strokeMiterLimit),
      (t.lineJoin = this.strokeLineJoin),
      t.setLineDash(this.strokeDashArray || []);
  },
  _saveAndTransform: function (t) {
    var e = this.canvas.viewportTransform;
    t.save(), t.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
  },
  _setShadow: function () {
    if (this.shadow) {
      var t = this.canvas,
        e = this.shadow,
        r = t.contextTop,
        i = t.getZoom();
      t && t._isRetinaScaling() && (i *= fabric.devicePixelRatio),
        (r.shadowColor = e.color),
        (r.shadowBlur = e.blur * i),
        (r.shadowOffsetX = e.offsetX * i),
        (r.shadowOffsetY = e.offsetY * i);
    }
  },
  needsFullRender: function () {
    var t = new fabric.Color(this.color);
    return t.getAlpha() < 1 || !!this.shadow;
  },
  _resetShadow: function () {
    var t = this.canvas.contextTop;
    (t.shadowColor = ''),
      (t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0);
  },
  _isOutSideCanvas: function (t) {
    return (
      t.x < 0 ||
      t.x > this.canvas.getWidth() ||
      t.y < 0 ||
      t.y > this.canvas.getHeight()
    );
  }
});
!(function () {
  fabric.PencilBrush = fabric.util.createClass(fabric.BaseBrush, {
    decimate: 0.4,
    drawStraightLine: !1,
    straightLineKey: 'shiftKey',
    initialize: function (t) {
      (this.canvas = t), (this._points = []);
    },
    needsFullRender: function () {
      return this.callSuper('needsFullRender') || this._hasStraightLine;
    },
    _drawSegment: function (t, e, r) {
      var i = e.midPointFrom(r);
      return t.quadraticCurveTo(e.x, e.y, i.x, i.y), i;
    },
    onMouseDown: function (t, e) {
      this.canvas._isMainEvent(e.e) &&
        ((this.drawStraightLine = e.e[this.straightLineKey]),
        this._prepareForDrawing(t),
        this._captureDrawingPath(t),
        this._render());
    },
    onMouseMove: function (t, e) {
      if (
        this.canvas._isMainEvent(e.e) &&
        ((this.drawStraightLine = e.e[this.straightLineKey]),
        (this.limitedToCanvasSize !== !0 || !this._isOutSideCanvas(t)) &&
          this._captureDrawingPath(t) &&
          this._points.length > 1)
      )
        if (this.needsFullRender())
          this.canvas.clearContext(this.canvas.contextTop), this._render();
        else {
          var r = this._points,
            i = r.length,
            n = this.canvas.contextTop;
          this._saveAndTransform(n),
            this.oldEnd &&
              (n.beginPath(), n.moveTo(this.oldEnd.x, this.oldEnd.y)),
            (this.oldEnd = this._drawSegment(n, r[i - 2], r[i - 1], !0)),
            n.stroke(),
            n.restore();
        }
    },
    onMouseUp: function (t) {
      return this.canvas._isMainEvent(t.e)
        ? ((this.drawStraightLine = !1),
          (this.oldEnd = void 0),
          this._finalizeAndAddPath(),
          !1)
        : !0;
    },
    _prepareForDrawing: function (t) {
      var e = new fabric.Point(t.x, t.y);
      this._reset(), this._addPoint(e), this.canvas.contextTop.moveTo(e.x, e.y);
    },
    _addPoint: function (t) {
      return this._points.length > 1 &&
        t.eq(this._points[this._points.length - 1])
        ? !1
        : (this.drawStraightLine &&
            this._points.length > 1 &&
            ((this._hasStraightLine = !0), this._points.pop()),
          this._points.push(t),
          !0);
    },
    _reset: function () {
      (this._points = []),
        this._setBrushStyles(this.canvas.contextTop),
        this._setShadow(),
        (this._hasStraightLine = !1);
    },
    _captureDrawingPath: function (t) {
      var e = new fabric.Point(t.x, t.y);
      return this._addPoint(e);
    },
    _render: function (t) {
      var e,
        r,
        i = this._points[0],
        n = this._points[1];
      if (
        ((t = t || this.canvas.contextTop),
        this._saveAndTransform(t),
        t.beginPath(),
        2 === this._points.length && i.x === n.x && i.y === n.y)
      ) {
        var a = this.width / 1e3;
        (i = new fabric.Point(i.x, i.y)),
          (n = new fabric.Point(n.x, n.y)),
          (i.x -= a),
          (n.x += a);
      }
      for (t.moveTo(i.x, i.y), e = 1, r = this._points.length; r > e; e++)
        this._drawSegment(t, i, n),
          (i = this._points[e]),
          (n = this._points[e + 1]);
      t.lineTo(i.x, i.y), t.stroke(), t.restore();
    },
    convertPointsToSVGPath: function (t) {
      var e = this.width / 1e3;
      return fabric.util.getSmoothPathFromPoints(t, e);
    },
    _isEmptySVGPath: function (t) {
      var e = fabric.util.joinPath(t);
      return 'M 0 0 Q 0 0 0 0 L 0 0' === e;
    },
    createPath: function (t) {
      var e = new fabric.Path(t, {
        fill: null,
        stroke: this.color,
        strokeWidth: this.width,
        strokeLineCap: this.strokeLineCap,
        strokeMiterLimit: this.strokeMiterLimit,
        strokeLineJoin: this.strokeLineJoin,
        strokeDashArray: this.strokeDashArray
      });
      return (
        this.shadow &&
          ((this.shadow.affectStroke = !0),
          (e.shadow = new fabric.Shadow(this.shadow))),
        e
      );
    },
    decimatePoints: function (t, e) {
      if (t.length <= 2) return t;
      var r,
        i,
        n = this.canvas.getZoom(),
        a = Math.pow(e / n, 2),
        o = t.length - 1,
        s = t[0],
        c = [s];
      for (r = 1; o - 1 > r; r++)
        (i = Math.pow(s.x - t[r].x, 2) + Math.pow(s.y - t[r].y, 2)),
          i >= a && ((s = t[r]), c.push(s));
      return c.push(t[o]), c;
    },
    _finalizeAndAddPath: function () {
      var t = this.canvas.contextTop;
      t.closePath(),
        this.decimate &&
          (this._points = this.decimatePoints(this._points, this.decimate));
      var e = this.convertPointsToSVGPath(this._points);
      if (this._isEmptySVGPath(e)) return void this.canvas.requestRenderAll();
      var r = this.createPath(e);
      this.canvas.clearContext(this.canvas.contextTop),
        this.canvas.fire('before:path:created', { path: r }),
        this.canvas.add(r),
        this.canvas.requestRenderAll(),
        r.setCoords(),
        this._resetShadow(),
        this.canvas.fire('path:created', { path: r });
    }
  });
})();
fabric.CircleBrush = fabric.util.createClass(fabric.BaseBrush, {
  width: 10,
  initialize: function (t) {
    (this.canvas = t), (this.points = []);
  },
  drawDot: function (t) {
    var e = this.addPoint(t),
      r = this.canvas.contextTop;
    this._saveAndTransform(r), this.dot(r, e), r.restore();
  },
  dot: function (t, e) {
    (t.fillStyle = e.fill),
      t.beginPath(),
      t.arc(e.x, e.y, e.radius, 0, 2 * Math.PI, !1),
      t.closePath(),
      t.fill();
  },
  onMouseDown: function (t) {
    (this.points.length = 0),
      this.canvas.clearContext(this.canvas.contextTop),
      this._setShadow(),
      this.drawDot(t);
  },
  _render: function () {
    var t,
      e,
      r = this.canvas.contextTop,
      i = this.points;
    for (this._saveAndTransform(r), t = 0, e = i.length; e > t; t++)
      this.dot(r, i[t]);
    r.restore();
  },
  onMouseMove: function (t) {
    (this.limitedToCanvasSize === !0 && this._isOutSideCanvas(t)) ||
      (this.needsFullRender()
        ? (this.canvas.clearContext(this.canvas.contextTop),
          this.addPoint(t),
          this._render())
        : this.drawDot(t));
  },
  onMouseUp: function () {
    var t,
      e,
      r = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = !1;
    var i = [];
    for (t = 0, e = this.points.length; e > t; t++) {
      var n = this.points[t],
        a = new fabric.Circle({
          radius: n.radius,
          left: n.x,
          top: n.y,
          originX: 'center',
          originY: 'center',
          fill: n.fill
        });
      this.shadow && (a.shadow = new fabric.Shadow(this.shadow)), i.push(a);
    }
    var o = new fabric.Group(i);
    (o.canvas = this.canvas),
      this.canvas.fire('before:path:created', { path: o }),
      this.canvas.add(o),
      this.canvas.fire('path:created', { path: o }),
      this.canvas.clearContext(this.canvas.contextTop),
      this._resetShadow(),
      (this.canvas.renderOnAddRemove = r),
      this.canvas.requestRenderAll();
  },
  addPoint: function (t) {
    var e = new fabric.Point(t.x, t.y),
      r =
        fabric.util.getRandomInt(
          Math.max(0, this.width - 20),
          this.width + 20
        ) / 2,
      i = new fabric.Color(this.color)
        .setAlpha(fabric.util.getRandomInt(0, 100) / 100)
        .toRgba();
    return (e.radius = r), (e.fill = i), this.points.push(e), e;
  }
});
fabric.SprayBrush = fabric.util.createClass(fabric.BaseBrush, {
  width: 10,
  density: 20,
  dotWidth: 1,
  dotWidthVariance: 1,
  randomOpacity: !1,
  optimizeOverlapping: !0,
  initialize: function (t) {
    (this.canvas = t), (this.sprayChunks = []);
  },
  onMouseDown: function (t) {
    (this.sprayChunks.length = 0),
      this.canvas.clearContext(this.canvas.contextTop),
      this._setShadow(),
      this.addSprayChunk(t),
      this.render(this.sprayChunkPoints);
  },
  onMouseMove: function (t) {
    (this.limitedToCanvasSize === !0 && this._isOutSideCanvas(t)) ||
      (this.addSprayChunk(t), this.render(this.sprayChunkPoints));
  },
  onMouseUp: function () {
    var t = this.canvas.renderOnAddRemove;
    this.canvas.renderOnAddRemove = !1;
    for (var e = [], r = 0, i = this.sprayChunks.length; i > r; r++)
      for (var n = this.sprayChunks[r], a = 0, o = n.length; o > a; a++) {
        var s = new fabric.Rect({
          width: n[a].width,
          height: n[a].width,
          left: n[a].x + 1,
          top: n[a].y + 1,
          originX: 'center',
          originY: 'center',
          fill: this.color
        });
        e.push(s);
      }
    this.optimizeOverlapping && (e = this._getOptimizedRects(e));
    var c = new fabric.Group(e);
    this.shadow && c.set('shadow', new fabric.Shadow(this.shadow)),
      this.canvas.fire('before:path:created', { path: c }),
      this.canvas.add(c),
      this.canvas.fire('path:created', { path: c }),
      this.canvas.clearContext(this.canvas.contextTop),
      this._resetShadow(),
      (this.canvas.renderOnAddRemove = t),
      this.canvas.requestRenderAll();
  },
  _getOptimizedRects: function (t) {
    var e,
      r,
      i,
      n = {};
    for (r = 0, i = t.length; i > r; r++)
      (e = t[r].left + '' + t[r].top), n[e] || (n[e] = t[r]);
    var a = [];
    for (e in n) a.push(n[e]);
    return a;
  },
  render: function (t) {
    var e,
      r,
      i = this.canvas.contextTop;
    for (
      i.fillStyle = this.color, this._saveAndTransform(i), e = 0, r = t.length;
      r > e;
      e++
    ) {
      var n = t[e];
      'undefined' != typeof n.opacity && (i.globalAlpha = n.opacity),
        i.fillRect(n.x, n.y, n.width, n.width);
    }
    i.restore();
  },
  _render: function () {
    var t,
      e,
      r = this.canvas.contextTop;
    for (
      r.fillStyle = this.color,
        this._saveAndTransform(r),
        t = 0,
        e = this.sprayChunks.length;
      e > t;
      t++
    )
      this.render(this.sprayChunks[t]);
    r.restore();
  },
  addSprayChunk: function (t) {
    this.sprayChunkPoints = [];
    var e,
      r,
      i,
      n,
      a = this.width / 2;
    for (n = 0; n < this.density; n++) {
      (e = fabric.util.getRandomInt(t.x - a, t.x + a)),
        (r = fabric.util.getRandomInt(t.y - a, t.y + a)),
        (i = this.dotWidthVariance
          ? fabric.util.getRandomInt(
              Math.max(1, this.dotWidth - this.dotWidthVariance),
              this.dotWidth + this.dotWidthVariance
            )
          : this.dotWidth);
      var o = new fabric.Point(e, r);
      (o.width = i),
        this.randomOpacity &&
          (o.opacity = fabric.util.getRandomInt(0, 100) / 100),
        this.sprayChunkPoints.push(o);
    }
    this.sprayChunks.push(this.sprayChunkPoints);
  }
});
fabric.PatternBrush = fabric.util.createClass(fabric.PencilBrush, {
  getPatternSrc: function () {
    var t = 20,
      e = 5,
      r = fabric.util.createCanvasElement(),
      i = r.getContext('2d');
    return (
      (r.width = r.height = t + e),
      (i.fillStyle = this.color),
      i.beginPath(),
      i.arc(t / 2, t / 2, t / 2, 0, 2 * Math.PI, !1),
      i.closePath(),
      i.fill(),
      r
    );
  },
  getPatternSrcFunction: function () {
    return String(this.getPatternSrc).replace(
      'this.color',
      '"' + this.color + '"'
    );
  },
  getPattern: function (t) {
    return t.createPattern(this.source || this.getPatternSrc(), 'repeat');
  },
  _setBrushStyles: function (t) {
    this.callSuper('_setBrushStyles', t), (t.strokeStyle = this.getPattern(t));
  },
  createPath: function (t) {
    var e = this.callSuper('createPath', t),
      r = e._getLeftTopCoords().scalarAdd(e.strokeWidth / 2);
    return (
      (e.stroke = new fabric.Pattern({
        source: this.source || this.getPatternSrcFunction(),
        offsetX: -r.x,
        offsetY: -r.y
      })),
      e
    );
  }
});
!(function () {
  var t = fabric.util.getPointer,
    e = fabric.util.degreesToRadians,
    r = fabric.util.isTouchEvent;
  fabric.Canvas = fabric.util.createClass(fabric.StaticCanvas, {
    initialize: function (t, e) {
      e || (e = {}),
        (this.renderAndResetBound = this.renderAndReset.bind(this)),
        (this.requestRenderAllBound = this.requestRenderAll.bind(this)),
        this._initStatic(t, e),
        this._initInteractive(),
        this._createCacheCanvas();
    },
    uniformScaling: !0,
    uniScaleKey: 'shiftKey',
    centeredScaling: !1,
    centeredRotation: !1,
    centeredKey: 'altKey',
    altActionKey: 'shiftKey',
    interactive: !0,
    selection: !0,
    selectionKey: 'shiftKey',
    altSelectionKey: null,
    selectionColor: 'rgba(100, 100, 255, 0.3)',
    selectionDashArray: [],
    selectionBorderColor: 'rgba(255, 255, 255, 0.3)',
    selectionLineWidth: 1,
    selectionFullyContained: !1,
    hoverCursor: 'move',
    moveCursor: 'move',
    defaultCursor: 'default',
    freeDrawingCursor: 'crosshair',
    notAllowedCursor: 'not-allowed',
    containerClass: 'canvas-container',
    perPixelTargetFind: !1,
    targetFindTolerance: 0,
    skipTargetFind: !1,
    isDrawingMode: !1,
    preserveObjectStacking: !1,
    snapAngle: 0,
    snapThreshold: null,
    stopContextMenu: !1,
    fireRightClick: !1,
    fireMiddleClick: !1,
    targets: [],
    enablePointerEvents: !1,
    _hoveredTarget: null,
    _hoveredTargets: [],
    _initInteractive: function () {
      (this._currentTransform = null),
        (this._groupSelector = null),
        this._initWrapperElement(),
        this._createUpperCanvas(),
        this._initEventListeners(),
        this._initRetinaScaling(),
        (this.freeDrawingBrush =
          fabric.PencilBrush && new fabric.PencilBrush(this)),
        this.calcOffset();
    },
    _chooseObjectsToRender: function () {
      var t,
        e,
        r,
        i = this.getActiveObjects();
      if (i.length > 0 && !this.preserveObjectStacking) {
        (e = []), (r = []);
        for (var n = 0, a = this._objects.length; a > n; n++)
          (t = this._objects[n]), -1 === i.indexOf(t) ? e.push(t) : r.push(t);
        i.length > 1 && (this._activeObject._objects = r), e.push.apply(e, r);
      } else e = this._objects;
      return e;
    },
    renderAll: function () {
      !this.contextTopDirty ||
        this._groupSelector ||
        this.isDrawingMode ||
        (this.clearContext(this.contextTop), (this.contextTopDirty = !1)),
        this.hasLostContext &&
          (this.renderTopLayer(this.contextTop), (this.hasLostContext = !1));
      var t = this.contextContainer;
      return this.renderCanvas(t, this._chooseObjectsToRender()), this;
    },
    renderTopLayer: function (t) {
      t.save(),
        this.isDrawingMode &&
          this._isCurrentlyDrawing &&
          (this.freeDrawingBrush && this.freeDrawingBrush._render(),
          (this.contextTopDirty = !0)),
        this.selection &&
          this._groupSelector &&
          (this._drawSelection(t), (this.contextTopDirty = !0)),
        t.restore();
    },
    renderTop: function () {
      var t = this.contextTop;
      return (
        this.clearContext(t),
        this.renderTopLayer(t),
        this.fire('after:render'),
        this
      );
    },
    _normalizePointer: function (t, e) {
      var r = t.calcTransformMatrix(),
        i = fabric.util.invertTransform(r),
        n = this.restorePointerVpt(e);
      return fabric.util.transformPoint(n, i);
    },
    isTargetTransparent: function (t, e, r) {
      if (t.shouldCache() && t._cacheCanvas && t !== this._activeObject) {
        var i = this._normalizePointer(t, { x: e, y: r }),
          n = Math.max(t.cacheTranslationX + i.x * t.zoomX, 0),
          a = Math.max(t.cacheTranslationY + i.y * t.zoomY, 0),
          s = fabric.util.isTransparent(
            t._cacheContext,
            Math.round(n),
            Math.round(a),
            this.targetFindTolerance
          );
        return s;
      }
      var o = this.contextCache,
        c = t.selectionBackgroundColor,
        l = this.viewportTransform;
      (t.selectionBackgroundColor = ''),
        this.clearContext(o),
        o.save(),
        o.transform(l[0], l[1], l[2], l[3], l[4], l[5]),
        t.render(o),
        o.restore(),
        (t.selectionBackgroundColor = c);
      var s = fabric.util.isTransparent(o, e, r, this.targetFindTolerance);
      return s;
    },
    _isSelectionKeyPressed: function (t) {
      var e = !1;
      return (e = Array.isArray(this.selectionKey)
        ? !!this.selectionKey.find(function (e) {
            return t[e] === !0;
          })
        : t[this.selectionKey]);
    },
    _shouldClearSelection: function (t, e) {
      var r = this.getActiveObjects(),
        i = this._activeObject;
      return (
        !e ||
        (e &&
          i &&
          r.length > 1 &&
          -1 === r.indexOf(e) &&
          i !== e &&
          !this._isSelectionKeyPressed(t)) ||
        (e && !e.evented) ||
        (e && !e.selectable && i && i !== e)
      );
    },
    _shouldCenterTransform: function (t, e, r) {
      if (t) {
        var i;
        return (
          'scale' === e || 'scaleX' === e || 'scaleY' === e || 'resizing' === e
            ? (i = this.centeredScaling || t.centeredScaling)
            : 'rotate' === e &&
              (i = this.centeredRotation || t.centeredRotation),
          i ? !r : r
        );
      }
    },
    _getOriginFromCorner: function (t, e) {
      var r = { x: t.originX, y: t.originY };
      return (
        'ml' === e || 'tl' === e || 'bl' === e
          ? (r.x = 'right')
          : ('mr' === e || 'tr' === e || 'br' === e) && (r.x = 'left'),
        'tl' === e || 'mt' === e || 'tr' === e
          ? (r.y = 'bottom')
          : ('bl' === e || 'mb' === e || 'br' === e) && (r.y = 'top'),
        r
      );
    },
    _getActionFromCorner: function (t, e, r, i) {
      if (!e || !t) return 'drag';
      var n = i.controls[e];
      return n.getActionName(r, n, i);
    },
    _setupCurrentTransform: function (t, r, i) {
      if (r) {
        var n = this.getPointer(t),
          a = r.__corner,
          s = r.controls[a],
          o =
            i && a
              ? s.getActionHandler(t, r, s)
              : fabric.controlsUtils.dragHandler,
          c = this._getActionFromCorner(i, a, t, r),
          l = this._getOriginFromCorner(r, a),
          u = t[this.centeredKey],
          h = {
            target: r,
            action: c,
            actionHandler: o,
            corner: a,
            scaleX: r.scaleX,
            scaleY: r.scaleY,
            skewX: r.skewX,
            skewY: r.skewY,
            offsetX: n.x - r.left,
            offsetY: n.y - r.top,
            originX: l.x,
            originY: l.y,
            ex: n.x,
            ey: n.y,
            lastX: n.x,
            lastY: n.y,
            theta: e(r.angle),
            width: r.width * r.scaleX,
            shiftKey: t.shiftKey,
            altKey: u,
            original: fabric.util.saveObjectTransform(r)
          };
        this._shouldCenterTransform(r, c, u) &&
          ((h.originX = 'center'), (h.originY = 'center')),
          (h.original.originX = l.x),
          (h.original.originY = l.y),
          (this._currentTransform = h),
          this._beforeTransform(t);
      }
    },
    setCursor: function (t) {
      this.upperCanvasEl.style.cursor = t;
    },
    _drawSelection: function (t) {
      var e = this._groupSelector,
        r = new fabric.Point(e.ex, e.ey),
        i = fabric.util.transformPoint(r, this.viewportTransform),
        n = new fabric.Point(e.ex + e.left, e.ey + e.top),
        a = fabric.util.transformPoint(n, this.viewportTransform),
        s = Math.min(i.x, a.x),
        o = Math.min(i.y, a.y),
        c = Math.max(i.x, a.x),
        l = Math.max(i.y, a.y),
        u = this.selectionLineWidth / 2;
      this.selectionColor &&
        ((t.fillStyle = this.selectionColor), t.fillRect(s, o, c - s, l - o)),
        this.selectionLineWidth &&
          this.selectionBorderColor &&
          ((t.lineWidth = this.selectionLineWidth),
          (t.strokeStyle = this.selectionBorderColor),
          (s += u),
          (o += u),
          (c -= u),
          (l -= u),
          fabric.Object.prototype._setLineDash.call(
            this,
            t,
            this.selectionDashArray
          ),
          t.strokeRect(s, o, c - s, l - o));
    },
    findTarget: function (t, e) {
      if (!this.skipTargetFind) {
        var i,
          n,
          a = !0,
          s = this.getPointer(t, a),
          o = this._activeObject,
          c = this.getActiveObjects(),
          l = r(t),
          u = (c.length > 1 && !e) || 1 === c.length;
        if (((this.targets = []), u && o._findTargetCorner(s, l))) return o;
        if (c.length > 1 && !e && o === this._searchPossibleTargets([o], s))
          return o;
        if (1 === c.length && o === this._searchPossibleTargets([o], s)) {
          if (!this.preserveObjectStacking) return o;
          (i = o), (n = this.targets), (this.targets = []);
        }
        var h = this._searchPossibleTargets(this._objects, s);
        return (
          t[this.altSelectionKey] &&
            h &&
            i &&
            h !== i &&
            ((h = i), (this.targets = n)),
          h
        );
      }
    },
    _checkTarget: function (t, e, r) {
      if (e && e.visible && e.evented && e.containsPoint(t)) {
        if ((!this.perPixelTargetFind && !e.perPixelTargetFind) || e.isEditing)
          return !0;
        var i = this.isTargetTransparent(e, r.x, r.y);
        if (!i) return !0;
      }
    },
    _searchPossibleTargets: function (t, e) {
      for (var r, i, n = t.length; n--; ) {
        var a = t[n],
          s = a.group ? this._normalizePointer(a.group, e) : e;
        if (this._checkTarget(s, a, e)) {
          (r = t[n]),
            r.subTargetCheck &&
              r instanceof fabric.Group &&
              ((i = this._searchPossibleTargets(r._objects, e)),
              i && this.targets.push(i));
          break;
        }
      }
      return r;
    },
    restorePointerVpt: function (t) {
      return fabric.util.transformPoint(
        t,
        fabric.util.invertTransform(this.viewportTransform)
      );
    },
    getPointer: function (e, r) {
      if (this._absolutePointer && !r) return this._absolutePointer;
      if (this._pointer && r) return this._pointer;
      var i,
        n = t(e),
        a = this.upperCanvasEl,
        s = a.getBoundingClientRect(),
        o = s.width || 0,
        c = s.height || 0;
      (o && c) ||
        ('top' in s && 'bottom' in s && (c = Math.abs(s.top - s.bottom)),
        'right' in s && 'left' in s && (o = Math.abs(s.right - s.left))),
        this.calcOffset(),
        (n.x = n.x - this._offset.left),
        (n.y = n.y - this._offset.top),
        r || (n = this.restorePointerVpt(n));
      var l = this.getRetinaScaling();
      return (
        1 !== l && ((n.x /= l), (n.y /= l)),
        (i =
          0 === o || 0 === c
            ? { width: 1, height: 1 }
            : { width: a.width / o, height: a.height / c }),
        { x: n.x * i.width, y: n.y * i.height }
      );
    },
    _createUpperCanvas: function () {
      var t = this.lowerCanvasEl.className.replace(/\s*lower-canvas\s*/, ''),
        e = this.lowerCanvasEl,
        r = this.upperCanvasEl;
      r
        ? (r.className = '')
        : ((r = this._createCanvasElement()), (this.upperCanvasEl = r)),
        fabric.util.addClass(r, 'upper-canvas ' + t),
        this.wrapperEl.appendChild(r),
        this._copyCanvasStyle(e, r),
        this._applyCanvasStyle(r),
        (this.contextTop = r.getContext('2d'));
    },
    getTopContext: function () {
      return this.contextTop;
    },
    _createCacheCanvas: function () {
      (this.cacheCanvasEl = this._createCanvasElement()),
        this.cacheCanvasEl.setAttribute('width', this.width),
        this.cacheCanvasEl.setAttribute('height', this.height),
        (this.contextCache = this.cacheCanvasEl.getContext('2d'));
    },
    _initWrapperElement: function () {
      (this.wrapperEl = fabric.util.wrapElement(this.lowerCanvasEl, 'div', {
        class: this.containerClass
      })),
        fabric.util.setStyle(this.wrapperEl, {
          width: this.width + 'px',
          height: this.height + 'px',
          position: 'relative'
        }),
        fabric.util.makeElementUnselectable(this.wrapperEl);
    },
    _applyCanvasStyle: function (t) {
      var e = this.width || t.width,
        r = this.height || t.height;
      fabric.util.setStyle(t, {
        position: 'absolute',
        width: e + 'px',
        height: r + 'px',
        left: 0,
        top: 0,
        'touch-action': this.allowTouchScrolling ? 'manipulation' : 'none',
        '-ms-touch-action': this.allowTouchScrolling ? 'manipulation' : 'none'
      }),
        (t.width = e),
        (t.height = r),
        fabric.util.makeElementUnselectable(t);
    },
    _copyCanvasStyle: function (t, e) {
      e.style.cssText = t.style.cssText;
    },
    getSelectionContext: function () {
      return this.contextTop;
    },
    getSelectionElement: function () {
      return this.upperCanvasEl;
    },
    getActiveObject: function () {
      return this._activeObject;
    },
    getActiveObjects: function () {
      var t = this._activeObject;
      return t
        ? 'activeSelection' === t.type && t._objects
          ? t._objects.slice(0)
          : [t]
        : [];
    },
    _onObjectRemoved: function (t) {
      t === this._activeObject &&
        (this.fire('before:selection:cleared', { target: t }),
        this._discardActiveObject(),
        this.fire('selection:cleared', { target: t }),
        t.fire('deselected')),
        t === this._hoveredTarget &&
          ((this._hoveredTarget = null), (this._hoveredTargets = [])),
        this.callSuper('_onObjectRemoved', t);
    },
    _fireSelectionEvents: function (t, e) {
      var r = !1,
        i = this.getActiveObjects(),
        n = [],
        a = [];
      t.forEach(function (t) {
        -1 === i.indexOf(t) &&
          ((r = !0), t.fire('deselected', { e: e, target: t }), a.push(t));
      }),
        i.forEach(function (i) {
          -1 === t.indexOf(i) &&
            ((r = !0), i.fire('selected', { e: e, target: i }), n.push(i));
        }),
        t.length > 0 && i.length > 0
          ? r &&
            this.fire('selection:updated', { e: e, selected: n, deselected: a })
          : i.length > 0
          ? this.fire('selection:created', { e: e, selected: n })
          : t.length > 0 &&
            this.fire('selection:cleared', { e: e, deselected: a });
    },
    setActiveObject: function (t, e) {
      var r = this.getActiveObjects();
      return this._setActiveObject(t, e), this._fireSelectionEvents(r, e), this;
    },
    _setActiveObject: function (t, e) {
      return this._activeObject === t
        ? !1
        : this._discardActiveObject(e, t)
        ? t.onSelect({ e: e })
          ? !1
          : ((this._activeObject = t), !0)
        : !1;
    },
    _discardActiveObject: function (t, e) {
      var r = this._activeObject;
      if (r) {
        if (r.onDeselect({ e: t, object: e })) return !1;
        this._activeObject = null;
      }
      return !0;
    },
    discardActiveObject: function (t) {
      var e = this.getActiveObjects(),
        r = this.getActiveObject();
      return (
        e.length && this.fire('before:selection:cleared', { target: r, e: t }),
        this._discardActiveObject(t),
        this._fireSelectionEvents(e, t),
        this
      );
    },
    dispose: function () {
      var t = this.wrapperEl;
      return (
        this.removeListeners(),
        t.removeChild(this.upperCanvasEl),
        t.removeChild(this.lowerCanvasEl),
        (this.contextCache = null),
        (this.contextTop = null),
        ['upperCanvasEl', 'cacheCanvasEl'].forEach(
          function (t) {
            fabric.util.cleanUpJsdomNode(this[t]), (this[t] = void 0);
          }.bind(this)
        ),
        t.parentNode &&
          t.parentNode.replaceChild(this.lowerCanvasEl, this.wrapperEl),
        delete this.wrapperEl,
        fabric.StaticCanvas.prototype.dispose.call(this),
        this
      );
    },
    clear: function () {
      return (
        this.discardActiveObject(),
        this.clearContext(this.contextTop),
        this.callSuper('clear')
      );
    },
    drawControls: function (t) {
      var e = this._activeObject;
      e && e._renderControls(t);
    },
    _toObject: function (t, e, r) {
      var i = this._realizeGroupTransformOnObject(t),
        n = this.callSuper('_toObject', t, e, r);
      return this._unwindGroupTransformOnObject(t, i), n;
    },
    _realizeGroupTransformOnObject: function (t) {
      if (
        t.group &&
        'activeSelection' === t.group.type &&
        this._activeObject === t.group
      ) {
        var e = [
            'angle',
            'flipX',
            'flipY',
            'left',
            'scaleX',
            'scaleY',
            'skewX',
            'skewY',
            'top'
          ],
          r = {};
        return (
          e.forEach(function (e) {
            r[e] = t[e];
          }),
          fabric.util.addTransformToObject(
            t,
            this._activeObject.calcOwnMatrix()
          ),
          r
        );
      }
      return null;
    },
    _unwindGroupTransformOnObject: function (t, e) {
      e && t.set(e);
    },
    _setSVGObject: function (t, e, r) {
      var i = this._realizeGroupTransformOnObject(e);
      this.callSuper('_setSVGObject', t, e, r),
        this._unwindGroupTransformOnObject(e, i);
    },
    setViewportTransform: function (t) {
      this.renderOnAddRemove &&
        this._activeObject &&
        this._activeObject.isEditing &&
        this._activeObject.clearContextTop(),
        fabric.StaticCanvas.prototype.setViewportTransform.call(this, t);
    }
  });
  for (var i in fabric.StaticCanvas)
    'prototype' !== i && (fabric.Canvas[i] = fabric.StaticCanvas[i]);
})();
!(function () {
  function t(t, e) {
    return t.button && t.button === e - 1;
  }
  var e = fabric.util.addListener,
    i = fabric.util.removeListener,
    r = 3,
    n = 2,
    a = 1,
    s = { passive: !1 };
  fabric.util.object.extend(fabric.Canvas.prototype, {
    mainTouchId: null,
    _initEventListeners: function () {
      this.removeListeners(), this._bindEvents(), this.addOrRemove(e, 'add');
    },
    _getEventPrefix: function () {
      return this.enablePointerEvents ? 'pointer' : 'mouse';
    },
    addOrRemove: function (t, e) {
      var i = this.upperCanvasEl,
        r = this._getEventPrefix();
      t(fabric.window, 'resize', this._onResize),
        t(i, r + 'down', this._onMouseDown),
        t(i, r + 'move', this._onMouseMove, s),
        t(i, r + 'out', this._onMouseOut),
        t(i, r + 'enter', this._onMouseEnter),
        t(i, 'wheel', this._onMouseWheel),
        t(i, 'contextmenu', this._onContextMenu),
        t(i, 'dblclick', this._onDoubleClick),
        t(i, 'dragover', this._onDragOver),
        t(i, 'dragenter', this._onDragEnter),
        t(i, 'dragleave', this._onDragLeave),
        t(i, 'drop', this._onDrop),
        this.enablePointerEvents || t(i, 'touchstart', this._onTouchStart, s),
        'undefined' != typeof eventjs &&
          e in eventjs &&
          (eventjs[e](i, 'gesture', this._onGesture),
          eventjs[e](i, 'drag', this._onDrag),
          eventjs[e](i, 'orientation', this._onOrientationChange),
          eventjs[e](i, 'shake', this._onShake),
          eventjs[e](i, 'longpress', this._onLongPress));
    },
    removeListeners: function () {
      this.addOrRemove(i, 'remove');
      var t = this._getEventPrefix();
      i(fabric.document, t + 'up', this._onMouseUp),
        i(fabric.document, 'touchend', this._onTouchEnd, s),
        i(fabric.document, t + 'move', this._onMouseMove, s),
        i(fabric.document, 'touchmove', this._onMouseMove, s);
    },
    _bindEvents: function () {
      this.eventsBound ||
        ((this._onMouseDown = this._onMouseDown.bind(this)),
        (this._onTouchStart = this._onTouchStart.bind(this)),
        (this._onMouseMove = this._onMouseMove.bind(this)),
        (this._onMouseUp = this._onMouseUp.bind(this)),
        (this._onTouchEnd = this._onTouchEnd.bind(this)),
        (this._onResize = this._onResize.bind(this)),
        (this._onGesture = this._onGesture.bind(this)),
        (this._onDrag = this._onDrag.bind(this)),
        (this._onShake = this._onShake.bind(this)),
        (this._onLongPress = this._onLongPress.bind(this)),
        (this._onOrientationChange = this._onOrientationChange.bind(this)),
        (this._onMouseWheel = this._onMouseWheel.bind(this)),
        (this._onMouseOut = this._onMouseOut.bind(this)),
        (this._onMouseEnter = this._onMouseEnter.bind(this)),
        (this._onContextMenu = this._onContextMenu.bind(this)),
        (this._onDoubleClick = this._onDoubleClick.bind(this)),
        (this._onDragOver = this._onDragOver.bind(this)),
        (this._onDragEnter = this._simpleEventHandler.bind(this, 'dragenter')),
        (this._onDragLeave = this._simpleEventHandler.bind(this, 'dragleave')),
        (this._onDrop = this._onDrop.bind(this)),
        (this.eventsBound = !0));
    },
    _onGesture: function (t, e) {
      this.__onTransformGesture && this.__onTransformGesture(t, e);
    },
    _onDrag: function (t, e) {
      this.__onDrag && this.__onDrag(t, e);
    },
    _onMouseWheel: function (t) {
      this.__onMouseWheel(t);
    },
    _onMouseOut: function (t) {
      var e = this._hoveredTarget;
      this.fire('mouse:out', { target: e, e: t }),
        (this._hoveredTarget = null),
        e && e.fire('mouseout', { e: t });
      var i = this;
      this._hoveredTargets.forEach(function (r) {
        i.fire('mouse:out', { target: e, e: t }),
          r && e.fire('mouseout', { e: t });
      }),
        (this._hoveredTargets = []),
        this._iTextInstances &&
          this._iTextInstances.forEach(function (t) {
            t.isEditing && t.hiddenTextarea.focus();
          });
    },
    _onMouseEnter: function (t) {
      this._currentTransform ||
        this.findTarget(t) ||
        (this.fire('mouse:over', { target: null, e: t }),
        (this._hoveredTarget = null),
        (this._hoveredTargets = []));
    },
    _onOrientationChange: function (t, e) {
      this.__onOrientationChange && this.__onOrientationChange(t, e);
    },
    _onShake: function (t, e) {
      this.__onShake && this.__onShake(t, e);
    },
    _onLongPress: function (t, e) {
      this.__onLongPress && this.__onLongPress(t, e);
    },
    _onDragOver: function (t) {
      t.preventDefault();
      var e = this._simpleEventHandler('dragover', t);
      this._fireEnterLeaveEvents(e, t);
    },
    _onDrop: function (t) {
      return (
        this._simpleEventHandler('drop:before', t),
        this._simpleEventHandler('drop', t)
      );
    },
    _onContextMenu: function (t) {
      return (
        this.stopContextMenu && (t.stopPropagation(), t.preventDefault()), !1
      );
    },
    _onDoubleClick: function (t) {
      this._cacheTransformEventData(t),
        this._handleEvent(t, 'dblclick'),
        this._resetTransformEventData(t);
    },
    getPointerId: function (t) {
      var e = t.changedTouches;
      return e
        ? e[0] && e[0].identifier
        : this.enablePointerEvents
        ? t.pointerId
        : -1;
    },
    _isMainEvent: function (t) {
      return t.isPrimary === !0
        ? !0
        : t.isPrimary === !1
        ? !1
        : 'touchend' === t.type && 0 === t.touches.length
        ? !0
        : t.changedTouches
        ? t.changedTouches[0].identifier === this.mainTouchId
        : !0;
    },
    _onTouchStart: function (t) {
      t.preventDefault(),
        null === this.mainTouchId && (this.mainTouchId = this.getPointerId(t)),
        this.__onMouseDown(t),
        this._resetTransformEventData();
      var r = this.upperCanvasEl,
        n = this._getEventPrefix();
      e(fabric.document, 'touchend', this._onTouchEnd, s),
        e(fabric.document, 'touchmove', this._onMouseMove, s),
        i(r, n + 'down', this._onMouseDown);
    },
    _onMouseDown: function (t) {
      this.__onMouseDown(t), this._resetTransformEventData();
      var r = this.upperCanvasEl,
        n = this._getEventPrefix();
      i(r, n + 'move', this._onMouseMove, s),
        e(fabric.document, n + 'up', this._onMouseUp),
        e(fabric.document, n + 'move', this._onMouseMove, s);
    },
    _onTouchEnd: function (t) {
      if (!(t.touches.length > 0)) {
        this.__onMouseUp(t),
          this._resetTransformEventData(),
          (this.mainTouchId = null);
        var r = this._getEventPrefix();
        i(fabric.document, 'touchend', this._onTouchEnd, s),
          i(fabric.document, 'touchmove', this._onMouseMove, s);
        var n = this;
        this._willAddMouseDown && clearTimeout(this._willAddMouseDown),
          (this._willAddMouseDown = setTimeout(function () {
            e(n.upperCanvasEl, r + 'down', n._onMouseDown),
              (n._willAddMouseDown = 0);
          }, 400));
      }
    },
    _onMouseUp: function (t) {
      this.__onMouseUp(t), this._resetTransformEventData();
      var r = this.upperCanvasEl,
        n = this._getEventPrefix();
      this._isMainEvent(t) &&
        (i(fabric.document, n + 'up', this._onMouseUp),
        i(fabric.document, n + 'move', this._onMouseMove, s),
        e(r, n + 'move', this._onMouseMove, s));
    },
    _onMouseMove: function (t) {
      !this.allowTouchScrolling && t.preventDefault && t.preventDefault(),
        this.__onMouseMove(t);
    },
    _onResize: function () {
      this.calcOffset();
    },
    _shouldRender: function (t) {
      var e = this._activeObject;
      return !!e != !!t || (e && t && e !== t)
        ? !0
        : e && e.isEditing
        ? !1
        : !1;
    },
    __onMouseUp: function (e) {
      var i,
        s = this._currentTransform,
        o = this._groupSelector,
        c = !1,
        l = !o || (0 === o.left && 0 === o.top);
      if (
        (this._cacheTransformEventData(e),
        (i = this._target),
        this._handleEvent(e, 'up:before'),
        t(e, r))
      )
        return void (this.fireRightClick && this._handleEvent(e, 'up', r, l));
      if (t(e, n))
        return (
          this.fireMiddleClick && this._handleEvent(e, 'up', n, l),
          void this._resetTransformEventData()
        );
      if (this.isDrawingMode && this._isCurrentlyDrawing)
        return void this._onMouseUpInDrawingMode(e);
      if (this._isMainEvent(e)) {
        if (
          (s && (this._finalizeCurrentTransform(e), (c = s.actionPerformed)),
          !l)
        ) {
          var u = i === this._activeObject;
          this._maybeGroupObjects(e),
            c ||
              (c = this._shouldRender(i) || (!u && i === this._activeObject));
        }
        var h, f;
        if (i) {
          if (
            ((h = i._findTargetCorner(
              this.getPointer(e, !0),
              fabric.util.isTouchEvent(e)
            )),
            i.selectable && i !== this._activeObject && 'up' === i.activeOn)
          )
            this.setActiveObject(i, e), (c = !0);
          else {
            var d = i.controls[h],
              g = d && d.getMouseUpHandler(e, i, d);
            g && ((f = this.getPointer(e)), g(e, s, f.x, f.y));
          }
          i.isMoving = !1;
        }
        if (s && (s.target !== i || s.corner !== h)) {
          var p = s.target && s.target.controls[s.corner],
            v = p && p.getMouseUpHandler(e, i, d);
          (f = f || this.getPointer(e)), v && v(e, s, f.x, f.y);
        }
        this._setCursorFromEvent(e, i),
          this._handleEvent(e, 'up', a, l),
          (this._groupSelector = null),
          (this._currentTransform = null),
          i && (i.__corner = 0),
          c ? this.requestRenderAll() : l || this.renderTop();
      }
    },
    _simpleEventHandler: function (t, e) {
      var i = this.findTarget(e),
        r = this.targets,
        n = { e: e, target: i, subTargets: r };
      if ((this.fire(t, n), i && i.fire(t, n), !r)) return i;
      for (var a = 0; a < r.length; a++) r[a].fire(t, n);
      return i;
    },
    _handleEvent: function (t, e, i, r) {
      var n = this._target,
        s = this.targets || [],
        o = {
          e: t,
          target: n,
          subTargets: s,
          button: i || a,
          isClick: r || !1,
          pointer: this._pointer,
          absolutePointer: this._absolutePointer,
          transform: this._currentTransform
        };
      'up' === e &&
        ((o.currentTarget = this.findTarget(t)),
        (o.currentSubTargets = this.targets)),
        this.fire('mouse:' + e, o),
        n && n.fire('mouse' + e, o);
      for (var c = 0; c < s.length; c++) s[c].fire('mouse' + e, o);
    },
    _finalizeCurrentTransform: function (t) {
      var e = this._currentTransform,
        i = e.target,
        r = { e: t, target: i, transform: e, action: e.action };
      i._scaling && (i._scaling = !1),
        i.setCoords(),
        (e.actionPerformed || (this.stateful && i.hasStateChanged())) &&
          this._fire('modified', r);
    },
    _onMouseDownInDrawingMode: function (t) {
      (this._isCurrentlyDrawing = !0),
        this.getActiveObject() &&
          this.discardActiveObject(t).requestRenderAll();
      var e = this.getPointer(t);
      this.freeDrawingBrush.onMouseDown(e, { e: t, pointer: e }),
        this._handleEvent(t, 'down');
    },
    _onMouseMoveInDrawingMode: function (t) {
      if (this._isCurrentlyDrawing) {
        var e = this.getPointer(t);
        this.freeDrawingBrush.onMouseMove(e, { e: t, pointer: e });
      }
      this.setCursor(this.freeDrawingCursor), this._handleEvent(t, 'move');
    },
    _onMouseUpInDrawingMode: function (t) {
      var e = this.getPointer(t);
      (this._isCurrentlyDrawing = this.freeDrawingBrush.onMouseUp({
        e: t,
        pointer: e
      })),
        this._handleEvent(t, 'up');
    },
    __onMouseDown: function (e) {
      this._cacheTransformEventData(e), this._handleEvent(e, 'down:before');
      var i = this._target;
      if (t(e, r))
        return void (this.fireRightClick && this._handleEvent(e, 'down', r));
      if (t(e, n))
        return void (this.fireMiddleClick && this._handleEvent(e, 'down', n));
      if (this.isDrawingMode) return void this._onMouseDownInDrawingMode(e);
      if (this._isMainEvent(e) && !this._currentTransform) {
        var a = this._pointer;
        this._previousPointer = a;
        var s = this._shouldRender(i),
          o = this._shouldGroup(e, i);
        if (
          (this._shouldClearSelection(e, i)
            ? this.discardActiveObject(e)
            : o && (this._handleGrouping(e, i), (i = this._activeObject)),
          !this.selection ||
            (i && (i.selectable || i.isEditing || i === this._activeObject)) ||
            (this._groupSelector = {
              ex: this._absolutePointer.x,
              ey: this._absolutePointer.y,
              top: 0,
              left: 0
            }),
          i)
        ) {
          var c = i === this._activeObject;
          i.selectable && 'down' === i.activeOn && this.setActiveObject(i, e);
          var l = i._findTargetCorner(
            this.getPointer(e, !0),
            fabric.util.isTouchEvent(e)
          );
          if (((i.__corner = l), i === this._activeObject && (l || !o))) {
            this._setupCurrentTransform(e, i, c);
            var u = i.controls[l],
              a = this.getPointer(e),
              h = u && u.getMouseDownHandler(e, i, u);
            h && h(e, this._currentTransform, a.x, a.y);
          }
        }
        this._handleEvent(e, 'down'), (s || o) && this.requestRenderAll();
      }
    },
    _resetTransformEventData: function () {
      (this._target = null),
        (this._pointer = null),
        (this._absolutePointer = null);
    },
    _cacheTransformEventData: function (t) {
      this._resetTransformEventData(),
        (this._pointer = this.getPointer(t, !0)),
        (this._absolutePointer = this.restorePointerVpt(this._pointer)),
        (this._target = this._currentTransform
          ? this._currentTransform.target
          : this.findTarget(t) || null);
    },
    _beforeTransform: function (t) {
      var e = this._currentTransform;
      this.stateful && e.target.saveState(),
        this.fire('before:transform', { e: t, transform: e });
    },
    __onMouseMove: function (t) {
      this._handleEvent(t, 'move:before'), this._cacheTransformEventData(t);
      var e, i;
      if (this.isDrawingMode) return void this._onMouseMoveInDrawingMode(t);
      if (this._isMainEvent(t)) {
        var r = this._groupSelector;
        r
          ? ((i = this._absolutePointer),
            (r.left = i.x - r.ex),
            (r.top = i.y - r.ey),
            this.renderTop())
          : this._currentTransform
          ? this._transformObject(t)
          : ((e = this.findTarget(t) || null),
            this._setCursorFromEvent(t, e),
            this._fireOverOutEvents(e, t)),
          this._handleEvent(t, 'move'),
          this._resetTransformEventData();
      }
    },
    _fireOverOutEvents: function (t, e) {
      var i = this._hoveredTarget,
        r = this._hoveredTargets,
        n = this.targets,
        a = Math.max(r.length, n.length);
      this.fireSyntheticInOutEvents(t, e, {
        oldTarget: i,
        evtOut: 'mouseout',
        canvasEvtOut: 'mouse:out',
        evtIn: 'mouseover',
        canvasEvtIn: 'mouse:over'
      });
      for (var s = 0; a > s; s++)
        this.fireSyntheticInOutEvents(n[s], e, {
          oldTarget: r[s],
          evtOut: 'mouseout',
          evtIn: 'mouseover'
        });
      (this._hoveredTarget = t), (this._hoveredTargets = this.targets.concat());
    },
    _fireEnterLeaveEvents: function (t, e) {
      var i = this._draggedoverTarget,
        r = this._hoveredTargets,
        n = this.targets,
        a = Math.max(r.length, n.length);
      this.fireSyntheticInOutEvents(t, e, {
        oldTarget: i,
        evtOut: 'dragleave',
        evtIn: 'dragenter'
      });
      for (var s = 0; a > s; s++)
        this.fireSyntheticInOutEvents(n[s], e, {
          oldTarget: r[s],
          evtOut: 'dragleave',
          evtIn: 'dragenter'
        });
      this._draggedoverTarget = t;
    },
    fireSyntheticInOutEvents: function (t, e, i) {
      var r,
        n,
        a,
        s,
        o = i.oldTarget,
        c = o !== t,
        l = i.canvasEvtIn,
        u = i.canvasEvtOut;
      c &&
        ((r = { e: e, target: t, previousTarget: o }),
        (n = { e: e, target: o, nextTarget: t })),
        (s = t && c),
        (a = o && c),
        a && (u && this.fire(u, n), o.fire(i.evtOut, n)),
        s && (l && this.fire(l, r), t.fire(i.evtIn, r));
    },
    __onMouseWheel: function (t) {
      this._cacheTransformEventData(t),
        this._handleEvent(t, 'wheel'),
        this._resetTransformEventData();
    },
    _transformObject: function (t) {
      var e = this.getPointer(t),
        i = this._currentTransform;
      (i.reset = !1),
        (i.shiftKey = t.shiftKey),
        (i.altKey = t[this.centeredKey]),
        this._performTransformAction(t, i, e),
        i.actionPerformed && this.requestRenderAll();
    },
    _performTransformAction: function (t, e, i) {
      var r = i.x,
        n = i.y,
        a = e.action,
        s = !1,
        o = e.actionHandler;
      o && (s = o(t, e, r, n)),
        'drag' === a &&
          s &&
          ((e.target.isMoving = !0),
          this.setCursor(e.target.moveCursor || this.moveCursor)),
        (e.actionPerformed = e.actionPerformed || s);
    },
    _fire: fabric.controlsUtils.fireEvent,
    _setCursorFromEvent: function (t, e) {
      if (!e) return this.setCursor(this.defaultCursor), !1;
      var i = e.hoverCursor || this.hoverCursor,
        r =
          this._activeObject && 'activeSelection' === this._activeObject.type
            ? this._activeObject
            : null,
        n =
          (!r || !r.contains(e)) && e._findTargetCorner(this.getPointer(t, !0));
      n
        ? this.setCursor(this.getCornerCursor(n, e, t))
        : (e.subTargetCheck &&
            this.targets
              .concat()
              .reverse()
              .map(function (t) {
                i = t.hoverCursor || i;
              }),
          this.setCursor(i));
    },
    getCornerCursor: function (t, e, i) {
      var r = e.controls[t];
      return r.cursorStyleHandler(i, r, e);
    }
  });
})();
!(function () {
  var t = Math.min,
    e = Math.max;
  fabric.util.object.extend(fabric.Canvas.prototype, {
    _shouldGroup: function (t, e) {
      var i = this._activeObject;
      return (
        i &&
        this._isSelectionKeyPressed(t) &&
        e &&
        e.selectable &&
        this.selection &&
        (i !== e || 'activeSelection' === i.type) &&
        !e.onSelect({ e: t })
      );
    },
    _handleGrouping: function (t, e) {
      var i = this._activeObject;
      i.__corner ||
        ((e !== i || ((e = this.findTarget(t, !0)), e && e.selectable)) &&
          (i && 'activeSelection' === i.type
            ? this._updateActiveSelection(e, t)
            : this._createActiveSelection(e, t)));
    },
    _updateActiveSelection: function (t, e) {
      var i = this._activeObject,
        r = i._objects.slice(0);
      i.contains(t)
        ? (i.removeWithUpdate(t),
          (this._hoveredTarget = t),
          (this._hoveredTargets = this.targets.concat()),
          1 === i.size() && this._setActiveObject(i.item(0), e))
        : (i.addWithUpdate(t),
          (this._hoveredTarget = i),
          (this._hoveredTargets = this.targets.concat())),
        this._fireSelectionEvents(r, e);
    },
    _createActiveSelection: function (t, e) {
      var i = this.getActiveObjects(),
        r = this._createGroup(t);
      (this._hoveredTarget = r),
        this._setActiveObject(r, e),
        this._fireSelectionEvents(i, e);
    },
    _createGroup: function (t) {
      var e = this._objects,
        i = e.indexOf(this._activeObject) < e.indexOf(t),
        r = i ? [this._activeObject, t] : [t, this._activeObject];
      return (
        this._activeObject.isEditing && this._activeObject.exitEditing(),
        new fabric.ActiveSelection(r, { canvas: this })
      );
    },
    _groupSelectedObjects: function (t) {
      var e,
        i = this._collectObjects(t);
      1 === i.length
        ? this.setActiveObject(i[0], t)
        : i.length > 1 &&
          ((e = new fabric.ActiveSelection(i.reverse(), { canvas: this })),
          this.setActiveObject(e, t));
    },
    _collectObjects: function (i) {
      for (
        var r,
          n = [],
          s = this._groupSelector.ex,
          a = this._groupSelector.ey,
          o = s + this._groupSelector.left,
          c = a + this._groupSelector.top,
          l = new fabric.Point(t(s, o), t(a, c)),
          h = new fabric.Point(e(s, o), e(a, c)),
          u = !this.selectionFullyContained,
          f = s === o && a === c,
          d = this._objects.length;
        d-- &&
        ((r = this._objects[d]),
        !(
          r &&
          r.selectable &&
          r.visible &&
          ((u && r.intersectsWithRect(l, h, !0)) ||
            r.isContainedWithinRect(l, h, !0) ||
            (u && r.containsPoint(l, null, !0)) ||
            (u && r.containsPoint(h, null, !0))) &&
          (n.push(r), f)
        ));

      );
      return (
        n.length > 1 &&
          (n = n.filter(function (t) {
            return !t.onSelect({ e: i });
          })),
        n
      );
    },
    _maybeGroupObjects: function (t) {
      this.selection && this._groupSelector && this._groupSelectedObjects(t),
        this.setCursor(this.defaultCursor),
        (this._groupSelector = null);
    }
  });
})();
!(function () {
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    toDataURL: function (t) {
      t || (t = {});
      var e = t.format || 'png',
        i = t.quality || 1,
        r =
          (t.multiplier || 1) *
          (t.enableRetinaScaling ? this.getRetinaScaling() : 1),
        n = this.toCanvasElement(r, t);
      return fabric.util.toDataURL(n, e, i);
    },
    toCanvasElement: function (t, e) {
      (t = t || 1), (e = e || {});
      var i = (e.width || this.width) * t,
        r = (e.height || this.height) * t,
        n = this.getZoom(),
        s = this.width,
        a = this.height,
        o = n * t,
        c = this.viewportTransform,
        l = (c[4] - (e.left || 0)) * t,
        h = (c[5] - (e.top || 0)) * t,
        u = this.interactive,
        f = [o, 0, 0, o, l, h],
        d = this.enableRetinaScaling,
        g = fabric.util.createCanvasElement(),
        p = this.contextTop;
      return (
        (g.width = i),
        (g.height = r),
        (this.contextTop = null),
        (this.enableRetinaScaling = !1),
        (this.interactive = !1),
        (this.viewportTransform = f),
        (this.width = i),
        (this.height = r),
        this.calcViewportBoundaries(),
        this.renderCanvas(g.getContext('2d'), this._objects),
        (this.viewportTransform = c),
        (this.width = s),
        (this.height = a),
        this.calcViewportBoundaries(),
        (this.interactive = u),
        (this.enableRetinaScaling = d),
        (this.contextTop = p),
        g
      );
    }
  });
})();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
  loadFromJSON: function (t, e, i) {
    if (t) {
      var r =
          'string' == typeof t ? JSON.parse(t) : fabric.util.object.clone(t),
        n = this,
        a = r.clipPath,
        s = this.renderOnAddRemove;
      return (
        (this.renderOnAddRemove = !1),
        delete r.clipPath,
        this._enlivenObjects(
          r.objects,
          function (t) {
            n.clear(),
              n._setBgOverlay(r, function () {
                a
                  ? n._enlivenObjects([a], function (i) {
                      (n.clipPath = i[0]), n.__setupCanvas.call(n, r, t, s, e);
                    })
                  : n.__setupCanvas.call(n, r, t, s, e);
              });
          },
          i
        ),
        this
      );
    }
  },
  __setupCanvas: function (t, e, i, r) {
    var n = this;
    e.forEach(function (t, e) {
      n.insertAt(t, e);
    }),
      (this.renderOnAddRemove = i),
      delete t.objects,
      delete t.backgroundImage,
      delete t.overlayImage,
      delete t.background,
      delete t.overlay,
      this._setOptions(t),
      this.renderAll(),
      r && r();
  },
  _setBgOverlay: function (t, e) {
    var i = {
      backgroundColor: !1,
      overlayColor: !1,
      backgroundImage: !1,
      overlayImage: !1
    };
    if (!(t.backgroundImage || t.overlayImage || t.background || t.overlay))
      return void (e && e());
    var r = function () {
      i.backgroundImage &&
        i.overlayImage &&
        i.backgroundColor &&
        i.overlayColor &&
        e &&
        e();
    };
    this.__setBgOverlay('backgroundImage', t.backgroundImage, i, r),
      this.__setBgOverlay('overlayImage', t.overlayImage, i, r),
      this.__setBgOverlay('backgroundColor', t.background, i, r),
      this.__setBgOverlay('overlayColor', t.overlay, i, r);
  },
  __setBgOverlay: function (t, e, i, r) {
    var n = this;
    return e
      ? void ('backgroundImage' === t || 'overlayImage' === t
          ? fabric.util.enlivenObjects([e], function (e) {
              (n[t] = e[0]), (i[t] = !0), r && r();
            })
          : this['set' + fabric.util.string.capitalize(t, !0)](e, function () {
              (i[t] = !0), r && r();
            }))
      : ((i[t] = !0), void (r && r()));
  },
  _enlivenObjects: function (t, e, i) {
    return t && 0 !== t.length
      ? void fabric.util.enlivenObjects(
          t,
          function (t) {
            e && e(t);
          },
          null,
          i
        )
      : void (e && e([]));
  },
  _toDataURL: function (t, e) {
    this.clone(function (i) {
      e(i.toDataURL(t));
    });
  },
  _toDataURLWithMultiplier: function (t, e, i) {
    this.clone(function (r) {
      i(r.toDataURLWithMultiplier(t, e));
    });
  },
  clone: function (t, e) {
    var i = JSON.stringify(this.toJSON(e));
    this.cloneWithoutData(function (e) {
      e.loadFromJSON(i, function () {
        t && t(e);
      });
    });
  },
  cloneWithoutData: function (t) {
    var e = fabric.util.createCanvasElement();
    (e.width = this.width), (e.height = this.height);
    var i = new fabric.Canvas(e);
    this.backgroundImage
      ? (i.setBackgroundImage(this.backgroundImage.src, function () {
          i.renderAll(), t && t(i);
        }),
        (i.backgroundImageOpacity = this.backgroundImageOpacity),
        (i.backgroundImageStretch = this.backgroundImageStretch))
      : t && t(i);
  }
});
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.object.extend,
    r = e.util.object.clone,
    n = e.util.toFixed,
    s = e.util.string.capitalize,
    a = e.util.degreesToRadians,
    o = !e.isLikelyNode,
    c = 2;
  e.Object ||
    ((e.Object = e.util.createClass(e.CommonMethods, {
      type: 'object',
      originX: 'left',
      originY: 'top',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      scaleX: 1,
      scaleY: 1,
      flipX: !1,
      flipY: !1,
      opacity: 1,
      angle: 0,
      skewX: 0,
      skewY: 0,
      cornerSize: 13,
      touchCornerSize: 24,
      transparentCorners: !0,
      hoverCursor: null,
      moveCursor: null,
      padding: 0,
      borderColor: 'rgb(178,204,255)',
      borderDashArray: null,
      cornerColor: 'rgb(178,204,255)',
      cornerStrokeColor: null,
      cornerStyle: 'rect',
      cornerDashArray: null,
      centeredScaling: !1,
      centeredRotation: !0,
      fill: 'rgb(0,0,0)',
      fillRule: 'nonzero',
      globalCompositeOperation: 'source-over',
      backgroundColor: '',
      selectionBackgroundColor: '',
      stroke: null,
      strokeWidth: 1,
      strokeDashArray: null,
      strokeDashOffset: 0,
      strokeLineCap: 'butt',
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      shadow: null,
      borderOpacityWhenMoving: 0.4,
      borderScaleFactor: 1,
      minScaleLimit: 0,
      selectable: !0,
      evented: !0,
      visible: !0,
      hasControls: !0,
      hasBorders: !0,
      perPixelTargetFind: !1,
      includeDefaultValues: !0,
      lockMovementX: !1,
      lockMovementY: !1,
      lockRotation: !1,
      lockScalingX: !1,
      lockScalingY: !1,
      lockSkewingX: !1,
      lockSkewingY: !1,
      lockScalingFlip: !1,
      excludeFromExport: !1,
      objectCaching: o,
      statefullCache: !1,
      noScaleCache: !0,
      strokeUniform: !1,
      dirty: !0,
      __corner: 0,
      paintFirst: 'fill',
      activeOn: 'down',
      stateProperties:
        'top left width height scaleX scaleY flipX flipY originX originY transformMatrix stroke strokeWidth strokeDashArray strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit angle opacity fill globalCompositeOperation shadow visible backgroundColor skewX skewY fillRule paintFirst clipPath strokeUniform'.split(
          ' '
        ),
      cacheProperties:
        'fill stroke strokeWidth strokeDashArray width height paintFirst strokeUniform strokeLineCap strokeDashOffset strokeLineJoin strokeMiterLimit backgroundColor clipPath'.split(
          ' '
        ),
      colorProperties: 'fill stroke backgroundColor'.split(' '),
      clipPath: void 0,
      inverted: !1,
      absolutePositioned: !1,
      initialize: function (t) {
        t && this.setOptions(t);
      },
      _createCacheCanvas: function () {
        (this._cacheProperties = {}),
          (this._cacheCanvas = e.util.createCanvasElement()),
          (this._cacheContext = this._cacheCanvas.getContext('2d')),
          this._updateCacheCanvas(),
          (this.dirty = !0);
      },
      _limitCacheSize: function (t) {
        var i = e.perfLimitSizeTotal,
          r = t.width,
          n = t.height,
          s = e.maxCacheSideLimit,
          a = e.minCacheSideLimit;
        if (s >= r && s >= n && i >= r * n)
          return a > r && (t.width = a), a > n && (t.height = a), t;
        var o = r / n,
          c = e.util.limitDimsByArea(o, i),
          h = e.util.capValue,
          l = h(a, c.x, s),
          u = h(a, c.y, s);
        return (
          r > l && ((t.zoomX /= r / l), (t.width = l), (t.capped = !0)),
          n > u && ((t.zoomY /= n / u), (t.height = u), (t.capped = !0)),
          t
        );
      },
      _getCacheCanvasDimensions: function () {
        var t = this.getTotalObjectScaling(),
          e = this._getTransformedDimensions(0, 0),
          i = (e.x * t.scaleX) / this.scaleX,
          r = (e.y * t.scaleY) / this.scaleY;
        return {
          width: i + c,
          height: r + c,
          zoomX: t.scaleX,
          zoomY: t.scaleY,
          x: i,
          y: r
        };
      },
      _updateCacheCanvas: function () {
        var t = this.canvas;
        if (this.noScaleCache && t && t._currentTransform) {
          var i = t._currentTransform.target,
            r = t._currentTransform.action;
          if (this === i && r.slice && 'scale' === r.slice(0, 5)) return !1;
        }
        var n,
          s,
          a = this._cacheCanvas,
          o = this._limitCacheSize(this._getCacheCanvasDimensions()),
          c = e.minCacheSideLimit,
          h = o.width,
          l = o.height,
          u = o.zoomX,
          f = o.zoomY,
          d = h !== this.cacheWidth || l !== this.cacheHeight,
          g = this.zoomX !== u || this.zoomY !== f,
          p = d || g,
          v = 0,
          b = 0,
          m = !1;
        if (d) {
          var y = this._cacheCanvas.width,
            _ = this._cacheCanvas.height,
            w = h > y || l > _,
            C = (0.9 * y > h || 0.9 * _ > l) && y > c && _ > c;
          (m = w || C),
            w &&
              !o.capped &&
              (h > c || l > c) &&
              ((v = 0.1 * h), (b = 0.1 * l));
        }
        return (
          this instanceof e.Text &&
            this.path &&
            ((p = !0),
            (m = !0),
            (v += this.getHeightOfLine(0) * this.zoomX),
            (b += this.getHeightOfLine(0) * this.zoomY)),
          p
            ? (m
                ? ((a.width = Math.ceil(h + v)), (a.height = Math.ceil(l + b)))
                : (this._cacheContext.setTransform(1, 0, 0, 1, 0, 0),
                  this._cacheContext.clearRect(0, 0, a.width, a.height)),
              (n = o.x / 2),
              (s = o.y / 2),
              (this.cacheTranslationX = Math.round(a.width / 2 - n) + n),
              (this.cacheTranslationY = Math.round(a.height / 2 - s) + s),
              (this.cacheWidth = h),
              (this.cacheHeight = l),
              this._cacheContext.translate(
                this.cacheTranslationX,
                this.cacheTranslationY
              ),
              this._cacheContext.scale(u, f),
              (this.zoomX = u),
              (this.zoomY = f),
              !0)
            : !1
        );
      },
      setOptions: function (t) {
        this._setOptions(t),
          this._initGradient(t.fill, 'fill'),
          this._initGradient(t.stroke, 'stroke'),
          this._initPattern(t.fill, 'fill'),
          this._initPattern(t.stroke, 'stroke');
      },
      transform: function (t) {
        var e =
            (this.group && !this.group._transformDone) ||
            (this.group && this.canvas && t === this.canvas.contextTop),
          i = this.calcTransformMatrix(!e);
        t.transform(i[0], i[1], i[2], i[3], i[4], i[5]);
      },
      toObject: function (t) {
        var i = e.Object.NUM_FRACTION_DIGITS,
          r = {
            type: this.type,
            version: e.version,
            originX: this.originX,
            originY: this.originY,
            left: n(this.left, i),
            top: n(this.top, i),
            width: n(this.width, i),
            height: n(this.height, i),
            fill:
              this.fill && this.fill.toObject
                ? this.fill.toObject()
                : this.fill,
            stroke:
              this.stroke && this.stroke.toObject
                ? this.stroke.toObject()
                : this.stroke,
            strokeWidth: n(this.strokeWidth, i),
            strokeDashArray: this.strokeDashArray
              ? this.strokeDashArray.concat()
              : this.strokeDashArray,
            strokeLineCap: this.strokeLineCap,
            strokeDashOffset: this.strokeDashOffset,
            strokeLineJoin: this.strokeLineJoin,
            strokeUniform: this.strokeUniform,
            strokeMiterLimit: n(this.strokeMiterLimit, i),
            scaleX: n(this.scaleX, i),
            scaleY: n(this.scaleY, i),
            angle: n(this.angle, i),
            flipX: this.flipX,
            flipY: this.flipY,
            opacity: n(this.opacity, i),
            shadow:
              this.shadow && this.shadow.toObject
                ? this.shadow.toObject()
                : this.shadow,
            visible: this.visible,
            backgroundColor: this.backgroundColor,
            fillRule: this.fillRule,
            paintFirst: this.paintFirst,
            globalCompositeOperation: this.globalCompositeOperation,
            skewX: n(this.skewX, i),
            skewY: n(this.skewY, i)
          };
        return (
          this.clipPath &&
            !this.clipPath.excludeFromExport &&
            ((r.clipPath = this.clipPath.toObject(t)),
            (r.clipPath.inverted = this.clipPath.inverted),
            (r.clipPath.absolutePositioned = this.clipPath.absolutePositioned)),
          e.util.populateWithProperties(this, r, t),
          this.includeDefaultValues || (r = this._removeDefaultValues(r)),
          r
        );
      },
      toDatalessObject: function (t) {
        return this.toObject(t);
      },
      _removeDefaultValues: function (t) {
        var i = e.util.getKlass(t.type).prototype,
          r = i.stateProperties;
        return (
          r.forEach(function (e) {
            'left' !== e &&
              'top' !== e &&
              (t[e] === i[e] && delete t[e],
              Array.isArray(t[e]) &&
                Array.isArray(i[e]) &&
                0 === t[e].length &&
                0 === i[e].length &&
                delete t[e]);
          }),
          t
        );
      },
      toString: function () {
        return '#<fabric.' + s(this.type) + '>';
      },
      getObjectScaling: function () {
        if (!this.group) return { scaleX: this.scaleX, scaleY: this.scaleY };
        var t = e.util.qrDecompose(this.calcTransformMatrix());
        return { scaleX: Math.abs(t.scaleX), scaleY: Math.abs(t.scaleY) };
      },
      getTotalObjectScaling: function () {
        var t = this.getObjectScaling(),
          e = t.scaleX,
          i = t.scaleY;
        if (this.canvas) {
          var r = this.canvas.getZoom(),
            n = this.canvas.getRetinaScaling();
          (e *= r * n), (i *= r * n);
        }
        return { scaleX: e, scaleY: i };
      },
      getObjectOpacity: function () {
        var t = this.opacity;
        return this.group && (t *= this.group.getObjectOpacity()), t;
      },
      _set: function (t, i) {
        var r = 'scaleX' === t || 'scaleY' === t,
          n = this[t] !== i,
          s = !1;
        return (
          r && (i = this._constrainScale(i)),
          'scaleX' === t && 0 > i
            ? ((this.flipX = !this.flipX), (i *= -1))
            : 'scaleY' === t && 0 > i
            ? ((this.flipY = !this.flipY), (i *= -1))
            : 'shadow' !== t || !i || i instanceof e.Shadow
            ? 'dirty' === t && this.group && this.group.set('dirty', i)
            : (i = new e.Shadow(i)),
          (this[t] = i),
          n &&
            ((s = this.group && this.group.isOnACache()),
            this.cacheProperties.indexOf(t) > -1
              ? ((this.dirty = !0), s && this.group.set('dirty', !0))
              : s &&
                this.stateProperties.indexOf(t) > -1 &&
                this.group.set('dirty', !0)),
          this
        );
      },
      setOnGroup: function () {},
      getViewportTransform: function () {
        return this.canvas && this.canvas.viewportTransform
          ? this.canvas.viewportTransform
          : e.iMatrix.concat();
      },
      isNotVisible: function () {
        return (
          0 === this.opacity ||
          (!this.width && !this.height && 0 === this.strokeWidth) ||
          !this.visible
        );
      },
      render: function (t) {
        this.isNotVisible() ||
          ((!this.canvas ||
            !this.canvas.skipOffscreen ||
            this.group ||
            this.isOnScreen()) &&
            (t.save(),
            this._setupCompositeOperation(t),
            this.drawSelectionBackground(t),
            this.transform(t),
            this._setOpacity(t),
            this._setShadow(t, this),
            this.shouldCache()
              ? (this.renderCache(), this.drawCacheOnCanvas(t))
              : (this._removeCacheCanvas(),
                (this.dirty = !1),
                this.drawObject(t),
                this.objectCaching &&
                  this.statefullCache &&
                  this.saveState({ propertySet: 'cacheProperties' })),
            t.restore()));
      },
      renderCache: function (t) {
        (t = t || {}),
          (this._cacheCanvas && this._cacheContext) ||
            this._createCacheCanvas(),
          this.isCacheDirty() &&
            (this.statefullCache &&
              this.saveState({ propertySet: 'cacheProperties' }),
            this.drawObject(this._cacheContext, t.forClipping),
            (this.dirty = !1));
      },
      _removeCacheCanvas: function () {
        (this._cacheCanvas = null),
          (this._cacheContext = null),
          (this.cacheWidth = 0),
          (this.cacheHeight = 0);
      },
      hasStroke: function () {
        return (
          this.stroke && 'transparent' !== this.stroke && 0 !== this.strokeWidth
        );
      },
      hasFill: function () {
        return this.fill && 'transparent' !== this.fill;
      },
      needsItsOwnCache: function () {
        return 'stroke' === this.paintFirst &&
          this.hasFill() &&
          this.hasStroke() &&
          'object' == typeof this.shadow
          ? !0
          : this.clipPath
          ? !0
          : !1;
      },
      shouldCache: function () {
        return (
          (this.ownCaching =
            this.needsItsOwnCache() ||
            (this.objectCaching && (!this.group || !this.group.isOnACache()))),
          this.ownCaching
        );
      },
      willDrawShadow: function () {
        return (
          !!this.shadow &&
          (0 !== this.shadow.offsetX || 0 !== this.shadow.offsetY)
        );
      },
      drawClipPathOnCache: function (t, i) {
        if (
          (t.save(),
          (t.globalCompositeOperation = i.inverted
            ? 'destination-out'
            : 'destination-in'),
          i.absolutePositioned)
        ) {
          var r = e.util.invertTransform(this.calcTransformMatrix());
          t.transform(r[0], r[1], r[2], r[3], r[4], r[5]);
        }
        i.transform(t),
          t.scale(1 / i.zoomX, 1 / i.zoomY),
          t.drawImage(
            i._cacheCanvas,
            -i.cacheTranslationX,
            -i.cacheTranslationY
          ),
          t.restore();
      },
      drawObject: function (t, e) {
        var i = this.fill,
          r = this.stroke;
        e
          ? ((this.fill = 'black'),
            (this.stroke = ''),
            this._setClippingProperties(t))
          : this._renderBackground(t),
          this._render(t),
          this._drawClipPath(t, this.clipPath),
          (this.fill = i),
          (this.stroke = r);
      },
      _drawClipPath: function (t, e) {
        e &&
          ((e.canvas = this.canvas),
          e.shouldCache(),
          (e._transformDone = !0),
          e.renderCache({ forClipping: !0 }),
          this.drawClipPathOnCache(t, e));
      },
      drawCacheOnCanvas: function (t) {
        t.scale(1 / this.zoomX, 1 / this.zoomY),
          t.drawImage(
            this._cacheCanvas,
            -this.cacheTranslationX,
            -this.cacheTranslationY
          );
      },
      isCacheDirty: function (t) {
        if (this.isNotVisible()) return !1;
        if (
          this._cacheCanvas &&
          this._cacheContext &&
          !t &&
          this._updateCacheCanvas()
        )
          return !0;
        if (
          this.dirty ||
          (this.clipPath && this.clipPath.absolutePositioned) ||
          (this.statefullCache && this.hasStateChanged('cacheProperties'))
        ) {
          if (this._cacheCanvas && this._cacheContext && !t) {
            var e = this.cacheWidth / this.zoomX,
              i = this.cacheHeight / this.zoomY;
            this._cacheContext.clearRect(-e / 2, -i / 2, e, i);
          }
          return !0;
        }
        return !1;
      },
      _renderBackground: function (t) {
        if (this.backgroundColor) {
          var e = this._getNonTransformedDimensions();
          (t.fillStyle = this.backgroundColor),
            t.fillRect(-e.x / 2, -e.y / 2, e.x, e.y),
            this._removeShadow(t);
        }
      },
      _setOpacity: function (t) {
        this.group && !this.group._transformDone
          ? (t.globalAlpha = this.getObjectOpacity())
          : (t.globalAlpha *= this.opacity);
      },
      _setStrokeStyles: function (t, e) {
        var i = e.stroke;
        i &&
          ((t.lineWidth = e.strokeWidth),
          (t.lineCap = e.strokeLineCap),
          (t.lineDashOffset = e.strokeDashOffset),
          (t.lineJoin = e.strokeLineJoin),
          (t.miterLimit = e.strokeMiterLimit),
          i.toLive
            ? 'percentage' === i.gradientUnits ||
              i.gradientTransform ||
              i.patternTransform
              ? this._applyPatternForTransformedGradient(t, i)
              : ((t.strokeStyle = i.toLive(t, this)),
                this._applyPatternGradientTransform(t, i))
            : (t.strokeStyle = e.stroke));
      },
      _setFillStyles: function (t, e) {
        var i = e.fill;
        i &&
          (i.toLive
            ? ((t.fillStyle = i.toLive(t, this)),
              this._applyPatternGradientTransform(t, e.fill))
            : (t.fillStyle = i));
      },
      _setClippingProperties: function (t) {
        (t.globalAlpha = 1),
          (t.strokeStyle = 'transparent'),
          (t.fillStyle = '#000000');
      },
      _setLineDash: function (t, e) {
        e &&
          0 !== e.length &&
          (1 & e.length && e.push.apply(e, e), t.setLineDash(e));
      },
      _renderControls: function (t, i) {
        var r,
          n,
          s,
          o = this.getViewportTransform(),
          c = this.calcTransformMatrix();
        (i = i || {}),
          (n =
            'undefined' != typeof i.hasBorders
              ? i.hasBorders
              : this.hasBorders),
          (s =
            'undefined' != typeof i.hasControls
              ? i.hasControls
              : this.hasControls),
          (c = e.util.multiplyTransformMatrices(o, c)),
          (r = e.util.qrDecompose(c)),
          t.save(),
          t.translate(r.translateX, r.translateY),
          (t.lineWidth = 1 * this.borderScaleFactor),
          this.group ||
            (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1),
          this.flipX && (r.angle -= 180),
          t.rotate(a(this.group ? r.angle : this.angle)),
          i.forActiveSelection || this.group
            ? n && this.drawBordersInGroup(t, r, i)
            : n && this.drawBorders(t, i),
          s && this.drawControls(t, i),
          t.restore();
      },
      _setShadow: function (t) {
        if (this.shadow) {
          var i,
            r = this.shadow,
            n = this.canvas,
            s = (n && n.viewportTransform[0]) || 1,
            a = (n && n.viewportTransform[3]) || 1;
          (i = r.nonScaling
            ? { scaleX: 1, scaleY: 1 }
            : this.getObjectScaling()),
            n &&
              n._isRetinaScaling() &&
              ((s *= e.devicePixelRatio), (a *= e.devicePixelRatio)),
            (t.shadowColor = r.color),
            (t.shadowBlur =
              (r.blur *
                e.browserShadowBlurConstant *
                (s + a) *
                (i.scaleX + i.scaleY)) /
              4),
            (t.shadowOffsetX = r.offsetX * s * i.scaleX),
            (t.shadowOffsetY = r.offsetY * a * i.scaleY);
        }
      },
      _removeShadow: function (t) {
        this.shadow &&
          ((t.shadowColor = ''),
          (t.shadowBlur = t.shadowOffsetX = t.shadowOffsetY = 0));
      },
      _applyPatternGradientTransform: function (t, e) {
        if (!e || !e.toLive) return { offsetX: 0, offsetY: 0 };
        var i = e.gradientTransform || e.patternTransform,
          r = -this.width / 2 + e.offsetX || 0,
          n = -this.height / 2 + e.offsetY || 0;
        return (
          'percentage' === e.gradientUnits
            ? t.transform(this.width, 0, 0, this.height, r, n)
            : t.transform(1, 0, 0, 1, r, n),
          i && t.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
          { offsetX: r, offsetY: n }
        );
      },
      _renderPaintInOrder: function (t) {
        'stroke' === this.paintFirst
          ? (this._renderStroke(t), this._renderFill(t))
          : (this._renderFill(t), this._renderStroke(t));
      },
      _render: function () {},
      _renderFill: function (t) {
        this.fill &&
          (t.save(),
          this._setFillStyles(t, this),
          'evenodd' === this.fillRule ? t.fill('evenodd') : t.fill(),
          t.restore());
      },
      _renderStroke: function (t) {
        if (this.stroke && 0 !== this.strokeWidth) {
          if (
            (this.shadow && !this.shadow.affectStroke && this._removeShadow(t),
            t.save(),
            this.strokeUniform && this.group)
          ) {
            var e = this.getObjectScaling();
            t.scale(1 / e.scaleX, 1 / e.scaleY);
          } else
            this.strokeUniform && t.scale(1 / this.scaleX, 1 / this.scaleY);
          this._setLineDash(t, this.strokeDashArray),
            this._setStrokeStyles(t, this),
            t.stroke(),
            t.restore();
        }
      },
      _applyPatternForTransformedGradient: function (t, i) {
        var r,
          n = this._limitCacheSize(this._getCacheCanvasDimensions()),
          s = e.util.createCanvasElement(),
          a = this.canvas.getRetinaScaling(),
          o = n.x / this.scaleX / a,
          c = n.y / this.scaleY / a;
        (s.width = o),
          (s.height = c),
          (r = s.getContext('2d')),
          r.beginPath(),
          r.moveTo(0, 0),
          r.lineTo(o, 0),
          r.lineTo(o, c),
          r.lineTo(0, c),
          r.closePath(),
          r.translate(o / 2, c / 2),
          r.scale(n.zoomX / this.scaleX / a, n.zoomY / this.scaleY / a),
          this._applyPatternGradientTransform(r, i),
          (r.fillStyle = i.toLive(t)),
          r.fill(),
          t.translate(
            -this.width / 2 - this.strokeWidth / 2,
            -this.height / 2 - this.strokeWidth / 2
          ),
          t.scale((a * this.scaleX) / n.zoomX, (a * this.scaleY) / n.zoomY),
          (t.strokeStyle = r.createPattern(s, 'no-repeat'));
      },
      _findCenterFromElement: function () {
        return { x: this.left + this.width / 2, y: this.top + this.height / 2 };
      },
      _assignTransformMatrixProps: function () {
        if (this.transformMatrix) {
          var t = e.util.qrDecompose(this.transformMatrix);
          (this.flipX = !1),
            (this.flipY = !1),
            this.set('scaleX', t.scaleX),
            this.set('scaleY', t.scaleY),
            (this.angle = t.angle),
            (this.skewX = t.skewX),
            (this.skewY = 0);
        }
      },
      _removeTransformMatrix: function (t) {
        var i = this._findCenterFromElement();
        this.transformMatrix &&
          (this._assignTransformMatrixProps(),
          (i = e.util.transformPoint(i, this.transformMatrix))),
          (this.transformMatrix = null),
          t &&
            ((this.scaleX *= t.scaleX),
            (this.scaleY *= t.scaleY),
            (this.cropX = t.cropX),
            (this.cropY = t.cropY),
            (i.x += t.offsetLeft),
            (i.y += t.offsetTop),
            (this.width = t.width),
            (this.height = t.height)),
          this.setPositionByOrigin(i, 'center', 'center');
      },
      clone: function (t, i) {
        var r = this.toObject(i);
        this.constructor.fromObject
          ? this.constructor.fromObject(r, t)
          : e.Object._fromObject('Object', r, t);
      },
      cloneAsImage: function (t, i) {
        var r = this.toCanvasElement(i);
        return t && t(new e.Image(r)), this;
      },
      toCanvasElement: function (t) {
        t || (t = {});
        var i = e.util,
          r = i.saveObjectTransform(this),
          n = this.group,
          s = this.shadow,
          a = Math.abs,
          o =
            (t.multiplier || 1) *
            (t.enableRetinaScaling ? e.devicePixelRatio : 1);
        delete this.group,
          t.withoutTransform && i.resetObjectTransform(this),
          t.withoutShadow && (this.shadow = null);
        var c,
          h,
          l,
          u,
          f = e.util.createCanvasElement(),
          d = this.getBoundingRect(!0, !0),
          g = this.shadow,
          p = { x: 0, y: 0 };
        g &&
          ((h = g.blur),
          (c = g.nonScaling
            ? { scaleX: 1, scaleY: 1 }
            : this.getObjectScaling()),
          (p.x = 2 * Math.round(a(g.offsetX) + h) * a(c.scaleX)),
          (p.y = 2 * Math.round(a(g.offsetY) + h) * a(c.scaleY))),
          (l = d.width + p.x),
          (u = d.height + p.y),
          (f.width = Math.ceil(l)),
          (f.height = Math.ceil(u));
        var v = new e.StaticCanvas(f, {
          enableRetinaScaling: !1,
          renderOnAddRemove: !1,
          skipOffscreen: !1
        });
        'jpeg' === t.format && (v.backgroundColor = '#fff'),
          this.setPositionByOrigin(
            new e.Point(v.width / 2, v.height / 2),
            'center',
            'center'
          );
        var b = this.canvas;
        v.add(this);
        var m = v.toCanvasElement(o || 1, t);
        return (
          (this.shadow = s),
          this.set('canvas', b),
          n && (this.group = n),
          this.set(r).setCoords(),
          (v._objects = []),
          v.dispose(),
          (v = null),
          m
        );
      },
      toDataURL: function (t) {
        return (
          t || (t = {}),
          e.util.toDataURL(
            this.toCanvasElement(t),
            t.format || 'png',
            t.quality || 1
          )
        );
      },
      isType: function (t) {
        return arguments.length > 1
          ? Array.from(arguments).includes(this.type)
          : this.type === t;
      },
      complexity: function () {
        return 1;
      },
      toJSON: function (t) {
        return this.toObject(t);
      },
      rotate: function (t) {
        var e =
          ('center' !== this.originX || 'center' !== this.originY) &&
          this.centeredRotation;
        return (
          e && this._setOriginToCenter(),
          this.set('angle', t),
          e && this._resetOrigin(),
          this
        );
      },
      centerH: function () {
        return this.canvas && this.canvas.centerObjectH(this), this;
      },
      viewportCenterH: function () {
        return this.canvas && this.canvas.viewportCenterObjectH(this), this;
      },
      centerV: function () {
        return this.canvas && this.canvas.centerObjectV(this), this;
      },
      viewportCenterV: function () {
        return this.canvas && this.canvas.viewportCenterObjectV(this), this;
      },
      center: function () {
        return this.canvas && this.canvas.centerObject(this), this;
      },
      viewportCenter: function () {
        return this.canvas && this.canvas.viewportCenterObject(this), this;
      },
      getLocalPointer: function (t, i) {
        i = i || this.canvas.getPointer(t);
        var r = new e.Point(i.x, i.y),
          n = this._getLeftTopCoords();
        return (
          this.angle && (r = e.util.rotatePoint(r, n, a(-this.angle))),
          { x: r.x - n.x, y: r.y - n.y }
        );
      },
      _setupCompositeOperation: function (t) {
        this.globalCompositeOperation &&
          (t.globalCompositeOperation = this.globalCompositeOperation);
      },
      dispose: function () {
        e.runningAnimations && e.runningAnimations.cancelByTarget(this);
      }
    })),
    e.util.createAccessors && e.util.createAccessors(e.Object),
    i(e.Object.prototype, e.Observable),
    (e.Object.NUM_FRACTION_DIGITS = 2),
    (e.Object.ENLIVEN_PROPS = ['clipPath']),
    (e.Object._fromObject = function (t, i, n, s) {
      var a = e[t];
      (i = r(i, !0)),
        e.util.enlivenPatterns([i.fill, i.stroke], function (t) {
          'undefined' != typeof t[0] && (i.fill = t[0]),
            'undefined' != typeof t[1] && (i.stroke = t[1]),
            e.util.enlivenObjectEnlivables(i, i, function () {
              var t = s ? new a(i[s], i) : new a(i);
              n && n(t);
            });
        });
    }),
    (e.Object.__uid = 0));
})('undefined' != typeof exports ? exports : this);
!(function () {
  var t = fabric.util.degreesToRadians,
    e = { left: -0.5, center: 0, right: 0.5 },
    i = { top: -0.5, center: 0, bottom: 0.5 };
  fabric.util.object.extend(fabric.Object.prototype, {
    translateToGivenOrigin: function (t, r, n, s, a) {
      var o,
        c,
        h,
        l = t.x,
        u = t.y;
      return (
        'string' == typeof r ? (r = e[r]) : (r -= 0.5),
        'string' == typeof s ? (s = e[s]) : (s -= 0.5),
        (o = s - r),
        'string' == typeof n ? (n = i[n]) : (n -= 0.5),
        'string' == typeof a ? (a = i[a]) : (a -= 0.5),
        (c = a - n),
        (o || c) &&
          ((h = this._getTransformedDimensions()),
          (l = t.x + o * h.x),
          (u = t.y + c * h.y)),
        new fabric.Point(l, u)
      );
    },
    translateToCenterPoint: function (e, i, r) {
      var n = this.translateToGivenOrigin(e, i, r, 'center', 'center');
      return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n;
    },
    translateToOriginPoint: function (e, i, r) {
      var n = this.translateToGivenOrigin(e, 'center', 'center', i, r);
      return this.angle ? fabric.util.rotatePoint(n, e, t(this.angle)) : n;
    },
    getCenterPoint: function () {
      var t = new fabric.Point(this.left, this.top);
      return this.translateToCenterPoint(t, this.originX, this.originY);
    },
    getPointByOrigin: function (t, e) {
      var i = this.getCenterPoint();
      return this.translateToOriginPoint(i, t, e);
    },
    toLocalPoint: function (e, i, r) {
      var n,
        s,
        a = this.getCenterPoint();
      return (
        (n =
          'undefined' != typeof i && 'undefined' != typeof r
            ? this.translateToGivenOrigin(a, 'center', 'center', i, r)
            : new fabric.Point(this.left, this.top)),
        (s = new fabric.Point(e.x, e.y)),
        this.angle && (s = fabric.util.rotatePoint(s, a, -t(this.angle))),
        s.subtractEquals(n)
      );
    },
    setPositionByOrigin: function (t, e, i) {
      var r = this.translateToCenterPoint(t, e, i),
        n = this.translateToOriginPoint(r, this.originX, this.originY);
      this.set('left', n.x), this.set('top', n.y);
    },
    adjustPosition: function (i) {
      var r,
        n,
        s = t(this.angle),
        a = this.getScaledWidth(),
        o = fabric.util.cos(s) * a,
        c = fabric.util.sin(s) * a;
      (r =
        'string' == typeof this.originX ? e[this.originX] : this.originX - 0.5),
        (n = 'string' == typeof i ? e[i] : i - 0.5),
        (this.left += o * (n - r)),
        (this.top += c * (n - r)),
        this.setCoords(),
        (this.originX = i);
    },
    _setOriginToCenter: function () {
      (this._originalOriginX = this.originX),
        (this._originalOriginY = this.originY);
      var t = this.getCenterPoint();
      (this.originX = 'center'),
        (this.originY = 'center'),
        (this.left = t.x),
        (this.top = t.y);
    },
    _resetOrigin: function () {
      var t = this.translateToOriginPoint(
        this.getCenterPoint(),
        this._originalOriginX,
        this._originalOriginY
      );
      (this.originX = this._originalOriginX),
        (this.originY = this._originalOriginY),
        (this.left = t.x),
        (this.top = t.y),
        (this._originalOriginX = null),
        (this._originalOriginY = null);
    },
    _getLeftTopCoords: function () {
      return this.translateToOriginPoint(this.getCenterPoint(), 'left', 'top');
    }
  });
})();
!(function () {
  function t(t) {
    return [
      new fabric.Point(t.tl.x, t.tl.y),
      new fabric.Point(t.tr.x, t.tr.y),
      new fabric.Point(t.br.x, t.br.y),
      new fabric.Point(t.bl.x, t.bl.y)
    ];
  }
  var e = fabric.util,
    i = e.degreesToRadians,
    r = e.multiplyTransformMatrices,
    n = e.transformPoint;
  e.object.extend(fabric.Object.prototype, {
    oCoords: null,
    aCoords: null,
    lineCoords: null,
    ownMatrixCache: null,
    matrixCache: null,
    controls: {},
    _getCoords: function (t, e) {
      return e
        ? t
          ? this.calcACoords()
          : this.calcLineCoords()
        : ((this.aCoords && this.lineCoords) || this.setCoords(!0),
          t ? this.aCoords : this.lineCoords);
    },
    getCoords: function (e, i) {
      return t(this._getCoords(e, i));
    },
    intersectsWithRect: function (t, e, i, r) {
      var n = this.getCoords(i, r),
        s = fabric.Intersection.intersectPolygonRectangle(n, t, e);
      return 'Intersection' === s.status;
    },
    intersectsWithObject: function (t, e, i) {
      var r = fabric.Intersection.intersectPolygonPolygon(
        this.getCoords(e, i),
        t.getCoords(e, i)
      );
      return (
        'Intersection' === r.status ||
        t.isContainedWithinObject(this, e, i) ||
        this.isContainedWithinObject(t, e, i)
      );
    },
    isContainedWithinObject: function (t, e, i) {
      for (
        var r = this.getCoords(e, i),
          n = e ? t.aCoords : t.lineCoords,
          s = 0,
          a = t._getImageLines(n);
        4 > s;
        s++
      )
        if (!t.containsPoint(r[s], a)) return !1;
      return !0;
    },
    isContainedWithinRect: function (t, e, i, r) {
      var n = this.getBoundingRect(i, r);
      return (
        n.left >= t.x &&
        n.left + n.width <= e.x &&
        n.top >= t.y &&
        n.top + n.height <= e.y
      );
    },
    containsPoint: function (t, e, i, r) {
      var n = this._getCoords(i, r),
        e = e || this._getImageLines(n),
        s = this._findCrossPoints(t, e);
      return 0 !== s && s % 2 === 1;
    },
    isOnScreen: function (t) {
      if (!this.canvas) return !1;
      var e = this.canvas.vptCoords.tl,
        i = this.canvas.vptCoords.br,
        r = this.getCoords(!0, t);
      return r.some(function (t) {
        return t.x <= i.x && t.x >= e.x && t.y <= i.y && t.y >= e.y;
      })
        ? !0
        : this.intersectsWithRect(e, i, !0, t)
        ? !0
        : this._containsCenterOfCanvas(e, i, t);
    },
    _containsCenterOfCanvas: function (t, e, i) {
      var r = { x: (t.x + e.x) / 2, y: (t.y + e.y) / 2 };
      return this.containsPoint(r, null, !0, i) ? !0 : !1;
    },
    isPartiallyOnScreen: function (t) {
      if (!this.canvas) return !1;
      var e = this.canvas.vptCoords.tl,
        i = this.canvas.vptCoords.br;
      if (this.intersectsWithRect(e, i, !0, t)) return !0;
      var r = this.getCoords(!0, t).every(function (t) {
        return (t.x >= i.x || t.x <= e.x) && (t.y >= i.y || t.y <= e.y);
      });
      return r && this._containsCenterOfCanvas(e, i, t);
    },
    _getImageLines: function (t) {
      var e = {
        topline: { o: t.tl, d: t.tr },
        rightline: { o: t.tr, d: t.br },
        bottomline: { o: t.br, d: t.bl },
        leftline: { o: t.bl, d: t.tl }
      };
      return e;
    },
    _findCrossPoints: function (t, e) {
      var i,
        r,
        n,
        s,
        a,
        o,
        c = 0;
      for (var h in e)
        if (
          ((o = e[h]),
          !(
            (o.o.y < t.y && o.d.y < t.y) ||
            (o.o.y >= t.y && o.d.y >= t.y) ||
            (o.o.x === o.d.x && o.o.x >= t.x
              ? (a = o.o.x)
              : ((i = 0),
                (r = (o.d.y - o.o.y) / (o.d.x - o.o.x)),
                (n = t.y - i * t.x),
                (s = o.o.y - r * o.o.x),
                (a = -(n - s) / (i - r))),
            a >= t.x && (c += 1),
            2 !== c)
          ))
        )
          break;
      return c;
    },
    getBoundingRect: function (t, i) {
      var r = this.getCoords(t, i);
      return e.makeBoundingBoxFromPoints(r);
    },
    getScaledWidth: function () {
      return this._getTransformedDimensions().x;
    },
    getScaledHeight: function () {
      return this._getTransformedDimensions().y;
    },
    _constrainScale: function (t) {
      return Math.abs(t) < this.minScaleLimit
        ? 0 > t
          ? -this.minScaleLimit
          : this.minScaleLimit
        : 0 === t
        ? 1e-4
        : t;
    },
    scale: function (t) {
      return this._set('scaleX', t), this._set('scaleY', t), this.setCoords();
    },
    scaleToWidth: function (t, e) {
      var i = this.getBoundingRect(e).width / this.getScaledWidth();
      return this.scale(t / this.width / i);
    },
    scaleToHeight: function (t, e) {
      var i = this.getBoundingRect(e).height / this.getScaledHeight();
      return this.scale(t / this.height / i);
    },
    calcLineCoords: function () {
      var t = this.getViewportTransform(),
        r = this.padding,
        s = i(this.angle),
        a = e.cos(s),
        o = e.sin(s),
        c = a * r,
        h = o * r,
        l = c + h,
        u = c - h,
        f = this.calcACoords(),
        d = { tl: n(f.tl, t), tr: n(f.tr, t), bl: n(f.bl, t), br: n(f.br, t) };
      return (
        r &&
          ((d.tl.x -= u),
          (d.tl.y -= l),
          (d.tr.x += l),
          (d.tr.y -= u),
          (d.bl.x -= l),
          (d.bl.y += u),
          (d.br.x += u),
          (d.br.y += l)),
        d
      );
    },
    calcOCoords: function () {
      var t = this._calcRotateMatrix(),
        e = this._calcTranslateMatrix(),
        i = this.getViewportTransform(),
        n = r(i, e),
        s = r(n, t),
        s = r(s, [1 / i[0], 0, 0, 1 / i[3], 0, 0]),
        a = this._calculateCurrentDimensions(),
        o = {};
      return (
        this.forEachControl(function (t, e, i) {
          o[e] = t.positionHandler(a, s, i);
        }),
        o
      );
    },
    calcACoords: function () {
      var t = this._calcRotateMatrix(),
        e = this._calcTranslateMatrix(),
        i = r(e, t),
        s = this._getTransformedDimensions(),
        a = s.x / 2,
        o = s.y / 2;
      return {
        tl: n({ x: -a, y: -o }, i),
        tr: n({ x: a, y: -o }, i),
        bl: n({ x: -a, y: o }, i),
        br: n({ x: a, y: o }, i)
      };
    },
    setCoords: function (t) {
      return (
        (this.aCoords = this.calcACoords()),
        (this.lineCoords = this.group ? this.aCoords : this.calcLineCoords()),
        t
          ? this
          : ((this.oCoords = this.calcOCoords()),
            this._setCornerCoords && this._setCornerCoords(),
            this)
      );
    },
    _calcRotateMatrix: function () {
      return e.calcRotateMatrix(this);
    },
    _calcTranslateMatrix: function () {
      var t = this.getCenterPoint();
      return [1, 0, 0, 1, t.x, t.y];
    },
    transformMatrixKey: function (t) {
      var e = '_',
        i = '';
      return (
        !t && this.group && (i = this.group.transformMatrixKey(t) + e),
        i +
          this.top +
          e +
          this.left +
          e +
          this.scaleX +
          e +
          this.scaleY +
          e +
          this.skewX +
          e +
          this.skewY +
          e +
          this.angle +
          e +
          this.originX +
          e +
          this.originY +
          e +
          this.width +
          e +
          this.height +
          e +
          this.strokeWidth +
          this.flipX +
          this.flipY
      );
    },
    calcTransformMatrix: function (t) {
      var e = this.calcOwnMatrix();
      if (t || !this.group) return e;
      var i = this.transformMatrixKey(t),
        n = this.matrixCache || (this.matrixCache = {});
      return n.key === i
        ? n.value
        : (this.group && (e = r(this.group.calcTransformMatrix(!1), e)),
          (n.key = i),
          (n.value = e),
          e);
    },
    calcOwnMatrix: function () {
      var t = this.transformMatrixKey(!0),
        i = this.ownMatrixCache || (this.ownMatrixCache = {});
      if (i.key === t) return i.value;
      var r = this._calcTranslateMatrix(),
        n = {
          angle: this.angle,
          translateX: r[4],
          translateY: r[5],
          scaleX: this.scaleX,
          scaleY: this.scaleY,
          skewX: this.skewX,
          skewY: this.skewY,
          flipX: this.flipX,
          flipY: this.flipY
        };
      return (i.key = t), (i.value = e.composeMatrix(n)), i.value;
    },
    _getNonTransformedDimensions: function () {
      var t = this.strokeWidth,
        e = this.width + t,
        i = this.height + t;
      return { x: e, y: i };
    },
    _getTransformedDimensions: function (t, i) {
      'undefined' == typeof t && (t = this.skewX),
        'undefined' == typeof i && (i = this.skewY);
      var r,
        n,
        s,
        a = 0 === t && 0 === i;
      if (
        (this.strokeUniform
          ? ((n = this.width), (s = this.height))
          : ((r = this._getNonTransformedDimensions()), (n = r.x), (s = r.y)),
        a)
      )
        return this._finalizeDimensions(n * this.scaleX, s * this.scaleY);
      var o = e.sizeAfterTransform(n, s, {
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        skewX: t,
        skewY: i
      });
      return this._finalizeDimensions(o.x, o.y);
    },
    _finalizeDimensions: function (t, e) {
      return this.strokeUniform
        ? { x: t + this.strokeWidth, y: e + this.strokeWidth }
        : { x: t, y: e };
    },
    _calculateCurrentDimensions: function () {
      var t = this.getViewportTransform(),
        e = this._getTransformedDimensions(),
        i = n(e, t, !0);
      return i.scalarAdd(2 * this.padding);
    }
  });
})();
fabric.util.object.extend(fabric.Object.prototype, {
  sendToBack: function () {
    return (
      this.group
        ? fabric.StaticCanvas.prototype.sendToBack.call(this.group, this)
        : this.canvas && this.canvas.sendToBack(this),
      this
    );
  },
  bringToFront: function () {
    return (
      this.group
        ? fabric.StaticCanvas.prototype.bringToFront.call(this.group, this)
        : this.canvas && this.canvas.bringToFront(this),
      this
    );
  },
  sendBackwards: function (t) {
    return (
      this.group
        ? fabric.StaticCanvas.prototype.sendBackwards.call(this.group, this, t)
        : this.canvas && this.canvas.sendBackwards(this, t),
      this
    );
  },
  bringForward: function (t) {
    return (
      this.group
        ? fabric.StaticCanvas.prototype.bringForward.call(this.group, this, t)
        : this.canvas && this.canvas.bringForward(this, t),
      this
    );
  },
  moveTo: function (t) {
    return (
      this.group && 'activeSelection' !== this.group.type
        ? fabric.StaticCanvas.prototype.moveTo.call(this.group, this, t)
        : this.canvas && this.canvas.moveTo(this, t),
      this
    );
  }
});
!(function () {
  function t(t, e) {
    if (e) {
      if (e.toLive) return t + ': url(#SVGID_' + e.id + '); ';
      var i = new fabric.Color(e),
        r = t + ': ' + i.toRgb() + '; ',
        n = i.getAlpha();
      return 1 !== n && (r += t + '-opacity: ' + n.toString() + '; '), r;
    }
    return t + ': none; ';
  }
  var e = fabric.util.toFixed;
  fabric.util.object.extend(fabric.Object.prototype, {
    getSvgStyles: function (e) {
      var i = this.fillRule ? this.fillRule : 'nonzero',
        r = this.strokeWidth ? this.strokeWidth : '0',
        n = this.strokeDashArray ? this.strokeDashArray.join(' ') : 'none',
        s = this.strokeDashOffset ? this.strokeDashOffset : '0',
        o = this.strokeLineCap ? this.strokeLineCap : 'butt',
        a = this.strokeLineJoin ? this.strokeLineJoin : 'miter',
        c = this.strokeMiterLimit ? this.strokeMiterLimit : '4',
        h = 'undefined' != typeof this.opacity ? this.opacity : '1',
        l = this.visible ? '' : ' visibility: hidden;',
        u = e ? '' : this.getSvgFilter(),
        f = t('fill', this.fill),
        d = t('stroke', this.stroke);
      return [
        d,
        'stroke-width: ',
        r,
        '; ',
        'stroke-dasharray: ',
        n,
        '; ',
        'stroke-linecap: ',
        o,
        '; ',
        'stroke-dashoffset: ',
        s,
        '; ',
        'stroke-linejoin: ',
        a,
        '; ',
        'stroke-miterlimit: ',
        c,
        '; ',
        f,
        'fill-rule: ',
        i,
        '; ',
        'opacity: ',
        h,
        ';',
        u,
        l
      ].join('');
    },
    getSvgSpanStyles: function (e, i) {
      var r = '; ',
        n = e.fontFamily
          ? 'font-family: ' +
            (-1 === e.fontFamily.indexOf("'") &&
            -1 === e.fontFamily.indexOf('"')
              ? "'" + e.fontFamily + "'"
              : e.fontFamily) +
            r
          : '',
        s = e.strokeWidth ? 'stroke-width: ' + e.strokeWidth + r : '',
        n = n,
        o = e.fontSize ? 'font-size: ' + e.fontSize + 'px' + r : '',
        a = e.fontStyle ? 'font-style: ' + e.fontStyle + r : '',
        c = e.fontWeight ? 'font-weight: ' + e.fontWeight + r : '',
        h = e.fill ? t('fill', e.fill) : '',
        l = e.stroke ? t('stroke', e.stroke) : '',
        u = this.getSvgTextDecoration(e),
        f = e.deltaY ? 'baseline-shift: ' + -e.deltaY + '; ' : '';
      return (
        u && (u = 'text-decoration: ' + u + r),
        [l, s, n, o, a, c, u, h, f, i ? 'white-space: pre; ' : ''].join('')
      );
    },
    getSvgTextDecoration: function (t) {
      return ['overline', 'underline', 'line-through']
        .filter(function (e) {
          return t[e.replace('-', '')];
        })
        .join(' ');
    },
    getSvgFilter: function () {
      return this.shadow ? 'filter: url(#SVGID_' + this.shadow.id + ');' : '';
    },
    getSvgCommons: function () {
      return [
        this.id ? 'id="' + this.id + '" ' : '',
        this.clipPath
          ? 'clip-path="url(#' + this.clipPath.clipPathId + ')" '
          : ''
      ].join('');
    },
    getSvgTransform: function (t, e) {
      var i = t ? this.calcTransformMatrix() : this.calcOwnMatrix(),
        r = 'transform="' + fabric.util.matrixToSVG(i);
      return r + (e || '') + '" ';
    },
    _setSVGBg: function (t) {
      if (this.backgroundColor) {
        var i = fabric.Object.NUM_FRACTION_DIGITS;
        t.push(
          '		<rect ',
          this._getFillAttributes(this.backgroundColor),
          ' x="',
          e(-this.width / 2, i),
          '" y="',
          e(-this.height / 2, i),
          '" width="',
          e(this.width, i),
          '" height="',
          e(this.height, i),
          '"></rect>\n'
        );
      }
    },
    toSVG: function (t) {
      return this._createBaseSVGMarkup(this._toSVG(t), { reviver: t });
    },
    toClipPathSVG: function (t) {
      return (
        '	' + this._createBaseClipPathSVGMarkup(this._toSVG(t), { reviver: t })
      );
    },
    _createBaseClipPathSVGMarkup: function (t, e) {
      e = e || {};
      var i = e.reviver,
        r = e.additionalTransform || '',
        n = [this.getSvgTransform(!0, r), this.getSvgCommons()].join(''),
        s = t.indexOf('COMMON_PARTS');
      return (t[s] = n), i ? i(t.join('')) : t.join('');
    },
    _createBaseSVGMarkup: function (t, e) {
      e = e || {};
      var i,
        r,
        n = e.noStyle,
        s = e.reviver,
        o = n ? '' : 'style="' + this.getSvgStyles() + '" ',
        a = e.withShadow ? 'style="' + this.getSvgFilter() + '" ' : '',
        c = this.clipPath,
        h = this.strokeUniform ? 'vector-effect="non-scaling-stroke" ' : '',
        l = c && c.absolutePositioned,
        u = this.stroke,
        f = this.fill,
        d = this.shadow,
        g = [],
        p = t.indexOf('COMMON_PARTS'),
        v = e.additionalTransform;
      return (
        c &&
          ((c.clipPathId = 'CLIPPATH_' + fabric.Object.__uid++),
          (r =
            '<clipPath id="' +
            c.clipPathId +
            '" >\n' +
            c.toClipPathSVG(s) +
            '</clipPath>\n')),
        l && g.push('<g ', a, this.getSvgCommons(), ' >\n'),
        g.push(
          '<g ',
          this.getSvgTransform(!1),
          l ? '' : a + this.getSvgCommons(),
          ' >\n'
        ),
        (i = [
          o,
          h,
          n ? '' : this.addPaintOrder(),
          ' ',
          v ? 'transform="' + v + '" ' : ''
        ].join('')),
        (t[p] = i),
        f && f.toLive && g.push(f.toSVG(this)),
        u && u.toLive && g.push(u.toSVG(this)),
        d && g.push(d.toSVG(this)),
        c && g.push(r),
        g.push(t.join('')),
        g.push('</g>\n'),
        l && g.push('</g>\n'),
        s ? s(g.join('')) : g.join('')
      );
    },
    addPaintOrder: function () {
      return 'fill' !== this.paintFirst
        ? ' paint-order="' + this.paintFirst + '" '
        : '';
    }
  });
})();
!(function () {
  function t(t, e, r) {
    var n = {},
      s = !0;
    r.forEach(function (e) {
      n[e] = t[e];
    }),
      i(t[e], n, s);
  }
  function e(t, i, r) {
    if (t === i) return !0;
    if (Array.isArray(t)) {
      if (!Array.isArray(i) || t.length !== i.length) return !1;
      for (var n = 0, s = t.length; s > n; n++) if (!e(t[n], i[n])) return !1;
      return !0;
    }
    if (t && 'object' == typeof t) {
      var o,
        a = Object.keys(t);
      if (
        !i ||
        'object' != typeof i ||
        (!r && a.length !== Object.keys(i).length)
      )
        return !1;
      for (var n = 0, s = a.length; s > n; n++)
        if (((o = a[n]), 'canvas' !== o && 'group' !== o && !e(t[o], i[o])))
          return !1;
      return !0;
    }
  }
  var i = fabric.util.object.extend,
    r = 'stateProperties';
  fabric.util.object.extend(fabric.Object.prototype, {
    hasStateChanged: function (t) {
      t = t || r;
      var i = '_' + t;
      return Object.keys(this[i]).length < this[t].length
        ? !0
        : !e(this[i], this, !0);
    },
    saveState: function (e) {
      var i = (e && e.propertySet) || r,
        n = '_' + i;
      return this[n]
        ? (t(this, n, this[i]),
          e && e.stateProperties && t(this, n, e.stateProperties),
          this)
        : this.setupState(e);
    },
    setupState: function (t) {
      t = t || {};
      var e = t.propertySet || r;
      return (t.propertySet = e), (this['_' + e] = {}), this.saveState(t), this;
    }
  });
})();
!(function () {
  var t = fabric.util.degreesToRadians;
  fabric.util.object.extend(fabric.Object.prototype, {
    _findTargetCorner: function (t, e) {
      if (
        !this.hasControls ||
        this.group ||
        !this.canvas ||
        this.canvas._activeObject !== this
      )
        return !1;
      var i,
        r,
        n,
        s = t.x,
        o = t.y,
        a = Object.keys(this.oCoords),
        c = a.length - 1;
      for (this.__corner = 0; c >= 0; c--)
        if (
          ((n = a[c]),
          this.isControlVisible(n) &&
            ((r = this._getImageLines(
              e ? this.oCoords[n].touchCorner : this.oCoords[n].corner
            )),
            (i = this._findCrossPoints({ x: s, y: o }, r)),
            0 !== i && i % 2 === 1))
        )
          return (this.__corner = n), n;
      return !1;
    },
    forEachControl: function (t) {
      for (var e in this.controls) t(this.controls[e], e, this);
    },
    _setCornerCoords: function () {
      var t = this.oCoords;
      for (var e in t) {
        var i = this.controls[e];
        (t[e].corner = i.calcCornerCoords(
          this.angle,
          this.cornerSize,
          t[e].x,
          t[e].y,
          !1
        )),
          (t[e].touchCorner = i.calcCornerCoords(
            this.angle,
            this.touchCornerSize,
            t[e].x,
            t[e].y,
            !0
          ));
      }
    },
    drawSelectionBackground: function (e) {
      if (
        !this.selectionBackgroundColor ||
        (this.canvas && !this.canvas.interactive) ||
        (this.canvas && this.canvas._activeObject !== this)
      )
        return this;
      e.save();
      var i = this.getCenterPoint(),
        r = this._calculateCurrentDimensions(),
        n = this.canvas.viewportTransform;
      return (
        e.translate(i.x, i.y),
        e.scale(1 / n[0], 1 / n[3]),
        e.rotate(t(this.angle)),
        (e.fillStyle = this.selectionBackgroundColor),
        e.fillRect(-r.x / 2, -r.y / 2, r.x, r.y),
        e.restore(),
        this
      );
    },
    drawBorders: function (t, e) {
      e = e || {};
      var i = this._calculateCurrentDimensions(),
        r = this.borderScaleFactor,
        n = i.x + r,
        s = i.y + r,
        o =
          'undefined' != typeof e.hasControls
            ? e.hasControls
            : this.hasControls,
        a = !1;
      return (
        t.save(),
        (t.strokeStyle = e.borderColor || this.borderColor),
        this._setLineDash(t, e.borderDashArray || this.borderDashArray),
        t.strokeRect(-n / 2, -s / 2, n, s),
        o &&
          (t.beginPath(),
          this.forEachControl(function (e, i, r) {
            e.withConnection &&
              e.getVisibility(r, i) &&
              ((a = !0),
              t.moveTo(e.x * n, e.y * s),
              t.lineTo(e.x * n + e.offsetX, e.y * s + e.offsetY));
          }),
          a && t.stroke()),
        t.restore(),
        this
      );
    },
    drawBordersInGroup: function (t, e, i) {
      i = i || {};
      var r = fabric.util.sizeAfterTransform(this.width, this.height, e),
        n = this.strokeWidth,
        s = this.strokeUniform,
        o = this.borderScaleFactor,
        a = r.x + n * (s ? this.canvas.getZoom() : e.scaleX) + o,
        c = r.y + n * (s ? this.canvas.getZoom() : e.scaleY) + o;
      return (
        t.save(),
        this._setLineDash(t, i.borderDashArray || this.borderDashArray),
        (t.strokeStyle = i.borderColor || this.borderColor),
        t.strokeRect(-a / 2, -c / 2, a, c),
        t.restore(),
        this
      );
    },
    drawControls: function (t, e) {
      (e = e || {}), t.save();
      var i,
        r,
        n = this.canvas.getRetinaScaling();
      return (
        t.setTransform(n, 0, 0, n, 0, 0),
        (t.strokeStyle = t.fillStyle = e.cornerColor || this.cornerColor),
        this.transparentCorners ||
          (t.strokeStyle = e.cornerStrokeColor || this.cornerStrokeColor),
        this._setLineDash(t, e.cornerDashArray || this.cornerDashArray),
        this.setCoords(),
        this.group && (i = this.group.calcTransformMatrix()),
        this.forEachControl(function (n, s, o) {
          (r = o.oCoords[s]),
            n.getVisibility(o, s) &&
              (i && (r = fabric.util.transformPoint(r, i)),
              n.render(t, r.x, r.y, e, o));
        }),
        t.restore(),
        this
      );
    },
    isControlVisible: function (t) {
      return this.controls[t] && this.controls[t].getVisibility(this, t);
    },
    setControlVisible: function (t, e) {
      return (
        this._controlsVisibility || (this._controlsVisibility = {}),
        (this._controlsVisibility[t] = e),
        this
      );
    },
    setControlsVisibility: function (t) {
      t || (t = {});
      for (var e in t) this.setControlVisible(e, t[e]);
      return this;
    },
    onDeselect: function () {},
    onSelect: function () {}
  });
})();
fabric.util.object.extend(fabric.StaticCanvas.prototype, {
  FX_DURATION: 500,
  fxCenterObjectH: function (t, e) {
    e = e || {};
    var i = function () {},
      r = e.onComplete || i,
      n = e.onChange || i,
      s = this;
    return fabric.util.animate({
      target: this,
      startValue: t.left,
      endValue: this.getCenterPoint().x,
      duration: this.FX_DURATION,
      onChange: function (e) {
        t.set('left', e), s.requestRenderAll(), n();
      },
      onComplete: function () {
        t.setCoords(), r();
      }
    });
  },
  fxCenterObjectV: function (t, e) {
    e = e || {};
    var i = function () {},
      r = e.onComplete || i,
      n = e.onChange || i,
      s = this;
    return fabric.util.animate({
      target: this,
      startValue: t.top,
      endValue: this.getCenterPoint().y,
      duration: this.FX_DURATION,
      onChange: function (e) {
        t.set('top', e), s.requestRenderAll(), n();
      },
      onComplete: function () {
        t.setCoords(), r();
      }
    });
  },
  fxRemove: function (t, e) {
    e = e || {};
    var i = function () {},
      r = e.onComplete || i,
      n = e.onChange || i,
      s = this;
    return fabric.util.animate({
      target: this,
      startValue: t.opacity,
      endValue: 0,
      duration: this.FX_DURATION,
      onChange: function (e) {
        t.set('opacity', e), s.requestRenderAll(), n();
      },
      onComplete: function () {
        s.remove(t), r();
      }
    });
  }
}),
  fabric.util.object.extend(fabric.Object.prototype, {
    animate: function () {
      if (arguments[0] && 'object' == typeof arguments[0]) {
        var t,
          e,
          i = [],
          r = [];
        for (t in arguments[0]) i.push(t);
        for (var n = 0, s = i.length; s > n; n++)
          (t = i[n]),
            (e = n !== s - 1),
            r.push(this._animate(t, arguments[0][t], arguments[1], e));
        return r;
      }
      return this._animate.apply(this, arguments);
    },
    _animate: function (t, e, i, r) {
      var n,
        s = this;
      (e = e.toString()),
        (i = i ? fabric.util.object.clone(i) : {}),
        ~t.indexOf('.') && (n = t.split('.'));
      var o =
          s.colorProperties.indexOf(t) > -1 ||
          (n && s.colorProperties.indexOf(n[1]) > -1),
        a = n ? this.get(n[0])[n[1]] : this.get(t);
      'from' in i || (i.from = a),
        o ||
          (e = ~e.indexOf('=')
            ? a + parseFloat(e.replace('=', ''))
            : parseFloat(e));
      var c = {
        target: this,
        startValue: i.from,
        endValue: e,
        byValue: i.by,
        easing: i.easing,
        duration: i.duration,
        abort:
          i.abort &&
          function (t, e, r) {
            return i.abort.call(s, t, e, r);
          },
        onChange: function (e, o, a) {
          n ? (s[n[0]][n[1]] = e) : s.set(t, e),
            r || (i.onChange && i.onChange(e, o, a));
        },
        onComplete: function (t, e, n) {
          r || (s.setCoords(), i.onComplete && i.onComplete(t, e, n));
        }
      };
      return o
        ? fabric.util.animateColor(c.startValue, c.endValue, c.duration, c)
        : fabric.util.animate(c);
    }
  });
!(function (t) {
  'use strict';
  function e(t, e) {
    var i = t.origin,
      r = t.axis1,
      n = t.axis2,
      s = t.dimension,
      o = e.nearest,
      a = e.center,
      c = e.farthest;
    return function () {
      switch (this.get(i)) {
        case o:
          return Math.min(this.get(r), this.get(n));
        case a:
          return Math.min(this.get(r), this.get(n)) + 0.5 * this.get(s);
        case c:
          return Math.max(this.get(r), this.get(n));
      }
    };
  }
  var i = t.fabric || (t.fabric = {}),
    r = i.util.object.extend,
    n = i.util.object.clone,
    s = { x1: 1, x2: 1, y1: 1, y2: 1 };
  return i.Line
    ? void i.warn('fabric.Line is already defined')
    : ((i.Line = i.util.createClass(i.Object, {
        type: 'line',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
        cacheProperties: i.Object.prototype.cacheProperties.concat(
          'x1',
          'x2',
          'y1',
          'y2'
        ),
        initialize: function (t, e) {
          t || (t = [0, 0, 0, 0]),
            this.callSuper('initialize', e),
            this.set('x1', t[0]),
            this.set('y1', t[1]),
            this.set('x2', t[2]),
            this.set('y2', t[3]),
            this._setWidthHeight(e);
        },
        _setWidthHeight: function (t) {
          t || (t = {}),
            (this.width = Math.abs(this.x2 - this.x1)),
            (this.height = Math.abs(this.y2 - this.y1)),
            (this.left = 'left' in t ? t.left : this._getLeftToOriginX()),
            (this.top = 'top' in t ? t.top : this._getTopToOriginY());
        },
        _set: function (t, e) {
          return (
            this.callSuper('_set', t, e),
            'undefined' != typeof s[t] && this._setWidthHeight(),
            this
          );
        },
        _getLeftToOriginX: e(
          { origin: 'originX', axis1: 'x1', axis2: 'x2', dimension: 'width' },
          { nearest: 'left', center: 'center', farthest: 'right' }
        ),
        _getTopToOriginY: e(
          { origin: 'originY', axis1: 'y1', axis2: 'y2', dimension: 'height' },
          { nearest: 'top', center: 'center', farthest: 'bottom' }
        ),
        _render: function (t) {
          t.beginPath();
          var e = this.calcLinePoints();
          t.moveTo(e.x1, e.y1),
            t.lineTo(e.x2, e.y2),
            (t.lineWidth = this.strokeWidth);
          var i = t.strokeStyle;
          (t.strokeStyle = this.stroke || t.fillStyle),
            this.stroke && this._renderStroke(t),
            (t.strokeStyle = i);
        },
        _findCenterFromElement: function () {
          return { x: (this.x1 + this.x2) / 2, y: (this.y1 + this.y2) / 2 };
        },
        toObject: function (t) {
          return r(this.callSuper('toObject', t), this.calcLinePoints());
        },
        _getNonTransformedDimensions: function () {
          var t = this.callSuper('_getNonTransformedDimensions');
          return (
            'butt' === this.strokeLineCap &&
              (0 === this.width && (t.y -= this.strokeWidth),
              0 === this.height && (t.x -= this.strokeWidth)),
            t
          );
        },
        calcLinePoints: function () {
          var t = this.x1 <= this.x2 ? -1 : 1,
            e = this.y1 <= this.y2 ? -1 : 1,
            i = t * this.width * 0.5,
            r = e * this.height * 0.5,
            n = t * this.width * -0.5,
            s = e * this.height * -0.5;
          return { x1: i, x2: n, y1: r, y2: s };
        },
        _toSVG: function () {
          var t = this.calcLinePoints();
          return [
            '<line ',
            'COMMON_PARTS',
            'x1="',
            t.x1,
            '" y1="',
            t.y1,
            '" x2="',
            t.x2,
            '" y2="',
            t.y2,
            '" />\n'
          ];
        }
      })),
      (i.Line.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat(
        'x1 y1 x2 y2'.split(' ')
      )),
      (i.Line.fromElement = function (t, e, n) {
        n = n || {};
        var s = i.parseAttributes(t, i.Line.ATTRIBUTE_NAMES),
          o = [s.x1 || 0, s.y1 || 0, s.x2 || 0, s.y2 || 0];
        e(new i.Line(o, r(s, n)));
      }),
      void (i.Line.fromObject = function (t, e) {
        function r(t) {
          delete t.points, e && e(t);
        }
        var s = n(t, !0);
        (s.points = [t.x1, t.y1, t.x2, t.y2]),
          i.Object._fromObject('Line', s, r, 'points');
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  function e(t) {
    return 'radius' in t && t.radius >= 0;
  }
  var i = t.fabric || (t.fabric = {}),
    r = i.util.degreesToRadians;
  return i.Circle
    ? void i.warn('fabric.Circle is already defined.')
    : ((i.Circle = i.util.createClass(i.Object, {
        type: 'circle',
        radius: 0,
        startAngle: 0,
        endAngle: 360,
        cacheProperties: i.Object.prototype.cacheProperties.concat(
          'radius',
          'startAngle',
          'endAngle'
        ),
        _set: function (t, e) {
          return (
            this.callSuper('_set', t, e),
            'radius' === t && this.setRadius(e),
            this
          );
        },
        toObject: function (t) {
          return this.callSuper(
            'toObject',
            ['radius', 'startAngle', 'endAngle'].concat(t)
          );
        },
        _toSVG: function () {
          var t,
            e = 0,
            n = 0,
            s = (this.endAngle - this.startAngle) % 360;
          if (0 === s)
            t = [
              '<circle ',
              'COMMON_PARTS',
              'cx="' + e + '" cy="' + n + '" ',
              'r="',
              this.radius,
              '" />\n'
            ];
          else {
            var o = r(this.startAngle),
              a = r(this.endAngle),
              c = this.radius,
              h = i.util.cos(o) * c,
              l = i.util.sin(o) * c,
              u = i.util.cos(a) * c,
              f = i.util.sin(a) * c,
              d = s > 180 ? '1' : '0';
            t = [
              '<path d="M ' + h + ' ' + l,
              ' A ' + c + ' ' + c,
              ' 0 ',
              +d + ' 1',
              ' ' + u + ' ' + f,
              '" ',
              'COMMON_PARTS',
              ' />\n'
            ];
          }
          return t;
        },
        _render: function (t) {
          t.beginPath(),
            t.arc(0, 0, this.radius, r(this.startAngle), r(this.endAngle), !1),
            this._renderPaintInOrder(t);
        },
        getRadiusX: function () {
          return this.get('radius') * this.get('scaleX');
        },
        getRadiusY: function () {
          return this.get('radius') * this.get('scaleY');
        },
        setRadius: function (t) {
          return (
            (this.radius = t), this.set('width', 2 * t).set('height', 2 * t)
          );
        }
      })),
      (i.Circle.ATTRIBUTE_NAMES = i.SHARED_ATTRIBUTES.concat(
        'cx cy r'.split(' ')
      )),
      (i.Circle.fromElement = function (t, r) {
        var n = i.parseAttributes(t, i.Circle.ATTRIBUTE_NAMES);
        if (!e(n))
          throw new Error(
            'value of `r` attribute is required and can not be negative'
          );
        (n.left = (n.left || 0) - n.radius),
          (n.top = (n.top || 0) - n.radius),
          r(new i.Circle(n));
      }),
      void (i.Circle.fromObject = function (t, e) {
        i.Object._fromObject('Circle', t, e);
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {});
  return e.Triangle
    ? void e.warn('fabric.Triangle is already defined')
    : ((e.Triangle = e.util.createClass(e.Object, {
        type: 'triangle',
        width: 100,
        height: 100,
        _render: function (t) {
          var e = this.width / 2,
            i = this.height / 2;
          t.beginPath(),
            t.moveTo(-e, i),
            t.lineTo(0, -i),
            t.lineTo(e, i),
            t.closePath(),
            this._renderPaintInOrder(t);
        },
        _toSVG: function () {
          var t = this.width / 2,
            e = this.height / 2,
            i = [-t + ' ' + e, '0 ' + -e, t + ' ' + e].join(',');
          return ['<polygon ', 'COMMON_PARTS', 'points="', i, '" />'];
        }
      })),
      void (e.Triangle.fromObject = function (t, i) {
        return e.Object._fromObject('Triangle', t, i);
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = 2 * Math.PI;
  return e.Ellipse
    ? void e.warn('fabric.Ellipse is already defined.')
    : ((e.Ellipse = e.util.createClass(e.Object, {
        type: 'ellipse',
        rx: 0,
        ry: 0,
        cacheProperties: e.Object.prototype.cacheProperties.concat('rx', 'ry'),
        initialize: function (t) {
          this.callSuper('initialize', t),
            this.set('rx', (t && t.rx) || 0),
            this.set('ry', (t && t.ry) || 0);
        },
        _set: function (t, e) {
          switch ((this.callSuper('_set', t, e), t)) {
            case 'rx':
              (this.rx = e), this.set('width', 2 * e);
              break;
            case 'ry':
              (this.ry = e), this.set('height', 2 * e);
          }
          return this;
        },
        getRx: function () {
          return this.get('rx') * this.get('scaleX');
        },
        getRy: function () {
          return this.get('ry') * this.get('scaleY');
        },
        toObject: function (t) {
          return this.callSuper('toObject', ['rx', 'ry'].concat(t));
        },
        _toSVG: function () {
          return [
            '<ellipse ',
            'COMMON_PARTS',
            'cx="0" cy="0" ',
            'rx="',
            this.rx,
            '" ry="',
            this.ry,
            '" />\n'
          ];
        },
        _render: function (t) {
          t.beginPath(),
            t.save(),
            t.transform(1, 0, 0, this.ry / this.rx, 0, 0),
            t.arc(0, 0, this.rx, 0, i, !1),
            t.restore(),
            this._renderPaintInOrder(t);
        }
      })),
      (e.Ellipse.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
        'cx cy rx ry'.split(' ')
      )),
      (e.Ellipse.fromElement = function (t, i) {
        var r = e.parseAttributes(t, e.Ellipse.ATTRIBUTE_NAMES);
        (r.left = (r.left || 0) - r.rx),
          (r.top = (r.top || 0) - r.ry),
          i(new e.Ellipse(r));
      }),
      void (e.Ellipse.fromObject = function (t, i) {
        e.Object._fromObject('Ellipse', t, i);
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.object.extend;
  return e.Rect
    ? void e.warn('fabric.Rect is already defined')
    : ((e.Rect = e.util.createClass(e.Object, {
        stateProperties: e.Object.prototype.stateProperties.concat('rx', 'ry'),
        type: 'rect',
        rx: 0,
        ry: 0,
        cacheProperties: e.Object.prototype.cacheProperties.concat('rx', 'ry'),
        initialize: function (t) {
          this.callSuper('initialize', t), this._initRxRy();
        },
        _initRxRy: function () {
          this.rx && !this.ry
            ? (this.ry = this.rx)
            : this.ry && !this.rx && (this.rx = this.ry);
        },
        _render: function (t) {
          var e = this.rx ? Math.min(this.rx, this.width / 2) : 0,
            i = this.ry ? Math.min(this.ry, this.height / 2) : 0,
            r = this.width,
            n = this.height,
            s = -this.width / 2,
            o = -this.height / 2,
            a = 0 !== e || 0 !== i,
            c = 0.4477152502;
          t.beginPath(),
            t.moveTo(s + e, o),
            t.lineTo(s + r - e, o),
            a &&
              t.bezierCurveTo(s + r - c * e, o, s + r, o + c * i, s + r, o + i),
            t.lineTo(s + r, o + n - i),
            a &&
              t.bezierCurveTo(
                s + r,
                o + n - c * i,
                s + r - c * e,
                o + n,
                s + r - e,
                o + n
              ),
            t.lineTo(s + e, o + n),
            a &&
              t.bezierCurveTo(s + c * e, o + n, s, o + n - c * i, s, o + n - i),
            t.lineTo(s, o + i),
            a && t.bezierCurveTo(s, o + c * i, s + c * e, o, s + e, o),
            t.closePath(),
            this._renderPaintInOrder(t);
        },
        toObject: function (t) {
          return this.callSuper('toObject', ['rx', 'ry'].concat(t));
        },
        _toSVG: function () {
          var t = -this.width / 2,
            e = -this.height / 2;
          return [
            '<rect ',
            'COMMON_PARTS',
            'x="',
            t,
            '" y="',
            e,
            '" rx="',
            this.rx,
            '" ry="',
            this.ry,
            '" width="',
            this.width,
            '" height="',
            this.height,
            '" />\n'
          ];
        }
      })),
      (e.Rect.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
        'x y rx ry width height'.split(' ')
      )),
      (e.Rect.fromElement = function (t, r, n) {
        if (!t) return r(null);
        n = n || {};
        var s = e.parseAttributes(t, e.Rect.ATTRIBUTE_NAMES);
        (s.left = s.left || 0),
          (s.top = s.top || 0),
          (s.height = s.height || 0),
          (s.width = s.width || 0);
        var o = new e.Rect(i(n ? e.util.object.clone(n) : {}, s));
        (o.visible = o.visible && o.width > 0 && o.height > 0), r(o);
      }),
      void (e.Rect.fromObject = function (t, i) {
        return e.Object._fromObject('Rect', t, i);
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.object.extend,
    r = e.util.array.min,
    n = e.util.array.max,
    s = e.util.toFixed,
    o = e.util.projectStrokeOnPoints;
  return e.Polyline
    ? void e.warn('fabric.Polyline is already defined')
    : ((e.Polyline = e.util.createClass(e.Object, {
        type: 'polyline',
        points: null,
        exactBoundingBox: !1,
        cacheProperties: e.Object.prototype.cacheProperties.concat('points'),
        initialize: function (t, e) {
          (e = e || {}),
            (this.points = t || []),
            this.callSuper('initialize', e),
            this._setPositionDimensions(e);
        },
        _projectStrokeOnPoints: function () {
          return o(this.points, this, !0);
        },
        _setPositionDimensions: function (t) {
          var e,
            i = this._calcDimensions(t),
            r = this.exactBoundingBox ? this.strokeWidth : 0;
          (this.width = i.width - r),
            (this.height = i.height - r),
            t.fromSVG ||
              (e = this.translateToGivenOrigin(
                {
                  x: i.left - this.strokeWidth / 2 + r / 2,
                  y: i.top - this.strokeWidth / 2 + r / 2
                },
                'left',
                'top',
                this.originX,
                this.originY
              )),
            'undefined' == typeof t.left &&
              (this.left = t.fromSVG ? i.left : e.x),
            'undefined' == typeof t.top && (this.top = t.fromSVG ? i.top : e.y),
            (this.pathOffset = {
              x: i.left + this.width / 2 + r / 2,
              y: i.top + this.height / 2 + r / 2
            });
        },
        _calcDimensions: function () {
          var t = this.exactBoundingBox
              ? this._projectStrokeOnPoints()
              : this.points,
            e = r(t, 'x') || 0,
            i = r(t, 'y') || 0,
            s = n(t, 'x') || 0,
            o = n(t, 'y') || 0,
            a = s - e,
            c = o - i;
          return { left: e, top: i, width: a, height: c };
        },
        toObject: function (t) {
          return i(this.callSuper('toObject', t), {
            points: this.points.concat()
          });
        },
        _toSVG: function () {
          for (
            var t = [],
              i = this.pathOffset.x,
              r = this.pathOffset.y,
              n = e.Object.NUM_FRACTION_DIGITS,
              o = 0,
              a = this.points.length;
            a > o;
            o++
          )
            t.push(
              s(this.points[o].x - i, n),
              ',',
              s(this.points[o].y - r, n),
              ' '
            );
          return [
            '<' + this.type + ' ',
            'COMMON_PARTS',
            'points="',
            t.join(''),
            '" />\n'
          ];
        },
        commonRender: function (t) {
          var e,
            i = this.points.length,
            r = this.pathOffset.x,
            n = this.pathOffset.y;
          if (!i || isNaN(this.points[i - 1].y)) return !1;
          t.beginPath(), t.moveTo(this.points[0].x - r, this.points[0].y - n);
          for (var s = 0; i > s; s++)
            (e = this.points[s]), t.lineTo(e.x - r, e.y - n);
          return !0;
        },
        _render: function (t) {
          this.commonRender(t) && this._renderPaintInOrder(t);
        },
        complexity: function () {
          return this.get('points').length;
        }
      })),
      (e.Polyline.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat()),
      (e.Polyline.fromElementGenerator = function (t) {
        return function (r, n, s) {
          if (!r) return n(null);
          s || (s = {});
          var o = e.parsePointsAttribute(r.getAttribute('points')),
            a = e.parseAttributes(r, e[t].ATTRIBUTE_NAMES);
          (a.fromSVG = !0), n(new e[t](o, i(a, s)));
        };
      }),
      (e.Polyline.fromElement = e.Polyline.fromElementGenerator('Polyline')),
      void (e.Polyline.fromObject = function (t, i) {
        return e.Object._fromObject('Polyline', t, i, 'points');
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.projectStrokeOnPoints;
  return e.Polygon
    ? void e.warn('fabric.Polygon is already defined')
    : ((e.Polygon = e.util.createClass(e.Polyline, {
        type: 'polygon',
        _projectStrokeOnPoints: function () {
          return i(this.points, this);
        },
        _render: function (t) {
          this.commonRender(t) && (t.closePath(), this._renderPaintInOrder(t));
        }
      })),
      (e.Polygon.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat()),
      (e.Polygon.fromElement = e.Polyline.fromElementGenerator('Polygon')),
      void (e.Polygon.fromObject = function (t, i) {
        e.Object._fromObject('Polygon', t, i, 'points');
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.array.min,
    r = e.util.array.max,
    n = e.util.object.extend,
    s = e.util.object.clone,
    o = e.util.toFixed;
  return e.Path
    ? void e.warn('fabric.Path is already defined')
    : ((e.Path = e.util.createClass(e.Object, {
        type: 'path',
        path: null,
        cacheProperties: e.Object.prototype.cacheProperties.concat(
          'path',
          'fillRule'
        ),
        stateProperties: e.Object.prototype.stateProperties.concat('path'),
        initialize: function (t, e) {
          (e = s(e || {})),
            delete e.path,
            this.callSuper('initialize', e),
            this._setPath(t || [], e);
        },
        _setPath: function (t, i) {
          (this.path = e.util.makePathSimpler(
            Array.isArray(t) ? t : e.util.parsePath(t)
          )),
            e.Polyline.prototype._setPositionDimensions.call(this, i || {});
        },
        _renderPathCommands: function (t) {
          var e,
            i = 0,
            r = 0,
            n = 0,
            s = 0,
            o = 0,
            a = 0,
            c = -this.pathOffset.x,
            h = -this.pathOffset.y;
          t.beginPath();
          for (var l = 0, u = this.path.length; u > l; ++l)
            switch (((e = this.path[l]), e[0])) {
              case 'L':
                (n = e[1]), (s = e[2]), t.lineTo(n + c, s + h);
                break;
              case 'M':
                (n = e[1]),
                  (s = e[2]),
                  (i = n),
                  (r = s),
                  t.moveTo(n + c, s + h);
                break;
              case 'C':
                (n = e[5]),
                  (s = e[6]),
                  (o = e[3]),
                  (a = e[4]),
                  t.bezierCurveTo(
                    e[1] + c,
                    e[2] + h,
                    o + c,
                    a + h,
                    n + c,
                    s + h
                  );
                break;
              case 'Q':
                t.quadraticCurveTo(e[1] + c, e[2] + h, e[3] + c, e[4] + h),
                  (n = e[3]),
                  (s = e[4]),
                  (o = e[1]),
                  (a = e[2]);
                break;
              case 'z':
              case 'Z':
                (n = i), (s = r), t.closePath();
            }
        },
        _render: function (t) {
          this._renderPathCommands(t), this._renderPaintInOrder(t);
        },
        toString: function () {
          return (
            '#<fabric.Path (' +
            this.complexity() +
            '): { "top": ' +
            this.top +
            ', "left": ' +
            this.left +
            ' }>'
          );
        },
        toObject: function (t) {
          return n(this.callSuper('toObject', t), {
            path: this.path.map(function (t) {
              return t.slice();
            })
          });
        },
        toDatalessObject: function (t) {
          var e = this.toObject(['sourcePath'].concat(t));
          return e.sourcePath && delete e.path, e;
        },
        _toSVG: function () {
          var t = e.util.joinPath(this.path);
          return [
            '<path ',
            'COMMON_PARTS',
            'd="',
            t,
            '" stroke-linecap="round" ',
            '/>\n'
          ];
        },
        _getOffsetTransform: function () {
          var t = e.Object.NUM_FRACTION_DIGITS;
          return (
            ' translate(' +
            o(-this.pathOffset.x, t) +
            ', ' +
            o(-this.pathOffset.y, t) +
            ')'
          );
        },
        toClipPathSVG: function (t) {
          var e = this._getOffsetTransform();
          return (
            '	' +
            this._createBaseClipPathSVGMarkup(this._toSVG(), {
              reviver: t,
              additionalTransform: e
            })
          );
        },
        toSVG: function (t) {
          var e = this._getOffsetTransform();
          return this._createBaseSVGMarkup(this._toSVG(), {
            reviver: t,
            additionalTransform: e
          });
        },
        complexity: function () {
          return this.path.length;
        },
        _calcDimensions: function () {
          for (
            var t,
              n,
              s = [],
              o = [],
              a = 0,
              c = 0,
              h = 0,
              l = 0,
              u = 0,
              f = this.path.length;
            f > u;
            ++u
          ) {
            switch (((t = this.path[u]), t[0])) {
              case 'L':
                (h = t[1]), (l = t[2]), (n = []);
                break;
              case 'M':
                (h = t[1]), (l = t[2]), (a = h), (c = l), (n = []);
                break;
              case 'C':
                (n = e.util.getBoundsOfCurve(
                  h,
                  l,
                  t[1],
                  t[2],
                  t[3],
                  t[4],
                  t[5],
                  t[6]
                )),
                  (h = t[5]),
                  (l = t[6]);
                break;
              case 'Q':
                (n = e.util.getBoundsOfCurve(
                  h,
                  l,
                  t[1],
                  t[2],
                  t[1],
                  t[2],
                  t[3],
                  t[4]
                )),
                  (h = t[3]),
                  (l = t[4]);
                break;
              case 'z':
              case 'Z':
                (h = a), (l = c);
            }
            n.forEach(function (t) {
              s.push(t.x), o.push(t.y);
            }),
              s.push(h),
              o.push(l);
          }
          var d = i(s) || 0,
            g = i(o) || 0,
            p = r(s) || 0,
            v = r(o) || 0,
            b = p - d,
            m = v - g;
          return { left: d, top: g, width: b, height: m };
        }
      })),
      (e.Path.fromObject = function (t, i) {
        if ('string' == typeof t.sourcePath) {
          var r = t.sourcePath;
          e.loadSVGFromURL(r, function (e) {
            var r = e[0];
            r.setOptions(t), i && i(r);
          });
        } else e.Object._fromObject('Path', t, i, 'path');
      }),
      (e.Path.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(['d'])),
      void (e.Path.fromElement = function (t, i, r) {
        var s = e.parseAttributes(t, e.Path.ATTRIBUTE_NAMES);
        (s.fromSVG = !0), i(new e.Path(s.d, n(s, r)));
      }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.array.min,
    r = e.util.array.max;
  e.Group ||
    ((e.Group = e.util.createClass(e.Object, e.Collection, {
      type: 'group',
      strokeWidth: 0,
      subTargetCheck: !1,
      cacheProperties: [],
      useSetOnGroup: !1,
      initialize: function (t, e, i) {
        (e = e || {}),
          (this._objects = []),
          i && this.callSuper('initialize', e),
          (this._objects = t || []);
        for (var r = this._objects.length; r--; ) this._objects[r].group = this;
        if (i) this._updateObjectsACoords();
        else {
          var n = e && e.centerPoint;
          void 0 !== e.originX && (this.originX = e.originX),
            void 0 !== e.originY && (this.originY = e.originY),
            n || this._calcBounds(),
            this._updateObjectsCoords(n),
            delete e.centerPoint,
            this.callSuper('initialize', e);
        }
        this.setCoords();
      },
      _updateObjectsACoords: function () {
        for (var t = !0, e = this._objects.length; e--; )
          this._objects[e].setCoords(t);
      },
      _updateObjectsCoords: function (t) {
        for (
          var t = t || this.getCenterPoint(), e = this._objects.length;
          e--;

        )
          this._updateObjectCoords(this._objects[e], t);
      },
      _updateObjectCoords: function (t, e) {
        var i = t.left,
          r = t.top,
          n = !0;
        t.set({ left: i - e.x, top: r - e.y }),
          (t.group = this),
          t.setCoords(n);
      },
      toString: function () {
        return '#<fabric.Group: (' + this.complexity() + ')>';
      },
      addWithUpdate: function (t) {
        var i = !!this.group;
        return (
          this._restoreObjectsState(),
          e.util.resetObjectTransform(this),
          t &&
            (i &&
              e.util.removeTransformFromObject(
                t,
                this.group.calcTransformMatrix()
              ),
            this._objects.push(t),
            (t.group = this),
            t._set('canvas', this.canvas)),
          this._calcBounds(),
          this._updateObjectsCoords(),
          (this.dirty = !0),
          i ? this.group.addWithUpdate() : this.setCoords(),
          this
        );
      },
      removeWithUpdate: function (t) {
        return (
          this._restoreObjectsState(),
          e.util.resetObjectTransform(this),
          this.remove(t),
          this._calcBounds(),
          this._updateObjectsCoords(),
          this.setCoords(),
          (this.dirty = !0),
          this
        );
      },
      _onObjectAdded: function (t) {
        (this.dirty = !0), (t.group = this), t._set('canvas', this.canvas);
      },
      _onObjectRemoved: function (t) {
        (this.dirty = !0), delete t.group;
      },
      _set: function (t, i) {
        var r = this._objects.length;
        if (this.useSetOnGroup) for (; r--; ) this._objects[r].setOnGroup(t, i);
        if ('canvas' === t) for (; r--; ) this._objects[r]._set(t, i);
        e.Object.prototype._set.call(this, t, i);
      },
      toObject: function (t) {
        var i = this.includeDefaultValues,
          r = this._objects
            .filter(function (t) {
              return !t.excludeFromExport;
            })
            .map(function (e) {
              var r = e.includeDefaultValues;
              e.includeDefaultValues = i;
              var n = e.toObject(t);
              return (e.includeDefaultValues = r), n;
            }),
          n = e.Object.prototype.toObject.call(this, t);
        return (n.objects = r), n;
      },
      toDatalessObject: function (t) {
        var i,
          r = this.sourcePath;
        if (r) i = r;
        else {
          var n = this.includeDefaultValues;
          i = this._objects.map(function (e) {
            var i = e.includeDefaultValues;
            e.includeDefaultValues = n;
            var r = e.toDatalessObject(t);
            return (e.includeDefaultValues = i), r;
          });
        }
        var s = e.Object.prototype.toDatalessObject.call(this, t);
        return (s.objects = i), s;
      },
      render: function (t) {
        (this._transformDone = !0),
          this.callSuper('render', t),
          (this._transformDone = !1);
      },
      shouldCache: function () {
        var t = e.Object.prototype.shouldCache.call(this);
        if (t)
          for (var i = 0, r = this._objects.length; r > i; i++)
            if (this._objects[i].willDrawShadow())
              return (this.ownCaching = !1), !1;
        return t;
      },
      willDrawShadow: function () {
        if (e.Object.prototype.willDrawShadow.call(this)) return !0;
        for (var t = 0, i = this._objects.length; i > t; t++)
          if (this._objects[t].willDrawShadow()) return !0;
        return !1;
      },
      isOnACache: function () {
        return this.ownCaching || (this.group && this.group.isOnACache());
      },
      drawObject: function (t) {
        for (var e = 0, i = this._objects.length; i > e; e++)
          this._objects[e].render(t);
        this._drawClipPath(t, this.clipPath);
      },
      isCacheDirty: function (t) {
        if (this.callSuper('isCacheDirty', t)) return !0;
        if (!this.statefullCache) return !1;
        for (var e = 0, i = this._objects.length; i > e; e++)
          if (this._objects[e].isCacheDirty(!0)) {
            if (this._cacheCanvas) {
              var r = this.cacheWidth / this.zoomX,
                n = this.cacheHeight / this.zoomY;
              this._cacheContext.clearRect(-r / 2, -n / 2, r, n);
            }
            return !0;
          }
        return !1;
      },
      _restoreObjectsState: function () {
        var t = this.calcOwnMatrix();
        return (
          this._objects.forEach(function (i) {
            e.util.addTransformToObject(i, t), delete i.group, i.setCoords();
          }),
          this
        );
      },
      destroy: function () {
        return (
          this._objects.forEach(function (t) {
            t.set('dirty', !0);
          }),
          this._restoreObjectsState()
        );
      },
      dispose: function () {
        this.callSuper('dispose'),
          this.forEachObject(function (t) {
            t.dispose && t.dispose();
          }),
          (this._objects = []);
      },
      toActiveSelection: function () {
        if (this.canvas) {
          var t = this._objects,
            i = this.canvas;
          this._objects = [];
          var r = this.toObject();
          delete r.objects;
          var n = new e.ActiveSelection([]);
          return (
            n.set(r),
            (n.type = 'activeSelection'),
            i.remove(this),
            t.forEach(function (t) {
              (t.group = n), (t.dirty = !0), i.add(t);
            }),
            (n.canvas = i),
            (n._objects = t),
            (i._activeObject = n),
            n.setCoords(),
            n
          );
        }
      },
      ungroupOnCanvas: function () {
        return this._restoreObjectsState();
      },
      setObjectsCoords: function () {
        var t = !0;
        return (
          this.forEachObject(function (e) {
            e.setCoords(t);
          }),
          this
        );
      },
      _calcBounds: function (t) {
        for (
          var e,
            i,
            r,
            n,
            s = [],
            o = [],
            a = ['tr', 'br', 'bl', 'tl'],
            c = 0,
            h = this._objects.length,
            l = a.length;
          h > c;
          ++c
        ) {
          for (e = this._objects[c], r = e.calcACoords(), n = 0; l > n; n++)
            (i = a[n]), s.push(r[i].x), o.push(r[i].y);
          e.aCoords = r;
        }
        this._getBounds(s, o, t);
      },
      _getBounds: function (t, n, s) {
        var o = new e.Point(i(t), i(n)),
          a = new e.Point(r(t), r(n)),
          c = o.y || 0,
          h = o.x || 0,
          l = a.x - o.x || 0,
          u = a.y - o.y || 0;
        (this.width = l),
          (this.height = u),
          s || this.setPositionByOrigin({ x: h, y: c }, 'left', 'top');
      },
      _toSVG: function (t) {
        for (
          var e = ['<g ', 'COMMON_PARTS', ' >\n'],
            i = 0,
            r = this._objects.length;
          r > i;
          i++
        )
          e.push('		', this._objects[i].toSVG(t));
        return e.push('</g>\n'), e;
      },
      getSvgStyles: function () {
        var t =
            'undefined' != typeof this.opacity && 1 !== this.opacity
              ? 'opacity: ' + this.opacity + ';'
              : '',
          e = this.visible ? '' : ' visibility: hidden;';
        return [t, this.getSvgFilter(), e].join('');
      },
      toClipPathSVG: function (t) {
        for (var e = [], i = 0, r = this._objects.length; r > i; i++)
          e.push('	', this._objects[i].toClipPathSVG(t));
        return this._createBaseClipPathSVGMarkup(e, { reviver: t });
      }
    })),
    (e.Group.fromObject = function (t, i) {
      var r = t.objects,
        n = e.util.object.clone(t, !0);
      return (
        delete n.objects,
        'string' == typeof r
          ? void e.loadSVGFromURL(r, function (s) {
              var o = e.util.groupSVGElements(s, t, r);
              o.set(n), i && i(o);
            })
          : void e.util.enlivenObjects(r, function (r) {
              var n = e.util.object.clone(t, !0);
              delete n.objects,
                e.util.enlivenObjectEnlivables(t, n, function () {
                  i && i(new e.Group(r, n, !0));
                });
            })
      );
    }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {});
  e.ActiveSelection ||
    ((e.ActiveSelection = e.util.createClass(e.Group, {
      type: 'activeSelection',
      initialize: function (t, i) {
        (i = i || {}), (this._objects = t || []);
        for (var r = this._objects.length; r--; ) this._objects[r].group = this;
        i.originX && (this.originX = i.originX),
          i.originY && (this.originY = i.originY),
          this._calcBounds(),
          this._updateObjectsCoords(),
          e.Object.prototype.initialize.call(this, i),
          this.setCoords();
      },
      toGroup: function () {
        var t = this._objects.concat();
        this._objects = [];
        var i = e.Object.prototype.toObject.call(this),
          r = new e.Group([]);
        if (
          (delete i.type,
          r.set(i),
          t.forEach(function (t) {
            t.canvas.remove(t), (t.group = r);
          }),
          (r._objects = t),
          !this.canvas)
        )
          return r;
        var n = this.canvas;
        return n.add(r), (n._activeObject = r), r.setCoords(), r;
      },
      onDeselect: function () {
        return this.destroy(), !1;
      },
      toString: function () {
        return '#<fabric.ActiveSelection: (' + this.complexity() + ')>';
      },
      shouldCache: function () {
        return !1;
      },
      isOnACache: function () {
        return !1;
      },
      _renderControls: function (t, e, i) {
        t.save(),
          (t.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1),
          this.callSuper('_renderControls', t, e),
          (i = i || {}),
          'undefined' == typeof i.hasControls && (i.hasControls = !1),
          (i.forActiveSelection = !0);
        for (var r = 0, n = this._objects.length; n > r; r++)
          this._objects[r]._renderControls(t, i);
        t.restore();
      }
    })),
    (e.ActiveSelection.fromObject = function (t, i) {
      e.util.enlivenObjects(t.objects, function (r) {
        delete t.objects, i && i(new e.ActiveSelection(r, t, !0));
      });
    }));
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = fabric.util.object.extend;
  return (
    t.fabric || (t.fabric = {}),
    t.fabric.Image
      ? void fabric.warn('fabric.Image is already defined.')
      : ((fabric.Image = fabric.util.createClass(fabric.Object, {
          type: 'image',
          strokeWidth: 0,
          srcFromAttribute: !1,
          _lastScaleX: 1,
          _lastScaleY: 1,
          _filterScalingX: 1,
          _filterScalingY: 1,
          minimumScaleTrigger: 0.5,
          stateProperties: fabric.Object.prototype.stateProperties.concat(
            'cropX',
            'cropY'
          ),
          cacheProperties: fabric.Object.prototype.cacheProperties.concat(
            'cropX',
            'cropY'
          ),
          cacheKey: '',
          cropX: 0,
          cropY: 0,
          imageSmoothing: !0,
          initialize: function (t, e) {
            e || (e = {}),
              (this.filters = []),
              (this.cacheKey = 'texture' + fabric.Object.__uid++),
              this.callSuper('initialize', e),
              this._initElement(t, e);
          },
          getElement: function () {
            return this._element || {};
          },
          setElement: function (t, e) {
            return (
              this.removeTexture(this.cacheKey),
              this.removeTexture(this.cacheKey + '_filtered'),
              (this._element = t),
              (this._originalElement = t),
              this._initConfig(e),
              0 !== this.filters.length && this.applyFilters(),
              this.resizeFilter && this.applyResizeFilters(),
              this
            );
          },
          removeTexture: function (t) {
            var e = fabric.filterBackend;
            e && e.evictCachesForKey && e.evictCachesForKey(t);
          },
          dispose: function () {
            this.callSuper('dispose'),
              this.removeTexture(this.cacheKey),
              this.removeTexture(this.cacheKey + '_filtered'),
              (this._cacheContext = void 0),
              [
                '_originalElement',
                '_element',
                '_filteredEl',
                '_cacheCanvas'
              ].forEach(
                function (t) {
                  fabric.util.cleanUpJsdomNode(this[t]), (this[t] = void 0);
                }.bind(this)
              );
          },
          getCrossOrigin: function () {
            return (
              this._originalElement &&
              (this._originalElement.crossOrigin || null)
            );
          },
          getOriginalSize: function () {
            var t = this.getElement();
            return {
              width: t.naturalWidth || t.width,
              height: t.naturalHeight || t.height
            };
          },
          _stroke: function (t) {
            if (this.stroke && 0 !== this.strokeWidth) {
              var e = this.width / 2,
                i = this.height / 2;
              t.beginPath(),
                t.moveTo(-e, -i),
                t.lineTo(e, -i),
                t.lineTo(e, i),
                t.lineTo(-e, i),
                t.lineTo(-e, -i),
                t.closePath();
            }
          },
          toObject: function (t) {
            var i = [];
            this.filters.forEach(function (t) {
              t && i.push(t.toObject());
            });
            var r = e(
              this.callSuper('toObject', ['cropX', 'cropY'].concat(t)),
              {
                src: this.getSrc(),
                crossOrigin: this.getCrossOrigin(),
                filters: i
              }
            );
            return (
              this.resizeFilter &&
                (r.resizeFilter = this.resizeFilter.toObject()),
              r
            );
          },
          hasCrop: function () {
            return (
              this.cropX ||
              this.cropY ||
              this.width < this._element.width ||
              this.height < this._element.height
            );
          },
          _toSVG: function () {
            var t,
              e = [],
              i = [],
              r = this._element,
              n = -this.width / 2,
              s = -this.height / 2,
              o = '',
              a = '';
            if (!r) return [];
            if (this.hasCrop()) {
              var c = fabric.Object.__uid++;
              e.push(
                '<clipPath id="imageCrop_' + c + '">\n',
                '	<rect x="' +
                  n +
                  '" y="' +
                  s +
                  '" width="' +
                  this.width +
                  '" height="' +
                  this.height +
                  '" />\n',
                '</clipPath>\n'
              ),
                (o = ' clip-path="url(#imageCrop_' + c + ')" ');
            }
            if (
              (this.imageSmoothing || (a = '" image-rendering="optimizeSpeed'),
              i.push(
                '	<image ',
                'COMMON_PARTS',
                'xlink:href="',
                this.getSvgSrc(!0),
                '" x="',
                n - this.cropX,
                '" y="',
                s - this.cropY,
                '" width="',
                r.width || r.naturalWidth,
                '" height="',
                r.height || r.height,
                a,
                '"',
                o,
                '></image>\n'
              ),
              this.stroke || this.strokeDashArray)
            ) {
              var h = this.fill;
              (this.fill = null),
                (t = [
                  '	<rect ',
                  'x="',
                  n,
                  '" y="',
                  s,
                  '" width="',
                  this.width,
                  '" height="',
                  this.height,
                  '" style="',
                  this.getSvgStyles(),
                  '"/>\n'
                ]),
                (this.fill = h);
            }
            return (e =
              'fill' !== this.paintFirst ? e.concat(t, i) : e.concat(i, t));
          },
          getSrc: function (t) {
            var e = t ? this._element : this._originalElement;
            return e
              ? e.toDataURL
                ? e.toDataURL()
                : this.srcFromAttribute
                ? e.getAttribute('src')
                : e.src
              : this.src || '';
          },
          setSrc: function (t, e, i) {
            return (
              fabric.util.loadImage(
                t,
                function (t, r) {
                  this.setElement(t, i),
                    this._setWidthHeight(),
                    e && e(this, r);
                },
                this,
                i && i.crossOrigin
              ),
              this
            );
          },
          toString: function () {
            return '#<fabric.Image: { src: "' + this.getSrc() + '" }>';
          },
          applyResizeFilters: function () {
            var t = this.resizeFilter,
              e = this.minimumScaleTrigger,
              i = this.getTotalObjectScaling(),
              r = i.scaleX,
              n = i.scaleY,
              s = this._filteredEl || this._originalElement;
            if ((this.group && this.set('dirty', !0), !t || (r > e && n > e)))
              return (
                (this._element = s),
                (this._filterScalingX = 1),
                (this._filterScalingY = 1),
                (this._lastScaleX = r),
                void (this._lastScaleY = n)
              );
            fabric.filterBackend ||
              (fabric.filterBackend = fabric.initFilterBackend());
            var o = fabric.util.createCanvasElement(),
              a = this._filteredEl
                ? this.cacheKey + '_filtered'
                : this.cacheKey,
              c = s.width,
              h = s.height;
            (o.width = c),
              (o.height = h),
              (this._element = o),
              (this._lastScaleX = t.scaleX = r),
              (this._lastScaleY = t.scaleY = n),
              fabric.filterBackend.applyFilters([t], s, c, h, this._element, a),
              (this._filterScalingX = o.width / this._originalElement.width),
              (this._filterScalingY = o.height / this._originalElement.height);
          },
          applyFilters: function (t) {
            if (
              ((t = t || this.filters || []),
              (t = t.filter(function (t) {
                return t && !t.isNeutralState();
              })),
              this.set('dirty', !0),
              this.removeTexture(this.cacheKey + '_filtered'),
              0 === t.length)
            )
              return (
                (this._element = this._originalElement),
                (this._filteredEl = null),
                (this._filterScalingX = 1),
                (this._filterScalingY = 1),
                this
              );
            var e = this._originalElement,
              i = e.naturalWidth || e.width,
              r = e.naturalHeight || e.height;
            if (this._element === this._originalElement) {
              var n = fabric.util.createCanvasElement();
              (n.width = i),
                (n.height = r),
                (this._element = n),
                (this._filteredEl = n);
            } else
              (this._element = this._filteredEl),
                this._filteredEl.getContext('2d').clearRect(0, 0, i, r),
                (this._lastScaleX = 1),
                (this._lastScaleY = 1);
            return (
              fabric.filterBackend ||
                (fabric.filterBackend = fabric.initFilterBackend()),
              fabric.filterBackend.applyFilters(
                t,
                this._originalElement,
                i,
                r,
                this._element,
                this.cacheKey
              ),
              (this._originalElement.width !== this._element.width ||
                this._originalElement.height !== this._element.height) &&
                ((this._filterScalingX =
                  this._element.width / this._originalElement.width),
                (this._filterScalingY =
                  this._element.height / this._originalElement.height)),
              this
            );
          },
          _render: function (t) {
            fabric.util.setImageSmoothing(t, this.imageSmoothing),
              this.isMoving !== !0 &&
                this.resizeFilter &&
                this._needsResize() &&
                this.applyResizeFilters(),
              this._stroke(t),
              this._renderPaintInOrder(t);
          },
          drawCacheOnCanvas: function (t) {
            fabric.util.setImageSmoothing(t, this.imageSmoothing),
              fabric.Object.prototype.drawCacheOnCanvas.call(this, t);
          },
          shouldCache: function () {
            return this.needsItsOwnCache();
          },
          _renderFill: function (t) {
            var e = this._element;
            if (e) {
              var i = this._filterScalingX,
                r = this._filterScalingY,
                n = this.width,
                s = this.height,
                o = Math.min,
                a = Math.max,
                c = a(this.cropX, 0),
                h = a(this.cropY, 0),
                l = e.naturalWidth || e.width,
                u = e.naturalHeight || e.height,
                f = c * i,
                d = h * r,
                g = o(n * i, l - f),
                p = o(s * r, u - d),
                v = -n / 2,
                b = -s / 2,
                m = o(n, l / i - c),
                y = o(s, u / r - h);
              e && t.drawImage(e, f, d, g, p, v, b, m, y);
            }
          },
          _needsResize: function () {
            var t = this.getTotalObjectScaling();
            return (
              t.scaleX !== this._lastScaleX || t.scaleY !== this._lastScaleY
            );
          },
          _resetWidthHeight: function () {
            this.set(this.getOriginalSize());
          },
          _initElement: function (t, e) {
            this.setElement(fabric.util.getById(t), e),
              fabric.util.addClass(this.getElement(), fabric.Image.CSS_CANVAS);
          },
          _initConfig: function (t) {
            t || (t = {}), this.setOptions(t), this._setWidthHeight(t);
          },
          _initFilters: function (t, e) {
            t && t.length
              ? fabric.util.enlivenObjects(
                  t,
                  function (t) {
                    e && e(t);
                  },
                  'fabric.Image.filters'
                )
              : e && e();
          },
          _setWidthHeight: function (t) {
            t || (t = {});
            var e = this.getElement();
            (this.width = t.width || e.naturalWidth || e.width || 0),
              (this.height = t.height || e.naturalHeight || e.height || 0);
          },
          parsePreserveAspectRatioAttribute: function () {
            var t,
              e = fabric.util.parsePreserveAspectRatioAttribute(
                this.preserveAspectRatio || ''
              ),
              i = this._element.width,
              r = this._element.height,
              n = 1,
              s = 1,
              o = 0,
              a = 0,
              c = 0,
              h = 0,
              l = this.width,
              u = this.height,
              f = { width: l, height: u };
            return (
              !e || ('none' === e.alignX && 'none' === e.alignY)
                ? ((n = l / i), (s = u / r))
                : ('meet' === e.meetOrSlice &&
                    ((n = s = fabric.util.findScaleToFit(this._element, f)),
                    (t = (l - i * n) / 2),
                    'Min' === e.alignX && (o = -t),
                    'Max' === e.alignX && (o = t),
                    (t = (u - r * s) / 2),
                    'Min' === e.alignY && (a = -t),
                    'Max' === e.alignY && (a = t)),
                  'slice' === e.meetOrSlice &&
                    ((n = s = fabric.util.findScaleToCover(this._element, f)),
                    (t = i - l / n),
                    'Mid' === e.alignX && (c = t / 2),
                    'Max' === e.alignX && (c = t),
                    (t = r - u / s),
                    'Mid' === e.alignY && (h = t / 2),
                    'Max' === e.alignY && (h = t),
                    (i = l / n),
                    (r = u / s))),
              {
                width: i,
                height: r,
                scaleX: n,
                scaleY: s,
                offsetLeft: o,
                offsetTop: a,
                cropX: c,
                cropY: h
              }
            );
          }
        })),
        (fabric.Image.CSS_CANVAS = 'canvas-img'),
        (fabric.Image.prototype.getSvgSrc = fabric.Image.prototype.getSrc),
        (fabric.Image.fromObject = function (t, e) {
          var i = fabric.util.object.clone(t);
          fabric.util.loadImage(
            i.src,
            function (t, r) {
              return r
                ? void (e && e(null, !0))
                : void fabric.Image.prototype._initFilters.call(
                    i,
                    i.filters,
                    function (r) {
                      (i.filters = r || []),
                        fabric.Image.prototype._initFilters.call(
                          i,
                          [i.resizeFilter],
                          function (r) {
                            (i.resizeFilter = r[0]),
                              fabric.util.enlivenObjectEnlivables(
                                i,
                                i,
                                function () {
                                  var r = new fabric.Image(t, i);
                                  e(r, !1);
                                }
                              );
                          }
                        );
                    }
                  );
            },
            null,
            i.crossOrigin
          );
        }),
        (fabric.Image.fromURL = function (t, e, i) {
          fabric.util.loadImage(
            t,
            function (t, r) {
              e && e(new fabric.Image(t, i), r);
            },
            null,
            i && i.crossOrigin
          );
        }),
        (fabric.Image.ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat(
          'x y width height preserveAspectRatio xlink:href crossOrigin image-rendering'.split(
            ' '
          )
        )),
        void (fabric.Image.fromElement = function (t, i, r) {
          var n = fabric.parseAttributes(t, fabric.Image.ATTRIBUTE_NAMES);
          fabric.Image.fromURL(
            n['xlink:href'],
            i,
            e(r ? fabric.util.object.clone(r) : {}, n)
          );
        }))
  );
})('undefined' != typeof exports ? exports : this);
fabric.util.object.extend(fabric.Object.prototype, {
  _getAngleValueForStraighten: function () {
    var t = this.angle % 360;
    return t > 0 ? 90 * Math.round((t - 1) / 90) : 90 * Math.round(t / 90);
  },
  straighten: function () {
    return this.rotate(this._getAngleValueForStraighten());
  },
  fxStraighten: function (t) {
    t = t || {};
    var e = function () {},
      i = t.onComplete || e,
      r = t.onChange || e,
      n = this;
    return fabric.util.animate({
      target: this,
      startValue: this.get('angle'),
      endValue: this._getAngleValueForStraighten(),
      duration: this.FX_DURATION,
      onChange: function (t) {
        n.rotate(t), r();
      },
      onComplete: function () {
        n.setCoords(), i();
      }
    });
  }
}),
  fabric.util.object.extend(fabric.StaticCanvas.prototype, {
    straightenObject: function (t) {
      return t.straighten(), this.requestRenderAll(), this;
    },
    fxStraightenObject: function (t) {
      return t.fxStraighten({ onChange: this.requestRenderAllBound });
    }
  });
function resizeCanvasIfNeeded(t) {
  var e = t.targetCanvas,
    i = e.width,
    r = e.height,
    n = t.destinationWidth,
    s = t.destinationHeight;
  (i !== n || r !== s) && ((e.width = n), (e.height = s));
}
function copyGLTo2DDrawImage(t, e) {
  var i = t.canvas,
    r = e.targetCanvas,
    n = r.getContext('2d');
  n.translate(0, r.height), n.scale(1, -1);
  var s = i.height - r.height;
  n.drawImage(i, 0, s, r.width, r.height, 0, 0, r.width, r.height);
}
function copyGLTo2DPutImageData(t, e) {
  var i = e.targetCanvas,
    r = i.getContext('2d'),
    n = e.destinationWidth,
    s = e.destinationHeight,
    o = n * s * 4,
    a = new Uint8Array(this.imageBuffer, 0, o),
    c = new Uint8ClampedArray(this.imageBuffer, 0, o);
  t.readPixels(0, 0, n, s, t.RGBA, t.UNSIGNED_BYTE, a);
  var h = new ImageData(c, n, s);
  r.putImageData(h, 0, 0);
}
!(function () {
  'use strict';
  function t(t, e) {
    var i = 'precision ' + e + ' float;\nvoid main(){}',
      r = t.createShader(t.FRAGMENT_SHADER);
    return (
      t.shaderSource(r, i),
      t.compileShader(r),
      t.getShaderParameter(r, t.COMPILE_STATUS) ? !0 : !1
    );
  }
  function e(t) {
    t && t.tileSize && (this.tileSize = t.tileSize),
      this.setupGLContext(this.tileSize, this.tileSize),
      this.captureGPUInfo();
  }
  (fabric.isWebglSupported = function (e) {
    if (fabric.isLikelyNode) return !1;
    e = e || fabric.WebglFilterBackend.prototype.tileSize;
    var i = document.createElement('canvas'),
      r = i.getContext('webgl') || i.getContext('experimental-webgl'),
      n = !1;
    if (r) {
      (fabric.maxTextureSize = r.getParameter(r.MAX_TEXTURE_SIZE)),
        (n = fabric.maxTextureSize >= e);
      for (var s = ['highp', 'mediump', 'lowp'], o = 0; 3 > o; o++)
        if (t(r, s[o])) {
          fabric.webGlPrecision = s[o];
          break;
        }
    }
    return (this.isSupported = n), n;
  }),
    (fabric.WebglFilterBackend = e),
    (e.prototype = {
      tileSize: 2048,
      resources: {},
      setupGLContext: function (t, e) {
        this.dispose(),
          this.createWebGLCanvas(t, e),
          (this.aPosition = new Float32Array([0, 0, 0, 1, 1, 0, 1, 1])),
          this.chooseFastestCopyGLTo2DMethod(t, e);
      },
      chooseFastestCopyGLTo2DMethod: function (t, e) {
        var i,
          r = 'undefined' != typeof window.performance;
        try {
          new ImageData(1, 1), (i = !0);
        } catch (n) {
          i = !1;
        }
        var s = 'undefined' != typeof ArrayBuffer,
          o = 'undefined' != typeof Uint8ClampedArray;
        if (r && i && s && o) {
          var a = fabric.util.createCanvasElement(),
            c = new ArrayBuffer(t * e * 4);
          if (fabric.forceGLPutImageData)
            return (
              (this.imageBuffer = c),
              void (this.copyGLTo2D = copyGLTo2DPutImageData)
            );
          var h,
            l,
            u,
            f = {
              imageBuffer: c,
              destinationWidth: t,
              destinationHeight: e,
              targetCanvas: a
            };
          (a.width = t),
            (a.height = e),
            (h = window.performance.now()),
            copyGLTo2DDrawImage.call(f, this.gl, f),
            (l = window.performance.now() - h),
            (h = window.performance.now()),
            copyGLTo2DPutImageData.call(f, this.gl, f),
            (u = window.performance.now() - h),
            l > u
              ? ((this.imageBuffer = c),
                (this.copyGLTo2D = copyGLTo2DPutImageData))
              : (this.copyGLTo2D = copyGLTo2DDrawImage);
        }
      },
      createWebGLCanvas: function (t, e) {
        var i = fabric.util.createCanvasElement();
        (i.width = t), (i.height = e);
        var r = {
            alpha: !0,
            premultipliedAlpha: !1,
            depth: !1,
            stencil: !1,
            antialias: !1
          },
          n = i.getContext('webgl', r);
        n || (n = i.getContext('experimental-webgl', r)),
          n && (n.clearColor(0, 0, 0, 0), (this.canvas = i), (this.gl = n));
      },
      applyFilters: function (t, e, i, r, n, s) {
        var o,
          a = this.gl;
        s && (o = this.getCachedTexture(s, e));
        var c = {
            originalWidth: e.width || e.originalWidth,
            originalHeight: e.height || e.originalHeight,
            sourceWidth: i,
            sourceHeight: r,
            destinationWidth: i,
            destinationHeight: r,
            context: a,
            sourceTexture: this.createTexture(a, i, r, !o && e),
            targetTexture: this.createTexture(a, i, r),
            originalTexture: o || this.createTexture(a, i, r, !o && e),
            passes: t.length,
            webgl: !0,
            aPosition: this.aPosition,
            programCache: this.programCache,
            pass: 0,
            filterBackend: this,
            targetCanvas: n
          },
          h = a.createFramebuffer();
        return (
          a.bindFramebuffer(a.FRAMEBUFFER, h),
          t.forEach(function (t) {
            t && t.applyTo(c);
          }),
          resizeCanvasIfNeeded(c),
          this.copyGLTo2D(a, c),
          a.bindTexture(a.TEXTURE_2D, null),
          a.deleteTexture(c.sourceTexture),
          a.deleteTexture(c.targetTexture),
          a.deleteFramebuffer(h),
          n.getContext('2d').setTransform(1, 0, 0, 1, 0, 0),
          c
        );
      },
      dispose: function () {
        this.canvas && ((this.canvas = null), (this.gl = null)),
          this.clearWebGLCaches();
      },
      clearWebGLCaches: function () {
        (this.programCache = {}), (this.textureCache = {});
      },
      createTexture: function (t, e, i, r) {
        var n = t.createTexture();
        return (
          t.bindTexture(t.TEXTURE_2D, n),
          t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST),
          t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST),
          t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE),
          t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE),
          r
            ? t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, r)
            : t.texImage2D(
                t.TEXTURE_2D,
                0,
                t.RGBA,
                e,
                i,
                0,
                t.RGBA,
                t.UNSIGNED_BYTE,
                null
              ),
          n
        );
      },
      getCachedTexture: function (t, e) {
        if (this.textureCache[t]) return this.textureCache[t];
        var i = this.createTexture(this.gl, e.width, e.height, e);
        return (this.textureCache[t] = i), i;
      },
      evictCachesForKey: function (t) {
        this.textureCache[t] &&
          (this.gl.deleteTexture(this.textureCache[t]),
          delete this.textureCache[t]);
      },
      copyGLTo2D: copyGLTo2DDrawImage,
      captureGPUInfo: function () {
        if (this.gpuInfo) return this.gpuInfo;
        var t = this.gl,
          e = { renderer: '', vendor: '' };
        if (!t) return e;
        var i = t.getExtension('WEBGL_debug_renderer_info');
        if (i) {
          var r = t.getParameter(i.UNMASKED_RENDERER_WEBGL),
            n = t.getParameter(i.UNMASKED_VENDOR_WEBGL);
          r && (e.renderer = r.toLowerCase()),
            n && (e.vendor = n.toLowerCase());
        }
        return (this.gpuInfo = e), e;
      }
    });
})();
!(function () {
  'use strict';
  function t() {}
  var e = function () {};
  (fabric.Canvas2dFilterBackend = t),
    (t.prototype = {
      evictCachesForKey: e,
      dispose: e,
      clearWebGLCaches: e,
      resources: {},
      applyFilters: function (t, e, i, r, n) {
        var s = n.getContext('2d');
        s.drawImage(e, 0, 0, i, r);
        var o = s.getImageData(0, 0, i, r),
          a = s.getImageData(0, 0, i, r),
          c = {
            sourceWidth: i,
            sourceHeight: r,
            imageData: o,
            originalEl: e,
            originalImageData: a,
            canvasEl: n,
            ctx: s,
            filterBackend: this
          };
        return (
          t.forEach(function (t) {
            t.applyTo(c);
          }),
          (c.imageData.width !== i || c.imageData.height !== r) &&
            ((n.width = c.imageData.width), (n.height = c.imageData.height)),
          s.putImageData(c.imageData, 0, 0),
          c
        );
      }
    });
})();
(fabric.Image = fabric.Image || {}),
  (fabric.Image.filters = fabric.Image.filters || {}),
  (fabric.Image.filters.BaseFilter = fabric.util.createClass({
    type: 'BaseFilter',
    vertexSource:
      'attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvoid main() {\nvTexCoord = aPosition;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}',
    fragmentSource:
      'precision highp float;\nvarying vec2 vTexCoord;\nuniform sampler2D uTexture;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\n}',
    initialize: function (t) {
      t && this.setOptions(t);
    },
    setOptions: function (t) {
      for (var e in t) this[e] = t[e];
    },
    createProgram: function (t, e, i) {
      (e = e || this.fragmentSource),
        (i = i || this.vertexSource),
        'highp' !== fabric.webGlPrecision &&
          (e = e.replace(
            /precision highp float/g,
            'precision ' + fabric.webGlPrecision + ' float'
          ));
      var r = t.createShader(t.VERTEX_SHADER);
      if (
        (t.shaderSource(r, i),
        t.compileShader(r),
        !t.getShaderParameter(r, t.COMPILE_STATUS))
      )
        throw new Error(
          'Vertex shader compile error for ' +
            this.type +
            ': ' +
            t.getShaderInfoLog(r)
        );
      var n = t.createShader(t.FRAGMENT_SHADER);
      if (
        (t.shaderSource(n, e),
        t.compileShader(n),
        !t.getShaderParameter(n, t.COMPILE_STATUS))
      )
        throw new Error(
          'Fragment shader compile error for ' +
            this.type +
            ': ' +
            t.getShaderInfoLog(n)
        );
      var s = t.createProgram();
      if (
        (t.attachShader(s, r),
        t.attachShader(s, n),
        t.linkProgram(s),
        !t.getProgramParameter(s, t.LINK_STATUS))
      )
        throw new Error(
          'Shader link error for "${this.type}" ' + t.getProgramInfoLog(s)
        );
      var o = this.getAttributeLocations(t, s),
        a = this.getUniformLocations(t, s) || {};
      return (
        (a.uStepW = t.getUniformLocation(s, 'uStepW')),
        (a.uStepH = t.getUniformLocation(s, 'uStepH')),
        { program: s, attributeLocations: o, uniformLocations: a }
      );
    },
    getAttributeLocations: function (t, e) {
      return { aPosition: t.getAttribLocation(e, 'aPosition') };
    },
    getUniformLocations: function () {
      return {};
    },
    sendAttributeData: function (t, e, i) {
      var r = e.aPosition,
        n = t.createBuffer();
      t.bindBuffer(t.ARRAY_BUFFER, n),
        t.enableVertexAttribArray(r),
        t.vertexAttribPointer(r, 2, t.FLOAT, !1, 0, 0),
        t.bufferData(t.ARRAY_BUFFER, i, t.STATIC_DRAW);
    },
    _setupFrameBuffer: function (t) {
      var e,
        i,
        r = t.context;
      t.passes > 1
        ? ((e = t.destinationWidth),
          (i = t.destinationHeight),
          (t.sourceWidth !== e || t.sourceHeight !== i) &&
            (r.deleteTexture(t.targetTexture),
            (t.targetTexture = t.filterBackend.createTexture(r, e, i))),
          r.framebufferTexture2D(
            r.FRAMEBUFFER,
            r.COLOR_ATTACHMENT0,
            r.TEXTURE_2D,
            t.targetTexture,
            0
          ))
        : (r.bindFramebuffer(r.FRAMEBUFFER, null), r.finish());
    },
    _swapTextures: function (t) {
      t.passes--, t.pass++;
      var e = t.targetTexture;
      (t.targetTexture = t.sourceTexture), (t.sourceTexture = e);
    },
    isNeutralState: function () {
      var t = this.mainParameter,
        e = fabric.Image.filters[this.type].prototype;
      if (t) {
        if (Array.isArray(e[t])) {
          for (var i = e[t].length; i--; )
            if (this[t][i] !== e[t][i]) return !1;
          return !0;
        }
        return e[t] === this[t];
      }
      return !1;
    },
    applyTo: function (t) {
      t.webgl
        ? (this._setupFrameBuffer(t),
          this.applyToWebGL(t),
          this._swapTextures(t))
        : this.applyTo2d(t);
    },
    retrieveShader: function (t) {
      return (
        t.programCache.hasOwnProperty(this.type) ||
          (t.programCache[this.type] = this.createProgram(t.context)),
        t.programCache[this.type]
      );
    },
    applyToWebGL: function (t) {
      var e = t.context,
        i = this.retrieveShader(t);
      0 === t.pass && t.originalTexture
        ? e.bindTexture(e.TEXTURE_2D, t.originalTexture)
        : e.bindTexture(e.TEXTURE_2D, t.sourceTexture),
        e.useProgram(i.program),
        this.sendAttributeData(e, i.attributeLocations, t.aPosition),
        e.uniform1f(i.uniformLocations.uStepW, 1 / t.sourceWidth),
        e.uniform1f(i.uniformLocations.uStepH, 1 / t.sourceHeight),
        this.sendUniformData(e, i.uniformLocations),
        e.viewport(0, 0, t.destinationWidth, t.destinationHeight),
        e.drawArrays(e.TRIANGLE_STRIP, 0, 4);
    },
    bindAdditionalTexture: function (t, e, i) {
      t.activeTexture(i),
        t.bindTexture(t.TEXTURE_2D, e),
        t.activeTexture(t.TEXTURE0);
    },
    unbindAdditionalTexture: function (t, e) {
      t.activeTexture(e),
        t.bindTexture(t.TEXTURE_2D, null),
        t.activeTexture(t.TEXTURE0);
    },
    getMainParameter: function () {
      return this[this.mainParameter];
    },
    setMainParameter: function (t) {
      this[this.mainParameter] = t;
    },
    sendUniformData: function () {},
    createHelpLayer: function (t) {
      if (!t.helpLayer) {
        var e = document.createElement('canvas');
        (e.width = t.sourceWidth),
          (e.height = t.sourceHeight),
          (t.helpLayer = e);
      }
    },
    toObject: function () {
      var t = { type: this.type },
        e = this.mainParameter;
      return e && (t[e] = this[e]), t;
    },
    toJSON: function () {
      return this.toObject();
    }
  })),
  (fabric.Image.filters.BaseFilter.fromObject = function (t, e) {
    var i = new fabric.Image.filters[t.type](t);
    return e && e(i), i;
  });
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.ColorMatrix = r(i.BaseFilter, {
    type: 'ColorMatrix',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nuniform mat4 uColorMatrix;\nuniform vec4 uConstants;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor *= uColorMatrix;\ncolor += uConstants;\ngl_FragColor = color;\n}',
    matrix: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    mainParameter: 'matrix',
    colorsOnly: !0,
    initialize: function (t) {
      this.callSuper('initialize', t), (this.matrix = this.matrix.slice(0));
    },
    applyTo2d: function (t) {
      var e,
        i,
        r,
        n,
        s,
        o = t.imageData,
        a = o.data,
        c = a.length,
        h = this.matrix,
        l = this.colorsOnly;
      for (s = 0; c > s; s += 4)
        (e = a[s]),
          (i = a[s + 1]),
          (r = a[s + 2]),
          l
            ? ((a[s] = e * h[0] + i * h[1] + r * h[2] + 255 * h[4]),
              (a[s + 1] = e * h[5] + i * h[6] + r * h[7] + 255 * h[9]),
              (a[s + 2] = e * h[10] + i * h[11] + r * h[12] + 255 * h[14]))
            : ((n = a[s + 3]),
              (a[s] = e * h[0] + i * h[1] + r * h[2] + n * h[3] + 255 * h[4]),
              (a[s + 1] =
                e * h[5] + i * h[6] + r * h[7] + n * h[8] + 255 * h[9]),
              (a[s + 2] =
                e * h[10] + i * h[11] + r * h[12] + n * h[13] + 255 * h[14]),
              (a[s + 3] =
                e * h[15] + i * h[16] + r * h[17] + n * h[18] + 255 * h[19]));
    },
    getUniformLocations: function (t, e) {
      return {
        uColorMatrix: t.getUniformLocation(e, 'uColorMatrix'),
        uConstants: t.getUniformLocation(e, 'uConstants')
      };
    },
    sendUniformData: function (t, e) {
      var i = this.matrix,
        r = [
          i[0],
          i[1],
          i[2],
          i[3],
          i[5],
          i[6],
          i[7],
          i[8],
          i[10],
          i[11],
          i[12],
          i[13],
          i[15],
          i[16],
          i[17],
          i[18]
        ],
        n = [i[4], i[9], i[14], i[19]];
      t.uniformMatrix4fv(e.uColorMatrix, !1, r), t.uniform4fv(e.uConstants, n);
    }
  })),
    (e.Image.filters.ColorMatrix.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Brightness = r(i.BaseFilter, {
    type: 'Brightness',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform float uBrightness;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += uBrightness;\ngl_FragColor = color;\n}',
    brightness: 0,
    mainParameter: 'brightness',
    applyTo2d: function (t) {
      if (0 !== this.brightness) {
        var e,
          i = t.imageData,
          r = i.data,
          n = r.length,
          s = Math.round(255 * this.brightness);
        for (e = 0; n > e; e += 4)
          (r[e] = r[e] + s),
            (r[e + 1] = r[e + 1] + s),
            (r[e + 2] = r[e + 2] + s);
      }
    },
    getUniformLocations: function (t, e) {
      return { uBrightness: t.getUniformLocation(e, 'uBrightness') };
    },
    sendUniformData: function (t, e) {
      t.uniform1f(e.uBrightness, this.brightness);
    }
  })),
    (e.Image.filters.Brightness.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.object.extend,
    r = e.Image.filters,
    n = e.util.createClass;
  (r.Convolute = n(r.BaseFilter, {
    type: 'Convolute',
    opaque: !1,
    matrix: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    fragmentSource: {
      Convolute_3_1:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1), uStepH * (h - 1));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 3.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
      Convolute_3_0:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[9];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 3.0; h+=1.0) {\nfor (float w = 0.0; w < 3.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 1.0), uStepH * (h - 1.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 3.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
      Convolute_5_1:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 5.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
      Convolute_5_0:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[25];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 5.0; h+=1.0) {\nfor (float w = 0.0; w < 5.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 2.0), uStepH * (h - 2.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 5.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
      Convolute_7_1:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 7.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
      Convolute_7_0:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[49];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 7.0; h+=1.0) {\nfor (float w = 0.0; w < 7.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 3.0), uStepH * (h - 3.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 7.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}',
      Convolute_9_1:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 0);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor += texture2D(uTexture, vTexCoord + matrixPos) * uMatrix[int(h * 9.0 + w)];\n}\n}\ngl_FragColor = color;\n}',
      Convolute_9_0:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform float uMatrix[81];\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = vec4(0, 0, 0, 1);\nfor (float h = 0.0; h < 9.0; h+=1.0) {\nfor (float w = 0.0; w < 9.0; w+=1.0) {\nvec2 matrixPos = vec2(uStepW * (w - 4.0), uStepH * (h - 4.0));\ncolor.rgb += texture2D(uTexture, vTexCoord + matrixPos).rgb * uMatrix[int(h * 9.0 + w)];\n}\n}\nfloat alpha = texture2D(uTexture, vTexCoord).a;\ngl_FragColor = color;\ngl_FragColor.a = alpha;\n}'
    },
    retrieveShader: function (t) {
      var e = Math.sqrt(this.matrix.length),
        i = this.type + '_' + e + '_' + (this.opaque ? 1 : 0),
        r = this.fragmentSource[i];
      return (
        t.programCache.hasOwnProperty(i) ||
          (t.programCache[i] = this.createProgram(t.context, r)),
        t.programCache[i]
      );
    },
    applyTo2d: function (t) {
      var e,
        i,
        r,
        n,
        s,
        o,
        a,
        c,
        h,
        l,
        u,
        f,
        d,
        g = t.imageData,
        p = g.data,
        v = this.matrix,
        b = Math.round(Math.sqrt(v.length)),
        m = Math.floor(b / 2),
        y = g.width,
        _ = g.height,
        x = t.ctx.createImageData(y, _),
        C = x.data,
        w = this.opaque ? 1 : 0;
      for (u = 0; _ > u; u++)
        for (l = 0; y > l; l++) {
          for (
            s = 4 * (u * y + l), e = 0, i = 0, r = 0, n = 0, d = 0;
            b > d;
            d++
          )
            for (f = 0; b > f; f++)
              (a = u + d - m),
                (o = l + f - m),
                0 > a ||
                  a >= _ ||
                  0 > o ||
                  o >= y ||
                  ((c = 4 * (a * y + o)),
                  (h = v[d * b + f]),
                  (e += p[c] * h),
                  (i += p[c + 1] * h),
                  (r += p[c + 2] * h),
                  w || (n += p[c + 3] * h));
          (C[s] = e),
            (C[s + 1] = i),
            (C[s + 2] = r),
            (C[s + 3] = w ? p[s + 3] : n);
        }
      t.imageData = x;
    },
    getUniformLocations: function (t, e) {
      return {
        uMatrix: t.getUniformLocation(e, 'uMatrix'),
        uOpaque: t.getUniformLocation(e, 'uOpaque'),
        uHalfSize: t.getUniformLocation(e, 'uHalfSize'),
        uSize: t.getUniformLocation(e, 'uSize')
      };
    },
    sendUniformData: function (t, e) {
      t.uniform1fv(e.uMatrix, this.matrix);
    },
    toObject: function () {
      return i(this.callSuper('toObject'), {
        opaque: this.opaque,
        matrix: this.matrix
      });
    }
  })),
    (e.Image.filters.Convolute.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Grayscale = r(i.BaseFilter, {
    type: 'Grayscale',
    fragmentSource: {
      average:
        'precision highp float;\nuniform sampler2D uTexture;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat average = (color.r + color.b + color.g) / 3.0;\ngl_FragColor = vec4(average, average, average, color.a);\n}',
      lightness:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = (max(max(col.r, col.g),col.b) + min(min(col.r, col.g),col.b)) / 2.0;\ngl_FragColor = vec4(average, average, average, col.a);\n}',
      luminosity:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform int uMode;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 col = texture2D(uTexture, vTexCoord);\nfloat average = 0.21 * col.r + 0.72 * col.g + 0.07 * col.b;\ngl_FragColor = vec4(average, average, average, col.a);\n}'
    },
    mode: 'average',
    mainParameter: 'mode',
    applyTo2d: function (t) {
      var e,
        i,
        r = t.imageData,
        n = r.data,
        o = n.length,
        s = this.mode;
      for (e = 0; o > e; e += 4)
        'average' === s
          ? (i = (n[e] + n[e + 1] + n[e + 2]) / 3)
          : 'lightness' === s
          ? (i =
              (Math.min(n[e], n[e + 1], n[e + 2]) +
                Math.max(n[e], n[e + 1], n[e + 2])) /
              2)
          : 'luminosity' === s &&
            (i = 0.21 * n[e] + 0.72 * n[e + 1] + 0.07 * n[e + 2]),
          (n[e] = i),
          (n[e + 1] = i),
          (n[e + 2] = i);
    },
    retrieveShader: function (t) {
      var e = this.type + '_' + this.mode;
      if (!t.programCache.hasOwnProperty(e)) {
        var i = this.fragmentSource[this.mode];
        t.programCache[e] = this.createProgram(t.context, i);
      }
      return t.programCache[e];
    },
    getUniformLocations: function (t, e) {
      return { uMode: t.getUniformLocation(e, 'uMode') };
    },
    sendUniformData: function (t, e) {
      var i = 1;
      t.uniform1i(e.uMode, i);
    },
    isNeutralState: function () {
      return !1;
    }
  })),
    (e.Image.filters.Grayscale.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Invert = r(i.BaseFilter, {
    type: 'Invert',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform int uInvert;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nif (uInvert == 1) {\ngl_FragColor = vec4(1.0 - color.r,1.0 -color.g,1.0 -color.b,color.a);\n} else {\ngl_FragColor = color;\n}\n}',
    invert: !0,
    mainParameter: 'invert',
    applyTo2d: function (t) {
      var e,
        i = t.imageData,
        r = i.data,
        n = r.length;
      for (e = 0; n > e; e += 4)
        (r[e] = 255 - r[e]),
          (r[e + 1] = 255 - r[e + 1]),
          (r[e + 2] = 255 - r[e + 2]);
    },
    isNeutralState: function () {
      return !this.invert;
    },
    getUniformLocations: function (t, e) {
      return { uInvert: t.getUniformLocation(e, 'uInvert') };
    },
    sendUniformData: function (t, e) {
      t.uniform1i(e.uInvert, this.invert);
    }
  })),
    (e.Image.filters.Invert.fromObject = e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.object.extend,
    r = e.Image.filters,
    n = e.util.createClass;
  (r.Noise = n(r.BaseFilter, {
    type: 'Noise',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform float uStepH;\nuniform float uNoise;\nuniform float uSeed;\nvarying vec2 vTexCoord;\nfloat rand(vec2 co, float seed, float vScale) {\nreturn fract(sin(dot(co.xy * vScale ,vec2(12.9898 , 78.233))) * 43758.5453 * (seed + 0.01) / 2.0);\n}\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ncolor.rgb += (0.5 - rand(vTexCoord, uSeed, 0.1 / uStepH)) * uNoise;\ngl_FragColor = color;\n}',
    mainParameter: 'noise',
    noise: 0,
    applyTo2d: function (t) {
      if (0 !== this.noise) {
        var e,
          i,
          r = t.imageData,
          n = r.data,
          o = n.length,
          s = this.noise;
        for (e = 0, o = n.length; o > e; e += 4)
          (i = (0.5 - Math.random()) * s),
            (n[e] += i),
            (n[e + 1] += i),
            (n[e + 2] += i);
      }
    },
    getUniformLocations: function (t, e) {
      return {
        uNoise: t.getUniformLocation(e, 'uNoise'),
        uSeed: t.getUniformLocation(e, 'uSeed')
      };
    },
    sendUniformData: function (t, e) {
      t.uniform1f(e.uNoise, this.noise / 255),
        t.uniform1f(e.uSeed, Math.random());
    },
    toObject: function () {
      return i(this.callSuper('toObject'), { noise: this.noise });
    }
  })),
    (e.Image.filters.Noise.fromObject = e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Pixelate = r(i.BaseFilter, {
    type: 'Pixelate',
    blocksize: 4,
    mainParameter: 'blocksize',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform float uBlocksize;\nuniform float uStepW;\nuniform float uStepH;\nvarying vec2 vTexCoord;\nvoid main() {\nfloat blockW = uBlocksize * uStepW;\nfloat blockH = uBlocksize * uStepW;\nint posX = int(vTexCoord.x / blockW);\nint posY = int(vTexCoord.y / blockH);\nfloat fposX = float(posX);\nfloat fposY = float(posY);\nvec2 squareCoords = vec2(fposX * blockW, fposY * blockH);\nvec4 color = texture2D(uTexture, squareCoords);\ngl_FragColor = color;\n}',
    applyTo2d: function (t) {
      var e,
        i,
        r,
        n,
        o,
        s,
        a,
        c,
        h,
        l,
        u,
        f = t.imageData,
        d = f.data,
        g = f.height,
        p = f.width;
      for (i = 0; g > i; i += this.blocksize)
        for (r = 0; p > r; r += this.blocksize)
          for (
            e = 4 * i * p + 4 * r,
              n = d[e],
              o = d[e + 1],
              s = d[e + 2],
              a = d[e + 3],
              l = Math.min(i + this.blocksize, g),
              u = Math.min(r + this.blocksize, p),
              c = i;
            l > c;
            c++
          )
            for (h = r; u > h; h++)
              (e = 4 * c * p + 4 * h),
                (d[e] = n),
                (d[e + 1] = o),
                (d[e + 2] = s),
                (d[e + 3] = a);
    },
    isNeutralState: function () {
      return 1 === this.blocksize;
    },
    getUniformLocations: function (t, e) {
      return {
        uBlocksize: t.getUniformLocation(e, 'uBlocksize'),
        uStepW: t.getUniformLocation(e, 'uStepW'),
        uStepH: t.getUniformLocation(e, 'uStepH')
      };
    },
    sendUniformData: function (t, e) {
      t.uniform1f(e.uBlocksize, this.blocksize);
    }
  })),
    (e.Image.filters.Pixelate.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.object.extend,
    r = e.Image.filters,
    n = e.util.createClass;
  (r.RemoveColor = n(r.BaseFilter, {
    type: 'RemoveColor',
    color: '#FFFFFF',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uLow;\nuniform vec4 uHigh;\nvarying vec2 vTexCoord;\nvoid main() {\ngl_FragColor = texture2D(uTexture, vTexCoord);\nif(all(greaterThan(gl_FragColor.rgb,uLow.rgb)) && all(greaterThan(uHigh.rgb,gl_FragColor.rgb))) {\ngl_FragColor.a = 0.0;\n}\n}',
    distance: 0.02,
    useAlpha: !1,
    applyTo2d: function (t) {
      var i,
        r,
        n,
        o,
        s = t.imageData,
        a = s.data,
        c = 255 * this.distance,
        h = new e.Color(this.color).getSource(),
        l = [h[0] - c, h[1] - c, h[2] - c],
        u = [h[0] + c, h[1] + c, h[2] + c];
      for (i = 0; i < a.length; i += 4)
        (r = a[i]),
          (n = a[i + 1]),
          (o = a[i + 2]),
          r > l[0] &&
            n > l[1] &&
            o > l[2] &&
            r < u[0] &&
            n < u[1] &&
            o < u[2] &&
            (a[i + 3] = 0);
    },
    getUniformLocations: function (t, e) {
      return {
        uLow: t.getUniformLocation(e, 'uLow'),
        uHigh: t.getUniformLocation(e, 'uHigh')
      };
    },
    sendUniformData: function (t, i) {
      var r = new e.Color(this.color).getSource(),
        n = parseFloat(this.distance),
        o = [0 + r[0] / 255 - n, 0 + r[1] / 255 - n, 0 + r[2] / 255 - n, 1],
        s = [r[0] / 255 + n, r[1] / 255 + n, r[2] / 255 + n, 1];
      t.uniform4fv(i.uLow, o), t.uniform4fv(i.uHigh, s);
    },
    toObject: function () {
      return i(this.callSuper('toObject'), {
        color: this.color,
        distance: this.distance
      });
    }
  })),
    (e.Image.filters.RemoveColor.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass,
    n = {
      Brownie: [
        0.5997, 0.34553, -0.27082, 0, 0.186, -0.0377, 0.86095, 0.15059, 0,
        -0.1449, 0.24113, -0.07441, 0.44972, 0, -0.02965, 0, 0, 0, 1, 0
      ],
      Vintage: [
        0.62793, 0.32021, -0.03965, 0, 0.03784, 0.02578, 0.64411, 0.03259, 0,
        0.02926, 0.0466, -0.08512, 0.52416, 0, 0.02023, 0, 0, 0, 1, 0
      ],
      Kodachrome: [
        1.12855, -0.39673, -0.03992, 0, 0.24991, -0.16404, 1.08352, -0.05498, 0,
        0.09698, -0.16786, -0.56034, 1.60148, 0, 0.13972, 0, 0, 0, 1, 0
      ],
      Technicolor: [
        1.91252, -0.85453, -0.09155, 0, 0.04624, -0.30878, 1.76589, -0.10601, 0,
        -0.27589, -0.2311, -0.75018, 1.84759, 0, 0.12137, 0, 0, 0, 1, 0
      ],
      Polaroid: [
        1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016,
        -0.016, 1.483, 0, 0, 0, 0, 0, 1, 0
      ],
      Sepia: [
        0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534,
        0.131, 0, 0, 0, 0, 0, 1, 0
      ],
      BlackWhite: [
        1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0, 0,
        0, 1, 0
      ]
    };
  for (var o in n)
    (i[o] = r(i.ColorMatrix, {
      type: o,
      matrix: n[o],
      mainParameter: !1,
      colorsOnly: !0
    })),
      (e.Image.filters[o].fromObject = e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric,
    i = e.Image.filters,
    r = e.util.createClass;
  (i.BlendColor = r(i.BaseFilter, {
    type: 'BlendColor',
    color: '#F95C63',
    mode: 'multiply',
    alpha: 1,
    fragmentSource: {
      multiply: 'gl_FragColor.rgb *= uColor.rgb;\n',
      screen:
        'gl_FragColor.rgb = 1.0 - (1.0 - gl_FragColor.rgb) * (1.0 - uColor.rgb);\n',
      add: 'gl_FragColor.rgb += uColor.rgb;\n',
      diff: 'gl_FragColor.rgb = abs(gl_FragColor.rgb - uColor.rgb);\n',
      subtract: 'gl_FragColor.rgb -= uColor.rgb;\n',
      lighten: 'gl_FragColor.rgb = max(gl_FragColor.rgb, uColor.rgb);\n',
      darken: 'gl_FragColor.rgb = min(gl_FragColor.rgb, uColor.rgb);\n',
      exclusion:
        'gl_FragColor.rgb += uColor.rgb - 2.0 * (uColor.rgb * gl_FragColor.rgb);\n',
      overlay:
        'if (uColor.r < 0.5) {\ngl_FragColor.r *= 2.0 * uColor.r;\n} else {\ngl_FragColor.r = 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - uColor.r);\n}\nif (uColor.g < 0.5) {\ngl_FragColor.g *= 2.0 * uColor.g;\n} else {\ngl_FragColor.g = 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - uColor.g);\n}\nif (uColor.b < 0.5) {\ngl_FragColor.b *= 2.0 * uColor.b;\n} else {\ngl_FragColor.b = 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - uColor.b);\n}\n',
      tint: 'gl_FragColor.rgb *= (1.0 - uColor.a);\ngl_FragColor.rgb += uColor.rgb;\n'
    },
    buildSource: function (t) {
      return (
        'precision highp float;\nuniform sampler2D uTexture;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\ngl_FragColor = color;\nif (color.a > 0.0) {\n' +
        this.fragmentSource[t] +
        '}\n}'
      );
    },
    retrieveShader: function (t) {
      var e,
        i = this.type + '_' + this.mode;
      return (
        t.programCache.hasOwnProperty(i) ||
          ((e = this.buildSource(this.mode)),
          (t.programCache[i] = this.createProgram(t.context, e))),
        t.programCache[i]
      );
    },
    applyTo2d: function (t) {
      var i,
        r,
        n,
        o,
        s,
        a,
        c,
        h = t.imageData,
        l = h.data,
        u = l.length,
        f = 1 - this.alpha;
      (c = new e.Color(this.color).getSource()),
        (i = c[0] * this.alpha),
        (r = c[1] * this.alpha),
        (n = c[2] * this.alpha);
      for (var d = 0; u > d; d += 4)
        switch (((o = l[d]), (s = l[d + 1]), (a = l[d + 2]), this.mode)) {
          case 'multiply':
            (l[d] = (o * i) / 255),
              (l[d + 1] = (s * r) / 255),
              (l[d + 2] = (a * n) / 255);
            break;
          case 'screen':
            (l[d] = 255 - ((255 - o) * (255 - i)) / 255),
              (l[d + 1] = 255 - ((255 - s) * (255 - r)) / 255),
              (l[d + 2] = 255 - ((255 - a) * (255 - n)) / 255);
            break;
          case 'add':
            (l[d] = o + i), (l[d + 1] = s + r), (l[d + 2] = a + n);
            break;
          case 'diff':
          case 'difference':
            (l[d] = Math.abs(o - i)),
              (l[d + 1] = Math.abs(s - r)),
              (l[d + 2] = Math.abs(a - n));
            break;
          case 'subtract':
            (l[d] = o - i), (l[d + 1] = s - r), (l[d + 2] = a - n);
            break;
          case 'darken':
            (l[d] = Math.min(o, i)),
              (l[d + 1] = Math.min(s, r)),
              (l[d + 2] = Math.min(a, n));
            break;
          case 'lighten':
            (l[d] = Math.max(o, i)),
              (l[d + 1] = Math.max(s, r)),
              (l[d + 2] = Math.max(a, n));
            break;
          case 'overlay':
            (l[d] =
              128 > i
                ? (2 * o * i) / 255
                : 255 - (2 * (255 - o) * (255 - i)) / 255),
              (l[d + 1] =
                128 > r
                  ? (2 * s * r) / 255
                  : 255 - (2 * (255 - s) * (255 - r)) / 255),
              (l[d + 2] =
                128 > n
                  ? (2 * a * n) / 255
                  : 255 - (2 * (255 - a) * (255 - n)) / 255);
            break;
          case 'exclusion':
            (l[d] = i + o - (2 * i * o) / 255),
              (l[d + 1] = r + s - (2 * r * s) / 255),
              (l[d + 2] = n + a - (2 * n * a) / 255);
            break;
          case 'tint':
            (l[d] = i + o * f), (l[d + 1] = r + s * f), (l[d + 2] = n + a * f);
        }
    },
    getUniformLocations: function (t, e) {
      return { uColor: t.getUniformLocation(e, 'uColor') };
    },
    sendUniformData: function (t, i) {
      var r = new e.Color(this.color).getSource();
      (r[0] = (this.alpha * r[0]) / 255),
        (r[1] = (this.alpha * r[1]) / 255),
        (r[2] = (this.alpha * r[2]) / 255),
        (r[3] = this.alpha),
        t.uniform4fv(i.uColor, r);
    },
    toObject: function () {
      return {
        type: this.type,
        color: this.color,
        mode: this.mode,
        alpha: this.alpha
      };
    }
  })),
    (e.Image.filters.BlendColor.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric,
    i = e.Image.filters,
    r = e.util.createClass;
  (i.BlendImage = r(i.BaseFilter, {
    type: 'BlendImage',
    image: null,
    mode: 'multiply',
    alpha: 1,
    vertexSource:
      'attribute vec2 aPosition;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nuniform mat3 uTransformMatrix;\nvoid main() {\nvTexCoord = aPosition;\nvTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\ngl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n}',
    fragmentSource: {
      multiply:
        'precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.rgba *= color2.rgba;\ngl_FragColor = color;\n}',
      mask: 'precision highp float;\nuniform sampler2D uTexture;\nuniform sampler2D uImage;\nuniform vec4 uColor;\nvarying vec2 vTexCoord;\nvarying vec2 vTexCoord2;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec4 color2 = texture2D(uImage, vTexCoord2);\ncolor.a = color2.a;\ngl_FragColor = color;\n}'
    },
    retrieveShader: function (t) {
      var e = this.type + '_' + this.mode,
        i = this.fragmentSource[this.mode];
      return (
        t.programCache.hasOwnProperty(e) ||
          (t.programCache[e] = this.createProgram(t.context, i)),
        t.programCache[e]
      );
    },
    applyToWebGL: function (t) {
      var e = t.context,
        i = this.createTexture(t.filterBackend, this.image);
      this.bindAdditionalTexture(e, i, e.TEXTURE1),
        this.callSuper('applyToWebGL', t),
        this.unbindAdditionalTexture(e, e.TEXTURE1);
    },
    createTexture: function (t, e) {
      return t.getCachedTexture(e.cacheKey, e._element);
    },
    calculateMatrix: function () {
      var t = this.image,
        e = t._element.width,
        i = t._element.height;
      return [
        1 / t.scaleX,
        0,
        0,
        0,
        1 / t.scaleY,
        0,
        -t.left / e,
        -t.top / i,
        1
      ];
    },
    applyTo2d: function (t) {
      var i,
        r,
        n,
        o,
        a,
        s,
        c,
        h,
        l,
        u,
        f,
        d = t.imageData,
        g = t.filterBackend.resources,
        p = d.data,
        v = p.length,
        m = d.width,
        b = d.height,
        y = this.image;
      g.blendImage || (g.blendImage = e.util.createCanvasElement()),
        (l = g.blendImage),
        (u = l.getContext('2d')),
        l.width !== m || l.height !== b
          ? ((l.width = m), (l.height = b))
          : u.clearRect(0, 0, m, b),
        u.setTransform(y.scaleX, 0, 0, y.scaleY, y.left, y.top),
        u.drawImage(y._element, 0, 0, m, b),
        (f = u.getImageData(0, 0, m, b).data);
      for (var _ = 0; v > _; _ += 4)
        switch (
          ((a = p[_]),
          (s = p[_ + 1]),
          (c = p[_ + 2]),
          (h = p[_ + 3]),
          (i = f[_]),
          (r = f[_ + 1]),
          (n = f[_ + 2]),
          (o = f[_ + 3]),
          this.mode)
        ) {
          case 'multiply':
            (p[_] = (a * i) / 255),
              (p[_ + 1] = (s * r) / 255),
              (p[_ + 2] = (c * n) / 255),
              (p[_ + 3] = (h * o) / 255);
            break;
          case 'mask':
            p[_ + 3] = o;
        }
    },
    getUniformLocations: function (t, e) {
      return {
        uTransformMatrix: t.getUniformLocation(e, 'uTransformMatrix'),
        uImage: t.getUniformLocation(e, 'uImage')
      };
    },
    sendUniformData: function (t, e) {
      var i = this.calculateMatrix();
      t.uniform1i(e.uImage, 1), t.uniformMatrix3fv(e.uTransformMatrix, !1, i);
    },
    toObject: function () {
      return {
        type: this.type,
        image: this.image && this.image.toObject(),
        mode: this.mode,
        alpha: this.alpha
      };
    }
  })),
    (e.Image.filters.BlendImage.fromObject = function (t, i) {
      e.Image.fromObject(t.image, function (r) {
        var n = e.util.object.clone(t);
        (n.image = r), i(new e.Image.filters.BlendImage(n));
      });
    });
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = Math.pow,
    r = Math.floor,
    n = Math.sqrt,
    o = Math.abs,
    a = Math.round,
    s = Math.sin,
    c = Math.ceil,
    h = e.Image.filters,
    l = e.util.createClass;
  (h.Resize = l(h.BaseFilter, {
    type: 'Resize',
    resizeType: 'hermite',
    scaleX: 1,
    scaleY: 1,
    lanczosLobes: 3,
    getUniformLocations: function (t, e) {
      return {
        uDelta: t.getUniformLocation(e, 'uDelta'),
        uTaps: t.getUniformLocation(e, 'uTaps')
      };
    },
    sendUniformData: function (t, e) {
      t.uniform2fv(
        e.uDelta,
        this.horizontal ? [1 / this.width, 0] : [0, 1 / this.height]
      ),
        t.uniform1fv(e.uTaps, this.taps);
    },
    retrieveShader: function (t) {
      var e = this.getFilterWindow(),
        i = this.type + '_' + e;
      if (!t.programCache.hasOwnProperty(i)) {
        var r = this.generateShader(e);
        t.programCache[i] = this.createProgram(t.context, r);
      }
      return t.programCache[i];
    },
    getFilterWindow: function () {
      var t = this.tempScale;
      return Math.ceil(this.lanczosLobes / t);
    },
    getTaps: function () {
      for (
        var t = this.lanczosCreate(this.lanczosLobes),
          e = this.tempScale,
          i = this.getFilterWindow(),
          r = new Array(i),
          n = 1;
        i >= n;
        n++
      )
        r[n - 1] = t(n * e);
      return r;
    },
    generateShader: function (t) {
      for (
        var t, e = new Array(t), i = this.fragmentSourceTOP, r = 1;
        t >= r;
        r++
      )
        e[r - 1] = r + '.0 * uDelta';
      return (
        (i += 'uniform float uTaps[' + t + '];\n'),
        (i += 'void main() {\n'),
        (i += '  vec4 color = texture2D(uTexture, vTexCoord);\n'),
        (i += '  float sum = 1.0;\n'),
        e.forEach(function (t, e) {
          (i +=
            '  color += texture2D(uTexture, vTexCoord + ' +
            t +
            ') * uTaps[' +
            e +
            '];\n'),
            (i +=
              '  color += texture2D(uTexture, vTexCoord - ' +
              t +
              ') * uTaps[' +
              e +
              '];\n'),
            (i += '  sum += 2.0 * uTaps[' + e + '];\n');
        }),
        (i += '  gl_FragColor = color / sum;\n'),
        (i += '}')
      );
    },
    fragmentSourceTOP:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\n',
    applyTo: function (t) {
      t.webgl
        ? (t.passes++,
          (this.width = t.sourceWidth),
          (this.horizontal = !0),
          (this.dW = Math.round(this.width * this.scaleX)),
          (this.dH = t.sourceHeight),
          (this.tempScale = this.dW / this.width),
          (this.taps = this.getTaps()),
          (t.destinationWidth = this.dW),
          this._setupFrameBuffer(t),
          this.applyToWebGL(t),
          this._swapTextures(t),
          (t.sourceWidth = t.destinationWidth),
          (this.height = t.sourceHeight),
          (this.horizontal = !1),
          (this.dH = Math.round(this.height * this.scaleY)),
          (this.tempScale = this.dH / this.height),
          (this.taps = this.getTaps()),
          (t.destinationHeight = this.dH),
          this._setupFrameBuffer(t),
          this.applyToWebGL(t),
          this._swapTextures(t),
          (t.sourceHeight = t.destinationHeight))
        : this.applyTo2d(t);
    },
    isNeutralState: function () {
      return 1 === this.scaleX && 1 === this.scaleY;
    },
    lanczosCreate: function (t) {
      return function (e) {
        if (e >= t || -t >= e) return 0;
        if (1.1920929e-7 > e && e > -1.1920929e-7) return 1;
        e *= Math.PI;
        var i = e / t;
        return ((s(e) / e) * s(i)) / i;
      };
    },
    applyTo2d: function (t) {
      var e = t.imageData,
        i = this.scaleX,
        r = this.scaleY;
      (this.rcpScaleX = 1 / i), (this.rcpScaleY = 1 / r);
      var n,
        o = e.width,
        s = e.height,
        c = a(o * i),
        h = a(s * r);
      'sliceHack' === this.resizeType
        ? (n = this.sliceByTwo(t, o, s, c, h))
        : 'hermite' === this.resizeType
        ? (n = this.hermiteFastResize(t, o, s, c, h))
        : 'bilinear' === this.resizeType
        ? (n = this.bilinearFiltering(t, o, s, c, h))
        : 'lanczos' === this.resizeType &&
          (n = this.lanczosResize(t, o, s, c, h)),
        (t.imageData = n);
    },
    sliceByTwo: function (t, i, n, o, a) {
      var s,
        c,
        h = t.imageData,
        l = 0.5,
        u = !1,
        f = !1,
        d = i * l,
        g = n * l,
        p = e.filterBackend.resources,
        v = 0,
        m = 0,
        b = i,
        y = 0;
      for (
        p.sliceByTwo || (p.sliceByTwo = document.createElement('canvas')),
          s = p.sliceByTwo,
          (s.width < 1.5 * i || s.height < n) &&
            ((s.width = 1.5 * i), (s.height = n)),
          c = s.getContext('2d'),
          c.clearRect(0, 0, 1.5 * i, n),
          c.putImageData(h, 0, 0),
          o = r(o),
          a = r(a);
        !u || !f;

      )
        (i = d),
          (n = g),
          o < r(d * l) ? (d = r(d * l)) : ((d = o), (u = !0)),
          a < r(g * l) ? (g = r(g * l)) : ((g = a), (f = !0)),
          c.drawImage(s, v, m, i, n, b, y, d, g),
          (v = b),
          (m = y),
          (y += g);
      return c.getImageData(v, m, o, a);
    },
    lanczosResize: function (t, e, a, s, h) {
      function l(t) {
        var c, S, T, O, P, k, j, E, A, M, D;
        for (C.x = (t + 0.5) * p, w.x = r(C.x), c = 0; h > c; c++) {
          for (
            C.y = (c + 0.5) * v,
              w.y = r(C.y),
              P = 0,
              k = 0,
              j = 0,
              E = 0,
              A = 0,
              S = w.x - y;
            S <= w.x + y;
            S++
          )
            if (!(0 > S || S >= e)) {
              (M = r(1e3 * o(S - C.x))), x[M] || (x[M] = {});
              for (var F = w.y - _; F <= w.y + _; F++)
                0 > F ||
                  F >= a ||
                  ((D = r(1e3 * o(F - C.y))),
                  x[M][D] || (x[M][D] = g(n(i(M * m, 2) + i(D * b, 2)) / 1e3)),
                  (T = x[M][D]),
                  T > 0 &&
                    ((O = 4 * (F * e + S)),
                    (P += T),
                    (k += T * u[O]),
                    (j += T * u[O + 1]),
                    (E += T * u[O + 2]),
                    (A += T * u[O + 3])));
            }
          (O = 4 * (c * s + t)),
            (d[O] = k / P),
            (d[O + 1] = j / P),
            (d[O + 2] = E / P),
            (d[O + 3] = A / P);
        }
        return ++t < s ? l(t) : f;
      }
      var u = t.imageData.data,
        f = t.ctx.createImageData(s, h),
        d = f.data,
        g = this.lanczosCreate(this.lanczosLobes),
        p = this.rcpScaleX,
        v = this.rcpScaleY,
        m = 2 / this.rcpScaleX,
        b = 2 / this.rcpScaleY,
        y = c((p * this.lanczosLobes) / 2),
        _ = c((v * this.lanczosLobes) / 2),
        x = {},
        C = {},
        w = {};
      return l(0);
    },
    bilinearFiltering: function (t, e, i, n, o) {
      var a,
        s,
        c,
        h,
        l,
        u,
        f,
        d,
        g,
        p,
        v,
        m,
        b,
        y = 0,
        _ = this.rcpScaleX,
        x = this.rcpScaleY,
        C = 4 * (e - 1),
        w = t.imageData,
        S = w.data,
        T = t.ctx.createImageData(n, o),
        O = T.data;
      for (f = 0; o > f; f++)
        for (d = 0; n > d; d++)
          for (
            l = r(_ * d),
              u = r(x * f),
              g = _ * d - l,
              p = x * f - u,
              b = 4 * (u * e + l),
              v = 0;
            4 > v;
            v++
          )
            (a = S[b + v]),
              (s = S[b + 4 + v]),
              (c = S[b + C + v]),
              (h = S[b + C + 4 + v]),
              (m =
                a * (1 - g) * (1 - p) +
                s * g * (1 - p) +
                c * p * (1 - g) +
                h * g * p),
              (O[y++] = m);
      return T;
    },
    hermiteFastResize: function (t, e, i, a, s) {
      for (
        var h = this.rcpScaleX,
          l = this.rcpScaleY,
          u = c(h / 2),
          f = c(l / 2),
          d = t.imageData,
          g = d.data,
          p = t.ctx.createImageData(a, s),
          v = p.data,
          m = 0;
        s > m;
        m++
      )
        for (var b = 0; a > b; b++) {
          for (
            var y = 4 * (b + m * a),
              _ = 0,
              x = 0,
              C = 0,
              w = 0,
              S = 0,
              T = 0,
              O = 0,
              P = (m + 0.5) * l,
              k = r(m * l);
            (m + 1) * l > k;
            k++
          )
            for (
              var j = o(P - (k + 0.5)) / f,
                E = (b + 0.5) * h,
                A = j * j,
                M = r(b * h);
              (b + 1) * h > M;
              M++
            ) {
              var D = o(E - (M + 0.5)) / u,
                F = n(A + D * D);
              (F > 1 && -1 > F) ||
                ((_ = 2 * F * F * F - 3 * F * F + 1),
                _ > 0 &&
                  ((D = 4 * (M + k * e)),
                  (O += _ * g[D + 3]),
                  (C += _),
                  g[D + 3] < 255 && (_ = (_ * g[D + 3]) / 250),
                  (w += _ * g[D]),
                  (S += _ * g[D + 1]),
                  (T += _ * g[D + 2]),
                  (x += _)));
            }
          (v[y] = w / x),
            (v[y + 1] = S / x),
            (v[y + 2] = T / x),
            (v[y + 3] = O / C);
        }
      return p;
    },
    toObject: function () {
      return {
        type: this.type,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        resizeType: this.resizeType,
        lanczosLobes: this.lanczosLobes
      };
    }
  })),
    (e.Image.filters.Resize.fromObject = e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Contrast = r(i.BaseFilter, {
    type: 'Contrast',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform float uContrast;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat contrastF = 1.015 * (uContrast + 1.0) / (1.0 * (1.015 - uContrast));\ncolor.rgb = contrastF * (color.rgb - 0.5) + 0.5;\ngl_FragColor = color;\n}',
    contrast: 0,
    mainParameter: 'contrast',
    applyTo2d: function (t) {
      if (0 !== this.contrast) {
        var e,
          i,
          r = t.imageData,
          n = r.data,
          i = n.length,
          o = Math.floor(255 * this.contrast),
          a = (259 * (o + 255)) / (255 * (259 - o));
        for (e = 0; i > e; e += 4)
          (n[e] = a * (n[e] - 128) + 128),
            (n[e + 1] = a * (n[e + 1] - 128) + 128),
            (n[e + 2] = a * (n[e + 2] - 128) + 128);
      }
    },
    getUniformLocations: function (t, e) {
      return { uContrast: t.getUniformLocation(e, 'uContrast') };
    },
    sendUniformData: function (t, e) {
      t.uniform1f(e.uContrast, this.contrast);
    }
  })),
    (e.Image.filters.Contrast.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Saturation = r(i.BaseFilter, {
    type: 'Saturation',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform float uSaturation;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nfloat rgMax = max(color.r, color.g);\nfloat rgbMax = max(rgMax, color.b);\ncolor.r += rgbMax != color.r ? (rgbMax - color.r) * uSaturation : 0.00;\ncolor.g += rgbMax != color.g ? (rgbMax - color.g) * uSaturation : 0.00;\ncolor.b += rgbMax != color.b ? (rgbMax - color.b) * uSaturation : 0.00;\ngl_FragColor = color;\n}',
    saturation: 0,
    mainParameter: 'saturation',
    applyTo2d: function (t) {
      if (0 !== this.saturation) {
        var e,
          i,
          r = t.imageData,
          n = r.data,
          o = n.length,
          a = -this.saturation;
        for (e = 0; o > e; e += 4)
          (i = Math.max(n[e], n[e + 1], n[e + 2])),
            (n[e] += i !== n[e] ? (i - n[e]) * a : 0),
            (n[e + 1] += i !== n[e + 1] ? (i - n[e + 1]) * a : 0),
            (n[e + 2] += i !== n[e + 2] ? (i - n[e + 2]) * a : 0);
      }
    },
    getUniformLocations: function (t, e) {
      return { uSaturation: t.getUniformLocation(e, 'uSaturation') };
    },
    sendUniformData: function (t, e) {
      t.uniform1f(e.uSaturation, -this.saturation);
    }
  })),
    (e.Image.filters.Saturation.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Blur = r(i.BaseFilter, {
    type: 'Blur',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform vec2 uDelta;\nvarying vec2 vTexCoord;\nconst float nSamples = 15.0;\nvec3 v3offset = vec3(12.9898, 78.233, 151.7182);\nfloat random(vec3 scale) {\nreturn fract(sin(dot(gl_FragCoord.xyz, scale)) * 43758.5453);\n}\nvoid main() {\nvec4 color = vec4(0.0);\nfloat total = 0.0;\nfloat offset = random(v3offset);\nfor (float t = -nSamples; t <= nSamples; t++) {\nfloat percent = (t + offset - 0.5) / nSamples;\nfloat weight = 1.0 - abs(percent);\ncolor += texture2D(uTexture, vTexCoord + uDelta * percent) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}',
    blur: 0,
    mainParameter: 'blur',
    applyTo: function (t) {
      t.webgl
        ? ((this.aspectRatio = t.sourceWidth / t.sourceHeight),
          t.passes++,
          this._setupFrameBuffer(t),
          (this.horizontal = !0),
          this.applyToWebGL(t),
          this._swapTextures(t),
          this._setupFrameBuffer(t),
          (this.horizontal = !1),
          this.applyToWebGL(t),
          this._swapTextures(t))
        : this.applyTo2d(t);
    },
    applyTo2d: function (t) {
      t.imageData = this.simpleBlur(t);
    },
    simpleBlur: function (t) {
      var i,
        r,
        n = t.filterBackend.resources,
        o = t.imageData.width,
        a = t.imageData.height;
      n.blurLayer1 ||
        ((n.blurLayer1 = e.util.createCanvasElement()),
        (n.blurLayer2 = e.util.createCanvasElement())),
        (i = n.blurLayer1),
        (r = n.blurLayer2),
        (i.width !== o || i.height !== a) &&
          ((r.width = i.width = o), (r.height = i.height = a));
      var s,
        c,
        h,
        l,
        u = i.getContext('2d'),
        f = r.getContext('2d'),
        d = 15,
        g = 0.06 * this.blur * 0.5;
      for (
        u.putImageData(t.imageData, 0, 0), f.clearRect(0, 0, o, a), l = -d;
        d >= l;
        l++
      )
        (s = (Math.random() - 0.5) / 4),
          (c = l / d),
          (h = g * c * o + s),
          (f.globalAlpha = 1 - Math.abs(c)),
          f.drawImage(i, h, s),
          u.drawImage(r, 0, 0),
          (f.globalAlpha = 1),
          f.clearRect(0, 0, r.width, r.height);
      for (l = -d; d >= l; l++)
        (s = (Math.random() - 0.5) / 4),
          (c = l / d),
          (h = g * c * a + s),
          (f.globalAlpha = 1 - Math.abs(c)),
          f.drawImage(i, s, h),
          u.drawImage(r, 0, 0),
          (f.globalAlpha = 1),
          f.clearRect(0, 0, r.width, r.height);
      t.ctx.drawImage(i, 0, 0);
      var p = t.ctx.getImageData(0, 0, i.width, i.height);
      return (u.globalAlpha = 1), u.clearRect(0, 0, i.width, i.height), p;
    },
    getUniformLocations: function (t, e) {
      return { delta: t.getUniformLocation(e, 'uDelta') };
    },
    sendUniformData: function (t, e) {
      var i = this.chooseRightDelta();
      t.uniform2fv(e.delta, i);
    },
    chooseRightDelta: function () {
      var t,
        e = 1,
        i = [0, 0];
      return (
        this.horizontal
          ? this.aspectRatio > 1 && (e = 1 / this.aspectRatio)
          : this.aspectRatio < 1 && (e = this.aspectRatio),
        (t = e * this.blur * 0.12),
        this.horizontal ? (i[0] = t) : (i[1] = t),
        i
      );
    }
  })),
    (i.Blur.fromObject = e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Gamma = r(i.BaseFilter, {
    type: 'Gamma',
    fragmentSource:
      'precision highp float;\nuniform sampler2D uTexture;\nuniform vec3 uGamma;\nvarying vec2 vTexCoord;\nvoid main() {\nvec4 color = texture2D(uTexture, vTexCoord);\nvec3 correction = (1.0 / uGamma);\ncolor.r = pow(color.r, correction.r);\ncolor.g = pow(color.g, correction.g);\ncolor.b = pow(color.b, correction.b);\ngl_FragColor = color;\ngl_FragColor.rgb *= color.a;\n}',
    gamma: [1, 1, 1],
    mainParameter: 'gamma',
    initialize: function (t) {
      (this.gamma = [1, 1, 1]), i.BaseFilter.prototype.initialize.call(this, t);
    },
    applyTo2d: function (t) {
      var e,
        i = t.imageData,
        r = i.data,
        n = this.gamma,
        o = r.length,
        a = 1 / n[0],
        s = 1 / n[1],
        c = 1 / n[2];
      for (
        this.rVals ||
          ((this.rVals = new Uint8Array(256)),
          (this.gVals = new Uint8Array(256)),
          (this.bVals = new Uint8Array(256))),
          e = 0,
          o = 256;
        o > e;
        e++
      )
        (this.rVals[e] = 255 * Math.pow(e / 255, a)),
          (this.gVals[e] = 255 * Math.pow(e / 255, s)),
          (this.bVals[e] = 255 * Math.pow(e / 255, c));
      for (e = 0, o = r.length; o > e; e += 4)
        (r[e] = this.rVals[r[e]]),
          (r[e + 1] = this.gVals[r[e + 1]]),
          (r[e + 2] = this.bVals[r[e + 2]]);
    },
    getUniformLocations: function (t, e) {
      return { uGamma: t.getUniformLocation(e, 'uGamma') };
    },
    sendUniformData: function (t, e) {
      t.uniform3fv(e.uGamma, this.gamma);
    }
  })),
    (e.Image.filters.Gamma.fromObject = e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.Composed = r(i.BaseFilter, {
    type: 'Composed',
    subFilters: [],
    initialize: function (t) {
      this.callSuper('initialize', t),
        (this.subFilters = this.subFilters.slice(0));
    },
    applyTo: function (t) {
      (t.passes += this.subFilters.length - 1),
        this.subFilters.forEach(function (e) {
          e.applyTo(t);
        });
    },
    toObject: function () {
      return e.util.object.extend(this.callSuper('toObject'), {
        subFilters: this.subFilters.map(function (t) {
          return t.toObject();
        })
      });
    },
    isNeutralState: function () {
      return !this.subFilters.some(function (t) {
        return !t.isNeutralState();
      });
    }
  })),
    (e.Image.filters.Composed.fromObject = function (t, i) {
      var r = t.subFilters || [],
        n = r.map(function (t) {
          return new e.Image.filters[t.type](t);
        }),
        o = new e.Image.filters.Composed({ subFilters: n });
      return i && i(o), o;
    });
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.Image.filters,
    r = e.util.createClass;
  (i.HueRotation = r(i.ColorMatrix, {
    type: 'HueRotation',
    rotation: 0,
    mainParameter: 'rotation',
    calculateMatrix: function () {
      var t = this.rotation * Math.PI,
        i = e.util.cos(t),
        r = e.util.sin(t),
        n = 1 / 3,
        o = Math.sqrt(n) * r,
        a = 1 - i;
      (this.matrix = [
        1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0
      ]),
        (this.matrix[0] = i + a / 3),
        (this.matrix[1] = n * a - o),
        (this.matrix[2] = n * a + o),
        (this.matrix[5] = n * a + o),
        (this.matrix[6] = i + n * a),
        (this.matrix[7] = n * a - o),
        (this.matrix[10] = n * a - o),
        (this.matrix[11] = n * a + o),
        (this.matrix[12] = i + n * a);
    },
    isNeutralState: function (t) {
      return (
        this.calculateMatrix(),
        i.BaseFilter.prototype.isNeutralState.call(this, t)
      );
    },
    applyTo: function (t) {
      this.calculateMatrix(), i.BaseFilter.prototype.applyTo.call(this, t);
    }
  })),
    (e.Image.filters.HueRotation.fromObject =
      e.Image.filters.BaseFilter.fromObject);
})('undefined' != typeof exports ? exports : this);
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {}),
    i = e.util.object.clone;
  if (e.Text) return void e.warn('fabric.Text is already defined');
  var r =
    'fontFamily fontWeight fontSize text underline overline linethrough textAlign fontStyle lineHeight textBackgroundColor charSpacing styles direction path pathStartOffset pathSide pathAlign'.split(
      ' '
    );
  (e.Text = e.util.createClass(e.Object, {
    _dimensionAffectingProps: [
      'fontSize',
      'fontWeight',
      'fontFamily',
      'fontStyle',
      'lineHeight',
      'text',
      'charSpacing',
      'textAlign',
      'styles',
      'path',
      'pathStartOffset',
      'pathSide',
      'pathAlign'
    ],
    _reNewline: /\r?\n/,
    _reSpacesAndTabs: /[ \t\r]/g,
    _reSpaceAndTab: /[ \t\r]/,
    _reWords: /\S+/g,
    type: 'text',
    fontSize: 40,
    fontWeight: 'normal',
    fontFamily: 'Times New Roman',
    underline: !1,
    overline: !1,
    linethrough: !1,
    textAlign: 'left',
    fontStyle: 'normal',
    lineHeight: 1.16,
    superscript: { size: 0.6, baseline: -0.35 },
    subscript: { size: 0.6, baseline: 0.11 },
    textBackgroundColor: '',
    stateProperties: e.Object.prototype.stateProperties.concat(r),
    cacheProperties: e.Object.prototype.cacheProperties.concat(r),
    stroke: null,
    shadow: null,
    path: null,
    pathStartOffset: 0,
    pathSide: 'left',
    pathAlign: 'baseline',
    _fontSizeFraction: 0.222,
    offsets: { underline: 0.1, linethrough: -0.315, overline: -0.88 },
    _fontSizeMult: 1.13,
    charSpacing: 0,
    styles: null,
    _measuringContext: null,
    deltaY: 0,
    direction: 'ltr',
    _styleProperties: [
      'stroke',
      'strokeWidth',
      'fill',
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontStyle',
      'underline',
      'overline',
      'linethrough',
      'deltaY',
      'textBackgroundColor'
    ],
    __charBounds: [],
    CACHE_FONT_SIZE: 400,
    MIN_TEXT_WIDTH: 2,
    initialize: function (t, e) {
      (this.styles = e ? e.styles || {} : {}),
        (this.text = t),
        (this.__skipDimension = !0),
        this.callSuper('initialize', e),
        this.path && this.setPathInfo(),
        (this.__skipDimension = !1),
        this.initDimensions(),
        this.setCoords(),
        this.setupState({ propertySet: '_dimensionAffectingProps' });
    },
    setPathInfo: function () {
      var t = this.path;
      t && (t.segmentsInfo = e.util.getPathSegmentsInfo(t.path));
    },
    getMeasuringContext: function () {
      return (
        e._measuringContext ||
          (e._measuringContext =
            (this.canvas && this.canvas.contextCache) ||
            e.util.createCanvasElement().getContext('2d')),
        e._measuringContext
      );
    },
    _splitText: function () {
      var t = this._splitTextIntoLines(this.text);
      return (
        (this.textLines = t.lines),
        (this._textLines = t.graphemeLines),
        (this._unwrappedTextLines = t._unwrappedLines),
        (this._text = t.graphemeText),
        t
      );
    },
    initDimensions: function () {
      this.__skipDimension ||
        (this._splitText(),
        this._clearCache(),
        this.path
          ? ((this.width = this.path.width), (this.height = this.path.height))
          : ((this.width =
              this.calcTextWidth() || this.cursorWidth || this.MIN_TEXT_WIDTH),
            (this.height = this.calcTextHeight())),
        -1 !== this.textAlign.indexOf('justify') && this.enlargeSpaces(),
        this.saveState({ propertySet: '_dimensionAffectingProps' }));
    },
    enlargeSpaces: function () {
      for (
        var t, e, i, r, n, o, a, s = 0, c = this._textLines.length;
        c > s;
        s++
      )
        if (
          ('justify' === this.textAlign ||
            (s !== c - 1 && !this.isEndOfWrapping(s))) &&
          ((r = 0),
          (n = this._textLines[s]),
          (e = this.getLineWidth(s)),
          e < this.width &&
            (a = this.textLines[s].match(this._reSpacesAndTabs)))
        ) {
          (i = a.length), (t = (this.width - e) / i);
          for (var h = 0, l = n.length; l >= h; h++)
            (o = this.__charBounds[s][h]),
              this._reSpaceAndTab.test(n[h])
                ? ((o.width += t),
                  (o.kernedWidth += t),
                  (o.left += r),
                  (r += t))
                : (o.left += r);
        }
    },
    isEndOfWrapping: function (t) {
      return t === this._textLines.length - 1;
    },
    missingNewlineOffset: function () {
      return 1;
    },
    toString: function () {
      return (
        '#<fabric.Text (' +
        this.complexity() +
        '): { "text": "' +
        this.text +
        '", "fontFamily": "' +
        this.fontFamily +
        '" }>'
      );
    },
    _getCacheCanvasDimensions: function () {
      var t = this.callSuper('_getCacheCanvasDimensions'),
        e = this.fontSize;
      return (t.width += e * t.zoomX), (t.height += e * t.zoomY), t;
    },
    _render: function (t) {
      var e = this.path;
      e && !e.isNotVisible() && e._render(t),
        this._setTextStyles(t),
        this._renderTextLinesBackground(t),
        this._renderTextDecoration(t, 'underline'),
        this._renderText(t),
        this._renderTextDecoration(t, 'overline'),
        this._renderTextDecoration(t, 'linethrough');
    },
    _renderText: function (t) {
      'stroke' === this.paintFirst
        ? (this._renderTextStroke(t), this._renderTextFill(t))
        : (this._renderTextFill(t), this._renderTextStroke(t));
    },
    _setTextStyles: function (t, e, i) {
      if (((t.textBaseline = 'alphabetical'), this.path))
        switch (this.pathAlign) {
          case 'center':
            t.textBaseline = 'middle';
            break;
          case 'ascender':
            t.textBaseline = 'top';
            break;
          case 'descender':
            t.textBaseline = 'bottom';
        }
      t.font = this._getFontDeclaration(e, i);
    },
    calcTextWidth: function () {
      for (
        var t = this.getLineWidth(0), e = 1, i = this._textLines.length;
        i > e;
        e++
      ) {
        var r = this.getLineWidth(e);
        r > t && (t = r);
      }
      return t;
    },
    _renderTextLine: function (t, e, i, r, n, o) {
      this._renderChars(t, e, i, r, n, o);
    },
    _renderTextLinesBackground: function (t) {
      if (this.textBackgroundColor || this.styleHas('textBackgroundColor')) {
        for (
          var e,
            i,
            r,
            n,
            o,
            a,
            s,
            c = t.fillStyle,
            h = this._getLeftOffset(),
            l = this._getTopOffset(),
            u = 0,
            f = 0,
            d = this.path,
            g = 0,
            p = this._textLines.length;
          p > g;
          g++
        )
          if (
            ((e = this.getHeightOfLine(g)),
            this.textBackgroundColor || this.styleHas('textBackgroundColor', g))
          ) {
            (r = this._textLines[g]),
              (i = this._getLineLeftOffset(g)),
              (f = 0),
              (u = 0),
              (n = this.getValueOfPropertyAt(g, 0, 'textBackgroundColor'));
            for (var v = 0, m = r.length; m > v; v++)
              (o = this.__charBounds[g][v]),
                (a = this.getValueOfPropertyAt(g, v, 'textBackgroundColor')),
                d
                  ? (t.save(),
                    t.translate(o.renderLeft, o.renderTop),
                    t.rotate(o.angle),
                    (t.fillStyle = a),
                    a &&
                      t.fillRect(
                        -o.width / 2,
                        (-e / this.lineHeight) * (1 - this._fontSizeFraction),
                        o.width,
                        e / this.lineHeight
                      ),
                    t.restore())
                  : a !== n
                  ? ((s = h + i + u),
                    'rtl' === this.direction && (s = this.width - s - f),
                    (t.fillStyle = n),
                    n && t.fillRect(s, l, f, e / this.lineHeight),
                    (u = o.left),
                    (f = o.width),
                    (n = a))
                  : (f += o.kernedWidth);
            a &&
              !d &&
              ((s = h + i + u),
              'rtl' === this.direction && (s = this.width - s - f),
              (t.fillStyle = a),
              t.fillRect(s, l, f, e / this.lineHeight)),
              (l += e);
          } else l += e;
        (t.fillStyle = c), this._removeShadow(t);
      }
    },
    getFontCache: function (t) {
      var i = t.fontFamily.toLowerCase();
      e.charWidthsCache[i] || (e.charWidthsCache[i] = {});
      var r = e.charWidthsCache[i],
        n = t.fontStyle.toLowerCase() + '_' + (t.fontWeight + '').toLowerCase();
      return r[n] || (r[n] = {}), r[n];
    },
    _measureChar: function (t, e, i, r) {
      var n,
        o,
        a,
        s,
        c = this.getFontCache(e),
        h = this._getFontDeclaration(e),
        l = this._getFontDeclaration(r),
        u = i + t,
        f = h === l,
        d = e.fontSize / this.CACHE_FONT_SIZE;
      if (
        (i && void 0 !== c[i] && (a = c[i]),
        void 0 !== c[t] && (s = n = c[t]),
        f && void 0 !== c[u] && ((o = c[u]), (s = o - a)),
        void 0 === n || void 0 === a || void 0 === o)
      ) {
        var g = this.getMeasuringContext();
        this._setTextStyles(g, e, !0);
      }
      return (
        void 0 === n && ((s = n = g.measureText(t).width), (c[t] = n)),
        void 0 === a && f && i && ((a = g.measureText(i).width), (c[i] = a)),
        f &&
          void 0 === o &&
          ((o = g.measureText(u).width), (c[u] = o), (s = o - a)),
        { width: n * d, kernedWidth: s * d }
      );
    },
    getHeightOfChar: function (t, e) {
      return this.getValueOfPropertyAt(t, e, 'fontSize');
    },
    measureLine: function (t) {
      var e = this._measureLine(t);
      return (
        0 !== this.charSpacing && (e.width -= this._getWidthOfCharSpacing()),
        e.width < 0 && (e.width = 0),
        e
      );
    },
    _measureLine: function (t) {
      var i,
        r,
        n,
        o,
        a,
        s,
        c = 0,
        h = this._textLines[t],
        l = 0,
        u = new Array(h.length),
        f = 0,
        d = this.path,
        g = 'right' === this.pathSide;
      for (this.__charBounds[t] = u, i = 0; i < h.length; i++)
        (r = h[i]),
          (o = this._getGraphemeBox(r, t, i, n)),
          (u[i] = o),
          (c += o.kernedWidth),
          (n = r);
      if (
        ((u[i] = {
          left: o ? o.left + o.width : 0,
          width: 0,
          kernedWidth: 0,
          height: this.fontSize
        }),
        d)
      ) {
        switch (
          ((s = d.segmentsInfo[d.segmentsInfo.length - 1].length),
          (a = e.util.getPointOnPath(d.path, 0, d.segmentsInfo)),
          (a.x += d.pathOffset.x),
          (a.y += d.pathOffset.y),
          this.textAlign)
        ) {
          case 'left':
            f = g ? s - c : 0;
            break;
          case 'center':
            f = (s - c) / 2;
            break;
          case 'right':
            f = g ? 0 : s - c;
        }
        for (
          f += this.pathStartOffset * (g ? -1 : 1), i = g ? h.length - 1 : 0;
          g ? i >= 0 : i < h.length;
          g ? i-- : i++
        )
          (o = u[i]),
            f > s ? (f %= s) : 0 > f && (f += s),
            this._setGraphemeOnPath(f, o, a),
            (f += o.kernedWidth);
      }
      return { width: c, numOfSpaces: l };
    },
    _setGraphemeOnPath: function (t, i, r) {
      var n = t + i.kernedWidth / 2,
        o = this.path,
        a = e.util.getPointOnPath(o.path, n, o.segmentsInfo);
      (i.renderLeft = a.x - r.x),
        (i.renderTop = a.y - r.y),
        (i.angle = a.angle + ('right' === this.pathSide ? Math.PI : 0));
    },
    _getGraphemeBox: function (t, e, i, r, n) {
      var o,
        a = this.getCompleteStyleDeclaration(e, i),
        s = r ? this.getCompleteStyleDeclaration(e, i - 1) : {},
        c = this._measureChar(t, a, r, s),
        h = c.kernedWidth,
        l = c.width;
      0 !== this.charSpacing &&
        ((o = this._getWidthOfCharSpacing()), (l += o), (h += o));
      var u = {
        width: l,
        left: 0,
        height: a.fontSize,
        kernedWidth: h,
        deltaY: a.deltaY
      };
      if (i > 0 && !n) {
        var f = this.__charBounds[e][i - 1];
        u.left = f.left + f.width + c.kernedWidth - c.width;
      }
      return u;
    },
    getHeightOfLine: function (t) {
      if (this.__lineHeights[t]) return this.__lineHeights[t];
      for (
        var e = this._textLines[t],
          i = this.getHeightOfChar(t, 0),
          r = 1,
          n = e.length;
        n > r;
        r++
      )
        i = Math.max(this.getHeightOfChar(t, r), i);
      return (this.__lineHeights[t] = i * this.lineHeight * this._fontSizeMult);
    },
    calcTextHeight: function () {
      for (var t, e = 0, i = 0, r = this._textLines.length; r > i; i++)
        (t = this.getHeightOfLine(i)),
          (e += i === r - 1 ? t / this.lineHeight : t);
      return e;
    },
    _getLeftOffset: function () {
      return 'ltr' === this.direction ? -this.width / 2 : this.width / 2;
    },
    _getTopOffset: function () {
      return -this.height / 2;
    },
    _renderTextCommon: function (t, e) {
      t.save();
      for (
        var i = 0,
          r = this._getLeftOffset(),
          n = this._getTopOffset(),
          o = 0,
          a = this._textLines.length;
        a > o;
        o++
      ) {
        var s = this.getHeightOfLine(o),
          c = s / this.lineHeight,
          h = this._getLineLeftOffset(o);
        this._renderTextLine(e, t, this._textLines[o], r + h, n + i + c, o),
          (i += s);
      }
      t.restore();
    },
    _renderTextFill: function (t) {
      (this.fill || this.styleHas('fill')) &&
        this._renderTextCommon(t, 'fillText');
    },
    _renderTextStroke: function (t) {
      ((this.stroke && 0 !== this.strokeWidth) || !this.isEmptyStyles()) &&
        (this.shadow && !this.shadow.affectStroke && this._removeShadow(t),
        t.save(),
        this._setLineDash(t, this.strokeDashArray),
        t.beginPath(),
        this._renderTextCommon(t, 'strokeText'),
        t.closePath(),
        t.restore());
    },
    _renderChars: function (t, i, r, n, o, a) {
      var s,
        c,
        h,
        l,
        u,
        f = this.getHeightOfLine(a),
        d = -1 !== this.textAlign.indexOf('justify'),
        g = '',
        p = 0,
        v = this.path,
        m = !d && 0 === this.charSpacing && this.isEmptyStyles(a) && !v,
        b = 'ltr' === this.direction,
        y = 'ltr' === this.direction ? 1 : -1,
        _ = i.canvas.getAttribute('dir');
      if (
        (i.save(),
        _ !== this.direction &&
          (i.canvas.setAttribute('dir', b ? 'ltr' : 'rtl'),
          (i.direction = b ? 'ltr' : 'rtl'),
          (i.textAlign = b ? 'left' : 'right')),
        (o -= (f * this._fontSizeFraction) / this.lineHeight),
        m)
      )
        return (
          this._renderChar(t, i, a, 0, r.join(''), n, o, f), void i.restore()
        );
      for (var x = 0, C = r.length - 1; C >= x; x++)
        (l = x === C || this.charSpacing || v),
          (g += r[x]),
          (h = this.__charBounds[a][x]),
          0 === p
            ? ((n += y * (h.kernedWidth - h.width)), (p += h.width))
            : (p += h.kernedWidth),
          d && !l && this._reSpaceAndTab.test(r[x]) && (l = !0),
          l ||
            ((s = s || this.getCompleteStyleDeclaration(a, x)),
            (c = this.getCompleteStyleDeclaration(a, x + 1)),
            (l = e.util.hasStyleChanged(s, c, !1))),
          l &&
            (v
              ? (i.save(),
                i.translate(h.renderLeft, h.renderTop),
                i.rotate(h.angle),
                this._renderChar(t, i, a, x, g, -p / 2, 0, f),
                i.restore())
              : ((u = n), this._renderChar(t, i, a, x, g, u, o, f)),
            (g = ''),
            (s = c),
            (n += y * p),
            (p = 0));
      i.restore();
    },
    _applyPatternGradientTransformText: function (t) {
      var i,
        r = e.util.createCanvasElement(),
        n = this.width + this.strokeWidth,
        o = this.height + this.strokeWidth;
      return (
        (r.width = n),
        (r.height = o),
        (i = r.getContext('2d')),
        i.beginPath(),
        i.moveTo(0, 0),
        i.lineTo(n, 0),
        i.lineTo(n, o),
        i.lineTo(0, o),
        i.closePath(),
        i.translate(n / 2, o / 2),
        (i.fillStyle = t.toLive(i)),
        this._applyPatternGradientTransform(i, t),
        i.fill(),
        i.createPattern(r, 'no-repeat')
      );
    },
    handleFiller: function (t, e, i) {
      var r, n;
      return i.toLive
        ? 'percentage' === i.gradientUnits ||
          i.gradientTransform ||
          i.patternTransform
          ? ((r = -this.width / 2),
            (n = -this.height / 2),
            t.translate(r, n),
            (t[e] = this._applyPatternGradientTransformText(i)),
            { offsetX: r, offsetY: n })
          : ((t[e] = i.toLive(t, this)),
            this._applyPatternGradientTransform(t, i))
        : ((t[e] = i), { offsetX: 0, offsetY: 0 });
    },
    _setStrokeStyles: function (t, e) {
      return (
        (t.lineWidth = e.strokeWidth),
        (t.lineCap = this.strokeLineCap),
        (t.lineDashOffset = this.strokeDashOffset),
        (t.lineJoin = this.strokeLineJoin),
        (t.miterLimit = this.strokeMiterLimit),
        this.handleFiller(t, 'strokeStyle', e.stroke)
      );
    },
    _setFillStyles: function (t, e) {
      return this.handleFiller(t, 'fillStyle', e.fill);
    },
    _renderChar: function (t, e, i, r, n, o, a) {
      var s,
        c,
        h = this._getStyleDeclaration(i, r),
        l = this.getCompleteStyleDeclaration(i, r),
        u = 'fillText' === t && l.fill,
        f = 'strokeText' === t && l.stroke && l.strokeWidth;
      (f || u) &&
        (e.save(),
        u && (s = this._setFillStyles(e, l)),
        f && (c = this._setStrokeStyles(e, l)),
        (e.font = this._getFontDeclaration(l)),
        h && h.textBackgroundColor && this._removeShadow(e),
        h && h.deltaY && (a += h.deltaY),
        u && e.fillText(n, o - s.offsetX, a - s.offsetY),
        f && e.strokeText(n, o - c.offsetX, a - c.offsetY),
        e.restore());
    },
    setSuperscript: function (t, e) {
      return this._setScript(t, e, this.superscript);
    },
    setSubscript: function (t, e) {
      return this._setScript(t, e, this.subscript);
    },
    _setScript: function (t, e, i) {
      var r = this.get2DCursorLocation(t, !0),
        n = this.getValueOfPropertyAt(r.lineIndex, r.charIndex, 'fontSize'),
        o = this.getValueOfPropertyAt(r.lineIndex, r.charIndex, 'deltaY'),
        a = { fontSize: n * i.size, deltaY: o + n * i.baseline };
      return this.setSelectionStyles(a, t, e), this;
    },
    _getLineLeftOffset: function (t) {
      var e,
        i = this.getLineWidth(t),
        r = this.width - i,
        n = this.textAlign,
        o = this.direction,
        a = 0,
        e = this.isEndOfWrapping(t);
      return 'justify' === n ||
        ('justify-center' === n && !e) ||
        ('justify-right' === n && !e) ||
        ('justify-left' === n && !e)
        ? 0
        : ('center' === n && (a = r / 2),
          'right' === n && (a = r),
          'justify-center' === n && (a = r / 2),
          'justify-right' === n && (a = r),
          'rtl' === o && (a -= r),
          a);
    },
    _clearCache: function () {
      (this.__lineWidths = []),
        (this.__lineHeights = []),
        (this.__charBounds = []);
    },
    _shouldClearDimensionCache: function () {
      var t = this._forceClearCache;
      return (
        t || (t = this.hasStateChanged('_dimensionAffectingProps')),
        t && ((this.dirty = !0), (this._forceClearCache = !1)),
        t
      );
    },
    getLineWidth: function (t) {
      if (void 0 !== this.__lineWidths[t]) return this.__lineWidths[t];
      var e = this.measureLine(t),
        i = e.width;
      return (this.__lineWidths[t] = i), i;
    },
    _getWidthOfCharSpacing: function () {
      return 0 !== this.charSpacing
        ? (this.fontSize * this.charSpacing) / 1e3
        : 0;
    },
    getValueOfPropertyAt: function (t, e, i) {
      var r = this._getStyleDeclaration(t, e);
      return r && 'undefined' != typeof r[i] ? r[i] : this[i];
    },
    _renderTextDecoration: function (t, e) {
      if (this[e] || this.styleHas(e)) {
        for (
          var i,
            r,
            n,
            o,
            a,
            s,
            c,
            h,
            l,
            u,
            f,
            d,
            g,
            p,
            v,
            m,
            b = this._getLeftOffset(),
            y = this._getTopOffset(),
            _ = this.path,
            x = this._getWidthOfCharSpacing(),
            C = this.offsets[e],
            w = 0,
            S = this._textLines.length;
          S > w;
          w++
        )
          if (((i = this.getHeightOfLine(w)), this[e] || this.styleHas(e, w))) {
            (c = this._textLines[w]),
              (p = i / this.lineHeight),
              (o = this._getLineLeftOffset(w)),
              (u = 0),
              (f = 0),
              (h = this.getValueOfPropertyAt(w, 0, e)),
              (m = this.getValueOfPropertyAt(w, 0, 'fill')),
              (l = y + p * (1 - this._fontSizeFraction)),
              (r = this.getHeightOfChar(w, 0)),
              (a = this.getValueOfPropertyAt(w, 0, 'deltaY'));
            for (var T = 0, O = c.length; O > T; T++)
              if (
                ((d = this.__charBounds[w][T]),
                (g = this.getValueOfPropertyAt(w, T, e)),
                (v = this.getValueOfPropertyAt(w, T, 'fill')),
                (n = this.getHeightOfChar(w, T)),
                (s = this.getValueOfPropertyAt(w, T, 'deltaY')),
                _ && g && v)
              )
                t.save(),
                  (t.fillStyle = m),
                  t.translate(d.renderLeft, d.renderTop),
                  t.rotate(d.angle),
                  t.fillRect(
                    -d.kernedWidth / 2,
                    C * n + s,
                    d.kernedWidth,
                    this.fontSize / 15
                  ),
                  t.restore();
              else if ((g !== h || v !== m || n !== r || s !== a) && f > 0) {
                var P = b + o + u;
                'rtl' === this.direction && (P = this.width - P - f),
                  h &&
                    m &&
                    ((t.fillStyle = m),
                    t.fillRect(P, l + C * r + a, f, this.fontSize / 15)),
                  (u = d.left),
                  (f = d.width),
                  (h = g),
                  (m = v),
                  (r = n),
                  (a = s);
              } else f += d.kernedWidth;
            var P = b + o + u;
            'rtl' === this.direction && (P = this.width - P - f),
              (t.fillStyle = v),
              g && v && t.fillRect(P, l + C * r + a, f - x, this.fontSize / 15),
              (y += i);
          } else y += i;
        this._removeShadow(t);
      }
    },
    _getFontDeclaration: function (t, i) {
      var r = t || this,
        n = this.fontFamily,
        o = e.Text.genericFonts.indexOf(n.toLowerCase()) > -1,
        a =
          void 0 === n ||
          n.indexOf("'") > -1 ||
          n.indexOf(',') > -1 ||
          n.indexOf('"') > -1 ||
          o
            ? r.fontFamily
            : '"' + r.fontFamily + '"';
      return [
        e.isLikelyNode ? r.fontWeight : r.fontStyle,
        e.isLikelyNode ? r.fontStyle : r.fontWeight,
        i ? this.CACHE_FONT_SIZE + 'px' : r.fontSize + 'px',
        a
      ].join(' ');
    },
    render: function (t) {
      this.visible &&
        (!this.canvas ||
          !this.canvas.skipOffscreen ||
          this.group ||
          this.isOnScreen()) &&
        (this._shouldClearDimensionCache() && this.initDimensions(),
        this.callSuper('render', t));
    },
    _splitTextIntoLines: function (t) {
      for (
        var i = t.split(this._reNewline),
          r = new Array(i.length),
          n = ['\n'],
          o = [],
          a = 0;
        a < i.length;
        a++
      )
        (r[a] = e.util.string.graphemeSplit(i[a])), (o = o.concat(r[a], n));
      return (
        o.pop(),
        { _unwrappedLines: r, lines: i, graphemeText: o, graphemeLines: r }
      );
    },
    toObject: function (t) {
      var i = r.concat(t),
        n = this.callSuper('toObject', i);
      return (
        (n.styles = e.util.stylesToArray(this.styles, this.text)),
        n.path && (n.path = this.path.toObject()),
        n
      );
    },
    set: function (t, e) {
      this.callSuper('set', t, e);
      var i = !1,
        r = !1;
      if ('object' == typeof t)
        for (var n in t)
          'path' === n && this.setPathInfo(),
            (i = i || -1 !== this._dimensionAffectingProps.indexOf(n)),
            (r = r || 'path' === n);
      else
        (i = -1 !== this._dimensionAffectingProps.indexOf(t)),
          (r = 'path' === t);
      return (
        r && this.setPathInfo(),
        i && (this.initDimensions(), this.setCoords()),
        this
      );
    },
    complexity: function () {
      return 1;
    }
  })),
    (e.Text.ATTRIBUTE_NAMES = e.SHARED_ATTRIBUTES.concat(
      'x y dx dy font-family font-style font-weight font-size letter-spacing text-decoration text-anchor'.split(
        ' '
      )
    )),
    (e.Text.DEFAULT_SVG_FONT_SIZE = 16),
    (e.Text.fromElement = function (t, r, n) {
      if (!t) return r(null);
      var o = e.parseAttributes(t, e.Text.ATTRIBUTE_NAMES),
        a = o.textAnchor || 'left';
      if (
        ((n = e.util.object.extend(n ? i(n) : {}, o)),
        (n.top = n.top || 0),
        (n.left = n.left || 0),
        o.textDecoration)
      ) {
        var s = o.textDecoration;
        -1 !== s.indexOf('underline') && (n.underline = !0),
          -1 !== s.indexOf('overline') && (n.overline = !0),
          -1 !== s.indexOf('line-through') && (n.linethrough = !0),
          delete n.textDecoration;
      }
      'dx' in o && (n.left += o.dx),
        'dy' in o && (n.top += o.dy),
        'fontSize' in n || (n.fontSize = e.Text.DEFAULT_SVG_FONT_SIZE);
      var c = '';
      'textContent' in t
        ? (c = t.textContent)
        : 'firstChild' in t &&
          null !== t.firstChild &&
          'data' in t.firstChild &&
          null !== t.firstChild.data &&
          (c = t.firstChild.data),
        (c = c.replace(/^\s+|\s+$|\n+/g, '').replace(/\s+/g, ' '));
      var h = n.strokeWidth;
      n.strokeWidth = 0;
      var l = new e.Text(c, n),
        u = l.getScaledHeight() / l.height,
        f = (l.height + l.strokeWidth) * l.lineHeight - l.height,
        d = f * u,
        g = l.getScaledHeight() + d,
        p = 0;
      'center' === a && (p = l.getScaledWidth() / 2),
        'right' === a && (p = l.getScaledWidth()),
        l.set({
          left: l.left - p,
          top:
            l.top -
            (g - l.fontSize * (0.07 + l._fontSizeFraction)) / l.lineHeight,
          strokeWidth: 'undefined' != typeof h ? h : 1
        }),
        r(l);
    }),
    (e.Text.fromObject = function (t, r) {
      var n = i(t),
        o = t.path;
      return (
        delete n.path,
        e.Object._fromObject(
          'Text',
          n,
          function (i) {
            (i.styles = e.util.stylesFromArray(t.styles, t.text)),
              o
                ? e.Object._fromObject(
                    'Path',
                    o,
                    function (t) {
                      i.set('path', t), r(i);
                    },
                    'path'
                  )
                : r(i);
          },
          'text'
        )
      );
    }),
    (e.Text.genericFonts = [
      'sans-serif',
      'serif',
      'cursive',
      'fantasy',
      'monospace'
    ]),
    e.util.createAccessors && e.util.createAccessors(e.Text);
})('undefined' != typeof exports ? exports : this);
!(function () {
  fabric.util.object.extend(fabric.Text.prototype, {
    isEmptyStyles: function (t) {
      if (!this.styles) return !0;
      if ('undefined' != typeof t && !this.styles[t]) return !0;
      var e = 'undefined' == typeof t ? this.styles : { line: this.styles[t] };
      for (var i in e) for (var r in e[i]) for (var n in e[i][r]) return !1;
      return !0;
    },
    styleHas: function (t, e) {
      if (!this.styles || !t || '' === t) return !1;
      if ('undefined' != typeof e && !this.styles[e]) return !1;
      var i = 'undefined' == typeof e ? this.styles : { 0: this.styles[e] };
      for (var r in i)
        for (var n in i[r]) if ('undefined' != typeof i[r][n][t]) return !0;
      return !1;
    },
    cleanStyle: function (t) {
      if (!this.styles || !t || '' === t) return !1;
      var e,
        i,
        r,
        n = this.styles,
        o = 0,
        s = !0,
        a = 0;
      for (var c in n) {
        e = 0;
        for (var h in n[c]) {
          var r = n[c][h],
            l = r.hasOwnProperty(t);
          o++,
            l
              ? (i ? r[t] !== i && (s = !1) : (i = r[t]),
                r[t] === this[t] && delete r[t])
              : (s = !1),
            0 !== Object.keys(r).length ? e++ : delete n[c][h];
        }
        0 === e && delete n[c];
      }
      for (var u = 0; u < this._textLines.length; u++)
        a += this._textLines[u].length;
      s && o === a && ((this[t] = i), this.removeStyle(t));
    },
    removeStyle: function (t) {
      if (this.styles && t && '' !== t) {
        var e,
          i,
          r,
          n = this.styles;
        for (i in n) {
          e = n[i];
          for (r in e)
            delete e[r][t], 0 === Object.keys(e[r]).length && delete e[r];
          0 === Object.keys(e).length && delete n[i];
        }
      }
    },
    _extendStyles: function (t, e) {
      var i = this.get2DCursorLocation(t);
      this._getLineStyle(i.lineIndex) || this._setLineStyle(i.lineIndex),
        this._getStyleDeclaration(i.lineIndex, i.charIndex) ||
          this._setStyleDeclaration(i.lineIndex, i.charIndex, {}),
        fabric.util.object.extend(
          this._getStyleDeclaration(i.lineIndex, i.charIndex),
          e
        );
    },
    get2DCursorLocation: function (t, e) {
      'undefined' == typeof t && (t = this.selectionStart);
      for (
        var i = e ? this._unwrappedTextLines : this._textLines,
          r = i.length,
          n = 0;
        r > n;
        n++
      ) {
        if (t <= i[n].length) return { lineIndex: n, charIndex: t };
        t -= i[n].length + this.missingNewlineOffset(n);
      }
      return {
        lineIndex: n - 1,
        charIndex: i[n - 1].length < t ? i[n - 1].length : t
      };
    },
    getSelectionStyles: function (t, e, i) {
      'undefined' == typeof t && (t = this.selectionStart || 0),
        'undefined' == typeof e && (e = this.selectionEnd || t);
      for (var r = [], n = t; e > n; n++) r.push(this.getStyleAtPosition(n, i));
      return r;
    },
    getStyleAtPosition: function (t, e) {
      var i = this.get2DCursorLocation(t),
        r = e
          ? this.getCompleteStyleDeclaration(i.lineIndex, i.charIndex)
          : this._getStyleDeclaration(i.lineIndex, i.charIndex);
      return r || {};
    },
    setSelectionStyles: function (t, e, i) {
      'undefined' == typeof e && (e = this.selectionStart || 0),
        'undefined' == typeof i && (i = this.selectionEnd || e);
      for (var r = e; i > r; r++) this._extendStyles(r, t);
      return (this._forceClearCache = !0), this;
    },
    _getStyleDeclaration: function (t, e) {
      var i = this.styles && this.styles[t];
      return i ? i[e] : null;
    },
    getCompleteStyleDeclaration: function (t, e) {
      for (
        var i, r = this._getStyleDeclaration(t, e) || {}, n = {}, o = 0;
        o < this._styleProperties.length;
        o++
      )
        (i = this._styleProperties[o]),
          (n[i] = 'undefined' == typeof r[i] ? this[i] : r[i]);
      return n;
    },
    _setStyleDeclaration: function (t, e, i) {
      this.styles[t][e] = i;
    },
    _deleteStyleDeclaration: function (t, e) {
      delete this.styles[t][e];
    },
    _getLineStyle: function (t) {
      return !!this.styles[t];
    },
    _setLineStyle: function (t) {
      this.styles[t] = {};
    },
    _deleteLineStyle: function (t) {
      delete this.styles[t];
    }
  });
})();
!(function () {
  function t(t) {
    t.textDecoration &&
      (t.textDecoration.indexOf('underline') > -1 && (t.underline = !0),
      t.textDecoration.indexOf('line-through') > -1 && (t.linethrough = !0),
      t.textDecoration.indexOf('overline') > -1 && (t.overline = !0),
      delete t.textDecoration);
  }
  (fabric.IText = fabric.util.createClass(fabric.Text, fabric.Observable, {
    type: 'i-text',
    selectionStart: 0,
    selectionEnd: 0,
    selectionColor: 'rgba(17,119,255,0.3)',
    isEditing: !1,
    editable: !0,
    editingBorderColor: 'rgba(102,153,255,0.25)',
    cursorWidth: 2,
    cursorColor: '',
    cursorDelay: 1e3,
    cursorDuration: 600,
    caching: !0,
    hiddenTextareaContainer: null,
    _reSpace: /\s|\n/,
    _currentCursorOpacity: 0,
    _selectionDirection: null,
    _abortCursorAnimation: !1,
    __widthOfSpace: [],
    inCompositionMode: !1,
    initialize: function (t, e) {
      this.callSuper('initialize', t, e), this.initBehavior();
    },
    setSelectionStart: function (t) {
      (t = Math.max(t, 0)), this._updateAndFire('selectionStart', t);
    },
    setSelectionEnd: function (t) {
      (t = Math.min(t, this.text.length)),
        this._updateAndFire('selectionEnd', t);
    },
    _updateAndFire: function (t, e) {
      this[t] !== e && (this._fireSelectionChanged(), (this[t] = e)),
        this._updateTextarea();
    },
    _fireSelectionChanged: function () {
      this.fire('selection:changed'),
        this.canvas &&
          this.canvas.fire('text:selection:changed', { target: this });
    },
    initDimensions: function () {
      this.isEditing && this.initDelayedCursor(),
        this.clearContextTop(),
        this.callSuper('initDimensions');
    },
    render: function (t) {
      this.clearContextTop(),
        this.callSuper('render', t),
        (this.cursorOffsetCache = {}),
        this.renderCursorOrSelection();
    },
    _render: function (t) {
      this.callSuper('_render', t);
    },
    clearContextTop: function (t) {
      if (this.isEditing && this.canvas && this.canvas.contextTop) {
        var e = this.canvas.contextTop,
          i = this.canvas.viewportTransform;
        e.save(),
          e.transform(i[0], i[1], i[2], i[3], i[4], i[5]),
          this.transform(e),
          this._clearTextArea(e),
          t || e.restore();
      }
    },
    renderCursorOrSelection: function () {
      if (this.isEditing && this.canvas && this.canvas.contextTop) {
        var t = this._getCursorBoundaries(),
          e = this.canvas.contextTop;
        this.clearContextTop(!0),
          this.selectionStart === this.selectionEnd
            ? this.renderCursor(t, e)
            : this.renderSelection(t, e),
          e.restore();
      }
    },
    _clearTextArea: function (t) {
      var e = this.width + 4,
        i = this.height + 4;
      t.clearRect(-e / 2, -i / 2, e, i);
    },
    _getCursorBoundaries: function (t) {
      'undefined' == typeof t && (t = this.selectionStart);
      var e = this._getLeftOffset(),
        i = this._getTopOffset(),
        r = this._getCursorBoundariesOffsets(t);
      return { left: e, top: i, leftOffset: r.left, topOffset: r.top };
    },
    _getCursorBoundariesOffsets: function (t) {
      if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache)
        return this.cursorOffsetCache;
      var e,
        i,
        r,
        n,
        o = 0,
        s = 0,
        a = this.get2DCursorLocation(t);
      (r = a.charIndex), (i = a.lineIndex);
      for (var c = 0; i > c; c++) o += this.getHeightOfLine(c);
      e = this._getLineLeftOffset(i);
      var h = this.__charBounds[i][r];
      return (
        h && (s = h.left),
        0 !== this.charSpacing &&
          r === this._textLines[i].length &&
          (s -= this._getWidthOfCharSpacing()),
        (n = { top: o, left: e + (s > 0 ? s : 0) }),
        'rtl' === this.direction && (n.left *= -1),
        (this.cursorOffsetCache = n),
        this.cursorOffsetCache
      );
    },
    renderCursor: function (t, e) {
      var i = this.get2DCursorLocation(),
        r = i.lineIndex,
        n = i.charIndex > 0 ? i.charIndex - 1 : 0,
        o = this.getValueOfPropertyAt(r, n, 'fontSize'),
        s = this.scaleX * this.canvas.getZoom(),
        a = this.cursorWidth / s,
        c = t.topOffset,
        h = this.getValueOfPropertyAt(r, n, 'deltaY');
      (c +=
        ((1 - this._fontSizeFraction) * this.getHeightOfLine(r)) /
          this.lineHeight -
        o * (1 - this._fontSizeFraction)),
        this.inCompositionMode && this.renderSelection(t, e),
        (e.fillStyle =
          this.cursorColor || this.getValueOfPropertyAt(r, n, 'fill')),
        (e.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity),
        e.fillRect(t.left + t.leftOffset - a / 2, c + t.top + h, a, o);
    },
    renderSelection: function (t, e) {
      for (
        var i = this.inCompositionMode
            ? this.hiddenTextarea.selectionStart
            : this.selectionStart,
          r = this.inCompositionMode
            ? this.hiddenTextarea.selectionEnd
            : this.selectionEnd,
          n = -1 !== this.textAlign.indexOf('justify'),
          o = this.get2DCursorLocation(i),
          s = this.get2DCursorLocation(r),
          a = o.lineIndex,
          c = s.lineIndex,
          h = o.charIndex < 0 ? 0 : o.charIndex,
          l = s.charIndex < 0 ? 0 : s.charIndex,
          u = a;
        c >= u;
        u++
      ) {
        var f = this._getLineLeftOffset(u) || 0,
          d = this.getHeightOfLine(u),
          g = 0,
          p = 0,
          v = 0;
        if ((u === a && (p = this.__charBounds[a][h].left), u >= a && c > u))
          v =
            n && !this.isEndOfWrapping(u)
              ? this.width
              : this.getLineWidth(u) || 5;
        else if (u === c)
          if (0 === l) v = this.__charBounds[c][l].left;
          else {
            var m = this._getWidthOfCharSpacing();
            v =
              this.__charBounds[c][l - 1].left +
              this.__charBounds[c][l - 1].width -
              m;
          }
        (g = d),
          (this.lineHeight < 1 || (u === c && this.lineHeight > 1)) &&
            (d /= this.lineHeight);
        var b = t.left + f + p,
          y = v - p,
          _ = d,
          x = 0;
        this.inCompositionMode
          ? ((e.fillStyle = this.compositionColor || 'black'), (_ = 1), (x = d))
          : (e.fillStyle = this.selectionColor),
          'rtl' === this.direction && (b = this.width - b - y),
          e.fillRect(b, t.top + t.topOffset + x, y, _),
          (t.topOffset += g);
      }
    },
    getCurrentCharFontSize: function () {
      var t = this._getCurrentCharIndex();
      return this.getValueOfPropertyAt(t.l, t.c, 'fontSize');
    },
    getCurrentCharColor: function () {
      var t = this._getCurrentCharIndex();
      return this.getValueOfPropertyAt(t.l, t.c, 'fill');
    },
    _getCurrentCharIndex: function () {
      var t = this.get2DCursorLocation(this.selectionStart, !0),
        e = t.charIndex > 0 ? t.charIndex - 1 : 0;
      return { l: t.lineIndex, c: e };
    }
  })),
    (fabric.IText.fromObject = function (e, i) {
      if (
        ((e.styles = fabric.util.stylesFromArray(e.styles, e.text)),
        t(e),
        e.styles)
      )
        for (var r in e.styles) for (var n in e.styles[r]) t(e.styles[r][n]);
      fabric.Object._fromObject('IText', e, i, 'text');
    });
})();
!(function () {
  var t = fabric.util.object.clone;
  fabric.util.object.extend(fabric.IText.prototype, {
    initBehavior: function () {
      this.initAddedHandler(),
        this.initRemovedHandler(),
        this.initCursorSelectionHandlers(),
        this.initDoubleClickSimulation(),
        (this.mouseMoveHandler = this.mouseMoveHandler.bind(this));
    },
    onDeselect: function () {
      this.isEditing && this.exitEditing(), (this.selected = !1);
    },
    initAddedHandler: function () {
      var t = this;
      this.on('added', function () {
        var e = t.canvas;
        e &&
          (e._hasITextHandlers ||
            ((e._hasITextHandlers = !0), t._initCanvasHandlers(e)),
          (e._iTextInstances = e._iTextInstances || []),
          e._iTextInstances.push(t));
      });
    },
    initRemovedHandler: function () {
      var t = this;
      this.on('removed', function () {
        var e = t.canvas;
        e &&
          ((e._iTextInstances = e._iTextInstances || []),
          fabric.util.removeFromArray(e._iTextInstances, t),
          0 === e._iTextInstances.length &&
            ((e._hasITextHandlers = !1), t._removeCanvasHandlers(e)));
      });
    },
    _initCanvasHandlers: function (t) {
      (t._mouseUpITextHandler = function () {
        t._iTextInstances &&
          t._iTextInstances.forEach(function (t) {
            t.__isMousedown = !1;
          });
      }),
        t.on('mouse:up', t._mouseUpITextHandler);
    },
    _removeCanvasHandlers: function (t) {
      t.off('mouse:up', t._mouseUpITextHandler);
    },
    _tick: function () {
      this._currentTickState = this._animateCursor(
        this,
        1,
        this.cursorDuration,
        '_onTickComplete'
      );
    },
    _animateCursor: function (t, e, i, r) {
      var n;
      return (
        (n = {
          isAborted: !1,
          abort: function () {
            this.isAborted = !0;
          }
        }),
        t.animate('_currentCursorOpacity', e, {
          duration: i,
          onComplete: function () {
            n.isAborted || t[r]();
          },
          onChange: function () {
            t.canvas &&
              t.selectionStart === t.selectionEnd &&
              t.renderCursorOrSelection();
          },
          abort: function () {
            return n.isAborted;
          }
        }),
        n
      );
    },
    _onTickComplete: function () {
      var t = this;
      this._cursorTimeout1 && clearTimeout(this._cursorTimeout1),
        (this._cursorTimeout1 = setTimeout(function () {
          t._currentTickCompleteState = t._animateCursor(
            t,
            0,
            this.cursorDuration / 2,
            '_tick'
          );
        }, 100));
    },
    initDelayedCursor: function (t) {
      var e = this,
        i = t ? 0 : this.cursorDelay;
      this.abortCursorAnimation(),
        (this._currentCursorOpacity = 1),
        (this._cursorTimeout2 = setTimeout(function () {
          e._tick();
        }, i));
    },
    abortCursorAnimation: function () {
      var t = this._currentTickState || this._currentTickCompleteState,
        e = this.canvas;
      this._currentTickState && this._currentTickState.abort(),
        this._currentTickCompleteState &&
          this._currentTickCompleteState.abort(),
        clearTimeout(this._cursorTimeout1),
        clearTimeout(this._cursorTimeout2),
        (this._currentCursorOpacity = 0),
        t && e && e.clearContext(e.contextTop || e.contextContainer);
    },
    selectAll: function () {
      return (
        (this.selectionStart = 0),
        (this.selectionEnd = this._text.length),
        this._fireSelectionChanged(),
        this._updateTextarea(),
        this
      );
    },
    getSelectedText: function () {
      return this._text.slice(this.selectionStart, this.selectionEnd).join('');
    },
    findWordBoundaryLeft: function (t) {
      var e = 0,
        i = t - 1;
      if (this._reSpace.test(this._text[i]))
        for (; this._reSpace.test(this._text[i]); ) e++, i--;
      for (; /\S/.test(this._text[i]) && i > -1; ) e++, i--;
      return t - e;
    },
    findWordBoundaryRight: function (t) {
      var e = 0,
        i = t;
      if (this._reSpace.test(this._text[i]))
        for (; this._reSpace.test(this._text[i]); ) e++, i++;
      for (; /\S/.test(this._text[i]) && i < this._text.length; ) e++, i++;
      return t + e;
    },
    findLineBoundaryLeft: function (t) {
      for (var e = 0, i = t - 1; !/\n/.test(this._text[i]) && i > -1; )
        e++, i--;
      return t - e;
    },
    findLineBoundaryRight: function (t) {
      for (
        var e = 0, i = t;
        !/\n/.test(this._text[i]) && i < this._text.length;

      )
        e++, i++;
      return t + e;
    },
    searchWordBoundary: function (t, e) {
      for (
        var i = this._text,
          r = this._reSpace.test(i[t]) ? t - 1 : t,
          n = i[r],
          s = fabric.reNonWord;
        !s.test(n) && r > 0 && r < i.length;

      )
        (r += e), (n = i[r]);
      return s.test(n) && (r += 1 === e ? 0 : 1), r;
    },
    selectWord: function (t) {
      t = t || this.selectionStart;
      var e = this.searchWordBoundary(t, -1),
        i = this.searchWordBoundary(t, 1);
      (this.selectionStart = e),
        (this.selectionEnd = i),
        this._fireSelectionChanged(),
        this._updateTextarea(),
        this.renderCursorOrSelection();
    },
    selectLine: function (t) {
      t = t || this.selectionStart;
      var e = this.findLineBoundaryLeft(t),
        i = this.findLineBoundaryRight(t);
      return (
        (this.selectionStart = e),
        (this.selectionEnd = i),
        this._fireSelectionChanged(),
        this._updateTextarea(),
        this
      );
    },
    enterEditing: function (t) {
      return !this.isEditing && this.editable
        ? (this.canvas &&
            (this.canvas.calcOffset(), this.exitEditingOnOthers(this.canvas)),
          (this.isEditing = !0),
          this.initHiddenTextarea(t),
          this.hiddenTextarea.focus(),
          (this.hiddenTextarea.value = this.text),
          this._updateTextarea(),
          this._saveEditingProps(),
          this._setEditingProps(),
          (this._textBeforeEdit = this.text),
          this._tick(),
          this.fire('editing:entered'),
          this._fireSelectionChanged(),
          this.canvas
            ? (this.canvas.fire('text:editing:entered', { target: this }),
              this.initMouseMoveHandler(),
              this.canvas.requestRenderAll(),
              this)
            : this)
        : void 0;
    },
    exitEditingOnOthers: function (t) {
      t._iTextInstances &&
        t._iTextInstances.forEach(function (t) {
          (t.selected = !1), t.isEditing && t.exitEditing();
        });
    },
    initMouseMoveHandler: function () {
      this.canvas.on('mouse:move', this.mouseMoveHandler);
    },
    mouseMoveHandler: function (t) {
      if (this.__isMousedown && this.isEditing) {
        var e = this.getSelectionStartFromPointer(t.e),
          i = this.selectionStart,
          r = this.selectionEnd;
        ((e === this.__selectionStartOnMouseDown && i !== r) ||
          (i !== e && r !== e)) &&
          (e > this.__selectionStartOnMouseDown
            ? ((this.selectionStart = this.__selectionStartOnMouseDown),
              (this.selectionEnd = e))
            : ((this.selectionStart = e),
              (this.selectionEnd = this.__selectionStartOnMouseDown)),
          (this.selectionStart !== i || this.selectionEnd !== r) &&
            (this.restartCursorIfNeeded(),
            this._fireSelectionChanged(),
            this._updateTextarea(),
            this.renderCursorOrSelection()));
      }
    },
    _setEditingProps: function () {
      (this.hoverCursor = 'text'),
        this.canvas &&
          (this.canvas.defaultCursor = this.canvas.moveCursor = 'text'),
        (this.borderColor = this.editingBorderColor),
        (this.hasControls = this.selectable = !1),
        (this.lockMovementX = this.lockMovementY = !0);
    },
    fromStringToGraphemeSelection: function (t, e, i) {
      var r = i.slice(0, t),
        n = fabric.util.string.graphemeSplit(r).length;
      if (t === e) return { selectionStart: n, selectionEnd: n };
      var s = i.slice(t, e),
        o = fabric.util.string.graphemeSplit(s).length;
      return { selectionStart: n, selectionEnd: n + o };
    },
    fromGraphemeToStringSelection: function (t, e, i) {
      var r = i.slice(0, t),
        n = r.join('').length;
      if (t === e) return { selectionStart: n, selectionEnd: n };
      var s = i.slice(t, e),
        o = s.join('').length;
      return { selectionStart: n, selectionEnd: n + o };
    },
    _updateTextarea: function () {
      if (((this.cursorOffsetCache = {}), this.hiddenTextarea)) {
        if (!this.inCompositionMode) {
          var t = this.fromGraphemeToStringSelection(
            this.selectionStart,
            this.selectionEnd,
            this._text
          );
          (this.hiddenTextarea.selectionStart = t.selectionStart),
            (this.hiddenTextarea.selectionEnd = t.selectionEnd);
        }
        this.updateTextareaPosition();
      }
    },
    updateFromTextArea: function () {
      if (this.hiddenTextarea) {
        (this.cursorOffsetCache = {}),
          (this.text = this.hiddenTextarea.value),
          this._shouldClearDimensionCache() &&
            (this.initDimensions(), this.setCoords());
        var t = this.fromStringToGraphemeSelection(
          this.hiddenTextarea.selectionStart,
          this.hiddenTextarea.selectionEnd,
          this.hiddenTextarea.value
        );
        (this.selectionEnd = this.selectionStart = t.selectionEnd),
          this.inCompositionMode || (this.selectionStart = t.selectionStart),
          this.updateTextareaPosition();
      }
    },
    updateTextareaPosition: function () {
      if (this.selectionStart === this.selectionEnd) {
        var t = this._calcTextareaPosition();
        (this.hiddenTextarea.style.left = t.left),
          (this.hiddenTextarea.style.top = t.top);
      }
    },
    _calcTextareaPosition: function () {
      if (!this.canvas) return { x: 1, y: 1 };
      var t = this.inCompositionMode
          ? this.compositionStart
          : this.selectionStart,
        e = this._getCursorBoundaries(t),
        i = this.get2DCursorLocation(t),
        r = i.lineIndex,
        n = i.charIndex,
        s = this.getValueOfPropertyAt(r, n, 'fontSize') * this.lineHeight,
        o = e.leftOffset,
        a = this.calcTransformMatrix(),
        c = { x: e.left + o, y: e.top + e.topOffset + s },
        h = this.canvas.getRetinaScaling(),
        l = this.canvas.upperCanvasEl,
        u = l.width / h,
        f = l.height / h,
        d = u - s,
        g = f - s,
        p = l.clientWidth / u,
        v = l.clientHeight / f;
      return (
        (c = fabric.util.transformPoint(c, a)),
        (c = fabric.util.transformPoint(c, this.canvas.viewportTransform)),
        (c.x *= p),
        (c.y *= v),
        c.x < 0 && (c.x = 0),
        c.x > d && (c.x = d),
        c.y < 0 && (c.y = 0),
        c.y > g && (c.y = g),
        (c.x += this.canvas._offset.left),
        (c.y += this.canvas._offset.top),
        { left: c.x + 'px', top: c.y + 'px', fontSize: s + 'px', charHeight: s }
      );
    },
    _saveEditingProps: function () {
      this._savedProps = {
        hasControls: this.hasControls,
        borderColor: this.borderColor,
        lockMovementX: this.lockMovementX,
        lockMovementY: this.lockMovementY,
        hoverCursor: this.hoverCursor,
        selectable: this.selectable,
        defaultCursor: this.canvas && this.canvas.defaultCursor,
        moveCursor: this.canvas && this.canvas.moveCursor
      };
    },
    _restoreEditingProps: function () {
      this._savedProps &&
        ((this.hoverCursor = this._savedProps.hoverCursor),
        (this.hasControls = this._savedProps.hasControls),
        (this.borderColor = this._savedProps.borderColor),
        (this.selectable = this._savedProps.selectable),
        (this.lockMovementX = this._savedProps.lockMovementX),
        (this.lockMovementY = this._savedProps.lockMovementY),
        this.canvas &&
          ((this.canvas.defaultCursor = this._savedProps.defaultCursor),
          (this.canvas.moveCursor = this._savedProps.moveCursor)));
    },
    exitEditing: function () {
      var t = this._textBeforeEdit !== this.text,
        e = this.hiddenTextarea;
      return (
        (this.selected = !1),
        (this.isEditing = !1),
        (this.selectionEnd = this.selectionStart),
        e && (e.blur && e.blur(), e.parentNode && e.parentNode.removeChild(e)),
        (this.hiddenTextarea = null),
        this.abortCursorAnimation(),
        this._restoreEditingProps(),
        (this._currentCursorOpacity = 0),
        this._shouldClearDimensionCache() &&
          (this.initDimensions(), this.setCoords()),
        this.fire('editing:exited'),
        t && this.fire('modified'),
        this.canvas &&
          (this.canvas.off('mouse:move', this.mouseMoveHandler),
          this.canvas.fire('text:editing:exited', { target: this }),
          t && this.canvas.fire('object:modified', { target: this })),
        this
      );
    },
    _removeExtraneousStyles: function () {
      for (var t in this.styles) this._textLines[t] || delete this.styles[t];
    },
    removeStyleFromTo: function (t, e) {
      var i,
        r,
        n = this.get2DCursorLocation(t, !0),
        s = this.get2DCursorLocation(e, !0),
        o = n.lineIndex,
        a = n.charIndex,
        c = s.lineIndex,
        h = s.charIndex;
      if (o !== c) {
        if (this.styles[o])
          for (i = a; i < this._unwrappedTextLines[o].length; i++)
            delete this.styles[o][i];
        if (this.styles[c])
          for (i = h; i < this._unwrappedTextLines[c].length; i++)
            (r = this.styles[c][i]),
              r &&
                (this.styles[o] || (this.styles[o] = {}),
                (this.styles[o][a + i - h] = r));
        for (i = o + 1; c >= i; i++) delete this.styles[i];
        this.shiftLineStyles(c, o - c);
      } else if (this.styles[o]) {
        r = this.styles[o];
        var l,
          u,
          f = h - a;
        for (i = a; h > i; i++) delete r[i];
        for (u in this.styles[o])
          (l = parseInt(u, 10)), l >= h && ((r[l - f] = r[u]), delete r[u]);
      }
    },
    shiftLineStyles: function (e, i) {
      var r = t(this.styles);
      for (var n in this.styles) {
        var s = parseInt(n, 10);
        s > e &&
          ((this.styles[s + i] = r[s]), r[s - i] || delete this.styles[s]);
      }
    },
    restartCursorIfNeeded: function () {
      (!this._currentTickState ||
        this._currentTickState.isAborted ||
        !this._currentTickCompleteState ||
        this._currentTickCompleteState.isAborted) &&
        this.initDelayedCursor();
    },
    insertNewlineStyleObject: function (e, i, r, n) {
      var s,
        o = {},
        a = !1,
        c = this._unwrappedTextLines[e].length === i;
      r || (r = 1),
        this.shiftLineStyles(e, r),
        this.styles[e] && (s = this.styles[e][0 === i ? i : i - 1]);
      for (var h in this.styles[e]) {
        var l = parseInt(h, 10);
        l >= i &&
          ((a = !0),
          (o[l - i] = this.styles[e][h]),
          (c && 0 === i) || delete this.styles[e][h]);
      }
      var u = !1;
      for (a && !c && ((this.styles[e + r] = o), (u = !0)), u && r--; r > 0; )
        n && n[r - 1]
          ? (this.styles[e + r] = { 0: t(n[r - 1]) })
          : s
          ? (this.styles[e + r] = { 0: t(s) })
          : delete this.styles[e + r],
          r--;
      this._forceClearCache = !0;
    },
    insertCharStyleObject: function (e, i, r, n) {
      this.styles || (this.styles = {});
      var s = this.styles[e],
        o = s ? t(s) : {};
      r || (r = 1);
      for (var a in o) {
        var c = parseInt(a, 10);
        c >= i && ((s[c + r] = o[c]), o[c - r] || delete s[c]);
      }
      if (((this._forceClearCache = !0), n))
        for (; r--; )
          Object.keys(n[r]).length &&
            (this.styles[e] || (this.styles[e] = {}),
            (this.styles[e][i + r] = t(n[r])));
      else if (s)
        for (var h = s[i ? i - 1 : 1]; h && r--; ) this.styles[e][i + r] = t(h);
    },
    insertNewStyleBlock: function (t, e, i) {
      for (
        var r = this.get2DCursorLocation(e, !0), n = [0], s = 0, o = 0;
        o < t.length;
        o++
      )
        '\n' === t[o] ? (s++, (n[s] = 0)) : n[s]++;
      n[0] > 0 &&
        (this.insertCharStyleObject(r.lineIndex, r.charIndex, n[0], i),
        (i = i && i.slice(n[0] + 1))),
        s && this.insertNewlineStyleObject(r.lineIndex, r.charIndex + n[0], s);
      for (var o = 1; s > o; o++)
        n[o] > 0
          ? this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i)
          : i &&
            this.styles[r.lineIndex + o] &&
            i[0] &&
            (this.styles[r.lineIndex + o][0] = i[0]),
          (i = i && i.slice(n[o] + 1));
      n[o] > 0 && this.insertCharStyleObject(r.lineIndex + o, 0, n[o], i);
    },
    setSelectionStartEndWithShift: function (t, e, i) {
      t >= i
        ? (e === t
            ? (this._selectionDirection = 'left')
            : 'right' === this._selectionDirection &&
              ((this._selectionDirection = 'left'), (this.selectionEnd = t)),
          (this.selectionStart = i))
        : i > t && e > i
        ? 'right' === this._selectionDirection
          ? (this.selectionEnd = i)
          : (this.selectionStart = i)
        : (e === t
            ? (this._selectionDirection = 'right')
            : 'left' === this._selectionDirection &&
              ((this._selectionDirection = 'right'), (this.selectionStart = e)),
          (this.selectionEnd = i));
    },
    setSelectionInBoundaries: function () {
      var t = this.text.length;
      this.selectionStart > t
        ? (this.selectionStart = t)
        : this.selectionStart < 0 && (this.selectionStart = 0),
        this.selectionEnd > t
          ? (this.selectionEnd = t)
          : this.selectionEnd < 0 && (this.selectionEnd = 0);
    }
  });
})();
fabric.util.object.extend(fabric.IText.prototype, {
  initDoubleClickSimulation: function () {
    (this.__lastClickTime = +new Date()),
      (this.__lastLastClickTime = +new Date()),
      (this.__lastPointer = {}),
      this.on('mousedown', this.onMouseDown);
  },
  onMouseDown: function (t) {
    if (this.canvas) {
      this.__newClickTime = +new Date();
      var e = t.pointer;
      this.isTripleClick(e) &&
        (this.fire('tripleclick', t), this._stopEvent(t.e)),
        (this.__lastLastClickTime = this.__lastClickTime),
        (this.__lastClickTime = this.__newClickTime),
        (this.__lastPointer = e),
        (this.__lastIsEditing = this.isEditing),
        (this.__lastSelected = this.selected);
    }
  },
  isTripleClick: function (t) {
    return (
      this.__newClickTime - this.__lastClickTime < 500 &&
      this.__lastClickTime - this.__lastLastClickTime < 500 &&
      this.__lastPointer.x === t.x &&
      this.__lastPointer.y === t.y
    );
  },
  _stopEvent: function (t) {
    t.preventDefault && t.preventDefault(),
      t.stopPropagation && t.stopPropagation();
  },
  initCursorSelectionHandlers: function () {
    this.initMousedownHandler(), this.initMouseupHandler(), this.initClicks();
  },
  doubleClickHandler: function (t) {
    this.isEditing && this.selectWord(this.getSelectionStartFromPointer(t.e));
  },
  tripleClickHandler: function (t) {
    this.isEditing && this.selectLine(this.getSelectionStartFromPointer(t.e));
  },
  initClicks: function () {
    this.on('mousedblclick', this.doubleClickHandler),
      this.on('tripleclick', this.tripleClickHandler);
  },
  _mouseDownHandler: function (t) {
    !this.canvas ||
      !this.editable ||
      (t.e.button && 1 !== t.e.button) ||
      ((this.__isMousedown = !0),
      this.selected &&
        ((this.inCompositionMode = !1), this.setCursorByClick(t.e)),
      this.isEditing &&
        ((this.__selectionStartOnMouseDown = this.selectionStart),
        this.selectionStart === this.selectionEnd &&
          this.abortCursorAnimation(),
        this.renderCursorOrSelection()));
  },
  _mouseDownHandlerBefore: function (t) {
    !this.canvas ||
      !this.editable ||
      (t.e.button && 1 !== t.e.button) ||
      (this.selected = this === this.canvas._activeObject);
  },
  initMousedownHandler: function () {
    this.on('mousedown', this._mouseDownHandler),
      this.on('mousedown:before', this._mouseDownHandlerBefore);
  },
  initMouseupHandler: function () {
    this.on('mouseup', this.mouseUpHandler);
  },
  mouseUpHandler: function (t) {
    if (
      ((this.__isMousedown = !1),
      !(
        !this.editable ||
        this.group ||
        (t.transform && t.transform.actionPerformed) ||
        (t.e.button && 1 !== t.e.button)
      ))
    ) {
      if (this.canvas) {
        var e = this.canvas._activeObject;
        if (e && e !== this) return;
      }
      this.__lastSelected && !this.__corner
        ? ((this.selected = !1),
          (this.__lastSelected = !1),
          this.enterEditing(t.e),
          this.selectionStart === this.selectionEnd
            ? this.initDelayedCursor(!0)
            : this.renderCursorOrSelection())
        : (this.selected = !0);
    }
  },
  setCursorByClick: function (t) {
    var e = this.getSelectionStartFromPointer(t),
      i = this.selectionStart,
      r = this.selectionEnd;
    t.shiftKey
      ? this.setSelectionStartEndWithShift(i, r, e)
      : ((this.selectionStart = e), (this.selectionEnd = e)),
      this.isEditing && (this._fireSelectionChanged(), this._updateTextarea());
  },
  getSelectionStartFromPointer: function (t) {
    for (
      var e,
        i,
        r = this.getLocalPointer(t),
        n = 0,
        s = 0,
        o = 0,
        a = 0,
        c = 0,
        h = 0,
        l = this._textLines.length;
      l > h && o <= r.y;
      h++
    )
      (o += this.getHeightOfLine(h) * this.scaleY),
        (c = h),
        h > 0 &&
          (a +=
            this._textLines[h - 1].length + this.missingNewlineOffset(h - 1));
    (e = this._getLineLeftOffset(c)),
      (s = e * this.scaleX),
      (i = this._textLines[c]),
      'rtl' === this.direction && (r.x = this.width * this.scaleX - r.x + s);
    for (
      var u = 0, f = i.length;
      f > u &&
      ((n = s),
      (s += this.__charBounds[c][u].kernedWidth * this.scaleX),
      s <= r.x);
      u++
    )
      a++;
    return this._getNewSelectionStartFromOffset(r, n, s, a, f);
  },
  _getNewSelectionStartFromOffset: function (t, e, i, r, n) {
    var s = t.x - e,
      o = i - t.x,
      a = o > s || 0 > o ? 0 : 1,
      c = r + a;
    return (
      this.flipX && (c = n - c),
      c > this._text.length && (c = this._text.length),
      c
    );
  }
});
fabric.util.object.extend(fabric.IText.prototype, {
  initHiddenTextarea: function () {
    (this.hiddenTextarea = fabric.document.createElement('textarea')),
      this.hiddenTextarea.setAttribute('autocapitalize', 'off'),
      this.hiddenTextarea.setAttribute('autocorrect', 'off'),
      this.hiddenTextarea.setAttribute('autocomplete', 'off'),
      this.hiddenTextarea.setAttribute('spellcheck', 'false'),
      this.hiddenTextarea.setAttribute('data-fabric-hiddentextarea', ''),
      this.hiddenTextarea.setAttribute('wrap', 'off');
    var t = this._calcTextareaPosition();
    (this.hiddenTextarea.style.cssText =
      'position: absolute; top: ' +
      t.top +
      '; left: ' +
      t.left +
      '; z-index: -999; opacity: 0; width: 1px; height: 1px; font-size: 1px; paddingｰtop: ' +
      t.fontSize +
      ';'),
      this.hiddenTextareaContainer
        ? this.hiddenTextareaContainer.appendChild(this.hiddenTextarea)
        : fabric.document.body.appendChild(this.hiddenTextarea),
      fabric.util.addListener(
        this.hiddenTextarea,
        'keydown',
        this.onKeyDown.bind(this)
      ),
      fabric.util.addListener(
        this.hiddenTextarea,
        'keyup',
        this.onKeyUp.bind(this)
      ),
      fabric.util.addListener(
        this.hiddenTextarea,
        'input',
        this.onInput.bind(this)
      ),
      fabric.util.addListener(
        this.hiddenTextarea,
        'copy',
        this.copy.bind(this)
      ),
      fabric.util.addListener(this.hiddenTextarea, 'cut', this.copy.bind(this)),
      fabric.util.addListener(
        this.hiddenTextarea,
        'paste',
        this.paste.bind(this)
      ),
      fabric.util.addListener(
        this.hiddenTextarea,
        'compositionstart',
        this.onCompositionStart.bind(this)
      ),
      fabric.util.addListener(
        this.hiddenTextarea,
        'compositionupdate',
        this.onCompositionUpdate.bind(this)
      ),
      fabric.util.addListener(
        this.hiddenTextarea,
        'compositionend',
        this.onCompositionEnd.bind(this)
      ),
      !this._clickHandlerInitialized &&
        this.canvas &&
        (fabric.util.addListener(
          this.canvas.upperCanvasEl,
          'click',
          this.onClick.bind(this)
        ),
        (this._clickHandlerInitialized = !0));
  },
  keysMap: {
    9: 'exitEditing',
    27: 'exitEditing',
    33: 'moveCursorUp',
    34: 'moveCursorDown',
    35: 'moveCursorRight',
    36: 'moveCursorLeft',
    37: 'moveCursorLeft',
    38: 'moveCursorUp',
    39: 'moveCursorRight',
    40: 'moveCursorDown'
  },
  keysMapRtl: {
    9: 'exitEditing',
    27: 'exitEditing',
    33: 'moveCursorUp',
    34: 'moveCursorDown',
    35: 'moveCursorLeft',
    36: 'moveCursorRight',
    37: 'moveCursorRight',
    38: 'moveCursorUp',
    39: 'moveCursorLeft',
    40: 'moveCursorDown'
  },
  ctrlKeysMapUp: { 67: 'copy', 88: 'cut' },
  ctrlKeysMapDown: { 65: 'selectAll' },
  onClick: function () {
    this.hiddenTextarea && this.hiddenTextarea.focus();
  },
  onKeyDown: function (t) {
    if (this.isEditing) {
      var e = 'rtl' === this.direction ? this.keysMapRtl : this.keysMap;
      if (t.keyCode in e) this[e[t.keyCode]](t);
      else {
        if (!(t.keyCode in this.ctrlKeysMapDown && (t.ctrlKey || t.metaKey)))
          return;
        this[this.ctrlKeysMapDown[t.keyCode]](t);
      }
      t.stopImmediatePropagation(),
        t.preventDefault(),
        t.keyCode >= 33 && t.keyCode <= 40
          ? ((this.inCompositionMode = !1),
            this.clearContextTop(),
            this.renderCursorOrSelection())
          : this.canvas && this.canvas.requestRenderAll();
    }
  },
  onKeyUp: function (t) {
    return !this.isEditing || this._copyDone || this.inCompositionMode
      ? void (this._copyDone = !1)
      : void (
          t.keyCode in this.ctrlKeysMapUp &&
          (t.ctrlKey || t.metaKey) &&
          (this[this.ctrlKeysMapUp[t.keyCode]](t),
          t.stopImmediatePropagation(),
          t.preventDefault(),
          this.canvas && this.canvas.requestRenderAll())
        );
  },
  onInput: function (t) {
    var e = this.fromPaste;
    if (((this.fromPaste = !1), t && t.stopPropagation(), this.isEditing)) {
      var i,
        r,
        n,
        s,
        o,
        a = this._splitTextIntoLines(this.hiddenTextarea.value).graphemeText,
        c = this._text.length,
        h = a.length,
        l = h - c,
        u = this.selectionStart,
        f = this.selectionEnd,
        d = u !== f;
      if ('' === this.hiddenTextarea.value)
        return (
          (this.styles = {}),
          this.updateFromTextArea(),
          this.fire('changed'),
          void (
            this.canvas &&
            (this.canvas.fire('text:changed', { target: this }),
            this.canvas.requestRenderAll())
          )
        );
      var g = this.fromStringToGraphemeSelection(
          this.hiddenTextarea.selectionStart,
          this.hiddenTextarea.selectionEnd,
          this.hiddenTextarea.value
        ),
        p = u > g.selectionStart;
      d
        ? ((i = this._text.slice(u, f)), (l += f - u))
        : c > h &&
          (i = p ? this._text.slice(f + l, f) : this._text.slice(u, u - l)),
        (r = a.slice(g.selectionEnd - l, g.selectionEnd)),
        i &&
          i.length &&
          (r.length &&
            ((n = this.getSelectionStyles(u, u + 1, !1)),
            (n = r.map(function () {
              return n[0];
            }))),
          d
            ? ((s = u), (o = f))
            : p
            ? ((s = f - i.length), (o = f))
            : ((s = f), (o = f + i.length)),
          this.removeStyleFromTo(s, o)),
        r.length &&
          (e &&
            r.join('') === fabric.copiedText &&
            !fabric.disableStyleCopyPaste &&
            (n = fabric.copiedTextStyle),
          this.insertNewStyleBlock(r, u, n)),
        this.updateFromTextArea(),
        this.fire('changed'),
        this.canvas &&
          (this.canvas.fire('text:changed', { target: this }),
          this.canvas.requestRenderAll());
    }
  },
  onCompositionStart: function () {
    this.inCompositionMode = !0;
  },
  onCompositionEnd: function () {
    this.inCompositionMode = !1;
  },
  onCompositionUpdate: function (t) {
    (this.compositionStart = t.target.selectionStart),
      (this.compositionEnd = t.target.selectionEnd),
      this.updateTextareaPosition();
  },
  copy: function () {
    this.selectionStart !== this.selectionEnd &&
      ((fabric.copiedText = this.getSelectedText()),
      (fabric.copiedTextStyle = fabric.disableStyleCopyPaste
        ? null
        : this.getSelectionStyles(this.selectionStart, this.selectionEnd, !0)),
      (this._copyDone = !0));
  },
  paste: function () {
    this.fromPaste = !0;
  },
  _getClipboardData: function (t) {
    return (t && t.clipboardData) || fabric.window.clipboardData;
  },
  _getWidthBeforeCursor: function (t, e) {
    var i,
      r = this._getLineLeftOffset(t);
    return (
      e > 0 && ((i = this.__charBounds[t][e - 1]), (r += i.left + i.width)), r
    );
  },
  getDownCursorOffset: function (t, e) {
    var i = this._getSelectionForOffset(t, e),
      r = this.get2DCursorLocation(i),
      n = r.lineIndex;
    if (n === this._textLines.length - 1 || t.metaKey || 34 === t.keyCode)
      return this._text.length - i;
    var s = r.charIndex,
      o = this._getWidthBeforeCursor(n, s),
      a = this._getIndexOnLine(n + 1, o),
      c = this._textLines[n].slice(s);
    return c.length + a + 1 + this.missingNewlineOffset(n);
  },
  _getSelectionForOffset: function (t, e) {
    return t.shiftKey && this.selectionStart !== this.selectionEnd && e
      ? this.selectionEnd
      : this.selectionStart;
  },
  getUpCursorOffset: function (t, e) {
    var i = this._getSelectionForOffset(t, e),
      r = this.get2DCursorLocation(i),
      n = r.lineIndex;
    if (0 === n || t.metaKey || 33 === t.keyCode) return -i;
    var s = r.charIndex,
      o = this._getWidthBeforeCursor(n, s),
      a = this._getIndexOnLine(n - 1, o),
      c = this._textLines[n].slice(0, s),
      h = this.missingNewlineOffset(n - 1);
    return -this._textLines[n - 1].length + a - c.length + (1 - h);
  },
  _getIndexOnLine: function (t, e) {
    for (
      var i,
        r,
        n = this._textLines[t],
        s = this._getLineLeftOffset(t),
        o = s,
        a = 0,
        c = 0,
        h = n.length;
      h > c;
      c++
    )
      if (((i = this.__charBounds[t][c].width), (o += i), o > e)) {
        r = !0;
        var l = o - i,
          u = o,
          f = Math.abs(l - e),
          d = Math.abs(u - e);
        a = f > d ? c : c - 1;
        break;
      }
    return r || (a = n.length - 1), a;
  },
  moveCursorDown: function (t) {
    (this.selectionStart >= this._text.length &&
      this.selectionEnd >= this._text.length) ||
      this._moveCursorUpOrDown('Down', t);
  },
  moveCursorUp: function (t) {
    (0 !== this.selectionStart || 0 !== this.selectionEnd) &&
      this._moveCursorUpOrDown('Up', t);
  },
  _moveCursorUpOrDown: function (t, e) {
    var i = 'get' + t + 'CursorOffset',
      r = this[i](e, 'right' === this._selectionDirection);
    e.shiftKey ? this.moveCursorWithShift(r) : this.moveCursorWithoutShift(r),
      0 !== r &&
        (this.setSelectionInBoundaries(),
        this.abortCursorAnimation(),
        (this._currentCursorOpacity = 1),
        this.initDelayedCursor(),
        this._fireSelectionChanged(),
        this._updateTextarea());
  },
  moveCursorWithShift: function (t) {
    var e =
      'left' === this._selectionDirection
        ? this.selectionStart + t
        : this.selectionEnd + t;
    return (
      this.setSelectionStartEndWithShift(
        this.selectionStart,
        this.selectionEnd,
        e
      ),
      0 !== t
    );
  },
  moveCursorWithoutShift: function (t) {
    return (
      0 > t
        ? ((this.selectionStart += t),
          (this.selectionEnd = this.selectionStart))
        : ((this.selectionEnd += t), (this.selectionStart = this.selectionEnd)),
      0 !== t
    );
  },
  moveCursorLeft: function (t) {
    (0 !== this.selectionStart || 0 !== this.selectionEnd) &&
      this._moveCursorLeftOrRight('Left', t);
  },
  _move: function (t, e, i) {
    var r;
    if (t.altKey) r = this['findWordBoundary' + i](this[e]);
    else {
      if (!t.metaKey && 35 !== t.keyCode && 36 !== t.keyCode)
        return (this[e] += 'Left' === i ? -1 : 1), !0;
      r = this['findLineBoundary' + i](this[e]);
    }
    return void 0 !== typeof r && this[e] !== r ? ((this[e] = r), !0) : void 0;
  },
  _moveLeft: function (t, e) {
    return this._move(t, e, 'Left');
  },
  _moveRight: function (t, e) {
    return this._move(t, e, 'Right');
  },
  moveCursorLeftWithoutShift: function (t) {
    var e = !0;
    return (
      (this._selectionDirection = 'left'),
      this.selectionEnd === this.selectionStart &&
        0 !== this.selectionStart &&
        (e = this._moveLeft(t, 'selectionStart')),
      (this.selectionEnd = this.selectionStart),
      e
    );
  },
  moveCursorLeftWithShift: function (t) {
    return 'right' === this._selectionDirection &&
      this.selectionStart !== this.selectionEnd
      ? this._moveLeft(t, 'selectionEnd')
      : 0 !== this.selectionStart
      ? ((this._selectionDirection = 'left'),
        this._moveLeft(t, 'selectionStart'))
      : void 0;
  },
  moveCursorRight: function (t) {
    (this.selectionStart >= this._text.length &&
      this.selectionEnd >= this._text.length) ||
      this._moveCursorLeftOrRight('Right', t);
  },
  _moveCursorLeftOrRight: function (t, e) {
    var i = 'moveCursor' + t + 'With';
    (this._currentCursorOpacity = 1),
      (i += e.shiftKey ? 'Shift' : 'outShift'),
      this[i](e) &&
        (this.abortCursorAnimation(),
        this.initDelayedCursor(),
        this._fireSelectionChanged(),
        this._updateTextarea());
  },
  moveCursorRightWithShift: function (t) {
    return 'left' === this._selectionDirection &&
      this.selectionStart !== this.selectionEnd
      ? this._moveRight(t, 'selectionStart')
      : this.selectionEnd !== this._text.length
      ? ((this._selectionDirection = 'right'),
        this._moveRight(t, 'selectionEnd'))
      : void 0;
  },
  moveCursorRightWithoutShift: function (t) {
    var e = !0;
    return (
      (this._selectionDirection = 'right'),
      this.selectionStart === this.selectionEnd
        ? ((e = this._moveRight(t, 'selectionStart')),
          (this.selectionEnd = this.selectionStart))
        : (this.selectionStart = this.selectionEnd),
      e
    );
  },
  removeChars: function (t, e) {
    'undefined' == typeof e && (e = t + 1),
      this.removeStyleFromTo(t, e),
      this._text.splice(t, e - t),
      (this.text = this._text.join('')),
      this.set('dirty', !0),
      this._shouldClearDimensionCache() &&
        (this.initDimensions(), this.setCoords()),
      this._removeExtraneousStyles();
  },
  insertChars: function (t, e, i, r) {
    'undefined' == typeof r && (r = i), r > i && this.removeStyleFromTo(i, r);
    var n = fabric.util.string.graphemeSplit(t);
    this.insertNewStyleBlock(n, i, e),
      (this._text = [].concat(this._text.slice(0, i), n, this._text.slice(r))),
      (this.text = this._text.join('')),
      this.set('dirty', !0),
      this._shouldClearDimensionCache() &&
        (this.initDimensions(), this.setCoords()),
      this._removeExtraneousStyles();
  }
});
!(function () {
  var t = fabric.util.toFixed,
    e = /  +/g;
  fabric.util.object.extend(fabric.Text.prototype, {
    _toSVG: function () {
      var t = this._getSVGLeftTopOffsets(),
        e = this._getSVGTextAndBg(t.textTop, t.textLeft);
      return this._wrapSVGTextAndBg(e);
    },
    toSVG: function (t) {
      return this._createBaseSVGMarkup(this._toSVG(), {
        reviver: t,
        noStyle: !0,
        withShadow: !0
      });
    },
    _getSVGLeftTopOffsets: function () {
      return {
        textLeft: -this.width / 2,
        textTop: -this.height / 2,
        lineTop: this.getHeightOfLine(0)
      };
    },
    _wrapSVGTextAndBg: function (t) {
      var e = !0,
        i = this.getSvgTextDecoration(this);
      return [
        t.textBgRects.join(''),
        '		<text xml:space="preserve" ',
        this.fontFamily
          ? 'font-family="' + this.fontFamily.replace(/"/g, "'") + '" '
          : '',
        this.fontSize ? 'font-size="' + this.fontSize + '" ' : '',
        this.fontStyle ? 'font-style="' + this.fontStyle + '" ' : '',
        this.fontWeight ? 'font-weight="' + this.fontWeight + '" ' : '',
        i ? 'text-decoration="' + i + '" ' : '',
        'style="',
        this.getSvgStyles(e),
        '"',
        this.addPaintOrder(),
        ' >',
        t.textSpans.join(''),
        '</text>\n'
      ];
    },
    _getSVGTextAndBg: function (t, e) {
      var i,
        r = [],
        n = [],
        s = t;
      this._setSVGBg(n);
      for (var o = 0, a = this._textLines.length; a > o; o++)
        (i = this._getLineLeftOffset(o)),
          (this.textBackgroundColor ||
            this.styleHas('textBackgroundColor', o)) &&
            this._setSVGTextLineBg(n, o, e + i, s),
          this._setSVGTextLineText(r, o, e + i, s),
          (s += this.getHeightOfLine(o));
      return { textSpans: r, textBgRects: n };
    },
    _createTextCharSpan: function (i, r, n, s) {
      var o = i !== i.trim() || i.match(e),
        a = this.getSvgSpanStyles(r, o),
        c = a ? 'style="' + a + '"' : '',
        h = r.deltaY,
        l = '',
        u = fabric.Object.NUM_FRACTION_DIGITS;
      return (
        h && (l = ' dy="' + t(h, u) + '" '),
        [
          '<tspan x="',
          t(n, u),
          '" y="',
          t(s, u),
          '" ',
          l,
          c,
          '>',
          fabric.util.string.escapeXml(i),
          '</tspan>'
        ].join('')
      );
    },
    _setSVGTextLineText: function (t, e, i, r) {
      var n,
        s,
        o,
        a,
        c,
        h = this.getHeightOfLine(e),
        l = -1 !== this.textAlign.indexOf('justify'),
        u = '',
        f = 0,
        d = this._textLines[e];
      r += (h * (1 - this._fontSizeFraction)) / this.lineHeight;
      for (var g = 0, p = d.length - 1; p >= g; g++)
        (c = g === p || this.charSpacing),
          (u += d[g]),
          (o = this.__charBounds[e][g]),
          0 === f
            ? ((i += o.kernedWidth - o.width), (f += o.width))
            : (f += o.kernedWidth),
          l && !c && this._reSpaceAndTab.test(d[g]) && (c = !0),
          c ||
            ((n = n || this.getCompleteStyleDeclaration(e, g)),
            (s = this.getCompleteStyleDeclaration(e, g + 1)),
            (c = fabric.util.hasStyleChanged(n, s, !0))),
          c &&
            ((a = this._getStyleDeclaration(e, g) || {}),
            t.push(this._createTextCharSpan(u, a, i, r)),
            (u = ''),
            (n = s),
            (i += f),
            (f = 0));
    },
    _pushTextBgRect: function (e, i, r, n, s, o) {
      var a = fabric.Object.NUM_FRACTION_DIGITS;
      e.push(
        '		<rect ',
        this._getFillAttributes(i),
        ' x="',
        t(r, a),
        '" y="',
        t(n, a),
        '" width="',
        t(s, a),
        '" height="',
        t(o, a),
        '"></rect>\n'
      );
    },
    _setSVGTextLineBg: function (t, e, i, r) {
      for (
        var n,
          s,
          o = this._textLines[e],
          a = this.getHeightOfLine(e) / this.lineHeight,
          c = 0,
          h = 0,
          l = this.getValueOfPropertyAt(e, 0, 'textBackgroundColor'),
          u = 0,
          f = o.length;
        f > u;
        u++
      )
        (n = this.__charBounds[e][u]),
          (s = this.getValueOfPropertyAt(e, u, 'textBackgroundColor')),
          s !== l
            ? (l && this._pushTextBgRect(t, l, i + h, r, c, a),
              (h = n.left),
              (c = n.width),
              (l = s))
            : (c += n.kernedWidth);
      s && this._pushTextBgRect(t, s, i + h, r, c, a);
    },
    _getFillAttributes: function (t) {
      var e = t && 'string' == typeof t ? new fabric.Color(t) : '';
      return e && e.getSource() && 1 !== e.getAlpha()
        ? 'opacity="' + e.getAlpha() + '" fill="' + e.setAlpha(1).toRgb() + '"'
        : 'fill="' + t + '"';
    },
    _getSVGLineTopOffset: function (t) {
      for (var e = 0, i = 0, r = 0; t > r; r++) e += this.getHeightOfLine(r);
      return (
        (i = this.getHeightOfLine(r)),
        {
          lineTop: e,
          offset:
            ((this._fontSizeMult - this._fontSizeFraction) * i) /
            (this.lineHeight * this._fontSizeMult)
        }
      );
    },
    getSvgStyles: function (t) {
      var e = fabric.Object.prototype.getSvgStyles.call(this, t);
      return e + ' white-space: pre;';
    }
  });
})();
!(function (t) {
  'use strict';
  var e = t.fabric || (t.fabric = {});
  (e.Textbox = e.util.createClass(e.IText, e.Observable, {
    type: 'textbox',
    minWidth: 20,
    dynamicMinWidth: 2,
    __cachedLines: null,
    lockScalingFlip: !0,
    noScaleCache: !1,
    _dimensionAffectingProps:
      e.Text.prototype._dimensionAffectingProps.concat('width'),
    _wordJoiners: /[ \t\r]/,
    splitByGrapheme: !1,
    initDimensions: function () {
      this.__skipDimension ||
        (this.isEditing && this.initDelayedCursor(),
        this.clearContextTop(),
        this._clearCache(),
        (this.dynamicMinWidth = 0),
        (this._styleMap = this._generateStyleMap(this._splitText())),
        this.dynamicMinWidth > this.width &&
          this._set('width', this.dynamicMinWidth),
        -1 !== this.textAlign.indexOf('justify') && this.enlargeSpaces(),
        (this.height = this.calcTextHeight()),
        this.saveState({ propertySet: '_dimensionAffectingProps' }));
    },
    _generateStyleMap: function (t) {
      for (
        var e = 0, i = 0, r = 0, n = {}, s = 0;
        s < t.graphemeLines.length;
        s++
      )
        '\n' === t.graphemeText[r] && s > 0
          ? ((i = 0), r++, e++)
          : !this.splitByGrapheme &&
            this._reSpaceAndTab.test(t.graphemeText[r]) &&
            s > 0 &&
            (i++, r++),
          (n[s] = { line: e, offset: i }),
          (r += t.graphemeLines[s].length),
          (i += t.graphemeLines[s].length);
      return n;
    },
    styleHas: function (t, i) {
      if (this._styleMap && !this.isWrapping) {
        var r = this._styleMap[i];
        r && (i = r.line);
      }
      return e.Text.prototype.styleHas.call(this, t, i);
    },
    isEmptyStyles: function (t) {
      if (!this.styles) return !0;
      var e,
        i,
        r = 0,
        n = t + 1,
        s = !1,
        o = this._styleMap[t],
        a = this._styleMap[t + 1];
      o && ((t = o.line), (r = o.offset)),
        a && ((n = a.line), (s = n === t), (e = a.offset)),
        (i = 'undefined' == typeof t ? this.styles : { line: this.styles[t] });
      for (var c in i)
        for (var h in i[c])
          if (h >= r && (!s || e > h)) for (var l in i[c][h]) return !1;
      return !0;
    },
    _getStyleDeclaration: function (t, e) {
      if (this._styleMap && !this.isWrapping) {
        var i = this._styleMap[t];
        if (!i) return null;
        (t = i.line), (e = i.offset + e);
      }
      return this.callSuper('_getStyleDeclaration', t, e);
    },
    _setStyleDeclaration: function (t, e, i) {
      var r = this._styleMap[t];
      (t = r.line), (e = r.offset + e), (this.styles[t][e] = i);
    },
    _deleteStyleDeclaration: function (t, e) {
      var i = this._styleMap[t];
      (t = i.line), (e = i.offset + e), delete this.styles[t][e];
    },
    _getLineStyle: function (t) {
      var e = this._styleMap[t];
      return !!this.styles[e.line];
    },
    _setLineStyle: function (t) {
      var e = this._styleMap[t];
      this.styles[e.line] = {};
    },
    _wrapText: function (t, e) {
      var i,
        r = [];
      for (this.isWrapping = !0, i = 0; i < t.length; i++)
        r = r.concat(this._wrapLine(t[i], i, e));
      return (this.isWrapping = !1), r;
    },
    _measureWord: function (t, e, i) {
      var r,
        n = 0,
        s = !0;
      i = i || 0;
      for (var o = 0, a = t.length; a > o; o++) {
        var c = this._getGraphemeBox(t[o], e, o + i, r, s);
        (n += c.kernedWidth), (r = t[o]);
      }
      return n;
    },
    _wrapLine: function (t, i, r, n) {
      var s = 0,
        o = this.splitByGrapheme,
        a = [],
        c = [],
        h = o ? e.util.string.graphemeSplit(t) : t.split(this._wordJoiners),
        l = '',
        u = 0,
        f = o ? '' : ' ',
        d = 0,
        g = 0,
        p = 0,
        v = !0,
        m = this._getWidthOfCharSpacing(),
        n = n || 0;
      0 === h.length && h.push([]), (r -= n);
      for (var b = 0; b < h.length; b++)
        (l = o ? h[b] : e.util.string.graphemeSplit(h[b])),
          (d = this._measureWord(l, i, u)),
          (u += l.length),
          (s += g + d - m),
          s > r && !v ? (a.push(c), (c = []), (s = d), (v = !0)) : (s += m),
          v || o || c.push(f),
          (c = c.concat(l)),
          (g = o ? 0 : this._measureWord([f], i, u)),
          u++,
          (v = !1),
          d > p && (p = d);
      return (
        b && a.push(c),
        p + n > this.dynamicMinWidth && (this.dynamicMinWidth = p - m + n),
        a
      );
    },
    isEndOfWrapping: function (t) {
      return this._styleMap[t + 1]
        ? this._styleMap[t + 1].line !== this._styleMap[t].line
          ? !0
          : !1
        : !0;
    },
    missingNewlineOffset: function (t) {
      return this.splitByGrapheme ? (this.isEndOfWrapping(t) ? 1 : 0) : 1;
    },
    _splitTextIntoLines: function (t) {
      for (
        var i = e.Text.prototype._splitTextIntoLines.call(this, t),
          r = this._wrapText(i.lines, this.width),
          n = new Array(r.length),
          s = 0;
        s < r.length;
        s++
      )
        n[s] = r[s].join('');
      return (i.lines = n), (i.graphemeLines = r), i;
    },
    getMinWidth: function () {
      return Math.max(this.minWidth, this.dynamicMinWidth);
    },
    _removeExtraneousStyles: function () {
      var t = {};
      for (var e in this._styleMap)
        this._textLines[e] && (t[this._styleMap[e].line] = 1);
      for (var e in this.styles) t[e] || delete this.styles[e];
    },
    toObject: function (t) {
      return this.callSuper(
        'toObject',
        ['minWidth', 'splitByGrapheme'].concat(t)
      );
    }
  })),
    (e.Textbox.fromObject = function (t, i) {
      return (
        (t.styles = e.util.stylesFromArray(t.styles, t.text)),
        e.Object._fromObject('Textbox', t, i, 'text')
      );
    });
})('undefined' != typeof exports ? exports : this);
!(function () {
  var t = fabric.controlsUtils,
    e = t.scaleSkewCursorStyleHandler,
    i = t.scaleCursorStyleHandler,
    r = t.scalingEqually,
    n = t.scalingYOrSkewingX,
    s = t.scalingXOrSkewingY,
    o = t.scaleOrSkewActionName,
    a = fabric.Object.prototype.controls;
  if (
    ((a.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      cursorStyleHandler: e,
      actionHandler: s,
      getActionName: o
    })),
    (a.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      cursorStyleHandler: e,
      actionHandler: s,
      getActionName: o
    })),
    (a.mb = new fabric.Control({
      x: 0,
      y: 0.5,
      cursorStyleHandler: e,
      actionHandler: n,
      getActionName: o
    })),
    (a.mt = new fabric.Control({
      x: 0,
      y: -0.5,
      cursorStyleHandler: e,
      actionHandler: n,
      getActionName: o
    })),
    (a.tl = new fabric.Control({
      x: -0.5,
      y: -0.5,
      cursorStyleHandler: i,
      actionHandler: r
    })),
    (a.tr = new fabric.Control({
      x: 0.5,
      y: -0.5,
      cursorStyleHandler: i,
      actionHandler: r
    })),
    (a.bl = new fabric.Control({
      x: -0.5,
      y: 0.5,
      cursorStyleHandler: i,
      actionHandler: r
    })),
    (a.br = new fabric.Control({
      x: 0.5,
      y: 0.5,
      cursorStyleHandler: i,
      actionHandler: r
    })),
    (a.mtr = new fabric.Control({
      x: 0,
      y: -0.5,
      actionHandler: t.rotationWithSnapping,
      cursorStyleHandler: t.rotationStyleHandler,
      offsetY: -40,
      withConnection: !0,
      actionName: 'rotate'
    })),
    fabric.Textbox)
  ) {
    var c = (fabric.Textbox.prototype.controls = {});
    (c.mtr = a.mtr),
      (c.tr = a.tr),
      (c.br = a.br),
      (c.tl = a.tl),
      (c.bl = a.bl),
      (c.mt = a.mt),
      (c.mb = a.mb),
      (c.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        actionHandler: t.changeWidth,
        cursorStyleHandler: e,
        actionName: 'resizing'
      })),
      (c.ml = new fabric.Control({
        x: -0.5,
        y: 0,
        actionHandler: t.changeWidth,
        cursorStyleHandler: e,
        actionName: 'resizing'
      }));
  }
})();
!(function () {
  fabric.Object.ENLIVEN_PROPS.push('eraser');
  var t = fabric.Object.prototype._drawClipPath,
    e = fabric.Object.prototype.needsItsOwnCache,
    i = fabric.Object.prototype.toObject,
    r = fabric.Object.prototype.getSvgCommons,
    n = fabric.Object.prototype._createBaseClipPathSVGMarkup,
    s = fabric.Object.prototype._createBaseSVGMarkup;
  fabric.Object.prototype.cacheProperties.push('eraser'),
    fabric.Object.prototype.stateProperties.push('eraser'),
    fabric.util.object.extend(fabric.Object.prototype, {
      erasable: !0,
      eraser: void 0,
      needsItsOwnCache: function () {
        return e.call(this) || !!this.eraser;
      },
      _drawClipPath: function (e, i) {
        if ((t.call(this, e, i), this.eraser)) {
          var r = this._getNonTransformedDimensions();
          this.eraser.isType('eraser') &&
            this.eraser.set({ width: r.x, height: r.y }),
            t.call(this, e, this.eraser);
        }
      },
      toObject: function (t) {
        var e = i.call(this, ['erasable'].concat(t));
        return (
          this.eraser &&
            !this.eraser.excludeFromExport &&
            (e.eraser = this.eraser.toObject(t)),
          e
        );
      },
      getSvgCommons: function () {
        return (
          r.call(this) +
          (this.eraser ? 'mask="url(#' + this.eraser.clipPathId + ')" ' : '')
        );
      },
      _createEraserSVGMarkup: function (t) {
        return this.eraser
          ? ((this.eraser.clipPathId = 'MASK_' + fabric.Object.__uid++),
            [
              '<mask id="',
              this.eraser.clipPathId,
              '" >',
              this.eraser.toSVG(t),
              '</mask>',
              '\n'
            ].join(''))
          : '';
      },
      _createBaseClipPathSVGMarkup: function (t, e) {
        return [
          this._createEraserSVGMarkup(e && e.reviver),
          n.call(this, t, e)
        ].join('');
      },
      _createBaseSVGMarkup: function (t, e) {
        return [
          this._createEraserSVGMarkup(e && e.reviver),
          s.call(this, t, e)
        ].join('');
      }
    });
  var o = fabric.Group.prototype._restoreObjectsState;
  fabric.util.object.extend(fabric.Group.prototype, {
    _addEraserPathToObjects: function (t) {
      this._objects.forEach(function (e) {
        fabric.EraserBrush.prototype._addPathToObjectEraser.call(
          fabric.EraserBrush.prototype,
          e,
          t
        );
      });
    },
    applyEraserToObjects: function () {
      var t = this,
        e = this.eraser;
      if (e) {
        delete this.eraser;
        var i = t.calcTransformMatrix();
        e.clone(function (e) {
          var r = t.clipPath;
          e.getObjects('path').forEach(function (e) {
            var n = fabric.util.multiplyTransformMatrices(
              i,
              e.calcTransformMatrix()
            );
            fabric.util.applyTransformToObject(e, n),
              r
                ? r.clone(
                    function (r) {
                      var n =
                        fabric.EraserBrush.prototype.applyClipPathToPath.call(
                          fabric.EraserBrush.prototype,
                          e,
                          r,
                          i
                        );
                      t._addEraserPathToObjects(n);
                    },
                    ['absolutePositioned', 'inverted']
                  )
                : t._addEraserPathToObjects(e);
          });
        });
      }
    },
    _restoreObjectsState: function () {
      return this.erasable === !0 && this.applyEraserToObjects(), o.call(this);
    }
  }),
    (fabric.Eraser = fabric.util.createClass(fabric.Group, {
      type: 'eraser',
      originX: 'center',
      originY: 'center',
      drawObject: function (t) {
        t.save(),
          (t.fillStyle = 'black'),
          t.fillRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
          ),
          t.restore(),
          this.callSuper('drawObject', t);
      },
      _getBounds: function () {},
      _toSVG: function (t) {
        var e = ['<g ', 'COMMON_PARTS', ' >\n'],
          i = -this.width / 2,
          r = -this.height / 2,
          n = [
            '<rect ',
            'fill="white" ',
            'x="',
            i,
            '" y="',
            r,
            '" width="',
            this.width,
            '" height="',
            this.height,
            '" />\n'
          ].join('');
        e.push('		', n);
        for (var s = 0, o = this._objects.length; o > s; s++)
          e.push('		', this._objects[s].toSVG(t));
        return e.push('</g>\n'), e;
      }
    })),
    (fabric.Eraser.fromObject = function (t, e) {
      var i = t.objects;
      fabric.util.enlivenObjects(i, function (i) {
        var r = fabric.util.object.clone(t, !0);
        delete r.objects,
          fabric.util.enlivenObjectEnlivables(t, r, function () {
            e && e(new fabric.Eraser(i, r, !0));
          });
      });
    });
  var a = fabric.Canvas.prototype._renderOverlay;
  fabric.util.object.extend(fabric.Canvas.prototype, {
    isErasing: function () {
      return (
        this.isDrawingMode &&
        this.freeDrawingBrush &&
        'eraser' === this.freeDrawingBrush.type &&
        this.freeDrawingBrush._isErasing
      );
    },
    _renderOverlay: function (t) {
      a.call(this, t),
        this.isErasing() &&
          !this.freeDrawingBrush.inverted &&
          this.freeDrawingBrush._render();
    }
  }),
    (fabric.EraserBrush = fabric.util.createClass(fabric.PencilBrush, {
      type: 'eraser',
      inverted: !1,
      _isErasing: !1,
      _isErasable: function (t) {
        return t.erasable !== !1;
      },
      _prepareCollectionTraversal: function (t, e, i) {
        t.forEachObject(function (r) {
          r.forEachObject && 'deep' === r.erasable
            ? this._prepareCollectionTraversal(r, e, i)
            : !this.inverted && r.erasable && r.visible
            ? ((r.visible = !1),
              (t.dirty = !0),
              i.visibility.push(r),
              i.collection.push(t))
            : this.inverted &&
              r.visible &&
              (r.erasable && r.eraser
                ? ((r.eraser.inverted = !0),
                  (r.dirty = !0),
                  (t.dirty = !0),
                  i.eraser.push(r),
                  i.collection.push(t))
                : ((r.visible = !1),
                  (t.dirty = !0),
                  i.visibility.push(r),
                  i.collection.push(t)));
        }, this);
      },
      preparePattern: function () {
        this._patternCanvas ||
          (this._patternCanvas = fabric.util.createCanvasElement());
        var t = this._patternCanvas;
        (t.width = this.canvas.width), (t.height = this.canvas.height);
        var e = t.getContext('2d');
        if (this.canvas._isRetinaScaling()) {
          var i = this.canvas.getRetinaScaling();
          this.canvas.__initRetinaScaling(i, t, e);
        }
        var r = this.canvas.backgroundImage,
          n = r && this._isErasable(r),
          s = this.canvas.overlayImage,
          o = s && this._isErasable(s);
        if (!this.inverted && ((r && !n) || this.canvas.backgroundColor))
          n && (this.canvas.backgroundImage = void 0),
            this.canvas._renderBackground(e),
            n && (this.canvas.backgroundImage = r);
        else if (this.inverted && r && n) {
          var c = this.canvas.backgroundColor;
          (this.canvas.backgroundColor = void 0),
            this.canvas._renderBackground(e),
            (this.canvas.backgroundColor = c);
        }
        e.save(), e.transform.apply(e, this.canvas.viewportTransform);
        var h = { visibility: [], eraser: [], collection: [] };
        if (
          (this._prepareCollectionTraversal(this.canvas, e, h),
          this.canvas._renderObjects(e, this.canvas._objects),
          h.visibility.forEach(function (t) {
            t.visible = !0;
          }),
          h.eraser.forEach(function (t) {
            (t.eraser.inverted = !1), (t.dirty = !0);
          }),
          h.collection.forEach(function (t) {
            t.dirty = !0;
          }),
          e.restore(),
          !this.inverted && ((s && !o) || this.canvas.overlayColor))
        )
          o && (this.canvas.overlayImage = void 0),
            a.call(this.canvas, e),
            o && (this.canvas.overlayImage = s);
        else if (this.inverted && s && o) {
          var c = this.canvas.overlayColor;
          (this.canvas.overlayColor = void 0),
            a.call(this.canvas, e),
            (this.canvas.overlayColor = c);
        }
      },
      _setBrushStyles: function (t) {
        this.callSuper('_setBrushStyles', t), (t.strokeStyle = 'black');
      },
      _saveAndTransform: function (t) {
        this.callSuper('_saveAndTransform', t),
          this._setBrushStyles(t),
          (t.globalCompositeOperation =
            t === this.canvas.getContext() ? 'destination-out' : 'source-over');
      },
      needsFullRender: function () {
        return !0;
      },
      onMouseDown: function (t, e) {
        this.canvas._isMainEvent(e.e) &&
          (this._prepareForDrawing(t),
          this._captureDrawingPath(t),
          this.preparePattern(),
          (this._isErasing = !0),
          this.canvas.fire('erasing:start'),
          this._render());
      },
      _render: function () {
        var t;
        this.inverted ||
          ((t = this.canvas.getContext()), this.callSuper('_render', t)),
          (t = this.canvas.contextTop),
          this.canvas.clearContext(t),
          this.callSuper('_render', t),
          t.save();
        var e = this.canvas.getRetinaScaling(),
          i = 1 / e;
        t.scale(i, i),
          (t.globalCompositeOperation = 'source-in'),
          t.drawImage(this._patternCanvas, 0, 0),
          t.restore();
      },
      createPath: function (t) {
        var e = this.callSuper('createPath', t);
        return (
          (e.globalCompositeOperation = this.inverted
            ? 'source-over'
            : 'destination-out'),
          (e.stroke = this.inverted ? 'white' : 'black'),
          e
        );
      },
      applyClipPathToPath: function (t, e, i) {
        var r = fabric.util.invertTransform(t.calcTransformMatrix()),
          n = e.calcTransformMatrix(),
          s = e.absolutePositioned
            ? r
            : fabric.util.multiplyTransformMatrices(r, i);
        return (
          (e.absolutePositioned = !1),
          fabric.util.applyTransformToObject(
            e,
            fabric.util.multiplyTransformMatrices(s, n)
          ),
          (t.clipPath = t.clipPath
            ? fabric.util.mergeClipPaths(e, t.clipPath)
            : e),
          t
        );
      },
      clonePathWithClipPath: function (t, e, i) {
        var r = e.calcTransformMatrix(),
          n = e.clipPath,
          s = this;
        t.clone(function (t) {
          n.clone(
            function (e) {
              i(s.applyClipPathToPath(t, e, r));
            },
            ['absolutePositioned', 'inverted']
          );
        });
      },
      _addPathToObjectEraser: function (t, e) {
        var i = this;
        if (t.forEachObject && 'deep' === t.erasable) {
          var r = t._objects.filter(function (t) {
            return t.erasable;
          });
          return void (r.length > 0 && t.clipPath
            ? this.clonePathWithClipPath(e, t, function (t) {
                r.forEach(function (e) {
                  i._addPathToObjectEraser(e, t);
                });
              })
            : r.length > 0 &&
              r.forEach(function (t) {
                i._addPathToObjectEraser(t, e);
              }));
        }
        var n = t.eraser;
        n || ((n = new fabric.Eraser()), (t.eraser = n)),
          e.clone(function (e) {
            var r = fabric.util.multiplyTransformMatrices(
              fabric.util.invertTransform(t.calcTransformMatrix()),
              e.calcTransformMatrix()
            );
            fabric.util.applyTransformToObject(e, r),
              n.addWithUpdate(e),
              t.set('dirty', !0),
              t.fire('erasing:end', { path: e }),
              t.group &&
                Array.isArray(i.__subTargets) &&
                i.__subTargets.push(t);
          });
      },
      applyEraserToCanvas: function (t) {
        var e = this.canvas,
          i = {};
        return (
          ['backgroundImage', 'overlayImage'].forEach(function (r) {
            var n = e[r];
            n && n.erasable && (this._addPathToObjectEraser(n, t), (i[r] = n));
          }, this),
          i
        );
      },
      _finalizeAndAddPath: function () {
        var t = this.canvas.contextTop,
          e = this.canvas;
        t.closePath(),
          this.decimate &&
            (this._points = this.decimatePoints(this._points, this.decimate)),
          e.clearContext(e.contextTop),
          (this._isErasing = !1);
        var i =
          this._points && this._points.length > 1
            ? this.convertPointsToSVGPath(this._points)
            : null;
        if (!i || this._isEmptySVGPath(i))
          return e.fire('erasing:end'), void e.requestRenderAll();
        var r = this.createPath(i);
        r.setCoords(), e.fire('before:path:created', { path: r });
        var n = this.applyEraserToCanvas(r),
          s = this;
        this.__subTargets = [];
        var o = [];
        e.forEachObject(function (t) {
          t.erasable &&
            t.intersectsWithObject(r, !0, !0) &&
            (s._addPathToObjectEraser(t, r), o.push(t));
        }),
          e.fire('erasing:end', {
            path: r,
            targets: o,
            subTargets: this.__subTargets,
            drawables: n
          }),
          delete this.__subTargets,
          e.requestRenderAll(),
          this._resetShadow(),
          e.fire('path:created', { path: r });
      }
    }));
})();
