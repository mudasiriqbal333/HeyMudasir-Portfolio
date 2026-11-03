import { SubTitle } from './index.styled';

/** @param {import('react').PropsWithChildren<unknown>} props */
export function ThumbnailLabel({ children }) {
  return (
    <SubTitle>
      <div>
        <h5>{children}</h5>
      </div>
    </SubTitle>
  );
}
