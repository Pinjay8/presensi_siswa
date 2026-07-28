import { Card, CardContent, CardHeader, lang } from "@/core/libs";
import { LicenseDoughnut } from "./LicenseDoughnut";

interface LicenseInfoCardProps {
    status: any;
    isLoading?: boolean;
}

export function LicenseInfoCard({
    status,
    isLoading,
}: LicenseInfoCardProps) {
    return (
        <Card className="w-full bg-theme-color-primary/5">
            <CardHeader>
                <div>
                    <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white dark:text-black">
                        {lang.text("infoLicense")}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="pt-0 flex flex-col justify-center">
                <LicenseDoughnut
                    maxWaDaily={status?.data?.maxWaDaily ?? 0}
                    currentWaCount={status?.data?.currentWaCount ?? 0}
                    isLoading={isLoading}
                />

                <div className="mt-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {lang.text("school")}
                        </span>

                        <span className="font-medium">
                            {status?.data?.customer ?? "-"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">
                            {lang.text("status")}
                        </span>

                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${status?.data?.isValid
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                }`}
                        >
                            {status?.data?.isValid
                                ? lang.text("active")
                                : lang.text("expired")}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {lang.text("expiryDate")}
                        </span>

                        <span className="font-medium">
                            {status?.data?.expiryDate
                                ? new Date(status.data.expiryDate).toLocaleDateString(
                                    "id-ID",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )
                                : "-"}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}