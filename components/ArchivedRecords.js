"use client";

import { useState } from "react";
import { Input } from "antd";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import { useRecoilValue } from "recoil";

const ArchivedRecords = ({ records, loading }) => {
  const [id, setId] = useState("");
  const t = text[useRecoilValue(langState)];

  const columns = [
    {
      field: "registrationNumber",
      headerName: t["Registration No"],
      flex: 1,
    },
    {
      field: "pno",
      headerName: t["PNO"],
      flex: 1,
    },
    {
      field: "name",
      headerName: t["Name"],
      flex: 1,
    },
    {
      field: "rank",
      headerName: t["Rank"],
      flex: 1,
    },
    {
      field: "badgeNumber",
      headerName: t["Badge No"],
      flex: 1,
    },
    {
      field: "initialWaiting",
      headerName: t["Initial Waiting"],
      flex: 1,
    },
    {
      field: "currentWaiting",
      headerName: t["Current Waiting"],
      flex: 1,
    },
    {
      field: "applicationDate",
      headerName: t["Application Date"],
      flex: 1,
      valueGetter: (params) => {
        const [day, month, year] = params.row.applicationDate.split("/");
        const formattedDate = new Date(
          `${year}-${month}-${day}`
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formattedDate;
      },
    },
  ];

  return (
    <div className="root">
      <Input
        placeholder={t["Enter PNO or Registration No"]}
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={{ marginBottom: "5px" }}
        type="text"
      />
      <DataGrid
        rows={records?.filter(
          (a) =>
            String(a.pno).includes(id) ||
            String(a.registrionNumber).includes(id)
        )}
        columns={columns}
        getRowId={(row) => row.id}
        showColumnVerticalBorder
        showCellVerticalBorder
        pageSize={10}
        autoHeight
        getRowClassName={() => "row"}
        slots={{ toolbar: GridToolbar }}
        loading={loading}
      />
    </div>
  );
};

export default ArchivedRecords;
