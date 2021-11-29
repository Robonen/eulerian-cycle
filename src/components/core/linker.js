class Linker {
  #source = null;
  #target = null;

  constructor() {}

  get source() {
    return this.#source;
  }

  set source(src) {
    if (this.#source === null) this.#source = src;
  }

  get target() {
    return this.#target;
  }

  set target(trg) {
    if (trg === this.#source) return;
    if (this.#target === null) this.#target = trg;
  }

  sourceEmpty() {
    return this.#source === null;
  }

  targetEmpty() {
    return this.#target === null;
  }

  load() {
    return {
      source: this.#source,
      target: this.#target,
    };
  }

  reset() {
    this.#source = null;
    this.#target = null;
  }
}

export default Linker;
