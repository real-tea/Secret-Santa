'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { CodeModal } from "./code-modal";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  wishlist: z.string().min(1, {
    message: "Please add at least one wish.",
  }),
});

export function FriendForm() {
  const addFriend = useStore((state) => state.addFriend);
  const [showModal, setShowModal] = useState(false);
  const [currentCode, setCurrentCode] = useState("");
  const [currentName, setCurrentName] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      wishlist: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const friend = {
      id: uuidv4(),
      name: values.name,
      code: code,
      wishlist: values.wishlist.split(',').map(item => item.trim()),
      assignedFriendId: null,
    };
    
    addFriend(friend);
    setCurrentCode(code);
    setCurrentName(values.name);
    setShowModal(true);
    form.reset();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="apna nam" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wishlist"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wishlist (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Kash..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Add Friend</Button>
        </form>
      </Form>

      <CodeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        code={currentCode}
        name={currentName}
      />
    </>
  );
}