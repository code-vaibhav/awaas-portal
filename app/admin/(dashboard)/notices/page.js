"use client";

import { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Popconfirm, notification, Space, Modal } from "antd";
import NoticeForm from "@/components/NoticeForm";
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

const Notices = ({ role }) => {
  const [notices, setNotices] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState();
  const t = text[useRecoilValue(langState)];

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "topRight",
    });
  };

  const fetchNotices = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notiification/all`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setNotices(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(fetchNotices, []);

  const deleteNotice = (id) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/delete`, {
      method: "DELETE",
      credentials: "include",
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          openNotification("success", t["Notice Deleted"]);
          fetchNotices();
        } else {
          console.error(data.message);
          openNotification("error", t["Error Deleting Notice"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Deleting Notice"]);
      });
  };

  const classes = useStyles();

  const columns = [
    {
      field: "heading",
      headerName: t["Heading"],
      flex: 1,
    },
    {
      field: "url",
      headerName: t["URL"],
      flex: 1,
      renderCell: (params) => <a href={`${params.url}`} />,
    },
    {
      field: "type",
      headerName: t["Notice Type"],
      flex: 1,
    },
    {
      field: "date",
      headerName: t["Release Date"],
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
              setNotice(params.row);
              setOpen(true);
            }}
          >
            {t["Edit"]}
          </Button>
          <Popconfirm
            placement="topLeft"
            title={t[`Are you sure to delete this notice?`]}
            okText={t["Yes"]}
            cancelText={t["No"]}
            onConfirm={() => deleteNotice(params.row.id)}
          >
            <Button
              variant="outlined"
              color="warning"
              startIcon={<DeleteIcon fontSize="inherit" />}
            >
              {t["Delete"]}
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
        {t["Notices"]}
      </Typography>
      <Modal
        title={t["Edit Notice"]}
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

export default () => <WithAuthorization Children={Notices} isRoot={false} />;
