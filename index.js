import express from 'express';
import cors from 'cors';
import Mixpanel from 'mixpanel';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import addon from './addon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    const errorLog = fs.createWriteStream(path.join(__dirname, 'vue', 'dist', 'error.log'));
    process.stderr.write = errorLog.write.bind(errorLog);

    process.on('uncaughtException', function (err) {
        console.error((err && err.stack) ? err.stack : err);
    });
}

const app = express();
app.set('trust proxy', true)
app.use(cors());
app.use(express.static(path.join(__dirname, 'vue', 'dist')));


let mixpanel = null;
if (process.env.MIXPANEL_KEY) {
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
    'pcp': [],
    'fmn': [],
    //'cru': [],
    'hst': [],
    'zee': [],
    'vil': [],
    'blv': [],
    'clv': [],
    'gop': [],
    'mgl': [],
    'cts': [],
    'sst': [],
    'nlz': [],
    //'hay': [],
    'cpd': [],
    //'dpe': [],
};
let series = {
    'nfx': [],
    'dnp': [],
    'amp': [],
    'atp': [],
    'pmp': [],
    'hbm': [],
    'hlu': [],
    'pcp': [],
    'fmn': [],
    'cru': [],
    'hst': [],
    'zee': [],
    'vil': [],
    'blv': [],
    'clv': [],
    'gop': [],
    'mgl': [],
    'cts': [],
    'sst': [],
    'nlz': [],
    'hay': [],
    'cpd': [],
    'dpe': [],
};
async function loadNewCatalog() {
    console.log('loadNewCatalog');
    movies.nfx = await addon.getMetas('MOVIE', ['nfx'], 'GB');
    movies.dnp = await addon.getMetas('MOVIE', ['dnp'], 'GB');
    movies.atp = await addon.getMetas('MOVIE', ['atp'], 'GB');
    //movies.dpe = await addon.getMetas('MOVIE', ['dpe'], 'GB'); // 1 result
    //movies.hay = await addon.getMetas('MOVIE', ['hay'], 'GB'); // 0 results
    movies.amp = await addon.getMetas('MOVIE', ['amp'], 'US');
    movies.pmp = await addon.getMetas('MOVIE', ['pmp'], 'US');
    movies.hbm = await addon.getMetas('MOVIE', ['hbm'], 'NL');
    movies.hlu = await addon.getMetas('MOVIE', ['hlu'], 'US');
    movies.pcp = await addon.getMetas('MOVIE', ['pcp'], 'US');
    movies.fmn = await addon.getMetas('MOVIE', ['fmn'], 'US');
    movies.cts = await addon.getMetas('MOVIE', ['cts'], 'US');
    movies.mgl = await addon.getMetas('MOVIE', ['mgl'], 'US');
    //movies.cru = await addon.getMetas('MOVIE', ['cru'], 'US'); // only 1 result
    movies.hst = await addon.getMetas('MOVIE', ['hst'], 'IN', 'in');
    movies.zee = await addon.getMetas('MOVIE', ['zee'], 'IN', 'in');
    movies.vil = await addon.getMetas('MOVIE', ['vil'], 'NL', 'nl');
    movies.nlz = await addon.getMetas('MOVIE', ['nlz'], 'NL', 'nl');
    movies.sst = await addon.getMetas('MOVIE', ['sst'], 'NL', 'nl');
    movies.blv = await addon.getMetas('MOVIE', ['blv'], 'TR', 'tr');
    movies.clv = await addon.getMetas('MOVIE', ['clv'], 'BR', 'br');
    movies.gop = await addon.getMetas('MOVIE', ['gop'], 'BR', 'br');
    movies.cpd = await addon.getMetas('MOVIE', ['cpd'], 'FR', 'fr');

    series.nfx = await addon.getMetas('SHOW', ['nfx'], 'GB');
    series.dnp = await addon.getMetas('SHOW', ['dnp'], 'GB');
    series.atp = await addon.getMetas('SHOW', ['atp'], 'GB');
    series.hay = await addon.getMetas('SHOW', ['hay'], 'GB');
    series.dpe = await addon.getMetas('SHOW', ['dpe'], 'GB');
    series.amp = await addon.getMetas('SHOW', ['amp'], 'US');
    series.pmp = await addon.getMetas('SHOW', ['pmp'], 'US');
    series.hbm = await addon.getMetas('SHOW', ['hbm'], 'NL');
    series.hlu = await addon.getMetas('SHOW', ['hlu'], 'US');
    series.pcp = await addon.getMetas('SHOW', ['pcp'], 'US');
    series.fmn = await addon.getMetas('SHOW', ['fmn'], 'US');
    series.cru = await addon.getMetas('SHOW', ['cru'], 'US');
    series.cts = await addon.getMetas('SHOW', ['cts'], 'US');
    series.mgl = await addon.getMetas('SHOW', ['mgl'], 'US');
    series.hst = await addon.getMetas('SHOW', ['hst'], 'IN', 'in');
    series.zee = await addon.getMetas('SHOW', ['zee'], 'IN', 'in');
    series.vil = await addon.getMetas('SHOW', ['vil'], 'NL', 'nl');
    series.nlz = await addon.getMetas('SHOW', ['nlz'], 'NL', 'nl');
    series.sst = await addon.getMetas('SHOW', ['sst'], 'NL', 'nl');
    series.blv = await addon.getMetas('SHOW', ['blv'], 'TR', 'tr');
    series.clv = await addon.getMetas('SHOW', ['clv'], 'BR', 'br');
    series.gop = await addon.getMetas('SHOW', ['gop'], 'BR', 'br');
    series.cpd = await addon.getMetas('SHOW', ['cpd'], 'FR', 'fr');
    console.log('done');
}


app.get('/:configuration/manifest.json', (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
    res.setHeader('content-type', 'application/json');

    // parse config
    const buffer = Buffer(req.params?.configuration || '', 'base64');
    const [selectedProviders, rpdbKey, countryCode, installedAt] = buffer.toString('ascii')?.split(':');

    mixpanel && mixpanel.track('install', {
        ip: req.ip,
        distinct_id: req.ip.replace(/\.|:/g, 'Z'),
        configuration: req.params.configuration,
        selectedProviders,
        rpdbKey,
        countryCode,
        installedAt,
    });

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
    if (selectedProviders.includes('pct') || selectedProviders.includes('pcp')) {
        catalogs.push({
            id: 'pcp',
            type: 'movie',
            name: 'Peacock',
        });
        catalogs.push({
            id: 'pcp',
            type: 'series',
            name: 'Peacock',
        });
    }
    if (selectedProviders.includes('fmn')) {
        catalogs.push({
            id: 'fmn',
            type: 'movie',
            name: 'Funimation',
        });
        catalogs.push({
            id: 'fmn',
            type: 'series',
            name: 'Funimation',
        });
    }
    if (selectedProviders.includes('cru')) {
        catalogs.push({
            id: 'cru',
            type: 'series',
            name: 'Crunchyroll',
        });
    }
    if (selectedProviders.includes('hst')) {
        catalogs.push({
            id: 'hst',
            type: 'movie',
            name: 'Hotstar',
        });
        catalogs.push({
            id: 'hst',
            type: 'series',
            name: 'Hotstar',
        });
    }
    if (selectedProviders.includes('zee')) {
        catalogs.push({
            id: 'zee',
            type: 'movie',
            name: 'Zee5',
        });
        catalogs.push({
            id: 'zee',
            type: 'series',
            name: 'Zee5',
        });
    }
    if (selectedProviders.includes('vil')) {
        catalogs.push({
            id: 'vil',
            type: 'movie',
            name: 'Videoland',
        });
        catalogs.push({
            id: 'vil',
            type: 'series',
            name: 'Videoland',
        });
    }
    if (selectedProviders.includes('blv')) {
        catalogs.push({
            id: 'blv',
            type: 'movie',
            name: 'BluTV',
        });
        catalogs.push({
            id: 'blv',
            type: 'series',
            name: 'BluTV',
        });
    }
    if (selectedProviders.includes('clv')) {
        catalogs.push({
            id: 'clv',
            type: 'movie',
            name: 'Clarovideo',
        });
        catalogs.push({
            id: 'clv',
            type: 'series',
            name: 'Clarovideo',
        });
    }
    if (selectedProviders.includes('gop')) {
        catalogs.push({
            id: 'gop',
            type: 'movie',
            name: 'Globoplay',
        });
        catalogs.push({
            id: 'gop',
            type: 'series',
            name: 'Globoplay',
        });
    }
    if (selectedProviders.includes('hay')) {
        catalogs.push({
            id: 'hay',
            type: 'series',
            name: 'Hayu',
        });
    }
    if (selectedProviders.includes('nlz')) {
        catalogs.push({
            id: 'nlz',
            type: 'movie',
            name: 'NLZIET',
        });
        catalogs.push({
            id: 'nlz',
            type: 'series',
            name: 'NLZIET',
        });
    }
    if (selectedProviders.includes('sst')) {
        catalogs.push({
            id: 'sst',
            type: 'movie',
            name: 'SkyShowtime',
        });
        catalogs.push({
            id: 'sst',
            type: 'series',
            name: 'SkyShowtime',
        });
    }
    if (selectedProviders.includes('mgl')) {
        catalogs.push({
            id: 'mgl',
            type: 'movie',
            name: 'MagellanTV',
        });
        catalogs.push({
            id: 'mgl',
            type: 'series',
            name: 'MagellanTV',
        });
    }
    if (selectedProviders.includes('cts')) {
        catalogs.push({
            id: 'cts',
            type: 'movie',
            name: 'Curiosity Stream',
        });
        catalogs.push({
            id: 'cts',
            type: 'series',
            name: 'Curiosity Stream',
        });
    }
    if (selectedProviders.includes('cpd')) {
        catalogs.push({
            id: 'cpd',
            type: 'movie',
            name: 'Canal+',
        });
        catalogs.push({
            id: 'cpd',
            type: 'series',
            name: 'Canal+',
        });
    }
    if (selectedProviders.includes('dpe')) {
        /*catalogs.push({
            id: 'dpe',
            type: 'movie',
            name: 'Discovery+',
        });*/
        catalogs.push({
            id: 'dpe',
            type: 'series',
            name: 'Discovery+',
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

app.get('/:configuration?/catalog/:type/:id/:extra?.json', (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
    res.setHeader('content-type', 'application/json');

    // parse config
    const buffer = Buffer(req.params?.configuration || '', 'base64');
    let [selectedProviders, rpdbKey, countryCode, installedAt] = buffer.toString('ascii')?.split(':');

    //console.log(selectedProviders, rpdbKey, countryCode, installedAt);

    if (String(rpdbKey || '').startsWith('16')) {
        installedAt = rpdbKey;
        rpdbKey = null;
    }

    mixpanel && mixpanel.track('catalog', {
        ip: req.ip,
        distinct_id: req.ip.replace(/\.|:/g, 'Z'),
        configuration: req.params?.configuration,
        selectedProviders,
        rpdbKey,
        countryCode,
        installedAt,
        catalog_type: req.params.type,
        catalog_id: req.params.id,
        catalog_extra: req.params?.extra,
    });

    let id = req.params.id;
    // legacy addon, netflix-only catalog support
    if (id === 'top') {
        id = 'nfx';
    }
    // mistakenly added peacock free instead of premium. remove pct when/if everyone is using pcp
    if (id === 'pct') {
        id = 'pcp';
    }

    if (req.params.type === 'movie') {
        res.send({ metas: addon.replaceRpdbPosters(rpdbKey, movies[id]) });

        return;
    }

    if (req.params.type === 'series') {
        res.send({ metas: addon.replaceRpdbPosters(rpdbKey, series[id]) });

        return;
    }
})

app.get('/manifest.json', function (req, res) {
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
        description: 'Trending movies and series on Netflix, HBO Max, Disney+, Apple TV+ and more. Configure to choose your favourite services.',
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
                id: 'amp',
                type: 'movie',
                name: 'Prime  Video',
            }, {
                id: 'amp',
                type: 'series',
                name: 'Prime Video',
            }, {
                id: 'atp',
                type: 'movie',
                name: 'Apple TV+',
            }, {
                id: 'atp',
                type: 'series',
                name: 'Apple TV+',
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

// fallback to Vue
app.get(/.*/, (req, res) => {
    res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.join(__dirname, 'vue', 'dist', 'index.html'));
});

loadNewCatalog();
setInterval(loadNewCatalog, process.env.REFRESH_INTERVAL || 21600000);

app.listen(process.env.PORT || 9000, () => {
    console.log('http://127.0.0.1:9000/manifest.json');
});
