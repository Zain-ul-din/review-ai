"use client";

import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextureButton } from "@/components/ui/texture-button";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "../ui/dialog";
import confetti from "canvas-confetti";

export default function Campaign() {
  const handleClick = () => {
    const scalar = 2;
    const triangle = confetti.shapeFromPath({
      path: "M0 10 L5 0 L10 10z"
    });
    const square = confetti.shapeFromPath({
      path: "M0 0 L10 0 L10 10 L0 10 Z"
    });
    const coin = confetti.shapeFromPath({
      path: "M5 0 A5 5 0 1 0 5 10 A5 5 0 1 0 5 0 Z"
    });
    const tree = confetti.shapeFromPath({
      path: "M5 0 L10 10 L0 10 Z"
    });

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [triangle, square, coin, tree],
      scalar
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 30
      });

      confetti({
        ...defaults,
        particleCount: 5
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: ["circle"]
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return (
    <main
      className={cn(
        "w-full h-[100svh] bg-gradient-to-bl from-indigo-100/90  via-pink-200/60 to-indigo-200/80",
        "flex justify-center items-center p-4"
      )}
    >
      <div
        className={cn(
          "max-w-[550px]",
          "rounded-lg  w-full bg-gradient-to-bl from-background via-background/80 to-background",
          "border-2 p-6 sm:p-12 relative",
          "space-y-6"
        )}
      >
        <h1 className="text-2xl flex items-center gap-2">
          <Avatar>
            <AvatarImage src="/temp/orbisdev-logo.png" alt="orbisdev logo" />
          </Avatar>
          OrbisDev
        </h1>

        {/* <p className="text-2xl text-center py-8">
          Thank You for Your Feedback! 🙌
        </p> */}

        <p className="text-lg md:text-xl px-1">
          We’d love to hear your thoughts! Help us improve by sharing your
          experience with OrbisDev.
        </p>

        <div className="flex">
          <div className="mx-auto">
            <Dialog
              onOpenChange={(open) => {
                if (!open) handleClick();
              }}
            >
              <DialogTrigger>
                <TextureButton>Submit reviews</TextureButton>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className="sr-only">
                  Submit Review Dialog
                </DialogTitle>
                <FeedbackForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* <FeedbackForm /> */}
        {/* <h1>OrbisDev</h1> */}
      </div>
    </main>
  );
}

export const FeedbackForm = () => {
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
      <form className="space-y-8">
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
