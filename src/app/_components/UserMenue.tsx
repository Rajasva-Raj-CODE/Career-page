"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, CircleUser, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import LoginDialog from "./LoginDialog";

const UserMenue = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(auth === "true");
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <Button 
          className="px-6 py-2 rounded-full bg-gradient-to-r from-[#2c83ec] to-[#87c232] hover:from-[#2c83ec]/90 hover:to-[#87c232]/90 text-white font-semibold transition-all duration-200 shadow-none hover:shadow-none"
          onClick={() => setIsLoginDialogOpen(true)}
        >
          Login
        </Button>
        <LoginDialog
          isOpen={isLoginDialogOpen}
          onClose={() => setIsLoginDialogOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-[#2c83ec]/20 to-[#87c232]/20 border-2 border-[#2c83ec]/30 cursor-pointer hover:border-[#2c83ec]/50 transition-all duration-200">
          <CircleUser className="h-5 w-5 text-[#2c83ec]" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-brand-lg border-slate-200 dark:border-slate-700">
        <DropdownMenuLabel className="text-foreground font-semibold">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="hover:bg-[#2c83ec]/10 focus:bg-[#2c83ec]/10">
          <Link href="/profile" className="flex items-center text-foreground">
            <User className="h-4 w-4 mr-2 text-[#2c83ec]" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-[#2c83ec]/10 focus:bg-[#2c83ec]/10">
          <Link href="/status-tracker" className="flex items-center text-foreground">
            <UserCheck className="h-4 w-4 mr-2 text-[#2c83ec]" /> Status Tracker
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            // window.location.reload();
          }}
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </DropdownMenuItem>
     

      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenue;
