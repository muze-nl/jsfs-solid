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

    constructor(metroClient, path='/', solidConfiguration={})
    {
        metroClient = client(metroClient)
            .with( oidc.oidcmw(solidConfiguration))
            .with( oldmmw(solidConfiguration))
        path = new Path(path);
        super(metroClient, path)
    }

    get name()
    {
        return 'SolidAdapter';
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