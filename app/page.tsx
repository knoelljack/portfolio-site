import { Story } from '@/components/story/Story';
import { NameBeat } from '@/components/story/NameBeat';
import { WorkBeat } from '@/components/story/WorkBeat';
import { SystemsBeat } from '@/components/story/SystemsBeat';
import { Contact } from '@/components/story/Contact';

export default function Home() {
  return (
    <>
      <Story>
        <NameBeat />
        <WorkBeat />
        <SystemsBeat />
      </Story>
      <Contact />
    </>
  );
}
