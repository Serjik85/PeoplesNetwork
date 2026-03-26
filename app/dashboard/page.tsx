import { DashboardHostBoard } from "@/components/dashboard-host-board";
import { getHostJoinRequests } from "@/lib/queries";

export const dynamic = "force-dynamic";

type DashboardSearchParams = {
  status?: string;
  q?: string;
};

type Props = {
  searchParams: Promise<DashboardSearchParams>;
};

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusParam =
    params.status === "pending" || params.status === "approved" || params.status === "rejected"
      ? params.status
      : undefined;
  const qParam = params.q?.trim() ? params.q.trim() : undefined;

  const joinRequests = await getHostJoinRequests({ status: statusParam, q: qParam });

  return <DashboardHostBoard joinRequests={joinRequests} statusParam={statusParam} qParam={qParam} />;
}

