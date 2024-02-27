"use client";

import { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Popconfirm, notification, Space, Modal } from "antd";
import NoticeForm from "@/components/NoticeForm";

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

const Notices = () => {
  const message = {
    success: "Notice Successfully Deleted",
    error: "Error in deleting notice, please try again",
  };
  const [notices, setNotices] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState();

  const openNotification = (type) => {
    api[type]({
      message: message[type],
      placement: "topRight",
    });
  };

  const fetchNotices = () => {
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
  };

  useEffect(fetchNotices, []);

  const deleteNotice = (uid) => {
    fetch(`${process.env.BACKEND_URL}/notice/${uid}`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
    })
      .then((res) => {
        openNotification("success");
        fetchNotices();
      })
      .catch((err) => {
        console.error(err);
        openNotification("error");
      });
  };

  const classes = useStyles();

  const columns = [
    {
      field: "heading",
      headerName: "Heading",
      flex: 1,
    },
    {
      field: "url",
      headerName: "URL",
      flex: 1,
      renderCell: (params) => <a href={`${params.url}`} />,
    },
    {
      field: "type",
      headerName: "Notice Type",
      flex: 1,
    },
    {
      field: "Release Date",
      headerName: "date",
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
              setNotice(params.row);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            placement="topLeft"
            title={`Delete the Notice?`}
            description="Are you sure to delete this notice?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteNotice(params.row.uid)}
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
        Notices
      </Typography>
      <Modal
        title="Title"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <NoticeForm
          mode="edit"
          notice={notice}
          setOpen={setOpen}
          openNotification={openNotification}
          fetchNotices={fetchNotices}
        />
      </Modal>

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
};

export default Notices;
