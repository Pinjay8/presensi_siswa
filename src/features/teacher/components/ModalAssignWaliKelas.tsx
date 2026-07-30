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
  lang,
} from "@/core/libs";
import { Autocomplete, Divider, TextField } from "@mui/material";
import { useEffect } from "react";

import { useForm } from "react-hook-form";

interface ModalAssignWaliKelasProps {
  open: boolean;
  teacher?: any | null;
  kelasOptions: {
    label: string;
    value: string;
  }[];
  onClose: () => void;
  // onSubmit: (data: { guruId: number; kelasId: number }) => void;
  onSubmit: any;
}

type FormValues = {
  kelasId: string[];
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
      kelasId: [],
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      guruId: teacher?.guruId ?? 0,
      kelasId: values.kelasId.map(Number),
    });

    form.reset();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    form.reset({
      kelasId: teacher?.waliKelas?.map((x: any) => String(x.kelasId)) ?? [],
    });
  }, [open, teacher, form]);


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ marginTop: "16px" }}>
            Assign {lang.text("homeroom-teacher")}
          </DialogTitle>
        </DialogHeader>

        <Divider />

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">{lang.text("teacher")}</label>

            <div className="mt-1 rounded border p-2 bg-muted">
              {teacher?.name ?? "-"}
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormLabel>{lang.text("classRoom")}</FormLabel>
              <FormField
                control={form.control}
                name="kelasId"
                render={({ field }) => {

                  return (
                    <Autocomplete
                      multiple
                      disablePortal
                      options={kelasOptions}
                      getOptionLabel={(option) => option.label}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={kelasOptions.filter((o) =>
                        (field.value ?? []).includes(o.value)
                      )}
                      onChange={(_, newValue) => {
                        field.onChange(newValue.map((v) => v.value));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={lang.text("selectClassRoom")}
                        />
                      )}
                    />
                  );
                }}
              />

              <Divider />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  {lang.text("cancel")}
                </Button>

                <Button type="submit">{lang.text("saveChanges")}</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
