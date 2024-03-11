"use client";

import { Typography } from "@mui/material";
import NoticeForm from "@/components/NoticeForm";
import { useRecoilValue } from "recoil";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import WithAuthorization from "@/components/WithAuth";

const AddNotice = () => {
  const t = text[useRecoilValue(langState)];

  return (
    <div>
      <Typography variant="h4" component="h4" align="center" m={5}>
        {t["Add Notice"]}
      </Typography>
      <NoticeForm mode="add" setOpen={() => {}} fetchNotices={() => {}} />
    </div>
  );
};

export default () => <WithAuthorization Children={AddNotice} isRoot={false} />;
