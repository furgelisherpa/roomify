import { useEffect, useState } from "react";
import { Box, LogIn, ShieldCheck, Zap, X } from "lucide-react";
import { Button } from "./ui";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => Promise<void>;
}

export default function AuthModal({ isOpen, onClose, onSignIn }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await onSignIn();
      onClose();
    } catch (error) {
      console.error("Auth failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-modal" onClick={onClose}>
      <div className="panel auth-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="logo-box">
            <ShieldCheck className="logo-icon" />
          </div>
          <h3>Secure Authentication</h3>
          <p>Sign in to save your designs and access high-performance AI rendering.</p>
        </div>

        <div className="auth-body">
          <div className="features-grid">
            <div className="feature-item">
              <Zap className="h-4 w-4 text-orange-500" />
              <span>Unlimited Renders</span>
            </div>
            <div className="feature-item">
              <Box className="h-4 w-4 text-blue-500" />
              <span>Cloud Projects</span>
            </div>
          </div>

          <Button className="submit-btn" onClick={handleSignIn} disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? "Connecting..." : "Continue with Puter"}
          </Button>

          <button className="cancel-text" onClick={onClose}>
            Maybe later
          </button>
        </div>

        <div className="auth-footer">
          <p>By continuing, you agree to our terms and privacy policy.</p>
        </div>
      </div>
    </div>
  );
}
