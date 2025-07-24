
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  /**
   * Unique identifier for this ad slot to be used in localStorage.
   */
  adId: string;
  children: ReactNode;
  className?: string;
}

/**
 * A component to display an ad that can be dismissed by the user.
 * The dismissal state is saved to localStorage to prevent it from reappearing.
 */
export function AdSlot({ adId, children, className }: AdSlotProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check localStorage on the client-side to see if the user has already dismissed this ad.
    const dismissed = localStorage.getItem(`ad-dismissed-${adId}`);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, [adId]);

  const handleDismiss = () => {
    // Hide the ad and save the state to localStorage.
    setIsVisible(false);
    localStorage.setItem(`ad-dismissed-${adId}`, "true");
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Card className={cn("relative p-3 bg-secondary/40 border-border/70", className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6"
        onClick={handleDismiss}
        aria-label="Cerrar anuncio"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </Button>
      <div className="text-center">
        {children}
      </div>
    </Card>
  );
}
