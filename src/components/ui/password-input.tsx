'use client';

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PasswordInput({ value, onChange }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={value}
                onChange={onChange}
                className="pr-10"
            />
            <div
                className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                onClick={togglePasswordVisibility}
            >
                {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                )}
            </div>
        </div>
    );
}

export default PasswordInput;
