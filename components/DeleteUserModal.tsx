import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User } from "@/app/utils/api";
import { useEffect } from "react";

export function DeleteUserModal({ isOpen, onClose, onConfirm, user }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; user: User | null}) {
  if (!user) return null;
    
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi Hapus User dengan id : {user?.id}</DialogTitle>
        </DialogHeader>
        <p>Apakah Anda yakin ingin menghapus data ini?</p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button variant="destructive" onClick={onConfirm}>Hapus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
