"use client";

import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { useTranslation } from "next-i18next";

const useStyles = makeStyles(() => ({
  root: {
    maxHeight: "100%", // Set height to 100% of the parent container
    width: "95%", // Set the width of the container
    margin: "0 auto", // Center the container horizontally
  },
  row: {
    width: "100%", // Allow rows to occupy the full width
    maxWidth: "100%",
  },
}));

export default function Home() {
  const [notices, setNotices] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/getNotices`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setNotices(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const classes = useStyles();

  const columns = [
    {
      field: "title",
      headerName: t("Title"),
      flex: 1,
    },
    {
      field: "url",
      headerName: t("URL"),
      flex: 1,
      renderCell: (params) => <a href={`${params.url}`} />,
    },
    {
      field: "type",
      headerName: t("Notice Type"),
      flex: 1,
    },
    {
      field: "date",
      headerName: t("Release Date"),
      flex: 1,
    },
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h4" component="h4" align="center" m={5}>
        {t("Notices")}
      </Typography>
      <DataGrid
        rows={notices}
        columns={columns}
        getRowId={(row) => row.uid}
        showColumnVerticalBorder
        showCellVerticalBorder
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        autoHeight
        getRowClassName={() => classes.row}
        slots={{ toolbar: GridToolbar }}
        disableExtendRowFullWidth
      />
    </div>
  );
}
