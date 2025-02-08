"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

export function AdForms() {
  const formSchema = z.object({
    campaign_name: z.string().min(2, {
      message: "Campaign name must be at least 2 characters.",
    }),
    target_audience: z.string().min(2, {
      message: "Target audience must be at least 2 characters.",
    }),
    platform: z.string().min(2, {
      message: "Platform selection is required.",
    }),
    caption: z.string().min(2, {
      message: "Caption must be at least 2 characters.",
    }),
    visual_descriptions: z.string().min(2, {
      message: "Visual descriptions must be at least 2 characters.",
    }),
    disclaimers: z.string().optional(),
    key_opinion_leader: z.object({
      involved: z.boolean(),
      details: z.string().optional(),
    }),
    classification: z.enum([
      "New Product/Service",
      "Existing Product/Service",
      "Non-Product/Service Related",
      "Campaign",
    ]),
  });
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaign_name: "",
      target_audience: "",
      platform: "",
      caption: "",
      visual_descriptions: "",
      disclaimers: "",
      key_opinion_leader: {
        involved: false,
        details: "",
      },
      classification: "New Product/Service",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="campaign_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter campaign name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="target_audience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="Enter target audience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platfrom" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="edm">
                    Electronic Direct Mail Marketing (eDM)
                  </SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="tiktok">Tiktok</SelectItem>
                  <SelectItem value="youtube">Youtube</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{" "}
                <Link href="/examples/forms">email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Input placeholder="Enter caption" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="visual_descriptions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visual Descriptions</FormLabel>
              <FormControl>
                <Input placeholder="Enter visual descriptions" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disclaimers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disclaimers</FormLabel>
              <FormControl>
                <Input placeholder="Enter disclaimers" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
