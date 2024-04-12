"use client";

import { useState } from "react";
import { Button, Form, Input, Descriptions, Space, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { langState } from "@/utils/atom";
import { useRecoilValue } from "recoil";
import text from "@/text.json";
import { Typography } from "@mui/material";
import { SuccessMessage, ErrorMessage } from "@/components/Notification";

export default function Status() {
  const [application, setApplication] = useState(null);
  const [processing, setProcessing] = useState(false);
  const t = text[useRecoilValue(langState)];

  const fetchStatus = (values) => {
    setProcessing(true);
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/application/active/info?id=${values.id}&mobile=${values.mobile}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setApplication(data.message);
          console.log(application);
          SuccessMessage(t["Application Loaded"]);
        } else {
          setApplication(null);
          console.error(data.message);
          ErrorMessage(t["Error Loading Application"]);
        }
      })
      .catch((err) => {
        console.error(err);
        ErrorMessage(t["Error Loading Application"]);
      })
      .finally(() => setProcessing(false));
  };

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom my={4}>
        {t["Check Allocation Status"]}
      </Typography>
      <Space
        direction="vertical"
        style={{ alignItems: "center", width: "100%" }}
      >
        <Form
          name="status"
          onFinish={fetchStatus}
          autoComplete="off"
          layout="inline"
          style={{ justifyContent: "center" }}
        >
          <Form.Item
            style={{ width: "max-content" }}
            label={t["Enter PNO or Registration No"]}
            name="id"
            required
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ width: "max-content" }}
            label={t["Mobile No"]}
            name="mobile"
            required
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={processing}>
              {processing && (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              )}{" "}
              {t["Submit"]}
            </Button>
          </Form.Item>
        </Form>
        {application && (
          <Descriptions
            title={t["Application Info"]}
            items={[
              {
                key: 1,
                label: t["Name"],
                children: application["name"],
              },
              {
                key: 2,
                label: t["PNO"],
                children: application["pno"],
              },
              {
                key: 3,
                label: t["Badge No"],
                children: application["badgeNumber"],
              },
              {
                key: 4,
                label: t["Rank"],
                children: application["rank"],
              },
              {
                key: 5,
                label: t["Application Date"],
                children: new Date(
                  application["applicationDate"]
                ).toLocaleDateString("en-GB"),
              },
              {
                key: 6,
                label: t["Registration No"],
                children: application["registrationNumber"],
              },
              {
                key: 7,
                label: t["Initial Waiting"],
                children: application["initialWaiting"],
              },
              {
                key: 8,
                label: t["Current Waiting"],
                children: application["currentWaiting"],
              },
              {
                key: 8,
                label: t["Mobile No"],
                children: application["mobile"],
              },
            ]}
            style={{
              width: "80%",
              margin: "auto",
            }}
          />
        )}
      </Space>
    </div>
  );
}
