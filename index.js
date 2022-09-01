import sdk from 'stremio-addon-sdk';
const { addonBuilder, serveHTTP } = sdk;
import addon from './addon.js'


let movies = [];
let series = [];
async function loadNewCatalog() {
    console.log('loadNewCatalog');
    movies = await addon.getMetas('movie');
    series = await addon.getMetas('series');
}
loadNewCatalog();
setInterval(loadNewCatalog, process.env.REFRESH_INTERVAL | 21600000);

const builder = new addonBuilder({
    id: 'pw.ers.netflix-catalog',
    logo: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI',
    version: '1.0.0',
    name: 'Netflix Catalog',
    description: 'Catalog with the latest movies and series on Netflix, updated every day.',
    catalogs: [
        {
            id: 'top',
            type: 'movie',
            name: 'Netflix Movies',
        }, {
            id: 'top',
            type: 'series',
            name: 'Netflix Series',
        }
    ],
    resources: ['catalog'],
    types: ['movie', 'series'],
    idPrefixes: ['tt']
})

builder.defineCatalogHandler(function(args) {
    if (args.type === 'movie') {
        return Promise.resolve({ metas: movies })
    }

    if (args.type === 'series') {
        return Promise.resolve({ metas: series })
    }
})

serveHTTP(builder.getInterface(), { port: process.env.PORT || 9000 })