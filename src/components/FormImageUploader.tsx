"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type FormImageUploaderProps = {
  value?: File | string | null;
  onChange: (file: File) => void;
  placeholder?: string;
  className?: string;
};

const hostUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "";

export default function FormImageUploader({
  value,
  onChange,
  placeholder = "Drag & drop a file here or click to upload",
  className = "",
}: FormImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    setIsLoading(true);

    if (typeof value === "string") {
      const isAbsoluteUrl = value.startsWith("http") || value.startsWith("data:");
      const url = isAbsoluteUrl ? value : `${hostUrl}${value}`;
      setPreview(url);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    }
  }, [value]);

  const handleFile = useCallback(
    (file: File) => {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    },
    [onChange]
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={`max-w-md mt-4 ${className}`}>
      <div
        role="presentation"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors relative"
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {preview ? (
          <>
            <Image
              src={preview}
              alt="Profile Preview"
              width={128}
              height={128}
              className="w-35 h-35 rounded-md object-cover border"
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setPreview(null);
              }}
              unoptimized // Optional for local/intranet image URLs
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-md">
                <svg
                  className="animate-spin text-[#87C232]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width={32}
                  height={32}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            )}
          </>
        ) : isLoading ? (
          <svg
            className="animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={40}
            height={40}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          <>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 1024 1024"
              className="text-4xl text-gray-400"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
            </svg>
            <p className="text-gray-400 mt-1 text-center text-sm">{placeholder}</p>
          </>
        )}
      </div>
    </div>
  );
}
