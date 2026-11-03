import { MotionProvider } from './motion';
import { OffcanvasProvider } from './offcanvas';
import { StyledComponentsRegistry } from './styled-components';

export { useOffcanvas } from './offcanvas';

/** @param {import('react').PropsWithChildren<unknown>} */
export function Providers({ children }) {
  return (
    <StyledComponentsRegistry>
      <MotionProvider>
        <OffcanvasProvider>{children}</OffcanvasProvider>
      </MotionProvider>
    </StyledComponentsRegistry>
  );
}
