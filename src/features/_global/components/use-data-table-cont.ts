import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { jsonHelper, searchParamsToObject } from "@/core/libs";

interface UseDataTableControllerProps {
  defaultPageSize?: number;
  defaultSorting?: {
    id: string;
    desc: boolean;
  }[];
}

export function useDataTableController({ defaultPageSize = 10, defaultSorting }: UseDataTableControllerProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ Global Search
  const global = searchParams.get("search") ?? "";

  // ✅ Filter
  const filterParam = searchParams.get("filter");
  // const parsedFilter = useMemo(() => {
  //   return filterParam ? jsonHelper.parse(filterParam) : [];
  // }, [filterParam]);
  const parsedFilter = useMemo(() => {
    const params = searchParamsToObject(searchParams.toString());

    delete params.pageIndex;
    delete params.pageSize;
    delete params.search;
    delete params.sort;

    return params;
  }, [searchParams]);

  // ✅ Sorting
  const sortParam = searchParams.get("sort");
  // const sorting = useMemo(() => {
  //   return sortParam
  //     ? [{
  //       id: sortParam.split(".")[0],
  //       desc: sortParam.split(".")[1] === "desc",
  //     }]
  //     : [];
  // }, [sortParam]);

  const setFilter = useCallback(
    (filters: Record<string, any>) => {
      const params = searchParamsToObject(searchParams.toString());

      // daftar param yang BUKAN filter
      const reserved = ["pageIndex", "pageSize", "search", "sort"];

      // hapus semua filter lama
      Object.keys(params).forEach((key) => {
        if (!reserved.includes(key)) {
          delete params[key];
        }
      });

      // tambahkan filter baru
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params[key] = String(value);
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // ✅ Pagination from URL
  const paginationSearchParams = useMemo(() => ({
    pageIndex: !Number.isNaN(Number(searchParams.get("pageIndex")))
      ? Number(searchParams.get("pageIndex"))
      : 0,
    pageSize: !Number.isNaN(Number(searchParams.get("pageSize")))
      ? Number(searchParams.get("pageSize")) || defaultPageSize
      : defaultPageSize,
  }), [searchParams, defaultPageSize]);

  const [pagination, setPagination] = useState({
    pageIndex: paginationSearchParams.pageIndex,
    pageSize: paginationSearchParams.pageSize,
  });

  // ✅ Sync state with URL
  useEffect(() => {
    setPagination({
      pageIndex: paginationSearchParams.pageIndex,
      pageSize: paginationSearchParams.pageSize,
    });
  }, [paginationSearchParams.pageIndex, paginationSearchParams.pageSize]);

  // ✅ Update helpers
  // const updateSearchParams = useCallback(
  //   (next: Record<string, string | undefined>) => {
  //     setSearchParams({
  //       ...searchParamsToObject(searchParams.toString()),
  //       ...next,
  //     });
  //   },
  //   [searchParams, setSearchParams]
  // );

  const updateSearchParams = useCallback(
    (next: Record<string, string | undefined>) => {
      const params = {
        ...searchParamsToObject(searchParams.toString()),
        ...next,
      };

      Object.keys(params).forEach((key) => {
        if (
          params[key] === undefined ||
          params[key] === null ||
          params[key] === ""
        ) {
          delete params[key];
        }
      });

      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const setGlobal = useCallback(
    (value: string) => {
      updateSearchParams({
        "search": value || undefined,
        // pageIndex: "0",
      });
    },
    [updateSearchParams]
  );

  // const onSortingChange = useCallback(
  //   (updater: any) => {
  //     const nextSort = typeof updater === "function" ? updater(sorting) : updater;
  //     const next = nextSort?.[0];
  //     updateSearchParams({
  //       sort: next ? `${next.id}.${next.desc ? "desc" : "asc"}` : undefined,
  //     });
  //   },
  //   [sorting, updateSearchParams]
  // );

  // const [sorting, setSorting] = useState([
  //   {
  //     id: "namaKelas",
  //     desc: true,
  //   },
  // ]);

  const [sorting, setSorting] = useState(defaultSorting);

  const onSortingChange = useCallback(
    (updater: any) => {
      const nextSort =
        typeof updater === "function" ? updater(sorting) : updater;

      setSorting(nextSort);
    },
    [sorting]
  );

  const onPaginationChange = useCallback(
    (updater: any) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      setPagination(next);
      updateSearchParams({
        pageIndex: String(next.pageIndex),
        pageSize: String(next.pageSize),
      });
    },
    [pagination, updateSearchParams]
  );

  return {
    global,
    setGlobal,
    sorting,
    filter: parsedFilter,
    setFilter,
    pagination,
    onSortingChange,
    onPaginationChange,
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
  };
}

