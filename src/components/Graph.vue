<template>
  <svg
    ref="renderer"
    @dblclick="createNode"
    @click.left.stop="unselectAllNodes"
    @contextmenu.prevent
  >
    <g>
      <g v-for="(link, idx) in links" :key="idx">
        <path
          v-if="link.source === link.target"
          class="line-default"
          :class="{
            'line-active': link.selected === 1,
            'line-was-active': link.selected === 2,
          }"
          :d="loopPosition(link.source)"
          @click.right.stop.prevent="removeLink(idx)"
        ></path>
        <line
          v-else
          class="line-default"
          :class="{
            'line-active': link.selected === 1,
            'line-was-active': link.selected === 2,
          }"
          :x1="nodes[link.source].x"
          :y1="nodes[link.source].y"
          :x2="nodes[link.target].x"
          :y2="nodes[link.target].y"
          @click.right.stop.prevent="removeLink(idx)"
        ></line>
      </g>
    </g>
    <g>
      <circle
        class="node-default"
        :r="RADIUS"
        v-for="(node, idx) in nodes"
        :key="idx"
        :cx="node.x"
        :cy="node.y"
        :class="{
          'node-active': node.selected === 1,
          'node-was-active': node.selected === 2,
        }"
        @click.right.stop.prevent="removeNode(idx)"
        @click.left.stop="selectNode(idx)"
        @mousedown="dragNode($event, idx)"
        @mouseup="dropNode"
      ></circle>
    </g>
    <g>
      <text
        class="node-text"
        v-for="(node, idx) in nodes"
        :key="idx"
        :x="node.x - String(idx).length * 4"
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
    currentStep: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    // Const
    const RADIUS = 25;

    // Vars
    let draggableNode = false;
    let loop = null;

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
      () => props.currentStep,
      (stepId) => {
        if (loop === null) return;

        // Invalidate all
        deactivateAll();

        // Select passed
        for (let i = 0; i < stepId; i++) {
          const pass = loop[i];
          const pass_id = findLink(pass);

          links.value[pass_id].selected = 2;
          wasActivatedNodes([pass.source, pass.target]);
        }

        // Select current
        const current = loop[stepId];
        const current_id = findLink(current);

        links.value[current_id].selected = 1;
        activateNodes([current.source, current.target]);
      }
    );

    // Methods
    const loopPosition = (coords) => {
      const node = nodes.value[coords];

      const x = node.x;
      const y = node.y;
      const hR = RADIUS / 2;
      const m = 100;

      return `M${x - hR},${y} C${x - m},${y - m} ${x + m}, ${y - m} ${
        x + hR
      },${y}`;
    };

    const checkGraph = () => {
      if (loop !== null) {
        deactivateAll();
        if (!linker.sourceEmpty()) activateNodes([linker.getSource()]);
      }

      euler.loadLinks(Object.values(links.value));

      if (links.value.length > 0 && euler.check()) {
        loop = euler.find();
      } else {
        loop = null;
      }

      emit("hasEuler", loop);
    };

    // Nodes
    const activateNodes = (ids) =>
      ids.forEach((e) => (nodes.value[e].selected = 1));

    const deactivateNodes = (ids) =>
      ids.forEach((e) => (nodes.value[e].selected = 0));

    const wasActivatedNodes = (ids) =>
      ids.forEach((e) => (nodes.value[e].selected = 2));

    const deactivateAll = () => {
      nodes.value.forEach((node) => (node.selected = false));
      links.value.forEach((link) => (link.selected = 0));
    };

    const createNode = ({ offsetX, offsetY }) => {
      if (nodes.value.length >= 99) return;

      const newNode = {
        x: offsetX,
        y: offsetY,
        selected: 0,
      };

      nodes.value.push(newNode);
      emit("hasVertices", nodes.value.length);
    };

    const removeNode = (id) => {
      unselectAllNodes();

      links.value = links.value
        .filter((e) => e.source !== id && e.target !== id)
        .map((current) => {
          current.source =
            current.source > id ? current.source - 1 : current.source;
          current.target =
            current.target > id ? current.target - 1 : current.target;
          return current;
        });

      nodes.value = nodes.value.filter((_, idx) => idx !== id);

      checkGraph();
      emit("hasVertices", nodes.value.length);
    };

    const selectNode = (id) => {
      if (draggableNode) {
        draggableNode = false;
        return;
      }

      if (linker.sourceEmpty()) {
        linker.setSource(id);
        activateNodes([id]);
      } else {
        linker.addTarget(id);
      }
    };

    const unselectAllNodes = () => {
      if (!linker.sourceEmpty()) {
        deactivateNodes([linker.getSource()]);
      }

      linker.reset();
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

      draggableNode = true;

      nodes.value[d.id].x = offsetX - d.offsetX;
      nodes.value[d.id].y = offsetY - d.offsetY;
    };

    // Links
    const hasLink = (obj1, obj2) => {
      return (
        (obj1.source === obj2.source && obj1.target === obj2.target) ||
        (obj1.source === obj2.target && obj1.target === obj2.source)
      );
    };

    const findLink = (vertex) => {
      return links.value.findIndex((link) => hasLink(vertex, link));
    };

    linker.onLink((source, target) => {
      let duplicateLink = null;

      links.value.forEach((e, idx) => {
        if (hasLink(e, { source, target })) duplicateLink = idx;
      });

      if (duplicateLink !== null) {
        links.value.splice(duplicateLink, 1);
        checkGraph();
        return;
      }

      links.value.push({
        selected: 0,
        source,
        target,
      });

      checkGraph();
    });

    const removeLink = (id) => {
      links.value = links.value.filter((_, idx) => idx !== id);
      checkGraph();
    };

    return {
      RADIUS,
      loopPosition,
      nodes,
      links,
      renderer,
      createNode,
      selectNode,
      unselectAllNodes,
      removeNode,
      removeLink,
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
line,
path {
  cursor: pointer;
}

line,
path {
  stroke-width: 4px;
  fill: transparent;
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
  pointer-events: none;
}

.node-default {
  fill: #3d3d3d;
}

.node-active {
  fill: #ec407a;
}

.node-was-active {
  fill: #8d3956;
}

.line-default {
  stroke: #3d3d3d;
}

.line-active {
  stroke: #ff93b8;
}

.line-was-active {
  stroke: #8d3956;
}
</style>
