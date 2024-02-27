// components/LanguageSwitcher.js
import { useTranslation } from "next-i18next";
import { Button, Space } from "antd";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <Space>
      <Button onClick={() => changeLanguage("en")}>English</Button>
      <Button onClick={() => changeLanguage("hi")}>हिन्दी</Button>
    </Space>
  );
};

export default LanguageSwitcher;
