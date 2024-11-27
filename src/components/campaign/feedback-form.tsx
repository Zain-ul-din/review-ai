import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import { TextureButton } from "../ui/texture-button";
import { cn } from "@/lib/utils";

export const FeedbackForm = ({ className }: { className?: string }) => {
  const form = useForm();

  const handleClick = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"]
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"]
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"]
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <Form {...form}>
      <form className={cn("space-y-8", className)}>
        <FormField
          name="rating"
          control={form.control}
          render={() => {
            return (
              <FormItem className="space-y-4">
                <FormLabel className="text-2xl font-medium">
                  Overall Rating
                </FormLabel>

                <div className="flex gap-4">
                  {new Array(5).fill(0).map((v, i) => {
                    return (
                      <span
                        key={i}
                        className={cn(
                          "bg-muted p-2 border cursor-pointer border-muted-foreground/40 rounded-md"
                        )}
                        onClick={() => {
                          if (i == 4) handleClick();
                        }}
                      >
                        <Star
                          className={cn(
                            i < 4 && "text-yellow-500 fill-yellow-300"
                          )}
                        />
                      </span>
                    );
                  })}
                </div>
              </FormItem>
            );
          }}
        />

        <FormField
          name="title"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel className="text-lg">Review title</FormLabel>
              <Input placeholder="Example: Easy to use" className="py-6" />
            </FormItem>
          )}
        />

        <FormField
          name="review"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel className="text-lg">Review</FormLabel>
              {/* <div className="flex flex-wrap items-end text-lg ">
                Since bought this{" "}
                <input
                  placeholder="product"
                  className="ml-2 outline-0 text-inherit w-[100px] focus:border-b"
                />{" "}
                im feeling happy.
              </div> */}
              <Textarea
                placeholder="Example: This product exceeded my expectations! Great quality and fast shipping."
                className="py-4 max-h-[200px]"
              />
            </FormItem>
          )}
        />

        <TextureButton size="lg">Submit</TextureButton>
      </form>
    </Form>
  );
};
