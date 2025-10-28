import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ResultsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
       <Skeleton className="h-20 w-full" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center text-center shadow-md lg:col-span-1 bg-secondary/30">
          <CardHeader className="flex flex-col items-center justify-between space-y-2 pb-2 w-full">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <Skeleton className="h-48 w-48 rounded-full" />
            <Skeleton className="h-8 w-32" />
          </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
            <Card className="bg-secondary/30">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
            </Card>
            <Card className="bg-secondary/30">
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                </CardContent>
            </Card>
            <Card className="bg-secondary/30">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
