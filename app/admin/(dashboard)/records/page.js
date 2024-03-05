"use client";

import { useState, useEffect } from "react";
import { Typography, Button, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Popconfirm, notification, Space, Input } from "antd";
import EditRecord from "@/components/EditRecord";
import { langState } from "@/utils/atom";
import { useRecoilValue } from "recoil";
import text from "@/text.json";
import WithAuthorization from "@/components/WithAuth";

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

const Records = ({ role }) => {
  const [records, setRecords] = useState([]);
  const [record, setRecord] = useState();
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [processing, setProcessing] = useState(false);
  const t = text[useRecoilValue(langState)];

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "topRight",
    });
  };

  const fetchRecords = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/application/active/all`, {
      method: "GET",
      credentials: "include",
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

  const deleteRecord = (id) => {
    setProcessing(id);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/application/delete`, {
      method: "DELETE",
      credentials: "include",
      body: { id },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          openNotification("success", t["Record Deleted"]);
          fetchRecords();
        } else {
          console.error(data.message);
          openNotification("error", t["Error Deleting Record"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Deleting Record"]);
      })
      .finally(() => setProcessing(false));
  };

  const classes = useStyles();

  const columns = [
    {
      field: "registrationNumber",
      headerName: t["Registration No"],
      flex: 1,
    },
    {
      field: "pno",
      headerName: t["PNO No"],
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
      field: "weighting",
      headerName: t["Initial Weighting"],
      flex: 1,
    },
    {
      field: "current_waiting",
      headerName: t["Current Weighting"],
      flex: 1,
    },
    {
      field: "status",
      headerName: t["Status"],
      flex: 0,
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          color={params.row.status === "Alloted" ? "success" : "warning"}
          variant="outlined"
        />
      ),
    },
    {
      field: "applicationDate",
      headerName: t["Appllication Date"],
      flex: 1,
    },
    {
      field: "action",
      headerName: t["Actions"],
      renderCell: (params) => (
        <Space>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<EditIcon fontSize="inherit" />}
            onClick={() => {
              setRecord(params.row);
              setOpen(true);
            }}
          >
            {t["Edit"]}
          </Button>
          {role === "root" && (
            <Popconfirm
              placement="topLeft"
              title={t[`Are you sure to delete this record?`]}
              okText={t["Yes"]}
              cancelText={t["No"]}
              onConfirm={() => deleteRecord(params.row.id)}
            >
              <Button
                variant="outlined"
                color="warning"
                disabled={processing}
                startIcon={<DeleteIcon fontSize="inherit" />}
              >
                {processing === params.row.id && (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                )}
                {t["Delete"]}
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
      flex: 1,
    },
  ];

  return (
    <div className={classes.root}>
      {contextHolder}
      <Typography variant="h4" component="h4" align="center" m={5}>
        {t["Records"]}
      </Typography>
      <EditRecord
        record={record}
        open={open}
        setOpen={setOpen}
        openNotification={openNotification}
        fetchrecords={fetchRecords}
      />
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
};

export default () => <WithAuthorization Children={Records} isRoot={false} />;
