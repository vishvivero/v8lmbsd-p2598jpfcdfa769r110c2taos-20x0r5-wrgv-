import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Cookie Consent</h3>
                <p className="text-gray-600 text-sm">
                  We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                  <Button variant="link" className="text-primary p-0 h-auto" onClick={() => window.open("/privacy", "_blank")}>
                    Learn more
                  </Button>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleDecline}>
                  Decline
                </Button>
                <Button onClick={handleAccept}>
                  Accept All
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 md:hidden"
                onClick={handleDecline}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};