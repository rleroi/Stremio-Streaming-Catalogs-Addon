/**
 * Manifest route handlers
 */

/**
 * Build catalog list from selected providers
 */
function buildProviderCatalogs(selectedProviders) {
  const catalogs = [];
  
  const providerMap = {
    'nfx': { name: 'Netflix', types: ['movie', 'series'] },
    'nfk': { name: 'Netflix Kids', types: ['movie', 'series'] },
    'hbm': { name: 'HBO Max', types: ['movie', 'series'] },
    'dnp': { name: 'Disney+', types: ['movie', 'series'] },
    'hlu': { name: 'Hulu', types: ['movie', 'series'] },
    'amp': { name: 'Prime Video', types: ['movie', 'series'] },
    'pmp': { name: 'Paramount+', types: ['movie', 'series'] },
    'atp': { name: 'Apple TV+', types: ['movie', 'series'] },
    'pcp': { name: 'Peacock', types: ['movie', 'series'] },
    'pct': { name: 'Peacock', types: ['movie', 'series'] }, // Legacy alias
    'cru': { name: 'Crunchyroll', types: ['movie', 'series'] },
    'fmn': { name: 'Crunchyroll', types: ['movie', 'series'] }, // Legacy alias
    'jhs': { name: 'JioHotstar', types: ['movie', 'series'] },
    'hst': { name: 'JioHotstar', types: ['movie', 'series'] }, // Legacy alias
    'zee': { name: 'Zee5', types: ['movie', 'series'] },
    'vil': { name: 'Videoland', types: ['movie', 'series'] },
    'clv': { name: 'Clarovideo', types: ['movie', 'series'] },
    'gop': { name: 'Globoplay', types: ['movie', 'series'] },
    'hay': { name: 'Hayu', types: ['series'] },
    'nlz': { name: 'NLZIET', types: ['movie', 'series'] },
    'sst': { name: 'SkyShowtime', types: ['movie', 'series'] },
    'mgl': { name: 'MagellanTV', types: ['movie', 'series'] },
    'cts': { name: 'Curiosity Stream', types: ['movie', 'series'] },
    'cpd': { name: 'Canal+', types: ['movie', 'series'] },
    'stz': { name: 'Starz', types: ['movie', 'series'] },
    'dpe': { name: 'Discovery+', types: ['series'] },
    'mbi': { name: 'Mubi', types: ['movie'] },
    'vik': { name: 'Rakuten Viki', types: ['movie', 'series'] },
    'sgo': { name: 'Sky Go', types: ['movie', 'series'] },
    'sonyliv': { name: 'Sony Liv', types: ['movie', 'series'] },
    'mp9': { name: 'Movistar+', types: ['movie', 'series'] },
    'shd': { name: 'Shudder', types: ['movie', 'series'] },
    'bbo': { name: 'BritBox', types: ['movie', 'series'] },
    'act': { name: 'Acorn TV', types: ['movie', 'series'] },
    'hmc': { name: 'Hallmark+', types: ['movie', 'series'] },
    'itv': { name: 'ITVX', types: ['movie', 'series'] },
    'bbc': { name: 'BBC iPlayer', types: ['movie', 'series'] },
    'al4': { name: 'Channel 4', types: ['movie', 'series'] },
    'crc': { name: 'Criterion Channel', types: ['movie'] },
    'iqi': { name: 'iQIYI', types: ['movie', 'series'] },
    'sha': { name: 'Shahid VIP', types: ['movie', 'series'] },
  };

  const seen = new Set();
  
  for (const provider of selectedProviders.split(',')) {
    const providerInfo = providerMap[provider];
    if (providerInfo && !seen.has(provider)) {
      seen.add(provider);
      for (const type of providerInfo.types) {
        catalogs.push({
          id: provider === 'pct' ? 'pcp' : provider === 'hst' ? 'jhs' : provider === 'fmn' ? 'cru' : provider,
          type,
          name: providerInfo.name,
        });
      }
    }
  }

  return catalogs;
}

/**
 * Build Netflix Top 10 catalogs
 */
function buildNetflixTop10Catalogs(netflixTop10Global, netflixTop10Country, netflixTop10CountryCode) {
  const catalogs = [];
  
  // Default to true for global, false for country (backward compatibility)
  const enableNetflixTop10Global = netflixTop10Global === undefined || netflixTop10Global === '1';
  const enableNetflixTop10Country = netflixTop10Country === '1';
  const top10CountryCode = netflixTop10CountryCode || null;
  
  if (enableNetflixTop10Global) {
    catalogs.push({
      id: 'netflix-top10-global',
      type: 'movie',
      name: 'Netflix Top 10 Movies (Global)',
    });
    catalogs.push({
      id: 'netflix-top10-global',
      type: 'series',
      name: 'Netflix Top 10 Shows (Global)',
    });
  }

  // Add country-specific Netflix Top 10 catalogs based on selected country code
  if (enableNetflixTop10Country && top10CountryCode) {
    const countryCodeUpper = top10CountryCode.toUpperCase();
    catalogs.push({
      id: `netflix-top10-${countryCodeUpper}`,
      type: 'movie',
      name: `Netflix Top 10 Movies (${countryCodeUpper})`,
    });
    catalogs.push({
      id: `netflix-top10-${countryCodeUpper}`,
      type: 'series',
      name: `Netflix Top 10 Shows (${countryCodeUpper})`,
    });
  }

  return catalogs;
}

/**
 * Configured manifest route handler
 */
export function handleConfiguredManifest(req, res, mixpanel) {
  res.setHeader('Cache-Control', 'max-age=86400,stale-while-revalidate=86400,stale-if-error=86400,public');
  res.setHeader('content-type', 'application/json');

  // Parse config
  const buffer = Buffer(req.params?.configuration || '', 'base64');
  const configParts = buffer.toString('ascii')?.split(':');
  const [selectedProviders, rpdbKey, countryCode, installedAt, netflixTop10Global, netflixTop10Country, netflixTop10CountryCode] = configParts;

  mixpanel && mixpanel.track('install', {
    ip: req.ip,
    distinct_id: req.ip.replace(/\.|:/g, 'Z'),
    configuration: req.params.configuration,
    selectedProviders,
    rpdbKey,
    countryCode,
    installedAt,
  });

  const catalogs = [
    ...buildProviderCatalogs(selectedProviders || ''),
    ...buildNetflixTop10Catalogs(netflixTop10Global, netflixTop10Country, netflixTop10CountryCode),
  ];

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
}

/**
 * Default manifest route handler
 */
export function handleDefaultManifest(req, res, mixpanel) {
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
}

