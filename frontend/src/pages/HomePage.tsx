import { Link, useNavigate } from "react-router-dom";
import { Brand } from "../components/Brand";
import { catalog } from "../data/catalog";
import { getCatalogSummary } from "../lib/catalog";

export function HomePage() {
  const navigate = useNavigate();
  const summary = getCatalogSummary(catalog.entries);
  const typeCount = new Set(catalog.entries.map((entry) => entry.primaryCategory)).size;
  const snapshotDate = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(catalog.generatedAt));
  const heroImageUrl = `${import.meta.env.BASE_URL}images/doctor-researcher-hero.jpg`;

  return <main className="home"><div className="hero-image" style={{backgroundImage: `url(${heroImageUrl})`}} aria-hidden="true"/><div className="grid" /><nav><Brand/><div><Link to="/marketplace">Marketplace</Link><a href="https://github.com/uni-medical/medical-component-market-web-homepage">GitHub</a></div></nav><section className="hero"><div><span className="eyebrow">MEDICAL AI COMPONENT MARKET</span><h1>Every component is a starting point.<br/>Every record is traceable.</h1><p>Explore tools, skills, and interfaces for medical AI research. Begin with a domain, compare public metadata, and return to the source repository.</p><button onClick={() => navigate("/marketplace")}>Browse the marketplace ↗</button></div><aside className="snapshot"><small>CATALOG SNAPSHOT</small><strong>{summary.total}</strong><span>catalogued repository records · {snapshotDate}</span><hr/><div><b>{typeCount}</b> component types</div><div><b>{summary.medical}</b> medical records</div></aside></section><section className="pillars"><article><b>01</b><h2>Discover by domain</h2><p>Start with a research area and find the components around it.</p></article><article><b>02</b><h2>Compare metadata</h2><p>Read type, source description, observed stars, license, tags, and update context together.</p></article><article><b>03</b><h2>Trace the source</h2><p>Open the repository and inspect the record before reuse.</p></article></section></main>;
}
