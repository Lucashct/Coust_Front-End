<template>
  <el-dialog
    :model-value="props.visibility"
    title="Adicionar uma conta."
    width="400"
    @update:modelValue="emit('update:visibility', $event)"
    :before-close="closeDialog"
  >

  </el-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['update:visibility'])
const props = defineProps({
  visibility: {
    type: Boolean,
    required: true,
    default: false
  }
});

const closeDialog = () => {
  emit('update:visibility', false);
}
</script>