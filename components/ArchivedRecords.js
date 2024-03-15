"use client";

import { useState, useEffect } from "react";
import { Input } from "antd";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { authState, langState } from "@/utils/atom";
import text from "@/text.json";
import { useRecoilValue } from "recoil";

const ArchivedRecords = () => {
  const [records, setRecords] = useState([]);
  const [id, setId] = useState("");
  const t = text[useRecoilValue(langState)];
  const auth = useRecoilValue(authState);

  const fetchRecords = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/application/archive/all`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setRecords(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(fetchRecords, []);

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
      />
    </div>
  );
};

export default ArchivedRecords;
