import CompanyDetailClient from "./CompanyDetailClient";

interface CompanyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { id } = await params;
  return <CompanyDetailClient id={id} />;
}
