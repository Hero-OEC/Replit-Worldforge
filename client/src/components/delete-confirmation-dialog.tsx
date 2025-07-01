import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  description?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  itemName,
  description,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  const defaultDescription = `Are you sure you want to delete "${itemName}"? This action cannot be undone and will permanently remove all associated data.`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[var(--color-50)] border border-[var(--color-300)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[var(--color-950)]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--color-700)]">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            className="bg-[var(--color-100)] border border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-200)] hover:text-[var(--color-950)]"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : `Delete ${title.replace('Delete ', '')}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}