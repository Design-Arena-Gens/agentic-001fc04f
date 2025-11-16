import DashboardShell from "../components/dashboard/DashboardShell";
import { getDocuments, getDocumentTypes, getWorkflows, getUsers, getAuditTrail, getDashboardMetrics, getComplianceRequirements } from "../lib/store";

export default function HomePage() {
  const documents = getDocuments();
  const documentTypes = getDocumentTypes();
  const workflows = getWorkflows();
  const users = getUsers();
  const auditTrail = getAuditTrail(100);
  const metrics = getDashboardMetrics();
  const compliance = getComplianceRequirements();

  return (
    <DashboardShell
      documents={documents}
      documentTypes={documentTypes}
      workflows={workflows}
      users={users}
      auditTrail={auditTrail}
      metrics={metrics}
      compliance={compliance}
    />
  );
}
