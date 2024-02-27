"use client";

import { Button, Form, Input } from "antd";

export default function Admin() {
  const submitCreds = (values) => {
    console.log("Success:", values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Form
        name="login"
        style={{
          maxWidth: "500px",
          width: "90%",
        }}
        onFinish={submitCreds}
        autoComplete="off"
      >
        <Form.Item label="Username" name="username" required>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" required>
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 12,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
