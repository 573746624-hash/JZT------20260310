import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { message } from "antd";
import dayjs from "dayjs";

export type CertStatus = "unverified" | "verified" | "expired";
export type CertLevel = "none" | "basic" | "advanced";

export interface CertState {
  status: CertStatus;
  level: CertLevel;
  certTime?: string;
  expireTime?: string;
  certType?: string;
  certNumber?: string;
  companyName?: string;
  legalPerson?: string;
}

export interface CertificationContextType {
  certState: CertState;
  loading: boolean;
  submitCertification: (data: Partial<CertState>) => Promise<void>;
  upgradeLevel: (level: CertLevel) => Promise<void>;
  checkExpiry: () => void;
  resetCertification: () => void;
}

const defaultState: CertState = {
  status: "unverified",
  level: "none",
};

// 简单的加密解密模拟
const encryptData = (data: any) => btoa(encodeURIComponent(JSON.stringify(data)));
const decryptData = (str: string) => JSON.parse(decodeURIComponent(atob(str)));

const CertificationContext = createContext<CertificationContextType | undefined>(undefined);

export const CertificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [certState, setCertState] = useState<CertState>(defaultState);
  const [loading, setLoading] = useState(true);

  // 初始化加载
  useEffect(() => {
    const init = () => {
      try {
        const saved = localStorage.getItem("jzt_cert_state");
        if (saved) {
          const parsed = decryptData(saved);
          setCertState(parsed);
          // 初始化时检查是否过期
          if (parsed.status === "verified" && parsed.expireTime) {
            const isExpired = dayjs().isAfter(dayjs(parsed.expireTime));
            if (isExpired) {
              setCertState((prev) => ({ ...prev, status: "expired" }));
              message.warning("您的企业认证已过期，请重新认证");
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse cert state", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // 持久化保存
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("jzt_cert_state", encryptData(certState));
      // 记录操作日志
      console.log(`[Audit Log] Certification state updated to: ${certState.status}`);
    }
  }, [certState, loading]);

  const submitCertification = async (data: Partial<CertState>) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const newState: CertState = {
        ...certState,
        ...data,
        status: "verified",
        level: "basic",
        certTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        // 默认一年有效期
        expireTime: dayjs().add(1, "year").format("YYYY-MM-DD HH:mm:ss"),
      };
      setCertState(newState);
      message.success("企业认证成功！");
    } finally {
      setLoading(false);
    }
  };

  const upgradeLevel = async (level: CertLevel) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCertState((prev) => ({ ...prev, level }));
      message.success(`已成功升级至${level === "advanced" ? "高级" : "基础"}认证！`);
    } finally {
      setLoading(false);
    }
  };

  const checkExpiry = () => {
    if (certState.status === "verified" && certState.expireTime) {
      const isExpired = dayjs().isAfter(dayjs(certState.expireTime));
      if (isExpired) {
        setCertState((prev) => ({ ...prev, status: "expired" }));
        message.warning("您的企业认证已过期，请重新认证");
      } else {
        const daysLeft = dayjs(certState.expireTime).diff(dayjs(), "day");
        if (daysLeft <= 30) {
          message.info(`您的企业认证还有 ${daysLeft} 天过期，请及时更新`);
        }
      }
    }
  };

  const resetCertification = () => {
    setCertState(defaultState);
    localStorage.removeItem("jzt_cert_state");
  };

  return (
    <CertificationContext.Provider
      value={{
        certState,
        loading,
        submitCertification,
        upgradeLevel,
        checkExpiry,
        resetCertification,
      }}
    >
      {children}
    </CertificationContext.Provider>
  );
};

export const useCertification = () => {
  const context = useContext(CertificationContext);
  if (!context) {
    throw new Error("useCertification must be used within a CertificationProvider");
  }
  return context;
};
