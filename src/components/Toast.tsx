export default function Toast({ message }: { message: string | null }) {
  return (
    <div className={`toast ${message ? "is-shown" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
