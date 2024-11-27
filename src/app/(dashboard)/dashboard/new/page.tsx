"use client";
import Campaign from "@/components/campaign";
import { FeedbackForm } from "@/components/campaign/feedback-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Edit } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePagination } from "react-use-pagination";

const formSchema = z.object({
  ctaText: z.string().min(1, { message: "CTA text should be less than " })
});

type FormType = z.infer<typeof formSchema>;

export default function NewCampaignPage() {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);

  const {
    currentPage,
    nextEnabled,
    setPreviousPage,
    previousEnabled,
    setNextPage
  } = usePagination({
    totalItems: 2,
    initialPageSize: 1
  });

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema)
  });

  return (
    <div className="relative min-h-[100svh] flex items-center">
      {(() => {
        switch (currentPage) {
          case 0:
            return (
              <Campaign
                ctaText={
                  form.watch("ctaText") ||
                  `We’d love to hear your thoughts! Help us improve by sharing your
            experience with OrbisDev.`
                }
                onFeedbackBtnClick={() => {
                  alert("someone clicked me");
                }}
              />
            );
          case 1:
            return (
              <div className="max-w-lg mx-auto w-full p-2">
                <FeedbackForm className="bg-card border p-4" />
              </div>
            );
          default:
            return <>not found</>;
        }
      })()}

      {/* tray */}
      <div className="absolute flex items-center gap-4 z-10 bottom-10 p-2 rounded-lg bg-background left-1/2 -translate-x-1/2 border">
        <Button
          size={"icon"}
          variant={"outline"}
          disabled={!previousEnabled}
          onClick={() => setPreviousPage()}
        >
          <ArrowLeft />
        </Button>
        <span>|</span>
        <Popover open={true}>
          <PopoverTrigger>
            <Button size={"icon"} onClick={() => setIsPopOverOpen(true)}>
              <Edit />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn(
              "mb-6 w-[20rem] max-w-full space-y-4",
              !isPopOverOpen && "hidden"
            )}
          >
            <FormField
              name="ctaText"
              control={form.control}
              render={({ field }) => {
                return (
                  <Textarea
                    placeholder="type your text here"
                    className={cn(
                      "max-h-[300px]",
                      currentPage != 0 && "hidden"
                    )}
                    {...field}
                  />
                );
              }}
            />

            {/* <FormField 
              
            /> */}

            <div className="w-full flex">
              <Button
                className="ml-auto"
                onClick={() => setIsPopOverOpen(false)}
              >
                Close
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <span>|</span>
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => {
            setNextPage();
          }}
          disabled={!nextEnabled}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
