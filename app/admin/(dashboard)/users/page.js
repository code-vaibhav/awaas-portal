"use client";

import { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { Popconfirm, notification, Space, Input, Form } from "antd";
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

const Users = ({ role }) => {
  const [users, setUsers] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [processing, setProcessing] = useState(false);
  const lang = useRecoilValue(langState);
  const t = text[lang];

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "topRight",
    });
  };

  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setUsers(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(fetchUsers, []);

  const deleteUser = (id) => {
    setProcessing(id);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete`, {
      method: "DELETE",
      body: { id },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          openNotification("success", t["User Deleted"]);
          fetchRecords();
        } else {
          console.error(data.message);
          openNotification("error", t["Error Deleting User"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Deleting User"]);
      })
      .finally(() => setProcessing(false));
  };

  const addUser = (values) => {
    setProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/manager/register`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      body: values,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          openNotification("success", t["User Added"]);
          fetchUsers();
        } else {
          console.error(data.message);
          openNotification("error", t["Error Adding User"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Adding User"]);
      })
      .finally(() => setProcessing(false));
  };

  const classes = useStyles();

  const columns = [
    {
      field: "email",
      headerName: t["Email"],
      flex: 1,
    },
    {
      field: "role",
      headerName: t["Role"],
      flex: 1,
    },
    {
      field: "action",
      headerName: t["Actions"],
      renderCell: (params) => (
        <Space>
          <Popconfirm
            placement="topLeft"
            title={t[`Are you sure to delete this user?`]}
            okText={t["Yes"]}
            cancelText={t["No"]}
            onConfirm={() => deleteUser(params.row.id)}
          >
            <Button
              variant="outlined"
              color="warning"
              disabled={processing}
              startIcon={<DeleteIcon fontSize="inherit" />}
            >
              {processing === params.row.id && (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              )}
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
        {t["Users"]}
      </Typography>
      <Form
        name="add_user"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={addUser}
        autoComplete="off"
        style={{ color: "#fff" }}
        layout="inline"
      >
        <Form.Item label={t["Email"]} name="email" required>
          <Input lang={lang} type="email" />
        </Form.Item>
        <Form.Item label={t["Password"]} name="password" required>
          <Input.Password lang={lang} type="text" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={processing}>
            {processing && (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            )}
            {t["Add User"]}
          </Button>
        </Form.Item>
      </Form>
      <DataGrid
        rows={users}
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

export default () => <WithAuthorization Children={Users} isRoot={true} />;
