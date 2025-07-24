"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { useCreateShortUrl } from "@/api/urls/index";
import { CreateShortUrlInput, createShortUrlSchema } from "@/api/urls/constants";

export function ShortenerDialog() {
    const [open, setOpen] = useState(false);
    const [passwordEnabled, setPasswordEnabled] = useState(false);
    const { mutateAsync: createShortUrl } = useCreateShortUrl();
    const form = useForm<CreateShortUrlInput>({
        resolver: zodResolver(createShortUrlSchema),
        defaultValues: {
            longUrl: "",
            shortCode: "",
            description: "",
            password: "",
        },
    });

    async function onSubmit(data: CreateShortUrlInput) {
        await createShortUrl(data);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="size-4 mr-2" />
                    Create Short Link
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogTitle />
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                        <FormField
                            control={form.control}
                            name="longUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2">
                                        Original URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://example.com/very/long/url"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="shortCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel >
                                        Custom Short Code <span className="text-xs text-muted-foreground">(optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="my-brand"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Description <span className="text-xs text-muted-foreground">(optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add a description for your short link (optional)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Separator />
                        <div className="rounded border p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="password-protection">Password Protection</Label>
                                    <Label htmlFor="password-protection" className="text-sm text-muted-foreground">Require a password to access this link</Label>
                                </div>
                                <Switch
                                    id="password-protection"
                                    checked={passwordEnabled}
                                    onCheckedChange={setPasswordEnabled}
                                />
                            </div>
                            {passwordEnabled && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant='outline'>Cancel</Button>
                            </DialogClose>
                            <Button loading={form.formState.isSubmitting} type="submit">
                                Create Link
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
