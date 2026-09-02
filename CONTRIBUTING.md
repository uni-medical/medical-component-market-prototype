# Contributing / 贡献指南

Keep submissions small and evidence-based. Each pull request should add or update one plugin entry under `data/plugins/`.

提交应尽量小，并给出可核查证据。每个 PR 只新增或更新 `data/plugins/` 下的一个插件条目。

## Before submitting / 提交前

1. Confirm that the repository has a concrete DSH load path. Prefer a `package.json` containing `dsh.bundle.patch`, a readable `cordis.patch.yml`, and a module implementing a Cordis plugin shape.
2. Confirm that the capability is materially medical, healthcare, or biomedical.
3. Read the source relevant to network, filesystem, credentials, telemetry, and patient-data handling.
4. Record only the review level actually completed; source review is not runtime verification.

1. 确认项目有明确的 DSH 加载路径。优先检查 `package.json` 中的 `dsh.bundle.patch`、可读的 `cordis.patch.yml`，以及实现 Cordis 插件形态的模块。
2. 确认其能力与医学、医疗或生物医学有实质关系。
3. 检查与网络、文件系统、凭据、遥测及患者数据处理有关的源码。
4. 只记录实际完成的核查等级；源码核查不等于运行时验证。

## Entry format / 条目格式

Name the file `data/plugins/<owner>__<repo>.yml`:

```yaml
url: https://github.com/owner/repo
name: owner/repo
category: literature-evidence
description:
  en: One factual sentence.
  zh: 一句可核查的中文描述。
verification:
  status: source-reviewed
  checked_at: 'YYYY-MM-DD'
  runtime_tested: false
  evidence:
    - package.json declares dsh.bundle.patch.
```

Allowed initial review states:

- `listed`: identity and relevance checked only.
- `source-reviewed`: bundle, patch, entrypoint, and sensitive data paths inspected.
- `runtime-tested`: installed and exercised on a recorded DSH version; include test evidence in the PR.

初始核查状态：

- `listed`：只核对项目身份与相关性。
- `source-reviewed`：已检查 bundle、patch、入口与敏感数据路径。
- `runtime-tested`：已在明确记录的 DSH 版本上安装并运行；PR 中必须附测试证据。

## Medical safety / 医学安全

Do not describe a plugin as clinically validated, safe, diagnostic, or treatment-grade without direct supporting evidence. Disclose whether it can receive PHI, where data is sent, and whether outputs are intended only for research or decision support.

没有直接证据时，不要把插件描述为“临床验证”“安全”“可诊断”或“治疗级”。必须说明它是否可能接收受保护健康信息、数据发往何处，以及输出是否仅用于研究或辅助决策。
