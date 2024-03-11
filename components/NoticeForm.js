import { useState } from "react";
import { Form, Input, Select, Button, Spin, Upload } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useRecoilValue } from "recoil";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import { SuccessMessage, ErrorMessage } from "./Notification";

export default function NoticeForm({ mode, notice, setOpen, fetchNotices }) {
  const [processing, setProcessing] = useState(false);
  const t = text[useRecoilValue(langState)];

  const addNotice = (values) => {
    console.log(values);
    setProcessing(true);

    const formData = new FormData();
    formData.append("file", values.file);
    formData.append("heading", values.heading);
    formData.append(
      "type",
      values.type === "allocation" ? values.type : values.type_text
    );
    if (values.type === "allocation")
      formData.append("pnos", JSON.stringify(values.pnos));

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/${
        values.type === "allocation" ? "allot" : "general"
      }`,
      {
        method: "PUT",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
        credentials: "include",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          SuccessMessage(t["Notice Added"]);
          setOpen(false);
        } else {
          console.error(data.message);
          ErrorMessage(t["Error Adding Notice"]);
        }
      })
      .catch((err) => {
        console.error(err);
        ErrorMessage(t["Error Adding Notice"]);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const editNotice = (values) => {
    setProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/update`, {
      method: "POST",
      // credentials: "include",
      body: JSON.stringify({ id: values.id, data: values }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          SuccessMessage(t["Notice Updated"]);
          fetchNotices();
          setOpen(false);
        } else {
          console.error(data.message);
          ErrorMessage(t["Error Updating Notice"]);
        }
      })
      .catch((err) => {
        console.error(err);
        ErrorMessage(t["Error Updating Notice"]);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const beforeUpload = () => false;

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
      <Form.Item
        valuePropName="file"
        label={t["Upload File"]}
        name="file"
        required
      >
        <Upload
          name="logo"
          customRequest={dummyRequest}
          beforeUpload={beforeUpload}
          listType="picture"
          accept=".pdf"
          valuePropName="file"
        >
          <Button variant="contained" component="span" disabled={processing}>
            {t["Select File"]}
          </Button>
        </Upload>
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
