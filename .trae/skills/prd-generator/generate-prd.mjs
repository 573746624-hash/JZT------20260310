import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * PRD智能生成器 - ES Module版本
 * 
 * 本脚本采用"深度代码分析 + AI生成"的双阶段模式
 */

// ==================== 配置数据 ====================

// 模块中文名称映射
const nameMapping = {
  'home': '首页',
  'policy': '智慧政策',
  'application': '申报管理',
  'application-new': '申报管理(新)',
  'legal': '法律护航',
  'legal-support': '法律护航',
  'industry': '产业管理',
  'supply-chain-finance': '金融服务',
  'system': '系统管理',
  'login': '登录',
  'register': '注册',
  'reset-password': '重置密码',
  'onboarding': '企业认证',
  'enterprise': '企业门户'
};

// ==================== 工具函数 ====================

/**
 * 获取项目根目录
 */
function getProjectRoot() {
  // 方式1: 环境变量
  if (process.env.PROJECT_ROOT) {
    return process.env.PROJECT_ROOT;
  }
  
  // 方式2: 命令行参数
  const args = process.argv.slice(2);
  const rootIndex = args.findIndex(arg => arg === '--root' || arg === '-r');
  if (rootIndex !== -1 && args[rootIndex + 1]) {
    return args[rootIndex + 1];
  }
  
  // 方式3: 当前工作目录
  return process.cwd();
}

/**
 * 递归获取目录下的所有TSX文件
 */
function getAllTsxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // 跳过 node_modules 和 .git
      if (item !== 'node_modules' && item !== '.git' && item !== 'dist' && item !== 'build') {
        getAllTsxFiles(fullPath, files);
      }
    } else if (item.endsWith('.tsx') && !item.includes('.test.') && !item.includes('__tests__')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * 分析TSX文件内容
 */
function analyzeTsxFile(filePath, content) {
  const features = [];
  
  // 提取组件名称
  const componentName = path.basename(filePath, '.tsx');
  
  // 检测表格功能
  if (content.includes('Table') || content.includes('table')) {
    features.push('表格展示');
    
    // 检测表格操作
    if (content.includes('onEdit') || content.includes('handleEdit')) {
      features.push('编辑功能');
    }
    if (content.includes('onDelete') || content.includes('handleDelete')) {
      features.push('删除功能');
    }
    if (content.includes('onView') || content.includes('handleView')) {
      features.push('查看详情');
    }
  }
  
  // 检测表单功能
  if (content.includes('Form') || content.includes('form')) {
    features.push('表单提交');
    
    if (content.includes('Modal') || content.includes('modal')) {
      features.push('弹窗表单');
    }
  }
  
  // 检测搜索功能
  if (content.includes('Search') || content.includes('search') || content.includes('filter')) {
    features.push('搜索筛选');
  }
  
  // 检测分页功能
  if (content.includes('pagination') || content.includes('Pagination')) {
    features.push('分页功能');
  }
  
  // 检测导入导出
  if (content.includes('import') && content.includes('export')) {
    features.push('导入导出');
  }
  
  // 检测状态管理
  if (content.includes('useState') || content.includes('useReducer')) {
    features.push('状态管理');
  }
  
  // 检测路由
  if (content.includes('useNavigate') || content.includes('useParams')) {
    features.push('路由导航');
  }
  
  // 检测API调用
  if (content.includes('fetch') || content.includes('axios') || content.includes('api')) {
    features.push('数据接口');
  }
  
  return {
    componentName,
    features: [...new Set(features)],
    filePath
  };
}

/**
 * 根据文件路径推断模块名称
 */
function getModuleName(filePath) {
  const parts = filePath.split(path.sep);
  const pagesIndex = parts.indexOf('pages');
  
  if (pagesIndex !== -1 && parts[pagesIndex + 1]) {
    const moduleName = parts[pagesIndex + 1];
    return nameMapping[moduleName] || moduleName;
  }
  
  return '其他';
}

/**
 * 生成功能清单
 */
function generateFeatureList(projectRoot) {
  console.log('🔍 正在分析项目代码...\n');
  
  const pagesDir = path.join(projectRoot, 'src', 'pages');
  
  if (!fs.existsSync(pagesDir)) {
    console.error('❌ 未找到 pages 目录:', pagesDir);
    process.exit(1);
  }
  
  // 获取所有TSX文件
  const tsxFiles = getAllTsxFiles(pagesDir);
  console.log(`📁 找到 ${tsxFiles.length} 个组件文件\n`);
  
  // 按模块分组
  const modules = {};
  
  for (const filePath of tsxFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const analysis = analyzeTsxFile(filePath, content);
    const moduleName = getModuleName(filePath);
    
    if (!modules[moduleName]) {
      modules[moduleName] = {
        name: moduleName,
        components: []
      };
    }
    
    modules[moduleName].components.push({
      name: analysis.componentName,
      features: analysis.features,
      filePath: path.relative(projectRoot, filePath)
    });
  }
  
  // 生成功能清单文档
  let markdown = `# 项目功能清单\n\n`;
  markdown += `> 生成时间：${new Date().toLocaleString()}\n`;
  markdown += `> 项目路径：${projectRoot}\n\n`;
  markdown += `## 模块概览\n\n`;
  markdown += `| 序号 | 模块名称 | 组件数量 |\n`;
  markdown += `| :--- | :--- | :--- |\n`;
  
  let index = 1;
  for (const [moduleName, module] of Object.entries(modules)) {
    markdown += `| ${index} | ${moduleName} | ${module.components.length} |\n`;
    index++;
  }
  
  markdown += `\n---\n\n`;
  
  // 详细功能列表
  for (const [moduleName, module] of Object.entries(modules)) {
    markdown += `## ${moduleName}\n\n`;
    
    for (const component of module.components) {
      markdown += `### ${component.name}\n\n`;
      markdown += `- **文件路径**：${component.filePath}\n`;
      markdown += `- **功能特性**：${component.features.join('、') || '页面展示'}\n\n`;
    }
    
    markdown += `---\n\n`;
  }
  
  // 保存功能清单
  const outputDir = path.join(projectRoot, 'docs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = path.join(outputDir, '功能清单.md');
  fs.writeFileSync(outputFile, markdown);
  
  console.log(`✅ 功能清单已生成：${outputFile}\n`);
  console.log('📊 模块统计：');
  for (const [moduleName, module] of Object.entries(modules)) {
    console.log(`  - ${moduleName}: ${module.components.length} 个组件`);
  }
  
  return modules;
}

/**
 * 生成PRD文档框架
 */
function generatePrdTemplate(projectRoot, modules) {
  console.log('\n📝 正在生成PRD文档框架...\n');
  
  let prd = `# 产品需求文档 (PRD)\n\n`;
  prd += `> 项目名称：金智通企业服务平台\n`;
  prd += `> 生成时间：${new Date().toLocaleString()}\n`;
  prd += `> 文档版本：v1.0\n\n`;
  
  prd += `## 1. 项目概述\n\n`;
  prd += `### 1.1 项目简介\n\n`;
  prd += `金智通企业服务平台是一个综合性的企业服务管理系统...\n\n`;
  
  prd += `### 1.2 功能模块\n\n`;
  prd += `| 序号 | 模块名称 | 功能数量 |\n`;
  prd += `| :--- | :--- | :--- |\n`;
  
  let index = 1;
  for (const [moduleName, module] of Object.entries(modules)) {
    prd += `| ${index} | ${moduleName} | ${module.components.length} |\n`;
    index++;
  }
  
  prd += `\n---\n\n`;
  
  // 为每个模块生成PRD章节
  for (const [moduleName, module] of Object.entries(modules)) {
    prd += `## ${index}. ${moduleName}\n\n`;
    prd += `### ${index}.1 功能描述\n\n`;
    prd += `${moduleName}模块提供...\n\n`;
    
    prd += `### ${index}.2 业务流程\n\n`;
    prd += `\`\`\`mermaid\n`;
    prd += `flowchart TD\n`;
    prd += `    A[进入${moduleName}] --> B[展示列表]\n`;
    prd += `    B --> C[选择操作]\n`;
    prd += `    C --> D[执行业务]\n`;
    prd += `\`\`\`\n\n`;
    
    prd += `### ${index}.3 页面组件\n\n`;
    prd += `| 组件名称 | 文件路径 | 功能说明 |\n`;
    prd += `| :--- | :--- | :--- |\n`;
    
    for (const component of module.components) {
      prd += `| ${component.name} | ${component.filePath} | ${component.features.join('、') || '页面展示'} |\n`;
    }
    
    prd += `\n---\n\n`;
    index++;
  }
  
  // 保存PRD文档
  const outputFile = path.join(projectRoot, 'docs', 'PRD.md');
  fs.writeFileSync(outputFile, prd);
  
  console.log(`✅ PRD文档已生成：${outputFile}\n`);
}

// ==================== 主程序 ====================

function main() {
  console.log('🚀 PRD智能生成器 v2.0\n');
  console.log('=' .repeat(50) + '\n');
  
  const projectRoot = getProjectRoot();
  console.log(`📂 项目路径：${projectRoot}\n`);
  
  // 第一阶段：生成功能清单
  const modules = generateFeatureList(projectRoot);
  
  // 第二阶段：生成PRD文档框架
  generatePrdTemplate(projectRoot, modules);
  
  console.log('=' .repeat(50));
  console.log('\n✨ 全部完成！请查看 docs 目录下的文档。\n');
  console.log('📋 生成的文件：');
  console.log('  1. docs/功能清单.md - 详细的功能清单');
  console.log('  2. docs/PRD.md - PRD文档框架\n');
}

// 运行主程序
main();
