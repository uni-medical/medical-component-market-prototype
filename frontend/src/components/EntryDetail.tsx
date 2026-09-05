import { useEffect, useRef } from "react";
import type { CatalogEntry } from "../lib/catalog";
export function EntryDetail({entry, onClose}: {entry: CatalogEntry; onClose: () => void}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} onCancel={onClose} onClose={onClose} aria-labelledby="entry-title"><button className="close" onClick={onClose} aria-label="Close entry details">Close ×</button>
    <small>{entry.primaryCategory} · {entry.tier}</small><h2 id="entry-title">{entry.fullName}</h2><p>{entry.description ?? "No source description provided."}</p>
    <dl>{Object.entries({Domain:entry.domains.join(", "),Stars:entry.stars,License:entry.license,Language:entry.language,Source:entry.source,Updated:entry.updatedAt,Observed:entry.observedAt,"Main snapshot":entry.snapshot.mainSha ?? "Not available","Automation snapshot":entry.snapshot.automationSha ?? "Not available"}).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    <p>{entry.topics.join(" · ") || "No source tags"}</p><a href={entry.repositoryUrl} target="_blank" rel="noopener noreferrer">Open repository ↗</a>{entry.homepageUrl && <a href={entry.homepageUrl} target="_blank" rel="noopener noreferrer"> Project homepage ↗</a>}
    <p className="disclosure">Stable and Candidate indicate source provenance, not validation.</p></dialog>;
}
