import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { CheckCircle2 } from "lucide-react";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalPaid: number;
  orderTimestamp: string;
}

export function ReceiptModal({
  isOpen,
  onClose,
  totalPaid,
  orderTimestamp,
}: ReceiptModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="items-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
          <DialogTitle>Order Successful!</DialogTitle>
          <DialogDescription>
            Thank you for your purchase
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Total Paid</span>
            <span>${totalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Order Timestamp</span>
            <span>{orderTimestamp}</span>
          </div>
        </div>
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
