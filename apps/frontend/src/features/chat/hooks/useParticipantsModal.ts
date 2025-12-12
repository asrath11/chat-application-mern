import { useState } from 'react';

export function useParticipantsModal() {
    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    const handleSubmit = (
        e: React.FormEvent,
        onSubmit: (userIds: string[]) => void
    ) => {
        e.preventDefault();

        if (selectedUsers.length === 0) {
            return;
        }

        onSubmit(selectedUsers);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setSelectedUsers([]);
        }
    };

    const closeModal = () => {
        setOpen(false);
        setSelectedUsers([]);
    };

    return {
        open,
        setOpen,
        selectedUsers,
        setSelectedUsers,
        handleSubmit,
        handleOpenChange,
        closeModal,
    };
}