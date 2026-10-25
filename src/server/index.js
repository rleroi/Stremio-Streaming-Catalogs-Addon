import express from 'express';
import cors from 'cors';
import Mixpanel from 'mixpanel';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import justwatch from '../services/justwatch.js';
import { loadCatalogCache, saveCatalogCache, clearCatalogCache } from '../utils/cache.js';
import { handleConfiguredManifest, handleDefaultManifest } from './routes/manifest.js';
import { handleCatalog } from './routes/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REFRESH_INTERVAL = process.env.REFRESH_INTERVAL || 21600000; // 6 hours in milliseconds
const USE_CACHE = process.env.USE_CACHE !== 'false'; // Default to true
const FORCE_REFRESH = process.env.FORCE_REFRESH === 'true'; // Default to false

// Production error handling
if (process.env.NODE_ENV === 'production') {
  const errorLog = fs.createWriteStream(path.join(__dirname, '../../vue/dist/error.log'));
  process.stderr.write = errorLog.write.bind(errorLog);

  process.on('uncaughtException', function (err) {
    console.error((err && err.stack) ? err.stack : err);
  });
}

const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.static(path.join(__dirname, '../../vue/dist')));

// Initialize Mixpanel
let mixpanel = null;
if (process.env.MIXPANEL_KEY) {
  mixpanel = Mixpanel.init(process.env.MIXPANEL_KEY);
}

// Catalog data storage
let movies = {
  'nfx': [], 'nfk': [], 'dnp': [], 'amp': [], 'atp': [], 'pmp': [], 'hbm': [],
  'hlu': [], 'pcp': [], 'cru': [], 'jhs': [], 'zee': [], 'vil': [], 'clv': [],
  'gop': [], 'mgl': [], 'cts': [], 'sst': [], 'nlz': [], 'stz': [], 'mbi': [],
  'vik': [], 'sgo': [], 'sonyliv': [], 'cpd': [], 'mp9': [], 'shd': [], 'bbo': [],
  'act': [], 'itv': [], 'bbc': [], 'al4': [], 'crc': [], 'iqi': [], 'sha': [], 'hmc': [],
};

let series = {
  'nfx': [], 'nfk': [], 'dnp': [], 'amp': [], 'atp': [], 'pmp': [], 'hbm': [],
  'hlu': [], 'pcp': [], 'cru': [], 'jhs': [], 'zee': [], 'vil': [], 'clv': [],
  'gop': [], 'mgl': [], 'cts': [], 'sst': [], 'nlz': [], 'stz': [], 'vik': [],
  'sgo': [], 'sonyliv': [], 'hay': [], 'cpd': [], 'dpe': [], 'mp9': [], 'shd': [],
  'bbo': [], 'act': [], 'itv': [], 'bbc': [], 'al4': [], 'iqi': [], 'sha': [], 'hmc': [],
};

/**
 * Load catalog data (from cache or fresh fetch)
 */
async function loadNewCatalog() {
  console.log('loadNewCatalog');
  
  // Clear cache if force refresh is enabled
  if (FORCE_REFRESH) {
    clearCatalogCache();
  }
  
  // Try to load from cache first (if caching is enabled)
  if (USE_CACHE) {
    const cachedData = loadCatalogCache(REFRESH_INTERVAL);
    if (cachedData) {
      Object.assign(movies, cachedData.movies);
      Object.assign(series, cachedData.series);
      console.log('Catalog data loaded from cache');
      return;
    }
  }
  
  // If no cache or expired, fetch fresh data
  console.log('Fetching fresh catalog data...');
  movies.nfx = await justwatch.getMetas('MOVIE', ['nfx'], 'GB');
  movies.nfk = await justwatch.getMetas('MOVIE', ['nfk'], 'US');
  movies.dnp = await justwatch.getMetas('MOVIE', ['dnp'], 'GB');
  movies.atp = await justwatch.getMetas('MOVIE', ['atp'], 'GB');
  movies.amp = await justwatch.getMetas('MOVIE', ['amp'], 'US');
  movies.pmp = await justwatch.getMetas('MOVIE', ['pmp'], 'US');
  movies.hbm = await justwatch.getMetas('MOVIE', ['hbm'], 'NL');
  movies.hlu = await justwatch.getMetas('MOVIE', ['hlu'], 'US');
  movies.pcp = await justwatch.getMetas('MOVIE', ['pcp'], 'US');
  movies.cts = await justwatch.getMetas('MOVIE', ['cts'], 'US');
  movies.mgl = await justwatch.getMetas('MOVIE', ['mgl'], 'US');
  movies.cru = await justwatch.getMetas('MOVIE', ['cru'], 'US');
  movies.jhs = await justwatch.getMetas('MOVIE', ['jhs'], 'IN', 'in');
  movies.zee = await justwatch.getMetas('MOVIE', ['zee'], 'IN', 'in');
  movies.vil = await justwatch.getMetas('MOVIE', ['vil'], 'NL', 'nl');
  movies.nlz = await justwatch.getMetas('MOVIE', ['nlz'], 'NL', 'nl');
  movies.sst = await justwatch.getMetas('MOVIE', ['sst'], 'NL', 'nl');
  movies.clv = await justwatch.getMetas('MOVIE', ['clv'], 'BR', 'br');
  movies.gop = await justwatch.getMetas('MOVIE', ['gop'], 'BR', 'br');
  movies.cpd = await justwatch.getMetas('MOVIE', ['cpd'], 'FR', 'fr');
  movies.stz = await justwatch.getMetas('MOVIE', ['stz'], 'US');
  movies.mbi = await justwatch.getMetas('MOVIE', ['mbi'], 'US');
  movies.vik = await justwatch.getMetas('MOVIE', ['vik'], 'US');
  movies.sgo = await justwatch.getMetas('MOVIE', ['sgo'], 'DE', 'de');
  movies.sonyliv = await justwatch.getMetas('MOVIE', ['sonyliv'], 'IN', 'hi');
  movies.mp9 = await justwatch.getMetas('MOVIE', ['mp9'], 'ES', 'es');
  movies.shd = await justwatch.getMetas('MOVIE', ['shd'], 'US');
  movies.bbo = await justwatch.getMetas('MOVIE', ['bbo'], 'US');
  movies.act = await justwatch.getMetas('MOVIE', ['act'], 'US');
  movies.crc = await justwatch.getMetas('MOVIE', ['crc'], 'US');
  movies.iqi = await justwatch.getMetas('MOVIE', ['iqi'], 'US');
  movies.sha = await justwatch.getMetas('MOVIE', ['sha'], 'US');
  movies.hmc = await justwatch.getMetas('MOVIE', ['hmc'], 'US');
  movies.itv = await justwatch.getMetas('MOVIE', ['itv'], 'GB');
  movies.bbc = await justwatch.getMetas('MOVIE', ['bbc'], 'GB');
  movies.al4 = await justwatch.getMetas('MOVIE', ['al4'], 'GB');

  series.nfx = await justwatch.getMetas('SHOW', ['nfx'], 'GB');
  series.nfk = await justwatch.getMetas('SHOW', ['nfk'], 'US');
  series.dnp = await justwatch.getMetas('SHOW', ['dnp'], 'GB');
  series.atp = await justwatch.getMetas('SHOW', ['atp'], 'GB');
  series.hay = await justwatch.getMetas('SHOW', ['hay'], 'GB');
  series.dpe = await justwatch.getMetas('SHOW', ['dpe'], 'GB');
  series.amp = await justwatch.getMetas('SHOW', ['amp'], 'US');
  series.pmp = await justwatch.getMetas('SHOW', ['pmp'], 'US');
  series.hbm = await justwatch.getMetas('SHOW', ['hbm'], 'NL');
  series.hlu = await justwatch.getMetas('SHOW', ['hlu'], 'US');
  series.pcp = await justwatch.getMetas('SHOW', ['pcp'], 'US');
  series.cru = await justwatch.getMetas('SHOW', ['cru'], 'US');
  series.cts = await justwatch.getMetas('SHOW', ['cts'], 'US');
  series.mgl = await justwatch.getMetas('SHOW', ['mgl'], 'US');
  series.jhs = await justwatch.getMetas('SHOW', ['jhs'], 'IN', 'in');
  series.zee = await justwatch.getMetas('SHOW', ['zee'], 'IN', 'in');
  series.vil = await justwatch.getMetas('SHOW', ['vil'], 'NL', 'nl');
  series.nlz = await justwatch.getMetas('SHOW', ['nlz'], 'NL', 'nl');
  series.sst = await justwatch.getMetas('SHOW', ['sst'], 'NL', 'nl');
  series.clv = await justwatch.getMetas('SHOW', ['clv'], 'BR', 'br');
  series.gop = await justwatch.getMetas('SHOW', ['gop'], 'BR', 'br');
  series.cpd = await justwatch.getMetas('SHOW', ['cpd'], 'FR', 'fr');
  series.stz = await justwatch.getMetas('SHOW', ['stz'], 'US');
  series.vik = await justwatch.getMetas('SHOW', ['vik'], 'US');
  series.sgo = await justwatch.getMetas('SHOW', ['sgo'], 'DE', 'de');
  series.sonyliv = await justwatch.getMetas('SHOW', ['sonyliv'], 'IN', 'hi');
  series.mp9 = await justwatch.getMetas('SHOW', ['mp9'], 'ES', 'es');
  series.shd = await justwatch.getMetas('SHOW', ['shd'], 'US');
  series.bbo = await justwatch.getMetas('SHOW', ['bbo'], 'US');
  series.act = await justwatch.getMetas('SHOW', ['act'], 'US');
  series.iqi = await justwatch.getMetas('SHOW', ['iqi'], 'US');
  series.sha = await justwatch.getMetas('SHOW', ['sha'], 'US');
  series.hmc = await justwatch.getMetas('SHOW', ['hmc'], 'US');
  series.itv = await justwatch.getMetas('SHOW', ['itv'], 'GB');
  series.bbc = await justwatch.getMetas('SHOW', ['bbc'], 'GB');
  series.al4 = await justwatch.getMetas('SHOW', ['al4'], 'GB');

  // Save to cache (if caching is enabled)
  if (USE_CACHE) {
    saveCatalogCache(movies, series);
  }
  console.log('done');
}

// Routes
app.get('/:configuration/manifest.json', (req, res) => {
  handleConfiguredManifest(req, res, mixpanel);
});

app.get('/manifest.json', (req, res) => {
  handleDefaultManifest(req, res, mixpanel);
});

app.get('/:configuration?/catalog/:type/:id/:extra?.json', (req, res) => {
  handleCatalog(req, res, movies, series, mixpanel);
});

// Development endpoint to clear cache
if (process.env.NODE_ENV !== 'production') {
  app.get('/clear-cache', function (req, res) {
    clearCatalogCache();
    res.json({ message: 'Cache cleared successfully' });
  });
}

// Fallback to Vue
app.get(/.*/, (req, res) => {
  res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
  res.setHeader('content-type', 'text/html');
  res.sendFile(path.join(__dirname, '../../vue/dist/index.html'));
});

// Initialize catalog loading
loadNewCatalog();
setInterval(loadNewCatalog, REFRESH_INTERVAL);

export default app;

