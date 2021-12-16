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
  setup(props, { emit }) {
    // Const
    const steps = [
      {
        name: "Создание вершин",
        content:
          "Для создания новой вершины необходимо дважды нажать левую кнопку мыши",
        video: "/video/create.mp4",
      },
      {
        name: "Связывание вершин",
        content:
          "Чтобы связать вершины, необходимо кликнуть левой кнопкой мыши по вершине, которую необходимо связать. Далее выбираются вершины, с которыми необходимо связать",
        video: "/video/linking.mp4",
      },
    ];

    // Reactive
    const currentStep = ref(0);
    // Methods
    const stepDown = () => {
      if (currentStep.value <= 0) return;

      currentStep.value -= 1;
    };

    const stepUp = () => {
      if (currentStep.value + 1 >= steps.length) {
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
      steps,
      currentStep,
      stepDown,
      stepUp,
      close,
    };
  },
};
</script>
