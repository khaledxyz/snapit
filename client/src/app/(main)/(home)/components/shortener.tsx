"use client"

import { useCreateShortUrl } from "@/api/urls"
import { ShortUrl } from "@/api/urls/constants"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { zodResolver } from "@hookform/resolvers/zod"
import { Copy, LinkIcon, Zap } from "lucide-react"
import Link from "next/link"
import { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    longUrl: z.string().url('Please enter a valid URL')
})

const defaultValues = {
    longUrl: "",
}

export function Shortener() {
    const [, copy] = useCopyToClipboard()
    const [shortenedUrls, setShortenedUrls] = useState<ShortUrl[]>([])
    const [storedUrls] = useLocalStorage('shortenedUrls', [])
    const { mutateAsync: createShortUrl } = useCreateShortUrl()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    useEffect(() => {
        setShortenedUrls(storedUrls)
    }, [storedUrls])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const url = await createShortUrl(values);
        setShortenedUrls((prev) => [...prev, url])
        form.reset()
    }

    return (
        <Card className="shadow-lg mb-10">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="longUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-1">
                                        <LinkIcon size={14} />
                                        Enter your long URL
                                    </FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="https://example.com/very/long/path/that/needs/shortening" {...field} />
                                        </FormControl>
                                        <Button
                                            size="lg"
                                            type="submit"
                                            loading={form.formState.isSubmitting}
                                        >
                                            Snap It <Zap size={16} />
                                        </Button>
                                    </div>
                                    <FormMessage className="text-left" />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                {shortenedUrls && shortenedUrls.length > 0 && (
                    <Fragment>
                        <Separator className="my-10" />
                        <h3 className="text-left mb-5">Your Shortened URLs</h3>
                        {shortenedUrls.map((url) => {
                            const shortenedUrl = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/${url.shortCode}`
                            return (
                                <Alert className="flex items-center justify-between mb-1" key={url.id}>
                                    <AlertDescription>
                                        <Link href={shortenedUrl}>{shortenedUrl.replace('https://', '')}</Link>
                                    </AlertDescription>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                onClick={() => copy(shortenedUrl)}
                                                className="size-8"
                                                variant='outline'
                                            >
                                                <Copy />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Copy to clipboard</TooltipContent>
                                    </Tooltip>
                                </Alert>
                            )
                        })}
                    </Fragment>
                )}
            </CardContent>
        </Card>
    )
}
