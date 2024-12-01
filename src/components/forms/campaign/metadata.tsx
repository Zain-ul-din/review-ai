import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { composedCampaignSchema } from "@/shared/definitions/campaign";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, HtmlHTMLAttributes } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormType = z.infer<typeof composedCampaignSchema.metadata>;

interface Props extends HtmlHTMLAttributes<HTMLFormElement> {
  handleSubmit: (data: FormType) => void;
  defaultValues: FormType;
  editable?: boolean;
}

export const MetadataForm = forwardRef<HTMLFormElement, Props>(
  ({ editable, handleSubmit, defaultValues, ...rest }, ref) => {
    const form = useForm<FormType>({
      resolver: zodResolver(composedCampaignSchema.metadata),
      defaultValues,
    });

    return (
      <>
        <div className="max-w-lg mx-auto w-full p-2">
          <div className="bg-card rounded-md border p-4 space-y-6">
            <h2 className="text-2xl">
              {editable ? <>Edit Campaign</> : <>Create New Campaign</>}
            </h2>

            <Form {...form}>
              <form
                {...rest}
                ref={ref}
                className={cn("space-y-6", rest.className)}
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <Input placeholder="name your campaign" {...field} />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                          placeholder="short description about your campaign"
                          className="max-h-[500px]"
                          {...field}
                        />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          </div>
        </div>
      </>
    );
  }
);

MetadataForm.displayName = "MetadataForm";
