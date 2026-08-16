import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router's client-side navigation doesn't reset scroll position like a
// full page load does — without this, clicking a link partway down a page
// lands you at that same scroll offset on the new page.
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
