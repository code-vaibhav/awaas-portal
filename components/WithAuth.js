import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "@/utils/atom";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

const WithAuthorization = ({ children }) => {
  const auth = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      router.push(`/admin?redirect=${window.location.pathname}`);
      return;
    }
  }, [auth]);

  return auth ? children : <Spin spinning={true} fullscreen />;
};

export default WithAuthorization;
