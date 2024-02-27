"use client";

import { useState } from "react";
import { Button, Form, Input, Space } from "antd";

export default function Status() {
  const fetchStatus = (values) => {
    console.log(values);
    fetch(`${process.env.BACKEND_URL}/applications/${values.pno}`, {
      method: "GET",
      credentials: "include",
      cache: "no-cache",
    })
      .then((res) => {
        console.log(res);
        setApplication(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [application, setApplication] = useState({});

  return (
    <Space direction="vertical">
      <Form
        name="status"
        style={{
          maxWidth: 600,
        }}
        onFinish={fetchStatus}
        autoComplete="off"
        layout="inline"
      >
        <Form.Item label="PNO No" name="pno" required>
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
}
