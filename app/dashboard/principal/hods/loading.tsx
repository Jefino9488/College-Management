import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="p-6 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-64 rounded-md" />
                    <Skeleton className="h-4 w-96 mt-2 rounded-md" />
                </div>
                <Skeleton className="h-9 w-36 rounded-md" />
            </div>

            {/* Filters Skeleton */}
            <div className="flex gap-4 items-center">
                <Skeleton className="h-9 w-sm flex-1 max-w-sm rounded-md" />
                <Skeleton className="h-9 w-48 rounded-md" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card><CardHeader><Skeleton className="h-5 w-24 rounded-md" /></CardHeader><CardContent><Skeleton className="h-7 w-12 rounded-md" /><Skeleton className="h-3 w-32 mt-2 rounded-md" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-32 rounded-md" /></CardHeader><CardContent><Skeleton className="h-7 w-12 rounded-md" /><Skeleton className="h-3 w-36 mt-2 rounded-md" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-28 rounded-md" /></CardHeader><CardContent><Skeleton className="h-7 w-12 rounded-md" /><Skeleton className="h-3 w-32 mt-2 rounded-md" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24 rounded-md" /></CardHeader><CardContent><Skeleton className="h-7 w-12 rounded-md" /><Skeleton className="h-3 w-32 mt-2 rounded-md" /></CardContent></Card>
            </div>

            {/* HODs List Skeleton */}
            <Card>
                <CardHeader><Skeleton className="h-6 w-40 rounded-md" /><Skeleton className="h-4 w-80 mt-2 rounded-md" /></CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-5 w-40 rounded-md" />
                                    <Skeleton className="h-3 w-48 mt-2 rounded-md" />
                                </div>
                            </div>
                            <div className="text-right">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-4 w-28 mt-2 rounded-md" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

