import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAlert } from "@/features/_global";
import { schoolUpdateFormSchema, useSchoolDetail } from "@/features/schools";
import { useProfile } from "@/features/profile";
import { lang } from "@/core/libs";

interface UseSchoolUpdateFormProps {
  onClose: () => void;
}

export const useSchoolUpdateForm = ({ onClose }: UseSchoolUpdateFormProps) => {
  const profile = useProfile();
  const SchoolID = profile.user?.sekolahId;
  const school = useSchoolDetail({ id: SchoolID });
  const navigate = useNavigate();
  const alert = useAlert();

  const form = useForm<z.infer<typeof schoolUpdateFormSchema>>({
    resolver: zodResolver(schoolUpdateFormSchema),
    mode: "onBlur",
    defaultValues: {
      provinceId: "",
      schoolName: "",
      schoolNPSN: "",
      alamatSekolah: "",
      moodleApiUrl: "",
      tokenMoodle: "",
      serverSatu: "",
      serverDua: "",
      serverTiga: "",
      urlYoutube1: "",
      urlYoutube2: "",
      urlYoutube3: "",
      libraryServer: "",
      libraryName: "",
      address: "",
      active: 0,
      location: { lat: 0, lng: 0 },
    },
  });

  useEffect(() => {
    if (!school.isLoading && school.data) {
      console.log("📌 Data sekolah dari API:", school.data);
      form.reset({
        provinceId: String(school.data?.provinceId) || "",
        schoolName: school.data?.namaSekolah || "",
        schoolNPSN: school.data?.npsn || "",
        alamatSekolah: school.data?.alamatSekolah || "",
        moodleApiUrl: school.data?.modelApiUrl || "",
        tokenMoodle: school.data?.tokenModel || "",
        serverSatu: school.data?.serverSatu || "",
        serverDua: school.data?.serverDua || "",
        serverTiga: school.data?.serverTiga || "",
        urlYoutube1: school.data?.urlYutubeFirst || "",
        urlYoutube2: school.data?.urlYutubeSecond || "",
        urlYoutube3: school.data?.urlYutubeThird || "",
        libraryServer: school.data?.serverPerpustakaan || "",
        libraryName: school.data?.namaPerpustakaan || "",
        address: school.data?.alamatSekolah || "",
        active: school.data?.active ?? 0,
        location: {
          lat: Number(school.data?.latitude) || 0,
          lng: Number(school.data?.longitude) || 0,
        },
      });
    }
  }, [school.isLoading, school.data, form]);

  async function onSubmit(data: z.infer<typeof schoolUpdateFormSchema>) {
    console.log("🚀 Form is valid, submitting data:", data);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token");

      if (data.provinceId && data.provinceId !== String(school.data?.provinceId)) {
        formData.append("provinceId", data.provinceId);
      }
      if (data.schoolName && data.schoolName !== school.data?.namaSekolah) {
        formData.append("namaSekolah", data.schoolName);
      }
      if (data.schoolNPSN && data.schoolNPSN !== school.data?.npsn) {
        formData.append("npsn", data.schoolNPSN);
      }
      if (data.alamatSekolah && data.alamatSekolah !== school.data?.alamatSekolah) {
        formData.append("alamatSekolah", data.alamatSekolah);
      }
      if (
        data.location.lat !== Number(school.data?.latitude) ||
        data.location.lng !== Number(school.data?.longitude)
      ) {
        formData.append("latitude", String(data.location.lat));
        formData.append("longitude", String(data.location.lng));
      }
      if (data.serverSatu && data.serverSatu !== school.data?.serverSatu) {
        formData.append("serverSatu", data.serverSatu);
      }
      if (data.serverDua && data.serverDua !== school.data?.serverDua) {
        formData.append("serverDua", data.serverDua);
      }
      if (data.serverTiga && data.serverTiga !== school.data?.serverTiga) {
        formData.append("serverTiga", data.serverTiga);
      }
      if (data.urlYoutube1 && data.urlYoutube1 !== school.data?.urlYutubeFirst) {
        formData.append("urlYutubeFirst", data.urlYoutube1);
      }
      if (data.urlYoutube2 && data.urlYoutube2 !== school.data?.urlYutubeSecond) {
        formData.append("urlYutubeSecond", data.urlYoutube2);
      }
      if (data.urlYoutube3 && data.urlYoutube3 !== school.data?.urlYutubeThird) {
        formData.append("urlYutubeThird", data.urlYoutube3);
      }
      if (data.tokenMoodle && data.tokenMoodle !== school.data?.tokenModel) {
        formData.append("tokenModel", data.tokenMoodle);
      }
      if (data.moodleApiUrl && data.moodleApiUrl !== school.data?.modelApiUrl) {
        formData.append("modelApiUrl", data.moodleApiUrl);
      }
      if (data.libraryServer && data.libraryServer !== school.data?.serverPerpustakaan) {
        formData.append("serverPerpustakaan", data.libraryServer);
      }
      if (data.libraryName && data.libraryName !== school.data?.namaPerpustakaan) {
        formData.append("namaPerpustakaan", data.libraryName);
      }
      if (data.address && data.address !== school.data?.alamatSekolah) {
        formData.append("alamatSekolah", data.address);
      }
      if (data.active !== undefined && data.active !== school.data?.active) {
        formData.append("active", String(data.active));
      }

      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/sekolah/${SchoolID}`,
        formData,
        { headers }
      );

      // console.log("✅ Data sekolah berhasil terupdate:", response.data);
      alert.success(
        lang.text("successful", {
          context: lang.text("updateSchoolData"),
        })
      );
      localStorage.setItem("hasShownSchoolDialog", "true");
      school.query.refetch();
      onClose();
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error("Error while submitting:", err);
      if (err.response) {
        console.error("Response error:", err.response);
        alert.error(
          err.response.data?.message ||
            lang.text("failed", {
              context: lang.text("updateSchoolData"),
            })
        );
      } else if (err.request) {
        console.error("Request error:", err.request);
        alert.error(
          lang.text("failed", { context: lang.text("updateSchoolData") })
        );
      } else {
        console.error("Error message:", err.message);
        alert.error(
          err?.message ||
            lang.text("failed", {
              context: lang.text("updateSchoolData"),
            })
        );
      }
    }
  }

  return { form, onSubmit, isLoading: false };
};