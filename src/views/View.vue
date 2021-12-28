<template>
  <guide v-show="showGuide" @close="showGuide = false"></guide>
  <popup v-show="showInfo" @close="showInfo = false">
    <template v-slot:title>
      Циклы в эйлером графе
      <span class="version">v0.2</span>
    </template>
    <template v-slot:content>
      <p>Алгоритм находит Эйлеров цикл в неориентированном графе.</p>
      <p>
        Перед запуском алгоритма необходимо проверить граф на эйлеровость, т.е.
        каждая вершина должна иметь четную степень. Чтобы построить Эйлеров
        цикл, нужно запустить алгоритм из любой вершины.
      </p>
      <p>
        Алгоритм напоминает поиск в глубину. Главное отличие состоит в том, что
        пройденными помечаются не вершины, а ребра графа.
      </p>
      <p>
        Начиная со стартовой вершины <b>v</b> строим путь, добавляя на каждом
        шаге не пройденное еще ребро, смежное с текущей вершиной. Вершины пути
        накапливаются в стеке <b>S</b>. Когда наступает такой момент, что для
        текущей вершины <b>w</b> все инцидентные ей ребра уже пройдены,
        записываем вершины из <b>S</b> в ответ, пока не встретим вершину,
        которой инцидентны не пройденные еще ребра. Далее продолжаем обход по не
        посещенным ребрам.
      </p>
    </template>
    <template v-slot:footer>
      <a href="https://github.com/robonen/" class="gray">
        <div class="popup-el popup-text">Автор &mdash; Робонен А.С.</div>
      </a>
      <a href="https://github.com/RomaFedoro" class="gray">
        <div class="popup-el popup-text">Дизайн &mdash; Фёдоров Р.М.</div>
      </a>
    </template>
  </popup>
  <div class="addition-cont menu">
    <div class="menu-cont">
      <!-- <div class="menu-icon matrix-icon">
        <div class="menu-prompt">Матрица смежности</div>
      </div> -->
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
      <transition name="fade-up">
        <div v-if="errorText" class="error" @click="errorText = ''">
          {{ errorText }}
        </div>
      </transition>
      <transition name="fade-up">
        <div v-if="stepExists" class="header-step-cont">
          <div class="header-step-text">
            <div class="header-vertex">
              {{ currentStepData.source ?? "-" }}
            </div>
            <div class="header-arrow"></div>
            <div class="header-vertex">
              {{ currentStepData.target ?? "-" }}
            </div>
          </div>
          <div class="header-step-description">
            шаг {{ stepExists ? currentStepNumber + 1 : "-" }} /
            {{ stepExists ? stepsTotal : "-" }}
          </div>
        </div>
      </transition>
    </header>
    <div class="graph-cont">
      <div v-if="!vertexExists" class="empty-graph-cont">
        Нажмите ЛКМ дважды, чтобы добавить вершину
      </div>
      <graph
        :currentStep="currentStepNumber"
        @hasEuler="loadSteps"
        @hasVertices="setVertices"
      ></graph>
      <div v-if="vertexExists" class="hints">
        Чтобы удалить вершину или ребро, нажмите ПКМ
      </div>
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
  <transition name="fade-left">
    <div v-if="stepExists" class="addition-cont">
      <div class="step-cont">
        <div
          class="step"
          v-for="(step, i) in steps"
          :key="i"
          :class="{
            'active-step':
              i === currentStepNumber || i === currentStepNumber + 1,
            'dynamic-active-step': played && i < currentStepNumber,
            'last-active-step': i === currentStepNumber + 1,
          }"
          @click="currentStepNumber = i"
        >
          {{ step.source }}
        </div>
      </div>
    </div>
  </transition>
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
    const ANIMATION_DELAY = 1500;
    const ERROR_DELAY = 5000;

    // Reactive
    const vertices = ref(0);
    const steps = ref([]);
    const currentStepNumber = ref(0);
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
    const vertexExists = computed(() => {
      return vertices.value > 0;
    });

    const stepExists = computed(() => {
      return steps.value.length > 0;
    });

    const stepsTotal = computed(() => {
      return steps.value.length;
    });

    // Methods
    const showError = (msg) => {
      errorText.value = msg;
      setTimeout(() => (errorText.value = false), ERROR_DELAY);
    };

    const setVertices = (data) => {
      vertices.value = data;
    };

    const loadSteps = (data) => {
      steps.value = data ?? [];
      currentStepNumber.value = 0;
      currentStepData.value = steps.value[currentStepNumber.value] ?? {};
    };

    const nextStep = () => {
      if (currentStepNumber.value >= stepsTotal.value - 1)
        currentStepNumber.value = 0;
      else currentStepNumber.value++;

      currentStepData.value = steps.value[currentStepNumber.value];
    };

    const prevStep = () => {
      if (currentStepNumber.value <= 0)
        currentStepNumber.value = stepsTotal.value - 1;
      else currentStepNumber.value--;

      currentStepData.value = steps.value[currentStepNumber.value];
    };

    const play = () => {
      if (!stepExists.value) {
        showError("Эйлеров цикл не найден!");
        return;
      }

      played.value = true;
      timer = setInterval(nextStep, ANIMATION_DELAY);
    };

    const stop = () => {
      played.value = false;

      clearInterval(timer);
    };

    return {
      // Player properties
      vertexExists,
      steps,
      stepsTotal,
      stepExists,
      currentStepNumber,
      currentStepData,
      played,

      // Player methods
      setVertices,
      loadSteps,
      nextStep,
      prevStep,
      play,
      stop,

      // Helpers
      showInfo,
      showGuide,
      errorText,
    };
  },
};
</script>
