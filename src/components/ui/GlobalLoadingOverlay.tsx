
import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useLocation, useNavigationType } from "react-router-dom";
import { cn } from "@/lib/utils";

export function GlobalLoadingOverlay() {
  const [show, setShow] = useState(false);
  // Use refs & navigation events to show loader on page navigation
  const location = useLocation();
  const navigationType = useNavigationType();
  const timer = useRef<number | undefined>();

  useEffect(() => {
    setShow(true);
    // Always show for at least 300ms (prevents flashes)
    timer.current = window.setTimeout(() => setShow(false), 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [location]);

  // Optionally, only show overlay for PUSH/REPLACE, not POP (back button etc)
  if (!show) return null;

  return (
    <div
      aria-label="Loading overlay"
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm transition-opacity duration-200 bg-black/50",
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      role="alert"
    >
      <div className="p-6 rounded-xl bg-background/90 shadow-xl flex flex-col items-center gap-3 animate-scale-in"
        style={{ minWidth: 180 }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" data-testid="global-spinner" />
        <span className="font-semibold text-lg text-primary">Loading...</span>
      </div>
    </div>
  );
}
