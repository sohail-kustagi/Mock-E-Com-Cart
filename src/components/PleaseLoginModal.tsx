import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface PleaseLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export function PleaseLoginModal({
  isOpen,
  onClose,
  onLoginClick,
}: PleaseLoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You must be logged in</DialogTitle>
          <DialogDescription>
            Please log in to your account to add items to your cart and make purchases.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onLoginClick}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
