"use client";

import * as React from "react";
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction,} from "@/components/ui/alert-dialog";
import Image from "next/image";
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent,} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Import } from "lucide-react";

interface ConfirmOnCloseDialogProps {
  title: string;
  children: React.ReactNode;
  confirmReset: {
    shouldConfirm: () => boolean;
    onConfirm: () => void;
  };
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  triggerClassName?: string;
}


export const ConfirmOnCloseDialog: React.FC<ConfirmOnCloseDialogProps> = ({
  title,
  children,
  confirmReset,
  isOpen,
  setIsOpen
}) => {
  const isDialogOpen = isOpen;
  const [showCloseConfirm, setShowCloseConfirm] = React.useState(false);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      if (confirmReset?.shouldConfirm?.()) {
        setShowCloseConfirm(true);
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleConfirmClose = () => {
    confirmReset?.onConfirm?.();
    setShowCloseConfirm(false);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-center p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <Image
                    src="/icons/import.png"
                    alt="Import CSV File"
                    width={20}
                    height={20}
                    className="inline-block cursor-pointer"
                  />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Import CSV</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent
          onEscapeKeyDown={handleClose}
          showClose={true}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-h-[95vh] gap-0 overflow-visible w-[70vw] rounded-lg p-0 bg-card"
        >
          <DialogHeader className="border-b p-4 shadow-sm h-[45px] rounded-tr-lg rounded-tl-lg flex flex-col items-start justify-center bg-secondary">
            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-card-foreground">
              <Import className="text-green-500"/>
              {title}
            </DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
      <AlertDialog open={showCloseConfirm} onOpenChange={setShowCloseConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Closing this dialog will clear your data. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowCloseConfirm(false);
                setIsOpen(true);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Yes, Close & Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
