function isScrollable(el) {
  if (!el || el === document.body) return false;

  const style = getComputedStyle(el);

  const canScrollY =
    (style.overflowY === 'auto' ||
     style.overflowY === 'scroll') &&
    el.scrollHeight > el.clientHeight;

  return canScrollY;
}


function findScrollableParent(startEl) {
  let el = startEl;

  while (el && el !== document.body) {
    if (isScrollable(el)) return el;
    el = el.parentElement;
  }

  return null;
}


function applyScroll(el, deltaY) {
  const prev = el.scrollTop;
  el.scrollTop += deltaY;

  return el.scrollTop !== prev;
}

export function scrollNearestAncestor(e) {
  if (e.ctrlKey || e.metaKey) return;

  e.preventDefault();

  const delta =
    e.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? e.deltaY * 16
      : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? e.deltaY * window.innerHeight
      : e.deltaY;

  let el = findScrollableParent(e.target);

  while (el) {
    const derivedDelta = delta/(e.shiftKey ? 0.75 : 2);
    if (applyScroll(el, derivedDelta)) return;
    el = findScrollableParent(el.parentElement);
  }
}