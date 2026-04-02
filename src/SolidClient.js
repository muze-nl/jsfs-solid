import '@muze-nl/jsfs'
import '@muze-nl/metro'
import '@muze-nl/metro-oidc'
import '@muze-nl/oldm'
import '@muze-nl/jaqt'
import '@muze-nl/assert'
import SolidAdapter from './SolidAdapter.js'

export function solidClient(...options) {
	return new jsfs.fs(new SolidAdapter(...options))
}

export default SolidAdapter

globalThis.solidClient = solidClient
globalThis.SolidAdapter = SolidAdapter