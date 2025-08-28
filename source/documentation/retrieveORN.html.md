---
title: Retrieve Overseas Return Notification | Pillar 2 Service Guide
weight: 9
---

# Retrieve overseas return notification

## Overview

An Overseas Return Notification (**ORN**) is an annual notice sent to HMRC by a Multinational Enterprise (**MNE**). The ORN contains details of the jurisdiction where the group’s GloBE Information Return (**GIR**) has been submitted. 

The *Retrieve Overseas Return Notification* endpoint has an HTTP GET code, so it is used to retrieve the filing member’s ORN information submitted for a specific accounting period (both submission and amendments). The information returned matches the information submitted - the ORN submission date, the country code where the GIR was filed, and the name and Tax Identification Number (**TIN**) of the entity which submitted the GIR. 

**Note**: The diagram in this section relates to the Pillar 2 testing environment **only**.


## Testing

Before using the sandbox, please read through the "API Testing Setup" page of the service guide and work through all the required steps for creating a test user and organisation.


### Retrieve overseas return notification

This diagram shows a request which successfully retrieves ORN information. 
 
<a href="figures/retrieveorn-test-sequence.svg" target="blank"><img src="figures/retrieveorn-test-sequence.svg" alt="Sequence diagram showing REST calls for retrieving an Overseas Return Notification" style="width:520px;"/></a>

The *Retrieve Overseas Return Notification* request retrieves information for a specific accounting period, defined by the *accountingPeriodFrom* and *accountingPeriodTo* fields.

```shell
curl --request GET \
  --url https://test-api.service.hmrc.gov.uk/organisations/pillar-two/overseas-return-notification/2024-01-01/2024-12-31 \
  --header 'authorization: YOUR_BEARER_TOKEN' \
  --header 'x-pillar2-id: YOUR_PILLAR2_ID'
```

The response will return the answers submitted for the most recent action (either the original ORN submission or the latest ORN amendment). 

```json
{
  "processingDate": "2025-05-20T13:04:49Z",
  "accountingPeriodFrom": "2024-01-01",
  "accountingPeriodTo": "2024-12-31",
  "filedDateGIR": "2025-01-10",
  "countryGIR": "CA",
  "reportingEntityName": "Newco Inc",
  "TIN": "CA12345678",
  "issuingCountryTIN": "CA"
}
```

