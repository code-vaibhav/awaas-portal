"use client";

import { useState } from "react";
import { Layout, Menu, Typography, Flex, Space, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { useRecoilValue } from "recoil";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";

const { Header, Content, Footer: FooterContainer } = Layout;
const { Title } = Typography;

const RootLayout = ({ children }) => {
  const currentURL = usePathname();
  const lang = useRecoilValue(langState);
  const t = text[lang];

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: "1",
      label: <Link href="/">{t["Home"]}</Link>,
      icon: <HomeIcon />,
    },
    {
      key: "2",
      label: <Link href="/status">{t["Check Allocation Status"]}</Link>,
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
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        fontFamily: lang === "hi" ? "Mangal" : "Roboto",
      }}
    >
      <Header style={{ position: "sticky", top: "0", zIndex: 1000 }}>
        <Flex justify="space-between" align="center" className="padding">
          <MenuOutlined
            className="mobile"
            onClick={() => setIsDrawerVisible(true)}
            style={{ fontSize: "1.5rem", color: "white", cursor: "pointer" }}
          />
          <Link href="/">
            <Title level={3} style={{ color: "white", margin: 0 }}>
              {t["Awaas Portal"]}
            </Title>
          </Link>

          <Space className="desktop">
            <Menu
              theme="dark"
              mode="horizontal"
              disabledOverflow
              defaultSelectedKeys={
                currentURL.split("/")[1] === ""
                  ? ["1"]
                  : currentURL.split("/")[1] === "status"
                  ? ["2"]
                  : currentURL.split("/")[1] === "contact"
                  ? ["3"]
                  : ["4"]
              }
              items={menuItems}
            />
            <LanguageSwitcher />
          </Space>
        </Flex>
      </Header>

      <Drawer
        placement="left"
        closable={true}
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        width={200}
        style={{
          width: "max-content",
          background: "#001529",
          body: { padding: 0 },
        }}
        closeIcon={<CloseIcon style={{ color: "white" }} />}
      >
        <Space direction="vertical" align="center">
          <Menu
            theme="dark"
            mode="vertical"
            defaultSelectedKeys={[]}
            items={menuItems}
          />
          <LanguageSwitcher />
        </Space>
      </Drawer>

      <Content
        style={{
          margin: 0,
          minHeight: "100%",
          backgroundColor: "white",
          paddingBottom: "50px",
        }}
      >
        {children}
      </Content>

      <FooterContainer>
        <Footer />
      </FooterContainer>
    </Layout>
  );
};

export default RootLayout;
