import { useId } from "react";
import { Skeleton } from "../ui/skeleton";

export default function LoadingCards() {
  return (
    <div className="flex flex-col border rounded-lg">
      {Array(3)
        .fill("")
        .map((s) => (
          <div
            className="border-b last:border-none px-6 py-4 space-y-2"
            key={useId()}
          >
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-5/5" />
          </div>
        ))}
    </div>
  );
}
