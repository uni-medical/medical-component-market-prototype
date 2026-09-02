import { notFound } from "next/navigation";
import rawCatalog from "@/data/prototype-catalog.json";
import { CatalogShell } from "@/components/catalog-shell";
import { parseCatalogIndex } from "@/lib/catalog";
import { getDictionary, isLocale } from "@/lib/i18n";

interface DirectoryPageProps {
  params: Promise<{ lang: string }>;
}

const catalog = parseCatalogIndex(rawCatalog);

export default async function DirectoryPage({ params }: DirectoryPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <CatalogShell catalog={catalog} dictionary={getDictionary(lang)} locale={lang} />;
}
