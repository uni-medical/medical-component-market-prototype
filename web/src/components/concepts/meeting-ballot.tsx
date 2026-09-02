"use client";

import { Check, Circle } from "lucide-react";
import { useState } from "react";
import { CONCEPT_OPTIONS, type ConceptId } from "@/lib/concepts";

interface MeetingBallotProps {
  locale?: "en" | "zh";
}

const copy = {
  en: {
    eyebrow: "Meeting ballot",
    title: "Vote on the next interface direction.",
    intro: "Choose one visual direction for tomorrow's discussion. This prototype ballot stays in your browser.",
    localOnly: "Local-only ballot · no shared backend",
    note: "Nothing is submitted or counted centrally; capture the room outcome after the review.",
    choose: "Choose a direction",
    confirm: "Confirm selection",
    selected: "Local choice recorded",
    pending: "Select one option to record a local choice.",
  },
  zh: {
    eyebrow: "会议选型投票",
    title: "下一步方案投票：优先推进哪种方向？",
    intro: "为明天的讨论选择一个视觉方向。本原型投票只保留在当前浏览器中。",
    localOnly: "仅本地投票 · 未连接共享后台",
    note: "不会提交或集中统计；评审结束后再记录现场选择。",
    choose: "选择一个方向",
    confirm: "确认选择",
    selected: "已记录本地选择",
    pending: "请选择一个方案后记录本地选择。",
  },
} as const;

const conceptLabels = {
  en: {
    registry: { title: "Academic Registry", lens: "Taxonomy + provenance" },
    "domain-atlas": { title: "Domain Atlas", lens: "Domains + discovery" },
    "quality-lab": { title: "Quality Lab", lens: "Review + methodology" },
    "composition-studio": { title: "Composition Studio", lens: "Composition + reuse" },
  },
  zh: {
    registry: { title: "学术型登记册", lens: "分类 + 溯源" },
    "domain-atlas": { title: "领域图谱", lens: "领域 + 发现" },
    "quality-lab": { title: "质控实验台", lens: "审阅 + 方法" },
    "composition-studio": { title: "组合工作台", lens: "组合 + 复用" },
  },
} as const;

export function MeetingBallot({ locale = "en" }: MeetingBallotProps) {
  const labels = copy[locale];
  const [selected, setSelected] = useState<ConceptId | "">("");
  const [confirmed, setConfirmed] = useState(false);
  const labelsForConcept = conceptLabels[locale];

  return (
    <section className="meeting-ballot" aria-labelledby="meeting-ballot-title">
      <div className="meeting-ballot__header">
        <div>
          <span className="section-kicker">{labels.eyebrow}</span>
          <h2 id="meeting-ballot-title">{labels.title}</h2>
          <p>{labels.intro}</p>
        </div>
        <span className="prototype-chip">{labels.localOnly}</span>
      </div>

      <fieldset>
        <legend>{labels.choose}</legend>
        <div className="meeting-ballot__options">
          {CONCEPT_OPTIONS.map((concept, index) => (
            <label className={`meeting-ballot__option${selected === concept.id ? " is-selected" : ""}`} key={concept.id}>
              <input
                type="radio"
                name="concept-choice"
                value={concept.id}
                checked={selected === concept.id}
                onChange={() => {
                  setSelected(concept.id);
                  setConfirmed(false);
                }}
              />
              <span className="meeting-ballot__radio" aria-hidden="true">
                {selected === concept.id ? <Check size={13} /> : <Circle size={13} />}
              </span>
              <span className="meeting-ballot__number">0{index + 1}</span>
              <span className="meeting-ballot__copy">
                <strong>{labelsForConcept[concept.id].title}</strong>
                <small>{labelsForConcept[concept.id].lens}</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="meeting-ballot__footer">
        <p className="meeting-ballot__note">{labels.note}</p>
        <div className="meeting-ballot__action">
          <button type="button" onClick={() => selected && setConfirmed(true)} disabled={!selected}>
            {labels.confirm}
          </button>
          <span role="status" aria-live="polite">
            {confirmed && selected ? `${labels.selected} · 0${CONCEPT_OPTIONS.findIndex((concept) => concept.id === selected) + 1}` : labels.pending}
          </span>
        </div>
      </div>
    </section>
  );
}
