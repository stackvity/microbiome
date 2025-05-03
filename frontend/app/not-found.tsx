// frontend/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

/**
 * Custom 404 Not Found page for the Next.js App Router.
 */
export default function NotFound() {
  return (
    // Verification A.5: Renders basic structure consistent with root layout expectations.
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background p-4 text-center">
      <SearchX className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        404 - Page Not Found
      </h1>
      <p className="max-w-md text-muted-foreground">
        Sorry, we couldn't find the page you were looking for.
      </p>
      <Button asChild>
        <Link href="/">Go back Home</Link>
      </Button>
    </div>
  );
}
