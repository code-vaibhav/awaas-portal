"use client";

import { useState } from "react";
import {
  Input,
  Button,
  Space,
  Form,
  Upload,
  notification,
  Spin,
  Select,
  DatePicker,
} from "antd";
import { Typography } from "@mui/material";
import { LoadingOutlined } from "@ant-design/icons";

export default function AddApplication() {
  const [processing, setProcessing] = useState(false);
  const message = {
    success: "Applications Added Successfully",
    error: "Error in adding applications, please try again",
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (type) => {
    api[type]({
      message: message[type],
      placement: "topRight",
    });
  };

  const addApplication = (data) => {
    setProcessing(true);

    if (data.method === "sheet") {
      const reader = new FileReader();

      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, {
          type: "array",
        });

        // Assuming your Excel file has a sheet named 'Sheet1'
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Parse the sheet data into a JSON object
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log("Parsed Excel Data:", jsonData);

        fetch(`${process.env.BACKEND_URL}/addApplications`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            openNotification("success");
          })
          .catch((err) => {
            console.error(err);
            openNotification("error");
          })
          .finally(() => setProcessing(false));
      };

      reader.readAsArrayBuffer(data.excel_sheet.originFileObj);
    } else {
      const jsonData = Array.from({ length: getFieldValue("count") ?? 0 }).map(
        (_, idx) => ({
          Name: data[`name_${idx}`],
          Rank: data[`rank_${idx}`],
          PNO_No: data[`pno_${idx}`],
          Application_Date: data[`date_${idx}`],
        })
      );

      fetch(`${process.env.BACKEND_URL}/addApplications`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          openNotification("success");
        })
        .catch((err) => {
          console.error(err);
          openNotification("error");
        })
        .finally(() => setProcessing(false));
    }
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const beforeUpload = () => false;

  return (
    <div>
      {contextHolder}
      <Typography variant="h4" component="h4" align="center" m={5}>
        Add Application
      </Typography>
      <Form
        name="add_application"
        onFinish={addApplication}
        autoComplete="off"
        style={{ color: "#fff" }}
        labelWrap
      >
        <Space
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Form.Item
            label="Input Method"
            name="method"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Select Method"
              options={[
                { label: "Excel Sheet", value: "sheet" },
                { label: "Manual Input", value: "manual" },
              ]}
            />
          </Form.Item>
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.method !== currentValues.method
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("method") && (
                <Space
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  {getFieldValue("method") === "manual" ? (
                    <Form.Item
                      label="Enter Application Count"
                      name="count"
                      required
                      style={{ minWidth: "max-content" }}
                    >
                      <Input type="number" placeholder="Application Count" />
                    </Form.Item>
                  ) : (
                    <Form.Item
                      name="excel_sheet"
                      required
                      style={{ minWidth: "max-content" }}
                    >
                      <Upload
                        name="logo"
                        customRequest={dummyRequest}
                        beforeUpload={beforeUpload}
                        listType="picture"
                      >
                        <Button
                          variant="contained"
                          component="span"
                          disabled={processing}
                        >
                          Select Excel Sheet
                        </Button>
                      </Upload>
                    </Form.Item>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={processing}
                  >
                    {processing && (
                      <Spin
                        indicator={
                          <LoadingOutlined style={{ fontSize: 24 }} spin />
                        }
                      />
                    )}
                    Submit
                  </Button>
                </Space>
              )
            }
          </Form.Item>
        </Space>
        <Form.Item
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.count !== currentValues.count ||
            prevValues.method !== currentValues.method
          }
          noStyle
        >
          {({ getFieldValue }) =>
            getFieldValue("method") === "manual" &&
            Array.from({ length: getFieldValue("count") ?? 0 }).map(
              (_, idx) => (
                <Space
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "flex-start",
                    width: "100%",
                  }}
                >
                  <Form.Item label="PNO No" name={`pno_${idx}`} required>
                    <Input id="pno_no" type="text" placeholder="Enter PNO No" />
                  </Form.Item>
                  <Form.Item label="Name" name={`name_${idx}`} required>
                    <Input id="name" type="text" placeholder="Enter Name" />
                  </Form.Item>
                  <Form.Item label="Rank" name={`rank_${idx}`} required>
                    <Input id="rank" type="text" placeholder="Enter Rank" />
                  </Form.Item>
                  <Form.Item label="Badge No" name={`badge_${idx}`} required>
                    <Input
                      id="badge"
                      type="text"
                      placeholder="Enter Badge No"
                    />
                  </Form.Item>
                  <Form.Item label="Mobile No" name={`mobile_${idx}`}>
                    <Input
                      id="mobile"
                      type="number"
                      placeholder="Enter Mobile No"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Application Date"
                    name={`date_${idx}`}
                    required
                    style={{ minWidth: "max-content" }}
                  >
                    <DatePicker />
                  </Form.Item>
                </Space>
              )
            )
          }
        </Form.Item>
      </Form>
    </div>
  );
}
