"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export function ThemeToggler() {
    const { setTheme, resolvedTheme } = useTheme()

    const toggleTheme = React.useCallback(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }, [resolvedTheme, setTheme])

    return (
        <Button
            variant="outline"
            className="group/toggle size-8 rounded-full px-0"
            onClick={toggleTheme}
        >
            <SunIcon className="hidden [html.dark_&]:block" />
            <MoonIcon className="hidden [html.light_&]:block" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
