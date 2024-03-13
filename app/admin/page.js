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
    if (auth) {
      router.push("/admin/records");
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
        onFinish={(values) =>
          logIn(values.email, values.password).then((user) => {
            user
              .getIdToken()
              .then((IdToken) => {
                setAuth({
                  user: user.email,
                  token: IdToken,
                  role: user?.customClaims?.role || "admin",
                });
                router.push("/admin/records");
              })
              .catch((err) => {
                console.error(err);
              });
          })
        }
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
