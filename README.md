[![GitHub License](https://img.shields.io/github/license/muze-nl/jsfs-solid)](https://github.com/muze-nl/jsfs-solid/blob/main/LICENSE)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/muze-nl/jsfs-solid)]()
[![NPM Version](https://img.shields.io/npm/v/@muze-nl/jsfs-solid)](https://www.npmjs.com/package/@muze-nl/jsfs-solid)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@muze-nl/jsfs-solid)](https://www.npmjs.com/package/@muze-nl/jsfs-solid)
[![Project stage: Experimental][project-stage-badge: Experimental]][project-stage-page]

# JSFS-Solid: a jsfs solid client

```javascript
import '@muze-nl/jsfs-solid'

async function main() {
	const client = await solidClient(
		"https://auke.solidcommunity.net/profile/card#me",
	    {
	        client_info: {
	  		     client_name: 'My Client'
	  	    }
	    }
	)
    const dir = await client.storage[0].list()
    console.log(dir)
}

main()
```

## Table of Contents
1. [Introduction](#introduction)
2. [Usage](#usage)
3. [Dependencies](#dependencies)
4. [Contributing](CONTRIBUTING.md)
5. [License](#license)

<a name="introduction"></a>
## Introduction

JSFS-Solid is both a client to access Solid PODs (storage) and an Adapter for the [JSFS](https://github.com/muze-nl/jsfs/) API.

<a name="usage"></a>
## Usage

```bash
npm install @muze-nl/jsfs-solid
```

In the browser, using a cdn:

```html
<script src="https://cdn.jsdelivr.net/npm/@muze-nl/jsfs-solid/dist/browser.js"></script>
```

Using ES6 modules, in the browser (using a bundler) or Node (or Deno, or...):
```javascript
import '@muze-nl/jsfs-solid'
```

Create a new client like this:
```javascript
const client = await solidClient(
	'https://auke.solidcommunity.net/profile/card#me', // a solid webid
	{
		client_info: {
			client_name: "My Client"
		}
	}
)
```

This will read the webid profile and return an API that includes:
- profile: an object containing the profile information, parsed with [OLDM](https://github.com/muze-nl/oldm)
- storage: an array with all the storage entries from the webid profile, as a filesystem API (using [JSFS](https://github.com/muze-nl/jsfs))
- id(): returns the id token, but only if the client has been forced to authenticate/authorize to access a resource. 
- issuer: the first issuer defined in the webid profile, or null
- inbox: the first inbox defined in the webid profile, or null

In addition, the client is an HTTP client (Using [Metro](https://github.com/muze-nl/metro) with the following methods: 
- `get`
- `post`
- `put`
- `delete`
- `patch`
Each of these will automatically trigger an OIDC (OpenID Connect) Solid authorization step, if the requested resource requires it.

Each storage entry implements a simple filesystem API with the following methods:
- `cd`
- `read`
- `write`
- `delete`
- `exists`
- `list`

The `list` method returns an array of objects with these properties:
```javascript
{
	filename,
	path,
	name
}
```

The `read` method returns these properties, where `data` is a dataset using [OLDM](https://github.com/muze-nl/oldm). 
```javascript
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

Similarly, you can write files like this:
```javascript
await client.write(data, 'movies.ttl', 'text/turtle')
```
Just make sure that the data is OLDM data.

<a name="dependencies"></a>
## Dependencies
- [JSFS](https://github.com/muze-nl/jsfs)
- [OLDM](https://github.com/muze-nl/oldm)
- [JAQT](https://github.com/muze-nl/jaqt)
- [MetroJS](https://github.com/muze-nl/metro)
- [Metro-OIDC](https://github.com/muze-nl/metro-oidc)
- [Metro-Oauth2](https://github.com/muze-nl/metro-oauth2)
- [Metro-OLDM](https://github.com/muze-nl/metro-oldm)
- [Assert](https://github.com/muze-nl/assert)
- [N3.js](https://github.com/rdfjs/N3.js/)

<a name="license"></a>
## License

This software is licensed under MIT open source license. See the [License](./LICENSE) file.

[project-stage-badge: Experimental]: https://img.shields.io/badge/Project%20Stage-Experimental-yellow.svg
[project-stage-page]: https://blog.pother.ca/project-stages/