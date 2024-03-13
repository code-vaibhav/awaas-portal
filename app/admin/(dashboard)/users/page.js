"use client";

import { useState, useEffect, useRef } from "react";
import { Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Popconfirm, Space, Input, Form, Spin, Button } from "antd";
import { langState } from "@/utils/atom";
import { useRecoilValue } from "recoil";
import text from "@/text.json";
import WithAuthorization from "@/components/WithAuth";
import { SuccessMessage, ErrorMessage } from "@/components/Notification";
import { LoadingOutlined } from "@ant-design/icons";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [processing, setProcessing] = useState(false);
  const lang = useRecoilValue(langState);
  const t = text[lang];
  const form = useRef();

  const fetchUsers = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/manager/all`, {
      method: "GET",
      credentials: "include",
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
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/manager/delete?id=${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          SuccessMessage(t["User Deleted"]);
          fetchUsers();
        } else {
          console.error(data.message);
          ErrorMessage(t["Error Deleting User"]);
        }
      })
      .catch((err) => {
        console.error(err);
        ErrorMessage(t["Error Deleting User"]);
      })
      .finally(() => setProcessing(false));
  };

  const addUser = (values) => {
    setProcessing("add");
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/manager/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          form.current.resetFields();
          SuccessMessage(t["User Added"]);
          fetchUsers();
        } else {
          console.error(data.message);
          ErrorMessage(t["Error Adding User"]);
        }
      })
      .catch((err) => {
        console.error(err);
        ErrorMessage(t["Error Adding User"]);
      })
      .finally(() => setProcessing(false));
  };

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
      renderCell: (params) => <p>{params.row.customClaims.role}</p>,
    },
    {
      field: "action",
      headerName: t["Actions"],
      renderCell: (params) => (
        <Space>
          <Popconfirm
            placement="topLeft"
            title={"Are you sure to delete this user"}
            okText={t["Yes"]}
            cancelText={t["No"]}
            onConfirm={() => deleteUser(params.row.uid)}
          >
            <Button
              variant="outlined"
              color="warning"
              disabled={processing === params.row.uid}
              startIcon={<DeleteIcon fontSize="inherit" />}
            >
              {processing === params.row.uid && (
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
    <div className="root">
      <Typography variant="h4" component="h4" align="center" m={5}>
        {t["Users"]}
      </Typography>
      <Form
        ref={form}
        name="add_user"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={addUser}
        autoComplete="off"
        style={{ color: "#fff", marginBottom: "10px" }}
        layout="inline"
      >
        <Form.Item label={t["Email"]} name="email" required>
          <Input lang={lang} type="email" />
        </Form.Item>
        <Form.Item label={t["Password"]} name="password" required>
          <Input.Password lang={lang} type="text" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={processing === "add"}
          >
            {processing === "add" && (
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
        getRowClassName={() => "row"}
        slots={{ toolbar: GridToolbar }}
        disableExtendRowFullWidth
      />
    </div>
  );
};

// export default () => <WithAuthorization Children={Users} isRoot={true} />;
export default Users;
