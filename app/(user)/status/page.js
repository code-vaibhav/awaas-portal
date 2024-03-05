"use client";

import { useState } from "react";
import { Button, Form, Input, Descriptions, Typography, Space } from "antd";
import { langState } from "@/utils/atom";
import { useRecoilValue } from "recoil";
import text from "@/text.json";

export default function Status() {
  const fetchStatus = (values) => {
    console.log(values);
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/application/active/info?id=${values.id}`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setApplication(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [application, setApplication] = useState();
  const t = text[useRecoilValue(langState)];

  return (
    <div>
      <Typography.Title level={2} style={{ textAlign: "center" }}>
        {t["Check Allocation Status"]}
      </Typography.Title>
      <Space
        direction="vertical"
        style={{ alignItems: "center", width: "100%" }}
      >
        <Form
          name="status"
          onFinish={fetchStatus}
          autoComplete="off"
          layout="inline"
        >
          <Form.Item
            style={{ width: "max-content" }}
            label={t["Enter PNO or Registration No"]}
            name="id"
            required
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {t["Submit"]}
            </Button>
          </Form.Item>
        </Form>
        {application && (
          <Descriptions
            title="Application Info"
            items={Object.keys(application).map((k) => ({
              key: k,
              label: k.toLocaleUpperCase(),
              value: application[k],
            }))}
          />
        )}
      </Space>
    </div>
  );
}
