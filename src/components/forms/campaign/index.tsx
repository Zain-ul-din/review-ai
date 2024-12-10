"use client";
import { CampaignIntro } from "@/components/campaign/intro";
import { FeedbackForm } from "@/components/campaign/feedback-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Edit, Eye } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { usePagination } from "react-use-pagination";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  campaignFormSchema,
  CampaignFormType,
} from "@/shared/definitions/campaign";

import { createCampaign, updateCampaign } from "@/server/actions/campaign";
import { MetadataForm } from "./metadata";
import { CampaignType } from "@/types";

export default function CampaignForm({
  defaultValues,
}: {
  defaultValues?: CampaignType;
}) {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  const user = useUser();

  const formRef = useRef<HTMLFormElement>(null);

  const {
    currentPage,
    nextEnabled,
    setPreviousPage,
    previousEnabled,
    setNextPage,
  } = usePagination({
    totalItems: 3,
    initialPageSize: 1,
  });

  const form = useForm<CampaignFormType>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      ratingComponentType: "star",
    },
  });

  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (user.user) {
      form.setValue(
        "ctaText",
        `We’d love to hear your thoughts! Help us improve by sharing your experience with ${user.user?.fullName}.`
      );
    }
  }, [user.user]);

  return (
    <div
      className="relative min-h-[100svh] flex items-center"
      style={{
        background: "var(--pink-indigo)",
      }}
    >
      {currentPage > 0 && (
        <>
          <div className="top-0 px-4 max-sm:text-sm text-center w-full py-4 bg-background absolute flex justify-center">
            <Eye className="mr-1" />
            This is how the preview page appears to end users.
          </div>
        </>
      )}
      {(() => {
        switch (currentPage) {
          case 0:
            return (
              <MetadataForm
                handleSubmit={(data) => {
                  setNextPage();
                  Object.entries(data).map(([key, value]) => {
                    form.setValue(key as keyof typeof data, value);
                  });
                }}
                defaultValues={{
                  name: form.watch("name"),
                  description: form.watch("description"),
                }}
                ref={formRef}
                editable={defaultValues !== undefined}
              />
            );
          case 1:
            return (
              <CampaignIntro
                orgName={user.user?.fullName || ""}
                avatar={user.user?.imageUrl || ""}
                ctaText={form.watch("ctaText")}
                onFeedbackBtnClick={() => {
                  setNextPage();
                }}
              />
            );
          case 2:
            return (
              <div className="max-w-lg mx-auto  w-full p-2">
                <FeedbackForm
                  className="bg-card rounded-lg border p-4"
                  ratingComponent={form.watch("ratingComponentType")}
                  readonly
                />
              </div>
            );
          default:
            return <>not found</>;
        }
      })()}

      {/* tray */}
      <div
        className={
          "absolute flex items-center gap-2 md:gap-4 z-10 bottom-10 p-2 rounded-lg bg-background left-1/2 -translate-x-1/2 border"
        }
      >
        <Button
          size={"icon"}
          variant={"outline"}
          disabled={!previousEnabled}
          onClick={() => setPreviousPage()}
        >
          <ArrowLeft />
        </Button>
        {currentPage > 0 && (
          <>
            <span>|</span>
            <Popover open={true}>
              <PopoverTrigger>
                <Button size={"icon"} onClick={() => setIsPopOverOpen(true)}>
                  <Edit />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={cn(
                  "mb-4 md:mb-6 w-[20rem] max-w-full space-y-4",
                  !isPopOverOpen && "hidden"
                )}
              >
                <Form {...form}>
                  <form>
                    <FormField
                      name="ctaText"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <Textarea
                            placeholder="type your text here"
                            className={cn(
                              "max-h-[300px] min-h-[80px]",
                              currentPage != 1 && "hidden"
                            )}
                            {...field}
                          />
                        );
                      }}
                    />

                    <FormField
                      name="ratingComponentType"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem
                            className={cn(currentPage != 2 && "hidden")}
                          >
                            <FormLabel>Rating Component</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Rating Component" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="star">Rating</SelectItem>
                                <SelectItem value="emoji">Emoji</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        );
                      }}
                    />
                  </form>
                </Form>

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
          </>
        )}
        <span>|</span>
        <Button
          type="button"
          size={"icon"}
          variant={"outline"}
          onClick={() => {
            if (currentPage == 0) {
              formRef.current?.requestSubmit();
            } else {
              setNextPage();
            }
          }}
          disabled={!nextEnabled}
        >
          <ArrowRight />
        </Button>
        {!nextEnabled && (
          <>
            <span>|</span>
            <Button
              className="text-xl"
              onClick={() => {
                form.handleSubmit((data) => {
                  if (defaultValues) {
                    // submit edit request
                    startTransition(async () => {
                      await updateCampaign(defaultValues._id as string, data);
                    });
                  } else {
                    startTransition(async () => {
                      await createCampaign(data);
                    });
                  }
                })();
              }}
              disabled={nextEnabled || loading}
              isLoading={loading}
            >
              Submit
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
