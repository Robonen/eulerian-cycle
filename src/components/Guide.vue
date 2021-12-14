<template>
  <popup
    leftBtnText="Назад"
    :rightBtnText="currentStep + 1 === steps.length ? 'Завершить' : 'Далее'"
    @left="stepDown"
    @right="stepUp"
    @close="close"
  >
    <template v-slot:title>
      {{ steps[currentStep].name }}
      <span class="version">{{ currentStep + 1 }} / {{ steps.length }}</span>
    </template>
    <template v-slot:content>
      {{ steps[currentStep].content }}
    </template>
  </popup>
</template>

<script>
import { ref } from "vue";
import Popup from "./Popup";

export default {
  name: "Guide",
  components: {
    Popup,
  },
  props: {
    steps: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Reactive
    const currentStep = ref(0);

    // Methods
    const stepDown = () => {
      if (currentStep.value <= 0) return;

      currentStep.value -= 1;
    };

    const stepUp = () => {
      if (currentStep.value + 1 >= props.steps.length) {
        close();
        return;
      }

      currentStep.value += 1;
    };

    const close = () => {
      currentStep.value = 0;
      emit("close");
    };

    return {
      currentStep,
      stepDown,
      stepUp,
      close,
    };
  },
};
</script>
