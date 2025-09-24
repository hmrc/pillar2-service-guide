---
title: Retrieve Obligations and Submissions | Pillar 2 Service Guide
weight: 6
---

# Retrieve obligations and submissions 

## Overview

Pillar 2 information can be organised into *obligations* and *submissions* for each accounting period. There are currently two submission types that can be retrieved using the API (UKTR, BTN) with another two planned (ORN, GIR). The *Retrieve Obligations and Submissions* endpoint has an HTTP GET code, so it is only ever used to retrieve information on an entity’s obligations, the submissions required to meet these obligations and the due date for each obligation.

Obligations are instructions defined by HMRC for each entity. The first obligation relates to submitting a UKTR or BTN. The entity uses the API request to send information (a submission) to HMRC. Multiple submissions can be sent to fulfill an obligation within an accounting period, where a UKTR (or BTN) can be submitted. 

The *Retrieve Obligations and Submissions* response will return a maximum of ten submissions for each *obligationType*. If more than ten submissions have been sent within the requested date range, the ten most recent *submissionType* items will be returned.

**Note**: The diagram in this section relates to the Pillar 2 testing environment **only**.

## Testing

Before using the sandbox, please read through the [API Testing Setup](https://developer.service.hmrc.gov.uk/guides/pillar2-service-guide/documentation/set-up.html) page of the service guide and work through all the required steps for creating a test user and organisation. 

### Retrieve obligations and submissions 

The diagram below shows a *Retrieve Obligations and Submissions* request and response. 

<a href="figures/obligations-submissions-test-sequence.svg" target="blank"><img src="figures/obligations-submissions-test-sequence.svg" alt="Sequence diagram showing REST calls for returning obligations and submisssions" style="width:520px;" /></a>

A *Retrieve Obligations and Submissions* GET request returns information on the *submissionType*, *submissionDate*, and the status of the obligation ("Open" or "Fulfilled"). The accounting period is defined by the *startDate* and *endDate* parameters. Each obligation is returned as an *obligationType* with each *submissionType* held as a nested value. 

```shell
curl --request GET \
  --url 'https://test-api.service.hmrc.gov.uk/organisations/pillar-two/obligations-and-submissions?fromDate=2024-01-01&toDate=2024-12-31' \
  --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
  --header 'X-Pillar2-Id: YOUR_PILLAR2_ID' \
  --header 'Accept: application/vnd.hmrc.1.0+json'
```

The response will return a list of submissions for all accounting periods that fall within the requested date range, with a maximum of ten *submissionType* items for each *obligationType*. This example shows one fulfilled "UKTR" *obligationType* for the accounting period specified in the request, and an open "GIR" *obligationtype*.

```json
{
  "processingDate": "2025-03-17T09:26:17Z",
  "accountingPeriodDetails": [
    {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "dueDate": "2025-01-31",
      "underEnquiry": false,
      "obligations": [
        {
          "obligationType": "UKTR",
          "status": "Fulfilled",
          "canAmend": true,
          "submissions": [
            {
              "submissionType": "UKTR_CREATE",
              "receivedDate": "2025-03-17T09:26:17Z"
            }
          ]
        },
        {
          "obligationType": "GIR",
          "status": "Open",
          "canAmend": true,
          "submissions": []
        }
      ]
    }
  ]
}
```
