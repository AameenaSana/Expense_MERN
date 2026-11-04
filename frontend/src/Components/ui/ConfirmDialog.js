import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from './Modal'
import { Button } from './Button'

function ConfirmDialog({title, message, confirmLabel = 'Delete', onConfirm, onClose}) {
    const [busy, setBusy] = useState(false)

    const handleConfirm = async () => {
        setBusy(true)
        await onConfirm()
        setBusy(false)
        onClose()
    }

    return (
        <Modal title={title} onClose={busy ? () => {} : onClose} width={420}>
            <Message>{message}</Message>
            <Actions>
                <Button $variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
                <Button $variant="danger" onClick={handleConfirm} disabled={busy} data-autofocus>
                    {busy ? 'Deleting…' : confirmLabel}
                </Button>
            </Actions>
        </Modal>
    )
}

const Message = styled.p`
    color: var(--text-muted);
    margin-bottom: 1.5rem;
`;

const Actions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: .75rem;
`;

export default ConfirmDialog
