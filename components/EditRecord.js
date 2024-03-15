import { useState } from "react";
import { Modal, Form, Input, Select, Button, Spin } from "antd";
import { useRecoilValue } from "recoil";
import { langState, authState } from "@/utils/atom";
import text from "@/text.json";
import { SuccessMessage, ErrorMessage } from "./Notification";
import { LoadingOutlined } from "@ant-design/icons";

export default function EditRecord({ record, open, setOpen, fetchRecords }) {
  const [processing, setProcessing] = useState(false);
  const lang = useRecoilValue(langState);
  const auth = useRecoilValue(authState);
  const t = text[lang];

  const editRecord = (values) => {
    setProcessing(true);
    console.log(values);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/application/update`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth?.token}`,
      },
      body: JSON.stringify({ id: record.id, data: values }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          SuccessMessage(t["Record Updated"]);
          fetchRecords();
          setOpen(false);
        } else {
          console.error(data.message);
          ErrorMessage(t["Error Updating Record"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Updating Record"]);
      })
      .finally(() => setProcessing(false));
  };

  return (
    <Modal
      title={t["Edit Record"]}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
    >
      <Form
        name="edit_record"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 16 }}
        onFinish={editRecord}
        autoComplete="off"
        style={{ color: "#fff" }}
        labelAlign="left"
        initialValues={{
          registrationNumber: record?.registrationNumber || "",
          name: record?.name || "",
          rank: record?.rank || "",
          pno: record?.pno || "",
          badgeNumber: record?.badgeNumber || "",
          mobile: record?.mobile || "",
        }}
      >
        <Form.Item label={t["Registration No"]} name="registrationNumber">
          <Input lang={lang} type="number" />
        </Form.Item>
        <Form.Item label={t["Name"]} name="name">
          <Input lang={lang} type="text" />
        </Form.Item>
        <Form.Item label={t["Rank"]} name="rank">
          <Select
            placeholder={t["Select Rank"]}
            options={[
              { label: t["inspector"], value: "inspector" },
              { label: t["si"], value: "si" },
              { label: t["stenos"], value: "stenos" },
              { label: t["constable"], value: "constable" },
              { label: t["hc"], value: "hc" },
              {
                label: t["follower"],
                value: "follower",
              },
            ]}
          />
        </Form.Item>
        <Form.Item label={t["PNO"]} name="pno">
          <Input type="number" />
        </Form.Item>
        <Form.Item label={t["Badge No"]} name="badgeNumber">
          <Input type="number" />
        </Form.Item>
        <Form.Item label={t["Mobile No"]} name="mobile">
          <Input type="number" />
        </Form.Item>
        <Form.Item style={{ margin: "auto" }} wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={processing}
            style={{ marginLeft: "50%", transform: "translateX(-50%)" }}
          >
            {processing && (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            )}
            {t["Submit"]}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
