import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";
import { BiodataGuru } from "@/core/models/biodata-guru";
import { Divider } from "@mui/material";

import { useForm } from "react-hook-form";

interface ModalAssignWaliKelasProps {
  open: boolean;
  teacher?: BiodataGuru | null;
  kelasOptions: {
    label: string;
    value: string;
  }[];
  onClose: () => void;
  onSubmit: (data: { guruId: number; kelasId: number }) => void;
}

type FormValues = {
  kelasId: string;
};

export function ModalAssignWaliKelas({
  open,
  teacher,
  kelasOptions,
  onClose,
  onSubmit,
}: ModalAssignWaliKelasProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      kelasId: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      guruId: teacher?.id ?? 0,
      kelasId: Number(values.kelasId),
    });

    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ marginTop: "16px" }}>
            Assign Wali Kelas
          </DialogTitle>
        </DialogHeader>

        <Divider />

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nama Guru</label>

            <div className="mt-1 rounded border p-2 bg-muted">
              {teacher?.user?.name ?? "-"}
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="kelasId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kelas" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {kelasOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Divider />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Batal
                </Button>

                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
