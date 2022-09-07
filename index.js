import express from 'express';
import cors from 'cors';
import Mixpanel from 'mixpanel';
import {fileURLToPath} from 'url';
import path from 'path';
import addon from './addon.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', true)
app.use(cors());
app.use(express.static(path.join(__dirname, 'vue', 'dist')));


let mixpanel = null;
if(process.env.MIXPANEL_KEY) {
    mixpanel = Mixpanel.init(process.env.MIXPANEL_KEY);
}

let movies = {
    'nfx': [],
    'dnp': [],
    'amp': [],
    'atp': [],
    'pmp': [],
    'hbm': [],
    'hlu': [],
    'pct': [],
};
let series = {
    'nfx': [],
    'dnp': [],
    'amp': [],
    'atp': [],
    'pmp': [],
    'hbm': [],
    'hlu': [],
    'pct': [],
};
async function loadNewCatalog() {
    console.log('loadNewCatalog');
    movies.nfx = await addon.getMetas('MOVIE', ['nfx'], 'GB');
    movies.dnp = await addon.getMetas('MOVIE', ['dnp'], 'GB');
    movies.atp = await addon.getMetas('MOVIE', ['atp'], 'GB');
    movies.amp = await addon.getMetas('MOVIE', ['amp'], 'US');
    movies.pmp = await addon.getMetas('MOVIE', ['pmp'], 'US');
    movies.hbm = await addon.getMetas('MOVIE', ['hbm'], 'US');
    movies.hlu = await addon.getMetas('MOVIE', ['hlu'], 'US');
    movies.pct = await addon.getMetas('MOVIE', ['pct'], 'US');

    series.nfx = await addon.getMetas('SHOW', ['nfx'], 'GB');
    series.dnp = await addon.getMetas('SHOW', ['dnp'], 'GB');
    series.atp = await addon.getMetas('SHOW', ['atp'], 'GB');
    series.amp = await addon.getMetas('SHOW', ['amp'], 'US');
    series.pmp = await addon.getMetas('SHOW', ['pmp'], 'US');
    series.hbm = await addon.getMetas('SHOW', ['hbm'], 'US');
    series.hlu = await addon.getMetas('SHOW', ['hlu'], 'US');
    series.pct = await addon.getMetas('SHOW', ['pct'], 'US');
    console.log('done');
}


app.get('/:configuration/manifest.json', (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
    res.setHeader('content-type', 'application/json');

    let buffer = Buffer(req.params.configuration, 'base64');

    mixpanel && mixpanel.track('install', {
        ip: req.ip,
        distinct_id: req.ip.replace(/\.|:/g, 'Z'),
        configuration: req.params.configuration,
    });

    // parse providers
    let selectedProviders = buffer.toString('ascii');
    selectedProviders = selectedProviders.split(':')[0].split(',');
    let catalogs = [];
    if (selectedProviders.includes('nfx')) {
        catalogs.push({
            id: 'nfx',
            type: 'movie',
            name: 'Netflix',
        });
        catalogs.push({
            id: 'nfx',
            type: 'series',
            name: 'Netflix',
        });
    }
    if (selectedProviders.includes('hbm')) {
        catalogs.push({
            id: 'hbm',
            type: 'movie',
            name: 'HBO Max',
        });
        catalogs.push({
            id: 'hbm',
            type: 'series',
            name: 'HBO Max',
        });
    }
    if (selectedProviders.includes('dnp')) {
        catalogs.push({
            id: 'dnp',
            type: 'movie',
            name: 'Disney+',
        });
        catalogs.push({
            id: 'dnp',
            type: 'series',
            name: 'Disney+',
        });
    }
    if (selectedProviders.includes('hlu')) {
        catalogs.push({
            id: 'hlu',
            type: 'movie',
            name: 'Hulu',
        });
        catalogs.push({
            id: 'hlu',
            type: 'series',
            name: 'Hulu',
        });
    }
    if (selectedProviders.includes('amp')) {
        catalogs.push({
            id: 'amp',
            type: 'movie',
            name: 'Prime Video',
        });
        catalogs.push({
            id: 'amp',
            type: 'series',
            name: 'Prime Video',
        });
    }
    if (selectedProviders.includes('pmp')) {
        catalogs.push({
            id: 'pmp',
            type: 'movie',
            name: 'Paramount+',
        });
        catalogs.push({
            id: 'pmp',
            type: 'series',
            name: 'Paramount+',
        });
    }
    if (selectedProviders.includes('atp')) {
        catalogs.push({
            id: 'atp',
            type: 'movie',
            name: 'Apple TV+',
        });
        catalogs.push({
            id: 'atp',
            type: 'series',
            name: 'Apple TV+',
        });
    }
    if (selectedProviders.includes('pct')) {
        catalogs.push({
            id: 'pct',
            type: 'movie',
            name: 'Peacock',
        });
        catalogs.push({
            id: 'pct',
            type: 'series',
            name: 'Peacock',
        });
    }


    // show catalogs for providers
    res.send({
        id: 'pw.ers.netflix-catalog',
        logo: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI',
        version: process.env.npm_package_version,
        name: 'Streaming Catalogs',
        description: 'Your favourite streaming services!',
        catalogs: catalogs,
        resources: ['catalog'],
        types: ['movie', 'series'],
        idPrefixes: ['tt'],
        behaviorHints: {
            configurable: true,
        }
    });
})

app.get('/:configuration?/:resource/:type/:id/:extra?.json', (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
    res.setHeader('content-type', 'application/json');

    mixpanel && mixpanel.track(req.params.resource, {
        ip: req.ip,
        distinct_id: req.ip.replace(/\.|:/g, 'Z'),
        configuration: req.params?.configuration,
        catalog_type: req.params.type,
        catalog_id: req.params.id,
        catalog_extra: req.params?.extra,
    });

    let id = req.params.id;
    if (id === 'top') {
        id = 'nfx';
    }

    mixpanel && mixpanel.track('catalog', {
        ip: req.ip,
        distinct_id: req.ip.replace(/\.|:/g, 'Z'),
        catalog_type: req.params.type,
        catalog_id: req.params.id,
        catalog_extra: req.params?.extra,
    });

    if (req.params.type === 'movie') {
        res.send({ metas: movies[id] });

        return;
    }

    if (req.params.type === 'series') {
        res.send({ metas: series[id] });

        return;
    }
})

app.get('/manifest.json', function(req, res) {
    res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
    res.setHeader('content-type', 'application/json');

    mixpanel && mixpanel.track('install', {
        ip: req.ip,
        distinct_id: req.ip.replace(/\.|:/g, 'Z'),
    });

    res.send({
        id: 'pw.ers.netflix-catalog',
        logo: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI',
        version: process.env.npm_package_version,
        name: 'Streaming Catalogs',
        description: 'Trending movies and series on Netflix, HBO Max, Disney+, Hulu and more. Configure to choose your favourite services.',
        catalogs: [
            {
                id: 'nfx',
                type: 'movie',
                name: 'Netflix',
            }, {
                id: 'nfx',
                type: 'series',
                name: 'Netflix',
            }, {
                id: 'hbm',
                type: 'movie',
                name: 'HBO Max',
            }, {
                id: 'hbm',
                type: 'series',
                name: 'HBO Max',
            }, {
                id: 'dnp',
                type: 'movie',
                name: 'Disney+',
            }, {
                id: 'dnp',
                type: 'series',
                name: 'Disney+',
            }, {
                id: 'hlu',
                type: 'movie',
                name: 'Hulu',
            }, {
                id: 'hlu',
                type: 'series',
                name: 'Hulu',
            }, {
                id: 'amp',
                type: 'movie',
                name: 'Prime  Video',
            }, {
                id: 'amp',
                type: 'series',
                name: 'Prime Video',
            }, {
                id: 'pmp',
                type: 'movie',
                name: 'Paramount+',
            }, {
                id: 'pmp',
                type: 'series',
                name: 'Paramount+',
            }, {
                id: 'atp',
                type: 'movie',
                name: 'Apple TV+',
            }, {
                id: 'atp',
                type: 'series',
                name: 'Apple TV+',
            }, {
                id: 'pct',
                type: 'movie',
                name: 'Peacock',
            }, {
                id: 'pct',
                type: 'series',
                name: 'Peacock',
            },
        ],
        resources: ['catalog'],
        types: ['movie', 'series'],
        idPrefixes: ['tt'],
        behaviorHints: {
            configurable: true,
        }
    });
})


// app.get('/catalog/:type/:id/:extra?.json', function(req, res) {
//      res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
//      res.setHeader('content-type', 'application/json');

//     let id = req.params.id;
//     if (id === 'top') {
//         id = 'nfx';
//     }

//     mixpanel && mixpanel.track('catalog', {
//         ip: req.ip,
//         distinct_id: req.ip.replace(/\.|:/g, 'Z'),
//         catalog_type: req.params.type,
//         catalog_id: req.params.id,
//         catalog_extra: req.params?.extra,
//     });

//     if (req.params.type === 'movie') {
//         res.send({ metas: movies[id] });

//         return;
//     }

//     if (req.params.type === 'series') {
//         res.send({ metas: series[id] });

//         return;
//     }
// })


// fallback to Vue
app.get(/.*/, (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.join(__dirname, 'vue', 'dist', 'index.html'));
});


loadNewCatalog();
setInterval(loadNewCatalog, process.env.REFRESH_INTERVAL | 21600000);

app.listen(process.env.PORT || 9000, () => {
    //console.log('http://127.0.0.1:9000/manifest.json');
});
