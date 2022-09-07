<template>
    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="w-full text-gray-200 text-sm px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-400" :type="type" :required="required ? 'required' : null">
</template>
<script setup>
defineProps({
    'modelValue': {},
    'required': {
        default: false,
    },
    'type': {
        default: 'text',
    }
});
defineEmits(['update:modelValue']);
</script>
