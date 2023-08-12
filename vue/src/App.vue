<template>
    <div class="antialiased p-4 sm:p-20 bg-purple-900 min-h-screen flex flex-col items-stretch justify-center">
        <div class="sm:flex sm:flex-row justify-center bg-gray-900 p-5 sm:p-20 rounded-3xl shadow-xl md:grow">
            <div class="flex-col flex self-center lg:p-10 sm:max-w-5xl xl:max-w-lg">
                <div class="self-start hidden lg:flex flex-col text-white">
                    <h3>
                        <img src="/stremio.png" alt="Stremio">
                    </h3>
                    <h1 class="my-3 font-semibold text-4xl">Streaming Catalogs</h1>
                    <p class="pr-3 text-sm opacity-75">Select all your favourite streaming services to add their
                        catalogs to Stremio!</p>
                    <v-button class="mt-8 py-2" @click="openUrl('https://ko-fi.com/rab1t')">
                        <img class="w-8 mr-2" src="https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png" />
                        <span>Support me on Ko-fi</span>
                    </v-button>
                </div>
            </div>

            <div class="flex justify-center self-center">
                <div>
                    <div class="p-12 bg-gray-800 mx-auto rounded-3xl w-96">

                        <div class="mb-7">
                            <h3 class="font-semibold text-2xl text-gray-100">Configure addon
                                <Popper hover content="For questions, join our Discord" class="text-sm">
                                    <a
                                        href="https://discord.gg/XBZFdstZq6" target="_blank"
                                        class="text-sm text-purple-700 hover:text-purple-600">(?)</a>
                                </Popper>
                            </h3>
                        </div>
                        <div class="text-gray-300">
                            <form class="space-y-6" @submit.prevent="installAddon">
                                <div>
                                    <p class="text-gray-500 mb-1">Filter providers by country:</p>
                                    <select v-model="state.country"
                                        class="w-full text-gray-200 text-sm px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-400">
                                        <option v-for="country in getCountries()" :key="country" :value="country">
                                            {{ country }}
                                        </option>
                                    </select>
                                </div>
                                <div class="grid grid-cols-4 grid-rows-2 gap-2">
                                    <Popper v-show="showProvider('nfx')" hover content="Netflix">
                                        <img src="/netflix.webp" @click="toggle('nfx')" class="rounded-xl"
                                            :class="!isActive('nfx') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('hbm')" hover content="HBO Max">
                                        <img src="/hbo.webp" @click="toggle('hbm')" class="rounded-xl"
                                            :class="!isActive('hbm') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('dnp')" hover content="Disney+">
                                        <img src="/disney.webp" @click="toggle('dnp')" class="rounded-xl"
                                            :class="!isActive('dnp') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('amp')" hover content="Prime Video">
                                        <img src="/prime.webp" @click="toggle('amp')" class="rounded-xl"
                                            :class="!isActive('amp') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('atp')" hover content="Apple TV+">
                                        <img src="/apple.webp" @click="toggle('atp')" class="rounded-xl"
                                            :class="!isActive('atp') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('pmp')" hover content="Paramount+">
                                        <img src="/paramount.webp" @click="toggle('pmp')" class="rounded-xl"
                                            :class="!isActive('pmp') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('pcp')" hover content="Peacock Premium">
                                        <img src="/peacock.webp" @click="toggle('pcp')" class="rounded-xl"
                                            :class="!isActive('pcp') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('hlu')" hover content="Hulu">
                                        <img src="/hulu.webp" @click="toggle('hlu')" class="rounded-xl"
                                            :class="!isActive('hlu') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('cts')" hover content="Curiosity Stream">
                                        <img src="/curiositystream.webp" @click="toggle('cts')" class="rounded-xl"
                                            :class="!isActive('cts') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('mgl')" hover content="MagellanTV">
                                        <img src="/magellan.webp" @click="toggle('mgl')" class="rounded-xl"
                                            :class="!isActive('mgl') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('fmn')" hover content="Funimation Now">
                                        <img src="/funimation.webp" @click="toggle('fmn')" class="rounded-xl"
                                            :class="!isActive('fmn') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('hay')" hover content="Hayu">
                                        <img src="/hayu.webp" @click="toggle('hay')" class="rounded-xl"
                                            :class="!isActive('hay') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('clv')" hover content="Clarovideo">
                                        <img src="/claro.webp" @click="toggle('clv')" class="rounded-xl"
                                            :class="!isActive('clv') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('gop')" hover content="Globoplay">
                                        <img src="/globo.webp" @click="toggle('gop')" class="rounded-xl"
                                            :class="!isActive('gop') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('hst')" hover content="Hotstar">
                                        <img src="/hotstar.webp" @click="toggle('hst')" class="rounded-xl"
                                            :class="!isActive('hst') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('zee')" hover content="Zee5">
                                        <img src="/zee5.webp" @click="toggle('zee')" class="rounded-xl"
                                            :class="!isActive('zee') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('nlz')" hover content="NLZIET">
                                        <img src="/nlziet.webp" @click="toggle('nlz')" class="rounded-xl"
                                            :class="!isActive('nlz') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('vil')" hover content="Videoland">
                                        <img src="/videoland.webp" @click="toggle('vil')" class="rounded-xl"
                                            :class="!isActive('vil') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('sst')" hover content="SkyShowtime">
                                        <img src="/skyshowtime.webp" @click="toggle('sst')" class="rounded-xl"
                                            :class="!isActive('sst') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('blv')" hover content="BluTV">
                                        <img src="/blu.webp" @click="toggle('blv')" class="rounded-xl"
                                            :class="!isActive('blv') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('cpd')" hover content="Canal+">
                                        <img src="/canal-plus.webp" @click="toggle('cpd')" class="rounded-xl"
                                            :class="!isActive('cpd') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                    <Popper v-show="showProvider('dpe')" hover content="Discovery+">
                                        <img src="/discovery-plus.webp" @click="toggle('dpe')" class="rounded-xl"
                                            :class="!isActive('dpe') ? 'inactive' : ''" role="button" />
                                    </Popper>
                                </div>

                                <div class="flex">
                                    <v-input type="text" class="rounded-r-none h-[46px]" placeholder="RPDB key (optional)" pattern="t[1-3]-[a-zA-Z0-9\-]+" v-model="state.rpdbKey" />
                                    <v-button type="button" class="w-auto rounded-l-none border-l-0 h-[46px]" @click="openUrl('https://ratingposterdb.com/')">?</v-button>
                                </div>

                                <div>
                                    <v-button type="submit" variation="primary">Install addon</v-button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="mt-4 text-center text-gray-400 text-xs">
                        <a href="https://github.com/rleroi/Stremio-Streaming-Catalogs-Addon" rel="noopener" target="_blank"
                            title="Contribute on GitHub" class="mr-2 fill-gray-400 hover:fill-gray-500 ">
                            <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="https://ko-fi.com/rab1t" rel="noopener" target="_blank" title="Support me on Ko-fi">
                            <img class="inline-block" width="48px"
                                src="https://storage.ko-fi.com/cdn/brandasset/kofi_s_logo_nolabel.png" />
                        </a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import regionsToCountries from './regions-to-countries.json'
import VButton from "./components/VButton.vue";
import VInput from "./components/VInput.vue";

const regions = {
    'United States': [
        'nfx',
        'dnp',
        'amp',
        'atp',
        'hbm',
        'pmp',
        'mgl',
        'cts',
        'fmn',
        'hlu',
        'pcp',
        'dpe',
    ],
    'Brazil': [
        'nfx',
        'dnp',
        'atp',
        'amp',
        'pmp',
        'hbm',
        'fmn',
        'clv',
        'gop',
        'mgl',
        'cts',
    ],
    'India': [
        'hay',
        'nfx',
        'atp',
        'amp',
        'zee',
        'hst',
        'mgl',
        'cts',
        'dpe',
    ],
    'Turkey': [
        'nfx',
        'dnp',
        'atp',
        'amp',
        'blv',
        'mgl',
        'cts',
    ],
    'Netherlands': [
        'nfx',
        'dnp',
        'amp',
        'atp',
        'hbm',
        'hay',
        'vil',
        'sst',
        'mgl',
        'cts',
        'nlz',
        'dpe',
    ],
    'France': [
        'nfx',
        'dnp',
        'amp',
        'atp',
        'hbm',
        'hay',
        'cpd',
    ],
    'Any': [
        'nfx',
        'dnp',
        'amp',
        'atp',
        'hbm',
        'pmp',
        'hlu',
        'pcp',
        'clv',
        'gop',
        'blv',
        'zee',
        'hst',
        'hay',
        'vil',
        'sst',
        'mgl',
        'cts',
        'fmn',
        'nlz',
        'cpd',
        'dpe',
    ],
};

const state = reactive({
    country: getCountry(),
    rpdbKey: '',
    providers: [
        'nfx',
        'dnp',
        'amp',
        'atp',
        'hbm',
    ],
    addonUrl: '',
});

function openUrl(url) {
    window.open(url, '_blank', 'noopener');
}

function getCountryCodeFromCountry(country) {
    switch (country) {
        case 'Netherlands':
            return 'nl';
        case 'United States':
            return 'us';
        case 'Turkey':
            return 'tr';
        case 'Brazil':
            return 'br';
        case 'India':
            return 'in';
        case 'France':
            return 'fr';
        default:
            return '';
    }
}

function getCountries() {
    return Object.keys(regions);
}

function getCountry() {
    return regionsToCountries[Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone] || 'Any';
}

function showProvider(provider) {
    return state.providers.includes(provider) || regions?.[state.country]?.includes(provider);
}

function installAddon() {
    if (!state.providers.length) {
        alert('Please choose at least 1 provider');

        return;
    }

    const base64 = btoa(`${state.providers.join(',')}:${state.rpdbKey}:${getCountryCodeFromCountry(state.country)}:${Number(new Date())}`);
    state.addonUrl = `${import.meta.env.VITE_APP_URL}/${encodeURIComponent(base64)}/manifest.json`;

    console.log('URL:', state.addonUrl);

    window.location.href = state.addonUrl.replace(/https?:\/\//, 'stremio://');
}

function toggle(provider) {
    let index = state.providers.indexOf(provider);
    if (index === -1) {
        state.providers.push(provider);
    } else {
        state.providers.splice(index, 1);
    }
}

function isActive(provider) {
    return state.providers.includes(provider)
}
</script>

<style scoped>
.inactive {
    @apply opacity-30
}</style>
