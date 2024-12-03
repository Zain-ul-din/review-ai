import { Loader } from "lucide-react";

export default function loading() {
  return (
    <div className="w-full h-[100svh] flex justify-center items-center">
      <Loader className="animate-spin" />
    </div>
  );
}
