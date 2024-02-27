import { useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

export default function EditApplication({
  application,
  open,
  setOpen,
  openNotification,
  fetchApplications,
}) {
  const [processing, setProcessing] = useState(false);

  const editApplication = (uid) => {
    setProcessing(true);
    fetch(`${process.env.BACKEND_URL}/applications/${uid}`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
    })
      .then((res) => {
        openNotification("success");
        fetchApplications();
      })
      .catch((err) => {
        console.error(err);
        openNotification("error");
      })
      .finally(() => {
        setOpen(false);
        setProcessing(false);
      });
  };

  return (
    <Modal title="Title" open={open} onOk={editApplication} footer={null}>
      <Form
        name="add_notice"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={editApplication}
        autoComplete="off"
        style={{ color: "#fff" }}
        initialValues={application}
      >
        <Form.Item label="PNO No" name="pno" required>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Name" name="name" required>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Rank" name="rank" required>
          <Select
            placeholder="Select Method"
            options={[
              { label: "Allocation", value: "allocation" },
              { label: "Something Else", value: "else" },
            ]}
          />
        </Form.Item>
        <Form.Item name="applied_at" label="Application Date" required>
          <Input type="text" placeholder="please specify" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={processing}>
            {processing && (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            )}
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
