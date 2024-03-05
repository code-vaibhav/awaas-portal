import { useState } from "react";
import { Form, Input, Select, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { langState } from "@/utils/atom";
import text from "@/text.json";

export default function NoticeForm({
  mode,
  notice,
  setOpen,
  openNotification,
  fetchNotices,
}) {
  const [processing, setProcessing] = useState(false);
  const t = text[useRecoilValue(langState)];

  const addNotice = (values) => {
    console.log(values);
    setProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/add`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          openNotification("success", t["Notice Added"]);
          setOpen(false);
        } else {
          console.error(data.message);
          openNotification("error", t["Error Adding Notice"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Adding Notice"]);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const editNotice = (values) => {
    setProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/update`, {
      method: "POST",
      credentials: "include",
      cache: "no-cache",
      body: JSON.stringify({ id: values.id, data: values }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          openNotification("success", t["Notice Updated"]);
          fetchNotices();
          setOpen(false);
        } else {
          console.error(data.message);
          openNotification("error", t["Error Updating Notice"]);
        }
      })
      .catch((err) => {
        console.error(err);
        openNotification("error", t["Error Updating Notice"]);
      })
      .finally(() => {
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
      <Form.Item label={t["Heading"]} name="heading" required>
        <Input type="text" />
      </Form.Item>
      <Form.Item label={t["File URL"]} name="url" required>
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label={t["Notice Type"]}
        name="type"
        required
        style={{ marginBottom: "10px" }}
      >
        <Select
          options={[
            { label: t["Allocation"], value: "allocation" },
            { label: t["Something Else"], value: "else" },
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
              wrapperCol={{ span: 16, offset: 8 }}
            >
              <Input type="text" placeholder={t["Please Specify"]} />
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
                            labelCol: { span: 8 },
                            wrapperCol: { span: 16 },
                          }
                        : {
                            wrapperCol: { span: 16, offset: 8 },
                          })}
                      label={index === 0 ? t["PNOs"] : ""}
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
                          placeholder={t["Enter PNO"]}
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
                  <Form.Item wrapperCol={{ offset: 8 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      style={{
                        width: "60%",
                      }}
                      icon={<PlusOutlined />}
                    >
                      {t["Add PNO"]}
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
            {t["Submit"]}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
}
