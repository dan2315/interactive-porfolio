let listeners = [];

let state = {
  visible: false,
  text: "",
  timeoutId: null,
};

function notify() {
  listeners.forEach((l) => l(state));
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
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }

    state = {
      visible: true,
      text,
      timeoutId: setTimeout(() => {
        state = { ...state, visible: false };
        notify();
      }, timeToDisappear),
    };

    notify();
  },

  hide() {
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }

    state = {
      visible: false,
      text: "",
      timeoutId: null,
    };

    notify();
  },
};
