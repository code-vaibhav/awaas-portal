import { useState } from "react";
import { Modal, Form, Input, Select, Button, DatePicker } from "antd";
import { useRecoilValue } from "recoil";
import { langState } from "@/utils/atom";
import text from "@/text.json";

export default function EditRecord({
  record,
  open,
  setOpen,
  openNotification,
  fetchApplications,
}) {
  const [processing, setProcessing] = useState(false);
  const lang = useRecoilValue(langState);
  const t = text[lang];

  const editRecord = (values) => {
    setProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/application/update`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      body: { id: record.id, data: values },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          openNotification("success", t["Record Updated"]);
          fetchApplications();
          setOpen(false);
        } else {
          console.error(data.message);
          openNotification("error", t["Error Updating Record"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Updating Record"]);
      })
      .finally(() => setProcessing(false));
  };

  return (
    <Modal title="Edit Record" open={open} footer={null}>
      <Form
        name="edit_record"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={editRecord}
        autoComplete="off"
        style={{ color: "#fff" }}
        initialValues={record}
      >
        <Form.Item
          label={t["Registration No"]}
          name="registrationNumber"
          required
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label={t["Name"]} name="name" required>
          <Input lang={lang} type="text" />
        </Form.Item>
        <Form.Item
          label={t["Application Date"]}
          name="applicationDate"
          required
        >
          <DatePicker />
        </Form.Item>
        <Form.Item label={t["Rank"]} name="rank" required>
          <Select
            placeholder={t["Select Rank"]}
            options={[
              { label: t["Inspector"], value: "inspector" },
              { label: t["SI"], value: "si" },
              { label: t["Stenos"], value: "stenos" },
              { label: t["Constable"], value: "manual" },
              { label: t["HC"], value: "hc" },
              {
                label: t["4th Class Follower"],
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

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={processing}>
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
