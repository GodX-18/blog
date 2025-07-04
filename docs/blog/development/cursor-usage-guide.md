# Cursor Rules 你真的掌握了吗？从基础操作到高阶技巧全解析

:::tip

该教材适用于 Cursor  0.47.* 及以上版本，可能无法在更低版本上正确运行。请在开始前更新您的 Cursor。

请使用 claude-3.5-sonnet 或 claude-3.7-sonnet 模型以获得最佳效果。课程设计使用这些模型。您可以在模型选择器中更改模型：

![模型选择器](https://godx-1327414183.cos.ap-shanghai.myqcloud.com/images/model-selector-20250417134417513-20250417160108785.png)

:::

## Cursor Rules 简介


欢迎来到第一阶段！今天我们将学习关于 Cursor 规则——这是一种简单但强大的方式，可以让 AI 编码更好地为您服务。

### 什么是 Cursor 规则？

Cursor 规则就像一组指令，告诉 Cursor 如何帮助您编码。就像您可能对代码的风格或工作方式有偏好一样，这些规则帮助 Cursor 理解并遵循您的偏好。可以把这些规则看作是一个指南，帮助 Cursor 理解您希望如何编写代码。

### 两种类型的规则

1. **项目规则** 
- 存在于项目的 `.cursor/rules` 文件夹中 
- 帮助满足特定项目需求 
- 可以针对某些文件或文件夹 
- 与您的项目一起保留在版本控制中

您可以在 Cursor 的设置中来找到 Cursor 规则设置。然后转到规则选项卡：

![Cursor 规则设置](https://godx-1327414183.cos.ap-shanghai.myqcloud.com/images/project-rules-20250417134418105-20250417160108865.png)

2. **全局规则** 
- 在您的 Cursor 设置中一次性设置 
- 适用于所有项目 
- 非常适合您的个人偏好 
- 处理诸如语言设置和响应风格等事项

全局规则可以与项目规则在同一选项卡中添加。

![AI 设置规则](https://godx-1327414183.cos.ap-shanghai.myqcloud.com/images/global-rules-20250417134418633-20250417160108940.png)

### 它们的不同之处

| 特性     | 项目规则       | 全局规则   |
| -------- | -------------- | ---------- |
| 作用范围 | 单项目         | 所有项目   |
| 适用场景 | 团队协作       | 个人偏好   |
| 维护方式 | 随项目版本控制 | 一次性设置 |

1. **项目规则** 
- 特定于每个项目
- 与您的项目文件一起移动 
- 适合团队协作
- 自动应用于相关文件

2. **全局规则** 
- 在整个 Cursor 中都有效 
- 一次设置即可
- 非常适合您的编码风格
- 无需为每个项目设置

## 项目规则类型和设置

你的项目中适用的规则在`.cursor/rules`文件夹内的扩展名为`.mdc`的文件中描述。你已经在之前的步骤中生成了这样一个文件。这些文件在你的项目中的适用性可以通过定义规则类型来确定。

![](https://godx-1327414183.cos.ap-shanghai.myqcloud.com/images/rules-01.png)

+   `Always` - 规则始终适用于项目中的任何文件
+   `Auto Attached` - 规则仅适用于符合设置中指定类型的文件
+   `Agent Requested` - 由 Agent 根据你在规则中指定的描述来决定是否读取或不读取规则，是否在特定请求中应用。例如，如果描述包含Python语言的标准，代理将在使用这种语言创建文件时注意这些规则
+   `Manual` - 代理只有在你在请求中使用`@`符号提到规则时才会应用该规则

## 利用 AI 自动创建规则

Cursor 规则最强大的功能之一是您可以使用 Cursor 的 AI 功能自动创建它们。让我们来探索这个功能，并了解一些高级规则设置。

## 规则可视化

```markdown
rule-visibility

1. Display applied rules at AI action 
2. ONLY if action uses rule. Do not display rules unrelated to an action 

# Rule Visibility

This rule ensures transparency by displaying a list of all rules that are currently being applied at every AI action.

## Requirements
- At the beginning of each response, list all rules that are being applied
- Format the list as a bulleted list with rule names and descriptions
- Include this rule in the list
- Apply this rule to all files and all actions

## Application
- Apply this rule for every edit, search, or response
- This rule should always be applied, regardless of context
```

## 规则继承

```markdown
 # 编码标准规则

这个规则集定义了项目的整体编码标准，包括类和函数的特定要求。

## 引用规则

这个规则集引用了以下规则：

@class-standards.mdc
@function-standards.mdc

## 额外规则

除了引用的规则外，还应遵循以下通用编码实践：

- 代码应清晰易读
- 变量命名应有意义
- 每个文件应包含适当的文档
```

