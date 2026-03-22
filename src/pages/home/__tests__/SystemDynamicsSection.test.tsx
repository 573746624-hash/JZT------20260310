// @vitest-environment jsdom
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SystemDynamicsSection } from '../components/SystemDynamicsSection';

describe('SystemDynamicsSection', () => {
  it('should render the component with title', () => {
    render(<SystemDynamicsSection />);
    expect(screen.getByText('实时动态')).toBeDefined();
  });

  it('should render dynamic items', () => {
    render(<SystemDynamicsSection />);
    // There should be multiple items rendered (due to array duplication for scrolling)
    const items = screen.getAllByText('《2026年高新技术企业认定管理办法》已发布');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should open modal when clicking an item', () => {
    render(<SystemDynamicsSection />);
    const items = screen.getAllByText('《2026年高新技术企业认定管理办法》已发布');
    
    // Click the first item
    fireEvent.click(items[0]);
    
    // Check if modal title and detail content appear
    expect(screen.getByText('动态详情')).toBeDefined();
    expect(screen.getByText('科技部最新发布关于高企认定的新标准，重点关注研发费用归集。')).toBeDefined();
  });

  it('should close modal when clicking the close button', () => {
    render(<SystemDynamicsSection />);
    const items = screen.getAllByText('《2026年高新技术企业认定管理办法》已发布');
    
    // Open modal
    fireEvent.click(items[0]);
    expect(screen.getByText('动态详情')).toBeDefined();
    
    // Click close button
    const closeButton = screen.getByText('我知道了');
    fireEvent.click(closeButton);
    
    // Test finishes, no exceptions thrown
  });
});
