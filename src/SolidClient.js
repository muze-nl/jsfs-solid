import '@muze-nl/jsfs'
import '@muze-nl/metro'
import '@muze-nl/metro-oidc'
import '@muze-nl/oldm'
import '@muze-nl/jaqt'
import '@muze-nl/assert'
import SolidAdapter from './SolidAdapter.js'

export default async function solidClient(webid, solidOptions) {
    const defaults = {
		prefixes: {
	        'ldp':    'http://www.w3.org/ns/ldp#',
	        'rdf':    'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
	        'dct':    'http://purl.org/dc/terms/',
	        'stat':   'http://www.w3.org/ns/posix/stat#',
	        'turtle': 'http://www.w3.org/ns/iana/media-types/text/turtle#',
	        'schema': 'https://schema.org/',
	        'solid':  'http://www.w3.org/ns/solid/terms#',
	        'acl':    'http://www.w3.org/ns/auth/acl#',
	        'space':  'http://www.w3.org/ns/pim/space#',
	        'vcard':  'http://www.w3.org/2006/vcard/ns#',
	        'foaf':   'http://xmlns.com/foaf/0.1/'
	    },
	    parser: oldm.n3Parser,
	    writer: oldm.n3Writer
    }
    const options = Object.assign({}, defaults, solidOptions)
    for (const prefix in defaults.prefixes) {
    	if (!options.prefixes[prefix]) {
    		options.prefixes[prefix] = defaults.prefixes[prefix]
    	}
    }
	const response = await metro.client(oldmmw(options), metro.mw.getdata()).get(webid)
	const profile = response?.primary
	if (!profile || !profile.solid$oidcIssuer) { //FIXME: don't assume $ as the separator
		throw new Error('solidClient: '+webid+' did not return valid solid profile')
	}
	options.issuer = profile.solid$oidcIssuer
	const storage = oldm.many(profile.space$storage)
		.map(s => new jsfs.fs(new SolidAdapter(s, '/', options)))

	const client = metro.client(metro.oidc.oidcmw(options), oldmmw(options))
	Object.assign(client, {
		profile,
		issuer: profile.solid$oidcIssuer,
		inbox: profile.ldp$inbox,
		id: function() {
			return metro.oidc.idToken(this.issuer)
		},
		logout: async function() {
			throw new Error('not yet implemented')
		},
		...storage
	})
	client.id.bind(client)
	client.logout.bind(client)
	return client
}
