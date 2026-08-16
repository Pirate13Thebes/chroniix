import { useState } from 'react';
import { Modal } from '../common/Modal';
import { FormField } from '../common/FormField';
import { AvatarUpload } from '../common/AvatarUpload';
import { useStoreActions } from '../../hooks/useStore';
import type { Employee } from '../../types';

export function EditProfileModal({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const { updateEmployee } = useStoreActions();
  const [firstName, setFirstName] = useState(employee.firstName);
  const [lastName, setLastName] = useState(employee.lastName);
  const [phone, setPhone] = useState(employee.phone);
  const [avatarUrl, setAvatarUrl] = useState(employee.avatarUrl);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateEmployee({ ...employee, firstName, lastName, phone, avatarUrl });
    onClose();
  }

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <AvatarUpload src={avatarUrl} name={`${firstName} ${lastName}`} size={80} onChange={setAvatarUrl} />
        </div>
        <div className="responsive-grid-1-1">
          <FormField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <FormField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>
        <FormField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary-navy">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
