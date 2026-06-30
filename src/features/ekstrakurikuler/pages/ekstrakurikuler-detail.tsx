import { lang, simpleDecode } from "@/core/libs";
import { APP_CONFIG } from "@/core/configs";
import { Navigate, useParams } from "react-router-dom";

import {
  BaseDataTable,
  DashboardPageLayout,
  InfoItem,
  useAlert,
  useDataTableController,
} from "@/features/_global";
import { useEkstrakurikulerDetail } from "../hooks";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { useMemberEkstrakurikulerDetail } from "../hooks/useMemberEkstrakurikuler";
import {
  absensiEkstrakurikulerColumns,
  ekstrakurikulerColumns,
  memberEkstrakurikulerColumns,
  rekapBulananColumns,
} from "../utils";
import { useMemo, useState } from "react";
import { ModalAssignMember } from "../components/modalAssignMember";
import { FaPlus } from "react-icons/fa";
import { ekstrakurikulerService } from "@/core/services/ekstrakurikuler";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/libs";
import { useAbsensiEkskul } from "../hooks/useAbsensiEskul";
import { ModalAssignAbsen } from "../components/modalAssignAbsen";
import { useRekapBulanan } from "../hooks/useRekapBulanan";
import { useProfile } from "@/features/profile";

export const EkstrakurikulerDetail = () => {
  const params = useParams();
  const decodeParams: { id: string; text: string } = JSON.parse(
    simpleDecode(params.id || ""),
  );

  if (!decodeParams?.id || !decodeParams?.text) {
    return <Navigate to="/404" replace />;
  }

  const { data, isLoading } = useEkstrakurikulerDetail({
    id: Number(decodeParams.id),
  });

  const ekskul = data?.data;
  const alert = useAlert();

  const handleRemove = async (member: any) => {
    try {
      const res = await ekstrakurikulerService.removeMember(
        member.ekskulId,
        member.biodataSiswaId,
      )();

      alert.success(
        lang.text("successRemove", {
          context: lang.text("member"),
        }),
      );

      memberResource.query.refetch();
    } catch (error: any) {
      console.error(error);

      alert.error(error.message);
    }
  };

  const columns = useMemo(
    () =>
      memberEkstrakurikulerColumns({
        onRemove: handleRemove,
      }),
    [],
  );

  const {
    global,
    sorting,
    filter,
    pagination,
    onSortingChange,
    onPaginationChange,
  } = useDataTableController({
    defaultPageSize: 10,
  });

  const memberResource = useMemberEkstrakurikulerDetail({
    id: Number(decodeParams.id),
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: global,
  });

  const absensiSource = useAbsensiEkskul({
    id: Number(decodeParams.id),
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  // const rekapBulananResource = useRekapBulanan({
  //   id: Number(decodeParams.id),
  // });

  const columnsAbsensi = useMemo(() => absensiEkstrakurikulerColumns({}), []);
  // const columnsRekapBulanan = useMemo(() => rekapBulananColumns({}), []);
  const days = [
    { value: 1, label: "Senin" },
    { value: 2, label: "Selasa" },
    { value: 3, label: "Rabu" },
    { value: 4, label: "Kamis" },
    { value: 5, label: "Jumat" },
    { value: 6, label: "Sabtu" },
  ];

  const [memberAssignDialog, setMemberAssignDialog] = useState(false);
  const [absensiAssingDialog, setAbsensiAssingDialog] = useState(false);
  const profile = useProfile();
  const isRole =
    profile?.user?.role === "admin" || profile?.user?.role === "guru";

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <DashboardPageLayout
      siteTitle={`${lang.text("detailEkstrakurikuler")} | ${APP_CONFIG.appName}`}
      breadcrumbs={[
        {
          label: lang.text("ekstrakurikuler"),
          url: "/ekstrakurikuler",
        },
        {
          label: decodeParams.text,
          url: `/ekstrakurikuler/${params.id}`,
        },
      ]}
      title={lang.text("detailEkstrakurikuler")}
    >
      <div className="space-y-6">
        {/* INFORMASI */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            {lang.text("information")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label={lang.text("name")} value={ekskul?.nama} />

            <InfoItem label={lang.text("jenis")} value={ekskul?.jenis} />

            <InfoItem
              label={lang.text("advisor")}
              value={ekskul?.pembina?.namaGuru}
            />

            <InfoItem label={lang.text("location")} value={ekskul?.lokasi} />

            <InfoItem
              label={lang.text("totalMember")}
              value={ekskul?.totalAnggota}
            />

            <InfoItem
              label={lang.text("status")}
              value={ekskul?.isActive ? "Aktif" : "Tidak Aktif"}
            />
          </div>
        </div>

        <Tabs defaultValue="schedule">
          <TabsList>
            <TabsTrigger value="schedule">
              {lang.text("scheduleMapel")}
            </TabsTrigger>

            <TabsTrigger value="member">{lang.text("listMember")}</TabsTrigger>
            <TabsTrigger value="absent">{lang.text("absensi")}</TabsTrigger>
            {/* <TabsTrigger value="rekapBulanan">
              {lang.text("rekapBulanan")}
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="schedule">
            {/* JADWAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {days.map((day) => {
                const schedules =
                  ekskul?.jadwalEkskul?.filter(
                    (item: any) => item.dayOfWeek === day.value,
                  ) || [];

                return (
                  <div
                    key={day.value}
                    className="rounded-lg border bg-card p-4"
                  >
                    <h4 className="font-semibold mb-3">{day.label}</h4>

                    {schedules.length > 0 ? (
                      <div className="space-y-2">
                        {schedules.map((schedule: any) => (
                          <div
                            key={schedule.id}
                            className="rounded-md border bg-muted/50 px-3 py-2 text-sm"
                          >
                            <p className="text-sm text-muted-foreground mb-1">
                              {ekskul?.nama}
                            </p>
                            {schedule.jamMulai} - {schedule.jamSelesai}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Tidak ada jadwal
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="member">
            {/* ASSIGN Member */}

            <Typography sx={{ mb: 2 }} variant="h6" fontWeight={"semibold"}>
              {lang.text("listMember")}
            </Typography>

            <div className="assign-member">
              <ModalAssignMember
                show={memberAssignDialog}
                ekstrakurikulerId={Number(decodeParams.id)}
                onClose={() => setMemberAssignDialog(false)}
                onSuccess={() => {
                  memberResource.query.refetch();
                }}
              />
              <BaseDataTable
                columns={columns}
                data={memberResource.data}
                dataFallback={columns}
                manualPagination
                searchParamPagination
                onPaginationChange={onPaginationChange}
                rowCount={memberResource?.pagination?.total ?? 0}
                searchPlaceholder={lang.text("search")}
                actions={[
                  ...(isRole
                    ? [
                        {
                          title: lang.text("addMember"),
                          icon: <FaPlus />,
                          onClick: () => {
                            setMemberAssignDialog(true);
                          },
                        },
                      ]
                    : []),
                ]}
              />
            </div>
          </TabsContent>

          <TabsContent value="absent">
            {absensiAssingDialog && (
              <ModalAssignAbsen
                show={absensiAssingDialog}
                ekstrakurikulerId={Number(decodeParams.id)}
                onClose={() => setAbsensiAssingDialog(false)}
                onSuccess={() => {
                  absensiSource.query.refetch();
                }}
              />
            )}
            <BaseDataTable
              columns={columnsAbsensi}
              data={absensiSource.data}
              dataFallback={columnsAbsensi}
              manualPagination
              searchParamPagination
              onPaginationChange={onPaginationChange}
              // rowCount={absensiSource?.pagination?.total ?? 0}
              searchPlaceholder={lang.text("search")}
              actions={[
                ...(isRole
                  ? [
                      {
                        title: lang.text("createAbsent"),
                        icon: <FaPlus />,
                        onClick: () => {
                          setAbsensiAssingDialog(true);
                        },
                      },
                    ]
                  : []),
              ]}
            />
          </TabsContent>
          {/* <TabsContent value="rekapBulanan">
            <BaseDataTable
              columns={columnsRekapBulanan}
              data={rekapBulananResource.data}
              dataFallback={columnsRekapBulanan}
              manualPagination
              searchParamPagination
              onPaginationChange={onPaginationChange}
              // rowCount={absensiSource?.pagination?.total ?? 0}
              searchPlaceholder={lang.text("search")}
            />
          </TabsContent> */}
        </Tabs>
      </div>
    </DashboardPageLayout>
  );
};
