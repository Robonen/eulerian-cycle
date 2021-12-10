class Linker {
  #source = null;
  #targets = null;
  #callback = () => {};

  constructor() {
    this.reset();
  }

  getSource() {
    return this.#source;
  }

  setSource(src) {
    if (this.#source === null) this.#source = src;
  }

  getTargets() {
    return this.#targets;
  }

  setTargets(trg) {
    this.#targets = trg;
  }

  addTarget(trg) {
    this.#targets.push(trg);
    this.#callback(this.#source, trg);
  }

  sourceEmpty() {
    return this.#source === null;
  }

  targetsEmpty() {
    return this.#targets.length === 0;
  }

  expandIds() {
    if (this.sourceEmpty()) {
      return [...this.#targets];
    }
    return [this.#source, ...this.#targets];
  }

  onLink(fn) {
    this.#callback = fn;
  }

  reset() {
    this.#source = null;
    this.#targets = [];
  }
}

export default Linker;
