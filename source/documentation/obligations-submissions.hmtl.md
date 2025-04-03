---
title: Obligations and Submissions | Pillar 2 Service Guide
weight: 6
---

# Obligations and submissions 

## Overview

Pillar 2 information can be organised into *obligations* and *submissions* for each accounting period. There are currently two submission types which can be retrieved using the API (UKTR, BTN) with another two planned (ORN, GIR). The request has an HTTP GET code, which means it is only ever used to retrieve information. The *Obligations and Submissions* endpoint is also a means of retrieving an entity’s obligations, the submissions required to meet these obligations and the due date for each obligation.

Obligations are instructions defined by HMRC for each entity. The first obligation relates to submitting a UKTR or BTN. The entity uses the API request to send information (a submission) to HMRC. Multiple submissions can be sent to fulfill an obligation within an accounting period, where a UKTR (or BTN) can be submitted. 


## Testing

Before using the sandbox, please read through the "Test API Setup" page of the service guide and work through all the required steps for creating a test user and organisation. 

<a href="figures/obligations-and-submissions.svg" target="blank"><img src="figures/obligations-and-submissions.svg" alt="Sequence diagram showing REST calls for returning obligations and submisssions" style="width:520px;" /></a>

An *Obligations and Submissions* GET request returns information on the *submissionType*, *submissionDate*, and the status of the obligation ("Open" or "Fulfilled"). The accounting period is defined by the *startDate* and *endDate* parameters. Each obligation is returned as an *obligationType* with each *submissionType* held as a nested value. 

```shell
curl --request GET \
  --url 'http://test-api.service.hmrc.gov.uk/organisations/pillar-two/obligations-and-submissions?fromDate=2024-01-01&toDate=2024-12-31' \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' \
  --header 'content-type: application/json'
```

The response will return obligations for all accounting periods that fall within the requested date range. This example shows one fulfilled "Pillar2TaxReturn" *obligationType* for the accounting period specified in the request, and an open "GlobeInformationReturn" *obligationtype*.

```json
{
  "processingDate": "2025-04-03T10:42:14Z",
  "accountingPeriodDetails": [
    {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "dueDate": "2026-03-31",
      "underEnquiry": false,
      "obligations": [
        {
          "obligationType": "Pillar2TaxReturn",
          "status": "Fulfilled",
          "canAmend": true,
          "submissions": [
            {
              "submissionType": "UKTR",
              "receivedDate": "2025-04-03T10:42:09Z"
            }
          ]
        },
        {
          "obligationType": "GlobeInformationReturn",
          "status": "Open",
          "canAmend": true,
          "submissions": []
        }
      ]
    }
  ]
}
```
