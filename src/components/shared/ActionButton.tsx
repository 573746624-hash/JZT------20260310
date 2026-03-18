import React from 'react';
import { Button, ButtonProps, Tooltip } from 'antd';
import { usePermissions } from './PermissionProvider';

interface ActionButtonProps extends ButtonProps {
  permission: string | string[];
  fallbackText?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  permission,
  fallbackText = '权限不足',
  showTooltip = true,
  tooltipText,
  children,
  disabled,
  ...buttonProps
}) => {
  const { canAccess } = usePermissions();
  
  const hasAccess = canAccess(permission);
  const isDisabled = disabled || !hasAccess;
  
  const button = (
    <Button
      {...buttonProps}
      disabled={isDisabled}
    >
      {hasAccess ? children : fallbackText}
    </Button>
  );

  if (!hasAccess && showTooltip) {
    const tooltip = tooltipText || `需要权限: ${Array.isArray(permission) ? permission.join(', ') : permission}`;
    return (
      <Tooltip title={tooltip}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default ActionButton;
