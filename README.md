# STAMP — Journal Club Study Guide (KO / 中文 / EN)

A trilingual study guide for **STAMP** (Spatial Transcriptomics Analysis with topic Modeling to uncover spatial Patterns), based on Zhong, Ang & Chen, *Nature Methods* **21**, 2072–2083 (2024).

> 🥐 Explains STAMP through a "bakery" analogy first, then the full math: encoder → topic prior → decoder → structured horseshoe → batch / time-series extensions → evaluation metrics → variational inference, with an anticipated Q&A.

**Languages:** 한국어 · 中文 · English (toggle top-right; preference remembered in your browser).

## Project structure

```
.
├── index.html              # page skeleton (no content — just containers)
├── assets/
│   ├── css/
│   │   └── styles.css       # all styling
│   └── js/
│       ├── content.js       # ← ALL trilingual content lives here (edit this to add/change)
│       └── i18n.js          # rendering + language-switch logic
├── .nojekyll                # tells GitHub Pages to skip Jekyll
└── README.md
```

## How to add or edit content

You almost always only touch **`assets/js/content.js`**:

- **Edit a section** → find its object in `SECTIONS[]` and change the `title` / `html`. Each text block is wrapped as `.lang-ko` / `.lang-zh` / `.lang-en`; edit all three.
- **Add a section** → append a new object `{ id, num, title:{ko,zh,en}, html }` to `SECTIONS[]`, and add a matching entry to `TOC[]`. The page rebuilds itself — no HTML edits needed.
- **Restyle** → edit `assets/css/styles.css` only.

Math uses MathJax (`$...$` inline, `$$...$$` block). In `content.js`, escape backslashes (`\\alpha`, `\\sum`) since it's a JS string.

## Local preview

Open `index.html` in any browser — no build step. (If your browser blocks local `file://` scripts, run a tiny server: `python3 -m http.server` then visit `http://localhost:8000`.)

## Deploy

See `部署步骤.md` (Chinese step-by-step). In short: push these files to a public repo → Settings → Pages → Deploy from branch `main` `/root`.

## Source

- Paper: https://doi.org/10.1038/s41592-024-02463-8
- Code (Pyro): https://github.com/JinmiaoChenLab/scTM

Compiled by **Fei Xiang (費翔)**. Educational summary; verify against the primary source's Methods before formal use.

*Legend — teal: data · indigo: AI · emerald: structure · amber: uncertainty · violet: extensions.*
