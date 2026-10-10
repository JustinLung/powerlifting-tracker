import { Alert } from "@/components/ui/alert";

export function NotConnected() {
  return (
    <Alert tone="info" title="Not connected yet">
      The form is valid, but there is no account backend yet, so nothing was sent.
    </Alert>
  );
}
