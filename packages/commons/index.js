import {
  AuthRegistration,
  UserAuthentication,
} from "./src/UserManagement/Auth";

// MAR
import {
  UploadCommunityRiskAssessment,
  GetCommunityRiskAssessment,
  DownloadCommunityRiskAssessmentFile,
  DeleteCommunityRiskAssessment,
} from "./src/MAR/CommunityRiskAssessment/CommunityRiskAssessment";
import {
  GetAllCapacityAndVulnerability,
  GetOneCapacityAndVulnerability,
  InsertCapacityAndVulnerability,
  UpdateCapacityAndVulnerability,
  DeleteCapacityAndVulnerability,
} from "./src/MAR/CommunityRiskAssessment/CapacityAndVulnerability";
import {
  GetHazardMaps,
  UploadHazardMaps,
} from "./src/MAR/CommunityRiskAssessment/HazardMaps";
import {
  InsertEventsTemplate,
  UpdateEventsTemplate,
  GetAllEventsTemplate,
  DeleteEventsTemplate,
} from "./src/MAR/EventsTemplate/EventsTemplate";
import {
  GetIncidentLogs,
  GetDayIncidentLogs,
  GetMonthIncidentLogs,
  InsertIncidentLogs,
  UpdateIncidentLogs,
  DeleteIncidentLogs,
  UploadReportAttachment,
} from "./src/MAR/MaintenanceLogs/IncidentLogs";
import {
  GetMaintenanceLogs,
  GetDayMaintenanceLogs,
  GetMonthMaintenanceLogs,
  InsertMaintenanceLogs,
  UpdateMaintenanceLogs,
  DeleteMaintenanceLogs,
  FetchLogAttachments,
  SendPDFReportViaEmail,
} from "./src/MAR/MaintenanceLogs/MaintenanceLogs";
import {
    GetSurficialMarkersData,
    UpdateSurficialMarkerData,
    InsertSurficialMarkersData,
    DeleteSurficialMarkersData,
} from "./src/MAR/GroundData/SurficialMarkers";
import {
    GetMOMSData,
    UpdateMOMSData,
    InsertMOMSData,
    DeleteMOMSData,
} from "./src/MAR/GroundData/MOMS";
import {
    GetOnDemandData,
    RaiseOnDemandAlert,
    InsertOnDemandData,
} from "./src/MAR/GroundData/OnDemand";

// UMI
import {
  GetAllSummary,
  InsertSummary,
  UpdateSummary,
  DeleteSummary,
} from "./src/UMI/RiskAssessment/Summary";
import {
  GetAllHazardData,
  InsertHazardData,
  UpdateHazardData,
  DeleteHazardData,
} from "./src/UMI/RiskAssessment/HazardData";
import {
  GetAllResourceAndCapacities,
  InsertResourceAndCapacities,
  UpdateResourceAndCapacities,
  DeleteResourceAndCapacities,
} from "./src/UMI/RiskAssessment/ResourceAndCapacities";
import {
  GetAllFamilyRiskProfile,
  InsertFamilyRiskProfile,
  UpdateFamilyRiskProfile,
  DeleteFamilyRiskProfile,
} from "./src/UMI/RiskAssessment/FamilyRiskProfile";
import {
  GetHazardMaps as UmiGetHazardMaps,
  UploadHazardMaps as UmiUploadHazardMaps,
} from "./src/UMI/RiskAssessment/HazardMaps";
import {
  GetFieldSurveyLogs,
  InsertFieldSurveyLogs,
  UpdateFieldSurveyLogs,
  DeleteFieldSurveyLogs,
  UpdateAttachmentFile,
} from "./src/UMI/FieldSurvey/FieldSurveyLogs";
import {
  GetLatestReportSummary,
  DownloadLatestReportSummary,
  EmailLatestReportSummary,
} from "./src/UMI/FieldSurvey/ReportSummary";
import {
  GetCurrentSituationReport,
  DownloadSituationReport,
  EmailSituationReport,
} from "./src/UMI/SituationReport/CurrentSituationReport";
import {
  GetSituationReport,
  InsertSituationReport,
  UpdateSituationReport,
  DeleteSituationReport,
  UploadSituationReport,
} from "./src/UMI/SituationReport/SituationReport";

import { GetOngoingAndExtendedMonitoring } from "./src/AlertGeneration/PublicAlerts";
import { RenderPDF, DownloadPDF } from "./src/MAR/FileManager/PDFManager";

const UserManagement = {
  AuthRegistration,
  UserAuthentication,
};

const AlertGeneration = {
  GetOngoingAndExtendedMonitoring,
};

const MarGroundData = {
    GetSurficialMarkersData,
    UpdateSurficialMarkerData,
    InsertSurficialMarkersData,
    DeleteSurficialMarkersData,
    GetMOMSData,
    UpdateMOMSData,
    InsertMOMSData,
    DeleteMOMSData,
    GetOnDemandData,
    RaiseOnDemandAlert,
    InsertOnDemandData,
};

const MarCommunityRiskAssessment = {
  UploadCommunityRiskAssessment,
  GetCommunityRiskAssessment,
  DownloadCommunityRiskAssessmentFile,
  DeleteCommunityRiskAssessment,
  InsertCapacityAndVulnerability,
  UpdateCapacityAndVulnerability,
  GetAllCapacityAndVulnerability,
  GetOneCapacityAndVulnerability,
  DeleteCapacityAndVulnerability,
  GetHazardMaps,
  UploadHazardMaps,
};

const MarMaintenanceLogs = {
  GetIncidentLogs,
  GetDayIncidentLogs,
  GetMonthIncidentLogs,
  InsertIncidentLogs,
  UpdateIncidentLogs,
  DeleteIncidentLogs,
  UploadReportAttachment,
  GetMaintenanceLogs,
  GetDayMaintenanceLogs,
  GetMonthMaintenanceLogs,
  InsertMaintenanceLogs,
  UpdateMaintenanceLogs,
  DeleteMaintenanceLogs,
  FetchLogAttachments,
  RenderPDF,
  DownloadPDF,
  SendPDFReportViaEmail,
};

const UmiRiskManagement = {
  GetAllSummary,
  InsertSummary,
  UpdateSummary,
  DeleteSummary,
  GetAllHazardData,
  InsertHazardData,
  UpdateHazardData,
  DeleteHazardData,
  GetAllResourceAndCapacities,
  InsertResourceAndCapacities,
  UpdateResourceAndCapacities,
  DeleteResourceAndCapacities,
  GetAllFamilyRiskProfile,
  InsertFamilyRiskProfile,
  UpdateFamilyRiskProfile,
  DeleteFamilyRiskProfile,
  GetHazardMaps: UmiGetHazardMaps,
  UploadHazardMaps: UmiUploadHazardMaps,
};

const UmiFieldSurvey = {
  GetFieldSurveyLogs,
  InsertFieldSurveyLogs,
  UpdateFieldSurveyLogs,
  DeleteFieldSurveyLogs,
  GetLatestReportSummary,
  UpdateAttachmentFile,
  DownloadLatestReportSummary,
  EmailLatestReportSummary,
};

const MarEventsTemplate = {
  InsertEventsTemplate,
  UpdateEventsTemplate,
  GetAllEventsTemplate,
  DeleteEventsTemplate,
};

const UmiSituationReport = {
  GetSituationReport,
  GetCurrentSituationReport,
  DownloadSituationReport,
  EmailSituationReport,
  UploadSituationReport,
  InsertSituationReport,
  UpdateSituationReport,
  DeleteSituationReport,
};

export {
  AlertGeneration,
  UserManagement,
  MarCommunityRiskAssessment,
  MarMaintenanceLogs,
  MarEventsTemplate,
  MarGroundData,
  UmiRiskManagement,
  UmiFieldSurvey,
  UmiSituationReport,
};
