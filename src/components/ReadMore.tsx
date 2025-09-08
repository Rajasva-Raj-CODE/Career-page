import { useState } from "react";

interface ReadMoreProps {
  text: string;
  maxLength?: number;
  className?: string;
  showTooltip?: boolean;
}

export function ReadMore({
  text,
  maxLength = 20,
  className = "",
  showTooltip = false,
}: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return <span className="text-muted-foreground">N/A</span>;

  const shouldTruncate = text.length > maxLength;
  const displayText = expanded || !shouldTruncate 
    ? text 
    : `${text.slice(0, maxLength)}...`;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span className="truncate">
        {displayText}
      </span>
      
      {shouldTruncate && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((prev) => !prev);
            }}
            className="text-blue-600 ml-1 text-xs font-medium hover:underline focus:outline-none"
            aria-label={expanded ? "Show less" : "Show more"}
          >
            {expanded ? "less" : "more"}
          </button>
          
          {showTooltip && !expanded && (
            <div className="absolute z-10 left-0 bottom-full mb-2 px-3 py-2 text-sm bg-popover text-popover-foreground rounded-md shadow-lg whitespace-pre-wrap max-w-xs hidden group-hover:block">
              {text}
            </div>
          )}
        </>
      )}
    </div>
  );
}