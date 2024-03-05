import { Button, Space } from "antd";
import { useRecoilState } from "recoil";
import { langState } from "@/utils/atom";

const LanguageSwitcher = () => {
  const [lang, setLang] = useRecoilState(langState);
  return (
    <Space>
      <Button
        type={lang !== "en" ? "primary" : "default"}
        onClick={() => setLang("en")}
        disabled={lang === "en"}
        style={{ color: "white" }}
      >
        English
      </Button>
      <Button
        type={lang !== "hi" ? "primary" : "default"}
        disabled={lang === "hi"}
        onClick={() => setLang("hi")}
        style={{ color: "white" }}
      >
        हिन्दी
      </Button>
    </Space>
  );
};

export default LanguageSwitcher;
