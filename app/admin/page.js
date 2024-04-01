"use client";

import { useEffect, useState } from "react";
import { Button, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import { logIn } from "@/utils/auth";
import { authState, langState } from "@/utils/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import text from "@/text.json";
import { ErrorMessage } from "@/components/Notification";

export default function Login() {
  const router = useRouter();
  const lang = useRecoilValue(langState);
  const [auth, setAuth] = useRecoilState(authState);
  const t = text[lang];
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (auth) {
      router.push("/admin/records");
      return;
    }

    if (localStorage.getItem("auth")) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/check`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("auth")).token
          }`,
        },
      })
        .then((res) => {
          if (res.status === 401) {
            localStorage.removeItem("auth");
          } else {
            setAuth(JSON.parse(localStorage.getItem("auth")));
            router.push("/admin/records");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const onFinish = async (values) => {
    setProcessing(true);
    try {
      const user = await logIn(values.email, values.password);
      const idTokenResult = await user.getIdTokenResult();
      setAuth({
        user: user.email,
        token: user.accessToken,
        role: idTokenResult.claims.role,
      });
      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: user.email,
          token: user.accessToken,
          role: idTokenResult.claims.role,
        })
      );
      router.push("/admin/records");
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
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

        <Button
          loading={processing}
          type="primary"
          htmlType="submit"
          style={{ marginLeft: "50%", transform: "translateX(-50%)" }}
        >
          {t["Submit"]}
        </Button>
      </Form>
    </div>
  );
}
