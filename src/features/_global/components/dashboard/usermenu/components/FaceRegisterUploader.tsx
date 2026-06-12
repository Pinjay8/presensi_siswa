import {
  Button,
  lang,
} from "@/core/libs";
import { FileUploader } from "../../../file-uploader";
import { Box } from "@mui/material";
interface FaceRegisterUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onRegister: () => void;
  loading?: boolean;
}

export const FaceRegisterUploader = ({
  file,
  onFileChange,
  onRegister,
  loading,
}: FaceRegisterUploaderProps) => {
  return (
    <div className="flex flex-col">
      <label className="text-black text-md font-semibold flex items-center gap-2 mb-0">
        {lang.text("UploadPicture")}
      </label>

      <FileUploader
        value={file || undefined}
        buttonPlaceholder={lang.text("ChoosePicture")}
        onChange={onFileChange}
        maxSize={1 * 1024 * 1024}
      />

      <Box mt={2}>
        <Button
          onClick={onRegister}
          disabled={!file || loading}
          style={{ width: "100%" }}
        >
          {lang.text("RegisterFace")}
        </Button>
      </Box>
    </div>
  );
};
