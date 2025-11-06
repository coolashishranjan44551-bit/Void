interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export function PrivacyModal({ open, onClose }: PrivacyModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 px-4">
      <div className="max-w-lg rounded-3xl bg-surface p-6 text-sm text-accentSoft shadow-2xl">
        <h3 className="text-xl font-semibold text-white">Privacy</h3>
        <p className="mt-3">
          This app offers wellness guidance and is not medical advice. Your preferences and journals stay on this device. We do
          not track personal health data or send it anywhere.
        </p>
        <p className="mt-3">
          Notifications are optional and you can disable them anytime in your browser settings. For urgent help, contact your
          local emergency services or a trusted professional.
        </p>
        <button
          onClick={onClose}
          className="mt-6 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background transition hover:bg-accentSoft"
        >
          Close
        </button>
      </div>
    </div>
  );
}
