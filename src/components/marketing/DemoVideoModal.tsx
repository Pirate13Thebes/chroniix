import { Modal } from '../common/Modal';

interface DemoVideoModalProps {
  onClose: () => void;
}

export function DemoVideoModal({ onClose }: DemoVideoModalProps) {
  return (
    <Modal title="See Chronix in Action" onClose={onClose}>
      <video
        controls
        autoPlay
        muted
        loop
        src="/videos/demo.mp4"
        style={{ width: '100%', borderRadius: 8, display: 'block' }}
      />
    </Modal>
  );
}
