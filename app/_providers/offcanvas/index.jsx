'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const OffcanvasContext = createContext({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

/** @param {import('react').PropsWithChildren<unknown>} */
export function OffcanvasProvider({ children }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen(previous => !previous), []);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return (
    <OffcanvasContext.Provider value={value}>
      {children}
    </OffcanvasContext.Provider>
  );
}

/** Open/close state of the off-canvas menu, shared by the toggle and the top bar. */
export function useOffcanvas() {
  return useContext(OffcanvasContext);
}
