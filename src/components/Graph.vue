<template>
  <svg
    class="render-area"
    ref="renderer"
    @dblclick="createNode"
    @click="deactivateAllNodes"
  >
    <g>
      <line
        class="line-default"
        v-for="(link, idx) in links"
        :key="idx"
        :x1="nodes[link.source].x"
        :y1="nodes[link.source].y"
        :x2="nodes[link.target].x"
        :y2="nodes[link.target].y"
        :class="{ 'line-active': link.selected }"
      />
    </g>
    <g>
      <circle
        class="node-default"
        r="25"
        v-for="(node, idx) in nodes"
        :key="idx"
        :cx="node.x"
        :cy="node.y"
        :class="{ 'node-active': node.selected }"
        @dblclick.prevent="createNode"
        @click.right.prevent="removeNode(idx)"
        @click.left.stop="selectNode(idx)"
        @mousedown="dragNode($event, idx)"
        @mouseup="dropNode()"
      />
    </g>
    <g>
      <text
        class="node-text"
        v-for="(node, idx) in nodes"
        :key="idx"
        :x="node.x - 4"
        :y="node.y + 5.5"
      >
        {{ idx }}
      </text>
    </g>
  </svg>
</template>

<script>
import { ref, watch } from "vue";
import Linker from "./core/linker";
import EulerCycle from "./core/euler";

export default {
  name: "Graph",
  props: {
    stepData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    // Const
    const RADIUS = 25;

    // Reactive
    const renderer = ref(null);

    const nodes = ref([]);
    const links = ref([]);

    const drag = ref({
      id: null,
      offsetX: null,
      offsetY: null,
    });

    const linker = new Linker();
    const euler = new EulerCycle();

    // Watchers
    watch(
      () => props.stepData,
      (sd) => {
        nodes.value.forEach((e) => {
          e.selected = false;
        });

        links.value.forEach((e) => {
          e.selected = false;
        });

        if (Object.keys(sd).length !== 0) {
          nodes.value[sd.source].selected = true;
          nodes.value[sd.target].selected = true;
          links.value.forEach((e) => {
            if (e.source === sd.source && e.target === sd.target)
              e.selected = true;
          });
        }
      }
    );

    // Methods
    const hasntIntersections = (node) => {
      return nodes.value.every((current) => {
        return (
          (RADIUS * 2) ** 2 <
          (node.x - current.x) ** 2 + (node.y - current.y) ** 2
        );
      });
    };

    const deactivateAllNodes = () =>
      nodes.value.forEach((e) => {
        e.selected = false;
        linker.reset();
      });

    const activateNodes = (ids) =>
      ids.forEach((e) => (nodes.value[e].selected = true));

    const deactivateNodes = (ids) =>
      ids.forEach((e) => (nodes.value[e].selected = false));

    // Nodes
    const createNode = ({ offsetX, offsetY }) => {
      const newNode = {
        x: offsetX,
        y: offsetY,
        selected: false,
      };

      if (hasntIntersections(newNode)) {
        nodes.value.push(newNode);
      }
    };

    const removeNode = (id) => {
      links.value = links.value.filter(
        (e) => e.source !== id && e.target !== id
      );
      nodes.value = nodes.value.filter((el, idx) => idx !== id);
      emit("isEuler", []);
    };

    const selectNode = (id) => {
      if (linker.sourceEmpty()) {
        linker.source = id;
        activateNodes([id]);
      } else {
        linker.target = id;
        deactivateNodes([linker.source, linker.target]);
        createLink(linker.load());
        linker.reset();
      }
    };

    // Node drag and drop
    const dragNode = ({ offsetX, offsetY }, id) => {
      drag.value = {
        id,
        offsetX: offsetX - nodes.value[id].x,
        offsetY: offsetY - nodes.value[id].y,
      };

      renderer.value.addEventListener("mousemove", nodeMove);
    };

    const dropNode = () => {
      drag.value = {
        id: null,
        offsetX: null,
        offsetY: null,
      };

      renderer.value.removeEventListener("mousemove", nodeMove);
    };

    const nodeMove = ({ offsetX, offsetY }) => {
      const d = drag.value;

      nodes.value[d.id].x = offsetX - d.offsetX;
      nodes.value[d.id].y = offsetY - d.offsetY;
    };

    // Links
    const createLink = (link) => {
      links.value.push(Object.assign({ selected: false }, link));

      euler.loadLinks([...links.value]);

      if (euler.check()) emit("isEuler", euler.find());
      else emit("isEuler", []);
    };

    return {
      nodes,
      links,
      renderer,
      createNode,
      selectNode,
      removeNode,
      deactivateAllNodes,
      dragNode,
      dropNode,
    };
  },
};
</script>

<style>
svg {
  width: 100%;
  height: 100%;
}

circle,
line {
  cursor: pointer;
}

line {
  stroke-width: 4px;
}

.node-text {
  font-size: 14px;
  font-weight: 500;
  font-family: "Formular";
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  fill: #fff;
}

.node-default {
  fill: #3d3d3d;
}

.node-active {
  fill: #ec407a;
}

.line-default {
  stroke: #3d3d3d;
}

.line-active {
  stroke: #a81043;
}
</style>
