import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { CertificationProvider, useCertification } from "../CertificationContext";
import React from "react";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("CertificationContext", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CertificationProvider>{children}</CertificationProvider>
  );

  it("should initialize with unverified state", async () => {
    const { result } = renderHook(() => useCertification(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.certState.status).toBe("unverified");
    expect(result.current.certState.level).toBe("none");
  });

  it("should handle certification submission", async () => {
    const { result } = renderHook(() => useCertification(), { wrapper });

    act(() => {
      result.current.submitCertification({
        companyName: "测试企业",
        certNumber: "123456789012345678",
        legalPerson: "张三",
      });
    });

    // Fast forward setTimeout
    act(() => {
      vi.runAllTimers();
    });

    await waitFor(() => {
      expect(result.current.certState.status).toBe("verified");
    });

    expect(result.current.certState.level).toBe("basic");
    expect(result.current.certState.companyName).toBe("测试企业");
  });

  it("should upgrade certification level", async () => {
    const { result } = renderHook(() => useCertification(), { wrapper });

    act(() => {
      result.current.submitCertification({ companyName: "测试" });
    });
    act(() => {
      vi.runAllTimers();
    });

    act(() => {
      result.current.upgradeLevel("advanced");
    });
    act(() => {
      vi.runAllTimers();
    });

    await waitFor(() => {
      expect(result.current.certState.level).toBe("advanced");
    });
  });
});
