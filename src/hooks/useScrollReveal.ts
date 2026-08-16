import { useEffect, useRef } from 'react';

// Adds a `.is-visible` class the first time the element scrolls into view —
// index.css pairs `.reveal` (initial hidden state) with `.reveal.is-visible`
// (the transitioned-in state) so this hook only ever needs to toggle one class.
//
// Safety net: a static screenshot/crawler/print of the page never scrolls,
// so IntersectionObserver legitimately never fires for below-the-fold
// sections — without a fallback they'd stay invisible forever (still taking
// up layout space, which reads as "missing content"). The timeout reveals
// everything a few seconds after mount regardless, which is long enough to
// not interfere with the fade-in for anyone actually scrolling normally.
export function useScrollReveal<T extends HTMLElement>(fallbackDelayMs = 2500) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      el.classList.add('is-visible');
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    const fallback = window.setTimeout(reveal, fallbackDelayMs);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [fallbackDelayMs]);

  return ref;
}
