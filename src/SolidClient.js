import '@muze-nl/jsfs'
import '@muze-nl/metro'
import '@muze-nl/metro-oidc'
import '@muze-nl/oldm'
import '@muze-nl/jaqt'
import '@muze-nl/assert'
import SolidAdapter from './SolidAdapter.js'

export default async function solidClient(webid, options) {
	const response = await metro.client(oldmmw(options), metro.mw.getdata()).get(webid)
	const profile = response?.primary
	if (!profile || !profile.solid$oidcIssuer) { //FIXME: don't assume $ as the separator
		throw new Error('solidClient: '+webid+' did not return valid solid profile')
	}
	if (!options.issuer) { // in case you access someone elses profile and pods with your own webid/issuer
		options.issuer = oldm.one(profile.solid$oidcIssuer)?.id
	}
	const storage = oldm.many(profile.space$storage)
		.map(s => new jsfs.fs(new SolidAdapter(s.id, '/', options)))

	return metro.api(
		metro.client(metro.oidc.oidcmw(options), oldmmw(options)),
		{
			profile,
			issuer: oldm.one(profile.solid$oidcIssuer)?.id,
			inbox: oldm.one(profile.ldp$inbox)?.id,
			id: function() {
				return metro.oidc.idToken(this.issuer)
			},
			logout: async function() {
				throw new Error('not yet implemented')
			},
			storage
		}
	)
}
