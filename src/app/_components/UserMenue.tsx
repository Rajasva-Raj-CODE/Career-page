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
import { LogOut, User, CircleUser } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

const UserMenue = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(auth === "true");
  }, []);

  if (!isLoggedIn) {
    return (
      <Link href="/auth">
        <Button className="px-4 py-2 rounded-full">Login</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
          <CircleUser className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 rounded-lg shadow-lg">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenue;
