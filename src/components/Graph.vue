<template>
  <svg
    class="render-area"
    ref="renderer"
    @dblclick="createNode"
    @click.left.stop="unselectAllNodes"
    @contextmenu.prevent
  >
    <g>
      <component
        class="line-default"
        v-for="(link, idx) in links"
        :key="idx"
        :is="link.source === link.target ? 'path' : 'line'"
        :x1="nodes[link.source].x"
        :y1="nodes[link.source].y"
        :x2="nodes[link.target].x"
        :y2="nodes[link.target].y"
        :d="loopPosition(link.source)"
        :class="{ 'line-active': link.selected }"
        @click.right.stop.prevent="removeLink(idx)"
      ></component>
    </g>
    <g>
      <circle
        class="node-default"
        :r="RADIUS"
        v-for="(node, idx) in nodes"
        :key="idx"
        :cx="node.x"
        :cy="node.y"
        :class="{ 'node-active': node.selected }"
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
import { ref } from "vue";
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

    // Vars
    let draggableNode = false;

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
    // watch(
    //   () => props.stepData,
    //   (sd) => {
    //     nodes.value.forEach((e) => {
    //       e.selected = false;
    //     });

    //     links.value.forEach((e) => {
    //       e.selected = false;
    //     });

    //     if (Object.keys(sd).length !== 0) {
    //       nodes.value[sd.source].selected = true;
    //       nodes.value[sd.target].selected = true;
    //       links.value.forEach((e) => {
    //         if (e.source === sd.source && e.target === sd.target)
    //           e.selected = true;
    //       });
    //     }
    //   }
    // );

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

    const hasntIntersections = (node) => {
      return nodes.value.every((current) => {
        return (
          (RADIUS * 2) ** 2 <
          (node.x - current.x) ** 2 + (node.y - current.y) ** 2
        );
      });
    };

    const checkGraph = () => {
      euler.loadLinks(Object.values(links.value));

      if (links.value.length > 0 && euler.check()) {
        emit("hasEuler", euler.find());
      } else {
        emit("hasEuler", null);
      }
    };

    // Nodes
    const activateNodes = (ids) =>
      ids.forEach((e) => (nodes.value[e].selected = true));

    const deactivateNodes = (ids) =>
      ids.forEach((e) => (nodes.value[e].selected = false));

    const createNode = ({ offsetX, offsetY }) => {
      if (nodes.value.length >= 99) return;

      const newNode = {
        x: offsetX,
        y: offsetY,
        selected: false,
      };

      if (hasntIntersections(newNode)) {
        nodes.value.push(newNode);
        emit("hasVertices", nodes.value.length);
      }
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
    linker.onLink((source, target) => {
      let duplicateLink = null;

      links.value.forEach((e, idx) => {
        if (
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source)
        )
          duplicateLink = idx;
      });

      if (duplicateLink !== null) {
        links.value.splice(duplicateLink, 1);
        return;
      }

      links.value.push({
        selected: false,
        source,
        target,
      });

      checkGraph();
    });

    const removeLink = (id) => {
      links.value = links.value.filter((_, idx) => idx !== id);
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

.line-default {
  stroke: #3d3d3d;
}

.line-active {
  stroke: #a81043;
}
</style>
