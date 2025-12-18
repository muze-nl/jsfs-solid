(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // node_modules/@muze-nl/jsfs/src/Path.js
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
      let pathnames = _Path.reduce(path, (result3, entry) => {
        if (entry == "..") {
          result3.pop();
        } else if (entry !== ".") {
          result3.push(entry);
        }
        return result3;
      }, []);
      let result2 = "/";
      if (pathnames.length) {
        result2 += pathnames.join("/");
        if (_Path.isFolder(path)) {
          result2 += "/";
        }
      }
      return result2;
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
      let result2 = "/";
      if (path.length) {
        result2 += path.join("/") + "/";
      }
      return result2;
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
      let result2 = "/";
      if (path.length) {
        result2 += path.join("/") + "/";
      }
      return result2;
    }
  };

  // node_modules/@muze-nl/jsfs/src/Adapters/HttpAdapter.js
  var HttpAdapter = class _HttpAdapter {
    #baseUrl;
    #path;
    #exceptionHandler;
    #fetchParams;
    constructor(baseUrl, path = "/", exceptionHandler = null, fetchParams = {}) {
      this.#baseUrl = new URL(baseUrl, window.location.href);
      this.#path = new Path(path);
      this.#exceptionHandler = exceptionHandler;
      this.#fetchParams = fetchParams;
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
    cd(path) {
      if (!Path.isPath(path)) {
        throw new TypeError(path + " is not a valid path");
      }
      return new _HttpAdapter(this.#baseUrl.href, path);
    }
    //FIXME: return a jsfs result object instead of http response
    async write(path, contents, metadata = null) {
      let params2 = Object.assign({}, this.#fetchParams, {
        method: "PUT",
        body: contents
      });
      return this.#fetch(path, params2);
    }
    writeStream(path, writer, metadata = null) {
      throw new Error("Not yet implemented");
    }
    async read(path) {
      let params2 = Object.assign({}, this.#fetchParams, {
        method: "GET"
      });
      let response2 = await this.#fetch(path, params2);
      let result2 = {
        type: this.#getMimetype(response2),
        name: Path.filename(path),
        http: {
          headers: response2.headers,
          status: response2.status,
          url: response2.url
        }
      };
      if (result2.type.match(/text\/.*/)) {
        result2.contents = await response2.text();
      } else if (result2.type.match(/application\/json.*/)) {
        result2.contents = await response2.json();
      } else {
        result2.contents = await response2.blob();
      }
      return result2;
    }
    readStream(path, reader) {
      throw new Error("Not yet implemented");
    }
    async exists(path) {
      let params2 = Object.assign({}, this.#fetchParams, {
        method: "HEAD"
      });
      return this.#fetch(path, params2);
    }
    async delete(path) {
      let params2 = Object.assign({}, this.#fetchParams, {
        method: "DELETE"
      });
      return this.#fetch(path, params2);
    }
    async list(path) {
      let supportedContentTypes = [
        "text/html",
        "text/xhtml",
        "text/xhtml+xml",
        "text/xml"
      ];
      let result2 = await this.read(path);
      if (supportedContentTypes.includes(result2.type.split(";")[0])) {
        var html = result2.contents;
      } else {
        let url3 = this.#getUrl(path);
        throw new TypeError("URL " + url3 + " is not of a supported content type", {
          cause: result2
        });
      }
      let basePath = Path.collapse(this.#baseUrl.pathname);
      let parentUrl = this.#getUrl(path);
      let dom = document.createElement("template");
      dom.innerHTML = html;
      let links = dom.content.querySelectorAll("a[href]");
      return Array.from(links).map((link) => {
        let url3 = new URL(link.getAttribute("href"), parentUrl.href);
        link.href = url3.href;
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
    #getUrl(path) {
      path = Path.collapse(this.#baseUrl.pathname + Path.collapse(path));
      return new URL(path, this.#baseUrl);
    }
    async #fetch(path, options) {
      return fetch(this.#getUrl(path), options).catch((e) => {
        if (!this.#exceptionHandler || !this.#exceptionHandler(url, options, e)) {
          throw e;
        }
      });
    }
    #getMimetype(response2) {
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
    url: () => url2
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
      url: typeof window != "undefined" ? url2(window.location) : url2("https://localhost"),
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
          this.clientOptions.url = url2(this.clientOptions.url.href, option);
        } else if (option instanceof Function) {
          this.#addMiddlewares([option]);
        } else if (option && typeof option == "object") {
          for (let param in option) {
            if (param == "middlewares") {
              this.#addMiddlewares(option[param]);
            } else if (param == "url") {
              this.clientOptions.url = url2(this.clientOptions.url.href, option[param]);
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
    let params2 = current || {};
    if (!params2.url && current.url) {
      params2.url = current.url;
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
        params2[prop] = value(params2[prop], params2);
      } else {
        if (prop == "url") {
          params2.url = url2(params2.url, value);
        } else if (prop == "headers") {
          params2.headers = new Headers(current.headers);
          if (!(value instanceof Headers)) {
            value = new Headers(req.headers);
          }
          for (let [key, val] of value.entries()) {
            params2.headers.set(key, val);
          }
        } else {
          params2[prop] = value;
        }
      }
    }
    if (req instanceof Request && req.data) {
      params2.body = req.data;
    }
    return params2;
  }
  function request(...options) {
    let requestParams = {
      url: typeof window != "undefined" ? url2(window.location) : url2("https://localhost/"),
      duplex: "half"
      // required when setting body to ReadableStream, just set it here by default already
    };
    for (let option of options) {
      if (typeof option == "string" || option instanceof URL || option instanceof URLSearchParams) {
        requestParams.url = url2(requestParams.url, option);
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
        let result2;
        switch (prop) {
          case Symbol.metroSource:
            result2 = target;
            break;
          case Symbol.metroProxy:
            result2 = true;
            break;
          case "with":
            result2 = function(...options2) {
              if (data) {
                options2.unshift({ body: data });
              }
              return request(target, ...options2);
            };
            break;
          case "data":
            result2 = data;
            break;
          default:
            if (target[prop] instanceof Function) {
              if (prop === "clone") {
              }
              result2 = target[prop].bind(target);
            } else {
              result2 = target[prop];
            }
            break;
        }
        return result2;
      }
    });
  }
  function getResponseParams(res, current) {
    let params2 = current || {};
    if (!params2.url && current.url) {
      params2.url = current.url;
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
        params2[prop] = value(params2[prop], params2);
      } else {
        if (prop == "url") {
          params2.url = new URL(value, params2.url || "https://localhost/");
        } else {
          params2[prop] = value;
        }
      }
    }
    if (res instanceof Response && res.data) {
      params2.body = res.data;
    }
    return params2;
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
        let result2;
        switch (prop) {
          case Symbol.metroProxy:
            result2 = true;
            break;
          case Symbol.metroSource:
            result2 = target;
            break;
          case "with":
            result2 = function(...options2) {
              return response(target, ...options2);
            };
            break;
          case "data":
            result2 = data;
            break;
          case "ok":
            result2 = target.status >= 200 && target.status < 400;
            break;
          default:
            if (typeof target[prop] == "function") {
              result2 = target[prop].bind(target);
            } else {
              result2 = target[prop];
            }
            break;
        }
        return result2;
      }
    });
  }
  function appendSearchParams(url3, params2) {
    if (typeof params2 == "function") {
      params2(url3.searchParams, url3);
    } else {
      params2 = new URLSearchParams(params2);
      params2.forEach((value, key) => {
        url3.searchParams.append(key, value);
      });
    }
  }
  function url2(...options) {
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
        let result2;
        switch (prop) {
          case Symbol.metroProxy:
            result2 = true;
            break;
          case Symbol.metroSource:
            result2 = target;
            break;
          case "with":
            result2 = function(...options2) {
              return url2(target, ...options2);
            };
            break;
          case "filename":
            result2 = target.pathname.split("/").pop();
            break;
          case "folderpath":
            result2 = target.pathname.substring(0, target.pathname.lastIndexOf("\\") + 1);
            break;
          case "authority":
            result2 = target.username ?? "";
            result2 += target.password ? ":" + target.password : "";
            result2 += result2 ? "@" : "";
            result2 += target.hostname;
            result2 += target.port ? ":" + target.port : "";
            result2 += "/";
            result2 = target.protocol + "//" + result2;
            break;
          case "origin":
            result2 = target.protocol + "//" + target.hostname;
            result2 += target.port ? ":" + target.port : "";
            result2 += "/";
            break;
          case "fragment":
            result2 = target.hash.substring(1);
            break;
          case "scheme":
            if (target.protocol) {
              result2 = target.protocol.substring(0, target.protocol.length - 1);
            } else {
              result2 = "";
            }
            break;
          default:
            if (target[prop] instanceof Function) {
              result2 = target[prop].bind(target);
            } else {
              result2 = target[prop];
            }
            break;
        }
        return result2;
      }
    });
  }
  function formdata(...options) {
    var params2 = new FormData();
    for (let option of options) {
      if (option instanceof HTMLFormElement) {
        option = new FormData(option);
      }
      if (option instanceof FormData) {
        for (let entry of option.entries()) {
          params2.append(entry[0], entry[1]);
        }
      } else if (option && typeof option == "object") {
        for (let entry of Object.entries(option)) {
          if (Array.isArray(entry[1])) {
            for (let value of entry[1]) {
              params2.append(entry[0], value);
            }
          } else {
            params2.append(entry[0], entry[1]);
          }
        }
      } else {
        throw new metroError("metro.formdata: unknown option type " + metroURL + "formdata/unknown-option-value/", option);
      }
    }
    Object.freeze(params2);
    return new Proxy(params2, {
      get(target, prop) {
        let result2;
        switch (prop) {
          case Symbol.metroProxy:
            result2 = true;
            break;
          case Symbol.metroSource:
            result2 = target;
            break;
          //TODO: add toString() that can check
          //headers param: toString({headers:request.headers})
          //for the content-type
          case "with":
            result2 = function(...options2) {
              return formdata(target, ...options2);
            };
            break;
          default:
            if (target[prop] instanceof Function) {
              result2 = target[prop].bind(target);
            } else {
              result2 = target[prop];
            }
            break;
        }
        return result2;
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
        let result2 = Object.assign({}, object);
        Object.keys(result2).forEach((key) => {
          result2[key] = deepClone(object[key]);
        });
        return result2;
      } else {
        return object;
      }
    }
    return object;
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
          if (!contentType || isPlainText2(contentType)) {
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
      if (isJSON(res.headers.get("Content-Type"))) {
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
  function isPlainText2(contentType) {
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

  // node_modules/@muze-nl/metro/src/api.mjs
  var API = class extends Client {
    constructor(base, methods, bind = null) {
      if (base instanceof Client) {
        super(base.clientOptions, throwermw(), getdatamw());
      } else {
        super(base, throwermw(), getdatamw());
      }
      if (!bind) {
        bind = this;
      }
      for (const methodName in methods) {
        if (typeof methods[methodName] == "function") {
          this[methodName] = methods[methodName].bind(bind);
        } else if (methods[methodName] && typeof methods[methodName] == "object") {
          this[methodName] = new this.constructor(base, methods[methodName], bind);
        } else {
          this[methodName] = methods[methodName];
        }
      }
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
      jsonmw,
      thrower: throwermw
    },
    api,
    jsonApi
  });
  if (!globalThis.metro) {
    globalThis.metro = metro2;
  }
  var everything_default = metro2;

  // node_modules/@muze-nl/assert/src/assert.mjs
  globalThis.assertEnabled = false;
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
      let url3 = new URL(data);
      if (url3.href != data) {
        if (!(url3.href + "/" == data || url3.href == data + "/")) {
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
          let result2 = fails(data, pattern, root, path);
          if (result2) {
            problems = problems.concat(result2);
          }
        } else {
          for (const [patternKey, subpattern] of Object.entries(pattern)) {
            let result2 = fails(data[patternKey], subpattern, root, path + "." + patternKey);
            if (result2) {
              problems = problems.concat(result2);
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
    let result2 = {
      path,
      message,
      found,
      expected
    };
    if (problems) {
      result2.problems = problems;
    }
    return result2;
  }
  function warn(message, data, pattern, path) {
    console.warn("\u{1F170}\uFE0F  Assert: " + path, message, pattern, data);
  }

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
      authorize_callback: async (url3) => {
        if (window.location.href != url3.href) {
          window.location.replace(url3.href);
        }
        return false;
      }
    };
    assert(options, {});
    const oauth2 = Object.assign({}, defaultOptions.oauth2_configuration, options?.oauth2_configuration);
    options = Object.assign({}, defaultOptions, options);
    options.oauth2_configuration = oauth2;
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
    for (let option in oauth2) {
      switch (option) {
        case "access_token":
        case "authorization_code":
        case "refresh_token":
          options.tokens.set(option, oauth2[option]);
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
        let url3 = url2(window.location);
        let code, state, params2;
        if (url3.searchParams.has("code")) {
          params2 = url3.searchParams;
          url3 = url3.with({ search: "" });
          history.pushState({}, "", url3.href);
        } else if (url3.hash) {
          let query = url3.hash.substr(1);
          params2 = new URLSearchParams("?" + query);
          url3 = url3.with({ hash: "" });
          history.pushState({}, "", url3.href);
        }
        if (params2) {
          code = params2.get("code");
          state = params2.get("state");
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
      if (oauth2.grant_type === "authorization_code" && !options.tokens.has("authorization_code")) {
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
        throw metroError("OAuth2mw: fetch access_token: " + response2.status + ": " + response2.statusText, { cause: tokenReq });
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
      if (!oauth2.authorization_endpoint) {
        throw metroError("oauth2mw: Missing options.oauth2_configuration.authorization_endpoint");
      }
      let url3 = url2(oauth2.authorization_endpoint, { hash: "" });
      assert(oauth2, {
        client_id: /.+/,
        redirect_uri: /.+/,
        scope: /.*/
      });
      let search = {
        response_type: "code",
        // implicit flow uses 'token' here, but is not considered safe, so not supported
        client_id: oauth2.client_id,
        redirect_uri: oauth2.redirect_uri,
        state: oauth2.state || createState(40)
        // OAuth2.1 RFC says optional, but its a good idea to always add/check it
      };
      if (oauth2.response_type) {
        search.response_type = oauth2.response_type;
      }
      if (oauth2.response_mode) {
        search.response_mode = oauth2.response_mode;
      }
      options.state.set(search.state);
      if (oauth2.client_secret) {
        search.client_secret = oauth2.client_secret;
      }
      if (oauth2.code_verifier) {
        options.tokens.set("code_verifier", oauth2.code_verifier);
        search.code_challenge = await generateCodeChallenge(oauth2.code_verifier);
        search.code_challenge_method = "S256";
      }
      if (oauth2.scope) {
        search.scope = oauth2.scope;
      }
      if (oauth2.prompt) {
        search.prompt = oauth2.prompt;
      }
      return url2(url3, { search });
    }
    function getAccessTokenRequest(grant_type = null) {
      assert(oauth2, {
        client_id: /.+/,
        redirect_uri: /.+/
      });
      if (!oauth2.token_endpoint) {
        throw metroError("oauth2mw: Missing options.endpoints.token url");
      }
      let url3 = url2(oauth2.token_endpoint, { hash: "" });
      let params2 = {
        grant_type: grant_type || oauth2.grant_type,
        client_id: oauth2.client_id
      };
      if (oauth2.client_secret) {
        params2.client_secret = oauth2.client_secret;
      }
      if (oauth2.scope) {
        params2.scope = oauth2.scope;
      }
      switch (params2.grant_type) {
        case "authorization_code":
          params2.redirect_uri = oauth2.redirect_uri;
          params2.code = options.tokens.get("authorization_code");
          const code_verifier = options.tokens.get("code_verifier");
          if (code_verifier) {
            params2.code_verifier = code_verifier;
          }
          break;
        case "client_credentials":
          break;
        case "refresh_token":
          const refreshToken = options.tokens.get("refresh_token");
          params2.refresh_token = refreshToken.value;
          break;
        default:
          throw new Error("Unknown grant_type: ".oauth2.grant_type);
          break;
      }
      return request(url3, { method: "POST", body: new URLSearchParams(params2) });
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
    let url3 = new URL(document.location.href);
    if (!url3.searchParams.has("code")) {
      if (url3.hash) {
        let query = url3.hash.substr(1);
        params = new URLSearchParams("?" + query);
        if (params.has("code")) {
          return true;
        }
      }
      return false;
    }
    return true;
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
  var CHUNK_SIZE = 32768;
  function encodeBase64Url(input) {
    if (input instanceof ArrayBuffer) {
      input = new Uint8Array(input);
    }
    const arr = [];
    for (let i = 0; i < input.byteLength; i += CHUNK_SIZE) {
      arr.push(String.fromCharCode.apply(null, input.subarray(i, i + CHUNK_SIZE)));
    }
    return btoa(arr.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  }
  function b64u(input) {
    return encodeBase64Url(input);
  }
  function randomBytes() {
    return b64u(crypto.getRandomValues(new Uint8Array(32)));
  }
  var UnsupportedOperationError = class extends Error {
    constructor(message) {
      super(message ?? "operation not supported");
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
    }
  };
  var OperationProcessingError = class extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      Error.captureStackTrace?.(this, this.constructor);
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
        return "EdDSA";
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
  async function DPoP(keypair, htu, htm, nonce, accessToken, additional) {
    const privateKey = keypair?.privateKey;
    const publicKey = keypair?.publicKey;
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
    }, {
      ...additional,
      iat: epochTime(),
      jti: randomBytes(),
      htm,
      nonce,
      htu,
      ath: accessToken ? b64u(await crypto.subtle.digest("SHA-256", buf(accessToken))) : void 0
    }, privateKey);
  }
  async function publicJwk(key) {
    const { kty, e, n, x, y, crv } = await crypto.subtle.exportKey("jwk", key);
    return { kty, crv, e, n, x, y };
  }
  async function generateKeyPair(alg, options) {
    let algorithm;
    if (typeof alg !== "string" || alg.length === 0) {
      throw new TypeError('"alg" must be a non-empty string');
    }
    switch (alg) {
      case "PS256":
        algorithm = {
          name: "RSA-PSS",
          hash: "SHA-256",
          modulusLength: options?.modulusLength ?? 2048,
          publicExponent: new Uint8Array([1, 0, 1])
        };
        break;
      case "RS256":
        algorithm = {
          name: "RSASSA-PKCS1-v1_5",
          hash: "SHA-256",
          modulusLength: options?.modulusLength ?? 2048,
          publicExponent: new Uint8Array([1, 0, 1])
        };
        break;
      case "ES256":
        algorithm = { name: "ECDSA", namedCurve: "P-256" };
        break;
      case "EdDSA":
        algorithm = { name: "Ed25519" };
        break;
      default:
        throw new UnsupportedOperationError();
    }
    return crypto.subtle.generateKey(algorithm, options?.extractable ?? false, ["sign", "verify"]);
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
      const url3 = everything_default.url(req.url);
      if (req.url.startsWith(options.authorization_endpoint)) {
        let params2 = req.body;
        if (params2 instanceof URLSearchParams || params2 instanceof FormData) {
          params2.set("dpop_jkt", keyInfo.keyPair.publicKey);
        } else {
          params2.dpop_jkt = keyInfo.keyPair.publicKey;
        }
      } else if (req.url.startsWith(options.token_endpoint)) {
        const dpopHeader = await DPoP(keyInfo.keyPair, req.url, req.method);
        req = req.with({
          headers: {
            "DPoP": dpopHeader
          }
        });
      } else if (req.headers.has("Authorization")) {
        const nonce = localStorage.getItem(url3.host + ":nonce") || void 0;
        const accessToken = req.headers.get("Authorization").split(" ")[1];
        const dpopHeader = await DPoP(keyInfo.keyPair, req.url, req.method, nonce, accessToken);
        req = req.with({
          headers: {
            "Authorization": "DPoP " + accessToken,
            "DPoP": dpopHeader
          }
        });
      }
      let response2 = await next(req);
      if (response2.headers.get("DPoP-Nonce")) {
        localStorage.setItem(url3.host + ":nonce", response2.headers.get("DPoP-Nonce"));
      }
      return response2;
    };
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
  var validAuthMethods = [
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
    function MustUseHTTPS(url3) {
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
      token_endpoint_auth_methods_supported: Optional(anyOf(...validAuthMethods)),
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
      token_endpoint_auth_method: Optional(oneOf(...validAuthMethods)),
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
      authorize_callback: async (url3) => {
        if (window.location.href != url3.href) {
          window.location.replace(url3.href);
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
  var browser_default = oidc;

  // node_modules/@muze-nl/oldm/src/oldm.mjs
  function oldm(options) {
    return new Context(options);
  }
  var rdfType = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
  var prefixes = {
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    solid: "http://www.w3.org/ns/solid/terms#",
    schema: "http://schema.org/",
    vcard: "http://www.w3.org/2006/vcard/ns#"
  };
  var Context = class {
    constructor(options) {
      this.prefixes = { ...prefixes, ...options?.prefixes };
      if (!this.prefixes["xsd"]) {
        this.prefixes["xsd"] = "http://www.w3.org/2001/XMLSchema#";
      }
      this.parser = options?.parser;
      this.writer = options?.writer;
      this.sources = /* @__PURE__ */ Object.create(null);
      this.separator = options?.separator ?? "$";
    }
    parse(input, url3, type) {
      const { quads, prefixes: prefixes2 } = this.parser(input, url3, type);
      if (prefixes2) {
        for (let prefix in prefixes2) {
          let prefixURL = prefixes2[prefix];
          if (prefixURL.match(/^http(s?):\/\/$/i)) {
            prefixURL += url3.substring(prefixURL.length);
          } else try {
            prefixURL = new URL(prefixes2[prefix], url3).href;
          } catch (err) {
            console.error("Could not parse prefix", prefixes2[prefix], err.message);
          }
          if (!this.prefixes[prefix]) {
            this.prefixes[prefix] = prefixURL;
          }
        }
      }
      this.sources[url3] = new Graph(quads, url3, type, prefixes2, this);
      return this.sources[url3];
    }
    setType(literal, shortType) {
      if (!shortType) {
        return literal;
      }
      if (typeof literal == "string") {
        literal = new String(literal);
      } else if (typeof result == "number") {
        literal = new Number(literal);
      }
      if (typeof literal !== "object") {
        throw new Error("cannot set type on ", literal, shortType);
      }
      literal.type = shortType;
      return literal;
    }
    getType(literal) {
      if (literal && typeof literal == "object") {
        return literal.type;
      }
      return null;
    }
  };
  var Graph = class {
    #blankNodes = /* @__PURE__ */ Object.create(null);
    constructor(quads, url3, mimetype, prefixes2, context) {
      this.mimetype = mimetype;
      this.url = url3;
      this.prefixes = prefixes2;
      this.context = context;
      this.subjects = /* @__PURE__ */ Object.create(null);
      for (let quad of quads) {
        let subject;
        if (quad.subject.termType == "BlankNode") {
          let shortPred = this.shortURI(quad.predicate.id, ":");
          let shortObj;
          switch (shortPred) {
            case "rdf:first":
              subject = this.addCollection(quad.subject.id);
              shortObj = this.shortURI(quad.object.id, ":");
              if (shortObj != "rdf:nil") {
                const value = this.getValue(quad.object);
                if (value) {
                  subject.push(value);
                }
              }
              continue;
            case "rdf:rest":
              this.#blankNodes[quad.object.id] = this.#blankNodes[quad.subject.id];
              continue;
            default:
              subject = this.addBlankNode(quad.subject.id);
              break;
          }
        } else {
          subject = this.addNamedNode(quad.subject.id);
        }
        subject.addPredicate(quad.predicate.id, quad.object);
      }
      if (this.subjects[url3]) {
        this.primary = this.subjects[url3];
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
    fullURI(shortURI, separator = null) {
      if (!separator) {
        separator = this.context.separator;
      }
      const [prefix, path] = shortURI.split(separator);
      if (path) {
        return this.prefixes[prefix] + path;
      }
      return shortURI;
    }
    shortURI(fullURI, separator = null) {
      if (!separator) {
        separator = this.context.separator;
      }
      for (let prefix in this.context.prefixes) {
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
    setType(literal, type) {
      const shortType = this.shortURI(type);
      return this.context.setType(literal, shortType);
    }
    /**
     * This returns the type of a literal, or null
     */
    getType(literal) {
      return this.context.getType(literal);
    }
    setLanguage(literal, language) {
      if (typeof literal == "string") {
        literal = new String(literal);
      } else if (typeof result == "number") {
        literal = new Number(literal);
      }
      if (typeof literal !== "object") {
        throw new Error("cannot set language on ", literal);
      }
      literal.language = language;
      return literal;
    }
    getValue(object) {
      let result2;
      if (object.termType == "Literal") {
        result2 = object.value;
        let datatype = object.datatype?.id;
        if (datatype) {
          result2 = this.setType(result2, datatype);
        }
        let language = object.language;
        if (language) {
          result2 = this.setLanguage(result2, language);
        }
      } else if (object.termType == "BlankNode") {
        result2 = this.addBlankNode(object.id);
      } else {
        result2 = this.addNamedNode(object.id);
      }
      return result2;
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
    constructor(id, graph) {
      super();
      Object.defineProperty(this, "graph", {
        value: graph,
        writable: false,
        enumerable: false
      });
    }
  };

  // node_modules/@muze-nl/metro-oldm/src/oldmmw.mjs
  function oldmmw(options) {
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
      parser: oldm.n3Parser,
      writer: oldm.n3Writer
    }, options);
    if (!options.prefixes["ldp"]) {
      options.prefixes["ldp"] = "http://www.w3.org/ns/ldp#";
    }
    const context = oldm(options);
    return async function oldmmw2(req, next) {
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
          if (isLinkedData(req.headers.get("Content-Type"))) {
            req = req.with({
              body: await context.writer(req.data)
            });
          }
        }
      }
      let res = await next(req);
    };
  }

  // node_modules/@muze-nl/metro-oldm/src/index.mjs
  globalThis.oldmmw = oldmmw;
  var src_default = oldmmw;

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
          const result2 = {
            [filterKey]: filterValue(data, filterKey, "select")
          };
          return result2;
        });
      } else if (!isPrimitiveWrapper(filterValue)) {
        fns.push((data) => {
          const result2 = {
            [filterKey]: from(data[filterKey]).select(filterValue)
          };
          return result2;
        });
      } else {
        fns.push(() => {
          return {
            [filterKey]: filterValue
          };
        });
      }
    }
    if (fns.length == 1) {
      return fns[0];
    }
    return (data) => {
      let result2 = {};
      for (let fn of fns) {
        Object.assign(result2, fn(data));
      }
      return result2;
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
        let result2 = fn(a, b);
        if (result2 !== 0) {
          return result2;
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
      let result2 = {};
      for (let fn of fns) {
        Object.assign(result2, fn(a, o, i, l));
      }
      return result2;
    };
  }
  function getMatchingGroups(data, pointerFn) {
    let result2 = {};
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
        if (!result2[group]) {
          result2[group] = [];
        }
        result2[group].push(entity);
      }
    }
    return result2;
  }
  function groupBy(data, pointerFunctions) {
    let pointerFn = pointerFunctions.shift();
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
      let result2 = target.apply(thisArg, argumentsList);
      if (typeof result2 === "object") {
        return new Proxy(result2, DataProxyHandler);
      }
      return result2;
    }
  };
  var DataProxyHandler = {
    get(target, property) {
      let result2 = null;
      if (typeof property === "symbol") {
        result2 = target[property];
      }
      if (Array.isArray(target)) {
        switch (property) {
          case "where":
            result2 = function(shape) {
              let matchFn = getMatchFn(shape);
              return new Proxy(
                target.filter((element) => matchFn(element)),
                DataProxyHandler
              );
            };
            break;
          case "select":
            result2 = function(filter) {
              let selectFn = getSelectFn(filter);
              return new Proxy(
                target.map(selectFn),
                DataProxyHandler
              );
            };
            break;
          case "reduce":
            result2 = function(pattern, initial = []) {
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
            result2 = function(pattern) {
              let sortFn = getSortFn(pattern);
              return new Proxy(
                target.toSorted(sortFn),
                DataProxyHandler
              );
            };
            break;
          case "groupBy":
            result2 = function(...groups) {
              let temp = groupBy(target, groups);
              return new Proxy(
                temp,
                GroupByProxyHandler
              );
            };
            break;
        }
      }
      if (!result2 && target && typeof target === "object") {
        if (property === "select") {
          result2 = function(filter) {
            let selector = getSelectFn(filter);
            return new Proxy(selector(target), DataProxyHandler);
          };
        }
      }
      if (!result2 && target && typeof target[property] === "function") {
        result2 = new Proxy(target[property], FunctionProxyHandler);
      }
      if (!result2) {
        result2 = target[property];
      }
      return result2;
    }
  };
  var GroupByProxyHandler = {
    get(target, property) {
      let result2 = null;
      switch (property) {
        case "select":
          result2 = function(filter) {
            let selectFn = getSelectFn(filter);
            let result3 = {};
            for (let group in target) {
              if (Array.isArray(target[group])) {
                result3[group] = new Proxy(target[group].map(selectFn), DataProxyHandler);
              } else {
                result3[group] = new Proxy(target[group], GroupByProxyHandler);
              }
            }
            return result3;
          };
          break;
        case "reduce":
          result2 = function(pattern, initial = []) {
            let aggregateFn = getAggregateFn(pattern);
            let result3 = {};
            for (let group in target) {
              if (Array.isArray(target[group])) {
                let temp = target[group].reduce(aggregateFn, initial);
                if (Array.isArray(temp)) {
                  result3[group] = new Proxy(temp, DataProxyHandler);
                } else if (!isPrimitiveWrapper(temp)) {
                  result3[group] = new Proxy(temp, GroupByProxyHandler);
                } else {
                  result3[group] = temp;
                }
              } else {
                result3[group] = new Proxy(target[group], GroupByProxyHandler);
              }
            }
            return result3;
          };
          break;
        default:
          if (Array.isArray(target[property])) {
            result2 = from(target[property]);
          } else {
            result2 = target[property];
          }
          break;
      }
      return result2;
    }
  };
  var EmptyHandler = {
    get(target, property) {
      let result2 = null;
      switch (property) {
        case "where":
          result2 = function() {
            return new Proxy(new Null(), EmptyHandler);
          };
          break;
        case "reduce":
        case "select":
          result2 = function() {
            return null;
          };
          break;
        case "orderBy":
          result2 = function() {
            return new Proxy(new Null(), EmptyHandler);
          };
          break;
        case "groupBy":
          result2 = function() {
            return new Proxy(new Null(), EmptyHandler);
          };
          break;
      }
      if (!result2 && typeof target?.[property] == "function") {
        result2 = target[property];
      }
      return result2;
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
      } else if (key) {
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
        let result2 = target(...argumentsList);
        if (Array.isArray(result2)) {
          result2 = result2.flat(Infinity);
        }
        return result2;
      }
    };
  };
  var _ = new Proxy(getPointerFn(), pointerHandler());

  // src/SolidAdapter.js
  var SolidAdapter = class extends HttpAdapter {
    #client;
    #path;
    constructor(metroClient, path = "/", solidConfiguration = {}) {
      this.#client = client(metroClient).with(browser_default.oidcmw(solidConfiguration)).with(src_default(solidConfiguration));
      this.#path = new Path(path);
    }
    get name() {
      return "SolidAdapter";
    }
    async list(path) {
      let supportedContentTypes = [
        "text/turtle"
      ];
      let result2 = await this.read(path);
      if (result2.data) {
        from(result2.data).where({
          a: "ldp$Resource"
        }).select({
          filename: (o) => jsfs.path.filename(metro.url(o.id).pathname),
          path: (o) => metro.url(o.id).pathname,
          type: (o) => o.a.includes("ldp$Container") ? "folder" : "file"
        });
      } else {
        throw new Error(path + " could not be parsed", { cause: result2 });
      }
    }
  };

  // src/browser.js
  var browser_default2 = SolidAdapter;
  globalThis.SolidAdapter = SolidAdapter;
})();
//# sourceMappingURL=browser.js.map
