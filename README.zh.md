# Awesome DSH Med Plugins

[English](README.md) | 中文

面向医学、医疗与生物医学研究场景的 [DeepSeek Harness（DSH）](https://github.com/deepseek-ai/deepseek-harness) 插件精选目录。

> 当前是最小初版，刻意从少量条目开始。被收录只表示项目相关且结构可核查，不代表临床背书。

## 什么是 DSH plugin？

DSH 构建在 [Cordis](https://github.com/cordiverse/cordis) 之上，系统行为由插件组合而成。运行时的 Cordis 插件通常导出 `apply(ctx)`、提供带 `apply` 方法的对象，或继承 `Service`；插件通过 context 注册工具、服务、事件、策略、Skill、模型适配器或 UI，并应在卸载时撤销其副作用。

对于可长期安装和分发的第三方扩展，DSH 通常使用 **profile bundle**：一个兼容 npm 的包，并在 `package.json` 中声明 patch 文件。

```json
{
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
}
```

patch 再把一个或多个 Cordis 模块挂载到 DSH profile。安装方式通常是：

```sh
dsh plugin --profile web add <包名或仓库地址>
```

启动前可以检查最终的组合树：

```sh
dsh --profile web --dump-config
```

这个命令把包管理转交给 pnpm；只有声明了 `dsh.bundle` 的依赖才会自动成为 profile layer。因此，单纯的提示词集合、独立 MCP server、Skill 文件夹或外部应用不自动等于 DSH plugin；只有提供明确的 DSH 安装或挂载路径时，才属于本目录的收录范围。

DSH 目前仍是 developer preview，版本升级可能破坏插件兼容性。

## 收录标准

- 提供真实的 DSH 加载路径，优先接受包含 bundle manifest 与 Cordis patch 的项目。
- 能力与医学、医疗或生物医学研究有实质关系。
- 说明安装、适配的 DSH 版本、依赖和卸载方式。
- 披露网络访问目标、凭据、本地文件访问，以及患者数据等敏感信息的处理方式。
- 区分“技术功能可运行”与“临床有效”；不收录缺乏依据的诊疗宣称。
- 源码可检查，并有明确许可证。

## 插件列表

### 文献与证据

| 插件 | 功能 | 核查状态 |
| --- | --- | --- |
| [wade20250715/dsh-pubmed](https://github.com/wade20250715/dsh-pubmed) | 注册 7 个 PubMed/NCBI 工具，覆盖文献检索、作者消歧、机构统计、师承匹配与撤稿核查。 | 2026-08-19 已核查源码结构，尚未做运行时测试。 |

后续只在出现真实条目时增加分类：临床工具、生物医学数据、医学影像、科研工作流、安全与隐私。

## 安全说明

DSH 插件及其安装脚本会以用户的操作系统权限运行第三方代码，不受常规 agent tool sandbox 约束；web bundle 还可在 DSH UI 的 origin 中执行。它们可能读取文件或凭据、发起网络请求、访问已配置服务，甚至替换组合树中的既有条目。安装前应检查源码与数据流。医学场景下，除非完整的执行、传输与存储链路都已获批，不要输入受保护健康信息。此目录不构成医疗建议，也不证明任何插件具有临床安全性或有效性。

## 贡献

参见 [CONTRIBUTING.md](CONTRIBUTING.md)。本仓库仿照 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 的数据优先结构：每个条目在 [`data/plugins/`](data/plugins/) 下对应一个 YAML 文件。

## 一手资料

- [DeepSeek Harness 架构](https://github.com/deepseek-ai/deepseek-harness/blob/99f6f02fecdb7dff40c3fbc9470f5907c29f74ca/docs/architecture.zh.md)
- [Cordis 第一个插件教程](https://github.com/deepseek-ai/deepseek-harness/blob/99f6f02fecdb7dff40c3fbc9470f5907c29f74ca/docs/cordis-tutorial/01-first-plugin.zh.md)
- [DSH profile bundle 约定](https://github.com/deepseek-ai/deepseek-harness/blob/99f6f02fecdb7dff40c3fbc9470f5907c29f74ca/packages/bundle/README.zh.md)
- [DSH 扩展形态 cookbook](https://github.com/deepseek-ai/deepseek-harness/blob/99f6f02fecdb7dff40c3fbc9470f5907c29f74ca/docs/cookbook/extension-cookbook.zh.md)

## 许可证

[CC0 1.0 Universal](LICENSE)。各插件仍适用其各自许可证。
