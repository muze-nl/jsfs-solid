import Path from '@muze-nl/jsfs/src/Path.mjs';
import HttpAdapter from '@muze-nl/jsfs/src/Adapters/Http.mjs'
import {client, url} from '@muze-nl/metro/src/metro.mjs'
import getdatamw from '@muze-nl/metro/src/mw/getdata.mjs'
import oidc from '@muze-nl/metro-oidc'
import oldmmw from '@muze-nl/metro-oldm'
import oldm from '@muze-nl/oldm' 
import { _, from } from '@muze-nl/jaqt/src/jaqt.mjs'

export default class SolidAdapter extends HttpAdapter
{
    #client
    #path

    constructor(metroClient, path='/', solidConfiguration={})
    {
        this.#client = client(metroClient)
            .with( oidc.oidcmw(solidConfiguration))
            .with( oldmmw(solidConfiguration))
        this.#path = new Path(path);
        super(this.#client, this.#path)
    }

    get name()
    {
        return 'SolidAdapter';
    }

    async read(path)
    {
        let response = await this.#client.get(path);
        let result = {
            type: this.getMimetype(response),
            name: Path.filename(path),
            http: {
                headers: response.headers,
                status: response.status,
                url: response.url
            }
        }
        if (response.data) {
            result.data = response.data
        }
        if (result.type.match(/text\/.*/)) {
            result.contents = await response.text()
        } else if (result.type.match(/application\/json.*/)) {
            result.contents = await response.json()
        } else {
            result.contents = await response.blob()
        }
        return result
    }

    async list(path)
    {
        let result = await this.read(path)
        if (result.data) {
            from(result.data)
            .where({
                a: 'ldp$Resource'
            })
            .select({
                filename: o => jsfs.path.filename(metro.url(o.id).pathname),
                path: o => metro.url(o.id).pathname,
                type: o => o.a.includes('ldp$Container') ? 'folder' : 'file'
            })
        } else {
            throw new Error(path+' could not be parsed', {cause: result})            
        }
    }

}