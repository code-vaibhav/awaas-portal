"use client";

import { Layout, Menu, Flex, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "next-i18next";

const { Sider, Content, Header } = Layout;

export default function DashboardWrapper({ children }) {
  const pathname = usePathname();
  const { t } = useTranslation("common");

  return (
    <Layout style={{ minHeight: "100vh", background: "white" }}>
      <Header style={{ position: "sticky", top: "0", zIndex: 1000 }}>
        <Flex justify="space-between" align="center">
          <Link href="/">
            <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
              Awaas Portal
            </Typography.Title>
          </Link>

          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={
              pathname.split("/")[1] === ""
                ? ["1"]
                : pathname.split("/")[1] === "checkstatus"
                ? ["2"]
                : pathname.split("/")[1] === "contact"
                ? ["3"]
                : ["4"]
            }
            items={[
              { key: "1", label: <Link href="/">{t("Home")}</Link> },
              {
                key: "2",
                label: <Link href="/status">{t("Check PNO Status")}</Link>,
              },
              { key: "3", label: <Link href="/contact">{t("Contact")}</Link> },
              { key: "4", label: <Link href="/admin">{t("Admin")}</Link> },
              { key: "5", label: <LanguageSwitcher /> },
            ]}
          />
        </Flex>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            position: "sticky",
            left: 0,
            top: 0,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={
              pathname.split("/")[2] === "applications"
                ? pathname.split("/").length <= 3
                  ? ["1"]
                  : ["2"]
                : pathname.split("/")[2] === "notices"
                ? pathname.split("/").length <= 3
                  ? ["3"]
                  : ["4"]
                : ["5"]
            }
            theme="dark"
            style={{
              height: "100%",
              borderRight: 0,
              padding: "0 10px",
            }}
            items={[
              {
                key: "1",
                label: <Link href="/admin/applications">{t("Records")}</Link>,
              },
              {
                key: "2",
                label: (
                  <Link href="/admin/applications/add">{t("Add Records")}</Link>
                ),
              },
              {
                key: "3",
                label: <Link href="/admin/notices">{t("Notices")}</Link>,
              },
              {
                key: "4",
                label: <Link href="/admin/notices/add">{t("Add Notice")}</Link>,
              },
              {
                key: "5",
                label: <Link href="/admin/users">{t("Users")}</Link>,
              },
            ]}
          />
        </Sider>
        <Content
          style={{
            margin: 0,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
