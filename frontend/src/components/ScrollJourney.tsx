import { useMemo, useState, type WheelEvent } from "react";

type JourneyFrame = {
  keyword: string;
  keywordZh: string;
  idea: string;
  ideaZh: string;
  image: string;
  index: string;
};

const frames: JourneyFrame[] = [
  { index: "01", keyword: "DISCOVER", keywordZh: "发现", idea: "Begin with a medical or life-science domain, then locate the component families around it.", ideaZh: "从医学或生命科学领域开始，定位与研究问题相关的组件族。", image: "domains.jpg" },
  { index: "02", keyword: "COMPARE", keywordZh: "比较", idea: "Read the public context together: type, description, tags, license, and observed signals.", ideaZh: "并列查看类型、描述、标签、许可证与观测信号等公开信息。", image: "metadata.jpg" },
  { index: "03", keyword: "TRACE", keywordZh: "追溯", idea: "Follow each record back to its repository and inspect the source before reuse.", ideaZh: "沿着每条记录回到来源仓库，在复用前检查项目内容。", image: "sources.jpg" },
  { index: "04", keyword: "COMPOSE", keywordZh: "组合", idea: "Bring compatible components into a medical AI research workflow as the catalogue grows.", ideaZh: "随着目录扩展，将兼容组件组合进医疗 AI 研究工作流。", image: "market.jpg" },
];

export function ScrollJourney({ language }: { language: "en" | "zh" }) {
  const [step, setStep] = useState(0);
  const imageBase = `${import.meta.env.BASE_URL}images/journey/`;
  const progress = useMemo(() => Math.min(step / (frames.length - 1), 1), [step]);

  const onWheel = (event: WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) < 8) return;
    setStep((current) => Math.max(0, Math.min(frames.length - 1, current + (event.deltaY > 0 ? 1 : -1))));
  };

  return (
    <section className="journey" aria-labelledby="journey-title" onWheel={onWheel}>
      <div className="journey-pin">
        <div className="journey-heading">
          <span className="eyebrow">{language === "en" ? "A MEDICAL RESEARCH PATH" : "医学研究路径"}</span>
          <h2 id="journey-title">{language === "en" ? "From a medical signal to a source." : "从医学信号走向可追溯来源。"}</h2>
          <p>{language === "en" ? "Scroll to move through the Medical RSI catalogue." : "滚动浏览 Medical RSI 组件目录的工作路径。"}</p>
        </div>
        <div className="journey-stage" aria-live="polite">
          {frames.map((frame, index) => {
            const distance = index - step;
            const clamped = Math.max(-1, Math.min(1, distance));
            const scale = index === step ? 1 + progress * 0.035 : 0.86;
            const opacity = index === step ? 1 : Math.max(0, 0.18 - Math.abs(clamped) * 0.08);
            return (
              <article
                className={`journey-frame ${index === step ? "is-active" : ""}`}
                key={frame.keyword}
                style={{ backgroundImage: `url(${imageBase}${frame.image})`, transform: `translate3d(0, ${clamped * 26}px, 0) scale(${scale})`, opacity }}
                aria-hidden={index !== step}
              >
                <div className="journey-frame-scrim" />
                <div className="journey-copy">
                  <span>{frame.index} / {frames.length.toString().padStart(2, "0")}</span>
                  <h3>{language === "en" ? frame.keyword : frame.keywordZh}</h3>
                  <p>{language === "en" ? frame.idea : frame.ideaZh}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="journey-controls">
          <span>{language === "en" ? "Scroll to advance" : "滚动前进"}</span>
          <div aria-label="Journey steps">
            {frames.map((frame, index) => (
                <button key={frame.keyword} type="button" className={index === step ? "is-active" : ""} onClick={() => setStep(index)} aria-label={language === "en" ? `Show ${frame.keyword}` : `显示${frame.keywordZh}`} aria-pressed={index === step}>
                <i />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
