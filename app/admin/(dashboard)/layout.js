"use client";

import { Layout, Menu, Flex, Typography, Space, Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import GroupIcon from "@mui/icons-material/Group";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import FolderIcon from "@mui/icons-material/Folder";
import NoteIcon from "@mui/icons-material/Note";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { auth, logOut } from "@/utils/auth";
import { onAuthStateChanged } from "firebase/auth";
import { authState } from "@/utils/atom";

const { Sider, Content, Header } = Layout;

export default function DashboardWrapper({ children }) {
  const pathname = usePathname();
  const t = text[useRecoilValue(langState)];
  const setAuth = useSetRecoilState(authState);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      user.getIdToken().then((IdToken) => {
        setAuth({
          user: user.email,
          token: IdToken,
          role: user?.customClaims?.role || "admin",
        });
      });
    } else {
      setAuth(null);
    }
  });

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ position: "sticky", top: "0", zIndex: 1000 }}>
        <Flex justify="space-between" align="center">
          <Link href="/">
            <Typography.Title level={3} style={{ color: "white", margin: 0 }}>
              {t["Awaas Portal"]}
            </Typography.Title>
          </Link>

          <Space>
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
                {
                  key: "1",
                  label: <Link href="/">{t["Home"]}</Link>,
                  icon: <HomeIcon />,
                },
                {
                  key: "2",
                  label: (
                    <Link href="/status">{t["Check Allocation Status"]}</Link>
                  ),
                  icon: <InfoIcon />,
                },
                {
                  key: "3",
                  label: <Link href="/contact">{t["Contact"]}</Link>,
                  icon: <PhoneIcon />,
                },
                {
                  key: "4",
                  label: <Link href="/admin">{t["Admin"]}</Link>,
                  icon: <AdminPanelSettingsIcon />,
                },
              ]}
            />
            <LanguageSwitcher />
          </Space>
        </Flex>
      </Header>
      <Layout style={{ background: "white" }}>
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
              pathname.split("/")[2] === "records"
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
              borderRight: 0,
              padding: "0 10px",
            }}
            items={[
              {
                key: "1",
                label: <Link href="/admin/records">{t["Records"]}</Link>,
                icon: <FolderIcon />,
              },
              {
                key: "2",
                label: (
                  <Link href="/admin/records/add">{t["Add Records"]}</Link>
                ),
                icon: <CreateNewFolderIcon />,
              },
              {
                key: "3",
                label: <Link href="/admin/notices">{t["Notices"]}</Link>,
                icon: <NoteIcon />,
              },
              {
                key: "4",
                label: <Link href="/admin/notices/add">{t["Add Notice"]}</Link>,
                icon: <NoteAddIcon />,
              },
              {
                key: "5",
                label: <Link href="/admin/users">{t["Users"]}</Link>,
                icon: <GroupIcon />,
              },
              {
                key: "6",
                label: <Button onClick={logOut}>Logout</Button>,
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
