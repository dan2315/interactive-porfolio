let listeners = [];

let state = {
  visible: false,
  text: "",
};

let queue = [];
let timeoutId = null;

function notify() {
  listeners.forEach((l) => l(state));
}

function internalShowNext() {
  if (queue.length === 0) {
    state = { visible: false, text: "" };
    notify();
    return;
  }

  const { text, timeToDisappear } = queue.shift();

  state = { visible: true, text };
  notify();

  timeoutId = setTimeout(() => {
    state = { visible: false, text };
    notify();
    timeoutId = null;
    internalShowNext();
  }, timeToDisappear);
}

export const assistant = {
  subscribe(fn) {
    listeners.push(fn);
    fn(state);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },

  say({ text, timeToDisappear = 3000 }) {
    queue.push({ text, timeToDisappear });

    if (!state.visible && !timeoutId) {
      internalShowNext();
    }
  },

  hide() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    queue = [];
    state = { visible: false, text: "" };
    notify();
  },

  showNext() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    internalShowNext();
  },

  getQueue() {
    return queue.slice();
  }
};
