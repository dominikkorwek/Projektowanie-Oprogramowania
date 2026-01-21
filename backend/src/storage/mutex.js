export class Mutex {
  constructor() {
    this._tail = Promise.resolve();
  }

  /**
   * Runs the given async function exclusively.
   * Ensures calls execute sequentially (simple in-process mutex).
   */
  async runExclusive(fn) {
    const prev = this._tail;
    let release;
    this._tail = new Promise((r) => (release = r));
    await prev;
    try {
      return await fn();
    } finally {
      release();
    }
  }
}

