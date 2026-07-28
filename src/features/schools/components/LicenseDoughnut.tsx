import { Card, CardContent } from "@/core/libs";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
    maxWaDaily: number;
    currentWaCount: number;
    isLoading?: boolean;
}

export function LicenseDoughnut({
    maxWaDaily,
    currentWaCount,
    isLoading,
}: Props) {
    const remaining = Math.max(maxWaDaily - currentWaCount, 0);

    const data = {
        datasets: [
            {
                data: [currentWaCount, remaining],
                backgroundColor: [
                    "#3B82F6", // Used
                    "#E5E7EB", // Remaining
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        cutout: "80%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <Card className="h-[220px] border-none shadow-none bg-transparent">
            <CardContent className="relative flex h-full items-center justify-center">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <Doughnut data={data} options={options} />

                        <div className="absolute text-center">
                            <div className="text-3xl font-bold">
                                {currentWaCount}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                / {maxWaDaily}
                            </div>

                            <div className="mt-2 text-sm text-muted-foreground">
                                WA Used Today
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}