'use client';

import { Container, MagneticButton } from '@/components';
import { archiveOptions } from '@/data';

import { archivePill } from './classes';
import { ArchiveRow, ArchiveSection, Count } from './index.styled';
import { usePillMotion } from './use-pill-motion';

/**
 * Reference section.center-grid-btn-archive: the dark "Archive" pill under
 * the list, with the number of archived projects beside it. It is a link to
 * the archive page, so it only shows once archiveOptions has rows; until then
 * the section keeps its space under the list and stays empty.
 */
export function WorkArchive() {
  const bind = usePillMotion('archive');
  const count = archiveOptions.length;

  if (!count) return <ArchiveSection data-work-archive />;

  return (
    <ArchiveSection data-work-archive>
      <Container>
        <ArchiveRow>
          <MagneticButton
            href='/archive'
            data-archive-button
            strength={25}
            textStrength={15}
            nowrap
            whileHover={{ scale: 1 }}
            className={archivePill}
            {...bind('archive')}
          >
            Archive
            <Count data-count>{count}</Count>
          </MagneticButton>
        </ArchiveRow>
      </Container>
    </ArchiveSection>
  );
}
