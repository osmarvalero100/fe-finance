<template>
  <div class="relative w-full" ref="container">
    <!-- Hidden select for native form validation -->
    <select
      v-if="required"
      :required="required"
      :value="modelValue"
      class="opacity-0 absolute h-0 w-0 bottom-0 left-1/2 pointer-events-none"
      tabindex="-1"
    >
      <option v-if="modelValue !== null && modelValue !== '' && modelValue !== undefined" :value="modelValue">V</option>
      <option v-else value=""></option>
    </select>

    <!-- Display Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-[42px]"
      :class="[{ 'opacity-50 cursor-not-allowed': disabled }, buttonClass]"
      :disabled="disabled"
    >
      <span class="block truncate text-gray-700">
        <slot name="selected" :option="selectedOptionData" :label="selectedLabel">
          {{ selectedLabel }}
        </slot>
      </span>
      <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <!-- Dropdown Panel -->
    <div
      v-if="isOpen"
      class="absolute z-[100] mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none sm:text-sm flex flex-col"
    >
      <div class="px-3 py-2 bg-white border-b border-gray-100 flex-shrink-0">
        <input
          type="text"
          ref="searchInput"
          v-model="searchQuery"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
          placeholder="Buscar..."
          @click.stop
        />
      </div>

      <ul class="overflow-y-auto flex-grow">
        <li
          v-if="showDefaultOption"
          @click="selectOption({ [valueKey]: '', [labelKey]: defaultOptionLabel })"
          class="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
          :class="[ '' === modelValue ? 'bg-indigo-100 font-semibold' : '' ]"
        >
          <span class="block truncate">{{ defaultOptionLabel }}</span>
        </li>

        <li
          v-if="filteredOptions.length === 0"
          class="text-gray-500 cursor-default select-none relative py-2 pl-3 pr-9"
        >
          No se encontraron resultados
        </li>

        <li
          v-for="option in filteredOptions"
          :key="option[valueKey]"
          @click="selectOption(option)"
          class="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9"
          :class="[
            option[valueKey] === modelValue ? 'bg-indigo-100 font-semibold' : 'hover:bg-indigo-50'
          ]"
        >
          <span class="block truncate">
            <slot name="option" :option="option">
              {{ option[iconKey] ? option[iconKey] + ' ' : '' }}{{ option[labelKey] }}
            </slot>
          </span>
        </li>
        
        <li
          v-if="actionOption"
          @click="selectOption(actionOption)"
          class="cursor-pointer select-none relative py-2 pl-3 pr-9 border-t border-gray-100 bg-gray-50 hover:bg-gray-100"
        >
          <span class="block truncate" :class="actionOption.class || 'font-bold text-indigo-600'">
            {{ actionOption.label }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array as () => any[],
    required: true
  },
  valueKey: {
    type: String,
    default: 'id'
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  iconKey: {
    type: String,
    default: 'icon'
  },
  placeholder: {
    type: String,
    default: 'Seleccionar...'
  },
  showDefaultOption: {
    type: Boolean,
    default: false
  },
  defaultOptionLabel: {
    type: String,
    default: 'Seleccionar...'
  },
  actionOption: {
    type: Object as () => { value: any, label: string, class?: string } | null,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  buttonClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const searchQuery = ref('')
const container = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

const selectedOptionData = computed(() => {
  if (props.modelValue === null || props.modelValue === '' || props.modelValue === undefined) {
    return null
  }
  return props.options.find(opt => opt[props.valueKey] === props.modelValue) || null
})

const selectedLabel = computed(() => {
  const found = selectedOptionData.value
  if (found) {
    if (found[props.iconKey]) {
      return `${found[props.iconKey]} ${found[props.labelKey]}`
    }
    return found[props.labelKey]
  }
  if (props.actionOption && props.modelValue === props.actionOption.value) {
    return props.actionOption.label
  }
  return props.showDefaultOption ? props.defaultOptionLabel : props.placeholder
})

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const query = searchQuery.value.toLowerCase()
  return props.options.filter(opt => {
    const label = opt[props.labelKey] ? String(opt[props.labelKey]).toLowerCase() : ''
    return label.includes(query)
  })
})

const toggleDropdown = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
    nextTick(() => {
      searchInput.value?.focus()
    })
  }
}

const selectOption = (option: any) => {
  const val = option[props.valueKey] !== undefined ? option[props.valueKey] : option.value
  emit('update:modelValue', val)
  emit('change', val)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
