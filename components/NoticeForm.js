import { useState } from "react";
import { Form, Input, Select, Space, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export default function NoticeForm({
  mode,
  notice,
  setOpen,
  openNotification,
  fetchNotices,
}) {
  const [processing, setProcessing] = useState(false);

  const addNotice = (values) => {
    console.log(values);
    setProcessing(true);
    fetch(`${process.env.BACKEND_URL}/addNotice`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      body: JSON.stringify(values),
    })
      .then((res) => {
        openNotification("success");
        fetchNotices();
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

  const editNotice = (uid) => {
    setProcessing(true);
    fetch(`${process.env.BACKEND_URL}/notice/${uid}`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
    })
      .then((res) => {
        openNotification("success");
        fetchNotices();
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
    <Form
      name="add_notice"
      labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
      wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
      onFinish={mode === "add" ? addNotice : editNotice}
      autoComplete="off"
      initialValues={mode === "edit" ? notice : null}
      style={{ width: "90%", maxWidth: "600px", margin: "auto" }}
    >
      <Form.Item label="Heading" name="heading" required>
        <Input type="text" />
      </Form.Item>
      <Form.Item label="File URL" name="url" required>
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label="Notice Type"
        name="type"
        required
        style={{ marginBottom: "10px" }}
      >
        <Select
          placeholder="Select Notice Type"
          options={[
            { label: "Allocation", value: "allocation" },
            { label: "Something Else", value: "else" },
          ]}
        />
      </Form.Item>
      <Form.Item
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.type !== currentValues.type
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("type") &&
          (getFieldValue("type") === "else" ? (
            <Form.Item
              name="type_text"
              required
              wrapperCol={{ xs: { span: 24 }, sm: { span: 16, offset: 8 } }}
            >
              <Input type="text" placeholder="please specify" />
            </Form.Item>
          ) : (
            <Form.List
              name="pnos"
              rules={[
                {
                  validator: async (_, pno) => {
                    if (!pno) {
                      return Promise.reject(new Error("Enter at least 1 pno"));
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field, index) => (
                    <Form.Item
                      {...(index === 0
                        ? {
                            labelCol: {
                              xs: { span: 24 },
                              sm: { span: 8 },
                            },
                            wrapperCol: {
                              xs: { span: 24 },
                              sm: { span: 16 },
                            },
                          }
                        : {
                            wrapperCol: {
                              xs: { span: 24 },
                              sm: { span: 16, offset: 8 },
                            },
                          })}
                      label={index === 0 ? "Pno No" : ""}
                      required={false}
                      key={field.key}
                      style={{ marginBottom: "10px" }}
                    >
                      <Form.Item
                        {...field}
                        validateTrigger={["onChange", "onBlur"]}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                        noStyle
                      >
                        <Input
                          placeholder="Enter Pno"
                          style={{
                            width: "85%",
                          }}
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                        />
                      ) : null}
                    </Form.Item>
                  ))}
                  <Form.Item
                    wrapperCol={{
                      sm: { offset: 8 },
                    }}
                  >
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{
                        width: "60%",
                      }}
                      icon={<PlusOutlined />}
                    >
                      Add Pno No
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </>
              )}
            </Form.List>
          ))
        }
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button type="primary" htmlType="submit" disabled={processing}>
            {processing && (
              <Spin
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              />
            )}
            Submit
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
