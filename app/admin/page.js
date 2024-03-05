"use client";

import { useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import { logIn } from "../../utils/auth";
import { langState } from "../../utils/atom";
import { useRecoilValue } from "recoil";
import text from "@/text.json";
import { getUser } from "../../utils/auth";

export default function Login() {
  const router = useRouter();
  const lang = useRecoilValue(langState);
  const t = text[lang];

  useEffect(() => {
    if (getUser) {
      router.push("/admin/records/add");
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Typography.Title level={3}>{t["Login"]}</Typography.Title>
      <Form
        name="login"
        style={{
          maxWidth: "500px",
          width: "90%",
        }}
        onFinish={(values) => logIn(values.email, values.password, router)}
        autoComplete="off"
      >
        <Form.Item label={t["Email"]} name="email" required>
          <Input lang={lang} type="email" />
        </Form.Item>

        <Form.Item label={t["Password"]} name="password" required>
          <Input.Password lang={lang} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 12,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            {t["Submit"]}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
