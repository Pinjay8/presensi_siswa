import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  lang,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { Divider } from "@mui/material";

interface ScheduleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: {
    dayOfWeek: number;
    jamMulai: string;
    jamSelesai: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      dayOfWeek: number;
      jamMulai: string;
      jamSelesai: string;
    }>
  >;
  onSubmit: () => void;
  onCancel: () => void;

  // Optional (hanya dipakai saat Add)
  showEkskul?: boolean;
  selectedEkskulId?: number;
  setSelectedEkskulId?: (id: number) => void;
  ekskulData?: any;
}

export function ScheduleEkstrakurikulerFormDialog({
  open,
  onOpenChange,
  title,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  showEkskul = false,
  selectedEkskulId = 0,
  setSelectedEkskulId,
  ekskulData,
}: ScheduleFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle style={{ marginTop: "18px" }}>{title}</DialogTitle>
        </DialogHeader>
        <Divider />

        <div className="grid gap-4 py-4">
          {showEkskul && (
            <div className="grid gap-2">
              <label>{lang.text("extracurricular")}</label>

              <Select
                value={
                  selectedEkskulId === 0 ? "" : selectedEkskulId.toString()
                }
                onValueChange={(value) => setSelectedEkskulId?.(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Ekstrakurikuler" />
                </SelectTrigger>

                <SelectContent>
                  {ekskulData?.data?.map((item: any) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <label>{lang.text("day")}</label>

            <Select
              value={formData.dayOfWeek.toString()}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  dayOfWeek: Number(value),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={lang.text("selectDay")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="1">{lang.text("monday")}</SelectItem>
                <SelectItem value="2">{lang.text("tuesday")}</SelectItem>
                <SelectItem value="3">{lang.text("wednesday")}</SelectItem>
                <SelectItem value="4">{lang.text("thursday")}</SelectItem>
                <SelectItem value="5">{lang.text("friday")}</SelectItem>
                <SelectItem value="6">{lang.text("saturday")}</SelectItem>
                <SelectItem value="7">{lang.text("sunday")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label>{lang.text("startHour")}</label>

            <Input
              type="time"
              value={formData.jamMulai}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  jamMulai: e.target.value,
                }))
              }
            />
          </div>

          <div className="grid gap-2">
            <label>{lang.text("endHour")}</label>

            <Input
              type="time"
              value={formData.jamSelesai}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  jamSelesai: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onSubmit}>{lang.text("save")}</Button>
          <Button variant="outline" onClick={onCancel}>
            {lang.text("cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
