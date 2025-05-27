---
title: Retrieve Overseas Return Notification | Pillar 2 Service Guide
weight: 3
---

# Retrieve overseas return notification

## Overview

An Overseas Return Notification (ORN) is an annual notice sent to HMRC by a Multinational Enterprise (MNE). The ORN contains information on the jurisdiction where the entity’s GloBE Information Return (GIR) has been submitted. 

The Retrieve Overseas Return Notification endpoint has an HTTP GET code, so it is used to retrieve the entity’s ORN information submitted for a specific accounting period (both submission and amendments). The information returned matches the information submitted - the date and country where the GIR was filed, the entity name and the Tax Identification Number (TIN) used for the GIR. 


Testing
Before using the sandbox, please read through the "API Testing Setup" page of the service guide and work through all the required steps for creating a test user and organisation.


Retrieve overseas return notification

This diagram shows a request which successfully retrieves ORN information. 
 


The Retrieve Overseas Return Notification request retrieves information for a specific accounting period, defined by the accountingPeriodFrom and accountingPeriodTo fields.

curl --request GET \
  --url https://test-api.service.hmrc.gov.uk/organisations/pillar-two/obligations-and-submissions/overseas-return-notification/2024-01-01/2024-12-31 \
  --header 'authorization: YOUR_BEARER_TOKEN' \
  --header 'x-pillar2-id: YOUR_PILLAR2_ID'




A successful response will include the TIN and issuing country for the GIR, as well as the accounting period and the processing date and location for the GIR submission. 

{
  "processingDate": "2025-05-20T13:04:49Z",
  "accountingPeriodFrom": "2024-01-01",
  "accountingPeriodTo": "2024-12-31",
  "filedDateGIR": "2025-01-10",
  "countryGIR": "US",
  "reportingEntityName": "Newco PLC",
  "TIN": "US12345678",
  "issuingCountryTIN": "US"
}


