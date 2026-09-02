import { ShieldAlert } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

export function SiteFooter({ dictionary }: { dictionary: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__source">
        <span className="status-dot" aria-hidden="true" />
        {dictionary.footerSource}
      </div>
      <p className="site-footer__disclosure">
        <ShieldAlert size={17} aria-hidden="true" />
        {dictionary.disclosure}
      </p>
    </footer>
  );
}
