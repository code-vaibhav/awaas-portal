"use client";

import { Typography } from "@mui/material";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import { useRecoilValue } from "recoil";
import ArchivedRecords from "@/components/ArchivedRecords";
import PendingRecords from "@/components/PendingRecords";
import { Tabs } from "antd";
import { useRecoilState } from "recoil";
import { authState } from "@/utils/atom";
import { useState, useEffect } from "react";
import { checkAuth } from "@/utils/auth";

export const waitingLists = {
  rank1: ["inspector", "si", "stenos"],
  rank2: ["constable", "hc", "follower"],
};

const Records = () => {
  const t = text[useRecoilValue(langState)];
  const [auth, setAuth] = useRecoilState(authState);
  const [pendingRecords, setPendingRecords] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [archivedRecords, setArchivedRecords] = useState([]);
  const [archivedLoading, setArchivedLoading] = useState(false);

  const fetchPendingRecords = () => {
    setPendingLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/application/active/all`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => checkAuth(res, setAuth))
      .then((data) => {
        if (data.status) {
          setPendingRecords(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setPendingLoading(false));
  };

  const fetchArchivedRecords = () => {
    setArchivedLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/application/archive/all`, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    })
      .then((res) => checkAuth(res, setAuth))
      .then((data) => {
        if (data.status) {
          setArchivedRecords(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setArchivedLoading(false));
  };

  useEffect(() => {
    fetchPendingRecords();
    fetchArchivedRecords();
  }, []);

  return (
    <div>
      <Typography variant="h4" component="h4" align="center" m={5}>
        {t["Records"]}
      </Typography>
      <Tabs
        defaultActiveKey="1"
        items={[
          ...Object.keys(waitingLists).map((key, idx) => ({
            key: idx,
            label: `${t["Pending"]} List ${idx + 1}`,
            children: (
              <PendingRecords
                records={pendingRecords.filter((record) => record.rank === key)}
                fetchRecords={fetchPendingRecords}
                loading={pendingLoading}
              />
            ),
          })),
          ...Object.keys(waitingLists).map((key, idx) => ({
            key: Object.keys(waitingLists).length + idx,
            label: `${t["Alloted"]} List ${idx + 1}`,
            children: (
              <ArchivedRecords
                records={archivedRecords.filter(
                  (record) => record.rank === key
                )}
                loading={archivedLoading}
              />
            ),
          })),
        ]}
        centered
      />
    </div>
  );
};

export default Records;
