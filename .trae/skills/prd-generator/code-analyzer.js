const fs = require('fs');
const path = require('path');

/**
 * 深度代码分析器 - 从 TSX 文件中提取真实业务功能
 * 
 * 本模块提供深度解析 React/TSX 代码的能力，能够：
 * 1. 提取数据模型（TypeScript 接口、useState）
 * 2. 识别 UI 组件结构（表格、表单、弹窗、卡片等）
 * 3. 分析业务功能（CRUD 操作、搜索筛选、状态管理）
 * 4. 提取业务规则和交互流程
 */

// ==================== 类型定义（JSDoc）====================

/**
 * @typedef {Object} DataField
 * @property {string} name - 字段名
 * @property {string} type - 字段类型
 * @property {boolean} required - 是否必填
 * @property {string} description - 字段说明
 * @property {string[]} [options] - 枚举选项
 */

/**
 * @typedef {Object} DataModel
 * @property {string} entity - 实体名称
 * @property {DataField[]} fields - 字段列表
 */

/**
 * @typedef {Object} FunctionConfig
 * @property {string} id - 功能ID
 * @property {string} name - 功能名称
 * @property {string} type - 功能类型（列表展示/表单提交/搜索筛选等）
 * @property {string} description - 功能描述
 * @property {string[]} [listFields] - 列表展示字段
 * @property {string[]} [searchFields] - 搜索字段
 * @property {Array<{field: string, label: string, options: string[]}>} [filters] - 筛选条件
 * @property {Object} [pagination] - 分页配置
 * @property {Array<{name: string, label: string, type: string, required?: boolean, options?: string[], validation?: string}>} [formFields] - 表单字段
 * @property {string[]} [businessRules] - 业务规则
 */

/**
 * @typedef {Object} ModuleAnalysis
 * @property {string} name - 模块英文名称
 * @property {string} chineseName - 模块中文名称
 * @property {string} description - 模块描述
 * @property {DataModel[]} dataModels - 数据模型
 * @property {FunctionConfig[]} functions - 功能列表
 * @property {string[]} businessRules - 业务规则
 * @property {Array<{scenario: string, behavior: string}>} exceptionScenarios - 异常场景
 */

// ==================== 辅助函数 ====================

/**
 * 从代码中提取 TypeScript 接口定义
 * @param {string} sourceCode 
 * @returns {DataModel[]}
 */
function extractInterfaces(sourceCode) {
  const models = [];
  
  // 匹配 interface 定义
  const interfaceRegex = /interface\s+(\w+)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = interfaceRegex.exec(sourceCode)) !== null) {
    const interfaceName = match[1];
    const interfaceBody = match[2];
    
    const fields = [];
    // 解析接口字段
    const fieldLines = interfaceBody.split('\n').filter(line => line.trim() && !line.trim().startsWith('//'));
    
    for (const line of fieldLines) {
      // 匹配：fieldName: type; 或 fieldName?: type;
      const fieldMatch = line.match(/(\w+)\??\s*:\s*([^;]+);?/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const fieldType = fieldMatch[2].trim();
        const isOptional = line.includes('?');
        
        fields.push({
          name: fieldName,
          type: fieldType,
          required: !isOptional,
          description: inferFieldDescription(fieldName, fieldType)
        });
      }
    }
    
    if (fields.length > 0) {
      models.push({
        entity: interfaceName,
        fields: fields
      });
    }
  }
  
  return models;
}

/**
 * 从代码中提取 useState 定义的状态
 * @param {string} sourceCode 
 * @returns {DataModel[]}
 */
function extractUseStateModels(sourceCode) {
  const models = [];
  
  // 匹配 useState 定义
  const stateRegex = /const\s+\[(\w+),\s*set(\w+)\]\s*=\s*useState\(([^)]*)\)/g;
  let match;
  
  const stateFields = [];
  
  while ((match = stateRegex.exec(sourceCode)) !== null) {
    const stateName = match[1];
    const setterName = match[2];
    const initialValue = match[3].trim();
    
    // 推断类型
    let fieldType = 'any';
    if (initialValue.startsWith('[')) fieldType = 'array';
    else if (initialValue.startsWith('{')) fieldType = 'object';
    else if (initialValue === 'true' || initialValue === 'false') fieldType = 'boolean';
    else if (!isNaN(parseFloat(initialValue))) fieldType = 'number';
    else if (initialValue.startsWith("'") || initialValue.startsWith('"') || initialValue.startsWith('`')) fieldType = 'string';
    else if (initialValue.includes('=>')) fieldType = 'function';
    
    stateFields.push({
      name: stateName,
      type: fieldType,
      required: false,
      description: inferStateDescription(stateName, setterName, fieldType)
    });
  }
  
  if (stateFields.length > 0) {
    models.push({
      entity: 'ComponentState',
      fields: stateFields
    });
  }
  
  return models;
}

/**
 * 推断字段描述
 * @param {string} fieldName 
 * @param {string} fieldType 
 * @returns {string}
 */
function inferFieldDescription(fieldName, fieldType) {
  const descriptions = {
    'id': '唯一标识',
    'name': '名称',
    'email': '邮箱地址',
    'status': '状态',
    'role': '角色',
    'createdAt': '创建时间',
    'updatedAt': '更新时间',
    'description': '描述',
    'avatar': '头像URL',
    'password': '密码',
    'dept': '部门',
    'displayName': '显示名称',
    'tags': '标签',
    'model': '模型',
    'systemPrompt': '系统提示词',
    'temperature': '温度参数',
    'maxLength': '最大长度',
    'searchQuery': '搜索关键词',
    'currentPage': '当前页码',
    'modalType': '弹窗类型',
    'selectedItem': '选中项',
    'isLoading': '加载状态',
    'isOpen': '是否打开'
  };
  
  return descriptions[fieldName] || `${fieldName}字段`;
}

/**
 * 推断状态描述
 * @param {string} stateName 
 * @param {string} setterName 
 * @param {string} type 
 * @returns {string}
 */
function inferStateDescription(stateName, setterName, type) {
  // 根据 setter 名称推断用途
  if (setterName.toLowerCase().includes('modal') || setterName.toLowerCase().includes('dialog')) {
    return '弹窗显示状态';
  }
  if (setterName.toLowerCase().includes('search')) {
    return '搜索关键词';
  }
  if (setterName.toLowerCase().includes('page')) {
    return '分页状态';
  }
  if (setterName.toLowerCase().includes('select') || setterName.toLowerCase().includes('edit')) {
    return '选中/编辑对象';
  }
  if (setterName.toLowerCase().includes('loading') || setterName.toLowerCase().includes('typing')) {
    return '加载/输入状态';
  }
  if (setterName.toLowerCase().includes('filter')) {
    return '筛选条件';
  }
  
  return inferFieldDescription(stateName, type);
}

/**
 * 分析表格结构
 * @param {string} sourceCode 
 * @returns {Object|null}
 */
function analyzeTableStructure(sourceCode) {
  // 查找 table 标签
  const hasTable = sourceCode.includes('<table') || sourceCode.includes('<Table');
  if (!hasTable) return null;
  
  // 提取表头
  const thRegex = /<th[^>]*>([^<]+)<\/th>/g;
  const headers = [];
  let match;
  
  while ((match = thRegex.exec(sourceCode)) !== null) {
    headers.push(match[1].trim());
  }
  
  // 如果没有找到 th，尝试从 JSX 表达式中提取
  if (headers.length === 0) {
    const headerRegex = /{([^}]+)\.map\([^)]*=>[^}]+<th[^>]*>([^<]+)<\/th>/g;
    while ((match = headerRegex.exec(sourceCode)) !== null) {
      headers.push(match[2].trim());
    }
  }
  
  return {
    type: 'table',
    headers: headers,
    hasPagination: sourceCode.includes('currentPage') || sourceCode.includes('setCurrentPage'),
    hasSearch: sourceCode.includes('searchQuery') || sourceCode.includes('setSearchQuery'),
    hasFilter: sourceCode.includes('filter') || sourceCode.includes('筛选')
  };
}

/**
 * 分析表单结构
 * @param {string} sourceCode 
 * @returns {Object|null}
 */
function analyzeFormStructure(sourceCode) {
  // 查找 form 标签
  const hasForm = sourceCode.includes('<form') || sourceCode.includes('<Form');
  if (!hasForm) return null;
  
  // 提取 input/select/textarea
  const fields = [];
  
  // 匹配 input 元素
  const inputRegex = /<input[^>]*name=["'](\w+)["'][^>]*>/g;
  let match;
  
  while ((match = inputRegex.exec(sourceCode)) !== null) {
    const inputTag = match[0];
    const name = match[1];
    const type = inputTag.includes('type="password"') ? 'password' :
                 inputTag.includes('type="email"') ? 'email' :
                 inputTag.includes('type="number"') ? 'number' : 'text';
    const required = inputTag.includes('required');
    
    fields.push({
      name: name,
      type: type,
      required: required,
      label: inferFieldLabel(name)
    });
  }
  
  // 匹配 select 元素
  const selectRegex = /<select[^>]*name=["'](\w+)["'][^>]*>[\s\S]*?<\/select>/g;
  while ((match = selectRegex.exec(sourceCode)) !== null) {
    const selectTag = match[0];
    const name = match[1];
    
    // 提取选项
    const optionRegex = /<option[^>]*>([^<]+)<\/option>/g;
    const options = [];
    let optionMatch;
    
    while ((optionMatch = optionRegex.exec(selectTag)) !== null) {
      options.push(optionMatch[1].trim());
    }
    
    fields.push({
      name: name,
      type: 'select',
      required: selectTag.includes('required'),
      label: inferFieldLabel(name),
      options: options
    });
  }
  
  // 匹配 textarea 元素
  const textareaRegex = /<textarea[^>]*name=["'](\w+)["'][^>]*>/g;
  while ((match = textareaRegex.exec(sourceCode)) !== null) {
    const name = match[1];
    fields.push({
      name: name,
      type: 'textarea',
      required: false,
      label: inferFieldLabel(name)
    });
  }
  
  return {
    type: 'form',
    fields: fields,
    hasSubmit: sourceCode.includes('onSubmit') || sourceCode.includes('type="submit"')
  };
}

/**
 * 推断字段标签
 * @param {string} fieldName 
 * @returns {string}
 */
function inferFieldLabel(fieldName) {
  const labels = {
    'name': '名称',
    'email': '邮箱',
    'password': '密码',
    'role': '角色',
    'dept': '部门',
    'status': '状态',
    'description': '描述',
    'displayName': '显示名称',
    'tags': '标签',
    'model': '模型',
    'systemPrompt': '系统提示词',
    'temperature': '温度',
    'topP': '核采样',
    'maxLength': '最大长度',
    'memoryDepth': '记忆深度'
  };
  
  return labels[fieldName] || fieldName;
}

/**
 * 分析弹窗/对话框
 * @param {string} sourceCode 
 * @returns {Object[]}
 */
function analyzeModals(sourceCode) {
  const modals = [];
  
  // 查找条件渲染的弹窗
  const modalPatterns = [
    /\{\s*modalType\s*===?\s*['"](\w+)['"]\s*&&\s*\(/g,
    /\{\s*show(\w+)\s*&&\s*\(/g,
    /\{\s*is(\w+)Open\s*&&\s*\(/g,
    /\{\s*(\w+)Modal\s*&&\s*\(/g
  ];
  
  for (const pattern of modalPatterns) {
    let match;
    while ((match = pattern.exec(sourceCode)) !== null) {
      const modalName = match[1];
      modals.push({
        name: modalName,
        trigger: `打开${modalName}弹窗`,
        type: 'modal'
      });
    }
  }
  
  return modals;
}

/**
 * 分析处理函数
 * @param {string} sourceCode 
 * @returns {Object[]}
 */
function analyzeHandlers(sourceCode) {
  const handlers = [];
  
  // 匹配 const handleXxx = (...) 或 function handleXxx(...)
  const handlerRegex = /(?:const|function)\s+(handle\w+)\s*[=(]\s*(?:\([^)]*\))?\s*=>?/g;
  let match;
  
  while ((match = handlerRegex.exec(sourceCode)) !== null) {
    const handlerName = match[1];
    const actionType = inferHandlerAction(handlerName);
    
    handlers.push({
      name: handlerName,
      action: actionType.action,
      description: actionType.description
    });
  }
  
  return handlers;
}

/**
 * 推断处理函数行为
 * @param {string} handlerName 
 * @returns {Object}
 */
function inferHandlerAction(handlerName) {
  const actions = {
    'handleSave': { action: '保存', description: '保存数据' },
    'handleSubmit': { action: '提交', description: '提交表单' },
    'handleDelete': { action: '删除', description: '删除数据' },
    'handleEdit': { action: '编辑', description: '编辑数据' },
    'handleCreate': { action: '创建', description: '创建新数据' },
    'handleSearch': { action: '搜索', description: '执行搜索' },
    'handleFilter': { action: '筛选', description: '筛选数据' },
    'handleSort': { action: '排序', description: '排序数据' },
    'handlePageChange': { action: '分页', description: '切换分页' },
    'handleSelect': { action: '选择', description: '选择项目' },
    'handleCancel': { action: '取消', description: '取消操作' },
    'handleConfirm': { action: '确认', description: '确认操作' },
    'handleClose': { action: '关闭', description: '关闭弹窗' },
    'handleOpen': { action: '打开', description: '打开弹窗' },
    'handleToggle': { action: '切换', description: '切换状态' },
    'handleImport': { action: '导入', description: '导入数据' },
    'handleExport': { action: '导出', description: '导出数据' },
    'handleTest': { action: '测试', description: '测试功能' },
    'handleApply': { action: '应用', description: '应用配置' },
    'handleRollback': { action: '回滚', description: '回滚版本' },
    'handleChat': { action: '对话', description: '发送消息' }
  };
  
  // 尝试匹配前缀
  for (const [key, value] of Object.entries(actions)) {
    if (handlerName.startsWith(key)) {
      return value;
    }
  }
  
  return { action: '操作', description: `${handlerName}操作` };
}

/**
 * 分析预设数据/常量
 * @param {string} sourceCode 
 * @returns {Object}
 */
function analyzeConstants(sourceCode) {
  const constants = {
    departments: [],
    roles: [],
    statuses: [],
    templates: [],
    categories: []
  };
  
  // 提取 DEPARTMENTS 数组
  const deptRegex = /const\s+DEPARTMENTS\s*=\s*\[([^\]]+)\]/;
  const deptMatch = sourceCode.match(deptRegex);
  if (deptMatch) {
    constants.departments = deptMatch[1].match(/['"`]([^'"`]+)['"`]/g)?.map(s => s.slice(1, -1)) || [];
  }
  
  // 提取 TEMPLATES 数组
  const templateRegex = /const\s+TEMPLATES\s*=\s*\[/;
  if (templateRegex.test(sourceCode)) {
    // 简单统计模板数量
    const templateMatches = sourceCode.match(/\{\s*id:/g);
    constants.templateCount = templateMatches ? templateMatches.length : 0;
  }
  
  // 提取角色选项
  const roleRegex = /<option>\s*(SuperAdmin|Developer|Auditor|DevOps)\s*<\/option>/g;
  const roles = new Set();
  let match;
  while ((match = roleRegex.exec(sourceCode)) !== null) {
    roles.add(match[1]);
  }
  constants.roles = Array.from(roles);
  
  return constants;
}

// ==================== 主要分析函数 ====================

/**
 * 深度分析单个 TSX 文件
 * @param {string} componentName - 组件名称
 * @param {string} sourceCode - 源代码
 * @returns {ModuleAnalysis}
 */
function analyzeComponent(componentName, sourceCode) {
  console.log(`  🔍 深度分析 ${componentName}...`);
  
  // 1. 提取数据模型
  const interfaceModels = extractInterfaces(sourceCode);
  const stateModels = extractUseStateModels(sourceCode);
  const dataModels = [...interfaceModels, ...stateModels];
  
  // 2. 分析 UI 结构
  const tableInfo = analyzeTableStructure(sourceCode);
  const formInfo = analyzeFormStructure(sourceCode);
  const modals = analyzeModals(sourceCode);
  const handlers = analyzeHandlers(sourceCode);
  const constants = analyzeConstants(sourceCode);
  
  // 3. 生成功能配置
  const functions = generateFunctionConfigs(
    componentName,
    tableInfo,
    formInfo,
    modals,
    handlers,
    constants,
    sourceCode
  );
  
  // 4. 提取业务规则
  const businessRules = extractBusinessRules(sourceCode);
  
  // 5. 提取异常场景
  const exceptionScenarios = extractExceptionScenarios(sourceCode);
  
  console.log(`     ✓ 发现 ${dataModels.length} 个数据模型, ${functions.length} 个功能`);
  
  return {
    name: componentName,
    chineseName: getChineseName(componentName),
    description: generateModuleDescription(componentName, functions),
    dataModels,
    functions,
    businessRules,
    exceptionScenarios
  };
}

/**
 * 生成功能配置列表
 * @param {string} componentName 
 * @param {Object|null} tableInfo 
 * @param {Object|null} formInfo 
 * @param {Object[]} modals 
 * @param {Object[]} handlers 
 * @param {Object} constants 
 * @param {string} sourceCode 
 * @returns {FunctionConfig[]}
 */
function generateFunctionConfigs(componentName, tableInfo, formInfo, modals, handlers, constants, sourceCode) {
  const functions = [];
  let funcId = 1;
  
  // 1. 列表展示功能
  if (tableInfo) {
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '列表展示',
      type: '列表展示',
      description: `以表格形式展示${getChineseName(componentName)}数据`,
      listFields: tableInfo.headers,
      pagination: tableInfo.hasPagination ? { pageSize: 10, pageSizeOptions: [10, 20, 50] } : undefined
    });
  }
  
  // 2. 搜索功能
  if (tableInfo?.hasSearch || sourceCode.includes('searchQuery')) {
    const searchFields = extractSearchFields(sourceCode);
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '搜索查询',
      type: '搜索筛选',
      description: '支持多字段搜索查询',
      searchFields: searchFields
    });
  }
  
  // 3. 表单提交功能
  if (formInfo) {
    const isEdit = sourceCode.includes('editing') || sourceCode.includes('edit');
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: isEdit ? '新增/编辑' : '表单提交',
      type: '表单提交',
      description: isEdit ? '创建新记录或编辑现有记录' : '提交表单数据',
      formFields: formInfo.fields.map(f => ({
        name: f.name,
        label: f.label,
        type: f.type,
        required: f.required,
        options: f.options,
        validation: f.type === 'email' ? '邮箱格式' : f.required ? '必填' : undefined
      }))
    });
  }
  
  // 4. 删除功能
  if (handlers.some(h => h.name.includes('Delete')) || sourceCode.includes('handleDelete')) {
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '删除操作',
      type: '删除操作',
      description: '删除记录，通常需要二次确认',
      confirmation: '二次确认对话框',
      cascadeEffect: '删除后数据不可恢复'
    });
  }
  
  // 5. 状态切换功能
  if (handlers.some(h => h.name.includes('Toggle')) || sourceCode.includes('toggle')) {
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '状态切换',
      type: '状态切换',
      description: '切换记录状态（启用/停用等）',
      operation: '状态切换'
    });
  }
  
  // 6. 弹窗功能
  modals.forEach((modal, index) => {
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: `${modal.name}弹窗`,
      type: '弹窗交互',
      description: modal.trigger
    });
  });
  
  // 7. 特殊功能（根据组件类型）
  if (componentName === 'AgentBuilder') {
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '模板选择',
      type: '模板选择',
      description: `从 ${constants.templateCount || 40}+ 行业模板中选择`,
      categories: ['客户服务', '内容创作', '技术效率', '教育培训', '医疗健康', '政法金融', '人力资源', '生活服务', '咨询分析']
    });
    
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '实时对话测试',
      type: '交互测试',
      description: '与智能体实时对话测试响应效果'
    });
  }
  
  if (componentName === 'AgentList') {
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '详情查看',
      type: '详情展示',
      description: '查看智能体详细信息和配置'
    });
    
    functions.push({
      id: `FUNC-${String(funcId++).padStart(3, '0')}`,
      name: '版本回滚',
      type: '版本管理',
      description: '回滚到历史版本'
    });
  }
  
  // 8. 其他处理函数对应的功能
  handlers.forEach(handler => {
    // 避免重复添加已识别的功能
    const exists = functions.some(f => 
      f.name.includes(handler.action) || 
      (handler.name.includes('Save') && f.name.includes('表单'))
    );
    
    if (!exists && !['handleSave', 'handleDelete', 'handleToggle'].some(h => handler.name.startsWith(h))) {
      functions.push({
        id: `FUNC-${String(funcId++).padStart(3, '0')}`,
        name: handler.action,
        type: '业务操作',
        description: handler.description
      });
    }
  });
  
  return functions;
}

/**
 * 提取搜索字段
 * @param {string} sourceCode 
 * @returns {string[]}
 */
function extractSearchFields(sourceCode) {
  // 从 filteredXxx = useMemo 中提取
  const filterRegex = /filter\(\s*\w+\s*=>[\s\S]*?\.(\w+)\./g;
  const fields = new Set();
  let match;
  
  while ((match = filterRegex.exec(sourceCode)) !== null) {
    fields.add(match[1]);
  }
  
  // 从 includes 中提取
  const includesRegex = /\.(\w+)\.toLowerCase\(\)\.includes/g;
  while ((match = includesRegex.exec(sourceCode)) !== null) {
    fields.add(match[1]);
  }
  
  return Array.from(fields).length > 0 ? Array.from(fields) : ['name'];
}

/**
 * 提取业务规则
 * @param {string} sourceCode 
 * @returns {string[]}
 */
function extractBusinessRules(sourceCode) {
  const rules = [];
  
  // 从注释中提取
  const commentRegex = /\/\/\s*(.+?(?:规则|必须|需要|只能|不能|限制|校验|验证))/g;
  let match;
  
  while ((match = commentRegex.exec(sourceCode)) !== null) {
    const rule = match[1].trim();
    if (rule.length > 5 && rule.length < 100) {
      rules.push(rule);
    }
  }
  
  // 从代码逻辑推断
  if (sourceCode.includes('email') && sourceCode.includes('unique')) {
    rules.push('邮箱作为唯一标识，不可重复');
  }
  
  if (sourceCode.includes('password') && sourceCode.includes('required')) {
    rules.push('密码必须符合安全强度要求');
  }
  
  if (sourceCode.includes('status') && sourceCode.includes('disabled')) {
    rules.push('停用状态的账号无法访问系统');
  }
  
  return rules;
}

/**
 * 提取异常场景
 * @param {string} sourceCode 
 * @returns {Array<{scenario: string, behavior: string}>}
 */
function extractExceptionScenarios(sourceCode) {
  const scenarios = [];
  
  // 查找错误处理
  if (sourceCode.includes('try') && sourceCode.includes('catch')) {
    scenarios.push({
      scenario: '接口异常',
      behavior: '捕获异常并显示错误提示'
    });
  }
  
  // 查找验证逻辑
  if (sourceCode.includes('required') || sourceCode.includes('validation')) {
    scenarios.push({
      scenario: '必填字段为空',
      behavior: '阻止提交并提示填写必填项'
    });
  }
  
  // 查找重复校验
  if (sourceCode.includes('exists') || sourceCode.includes('duplicate')) {
    scenarios.push({
      scenario: '数据重复',
      behavior: '提示数据已存在'
    });
  }
  
  return scenarios;
}

/**
 * 获取中文名称
 * @param {string} componentName 
 * @returns {string}
 */
function getChineseName(componentName) {
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
  
  return nameMapping[componentName] || componentName;
}

/**
 * 生成模块描述
 * @param {string} componentName 
 * @param {FunctionConfig[]} functions 
 * @returns {string}
 */
function generateModuleDescription(componentName, functions) {
  const descriptions = {
    'AccountManagement': '提供组织账号治理功能，支持成员管理、权限分配、部门归属配置和账号状态控制。实现企业级RBAC权限管理体系，确保系统访问安全可控。',
    'AgentBuilder': '提供智能体构建功能，支持从40+行业模板快速启动或创建空白项目。实现智能体身份配置、能力设定、参数调优的全流程管理。',
    'AgentList': '提供智能体资产管理功能，支持智能体的列表展示、搜索筛选、编辑配置、版本回滚和性能监控。实现智能体全生命周期管理。',
    'CollaborationModule': '提供多智能体协同编排功能，支持策略市场、工作流实例管理、多机性能监控。实现复杂业务场景下的智能体协作调度。',
    'Dashboard': '提供系统仪表盘功能，展示关键业务指标、资产分布、任务动态和资源监控。实现系统运行状态的全景可视化管理。',
    'DigitalHuman': '提供数字人资产管理功能，支持形象库、背景库、动作库的统一管理。实现数字人资源的选择、预览和绑定。',
    'DigitalHumanContent': '提供数字人内容制作功能，支持脚本编辑、TTS语音配置、交互渲染设置和视频合成。实现数字人播报内容的端到端生产。',
    'DigitalHumanTemplate': '提供数字人模板精修功能，支持可视化编辑、资源插槽管理、源码编辑和部署发布。实现数字人模板的精细化定制。',
    'FlowOrchestrator': '提供流程编排功能，支持可视化流程设计、节点编排、调试仿真和执行记录查看。实现复杂业务流程的可视化编排和管理。',
    'KnowledgeModule': '提供知识库管理功能，支持文档上传、索引构建、语义搜索测试和版本管理。实现企业知识资产的统一管理和智能检索。',
    'Login': '提供用户认证功能，支持账号密码登录和角色选择。实现基于RBAC的安全访问控制。',
    'MonitoringModule': '提供全链路监控功能，支持指标驾驶舱、日志检索、告警规则和链路追踪。实现系统运行状态的全面可观测性。',
    'SystemIntegration': '提供系统集成功能，支持数据库连接池管理、第三方应用集成和安全策略配置。实现与外部系统的无缝对接。',
    'SystemSettings': '提供系统设置功能，支持模型推理引擎配置、GPU弹性算力管理、安全合规策略和系统备份。实现系统级的全局配置管理。'
  };
  
  if (descriptions[componentName]) {
    return descriptions[componentName];
  }
  
  // 基于功能自动生成描述
  const funcNames = functions.map(f => f.name).join('、');
  return `提供${getChineseName(componentName)}功能，支持${funcNames}等操作。`;
}

// ==================== 导出 ====================

module.exports = {
  analyzeComponent,
  extractInterfaces,
  extractUseStateModels,
  analyzeTableStructure,
  analyzeFormStructure,
  analyzeModals,
  analyzeHandlers,
  analyzeConstants,
  getChineseName
};
