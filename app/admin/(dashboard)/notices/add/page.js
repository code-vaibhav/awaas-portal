"use client";

import { notification } from "antd";
import { Typography } from "@mui/material";
import NoticeForm from "@/components/NoticeForm";

export default function AddNotice() {
  const message = {
    success: "Notice Successfully Added",
    error: "Error in adding notice, please try again",
  };
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type) => {
    api[type]({
      message: message[type],
      placement: "topRight",
    });
  };

  return (
    <div>
      {contextHolder}
      <Typography variant="h4" component="h4" align="center" m={5}>
        Add Notice
      </Typography>
      <NoticeForm
        mode="add"
        setOpen={() => {}}
        openNotification={openNotification}
        fetchNotices={() => {}}
      />
    </div>
  );
}
