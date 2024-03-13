"use client";

import { useState, useEffect } from "react";
import { Typography, List, Spin } from "antd";
import { langState } from "@/utils/atom";
import { useRecoilValue } from "recoil";
import { AuditOutlined, CreditCardOutlined } from "@ant-design/icons";
import text from "@/text.json";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const lang = useRecoilValue(langState);
  const t = text[lang];

  useEffect(() => {
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
      <Typography.Title level={1} style={{ textAlign: "center" }}>
        {t["Notices"]}
      </Typography.Title>
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
