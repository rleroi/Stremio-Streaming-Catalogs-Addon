<template>
    <div class="antialiased p-4 sm:p-20 bg-purple-900 min-h-screen flex flex-col items-stretch justify-center">
        <div class="sm:flex sm:flex-row justify-center bg-gray-900 p-5 sm:p-20 rounded-3xl shadow-xl grow">
            <div class="flex-col flex self-center lg:p-10 sm:max-w-5xl xl:max-w-lg">
                <div class="self-start hidden lg:flex flex-col text-white">
                    <h3>
                        <img src="/stremio.png" alt="Stremio">
                    </h3>
                    <h1 class="my-3 font-semibold text-4xl">Streaming Catalogs</h1>
                    <p class="pr-3 text-sm opacity-75">Select all your favourite streaming services to add their
                        catalogs to Stremio!</p>
                </div>
            </div>

            <div class="flex justify-center self-center">
                <div class="p-12 bg-gray-800 mx-auto rounded-3xl w-96">
                    <div class="mb-7">
                        <h3 class="font-semibold text-2xl text-gray-100">Configure addon</h3>
                        <p class="text-gray-500">Select your favourite services <a href="https://discord.gg/XBZFdstZq6"
                                target="_blank" class="text-sm text-purple-700 hover:text-purple-600">(?)</a>
                        </p>
                    </div>
                    <div class="text-gray-300">
                        <form class="space-y-6" @submit.prevent="installAddon">
                            <div class="grid grid-cols-4 grid-rows-2 gap-2">
                                <img src="/netflix.webp" @click="toggle('nfx')" class="rounded-xl"
                                    :class="!isActive('nfx') ? 'inactive' : ''" role="button" />
                                <img src="/hbo.webp" @click="toggle('hbm')" class="rounded-xl"
                                    :class="!isActive('hbm') ? 'inactive' : ''" role="button" />
                                <img src="/disney.webp" @click="toggle('dnp')" class="rounded-xl"
                                    :class="!isActive('dnp') ? 'inactive' : ''" role="button" />
                                <img src="/hulu.webp" @click="toggle('hlu')" class="rounded-xl"
                                    :class="!isActive('hlu') ? 'inactive' : ''" role="button" />
                                <img src="/prime.webp" @click="toggle('amp')" class="rounded-xl"
                                    :class="!isActive('amp') ? 'inactive' : ''" role="button" />
                                <img src="/paramount.webp" @click="toggle('pmp')" class="rounded-xl"
                                    :class="!isActive('pmp') ? 'inactive' : ''" role="button" />
                                <img src="/apple.webp" @click="toggle('atp')" class="rounded-xl"
                                    :class="!isActive('atp') ? 'inactive' : ''" role="button" />
                                <img src="/peacock.webp" @click="toggle('pct')" class="rounded-xl"
                                    :class="!isActive('pct') ? 'inactive' : ''" role="button" />
                            </div>

                            <div>
                                <v-button type="submit">Install addon</v-button>
                            </div>
                        </form>
                    </div>
                    <div class="mt-7 text-center text-gray-400 text-xs">
                        Copyright © 2022 |
                        Design
                        <a href="https://codepen.io/uidesignhub" rel="" target="_blank" title="AJI"
                            class="text-violet-500 hover:text-violet-600 ">aji</a>,
                        code
                        <a href="https://github.com/rleroi" rel="" target="_blank" title="R. Leroi"
                            class="text-violet-500 hover:text-violet-600 ">rab1t</a>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import VButton from "./components/VButton.vue";

const state = reactive({
    providers: [
        'nfx',
        'dnp',
        'amp',
        'atp',
        'pmp',
        'hbm',
        'hlu',
        'pct',
    ],
    addonUrl: '',
});

function installAddon() {
    if (!state.providers.length) {
        alert('Please choose at least 1 provider');

        return;
    }

    const base64 = btoa(`${state.providers.join(',')}:${Number(new Date())}`);
    state.addonUrl = `${import.meta.env.VITE_APP_URL}/${encodeURIComponent(base64)}/manifest.json`;

    console.log(state.addonUrl);

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
}
</style>
