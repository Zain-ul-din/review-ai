import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

const DashboardLayout = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => (
  <div
    {...props}
    className={cn("mt-12 p-6 md:p-8 max-w-screen-xl mx-auto", props.className)}
    ref={ref}
  >
    {props.children}
  </div>
));

DashboardLayout.displayName = "DashboardLayout";
export default DashboardLayout;
