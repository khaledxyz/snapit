export function Background() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-1/3 -left-20 w-64 h-64 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        </div>
    )
}