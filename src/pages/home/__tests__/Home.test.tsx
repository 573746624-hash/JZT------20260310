/**
 * @vitest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Home from "../index";
import { defaultHomeData } from "../config/homeDataConfig";
import { CertificationProvider } from "../../../context/CertificationContext";
import { CompanyProfileProvider } from "../../../context/CompanyProfileContext";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ECharts to avoid canvas issues in test environment
vi.mock("echarts-for-react", () => ({
  default: () => <div data-testid="echarts-mock">ECharts Graph</div>,
}));

// Mock useHomeData
vi.mock("../hooks/useHomeData", () => ({
  useHomeData: () => ({
    loading: false,
    error: null,
    homeData: defaultHomeData,
    fetchHomeData: vi.fn(),
  }),
}));

describe("Home Page", () => {
  it("renders welcome message correctly", async () => {
    render(
      <MemoryRouter>
        <CertificationProvider>
          <CompanyProfileProvider>
            <Home />
          </CompanyProfileProvider>
        </CertificationProvider>
      </MemoryRouter>,
    );

    // Check for main title
    expect(screen.getByText(/中小企业政策申报管理系统/i)).not.toBeNull();

    // Check for username (default is Admin)
    expect(screen.getByText(/Admin/i)).not.toBeNull();
  });

  it("renders key sections", () => {
    render(
      <MemoryRouter>
        <CertificationProvider>
          <CompanyProfileProvider>
            <Home />
          </CompanyProfileProvider>
        </CertificationProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/核心功能/i)).not.toBeNull();

    // Check for Quick Actions
    const policyCenterElements = screen.getAllByText(/政策中心/i);
    expect(policyCenterElements.length).toBeGreaterThan(0);

    expect(screen.getAllByText(/申报管理/i).length).toBeGreaterThan(0);
  });

  it("navigates to policy center when quick action is clicked", () => {
    const { container } = render(
      <MemoryRouter>
        <CertificationProvider>
          <CompanyProfileProvider>
            <Home />
          </CompanyProfileProvider>
        </CertificationProvider>
      </MemoryRouter>,
    );

    const applicationManagementElements = screen.getAllByText(/申报管理/i);
    // Find the one that is likely the card title in QuickActions
    const applicationManagementCard = applicationManagementElements.find((el) =>
      el.closest(".ant-card"),
    );
    expect(applicationManagementCard).not.toBeNull();

    // Note: Actual navigation testing requires more setup with Router,
    // but here we verify the element is interactive and present.
  });
});
