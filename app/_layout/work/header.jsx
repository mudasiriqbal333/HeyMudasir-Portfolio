import { ContainerMedium } from '@/components';
import { workHeading } from '@/data';

import { Header, Title } from './index.styled';

/** Reference header.default-header.work-header: the two-line title. */
export function WorkHeader() {
  return (
    <Header data-work-header>
      <ContainerMedium data-once-in>
        <Title data-work-title>
          {workHeading.map((line, index) => (
            <span key={line}>
              {line}
              {index < workHeading.length - 1 ? ' ' : null}
            </span>
          ))}
        </Title>
      </ContainerMedium>
    </Header>
  );
}
