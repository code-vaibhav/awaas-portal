"use client";

import { useState, useEffect } from "react";
import { List, Spin, Flex, Collapse } from "antd";
import { Typography } from "@mui/material";
import { langState } from "@/utils/atom";
import { useRecoilValue } from "recoil";
import { AuditOutlined, CreditCardOutlined } from "@ant-design/icons";
import text from "@/text.json";
import Link from "next/link";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const lang = useRecoilValue(langState);
  const t = text[lang];
  const [client, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/all`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setNotices(data.message);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return notices.length ? (
    <div>
      <Flex
        style={{ backgroundColor: "#d5f2fe" }}
        align="center"
        justify="space-evenly"
        vertical={client && window.innerWidth < 768}
      >
        <img
          src="1.png"
          alt="landing_image"
          style={{
            width: client && window.innerWidth < 768 ? "70%" : "40%",
            paddingTop: client && window.innerWidth < 768 ? "40px" : 0,
            maxWidth: "500px",
          }}
        />
        <div
          style={{
            marginBottom: client && window.innerWidth < 768 ? "10%" : "5%",
            textAlign: "center",
          }}
        >
          <Typography variant="h3" component="h3" align="center" m={5}>
            {t["Awas Portal"]}
          </Typography>
          <Typography variant="h5" component="h5">
            <Link
              href="/status"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              {t["Check Allocation Status"]}
            </Link>
          </Typography>
        </div>
      </Flex>

      <Typography variant="h4" align="center" my={4}>
        {t["Notices"]}
      </Typography>
      <div style={{ width: "70%", margin: "auto" }}>
        <List
          itemLayout="vertical"
          size="small"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5,
          }}
          dataSource={notices.sort(
            (a, b) => new Date(b.releasedOn) - new Date(a.releasedOn)
          )}
          renderItem={(notice) => (
            <List.Item
              key={notice.heading}
              extra={
                <div className="pdf-container">
                  <div className="pdf-link">
                    <iframe
                      src={notice.url}
                      title="PDF Preview"
                      width="100%"
                      className="pdf-iframe"
                    ></iframe>
                  </div>
                  <a target="_blank" href={notice.url} className="pdf-overlay">
                    View
                  </a>
                </div>
              }
            >
              <List.Item.Meta
                avatar={
                  notice.type === "allotment" ? (
                    <AuditOutlined />
                  ) : (
                    <CreditCardOutlined />
                  )
                }
                title={
                  <a target="_blank" href={notice.url}>
                    {notice.heading}
                  </a>
                }
                description={new Date(notice.releasedOn).toLocaleDateString(
                  "en-GB"
                )}
              />
              {notice.type}
            </List.Item>
          )}
        />
      </div>
    </div>
  ) : (
    <Spin spinning={true} fullscreen />
  );
}
