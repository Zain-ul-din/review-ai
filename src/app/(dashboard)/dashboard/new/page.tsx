// import CampaignForm from "@/components/forms/campaign";
"use client";
import Campaign from "@/components/campaign";
import { FeedbackForm } from "@/components/campaign/feedback-form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Edit } from "lucide-react";

export default function NewCampaignPage() {
  return (
    <div className="relative min-h-[100svh] flex items-center">
      {/* <Campaign
        ctaText={`We’d love to hear your thoughts! Help us improve by sharing your
          experience with OrbisDev.`}
        onFeedbackBtnClick={() => {
          alert("someone clicked me");
        }}
      /> */}

      <div className="max-w-lg mx-auto w-full p-2">
        <FeedbackForm className="bg-card border p-4" />
      </div>

      {/* tray */}
      <div className="absolute flex items-center gap-4 z-10 bottom-10 p-2 rounded-lg bg-background left-1/2 -translate-x-1/2 border">
        <Button size={"icon"}>
          <Popover>
            <PopoverTrigger>
              <Edit />
            </PopoverTrigger>
            <PopoverContent className="mb-6 w-[20rem] max-w-full">
              <Textarea
                placeholder="type your text here"
                className="max-h-[300px] "
              />
            </PopoverContent>
          </Popover>
        </Button>
        <span>|</span>
        <Button size={"icon"} variant={"outline"}>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
