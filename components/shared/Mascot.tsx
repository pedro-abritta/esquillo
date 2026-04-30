import { Squirrel } from "lucide-react";

interface MascotProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 80,
};

export function Mascot({ size = "md" }: MascotProps) {
  return (
    <div className="flex justify-center">
      <Squirrel
        size={sizeMap[size]}
        className="text-primary opacity-80"
        strokeWidth={1.5}
      />
    </div>
  );
}
