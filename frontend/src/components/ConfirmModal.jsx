import Modal from "./Modal";
import CustomButton from "./CustomButton";

export default function ConfirmModal({
  open,
  title = "Confirm action",
  message = "Are you sure?",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  loading,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-green-800">{message}</p>

        <div className="flex justify-center gap-3">
          <CustomButton variant="big_white" onClick={onClose}>
            {cancelLabel}
          </CustomButton>

          <CustomButton
            variant="big_red"
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmLabel}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
