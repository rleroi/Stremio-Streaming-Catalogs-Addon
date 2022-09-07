import axios from 'axios';

const AMOUNT = 100;

export default {
    async getMetas(type = 'MOVIE', providers = ['nfx'], country = "GB", language = 'en') {
        let res = null;
        try {
            res = await axios.post('https://apis.justwatch.com/graphql', {
                "operationName": "GetPopularTitles",
                "variables": {
                    "popularTitlesSortBy": "TRENDING",
                    "first": AMOUNT,
                    "platform": "WEB",
                    "sortRandomSeed": 0,
                    "popularAfterCursor": "",
                    "popularTitlesFilter": {
                        "ageCertifications": [],
                        "excludeGenres": [],
                        "excludeProductionCountries": [],
                        "genres": [],
                        "objectTypes": [
                            type
                        ],
                        "productionCountries": [],
                        "packages": providers,
                        "excludeIrrelevantTitles": false,
                        "presentationTypes": [],
                        "monetizationTypes": [
                            "FREE",
                            "FLATRATE",
                            "ADS"
                        ]
                    },
                    "language": language,
                    "country": country
                },
                "query": "query GetPopularTitles(\n  $country: Country!\n  $popularTitlesFilter: TitleFilter\n  $popularAfterCursor: String\n  $popularTitlesSortBy: PopularTitlesSorting! = POPULAR\n  $first: Int!\n  $language: Language!\n  $sortRandomSeed: Int! = 0\n  $profile: PosterProfile\n  $backdropProfile: BackdropProfile\n  $format: ImageFormat\n) {\n  popularTitles(\n    country: $country\n    filter: $popularTitlesFilter\n    after: $popularAfterCursor\n    sortBy: $popularTitlesSortBy\n    first: $first\n    sortRandomSeed: $sortRandomSeed\n  ) {\n    totalCount\n    pageInfo {\n      startCursor\n      endCursor\n      hasPreviousPage\n      hasNextPage\n      __typename\n    }\n    edges {\n      ...PopularTitleGraphql\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment PopularTitleGraphql on PopularTitlesEdge {\n  cursor\n  node {\n    id\n    objectId\n    objectType\n    content(country: $country, language: $language) {\n      externalIds {\n        imdbId\n      }\n      title\n      fullPath\n      scoring {\n        imdbScore\n        __typename\n      }\n      posterUrl(profile: $profile, format: $format)\n      ... on ShowContent {\n        backdrops(profile: $backdropProfile, format: $format) {\n          backdropUrl\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}"
            });
        } catch (e) {
            console.error(e.message);
            console.log(e.response.data);

            return [];
        }

        //console.log(res.data.data.popularTitles.edges.length);

        return res.data.data.popularTitles.edges.map(item => {
            return {
                id: item.node.content.externalIds.imdbId,
                name: item.node.content.title,
                poster: `https://live.metahub.space/poster/medium/${item.node.content.externalIds.imdbId}/img`, //item.node.content.posterUrl,
                posterShape: 'poster',
                type: type === 'MOVIE' ? 'movie' : 'series',
            }
        }).filter(item => item.id);
    }
}
