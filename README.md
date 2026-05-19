# 钟浩的个人主页

这是一个可以直接部署到 GitHub Pages 的静态个人介绍页面，适合用作 `Tomhao10225101490.github.io`。

## 本地查看

直接用浏览器打开 `index.html` 即可预览。也可以在本目录运行：

```bash
node preview-server.js
```

然后访问 `http://127.0.0.1:4173/`。

## 发布到 GitHub Pages

1. 在 GitHub 新建仓库，仓库名使用 `Tomhao10225101490.github.io`。
2. 把本目录中的 `index.html`、`styles.css` 和 `assets/profile.jpg` 上传到仓库根目录。
3. 进入仓库的 `Settings` -> `Pages`，选择从 `main` 分支根目录发布。
4. 等待 GitHub Pages 构建完成后，访问 `https://tomhao10225101490.github.io/`。

## 建议替换的内容

- “关于我”和“我关注的方向”里的具体个人经历、项目和作品。
- 如果以后有邮箱、博客或社交账号，可以补到“保持联系”区域。

## GitHub 个人页 README

如果你想改截图里 GitHub 个人页中间那块介绍，可以使用 `GITHUB_PROFILE_README.md` 作为模板。
把它的内容放到 `Tomhao10225101490` 仓库的 `README.md`，并把 `assets/profile.jpg` 一起上传到同一个仓库。
