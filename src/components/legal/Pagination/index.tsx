/**
 * 分页控件组件
 * 支持页码显示、快速跳转、每页数量切换
 */
import React from "react";
import { Pagination as AntPagination, Select, Input, Space, Typography } from "antd";

const { Text } = Typography;
const { Option } = Select;

// 分页组件属性接口
interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  showTotal?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  pageSize,
  total,
  pageSizeOptions = [12, 24, 48, 96],
  showQuickJumper = true,
  showSizeChanger = true,
  showTotal = true,
  onChange,
  onShowSizeChange,
  className,
  style,
}) => {
  // 计算总页数
  const totalPages = Math.ceil(total / pageSize);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    onChange?.(page, pageSize);
  };

  // 处理每页数量变化
  const handleSizeChange = (value: number) => {
    const newSize = value;
    // 计算新的当前页，保持数据位置大致不变
    const currentItemIndex = (current - 1) * pageSize;
    const newPage = Math.floor(currentItemIndex / newSize) + 1;
    onShowSizeChange?.(newPage, newSize);
  };

  // 渲染总数信息
  const renderTotal = () => {
    if (!showTotal) return null;
    const start = (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);
    return (
      <Text type="secondary" style={{ fontSize: 14 }}>
        共 <Text strong>{total}</Text> 条，第 {start}-{end} 条
      </Text>
    );
  };

  // 渲染每页数量选择器
  const renderSizeChanger = () => {
    if (!showSizeChanger) return null;
    return (
      <Space size={8}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          每页显示
        </Text>
        <Select
          value={pageSize}
          onChange={handleSizeChange}
          style={{ width: 80 }}
          size="small"
        >
          {pageSizeOptions.map((size) => (
            <Option key={size} value={size}>
              {size} 条
            </Option>
          ))}
        </Select>
      </Space>
    );
  };

  // 渲染快速跳转
  const renderQuickJumper = () => {
    if (!showQuickJumper || totalPages <= 1) return null;
    return (
      <Space size={8}>
        <Text type="secondary" style={{ fontSize: 14 }}>
          跳至
        </Text>
        <Input
          type="number"
          min={1}
          max={totalPages}
          style={{ width: 60 }}
          size="small"
          onPressEnter={(e) => {
            const value = parseInt((e.target as HTMLInputElement).value, 10);
            if (value >= 1 && value <= totalPages) {
              handlePageChange(value);
            }
          }}
        />
        <Text type="secondary" style={{ fontSize: 14 }}>
          页
        </Text>
      </Space>
    );
  };

  // 自定义 itemRender，控制页码显示逻辑
  const itemRender = (
    page: number,
    type: "page" | "prev" | "next" | "jump-prev" | "jump-next",
    originalElement: React.ReactNode
  ) => {
    if (type === "page") {
      // 始终显示第一页和最后一页
      if (page === 1 || page === totalPages) {
        return originalElement;
      }
      // 显示当前页前后2页
      if (Math.abs(page - current) <= 2) {
        return originalElement;
      }
      // 省略号
      if (page === current - 3 || page === current + 3) {
        return <span style={{ color: "#999" }}>...</span>;
      }
      return null;
    }
    return originalElement;
  };

  return (
    <div
      className={`regulation-pagination ${className || ""}`}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        padding: "16px 0",
        ...style,
      }}
    >
      {/* 左侧：总数信息 */}
      <div>{renderTotal()}</div>

      {/* 中间：分页器 */}
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={handlePageChange}
        showSizeChanger={false}
        itemRender={itemRender}
        showLessItems
      />

      {/* 右侧：每页数量 + 快速跳转 */}
      <Space size={24}>
        {renderSizeChanger()}
        {renderQuickJumper()}
      </Space>
    </div>
  );
};
