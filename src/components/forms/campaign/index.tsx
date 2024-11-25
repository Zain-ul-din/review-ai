"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const campaignFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name field is required."
  })
});

type Campaign = z.infer<typeof campaignFormSchema>;

export default function CampaignForm() {
  const form = useForm<Campaign>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: ""
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          console.log(data);
        })}
      >
        <div className="grid sm:grid-cols-2">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input placeholder="Enter campaign name" {...field} />
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="mt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
