import { getDealers } from "@/lib/api/network";
import { DealerTable } from "./dealer-table";

export async function DealersTable() {
  const { dealers } = await getDealers();

  return <DealerTable dealers={dealers} />;
}
