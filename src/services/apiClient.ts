/**
 * 统一API客户端
 * 提供请求拦截、错误处理、缓存等功能
 */

import { handleNetworkError, AppError, ErrorType } from "../utils/errorHandler";
import { rateLimiter } from "../utils/rateLimiter";

interface RequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  cacheTTL?: number;
  timeout?: number;
  retry?: number;
  retryDelay?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = "/api", timeout: number = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  /**
   * 设置认证token
   */
  setAuthToken(token: string) {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  /**
   * 移除认证token
   */
  removeAuthToken() {
    delete this.defaultHeaders["Authorization"];
  }

  /**
   * 构建完整URL
   */
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint;
    }
    return `${this.baseURL}${
      endpoint.startsWith("/") ? endpoint : "/" + endpoint
    }`;
  }



  /**
   * 请求超时处理
   */
  private withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new AppError("请求超时", ErrorType.NETWORK, "TIMEOUT")),
          timeout,
        ),
      ),
    ]);
  }

  /**
   * 重试逻辑
   */
  private async withRetry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number,
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  /**
   * 发送请求
   */
  async request<T = any>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<T> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retry = 0,
      retryDelay = 1000,
    } = config;

    const url = this.buildURL(endpoint);

    // 检查请求频率限制
    const rateLimitCheck = rateLimiter.check(`${method}:${endpoint}`);
    if (!rateLimitCheck.allowed) {
      throw new AppError(
        rateLimitCheck.message || "操作频繁，请稍后再试",
        ErrorType.BUSINESS,
        "RATE_LIMIT_EXCEEDED",
      );
    }

    // 请求去重
    const requestFn = async () => {
      const fetchOptions: RequestInit = {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      };

      try {
        const response = await this.withTimeout(
          fetch(url, fetchOptions),
          timeout,
        );

        // 处理HTTP错误
        if (!response.ok) {
          throw await this.handleHTTPError(response);
        }

        const result = await response.json();

        // 处理业务错误 - 兼容两种响应格式:
        // 格式1: { success: true/false, message, data, code }
        // 格式2: { code: 200, msg, data }
        const isSuccess = result.success === true || result.code === 200;
        const errorMessage = result.message || result.msg || "请求失败";

        if (!isSuccess) {
          throw new AppError(
            errorMessage,
            ErrorType.BUSINESS,
            String(result.code),
            result.data,
          );
        }

        return result.data;
      } catch (error: any) {
        throw handleNetworkError(error);
      }
    };

    // 应用重试逻辑
    return (
      retry > 0
        ? () => this.withRetry(requestFn, retry, retryDelay)
        : requestFn
    )();
  }

  /**
   * 处理HTTP错误
   */
  private async handleHTTPError(response: Response): Promise<AppError> {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch {
      // 无法解析响应体
    }

    return handleNetworkError({
      response: {
        status: response.status,
        data: errorData,
      },
    });
  }

  /**
   * GET请求
   */
  get<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  /**
   * POST请求
   */
  post<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "POST", body });
  }

  /**
   * PUT请求
   */
  put<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PUT", body });
  }

  /**
   * DELETE请求
   */
  delete<T = any>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  /**
   * PATCH请求
   */
  patch<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<RequestConfig, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "PATCH", body });
  }

  /**
   * 批量请求
   */
  async batch<T = any>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map((req) => req()));
  }

  /**
   * 清除缓存 (已废弃/降级处理，兼容旧代码)
   */
  clearCache(endpoint?: string) {
    // 缓存功能已移除，此方法为空实现以保持接口兼容
  }
}

// 创建默认实例
export const apiClient = new ApiClient();

// 导出类供自定义实例使用
export default ApiClient;
