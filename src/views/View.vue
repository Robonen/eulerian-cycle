<template>
  <guide v-show="showGuide" :steps="guide" @close="showGuide = false"></guide>
  <popup v-show="showInfo" @close="showInfo = false">
    <template v-slot:title>
      Циклы в эйлером графе
      <span class="version">v0.2</span>
    </template>
    <template v-slot:content>
      <p>
        <b>Эйлеров цикл</b>
        &mdash; путь, проходящий по всем ребрам графа, и при этом только по
        одному разу.
      </p>
    </template>
  </popup>
  <div class="addition-cont menu">
    <div class="menu-cont">
      <div class="menu-icon matrix-icon">
        <div class="menu-prompt">Матрица смежности</div>
      </div>
      <div class="menu-icon help-icon" @click="showGuide = true">
        <div class="menu-prompt">Обучение управлению</div>
      </div>
      <div class="menu-icon info-icon" @click="showInfo = true">
        <div class="menu-prompt">О программе</div>
      </div>
    </div>
  </div>
  <div class="wrapper">
    <header>
      <transition name="fade">
        <div v-if="errorText" class="error" @click="errorText = ''">
          {{ errorText }}
        </div>
      </transition>
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
import { computed, onMounted, ref } from "vue";
import Graph from "../components/Graph";
import Guide from "../components/Guide";
import Popup from "../components/Popup";

export default {
  name: "View",
  components: {
    Graph,
    Guide,
    Popup,
  },
  setup() {
    // Const
    let timer = null;
    const guide = [
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
    const steps = ref([]);
    const currentStep = ref(0);
    const currentStepData = ref({});
    const played = ref(false);
    const showInfo = ref(false);
    const showGuide = ref(false);
    const errorText = ref("");

    // Mounted
    onMounted(() => {
      const key = "first_start";

      if (JSON.parse(localStorage.getItem(key)) !== true) {
        localStorage.setItem(key, true);
        showGuide.value = true;
      }
    });

    // Computed
    const stepExists = computed(() => {
      return steps.value.length > 0;
    });

    const stepsCount = computed(() => {
      return steps.value.length;
    });

    // Methods
    const log = () => {
      showInfo.value = true;
    };

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
      log,
      showInfo,
      showGuide,
      guide,
      errorText,
    };
  },
};
</script>
