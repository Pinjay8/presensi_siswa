import { Divider } from "@mui/material";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/core/libs";
import { EkstrakurikulerForm } from "../containers";

interface EditEkstrakurikulerDialogProps {
    open: boolean;
    data: any | null; // ganti dengan type Ekstrakurikuler jika ada
    onClose: () => void;
    lang: any;
}

export function EditEkstrakurikulerDialog({
    open,
    data,
    onClose,
    lang,
}: EditEkstrakurikulerDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle style={{ marginTop: "12px" }}>
                        {lang.text("editEkstrakurikuler")}
                    </DialogTitle>
                </DialogHeader>

                <Divider />

                {data && (
                    <EkstrakurikulerForm
                        onClose={onClose}
                        initialData={{
                            id: data.id,
                            nama: data.nama,
                            jenis: data.jenis,
                            pembinaId: data.pembinaId,
                            deskripsi: data.deskripsi,
                            lokasi: data.lokasi,
                            thumbnail: data.thumbnail,
                            kontak: data.kontak,
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}