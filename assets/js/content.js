/* ============================================================
   STAMP Journal Club Guide — CONTENT DATA
   To add/edit a section, edit this file only. Each section is an
   object: { id, num, title:{ko,zh,en}, html }.
   `html` may contain .lang-ko / .lang-zh / .lang-en blocks and
   MathJax ($...$, $$...$$). Order in SECTIONS[] = order on page.
   ============================================================ */

const HERO = {
  eyebrow: "Nature Methods 2024 · Deep Generative Model",
  title: {
    ko: "STAMP — <em>공간 전사체 토픽 모델</em>",
    zh: "STAMP — <em>空间转录组主题模型</em>",
    en: "STAMP — <em>Spatial Topic Model</em>"
  },
  lead: {
    ko: "완성된 빵만 보고 보이지 않는 주방을 거꾸로 알아내는 가게 — 공간 전사체 데이터 $X$를 해석 가능한 저차원 토픽 $Z$로 압축하고, 다시 발현으로 복원하는 심층 생성 모델. 이 가이드는 STAMP의 전 과정을 직관 → 수식 → 확장 순으로 정리합니다.",
    zh: "一家只看成品、反推后厨的面包店——把空间转录组数据 $X$ 压缩成可解释的低维主题 $Z$，再重建回基因表达的深度生成模型。本指南按\u201c直觉 → 公式 → 扩展\u201d梳理 STAMP 全流程。",
    en: "A bakery that infers its hidden kitchen from finished loaves alone — a deep generative model that compresses spatial transcriptomics data $X$ into interpretable low-dimensional topics $Z$, then reconstructs expression. This guide walks through STAMP from intuition to math to extensions."
  },
  refLabel: { ko: "Nature Methods 21, 2072–2083 (2024) · 코드", zh: "Nature Methods 21, 2072–2083 (2024) · 代码", en: "Nature Methods 21, 2072–2083 (2024) · code" }
};

const SECTIONS = [
  {
    id: "bigpic", num: "00",
    title: { ko: "큰 그림", zh: "全局", en: "The Big Picture" },
    html: `
      <div class="lang lang-ko"><p class="sec-sub">한 문장: STAMP의 본질은 <strong>행렬 분해(Matrix Factorization)</strong>를 딥러닝으로 푼 것.</p><p>원 데이터는 <strong>세포 × 유전자</strong> 발현 행렬 $X$. STAMP는 이를 두 행렬의 곱으로 분해합니다:</p></div>
      <div class="lang lang-zh"><p class="sec-sub">一句话:STAMP 的本质是用深度学习求解<strong>矩阵分解(Matrix Factorization)</strong>。</p><p>原始数据是<strong>细胞 × 基因</strong>表达矩阵 $X$。STAMP 把它分解成两个矩阵的乘积:</p></div>
      <div class="lang lang-en"><p class="sec-sub">In one sentence: STAMP is <strong>matrix factorization</strong> solved with deep learning.</p><p>The raw data is a <strong>cell × gene</strong> expression matrix $X$. STAMP factorizes it into a product of two matrices:</p></div>
      <div class="eq" style="text-align:center; font-size:16px;">$$\\underbrace{X}_{\\text{cell}\\times\\text{gene}}\\ \\approx\\ \\underbrace{Z}_{\\text{cell}\\times\\text{topic}}\\ \\times\\ \\underbrace{\\beta}_{\\text{topic}\\times\\text{gene}}$$</div>
      <div class="lang lang-ko"><p>$Z$=각 세포의 토픽 비율, $\\beta$=각 토픽의 유전자 구성. <strong>topic</strong>은 데이터에서 발견되는 \u201c유전자 공발현 프로그램\u201d이며, NLP의 주제 모델(LDA)을 공간 전사체로 옮긴 개념. 전통적으로 NMF로 풀던 문제를 STAMP는 <strong>GCN + VAE</strong>로 풉니다.</p></div>
      <div class="lang lang-zh"><p>$Z$=每个细胞的主题比例,$\\beta$=每个主题的基因构成。<strong>topic</strong> 是从数据中发现的\u201c基因共表达程序\u201d,把 NLP 主题模型(LDA)迁移到空间转录组。传统用 NMF 求解的问题,STAMP 用 <strong>GCN + VAE</strong> 来解。</p></div>
      <div class="lang lang-en"><p>$Z$ = topic proportions per cell, $\\beta$ = gene composition per topic. A <strong>topic</strong> is a \u201cgene co-expression program\u201d discovered from data — porting NLP topic modeling (LDA) to spatial transcriptomics. What was classically solved by NMF, STAMP solves with a <strong>GCN + VAE</strong>.</p></div>
      <div class="callout t">
        <span class="lang lang-ko"><strong>왜 굳이 topic을 거치나?</strong> 수만 개 유전자를 수십 개의 해석 가능한 기능 모듈로 압축 → 차원 축소 + 노이즈 제거 + 해석 가능성. 클러스터링과 달리 한 세포가 <strong>여러 토픽의 혼합</strong>일 수 있어 조직 경계·혼합 상태를 자연스럽게 표현.</span>
        <span class="lang lang-zh"><strong>为什么要拐 topic 这个弯?</strong> 把几万个基因压缩成几十个可解释的功能模块 → 降维 + 去噪 + 可解释性。与聚类不同,一个细胞可以是<strong>多个主题的混合</strong>,自然表达组织交界、混合状态。</span>
        <span class="lang lang-en"><strong>Why route through topics?</strong> Compress tens of thousands of genes into dozens of interpretable functional modules → dimension reduction + denoising + interpretability. Unlike clustering, one cell can be a <strong>mixture of several topics</strong>, naturally capturing tissue boundaries and mixed states.</span>
      </div>`
  },
  {
    id: "bakery", num: "01",
    title: { ko: "빵집 비유 🥐", zh: "面包店比喻 🥐", en: "The Bakery Analogy 🥐" },
    html: `
      <div class="lang lang-ko"><p class="sec-sub">수식을 벗기고 직관부터. 각 부품을 \u201c빵집 언어 ↔ 실제 용어\u201d로 나란히.</p></div>
      <div class="lang lang-zh"><p class="sec-sub">先脱去公式建立直觉。每个零件\u201c面包店语言 ↔ 真实术语\u201d并排。</p></div>
      <div class="lang lang-en"><p class="sec-sub">Strip the math, build intuition first. Each part as \u201cbakery language ↔ real term\u201d.</p></div>
      <div class="analogy">
        <div class="acard teal"><div class="icon">🥖</div><div class="bake"><span class="lang lang-ko">빵 한 개 = 여러 유파의 혼합</span><span class="lang lang-zh">一个面包 = 多种流派的混合</span><span class="lang lang-en">One loaf = a blend of styles</span></div><div class="real">Z · topic proportion · N×K</div><div class="adesc"><span class="lang lang-ko">\u201c1번 빵 = 70% 프랑스식 + 25% 일본식…\u201d. 한 빵이 한 유파에만 속하지 않고 여러 유파의 비율로.</span><span class="lang lang-zh">\u201c1号 = 70% 法式 + 25% 日式…\u201d。一个面包不只属于一个流派,而用多个流派的比例表示。</span><span class="lang lang-en">\u201cLoaf #1 = 70% French + 25% Japanese…\u201d. A loaf isn't one style — it's a mix of proportions.</span></div></div>
        <div class="acard emerald"><div class="icon">📋</div><div class="bake"><span class="lang lang-ko">각 유파의 재료 배합표</span><span class="lang lang-zh">每个流派的配方表</span><span class="lang lang-en">Each style's recipe</span></div><div class="real">β (W+R) · gene module · K×G</div><div class="adesc"><span class="lang lang-ko">프랑스식 = 버터·밀가루·이스트… 각 토픽이 어떤 유전자로 정의되는지.</span><span class="lang lang-zh">法式 = 黄油·面粉·酵母… 每个主题由哪些基因定义。</span><span class="lang lang-en">French = butter, flour, yeast… which genes define each topic.</span></div></div>
        <div class="acard indigo"><div class="icon">🏠</div><div class="bake"><span class="lang lang-ko">옆 진열대를 보고 판단</span><span class="lang lang-zh">看隔壁货架来判断</span><span class="lang lang-en">Judge by the next shelf</span></div><div class="real">SGCN · spatial neighbors</div><div class="adesc"><span class="lang lang-ko">주변이 전부 프랑스식이면 이 빵도 그럴 확률↑. 이웃 정보 함께 입력(SX, S²X).</span><span class="lang lang-zh">周围全是法式,这个也更可能是法式。把邻居信息一起输入(SX, S²X)。</span><span class="lang lang-en">If neighbors are all French, this loaf likely is too. Feed neighbors (SX, S²X).</span></div></div>
        <div class="acard amber"><div class="icon">⚖️</div><div class="bake"><span class="lang lang-ko">빵의 크기 (개수 보정)</span><span class="lang lang-zh">面包的大小(测序深度)</span><span class="lang lang-en">Loaf size (depth)</span></div><div class="real">library size · lₙ</div><div class="adesc"><span class="lang lang-ko">큰 빵은 절대량이 많지만 유파가 다른 건 아님. lₙ이 \u201c크기\u201d 담당.</span><span class="lang lang-zh">大面包绝对量多,但流派没变。lₙ 负责\u201c个头\u201d。</span><span class="lang lang-en">A bigger loaf has more of everything but isn't a different style. lₙ handles \u201csize\u201d.</span></div></div>
        <div class="acard amber"><div class="icon">🌶️</div><div class="bake"><span class="lang lang-ko">재료의 성깔 (변동성)</span><span class="lang lang-zh">原料的脾气(变动)</span><span class="lang lang-en">Ingredient temperament</span></div><div class="real">dispersion · αg</div><div class="adesc"><span class="lang lang-ko">소금은 일정, 어떤 향신료는 들쭉날쭉. αg가 재료별 변동성 기록.</span><span class="lang lang-zh">盐稳定,某些香料忽多忽少。αg 记录每种原料的变动性。</span><span class="lang lang-en">Salt is steady; some spices vary wildly. αg records per-ingredient variability.</span></div></div>
        <div class="acard emerald"><div class="icon">✂️</div><div class="bake"><span class="lang lang-ko">배합표는 깔끔하게</span><span class="lang lang-zh">配方要干净</span><span class="lang lang-en">Keep recipes clean</span></div><div class="real">3-level horseshoe · sparsity</div><div class="adesc"><span class="lang lang-ko">좋은 유파는 핵심 재료 몇 가지만. 세 관문이 불필요한 재료를 0으로.</span><span class="lang lang-zh">好的流派只用少数核心原料。三道关卡把多余原料压到 0。</span><span class="lang lang-en">A good style uses only a few key ingredients. Three gates push the rest to 0.</span></div></div>
      </div>`
  },
  {
    id: "encoder", num: "02",
    title: { ko: "Encoder — $X$ 에서 토픽 비율 $Z$", zh: "编码器 — 从 $X$ 到主题比例 $Z$", en: "Encoder — from $X$ to topics $Z$" },
    html: `
      <div class="lang lang-ko"><p class="sec-sub">유전자 발현 + 공간 이웃 정보를 SGCN에 넣어 각 세포의 토픽 비율 분포를 추론.</p></div>
      <div class="lang lang-zh"><p class="sec-sub">把基因表达 + 空间邻居信息送进 SGCN,推断每个细胞的主题比例分布。</p></div>
      <div class="lang lang-en"><p class="sec-sub">Feed gene expression + spatial neighbor info into the SGCN to infer each cell's topic-proportion distribution.</p></div>
      <div class="flow">
        <div class="node"><div class="tag">raw input</div><div class="big">$X$</div><div class="shape">N × G</div><div class="desc"><span class="lang lang-ko">세포별 발현</span><span class="lang lang-zh">细胞基因表达</span><span class="lang lang-en">expression</span></div></div>
        <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M14 6l6 6-6 6"/></svg></div>
        <div class="node"><div class="tag">spatial concat</div><div class="big">$[X,SX,S^lX]$</div><div class="shape">N × (l+1)G</div><div class="desc"><span class="lang lang-ko">자기+이웃</span><span class="lang lang-zh">自己+邻居</span><span class="lang lang-en">self+neighbors</span></div></div>
        <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M14 6l6 6-6 6"/></svg></div>
        <div class="node ai"><div class="tag">SGCN → params</div><div class="big">$Z_\\mu, Z_\\sigma$</div><div class="shape">N × K</div><div class="desc"><span class="lang lang-ko">평균 &amp; 분산</span><span class="lang lang-zh">均值&amp;方差</span><span class="lang lang-en">mean&amp;var</span></div></div>
        <div class="arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M14 6l6 6-6 6"/></svg></div>
        <div class="node ai"><div class="tag">softmax_k</div><div class="big">$Z$</div><div class="shape">N × K</div><div class="desc"><span class="lang lang-ko">비율(합=1)</span><span class="lang lang-zh">比例(和=1)</span><span class="lang lang-en">props(sum=1)</span></div></div>
      </div>
      <div class="callout">
        <span class="lang lang-ko"><strong>$S=\\tilde D^{-1/2}\\tilde A\\tilde D^{-1/2}$</strong> ($\\tilde A=A+I$). $SX$=이웃 발현 가중평균, $S^lX$=l-hop. layer 수 $l$↑ → 공간적으로 더 매끄러운 토픽(Moran's $I$로 확인), 단 세포 고유 identity 희석 → trade-off.</span>
        <span class="lang lang-zh"><strong>$S=\\tilde D^{-1/2}\\tilde A\\tilde D^{-1/2}$</strong>($\\tilde A=A+I$)。$SX$=邻居表达加权平均,$S^lX$=l 跳。层数 $l$↑ → 主题空间上更平滑(Moran's $I$ 验证),但细胞 identity 被稀释 → 权衡。</span>
        <span class="lang lang-en"><strong>$S=\\tilde D^{-1/2}\\tilde A\\tilde D^{-1/2}$</strong> ($\\tilde A=A+I$). $SX$ = weighted mean of neighbor expression, $S^lX$ = l-hop. More layers $l$ → spatially smoother topics (verified via Moran's $I$), but cell identity gets diluted → trade-off.</span>
      </div>`
  },
  {
    id: "zprior", num: "03",
    title: { ko: "토픽 비율의 사전분포 — 토픽 간 상관", zh: "主题比例的先验 — 主题间相关", en: "Topic Prior — correlated topics" },
    html: `
      <div class="lang lang-ko"><p class="sec-sub">$Z$의 prior는 토픽들이 독립이 아니라 <strong>상관 구조</strong>를 갖도록 설계 — LDA의 독립 가정과의 핵심 차이.</p></div>
      <div class="lang lang-zh"><p class="sec-sub">$Z$ 的先验让主题不是独立,而是带<strong>相关结构</strong>——与 LDA 独立假设的核心区别。</p></div>
      <div class="lang lang-en"><p class="sec-sub">$Z$'s prior makes topics <strong>correlated</strong> rather than independent — the key difference from LDA.</p></div>
      <div class="grid">
        <div class="card ai">
          <h4><span class="lang lang-ko">저랭크 공분산 $UU^\\top+\\sigma I$</span><span class="lang lang-zh">低秩协方差 $UU^\\top+\\sigma I$</span><span class="lang lang-en">Low-rank covariance $UU^\\top+\\sigma I$</span></h4>
          <div class="klabel">logistic-normal · correlated</div>
          <div class="eq">$$u_k\\sim N(0,I),\\quad \\sigma\\sim\\text{HalfCauchy}(1)$$</div>
          <div class="eq">$$\\tilde z_n\\sim N(0,\\ UU^\\top+\\sigma I),\\quad z_{nk}=\\text{softmax}_k(\\tilde z_{nk})$$</div>
          <p class="note"><span class="lang lang-ko">$U$=K×D 토픽 지문. $UU^\\top$의 $(i,j)$=토픽 i·j 지문 내적=상관. $\\sigma I$=토픽별 독립 노이즈 + 정정성(可逆) 보장. 원문: 저랭크 D=토픽 수.</span><span class="lang lang-zh">$U$=K×D 主题指纹。$UU^\\top$ 的 $(i,j)$=主题 i·j 指纹内积=相关。$\\sigma I$=各主题独立噪声 + 保证正定(可逆)。原文:低秩 D=主题数。</span><span class="lang lang-en">$U$ = K×D topic fingerprints. $(i,j)$ of $UU^\\top$ = inner product of topics i·j = their correlation. $\\sigma I$ = per-topic independent noise + ensures positive-definiteness. Paper: rank D = number of topics.</span></p>
        </div>
        <div class="card amber">
          <h4><span class="lang lang-ko">$Z_\\sigma$ 차원 = $N\\times K$</span><span class="lang lang-zh">$Z_\\sigma$ 维度 = $N\\times K$</span><span class="lang lang-en">$Z_\\sigma$ dimension = $N\\times K$</span></h4>
          <div class="klabel">cell-wise &amp; topic-wise uncertainty</div>
          <p><span class="lang lang-ko">SGCN 출력 분산은 세포마다·토픽마다 독립 → <strong>N×K</strong>, $N\\times1$ 아님.</span><span class="lang lang-zh">SGCN 输出的方差逐细胞、逐主题独立 → <strong>N×K</strong>,不是 $N\\times1$。</span><span class="lang lang-en">SGCN's output variance is independent per cell &amp; per topic → <strong>N×K</strong>, not $N\\times1$.</span></p>
          <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; background:var(--bg); border-radius:8px; padding:9px 12px; line-height:1.6;">cell1: [0.5, 0.2, 0.3]<br>cell2: [0.3, 0.4, 0.1]</div>
          <p class="note" style="margin-top:8px;"><span class="lang lang-ko"><strong>단, 최종 출력 $z_{nk}$는 변분 후방의 평균값</strong>(원문 Outputs). $Z_\\sigma$는 학습 중 불확실성·정규화 역할.</span><span class="lang lang-zh"><strong>但最终输出 $z_{nk}$ 取变分后验的均值</strong>(原文 Outputs)。$Z_\\sigma$ 在训练期做不确定性建模与正则化。</span><span class="lang lang-en"><strong>But the final $z_{nk}$ uses the variational posterior mean</strong> (paper, Outputs). $Z_\\sigma$ serves uncertainty modeling &amp; regularization during training.</span></p>
        </div>
      </div>`
  },
  {
    id: "decoder", num: "04",
    title: { ko: "Decoder — $Z$ 로부터 발현 재구성", zh: "解码器 — 从 $Z$ 重建表达", en: "Decoder — reconstruct from $Z$" },
    html: `
      <div class="grid">
        <div class="card struct">
          <h4><span class="lang lang-ko">두 배합표 → 예측 발현</span><span class="lang lang-zh">两个配方 → 预测表达</span><span class="lang lang-en">Two recipes → predicted expression</span></h4>
          <div class="klabel">matrix multiplication</div>
          <div class="eq">$$\\mu_{ng}=l_n\\sum_k z_{nk}\\,\\beta_{kg}\\quad(N\\times G)$$</div>
          <p class="note"><span class="chip teal">$z_{nk}$ N×K</span> <span class="lang lang-ko">세포 구성</span><span class="lang lang-zh">细胞构成</span><span class="lang lang-en">cell mix</span> · <span class="chip emerald">$\\beta_{kg}$ K×G</span> <span class="lang lang-ko">토픽의 유전자 구성. $l_n=\\sum_g x_{ng}$.</span><span class="lang lang-zh">主题的基因构成。$l_n=\\sum_g x_{ng}$。</span><span class="lang lang-en">topic's gene mix. $l_n=\\sum_g x_{ng}$.</span></p>
        </div>
        <div class="card amber">
          <h4><span class="lang lang-ko">관측 분포 — overdispersion</span><span class="lang lang-zh">观测分布 — 过离散</span><span class="lang lang-en">Likelihood — overdispersion</span></h4>
          <div class="klabel">GammaPoisson · 과산포</div>
          <div class="eq">$$x_{ng}\\sim\\text{GammaPoisson}(\\mu_{ng},\\ \\alpha_g)$$</div>
          <p class="note"><span class="lang lang-ko">Poisson(분산=평균) 대신 $\\alpha_g$로 분산을 평균과 분리. 원문: <strong>분산의 제곱근</strong>을 Half-Cauchy로 — 0 근처 질량이 \u201c대부분 과산포 없음\u201d을 신호.</span><span class="lang lang-zh">用 $\\alpha_g$ 把方差与均值分离,取代 Poisson(方差=均值)。原文:<strong>对方差的平方根</strong>用 Half-Cauchy——质量集中 0 附近,意味\u201c大多数基因无过离散\u201d。</span><span class="lang lang-en">$\\alpha_g$ decouples variance from mean, replacing Poisson. Paper: a Half-Cauchy on the <strong>square root of dispersion</strong> — mass near 0 signals \u201cmost genes show no overdispersion\u201d.</span></p>
          <div class="eq" style="margin-top:6px;">$$\\sqrt{\\alpha_g}\\sim\\text{Half-Cauchy}(1)$$</div>
        </div>
      </div>
      <div class="callout">
        <span class="lang lang-ko"><strong>전체 닫힌 고리</strong>: $X\\to Z\\to\\mu\\to\\hat X$, ELBO로 \u201c$\\hat X$가 원본 $X$와 닮았나\u201d 채점. 학습 후 $Z$·$\\beta$가 과학적 산출물.</span>
        <span class="lang lang-zh"><strong>完整闭环</strong>: $X\\to Z\\to\\mu\\to\\hat X$,用 ELBO 给\u201c$\\hat X$ 像不像原始 $X$\u201d打分。训练后的 $Z$·$\\beta$ 就是科学产物。</span>
        <span class="lang lang-en"><strong>Full loop</strong>: $X\\to Z\\to\\mu\\to\\hat X$; ELBO scores how well $\\hat X$ matches $X$. The learned $Z$ and $\\beta$ are the scientific outputs.</span>
      </div>`
  },
  {
    id: "horseshoe", num: "05",
    title: { ko: "$\\beta$ 의 내부 — 구조화 Horseshoe 3단계", zh: "$\\beta$ 内部 — 结构化 Horseshoe 三层", en: "Inside $\\beta$ — structured horseshoe (3 levels)" },
    html: `
      <div class="lang lang-ko"><p class="sec-sub">$\\beta_{kg}=\\text{softmax}_g(w_{kg}+r_g)$. $W$(토픽 고유 모듈) + $R$(공통 배경)의 정확한 생성 방식.</p></div>
      <div class="lang lang-zh"><p class="sec-sub">$\\beta_{kg}=\\text{softmax}_g(w_{kg}+r_g)$。$W$(主题专属模块)+ $R$(公共背景)的精确生成方式。</p></div>
      <div class="lang lang-en"><p class="sec-sub">$\\beta_{kg}=\\text{softmax}_g(w_{kg}+r_g)$. The exact construction of $W$ (topic-specific) + $R$ (shared background).</p></div>
      <div class="grid">
        <div class="card struct">
          <h4><span class="lang lang-ko">Gene Module $W$ — regularized horseshoe</span><span class="lang lang-zh">Gene Module $W$ — 正则化 horseshoe</span><span class="lang lang-en">Gene Module $W$ — regularized horseshoe</span></h4>
          <div class="klabel">structured sparsity · K×G</div>
          <div class="stack">
            <div class="layer"><span class="lv">gene-wise</span><span><b>$\\delta_g$</b> <span class="lang lang-ko">→ 0이면 모든 토픽에서 무관</span><span class="lang lang-zh">→ 趋 0 则该基因对所有主题无关</span><span class="lang lang-en">→ if →0, gene irrelevant to all topics</span></span></div>
            <div class="layer"><span class="lv">topic-wise</span><span><b>$\\tau_k$</b> <span class="lang lang-ko">→ 토픽 단위 shrinkage</span><span class="lang lang-zh">→ 主题级收缩</span><span class="lang lang-en">→ topic-level shrinkage</span></span></div>
            <div class="layer"><span class="lv">element-wise</span><span><b>$\\lambda_{kg}$</b> <span class="lang lang-ko">→ 특정 토픽에서 특정 유전자 끄기</span><span class="lang lang-zh">→ 关闭特定主题中的特定基因</span><span class="lang lang-en">→ turn off a specific gene in a topic</span></span></div>
          </div>
          <div class="eq" style="font-size:13px;">$$\\delta_g,\\tau_k,\\lambda_{kg}\\sim\\text{HalfCauchy}(1),\\ \\ c\\sim\\text{InvGamma}(0.5,0.5)$$</div>
          <div class="eq" style="font-size:13px;">$$\\tilde\\lambda_{kg}=\\delta_g\\tau_k\\lambda_{kg},\\ \\ w_{kg}\\sim N\\!\\Big(0,\\tfrac{c^2\\tilde\\lambda_{kg}^2}{c^2+\\tilde\\lambda_{kg}^2}\\Big)$$</div>
          <p class="note"><span class="lang lang-ko">원문 핵심: <strong>$c^2\\ll\\tilde\\lambda_{kg}^2$일 때 $w_{kg}$의 prior가 $N(0,c^2)$로 수렴</strong> → 약하게 식별되는 파라미터도 정규화($c$=상한).</span><span class="lang lang-zh">原文要点:<strong>当 $c^2\\ll\\tilde\\lambda_{kg}^2$ 时 $w_{kg}$ 先验趋向 $N(0,c^2)$</strong> → 即使弱可识别参数也被正则化($c$=上限)。</span><span class="lang lang-en">Paper's key point: <strong>when $c^2\\ll\\tilde\\lambda_{kg}^2$, the prior on $w_{kg}$ approaches $N(0,c^2)$</strong> → regularizes even weakly-identified parameters ($c$ = upper bound).</span></p>
        </div>
        <div class="card struct">
          <h4><span class="lang lang-ko">Background Residual $R$ — 공통 배경</span><span class="lang lang-zh">Background Residual $R$ — 公共背景</span><span class="lang lang-en">Background Residual $R$ — shared baseline</span></h4>
          <div class="klabel">shared baseline · (G,)</div>
          <div class="eq">$$r_g\\sim N\\big(\\log(\\bar x_g+\\epsilon),\\ 1\\big),\\quad \\epsilon=10^{-8}$$</div>
          <p class="note"><span class="lang lang-ko">$\\bar x_g$=유전자 g의 <strong>log-정규화 관측 평균</strong>. 모든 토픽 공통 배경 — 어디서나 높은 유전자를 downweight해 토픽 특이성 보호. $r_g$엔 $k$ 첨자 없음 → 모든 토픽 행에 동일 가산.</span><span class="lang lang-zh">$\\bar x_g$=基因 g 的 <strong>log-归一化观测均值</strong>。所有主题共有背景——降权到处都高的基因,保护主题特异性。$r_g$ 无 $k$ 下标 → 加到每个主题行,完全一样。</span><span class="lang lang-en">$\\bar x_g$ = the <strong>log-normalized observed mean</strong> of gene g. A shared baseline — down-weights ubiquitously-high genes to protect topic specificity. $r_g$ has no $k$ index → added identically to every topic row.</span></p>
          <div class="callout" style="margin:8px 0 0;"><span class="lang lang-ko"><strong>후처리</strong>(원문): $w_{kg}^{new}=w_{kg}-\\log(r_g+\\epsilon)+\\log(r_g)$로 저발현 유전자 추가 downweight.</span><span class="lang lang-zh"><strong>后处理</strong>(原文): $w_{kg}^{new}=w_{kg}-\\log(r_g+\\epsilon)+\\log(r_g)$ 进一步降权低表达基因。</span><span class="lang lang-en"><strong>Post-processing</strong> (paper): $w_{kg}^{new}=w_{kg}-\\log(r_g+\\epsilon)+\\log(r_g)$ further down-weights low-expression genes.</span></div>
        </div>
      </div>`
  },
  {
    id: "ext", num: "06",
    title: { ko: "확장 — Batch &amp; Time-series", zh: "扩展 — 批次 &amp; 时间序列", en: "Extensions — Batch &amp; Time-series" },
    html: `
      <h3><span class="lang lang-ko">① Multiple samples — Batch correction</span><span class="lang lang-zh">① 多样本 — 批次校正</span><span class="lang lang-en">① Multiple samples — Batch correction</span></h3>
      <div class="grid three">
        <div class="card violet"><h4><span class="lang lang-ko">gene축 $\\delta_{sg}^{batch}$</span><span class="lang lang-zh">gene 轴 $\\delta_{sg}^{batch}$</span><span class="lang lang-en">gene-axis $\\delta_{sg}^{batch}$</span></h4><div class="klabel">Student-t · heavy tail</div><div class="eq" style="font-size:13px;">$$\\delta_{sg}^{batch}\\sim\\text{StudentT}(10,0,0.01)$$</div><p class="note"><span class="lang lang-ko">평균 0, s.d. 0.01 → 대부분 무영향. 두꺼운 꼬리가 일부 큰 batch effect 수용.</span><span class="lang lang-zh">均值 0,s.d. 0.01 → 大多无影响。重尾容纳少数大批次效应。</span><span class="lang lang-en">Mean 0, s.d. 0.01 → mostly unaffected. Heavy tails absorb a few large batch effects.</span></p></div>
        <div class="card violet"><h4><span class="lang lang-ko">topic축 $\\tau_k^{batch}$</span><span class="lang lang-zh">topic 轴 $\\tau_k^{batch}$</span><span class="lang lang-en">topic-axis $\\tau_k^{batch}$</span></h4><div class="klabel">Beta · U-shape</div><div class="eq" style="font-size:13px;">$$\\tau_k^{batch}\\sim\\text{Beta}(0.5,0.5)$$</div><p class="note"><span class="lang lang-ko">0·1 양 끝에 질량 → 토픽이 batch에 거의 안 휘둘리거나 강하게 휘둘리거나 이분적.</span><span class="lang lang-zh">质量集中 0·1 两端 → 主题受批次影响\u201c几乎无/很强\u201d二分倾向。</span><span class="lang lang-en">Mass at both ends → topics tend to be either barely or strongly batch-affected.</span></p></div>
        <div class="card violet"><h4><span class="lang lang-ko">외적 → batch embedding</span><span class="lang lang-zh">外积 → 批次嵌入</span><span class="lang lang-en">outer product → batch embedding</span></h4><div class="klabel">outer product</div><div class="eq" style="font-size:12.5px;">$$w_{skg}^{batch}=\\tau_k^{batch}\\otimes\\delta_{sg}^{batch}$$</div><div class="eq" style="font-size:11px;">$$\\beta_{skg}^{batch}=\\text{softmax}_g(w_{kg}+r_g+w_{skg}^{batch})$$</div><p class="note"><span class="lang lang-ko">공통 토픽 보존, batch 차이만 흡수.</span><span class="lang lang-zh">保留共有主题,只吸收批次差异。</span><span class="lang lang-en">Shared topics preserved; only batch differences absorbed.</span></p></div>
      </div>
      <h3><span class="lang lang-ko">② Time-series — Gaussian Process (Matérn 3/2)</span><span class="lang lang-zh">② 时间序列 — 高斯过程(Matérn 3/2)</span><span class="lang lang-en">② Time-series — Gaussian Process (Matérn 3/2)</span></h3>
      <div class="grid">
        <div class="card violet"><h4><span class="lang lang-ko">Matérn 3/2 커널</span><span class="lang lang-zh">Matérn 3/2 核</span><span class="lang lang-en">Matérn 3/2 kernel</span></h4><div class="klabel">GP prior on $w_{kg}$</div><div class="eq" style="font-size:12px;">$$\\kappa_{kg}(t,t')=\\tilde\\sigma_{kg}^2\\Big(1+\\tfrac{\\sqrt3|t-t'|}{l}\\Big)e^{-\\frac{\\sqrt3|t-t'|}{l}}$$</div><div class="eq" style="font-size:13px;">$$w_{kg}\\sim\\text{GP}(0,K_{kg})$$</div><p class="note"><span class="lang lang-ko">출력 분산 $\\tilde\\sigma_{kg}^2$ = 앞의 horseshoe 재사용 → 시간축에서도 희소성 유지.</span><span class="lang lang-zh">输出方差 $\\tilde\\sigma_{kg}^2$ = 复用前面的 horseshoe → 时间轴上也保持稀疏。</span><span class="lang lang-en">Output variance $\\tilde\\sigma_{kg}^2$ reuses the earlier horseshoe → sparsity preserved across time.</span></p></div>
        <div class="card violet"><h4><span class="lang lang-ko">길이 척도 $l$ &amp; 시점별 배경</span><span class="lang lang-zh">长度尺度 $l$ &amp; 各时点背景</span><span class="lang lang-en">length-scale $l$ &amp; per-time background</span></h4><div class="klabel">smoothness control</div><div class="eq">$$l=1\\ \\text{(fixed)},\\quad r_{tg}\\sim N(\\log(\\bar x_{tg}+\\epsilon),1)$$</div><p class="note"><span class="lang lang-ko">$l=1$ 고정(시간축으로 일관된 gene module 위해). 최종 $\\beta_{tkg}=\\text{softmax}_g(w_{tkg}+r_{tg})$.</span><span class="lang lang-zh">$l=1$ 固定(为跨时间一致的 gene module)。最终 $\\beta_{tkg}=\\text{softmax}_g(w_{tkg}+r_{tg})$。</span><span class="lang lang-en">$l=1$ fixed (for time-coherent gene modules). Final $\\beta_{tkg}=\\text{softmax}_g(w_{tkg}+r_{tg})$.</span></p></div>
      </div>
      <div class="callout v">
        <span class="lang lang-ko"><strong>활용</strong>(원문): 마우스 배아 E9.5~E16.5 8시점, 54만+ 세포. 시간축으로 연결된 토픽 → dermomyotome→muscle 발생 궤적을 단일 토픽으로 포착(기존 클러스터링은 별개 클러스터로).</span>
        <span class="lang lang-zh"><strong>应用</strong>(原文): 小鼠胚胎 E9.5~E16.5 共 8 时点,54 万+ 细胞。时间连接的主题 → 把 dermomyotome→muscle 发育轨迹捕捉为单一主题(传统聚类拆成两簇)。</span>
        <span class="lang lang-en"><strong>Application</strong> (paper): mouse embryo E9.5–E16.5, 8 time points, 540k+ cells. Time-linked topics capture the dermomyotome→muscle trajectory as one topic (clustering splits it into two).</span>
      </div>`
  },
  {
    id: "metrics", num: "07",
    title: { ko: "평가지표 — Coherence &amp; Diversity", zh: "评估指标 — Coherence &amp; Diversity", en: "Metrics — Coherence &amp; Diversity" },
    html: `
      <div class="grid">
        <div class="card teal">
          <h4><span class="lang lang-ko">Module Coherence — 응집성</span><span class="lang lang-zh">Module Coherence — 应聚性</span><span class="lang lang-en">Module Coherence</span></h4>
          <div class="klabel">NPMI · higher = better</div>
          <div class="eq" style="font-size:12px;">$$\\tfrac1K\\sum_k\\tfrac1{190}\\sum_{i<j}\\tfrac{\\log_2\\frac{P(g_i,g_j)}{P(g_i)P(g_j)}}{-\\log_2 P(g_i,g_j)}$$</div>
          <p class="note"><span class="lang lang-ko">모듈 내 top 20 유전자가 같은 세포에서 함께 발현되는 정도(NPMI). $\\binom{20}{2}=190$ 쌍. 관건: 발현이 <strong>상위 25%</strong>일 때만 \u201c존재\u201d로 카운트 → housekeeping 지배 방지. STAMP 중앙값 0.162(최고).</span><span class="lang lang-zh">模块内 top 20 基因在同一细胞共表达的程度(NPMI)。$\\binom{20}{2}=190$ 对。要点:仅当表达落在<strong>前 25%</strong>才计为\u201c存在\u201d → 防管家基因主导。STAMP 中位 0.162(最高)。</span><span class="lang lang-en">How often a module's top-20 genes co-express in the same cell (NPMI). $\\binom{20}{2}=190$ pairs. Key: a gene counts as \u201cpresent\u201d only in the <strong>top 25th percentile</strong> → prevents housekeeping genes dominating. STAMP median 0.162 (best).</span></p>
        </div>
        <div class="card teal">
          <h4><span class="lang lang-ko">Module Diversity — 다양성</span><span class="lang lang-zh">Module Diversity — 多样性</span><span class="lang lang-en">Module Diversity</span></h4>
          <div class="klabel">RBO · higher = better</div>
          <div class="eq" style="font-size:13px;">$$\\tfrac1K\\sum_i\\min_{j\\in K}\\big(1-\\text{RBO}(M_i,M_j)\\big)$$</div>
          <p class="note"><span class="lang lang-ko">gene module들이 서로 얼마나 독특한가. RBO(top 20 순위 겹침): <strong>1=완전 동일, 0=완전 독립</strong>. 각 토픽의 $\\min(1-\\text{RBO})$ 평균 → 겹치면 점수↓. STAMP 0.9(최고).</span><span class="lang lang-zh">gene module 彼此有多独特。RBO(top 20 排序重叠): <strong>1=完全相同,0=完全独立</strong>。取每个主题 $\\min(1-\\text{RBO})$ 的均值 → 重叠则降分。STAMP 0.9(最高)。</span><span class="lang lang-en">How unique gene modules are. RBO (top-20 rank overlap): <strong>1=identical, 0=fully distinct</strong>. Mean of $\\min(1-\\text{RBO})$ per topic → overlap lowers score. STAMP 0.9 (best).</span></p>
        </div>
      </div>
      <div class="callout t">
        <span class="lang lang-ko">두 지표는 trade-off가 아니라 <strong>둘 다 높아야 좋음</strong>: coherence=\u201c모듈 안이 일관적인가\u201d, diversity=\u201c모듈끼리 안 겹치는가\u201d. STAMP는 해마 데이터에서 둘 다 1위. (batch 평가는 별도 scIB 지표)</span>
        <span class="lang lang-zh">两个指标不是权衡,而是<strong>都要高才好</strong>: coherence=\u201c模块内是否一致\u201d,diversity=\u201c模块间是否不重叠\u201d。STAMP 在海马数据上两项都第一。(批次评估另用 scIB)</span>
        <span class="lang lang-en">Not a trade-off — <strong>both should be high</strong>: coherence = within-module consistency, diversity = between-module distinctness. STAMP ranks first in both on the hippocampus data. (Batch uses separate scIB metrics.)</span>
      </div>`
  },
  {
    id: "inference", num: "08",
    title: { ko: "추론 — ELBO &amp; 2단 전략", zh: "推断 — ELBO &amp; 两段策略", en: "Inference — ELBO &amp; two-tier strategy" },
    html: `
      <div class="lang lang-ko"><p class="sec-sub">\u201c완성품만 보고 주방을 거꾸로 알아내기\u201d. 계산 불가능한 후방을 변분추론으로 근사 → ELBO 최대화.</p></div>
      <div class="lang lang-zh"><p class="sec-sub">\u201c只看成品反推后厨\u201d。把算不动的后验用变分推断近似 → 最大化 ELBO。</p></div>
      <div class="lang lang-en"><p class="sec-sub">\u201cInfer the kitchen from finished loaves.\u201d Approximate the intractable posterior via variational inference → maximize the ELBO.</p></div>
      <div class="card ai full">
        <div class="eq" style="text-align:center; font-size:16px;">$$\\mathcal{L}=\\mathbb{E}_{q_\\phi(\\Theta,Z)}\\big[\\log p(X,\\Theta,Z)-\\log q_\\phi(\\Theta,Z)\\big]$$</div>
        <p class="note" style="text-align:center;">
          <span class="lang lang-ko"><strong>2단 추론</strong>(원문): 전역 파라미터 $\\Theta$는 <strong>mean-field</strong>(실수 normal·양수 lognormal) / 지역 잠재 $Z$는 <strong>SGCN으로 amortized 추론</strong>. ELBO 최대화 = 주변 로그우도 하한 최대화. 그래디언트는 <strong>reparameterization</strong>으로 무편향 추정 → Adam. (ADVI/Pyro 기반)</span>
          <span class="lang lang-zh"><strong>两段推断</strong>(原文): 全局参数 $\\Theta$ 用 <strong>mean-field</strong>(实数 normal·正数 lognormal);局部隐变量 $Z$ 用 <strong>SGCN 做摊还推断</strong>。最大化 ELBO = 最大化边际对数似然的下界。梯度用 <strong>重参数化</strong>无偏估计 → Adam。(基于 ADVI/Pyro)</span>
          <span class="lang lang-en"><strong>Two-tier inference</strong> (paper): global parameters $\\Theta$ use <strong>mean-field</strong> (normal for reals, lognormal for positives); the local latent $Z$ uses <strong>amortized inference via the SGCN</strong>. Maximizing ELBO = maximizing a lower bound on the marginal log-likelihood. Gradients via <strong>reparameterization</strong> → Adam. (Built on ADVI/Pyro.)</span>
        </p>
      </div>
      <div class="callout">
        <span class="lang lang-ko"><strong>왜 $Z$만 신경망?</strong> $Z$는 \u201c세포마다 하나\u201d(지역·대량) → SGCN으로 amortize. 나머지는 \u201c가게에 한 세트\u201d(전역·소량) → mean-field. 联合확률 $p(X,\\Theta,Z)$의 세로줄(|)이 생성 모델 의존 구조를 보여줌.</span>
        <span class="lang lang-zh"><strong>为何只有 $Z$ 用神经网络?</strong> $Z$ 是\u201c每个细胞一个\u201d(局部·海量) → SGCN 摊还。其余\u201c整店一套\u201d(全局·少量) → mean-field。联合概率 $p(X,\\Theta,Z)$ 的竖线(|)显示生成模型依赖结构。</span>
        <span class="lang lang-en"><strong>Why only $Z$ via a network?</strong> $Z$ is \u201cone per cell\u201d (local, massive) → amortized through the SGCN. The rest is \u201cone set\u201d (global, few) → mean-field. The bars (|) in $p(X,\\Theta,Z)$ read off the generative dependency structure.</span>
      </div>`
  },
  {
    id: "qa", num: "09",
    title: { ko: "예상 질문 (Q&amp;A)", zh: "预期问答 (Q&amp;A)", en: "Anticipated Q&amp;A" },
    html: `
      <div class="grid">
        <div class="qa">
          <div class="lang lang-ko">
            <div class="item"><div class="q">$\\text{softmax}_g$ vs $\\text{softmax}_k$?</div><div class="a">$\\beta$는 행(토픽) 내 G개 유전자 정규화, $z$는 세포 내 K개 토픽 정규화. 첨자=합이 1 되는 축.</div></div>
            <div class="item"><div class="q">$Z_\\sigma$는 세포당 하나?</div><div class="a">N×K(세포·토픽별 독립). 단 최종 출력 $z_{nk}$는 후방 평균.</div></div>
            <div class="item"><div class="q">왜 $Z$만 신경망?</div><div class="a">Z는 지역·대량 → amortized SGCN, 나머지는 전역·소량 → mean-field.</div></div>
          </div>
          <div class="lang lang-zh">
            <div class="item"><div class="q">$\\text{softmax}_g$ vs $\\text{softmax}_k$?</div><div class="a">$\\beta$ 在行(主题)内对 G 个基因归一化,$z$ 在细胞内对 K 个主题归一化。下标=合为 1 的轴。</div></div>
            <div class="item"><div class="q">$Z_\\sigma$ 是每细胞一个吗?</div><div class="a">N×K(逐细胞、逐主题独立)。但最终输出 $z_{nk}$ 取后验均值。</div></div>
            <div class="item"><div class="q">为何只有 $Z$ 用神经网络?</div><div class="a">Z 局部·海量 → 摊还 SGCN,其余全局·少量 → mean-field。</div></div>
          </div>
          <div class="lang lang-en">
            <div class="item"><div class="q">$\\text{softmax}_g$ vs $\\text{softmax}_k$?</div><div class="a">$\\beta$ normalizes over G genes within a row (topic); $z$ over K topics within a cell. Subscript = the axis summing to 1.</div></div>
            <div class="item"><div class="q">Is $Z_\\sigma$ one per cell?</div><div class="a">N×K (independent per cell &amp; topic). But the final $z_{nk}$ uses the posterior mean.</div></div>
            <div class="item"><div class="q">Why only $Z$ via a network?</div><div class="a">Z is local &amp; massive → amortized SGCN; the rest is global &amp; few → mean-field.</div></div>
          </div>
        </div>
        <div class="qa">
          <div class="lang lang-ko">
            <div class="item"><div class="q">왜 horseshoe(L1 아님)?</div><div class="a">0 될 건 확실히 0, 강신호는 과하게 안 누름. L1은 강신호까지 축소(편향). $c$가 상한 정규화.</div></div>
            <div class="item"><div class="q">batch에서 왜 Student-t·Beta?</div><div class="a">Student-t=대부분 무영향+소수 큰 효과(꼬리). Beta(0.5,0.5)=토픽별 batch 이분적.</div></div>
            <div class="item"><div class="q">time-series에서 왜 $l$=1?</div><div class="a">시간축으로 일관된(매끄러운) gene module 위해. 출력분산은 horseshoe 재사용.</div></div>
            <div class="item"><div class="q">coherence vs diversity?</div><div class="a">전자=모듈 내 공발현, 후자=모듈 간 독특성. 둘 다 높아야 좋음.</div></div>
          </div>
          <div class="lang lang-zh">
            <div class="item"><div class="q">为何用 horseshoe(不用 L1)?</div><div class="a">该 0 的彻底 0,强信号不过度压。L1 会把强信号一起压(有偏)。$c$ 负责上限正则化。</div></div>
            <div class="item"><div class="q">批次为何用 Student-t·Beta?</div><div class="a">Student-t=多数无影响+少数大效应(重尾)。Beta(0.5,0.5)=主题受批次影响二分。</div></div>
            <div class="item"><div class="q">时间序列为何 $l$=1?</div><div class="a">为得到跨时间一致(平滑)的 gene module。输出方差复用 horseshoe。</div></div>
            <div class="item"><div class="q">coherence vs diversity?</div><div class="a">前者=模块内共表达,后者=模块间独特性。两者都要高。</div></div>
          </div>
          <div class="lang lang-en">
            <div class="item"><div class="q">Why horseshoe (not L1)?</div><div class="a">Zeros go firmly to zero; strong signals aren't over-shrunk. L1 also shrinks strong signals (biased). $c$ handles upper-bound regularization.</div></div>
            <div class="item"><div class="q">Why Student-t &amp; Beta for batch?</div><div class="a">Student-t = mostly unaffected + a few large effects (heavy tail). Beta(0.5,0.5) = batch effect per topic is bimodal.</div></div>
            <div class="item"><div class="q">Why fix $l$=1 in time-series?</div><div class="a">To recover time-coherent (smooth) gene modules. Output variance reuses the horseshoe.</div></div>
            <div class="item"><div class="q">Coherence vs diversity?</div><div class="a">Former = within-module co-expression; latter = between-module distinctness. Both should be high.</div></div>
          </div>
        </div>
      </div>`
  }
];

/* Table of contents short labels (per language) */
const TOC = [
  { id:"bigpic",    ko:"0 · 큰 그림",    zh:"0 · 全局",      en:"0 · Big Picture" },
  { id:"bakery",    ko:"1 · 빵집 비유",  zh:"1 · 面包店比喻", en:"1 · Bakery" },
  { id:"encoder",   ko:"2 · Encoder",   zh:"2 · 编码器",    en:"2 · Encoder" },
  { id:"zprior",    ko:"3 · Z 사전분포", zh:"3 · Z 先验",    en:"3 · Z Prior" },
  { id:"decoder",   ko:"4 · Decoder",   zh:"4 · 解码器",    en:"4 · Decoder" },
  { id:"horseshoe", ko:"5 · Horseshoe", zh:"5 · 三层稀疏",  en:"5 · Horseshoe" },
  { id:"ext",       ko:"6 · 확장",       zh:"6 · 扩展",      en:"6 · Extensions" },
  { id:"metrics",   ko:"7 · 평가지표",   zh:"7 · 评估指标",  en:"7 · Metrics" },
  { id:"inference", ko:"8 · 추론",       zh:"8 · 推断",      en:"8 · Inference" },
  { id:"qa",        ko:"9 · Q&amp;A",       zh:"9 · 问答",      en:"9 · Q&amp;A" }
];
