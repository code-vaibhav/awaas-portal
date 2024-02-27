import { List, Divider, Typography, Flex } from "antd";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="footer" style={{ padding: "50px 10%" }}>
      <Flex justify="flex-start">
        <div>
          <Typography.Title level={5}>PROF. JAYANT K SINGH</Typography.Title>
          <Typography.Paragraph style={{ width: "30%", marginRight: "10%" }}>
            Department of Chemical Engineering Indian Institute of Technology
            KANPUR-208016 India; Office: 469, Faculty Building (FB) <br /> Lab:
            Northern Lab.-II, 202A and 202B <br /> Email:{" "}
            <a href="mailto:jayantks@iitk.ac.in">jayantks@iitk.ac.in</a>
          </Typography.Paragraph>
        </div>

        <List
          size="small"
          header={<Typography.Title level={5}>Quick Links</Typography.Title>}
          dataSource={[<Link href="/">Home</Link>, "About", "Contact"]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Flex>
      <Divider />
      <Typography.Paragraph style={{ textAlign: "center" }}>
        © Copyright 2023. All Rights Reserved
      </Typography.Paragraph>
    </div>
  );
}
