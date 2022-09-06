import express from 'express';
import cors from 'cors';
import Mixpanel from 'mixpanel';
import addon from './addon.js'

const app = express();
app.use(cors());

let mixpanel = null;
if(process.env.MIXPANEL_KEY) {
    mixpanel = Mixpanel.init(process.env.MIXPANEL_KEY);
}

let movies = [];
let series = [];
async function loadNewCatalog() {
    console.log('loadNewCatalog');
    movies = await addon.getMetas('movie');
    series = await addon.getMetas('series');
}
loadNewCatalog();
setInterval(loadNewCatalog, process.env.REFRESH_INTERVAL | 21600000);



// app.get('/:configuration?/configure', (req, res) => {
// })
// app.get('/:configuration/manifest.json', (req, res) => {
// })
// app.get('/:configuration/:resource/:type/:id/?:extra?.json', (req, res) => {
// })

app.get('/manifest.json', function(req, res) {
    mixpanel && mixpanel.track('install', {
        ip: req.socket.remoteAddress,
        distinct_id: req.socket.remoteAddress.replace(/\.|:/g, 'Z'),
    });

    res.send({
        id: 'pw.ers.netflix-catalog',
        logo: 'https://play-lh.googleusercontent.com/TBRwjS_qfJCSj1m7zZB93FnpJM5fSpMA_wUlFDLxWAb45T9RmwBvQd5cWR5viJJOhkI',
        version: '1.0.1',
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
        idPrefixes: ['tt'],
    });
})

app.get('/catalog/:type/:id/?:extra?.json', function(req, res) {
    mixpanel && mixpanel.track('catalog', {
        ip: req.socket.remoteAddress,
        distinct_id: req.socket.remoteAddress.replace(/\.|:/g, 'Z'),
        catalog_type: req.params.type,
        catalog_id: req.params.id,
        catalog_extra: req.params?.extra,
    });

    if (req.params.type === 'movie') {
        res.send({ metas: movies });

        return;
    }

    if (req.params.type === 'series') {
        res.send({ metas: series });

        return;
    }
})


app.listen(process.env.PORT || 9000, () => {
    console.log('http://127.0.0.1:9000/manifest.json');
});
