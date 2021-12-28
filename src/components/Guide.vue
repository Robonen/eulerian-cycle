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
      <p v-html="steps[currentStep].content"></p>
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
        name: "Создание графа",
        content:
          "Для создания нового графа, необходимо добавить вершины на рабочую область. Для этого необходимо дважды кликнуть левой кнопкой мыши по рабочей области.",
      },
      {
        name: "Связывание вершин",
        content:
          "После создания вершин, их необходимо связать между собой. Для этого один раз кликните по необходимой вершине, после чего она поменяет цвет. Теперь необходимо выбрать вершины, с которыми необходимо связать. Если вершина успешно привязана, то появится ребро. Чтобы снять выделение, кликните в пустое место рабочей области.",
      },
      {
        name: "Удаление вершин и ребер",
        content:
          "В случае, когда необходимо удалить вершину или ребро, то достаточно один раз кликнуть правой кнопкой мыши по элементу.",
      },
      {
        name: "Нахождение эйлерова цикла",
        content:
          "После любых действий над вершинами или ребрами, программа проверяет наличие эйлерова цикла. Если эйлеров цикл будет найден, то:<ul><li>В верхней части программы появится количество шагов цикла и текущий шаг.</li><li>В правой части программы появится последовательность вершин в эйлеровом цикле.</li><li>Станет доступна кнопка проигрывания анимации прохождения цикла по графу.</li>",
      },
      {
        name: "Элементы управления анимацией",
        content:
          "Когда эйлеров цикл будет найден, появится возможность проиграть анимацию прохождения цикла по графу. Для этого существуют элементы управления в нижней части программы. Также анимацию можно просмотреть, начиная с нужной вершины, кликнув на нужную вершину в правой панели программы.",
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
