<template>
  <div class="menu-cont">
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
  <div class="wrapper">
    <header>
      <div></div>
      <div class="header-step-cont">
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
      <router-link to="/">
        <div class="header-close-button"></div>
      </router-link>
    </header>
    <div class="graph-cont">
      <graph @isEuler="getSteps" :stepData="currentStepData"></graph>
    </div>
    <div class="control-cont">
      <div class="control-button" id="previous-step" @click="prevStep"></div>
      <div
        class="main-control-button control-button"
        id="pause"
        v-if="played"
        @click="stop"
      ></div>
      <div
        class="main-control-button control-button"
        id="play"
        v-else
        :class="{ 'boundary-step': !stepExists }"
        @click="play"
      ></div>

      <div class="control-button" id="next-step" @click="nextStep"></div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import Graph from "../components/Graph.vue";

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
@import "~@/assets/css/graph.css";
</style>
