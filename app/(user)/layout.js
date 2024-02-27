"use client";

import { Inter } from "next/font/google";
import "../globals.css";
import { Layout, Menu, Typography, Flex } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { useTranslation } from "next-i18next";

const { Header, Content, Footer: FooterContainer } = Layout;
const { Title } = Typography;

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const currentURL = usePathname();
  const { t } = useTranslation("common");

  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ position: "sticky", top: "0", zIndex: 1000 }}>
            <Flex justify="space-between" align="center">
              <Link href="/">
                <Title level={3} style={{ color: "white", margin: 0 }}>
                  {t("Awaas Portal")}
                </Title>
              </Link>

              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={
                  currentURL.split("/")[1] === ""
                    ? ["1"]
                    : currentURL.split("/")[1] === "checkstatus"
                    ? ["2"]
                    : ["3"]
                }
                items={[
                  { key: "1", label: <Link href="/">{t("Home")}</Link> },
                  {
                    key: "2",
                    label: <Link href="/status">{t("Check PNO Status")}</Link>,
                  },
                  {
                    key: "3",
                    label: <Link href="/contact">{t("Contact")}</Link>,
                  },
                  { key: "4", label: <Link href="/admin">{t("Admin")}</Link> },
                ]}
              />
            </Flex>
          </Header>
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
      </body>
    </html>
  );
}
