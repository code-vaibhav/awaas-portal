"use client";

import { useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import { logIn } from "@/utils/auth";
import { authState, langState } from "@/utils/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import text from "@/text.json";

export default function Login() {
  const router = useRouter();
  const lang = useRecoilValue(langState);
  const [auth, setAuth] = useRecoilState(authState);
  const t = text[lang];

  useEffect(() => {
    // Redirect if already authenticated
    if (auth) {
      router.push("/admin/records");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      const user = await logIn(values.email, values.password);
      const IdToken = await user.getIdToken();
      setAuth({
        user: user.email,
        token: IdToken,
        role: user?.customClaims?.role || "admin",
      });
      router.push("/admin/records");
    } catch (err) {
      console.error(err);
    }
  };

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
      <Typography.Title level={3} style={{ marginBottom: 24 }}>
        {t["Login"]}
      </Typography.Title>
      <Form
        name="login"
        style={{ maxWidth: 500, width: "90%" }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t["Email"]}
          name="email"
          required
          style={{ marginBottom: 16 }}
        >
          <Input lang={lang} type="email" />
        </Form.Item>

        <Form.Item
          label={t["Password"]}
          name="password"
          required
          style={{ marginBottom: 24 }}
        >
          <Input.Password lang={lang} />
        </Form.Item>

        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          {t["Submit"]}
        </Button>
      </Form>
    </div>
  );
}
