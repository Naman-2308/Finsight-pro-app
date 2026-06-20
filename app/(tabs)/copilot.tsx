// Redirect stale navigations to home — copilot is now a modal at app/copilot.tsx
import { Redirect } from "expo-router";
export default function CopilotRedirect() {
  return <Redirect href="/home" />;
}
