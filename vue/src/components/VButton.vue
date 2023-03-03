<template>
    <button v-if="variation === 'primary'"
            class="w-full flex justify-center bg-purple-900 hover:bg-purple-800 text-gray-100 p-3  rounded-lg tracking-wide font-semibold  cursor-pointer transition ease-in duration-500">
        <slot></slot>
    </button>
    <button v-else
            class="w-full flex items-center justify-center mb-6 md:mb-0 border border-gray-700 hover:border-gray-900 hover:bg-gray-900 text-sm text-gray-300 p-3  rounded-lg tracking-wide font-medium  cursor-pointer transition ease-in duration-500 px-">
        <slot></slot>
    </button>
</template>
<script setup>
defineProps({
    variation: {
        default: 'secondary',
    },
})
</script>
