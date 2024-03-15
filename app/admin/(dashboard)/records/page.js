"use client";

import { Typography } from "@mui/material";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import WithAuthorization from "@/components/WithAuth";
import { useRecoilValue } from "recoil";
import ArchivedRecords from "@/components/ArchivedRecords";
import PendingRecords from "@/components/PendingRecords";
import { Tabs } from "antd";

const Records = () => {
  const t = text[useRecoilValue(langState)];

  return (
    <div>
      <Typography variant="h4" component="h4" align="center" m={5}>
        {t["Records"]}
      </Typography>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: t["Pending"],
            children: <PendingRecords />,
          },
          {
            key: "2",
            label: t["Alloted"],
            children: <ArchivedRecords />,
          },
        ]}
        centered
      />
    </div>
  );
};

// export default () => <WithAuthorization Children={Records} isRoot={false} />;
export default Records;
