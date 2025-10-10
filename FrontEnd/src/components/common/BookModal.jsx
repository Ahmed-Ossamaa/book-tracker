import { BaseModal } from './BaseModal';


export const BookModal = ({ isOpen, onClose, title, children }) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="md"
            showCloseButton={true}
            closeOnBackdrop={true}
            closeOnEsc={true}
        >
            {children}
        </BaseModal>
    );
};