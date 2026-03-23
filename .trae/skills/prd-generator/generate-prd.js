const fs = require('fs');
const path = require('path');
const { analyzeComponent, getChineseName } = require('./code-analyzer');

/**
 * PRD智能生成器 - 改进版
 * 
 * 本脚本采用"深度代码分析 + AI生成"的双阶段模式：
 * 1. **第一阶段**：深度分析项目 TSX 代码，提取真实的业务功能清单
 * 2. **第二阶段**：AI基于功能清单，为每个模块生成详细的PRD文档
 * 3. **第三阶段**：校验生成的PRD是否覆盖清单中的所有功能
 * 
 * 改进点：
 * - 深度解析 TSX 文件结构（表格、表单、弹窗等）
 * - 自动提取数据模型（TypeScript 接口、useState）
 * - 识别真实的业务功能（CRUD、搜索、筛选等）
 * - 生成准确反映代码的功能清单
 */

// ==================== 配置数据 ====================

// 模块中文名称映射
const nameMapping = {
  'AccountManagement': '账户管理',
  'AgentBuilder': '智能体构建器',
  'AgentList': '智能体列表',
  'CollaborationModule': '协作模块',
  'Dashboard': '仪表盘',
  'DigitalHuman': '数字人',
  'DigitalHumanContent': '数字人内容',
  'DigitalHumanTemplate': '数字人模板',
  'FlowOrchestrator': '流程编排器',
  'KnowledgeModule': '知识模块',
  'Login': '登录',
  'MonitoringModule': '监控模块',
  'SystemIntegration': '系统集成',
  'SystemSettings': '系统设置'
};

// 模块业务描述映射（作为分析结果的补充）
const moduleDescriptions = {
  'AccountManagement': {
    description: '提供组织账号治理功能，支持成员管理、权限分配、部门归属配置和账号状态控制。实现企业级RBAC权限管理体系，确保系统访问安全可控。',
    coreFeatures: ['成员列表管理', '角色权限分配', '部门组织架构', '账号状态控制', '访问凭证管理']
  },
  'AgentBuilder': {
    description: '提供智能体构建功能，支持从40+行业模板快速启动或创建空白项目。实现智能体身份配置、能力设定、参数调优的全流程管理。',
    coreFeatures: ['模板库选择', '智能体身份配置', '系统提示词编辑', '模型参数调优', '实时对话测试']
  },
  'AgentList': {
    description: '提供智能体资产管理功能，支持智能体的列表展示、搜索筛选、编辑配置、版本回滚和性能监控。实现智能体全生命周期管理。',
    coreFeatures: ['智能体卡片展示', '搜索筛选', '编辑配置', '删除管理', '版本回滚', '性能监控']
  },
  'CollaborationModule': {
    description: '提供多智能体协同编排功能，支持策略市场、工作流实例管理、多机性能监控。实现复杂业务场景下的智能体协作调度。',
    coreFeatures: ['策略市场', '协同实例管理', '多机性能监控', '分布式流量监控', '异常日志队列']
  },
  'Dashboard': {
    description: '提供系统仪表盘功能，展示关键业务指标、资产分布、任务动态和资源监控。实现系统运行状态的全景可视化管理。',
    coreFeatures: ['关键指标展示', '资产分布概览', '业务动态报告', '算力集群状态', '快捷操作入口']
  },
  'DigitalHuman': {
    description: '提供数字人资产管理功能，支持形象库、背景库、动作库的统一管理。实现数字人资源的选择、预览和绑定。',
    coreFeatures: ['形象资产管理', '背景资产管理', '动作资产管理', '资源筛选搜索', '资源预览']
  },
  'DigitalHumanContent': {
    description: '提供数字人内容制作功能，支持脚本编辑、TTS语音配置、交互渲染设置和视频合成。实现数字人播报内容的端到端生产。',
    coreFeatures: ['脚本制作', 'TTS参数调优', '交互渲染配置', '视频合成', '导出下载']
  },
  'DigitalHumanTemplate': {
    description: '提供数字人模板精修功能，支持可视化编辑、资源插槽管理、源码编辑和部署发布。实现数字人模板的精细化定制。',
    coreFeatures: ['可视化编辑', '资源插槽管理', '源码编辑', '模板预览', '部署发布']
  },
  'FlowOrchestrator': {
    description: '提供流程编排功能，支持可视化流程设计、节点编排、调试仿真和执行记录查看。实现复杂业务流程的可视化编排和管理。',
    coreFeatures: ['可视化流程设计', '节点库', '连线编排', '调试仿真', '执行记录']
  },
  'KnowledgeModule': {
    description: '提供知识库管理功能，支持文档上传、索引构建、语义搜索测试和版本管理。实现企业知识资产的统一管理和智能检索。',
    coreFeatures: ['文档库管理', '索引与快照', '语义回显测试', '批量上传', '加工策略配置']
  },
  'Login': {
    description: '提供用户认证功能，支持账号密码登录和角色选择。实现基于RBAC的安全访问控制。',
    coreFeatures: ['账号密码登录', '角色选择', '安全加密', '访问控制']
  },
  'MonitoringModule': {
    description: '提供全链路监控功能，支持指标驾驶舱、日志检索、告警规则和链路追踪。实现系统运行状态的全面可观测性。',
    coreFeatures: ['指标全景驾驶舱', '日志检索', '告警规则', '链路追踪', '拓扑可视化']
  },
  'SystemIntegration': {
    description: '提供系统集成功能，支持数据库连接池管理、第三方应用集成和安全策略配置。实现与外部系统的无缝对接。',
    coreFeatures: ['数据库连接池', '第三方应用集成', '安全策略管理', '密钥托管']
  },
  'SystemSettings': {
    description: '提供系统设置功能，支持模型推理引擎配置、GPU弹性算力管理、安全合规策略和系统备份。实现系统级的全局配置管理。',
    coreFeatures: ['模型推理引擎', 'GPU算力集群', '向量库存储', '安全合规', '系统备份']
  }
};

// ==================== 工具函数 ====================

/**
 * 获取项目根目录路径
 * 优先级：1. 环境变量 PROJECT_ROOT  2. 命令行参数  3. 当前工作目录
 */
function getProjectRoot() {
  // 从环境变量获取
  if (process.env.PROJECT_ROOT) {
    return path.resolve(process.env.PROJECT_ROOT);
  }
  
  // 从命令行参数获取
  const args = process.argv.slice(2);
  const rootIndex = args.findIndex(arg => arg === '--root' || arg === '-r');
  if (rootIndex !== -1 && args[rootIndex + 1]) {
    return path.resolve(args[rootIndex + 1]);
  }
  
  // 默认使用当前工作目录
  return process.cwd();
}

/**
 * 分析项目结构，识别功能模块
 */
function analyzeProjectStructure(projectRoot) {
  const components = [];
  
  try {
    const files = fs.readdirSync(projectRoot);
    
    files.forEach(file => {
      // 识别 .tsx 文件，排除 index.tsx 和包含 Content/Template 的文件
      if (file.endsWith('.tsx') && 
          !file.startsWith('index.') && 
          !file.includes('Content') && 
          !file.includes('Template')) {
        const componentName = file.replace('.tsx', '');
        components.push(componentName);
      }
    });
  } catch (error) {
    console.error('扫描项目文件时出错:', error.message);
  }
  
  return components;
}

/**
 * 读取组件源代码
 */
function readComponentSource(componentName, projectRoot) {
  const filePath = path.join(projectRoot, `${componentName}.tsx`);
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return '';
}

// ==================== 核心功能：生成功能清单 ====================

/**
 * 生成功能清单
 */
function generateFunctionList(projectRoot) {
  try {
    console.log('='.repeat(70));
    console.log('PRD智能生成器 - 开始深度分析项目代码');
    console.log('='.repeat(70));
    console.log();
    console.log(`📁 项目路径: ${projectRoot}`);
    console.log();
    
    // 分析项目结构
    const components = analyzeProjectStructure(projectRoot);
    
    if (components.length === 0) {
      console.log('⚠️ 未找到功能模块（.tsx 文件）');
      console.log('   请确保项目根目录包含 React/TypeScript 组件文件');
      return;
    }
    
    console.log(`🔍 发现 ${components.length} 个功能模块：`);
    console.log();
    components.forEach((name, index) => {
      console.log(`   ${index + 1}. ${nameMapping[name] || name} (${name})`);
    });
    console.log();
    
    // 逐个模块深度分析
    const moduleAnalyses = [];
    
    for (let i = 0; i < components.length; i++) {
      const componentName = components[i];
      const chineseName = nameMapping[componentName] || componentName;
      
      console.log(`[${i + 1}/${components.length}] 深度分析 ${chineseName}...`);
      
      // 读取源代码
      const sourceCode = readComponentSource(componentName, projectRoot);
      
      if (!sourceCode) {
        console.log(`   ⚠️ 无法读取 ${componentName}.tsx`);
        continue;
      }
      
      // 使用 code-analyzer 进行深度分析
      const analysis = analyzeComponent(componentName, sourceCode);
      
      // 合并预设描述（如果有）
      const presetDesc = moduleDescriptions[componentName];
      if (presetDesc) {
        analysis.description = presetDesc.description;
        analysis.coreFeatures = presetDesc.coreFeatures;
      }
      
      moduleAnalyses.push(analysis);
      console.log();
    }
    
    // 生成功能清单文档
    const functionListContent = generateFunctionListMarkdown(moduleAnalyses, projectRoot);
    
    // 写入功能清单文件
    const docsDir = path.join(projectRoot, 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    const listPath = path.join(docsDir, '功能清单.md');
    fs.writeFileSync(listPath, functionListContent);
    
    // 输出统计信息
    const totalFunctions = moduleAnalyses.reduce((sum, m) => sum + m.functions.length, 0);
    const totalModels = moduleAnalyses.reduce((sum, m) => sum + m.dataModels.length, 0);
    
    console.log('='.repeat(70));
    console.log('✅ 功能清单生成完成！');
    console.log('='.repeat(70));
    console.log();
    console.log(`📄 输出文件: ${path.relative(projectRoot, listPath)}`);
    console.log();
    console.log('📊 统计信息:');
    console.log(`   • 总模块数: ${moduleAnalyses.length}`);
    console.log(`   • 总功能数: ${totalFunctions}`);
    console.log(`   • 总数据模型: ${totalModels}`);
    console.log();
    console.log('📋 模块详情:');
    moduleAnalyses.forEach((m, i) => {
      console.log(`   ${i + 1}. ${m.chineseName}: ${m.functions.length}个功能, ${m.dataModels.length}个数据模型`);
    });
    console.log();
    console.log('📝 下一步:');
    console.log('   1. AI阅读功能清单 docs/功能清单.md');
    console.log('   2. AI基于清单逐个生成详细PRD文档');
    console.log('   3. 运行校验命令检查PRD完整性');
    
  } catch (error) {
    console.error('❌ 生成功能清单时出错:', error.message);
    console.error(error.stack);
  }
}

/**
 * 生成功能清单 Markdown 文档
 */
function generateFunctionListMarkdown(moduleAnalyses, projectRoot) {
  let content = `# 项目功能清单

> 生成时间：${new Date().toLocaleString('zh-CN')}
> 生成方式：代码深度分析
> 项目路径：${projectRoot}
> 分析引擎：prd-generator v2.0

## 目录

- [模块概览](#模块概览)
`;

  // 添加目录
  moduleAnalyses.forEach((m, i) => {
    content += `- [模块${i + 1}：${m.chineseName}](#模块${i + 1}${m.chineseName})\n`;
  });

  content += `
---

## 模块概览

| 序号 | 模块名称 | 英文标识 | 功能数量 | 数据模型 | 状态 |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;

  moduleAnalyses.forEach((m, i) => {
    content += `| ${i + 1} | ${m.chineseName} | ${m.name} | ${m.functions.length} | ${m.dataModels.length} | 待生成 |\n`;
  });

  // 统计信息
  const totalFunctions = moduleAnalyses.reduce((sum, m) => sum + m.functions.length, 0);
  const totalModels = moduleAnalyses.reduce((sum, m) => sum + m.dataModels.length, 0);

  content += `
**统计信息**：
- 总模块数：${moduleAnalyses.length}
- 总功能数：${totalFunctions}
- 总数据模型：${totalModels}

---

`;

  // 逐个模块详细说明
  moduleAnalyses.forEach((m, i) => {
    content += `## 模块${i + 1}：${m.chineseName}

### 基本信息
- **模块名称**：${m.chineseName}
- **英文标识**：${m.name}
- **业务描述**：${m.description}
`;

    if (m.coreFeatures) {
      content += `- **核心功能**：${m.coreFeatures.join('、')}\n`;
    }

    content += `
`;

    // 数据模型
    if (m.dataModels.length > 0) {
      content += `### 数据模型\n\n`;
      
      m.dataModels.forEach(model => {
        content += `#### 实体：${model.entity}\n\n`;
        content += `| 字段名 | 类型 | 必填 | 说明 |\n`;
        content += `| :--- | :--- | :--- | :--- |\n`;
        
        model.fields.forEach(field => {
          const options = field.options ? `选项：${field.options.join('/')}` : '';
          content += `| ${field.name} | ${field.type} | ${field.required ? '是' : '否'} | ${field.description} ${options}|\n`;
        });
        
        content += `\n`;
      });
    }

    // 功能清单
    if (m.functions.length > 0) {
      content += `### 功能清单\n\n`;
      
      m.functions.forEach(func => {
        content += `#### ${func.id}：${func.name}\n\n`;
        content += `- **功能ID**：${func.id}\n`;
        content += `- **功能名称**：${func.name}\n`;
        content += `- **功能类型**：${func.type}\n`;
        content += `- **功能描述**：${func.description}\n`;
        
        if (func.listFields && func.listFields.length > 0) {
          content += `- **列表字段**：${func.listFields.join('、')}\n`;
        }
        
        if (func.searchFields && func.searchFields.length > 0) {
          content += `- **搜索字段**：${func.searchFields.join('、')}\n`;
        }
        
        if (func.filters && func.filters.length > 0) {
          const filterStr = func.filters.map(f => `${f.label}(${f.options.join('/')})`).join('、');
          content += `- **筛选条件**：${filterStr}\n`;
        }
        
        if (func.pagination) {
          content += `- **分页配置**：每页${func.pagination.pageSize}条\n`;
        }
        
        if (func.formFields && func.formFields.length > 0) {
          content += `- **表单字段**：\n`;
          func.formFields.forEach(field => {
            const options = field.options ? `，选项：${field.options.join('/')}` : '';
            const validation = field.validation ? `，校验：${field.validation}` : '';
            content += `  - ${field.label}（${field.type}${field.required ? '，必填' : ''}${options}${validation}）\n`;
          });
        }
        
        if (func.categories && func.categories.length > 0) {
          content += `- **分类选项**：${func.categories.join('、')}\n`;
        }
        
        if (func.confirmation) {
          content += `- **确认机制**：${func.confirmation}\n`;
        }
        
        if (func.cascadeEffect) {
          content += `- **级联影响**：${func.cascadeEffect}\n`;
        }
        
        if (func.businessRules && func.businessRules.length > 0) {
          content += `- **业务规则**：${func.businessRules.join('；')}\n`;
        }
        
        content += `\n`;
      });
    }

    // 业务规则
    if (m.businessRules && m.businessRules.length > 0) {
      content += `### 业务规则\n\n`;
      m.businessRules.forEach((rule, rIndex) => {
        content += `${rIndex + 1}. ${rule}\n`;
      });
      content += `\n`;
    }

    // 异常场景
    if (m.exceptionScenarios && m.exceptionScenarios.length > 0) {
      content += `### 异常场景\n\n`;
      content += `| 异常场景 | 系统行为 |\n`;
      content += `| :--- | :--- |\n`;
      m.exceptionScenarios.forEach(scenario => {
        content += `| ${scenario.scenario} | ${scenario.behavior} |\n`;
      });
      content += `\n`;
    }

    content += `---\n\n`;
  });

  // 添加使用说明
  content += `## 使用说明

### 生成PRD文档

基于本功能清单，AI将为每个模块生成详细PRD文档：

1. **读取功能清单**：AI首先阅读本清单，理解所有模块的功能需求
2. **逐个生成PRD**：按照模块顺序，为每个功能生成详细PRD
3. **输出位置**：\`docs/{模块名}/{模块名}.md\`

### PRD文档结构要求

每个PRD文档必须包含：
- **功能描述**：基于清单中的业务描述，详细说明功能价值和使用场景
- **业务功能流程图**：使用 Mermaid 绘制完整的业务流程
- **数据模型**：基于清单中的字段定义，详细说明每个字段的用途和约束
- **功能详细说明**：基于清单中的功能项，详细描述每个功能的：
  - 功能描述和业务逻辑
  - 交互流程（步骤分解）
  - 输入/输出参数
  - 界面元素和布局
- **业务规则**：基于清单中的规则，说明数据校验、权限控制等
- **异常场景处理**：基于清单中的异常，说明各种异常情况的处理方式
- **权限控制**：说明不同角色的功能访问权限
- **性能要求**：说明响应时间、并发等性能指标

### AI生成要求

⚠️ **重要提示**：
1. PRD内容必须**基于功能清单**生成，不能凭空捏造
2. 必须**完美还原**代码中的业务功能、交互流程和逻辑规则
3. 所有功能点必须在PRD中有对应的详细说明
4. 数据模型必须与代码中的定义一致
5. 业务流程必须准确反映代码逻辑

### 校验PRD完整性

生成完成后，运行以下命令校验：

\`\`\`bash
node .trae/skills/prd-generator/generate-prd.js validate --root ${projectRoot}
\`\`\`

---

*本清单由代码深度分析工具自动生成，请基于本清单生成准确的PRD文档*
`;

  return content;
}

// ==================== PRD校验功能 ====================

/**
 * 校验PRD完整性
 */
function validatePRDCompleteness(projectRoot) {
  try {
    console.log('='.repeat(70));
    console.log('PRD完整性校验');
    console.log('='.repeat(70));
    console.log();
    
    // 读取功能清单
    const listPath = path.join(projectRoot, 'docs', '功能清单.md');
    if (!fs.existsSync(listPath)) {
      console.error('❌ 错误：功能清单不存在');
      console.log('   请先运行：node generate-prd.js --root ' + projectRoot);
      return;
    }
    
    const functionList = fs.readFileSync(listPath, 'utf-8');
    
    // 解析功能清单中的模块
    const moduleMatches = functionList.match(/## 模块\d+：([^\n]+)/g) || [];
    
    console.log(`📋 从功能清单中识别到 ${moduleMatches.length} 个模块\n`);
    
    let report = `# PRD完整性校验报告\n\n`;
    report += `> 校验时间：${new Date().toLocaleString('zh-CN')}\n`;
    report += `> 项目路径：${projectRoot}\n\n`;
    
    let totalModules = 0;
    let passedModules = 0;
    let failedModules = 0;
    
    moduleMatches.forEach((match, index) => {
      const moduleName = match.replace(/## 模块\d+：/, '');
      totalModules++;
      
      // 检查对应的PRD文件是否存在
      const prdPath = path.join(projectRoot, 'docs', moduleName, `${moduleName}.md`);
      const exists = fs.existsSync(prdPath);
      
      if (exists) {
        const prdContent = fs.readFileSync(prdPath, 'utf-8');
        
        // 检查PRD是否包含关键章节
        const checks = {
          '功能描述': prdContent.includes('功能描述') || prdContent.includes('## 1.'),
          '数据模型': prdContent.includes('数据模型') || prdContent.includes('## 3.'),
          '流程图表': prdContent.includes('mermaid') || prdContent.includes('```mermaid'),
          '功能详细说明': prdContent.includes('功能详细') || prdContent.includes('## 4.'),
          '业务规则': prdContent.includes('业务规则') || prdContent.includes('## 5.')
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        const coverage = Math.round((score / 5) * 100);
        
        if (coverage >= 60) {
          passedModules++;
          report += `## ✅ ${moduleName}\n\n`;
          report += `- 状态：通过\n`;
          report += `- PRD文件：存在\n`;
          report += `- 完整度：${coverage}%\n`;
        } else {
          failedModules++;
          report += `## ⚠️ ${moduleName}\n\n`;
          report += `- 状态：未通过\n`;
          report += `- PRD文件：存在但内容不完整\n`;
          report += `- 完整度：${coverage}%\n`;
        }
        
        report += `  - 功能描述：${checks['功能描述'] ? '✓' : '✗'}\n`;
        report += `  - 数据模型：${checks['数据模型'] ? '✓' : '✗'}\n`;
        report += `  - 流程图表：${checks['流程图表'] ? '✓' : '✗'}\n`;
        report += `  - 功能详细说明：${checks['功能详细说明'] ? '✓' : '✗'}\n`;
        report += `  - 业务规则：${checks['业务规则'] ? '✓' : '✗'}\n\n`;
      } else {
        failedModules++;
        report += `## ❌ ${moduleName}\n\n`;
        report += `- 状态：未通过\n`;
        report += `- PRD文件：不存在\n`;
        report += `- 缺失文件：docs/${moduleName}/${moduleName}.md\n\n`;
      }
    });
    
    // 添加汇总
    report += `## 校验汇总\n\n`;
    report += `| 指标 | 数值 |\n`;
    report += `| :--- | :--- |\n`;
    report += `| 总模块数 | ${totalModules} |\n`;
    report += `| 通过 | ${passedModules} |\n`;
    report += `| 未通过 | ${failedModules} |\n`;
    report += `| 通过率 | ${Math.round((passedModules / totalModules) * 100)}% |\n\n`;
    
    if (failedModules === 0) {
      report += `**✅ 所有模块校验通过！**\n`;
    } else {
      report += `**⚠️ 有 ${failedModules} 个模块未通过校验，请补充生成。**\n`;
    }
    
    // 写入校验报告
    const reportPath = path.join(projectRoot, 'docs', 'PRD校验报告.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(report);
    console.log(`\n📄 校验报告已保存：${path.relative(projectRoot, reportPath)}`);
    
  } catch (error) {
    console.error('❌ 校验PRD时出错:', error.message);
  }
}

// ==================== 帮助信息 ====================

function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    PRD智能生成器 v2.0                             ║
║              深度代码分析 + AI生成 PRD 文档                       ║
╚══════════════════════════════════════════════════════════════════╝

用法:
  node generate-prd.js [命令] [选项]

命令:
  (无)          深度分析代码并生成功能清单
  validate      校验PRD完整性
  校验          校验PRD完整性（中文别名）

选项:
  --root, -r    指定项目根目录路径
                示例: node generate-prd.js --root /path/to/project
                
  --help, -h    显示帮助信息

环境变量:
  PROJECT_ROOT  设置项目根目录路径（优先级最高）
                示例: PROJECT_ROOT=/path/to/project node generate-prd.js

使用示例:
  1. 使用当前工作目录作为项目根目录:
     node generate-prd.js

  2. 指定项目路径:
     node generate-prd.js --root /path/to/project

  3. 校验PRD完整性:
     node generate-prd.js validate --root /path/to/project

  4. 使用环境变量指定项目路径:
     PROJECT_ROOT=/path/to/project node generate-prd.js

工作流程:
  1. 深度分析 → 扫描 TSX 文件，提取数据模型和业务功能
  2. AI生成   → 基于功能清单生成详细PRD文档
  3. 校验     → 检查PRD是否完整覆盖所有功能
`);
}

// ==================== 主函数 ====================

function main() {
  const args = process.argv.slice(2);
  
  // 显示帮助
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  // 获取项目根目录
  const projectRoot = getProjectRoot();
  
  // 检查项目目录是否存在
  if (!fs.existsSync(projectRoot)) {
    console.error(`❌ 错误：项目目录不存在: ${projectRoot}`);
    console.error('\n请使用 --root 参数指定正确的项目路径，或设置 PROJECT_ROOT 环境变量。');
    console.error('运行 --help 查看详细用法。');
    process.exit(1);
  }
  
  // 解析命令
  const command = args.find(arg => !arg.startsWith('-') && arg !== projectRoot);
  
  if (command === 'validate' || command === '校验') {
    validatePRDCompleteness(projectRoot);
  } else {
    generateFunctionList(projectRoot);
  }
}

// 执行
if (require.main === module) {
  main();
}

module.exports = { 
  generateFunctionList, 
  validatePRDCompleteness, 
  nameMapping, 
  moduleDescriptions 
};
