"use client";

import { notification } from "antd";
import { Typography } from "@mui/material";
import NoticeForm from "@/components/NoticeForm";
import { useRecoilValue } from "recoil";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import WithAuthorization from "@/components/WithAuth";

const AddNotice = ({ role }) => {
  const [api, contextHolder] = notification.useNotification();
  const t = text[useRecoilValue(langState)];

  const openNotification = (type, message) => {
    api[type]({
      message: message,
      placement: "topRight",
    });
  };

  return (
    <div>
      {contextHolder}
      <Typography variant="h4" component="h4" align="center" m={5}>
        {t["Add Notice"]}
      </Typography>
      <NoticeForm
        mode="add"
        setOpen={() => {}}
        openNotification={openNotification}
        fetchNotices={() => {}}
      />
    </div>
  );
};

export default () => <WithAuthorization Children={AddNotice} isRoot={false} />;
