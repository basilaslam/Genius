"use client";

import * as z from "zod";
import axios from "axios";
import { Code, Divide, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from 'react-markdown'
import { BotAvatar } from "@/components/bot-avatar";
import   Heading  from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";

import { formSchema } from "./constants";
import { Empty } from "@/components/ui/empty";

const CodePage = () => {
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<{ isUser: boolean; message: string; }[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  
  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMessages((current) => [{ isUser: true, message: values.prompt }, ...current]);
      
      const response = await axios.post('/api/code', values);
      console.log(response);
      
      setMessages((current) => [{ isUser: false, message: response.data }, ...current]);
      form.reset();
    } catch (error: any) {
      toast.error("Something went wrong.");
    }
  }

  return ( 
    <div>
      <Heading
        title="Code Generation"
        description="generate code using descriptive text."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 md:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading} 
                        placeholder="Simple toggle button using react hook?" 
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button className="col-span-12 md:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}
          {messages.map((message) => (
            <div 
              key={message.message} 
              className={cn(
                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                message.isUser ? "bg-white border border-black/10" : "bg-muted",
              )}
            >
              {!message.isUser ? <BotAvatar /> : <UserAvatar />}
              <ReactMarkdown components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  )
                }} className="text-sm overflow-hidden leading-7">
                  {message.message || ""}
                </ReactMarkdown>
            </div>
          ))}
        </div>
      </div>
    </div>
   );
}
 
export default CodePage;