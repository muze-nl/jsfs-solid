import '@muze-nl/jsfs'
import '@muze-nl/metro'
import '@muze-nl/metro-oidc'
import '@muze-nl/oldm'
import '@muze-nl/jaqt'
import '@muze-nl/assert'
import SolidAdapter from './SolidAdapter.js'
import solidClient from './SolidClient.js'

export default {
	adapter: SolidAdapter,
	client: solidClient
}

globalThis.solidClient = solidClient
globalThis.SolidAdapter = SolidAdapter