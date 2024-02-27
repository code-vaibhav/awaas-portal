"use client";

import { useState, useEffect } from "react";
import { Typography, Button, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Popconfirm, notification, Space, Input } from "antd";
import EditApplication from "@/components/EditApplication";

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

export default function Applications() {
  const message = {
    success: "Application Successfully Deleted",
    error: "Error in deleting application, please try again",
  };
  const [applications, setApplications] = useState([]);
  const [application, setApplication] = useState();
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [pno, setPno] = useState("");

  const openNotification = (type) => {
    api[type]({
      message: message[type],
      placement: "topRight",
    });
  };

  const fetchApplications = () => {
    fetch(`${process.env.BACKEND_URL}/applications`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setApplications(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(fetchApplications, []);

  const deleteApplication = (uid) => {
    fetch(`${process.env.BACKEND_URL}/application/${uid}`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
    })
      .then((res) => {
        openNotification("success");
        fetchApplications();
      })
      .catch((err) => {
        console.error(err);
        openNotification("error");
      });
  };

  const classes = useStyles();

  const columns = [
    {
      field: "rno",
      headerName: "Registration No",
      flex: 1,
    },
    {
      field: "pno",
      headerName: "PNO No",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "rank",
      headerName: "Rank",
      flex: 1,
    },
    {
      field: "badge",
      headerName: "Badge No",
      flex: 1,
    },
    {
      field: "weighting",
      headerName: "Initial Weighting",
      flex: 1,
    },
    {
      field: "current_waiting",
      headerName: "Current Weighting",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
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
      field: "applied_at",
      headerName: "Application Date",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Actions",
      renderCell: (params) => (
        <Space>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<EditIcon fontSize="inherit" />}
            onClick={() => {
              setApplication(params.row);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            placement="topLeft"
            title={`Delete the application with PNO: ${params.row.pno}?`}
            description="Are you sure to delete this application?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteApplication(params.row)}
          >
            <Button
              variant="outlined"
              color="warning"
              startIcon={<DeleteIcon fontSize="inherit" />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      flex: 1,
    },
  ];

  return (
    <div className={classes.root}>
      {contextHolder}
      <Typography variant="h4" component="h4" align="center" m={5}>
        Records
      </Typography>
      <EditApplication
        application={application}
        open={open}
        setOpen={setOpen}
        openNotification={openNotification}
        fetchApplications={fetchApplications}
      />
      <Input
        placeholder="Enter PNO No to find"
        value={pno}
        onChange={(e) => setPno(e.target.value)}
      />
      <DataGrid
        rows={applications.filter((a) => String(a.pno).includes(pno))}
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
