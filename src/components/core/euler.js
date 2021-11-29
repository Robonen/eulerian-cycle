class EulerCycle {
  #graph = [];

  constructor(graph) {
    this.#graph = graph;
  }

  loadLinks(graph) {
    this.#graph = graph;
  }

  find() {
    const stack = [];
    const tour = [];

    stack.push(this.#graph[0].source);

    while (stack.length > 0) {
      const v = stack[stack.length - 1];
      const degree = this.#getDegree(v);

      if (degree === 0) {
        stack.pop();
        tour.push(v);
      } else {
        const { index, edge } = this.#getEdgeAndIndex(v);
        this.#graph.splice(index, 1);
        stack.push(v === edge.source ? edge.target : edge.source);
      }
    }

    return this.#toVector(tour);
  }

  check() {
    let counter = new Map();

    for (const vertex of this.#graph) {
      if (counter.has(vertex.source))
        counter.set(vertex.source, counter.get(vertex.source) + 1);
      else counter.set(vertex.source, 1);

      if (counter.has(vertex.target))
        counter.set(vertex.target, counter.get(vertex.target) + 1);
      else counter.set(vertex.target, 1);
    }

    for (const degree of counter.values()) if (degree % 2 !== 0) return false;

    return true;
  }

  #getDegree(v) {
    let degree = 0;

    for (const { source, target } of this.#graph) {
      if (v === source || v === target) degree++;
    }

    return degree;
  }

  #getEdgeAndIndex(v) {
    let edge = {};
    let index = -1;

    for (let i = 0; i < this.#graph.length; i++) {
      if (v === this.#graph[i].source || v === this.#graph[i].target) {
        edge = this.#graph[i];
        index = i;
      }
    }

    return { index, edge };
  }

  #toVector(arr) {
    const result = [];

    for (let i = 1; i < arr.length; i++) {
      result.push({
        source: arr[i - 1],
        target: arr[i],
      });
    }

    return result;
  }
}

export default EulerCycle;
