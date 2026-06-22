[![GitHub License](https://img.shields.io/github/license/muze-nl/jsfs-solid)](https://github.com/muze-nl/jsfs-solid/blob/main/LICENSE)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/muze-nl/jsfs-solid)](https://github.com/muze-nl/jsfs-solid/blob/main/package.json)
[![NPM Version](https://img.shields.io/npm/v/@muze-nl/jsfs-solid)](https://www.npmjs.com/package/@muze-nl/jsfs-solid)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@muze-nl/jsfs-solid)](https://www.npmjs.com/package/@muze-nl/jsfs-solid)
[![Project stage: Experimental][project-stage-badge: Experimental]][project-stage-page]

# JSFS-Solid

JSFS-Solid is a small Solid client built around a filesystem-shaped API.
It is meant for web applications that want to use a Solid Pod as user-owned storage without forcing the whole application to be written as an RDF database client.

It combines:

- [JSFS](https://github.com/muze-nl/jsfs) for a small filesystem abstraction.
- [Metro](https://github.com/muze-nl/metro) for HTTP requests and middleware.
- [Metro-OIDC](https://github.com/muze-nl/metro-oidc) for Solid/OIDC authorization.
- [Metro-OLDM](https://github.com/muze-nl/metro-oldm) and [OLDM](https://github.com/muze-nl/oldm) for reading and writing Turtle resources as JavaScript objects.
- [JAQT](https://github.com/muze-nl/jaqt) as the recommended JavaScript-native query layer for OLDM data.

This package is **experimental**. The overall direction is stable, but the public API still needs tests, clearer package exports, and more Solid interoperability work before it should be treated as production-ready.

## Why this exists

Solid gives applications a way to store data in user-controlled Pods. A lot of application data is naturally file-like: notes, contacts, settings, bookmarks, documents, media, lists, and small Turtle resources.

JSFS-Solid starts from that use case:

```js
const client = await solidClient('https://example.pod/profile/card#me', {
  client_info: {
    client_name: 'My App'
  }
})

const storage = client.storage[0]
const entries = await storage.list()
const file = await storage.read('contacts.ttl')
```

The goal is not to hide Solid or RDF completely. The goal is to make the common path approachable while still leaving the underlying pieces visible and replaceable.

## Main design choices

### 1. Pod storage is presented as a filesystem

Each storage root from the WebID profile becomes a JSFS filesystem. You can list, read, write, check existence, create directories, and remove resources through a small API.

This is a good fit for applications that know which resources they use. It is less suitable for applications that need global RDF graph queries across unknown documents. For those, a SPARQL/RDF query engine such as Comunica may be a better fit.

### 2. Authentication is public-first

JSFS-Solid does **not** force a login at startup.

It first tries to read resources normally. The OIDC authorization flow is only used when a protected resource requires it. This is deliberate: Solid data can be public, private, or mixed, and applications should not ask users to log in before they actually need access to protected data.

One consequence is that WebID discovery must work without authentication, or the application must provide enough information explicitly. In the current implementation, the WebID profile is read first and is expected to expose a Solid OIDC issuer.

### 3. Turtle resources become OLDM object data

Turtle resources are parsed with OLDM. A read result can contain both the original contents and parsed object data:

```js
const file = await storage.read('profile/card')

file.contents // original text, for text resources
file.data     // parsed OLDM graph, when the response is linked data
```

OLDM intentionally gives RDF data an object-shaped JavaScript interface. That makes small Solid applications easier to write, but it also means developers should understand OLDM's mapping rules for repeated predicates, language tags, datatypes, blank nodes, collections, and source graphs.

### 4. Querying should stay in JavaScript when possible

JAQT is the preferred query layer for OLDM data. It keeps querying close to normal JavaScript objects instead of requiring SPARQL for simple application-level filtering and projection.

Example:

```js
import { from } from '@muze-nl/jaqt'

const contactsFile = await storage.read('contacts.ttl')

const contacts = from(contactsFile.data.data)
  .where({ a: 'vcard$Individual' })
  .select({
    id: contact => contact.id,
    name: contact => String(contact.vcard$fn ?? '')
  })
```

JAQT is currently a dependency of this package, but the query story should become more explicit in the API and documentation.

### 5. The stack is made of replaceable parts

JSFS-Solid is intentionally not one large Solid framework. It composes smaller libraries:

- Replace JSFS if you do not want a filesystem API.
- Replace Metro middleware if you need a different HTTP/auth flow.
- Replace OLDM if you want to work directly with RDF/JS datasets.
- Use JAQT only where object-level querying helps.

This keeps the architecture inspectable and adaptable, which is important for Muze projects.

## Installation

```bash
npm install @muze-nl/jsfs-solid
```

## Browser usage

Using the browser bundle from a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@muze-nl/jsfs-solid/dist/browser.min.js"></script>
<script>
  async function main() {
    const client = await solidClient('https://example.pod/profile/card#me', {
      client_info: {
        client_name: 'My App'
      }
    })

    const entries = await client.storage[0].list()
    console.log(entries)
  }

  main()
</script>
```

The browser bundle currently exposes:

```js
solidClient
SolidAdapter
```

on `globalThis`.

## ESM usage

Using ES modules:

```js
import solidClient from '@muze-nl/jsfs-solid'

const client = await solidClient('https://example.pod/profile/card#me', {
  client_info: {
    client_name: 'My App'
  }
})
```

## Creating a client

```js
const client = await solidClient(webid, options)
```

The `webid` argument is the user's Solid WebID.

The `options` object is passed through to the underlying Metro/OIDC/OLDM stack. At minimum, browser applications should provide client information:

```js
const client = await solidClient('https://example.pod/profile/card#me', {
  client_info: {
    client_name: 'My App'
  }
})
```

The returned client contains:

- `profile`: the WebID profile parsed with OLDM.
- `storage`: an array of JSFS filesystems, one for each storage root found in the profile.
- `issuer`: the first Solid OIDC issuer found in the profile, or `null`.
- `inbox`: the first inbox found in the profile, or `null`.
- `id()`: returns the ID token, but only after the client has authenticated.
- HTTP methods from Metro: `get`, `post`, `put`, `delete`, and `patch`.

The HTTP methods use the same public-first authorization behavior: they can trigger Solid/OIDC authorization when a protected resource requires it.

## Working with storage

The storage entries are JSFS filesystems. The core methods are:

```js
storage.cd(path)
storage.read(path)
storage.write(path, contents, metadata)
storage.exists(path)
storage.remove(path)
storage.list(path)
storage.mkdir(path)
storage.rmdir(path)
```

Listing a container:

```js
const entries = await storage.list('/')

for (const entry of entries) {
  console.log(entry.path, entry.type)
}
```

A list entry contains at least:

```js
{
  filename,
  path,
  type // 'file' or 'folder'
}
```

Reading a resource:

```js
const file = await storage.read('contacts.ttl')
```

A read result contains:

```js
{
  type,
  name,
  contents,
  data,
  http: {
    headers,
    status,
    url
  }
}
```

`contents` contains the raw body for text and JSON resources. `data` is present when the linked-data middleware could parse the response into OLDM data.

Writing a resource:

```js
await storage.write('notes/hello.txt', 'Hello world', {
  type: 'text/plain'
})
```

For Turtle resources, write serialized Turtle text or use OLDM's writer first:

```js
const turtle = await file.data.write()
await storage.write('contacts.ttl', turtle, {
  type: 'text/turtle'
})
```

## Tradeoffs

JSFS-Solid is intentionally small and application-oriented. That gives it a clear shape, but it also means it does not try to cover every Solid or RDF use case.

Use JSFS-Solid when:

- Your application treats a Pod mostly as user-owned storage.
- You want public resources to work without an upfront login.
- You want a small filesystem API for containers and resources.
- You want Turtle data as JavaScript objects through OLDM.
- You prefer JavaScript-native querying through JAQT for app-level data.

Consider another Solid/RDF stack when:

- You need mature access-control management such as WAC, ACP, or access grants.
- You need live notifications or subscriptions.
- You need SPARQL or federated queries over many documents.
- You need schema-driven TypeScript types and validation.
- You need a production-ready SDK with broader Solid coverage today.

## Current limitations

- The package is experimental and does not yet have a real automated test suite.
- Some internal dependencies are imported through deep package paths; these should become stable package exports.
- WebID profile discovery currently assumes the profile can be read before authentication, unless enough information is supplied through options.
- Writes are currently resource-level writes. ETag/conditional write support should be added before relying on this in multi-device or collaborative applications.
- Access-control management, notifications, type registry support, and richer Solid discovery are not first-class yet.
- JAQT is present but not yet documented as a first-class query API.
- OLDM simplifies RDF into an object model; applications that need full RDF semantics should use an RDF-native library directly.

## Dependencies

- [JSFS](https://github.com/muze-nl/jsfs)
- [OLDM](https://github.com/muze-nl/oldm)
- [JAQT](https://github.com/muze-nl/jaqt)
- [Metro](https://github.com/muze-nl/metro)
- [Metro-OIDC](https://github.com/muze-nl/metro-oidc)
- [Metro-OAuth2](https://github.com/muze-nl/metro-oauth2)
- [Metro-OLDM](https://github.com/muze-nl/metro-oldm)

## Roadmap

See [ROADMAP.md](./ROADMAP.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This software is licensed under the MIT open source license. See [LICENSE](./LICENSE).

[project-stage-badge: Experimental]: https://img.shields.io/badge/Project%20Stage-Experimental-yellow.svg
[project-stage-page]: https://blog.pother.ca/project-stages/
