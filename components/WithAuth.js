import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "@/utils/atom";
import { useRouter } from "next/navigation";
import { WarningMessage } from "./Notification";
import { langState } from "@/utils/atom";
import text from "@/text.json";
import { Spin } from "antd";

const WithAuthorization = ({ Children, isRoot }) => {
  const auth = useRecoilValue(authState);
  const router = useRouter();
  const t = text[useRecoilValue(langState)];

  useEffect(() => {
    console.log(auth);
    if (!auth) {
      router.push("/admin");
    }

    if (isRoot && auth.role !== "admin") {
      WarningMessage(t["Access Denied"]);
    }
  }, [auth]);

  return auth ? <Children /> : <Spin spinning={true} fullscreen />;
};

export default WithAuthorization;
