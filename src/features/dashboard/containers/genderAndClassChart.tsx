import { Card, CardContent, CardHeader, CardTitle, lang } from "@/core/libs";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";

import { dashboardService } from "@/core/services/dashboard";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Custom plugin to add emojis in the middle of the bars
const emojiPlugin = {
  id: "emojiPlugin",
  afterDatasetsDraw(chart: ChartJS) {
    const { ctx, data, scales } = chart;

    ctx.save();
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      meta.data.forEach((bar, index) => {
        const value = dataset.data[index] as number;
        if (value === 0) return;

        const y = bar.y;
        const emoji = datasetIndex === 0 ? "👨" : "👩";

        const emojiX = scales.x.getPixelForValue(value / 2);
        const emojiY = y;

        ctx.fillText(emoji, emojiX, emojiY);
      });
    });

    ctx.restore();
  },
};

export const StudentDemographicsCharts = ({
  selectedSchool,
}: {
  selectedSchool?: string;
}) => {
  const [classChart, setClassChart] = useState<any>(null);
  const [genderChart, setGenderChart] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getClassChart();
        const resGender = await dashboardService.getGenderChart();
        setClassChart(response.data);
        setGenderChart(resGender.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // State to track current theme
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Detect theme changes
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Define theme-aware colors
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";
  const maleColor = theme === "dark" ? "#9333EA" : "#9333EA"; // purple-600
  const femaleColor = theme === "dark" ? "#F472B6" : "#EC4899"; // pink-400 (dark), pink-500 (light)
  const classColor = theme === "dark" ? "#3B82F6" : "#2563EB"; // blue-500 (dark), blue-600 (light)

  // Prepare Bar chart data for gender distribution
  const genderChartData = {
    labels: [lang.text("male"), lang.text("female")],
    datasets: [
      {
        label: lang.text("male"),
        data: [genderChart?.lakiLaki ?? 0, 0],
        backgroundColor: maleColor,
        borderColor: maleColor,
        borderWidth: 1,
      },
      {
        label: lang.text("female"),
        data: [0, genderChart?.perempuan ?? 0],
        backgroundColor: femaleColor,
        borderColor: femaleColor,
        borderWidth: 1,
      },
    ],
  };

  // Prepare Bar chart data for class distribution
  const classChartData = {
    labels: (classChart ?? [])
      .filter((item: any) => item.kelas !== "Unknown")
      .map((item: any) => item.kelas),

    datasets: [
      {
        label: lang.text("student"),
        data: (classChart ?? [])
          .filter((item: any) => item.kelas !== "Unknown")
          .map((item: any) => item.jumlah),

        backgroundColor: classColor,
        borderColor: classColor,
        borderWidth: 1,
      },
    ],
  };

  // Gender Bar chart options (horizontal)
  const genderBarOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: lang.text("gender"),
        color: textColor,
        font: { size: 16 },
      },
      emojiPlugin: false,
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: lang.text("student"),
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        title: {
          display: true,
          text: lang.text("gender"),
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  // Class Bar chart options (vertical)
  const classBarOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
        },
      },
      title: {
        display: true,
        text: lang.text("studentsPerClass"),
        color: textColor,
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: lang.text("student"),
          color: textColor,
        },
        ticks: {
          color: textColor,
        },
      },
      x: {
        title: {
          display: true,
          text: lang.text("classRoom"),
          color: textColor,
        },
        ticks: {
          color: textColor,
          autoSkip: false, // Prevent skipping labels
          maxRotation: 45, // Rotate labels if needed
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-theme-color-primary/5">
      {/* Gender Horizontal Bar Chart */}
      <Card className="h-[400px] bg-theme-color-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            {lang.text("gender")}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)]">
          <Bar
            data={genderChartData}
            options={genderBarOptions}
            plugins={[emojiPlugin]}
          />
        </CardContent>
      </Card>

      {/* Class Vertical Bar Chart */}
      <Card className="h-[400px] bg-theme-color-primary/5">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground">
            {lang.text("studentsPerClass")}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)]">
          {(classChart?.length ?? 0) > 0 ? (
            <Bar data={classChartData} options={classBarOptions} />
          ) : (
            <p className="text-center text-muted-foreground">
              {lang.text("noReport")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
