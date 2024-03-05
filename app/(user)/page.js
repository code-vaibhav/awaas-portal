"use client";

import { useState, useEffect } from "react";
import { Typography, List } from "antd";
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

  return (
    <div>
      <Typography.Title level={1} style={{ textAlign: "center" }}>
        {t["Notices"]}
      </Typography.Title>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 3,
        }}
        dataSource={notices}
        renderItem={(notice) => (
          <List.Item
            key={item.heading}
            extra={
              <img
                src={`https://docs.google.com/viewer?url=${notice.url}&pid=explorer&efh=false&a=v&chrome=false&embedded=true`}
              />
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
              description={notice.date}
            />
            {notice.type}
          </List.Item>
        )}
      />
    </div>
  );
}
