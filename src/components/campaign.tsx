"use client";
import { cn } from "@/lib/utils";
import { Form, FormField, FormItem, FormLabel } from "./ui/form";
import { useForm } from "react-hook-form";
import { Star } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { TextureButton } from "./ui/texture-button";

export default function Campaign() {
  const form = useForm();
  return (
    <main
      className={cn(
        "w-full h-[100svh] bg-gradient-to-bl from-indigo-100/90  via-pink-200/60 to-indigo-200/80",
        "flex justify-center items-center p-4"
      )}
    >
      <div
        className={cn(
          "rounded-lg max-w-screen-sm w-full bg-gradient-to-bl from-background via-background/80 to-background",
          "border-2 p-6 sm:p-12 relative"
        )}
      >
        {/* <h1>OrbisDev</h1> */}

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
      </div>
    </main>
  );
}
