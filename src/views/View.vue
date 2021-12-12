<template>
  <!--<div class="adjacency_matrix-cont">
    <div class="adjacency_matrix">
      <div class="adjacency_matrix-menu">
        <div class="header  header-matrix">Матрица смежности</div>
        <div class="menu-icon close-icon"></div>
      </div>
      <div class="matrix-cont">
        <div class="value-rows-matrix-cont">
          <div class="value-row-matrix">0</div>
          <div class="value-row-matrix">1</div>
          <div class="value-row-matrix">2</div>
        </div>
        <div class="body-matrix">
          <div class="matrix">
            <div class="matrix-column">
              <div class="value-matrix-column">0</div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
            </div>
            <div class="matrix-column">
              <div class="value-matrix-column">1</div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
            </div>
            <div class="matrix-column">
              <div class="value-matrix-column">2</div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
              <div class="auto-matrix-cell"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>-->
  <!--<div class="popup-cont">
    <div class="popup">
      <div class="popup-el popup-header">
        <div class="header">Эйлеров граф <span class="version">v0.1</span></div>
        <div class="menu-icon close-icon"></div>
      </div>
      <div class="popup-el popup-text">
        <p>
          Граф как математический объект есть совокупность двух множеств —
          множества самих объектов, называемого множеством вершин, и множества
          их парных связей, называемого множеством рёбер.
        </p>
        <p>Элемент множества рёбер есть пара элементов множества вершин.</p>
      </div>
      <div class="popup-el popup-text gray">by Robonen</div>
      <div class="popup-el popup-button-cont">
        <div class="popup-button">Уволиться</div>
        <div class="main-popup-button">Поставить 10 баллов</div>
      </div>
    </div>
  </div>-->
  <div class="addition-cont menu">
    <div class="menu-cont">
      <div class="menu-icon matrix-icon">
        <div class="menu-prompt">Матрица смежности</div>
      </div>
      <div class="menu-icon help-icon">
        <div class="menu-prompt">Обучение управлению</div>
      </div>
      <div class="menu-icon info-icon">
        <div class="menu-prompt">О программе</div>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <header>
      <!--<div class="error">Эйлерова цикла в этом графе нет</div>-->
      <div class="header-step-cont inaccessible">
        <div class="header-step-text">
          <div class="header-vertex">
            {{ stepExists ? steps[currentStep].source : "-" }}
          </div>
          <div class="header-arrow"></div>
          <div class="header-vertex">
            {{ stepExists ? steps[currentStep].target : "-" }}
          </div>
        </div>
        <div class="header-step-description">
          шаг {{ stepExists ? currentStep + 1 : "-" }} /
          {{ stepExists ? stepsCount : "-" }}
        </div>
      </div>
    </header>
    <div class="graph-cont">
      <div class="empty-graph-cont">
        Нажмите ЛКМ дважды, чтобы добавить вершину
      </div>
      <graph @isEuler="getSteps" :stepData="currentStepData"></graph>
      <div class="hints">Чтобы удалить вершину, нажмите ПКМ по ней</div>
    </div>
    <div class="control-cont">
      <div class="control-button" id="previous-step" @click="prevStep">
        <div class="prompt">Предыдущий шаг</div>
      </div>
      <div
        class="main-control-button control-button"
        id="pause"
        v-if="played"
        @click="stop"
      >
        <div class="prompt">Остановить</div>
      </div>
      <div
        class="main-control-button control-button"
        id="play"
        v-else
        :class="{ 'boundary-step': !stepExists }"
        @click="play"
      >
        <div class="prompt">Продолжить</div>
      </div>

      <div class="control-button" id="next-step" @click="nextStep">
        <div class="prompt">Следующий шаг</div>
      </div>
    </div>
  </div>
  <div class="addition-cont">
    <div class="step-cont">
      <div
        class="step"
        v-for="cs in stepsCount"
        :key="cs"
        :class="{ 'active-step last-active-step': cs - 1 === currentStep }"
      >
        {{ cs }}
      </div>
      <!-- <div class="step active-step">2</div>
      <div class="step active-step last-active-step">3</div>
      <div class="step">1</div>
      <div class="step">4</div> -->
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import Graph from "../components/Graph.vue";
// Frontend не выдержит ещё одних правок. Тут и так сейчас много говна
export default {
  name: "View",
  components: {
    Graph,
  },
  setup() {
    // Const
    let timer = null;

    // Reactive
    const steps = ref([]);
    const currentStep = ref(0);
    const currentStepData = ref({});
    const played = ref(false);

    // Computed
    const stepExists = computed(() => {
      return steps.value.length > 0;
    });

    const stepsCount = computed(() => {
      return steps.value.length;
    });

    // Methods
    const getSteps = (data) => {
      steps.value = data;
      currentStep.value = 0;
      currentStepData.value = steps.value[currentStep.value];
    };

    const nextStep = () => {
      if (currentStep.value >= stepsCount.value - 1) currentStep.value = 0;
      else currentStep.value++;

      currentStepData.value = steps.value[currentStep.value];
    };

    const prevStep = () => {
      if (currentStep.value <= 0) currentStep.value = stepsCount.value - 1;
      else currentStep.value--;

      currentStepData.value = steps.value[currentStep.value];
    };

    const play = () => {
      if (!stepExists.value) return;

      played.value = true;
      timer = setInterval(nextStep, 1000);
    };

    const stop = () => {
      played.value = false;

      clearInterval(timer);
    };

    return {
      steps,
      stepsCount,
      stepExists,
      currentStep,
      currentStepData,
      played,
      getSteps,
      nextStep,
      prevStep,
      play,
      stop,
    };
  },
};
</script>

<style>
@import "~@/assets/css/creation.css";
@import "~@/assets/css/graph.css";
</style>
