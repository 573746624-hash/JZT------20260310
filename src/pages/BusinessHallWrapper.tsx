import React, { useState } from 'react';
import { PermissionProvider } from '../components/shared/PermissionProvider';
import BusinessHall from './BusinessHall';
import { UserRole } from '../utils/permissions';

const BusinessHallWrapper: React.FC = () => {
  // 这里可以从用户上下文或认证系统获取用户角色
  // 暂时使用默认角色，实际项目中应该从认证系统获取
  const [userRole] = useState<UserRole>('buyer');

  return (
    <PermissionProvider userRole={userRole}>
      <BusinessHall />
    </PermissionProvider>
  );
};

export default BusinessHallWrapper;
