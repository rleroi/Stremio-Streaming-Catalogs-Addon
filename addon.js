import axios from 'axios';

const COUNTRY = 67; // NL
const MAX = 500;
const DAYS = 365;

export default {
    async getMetas(type = 'movie') {
        let metas = [];
        let offset = 0;
        const limit = 50;

        do {
            metas = [...metas, ...(await axios.get(`https://unogs.com/api/search?query=new%20last%20${DAYS}%20days&orderby=-Date&countrylist=${COUNTRY}&type=${type}&limit=${limit}&offset=${offset}`, {
                headers: {
                    'REFERRER': 'http://unogs.com',
                    'Referer': 'https://unogs.com/countrydetail',
                },
            }).catch(console.error))?.data?.results?.map(item => {
                return {
                    id: item.imdbid,
                    name: item.title,
                    poster: item.img,
                    description: item.synopsis,
                    year: item.year,
                    posterShape: 'poster',
                    type: item.vtype,
                }
            })];
        } while((offset += limit) < MAX);

        return metas;
    }
}