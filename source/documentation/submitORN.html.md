---
title: Submit Overseas Return Notification | Pillar 2 Service Guide
weight: 7
---

# Submit overseas return notification

## Overview

An Overseas Return Notification (**ORN**) is an annual notice sent to HMRC by a Multinational Enterprise (**MNE**). The ORN contains details of the jurisdiction where the group’s GloBE Information Return (**GIR**) has been submitted. 

If the filing member is registered for Pillar 2, they (or their agent) can send a request using the *Submit Overseas Return Notification* endpoint. This will inform HMRC that the filing member has submitted their GIR for the specified accounting period to another jurisdiction, and it fulfils the obligation to submit an information return. 

If a filing member is registered solely for Domestic Top-up Tax it is recorded as “UK Only”, and cannot submit an ORN. 

**Note**: The diagram in this section relates to the Pillar 2 testing environment **only**.

## Testing

Before using the sandbox, please read through the [API Testing Setup](https://developer.service.hmrc.gov.uk/guides/pillar2-service-guide/documentation/set-up.html) page of the service guide and work through all the required steps for creating a test user and organisation.

### Submit overseas return notification

This diagram shows a request which successfully submits an ORN.  

<a href="figures/submitorn-test-sequence.svg" target="blank"><img src="figures/submitorn-test-sequence.svg" alt="Sequence diagram showing REST calls for testing Submit Overseas Return Notification" style="width:520px;"/></a>

The *Submit Overseas Return Notification* request must include the Tax Identification Number (**TIN**) of the entity submitting the ORN, the issuing country for the TIN, the accounting period from and to dates, and details of when and where the GIR was submitted (submission date and country code).
 
All fields in the request are mandatory.  

```shell
curl --request POST \
  --url https://test-api.service.hmrc.gov.uk/organisations/pillar-two/overseas-return-notification/submit \
  --header 'authorization: YOUR_BEARER_TOKEN' \
  --header 'content-type: application/json' \
  --header 'x-pillar2-id: YOUR_PILLAR2_ID' \
  --data '{
  "accountingPeriodFrom": "2024-01-01",
  "accountingPeriodTo": "2024-12-31",
  "filedDateGIR": "2025-01-10",
  "countryGIR": "CA",
  "reportingEntityName": "ReportCo Inc",
  "TIN": "CA12345678",
  "issuingCountryTIN": "CA"
}'
```

A successful response will include a *processingDate* and *formBundleNumber*. 

```json
{
  "processingDate": "2025-05-20T11:33:30Z",
  "formBundleNumber": "145749350495"
}
```

Sending a GET request using the *Retrieve Obligations and Submissions* endpoint will return a response showing the *submissionType* “ORN_CREATE” under the “GIR” *obligationType*. 

```json
{
  "processingDate": "2025-05-20T14:27:06Z",
  "accountingPeriodDetails": [
    {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "dueDate": "2025-07-01",
      "underEnquiry": false,
      "obligations": [
        {
          "obligationType": "UKTR",
          "status": "Open",
          "canAmend": true,
          "submissions": []
        },
        {
          "obligationType": "GIR",
          "status": "Fulfilled",
          "canAmend": true,
          "submissions": [
                       {
              "submissionType": "ORN_CREATE",
              "receivedDate": "2025-05-20T14:08:41Z",
              "country": "CA"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Duplicate Submissions

Once an ORN has been submitted, it cannot be submitted again for the same accounting period. The *Amend Overseas Return Notification* endpoint should be used for any amendments.

If a duplicate submission is received, a 422 client error response with code "044" will be returned.

```json
{
  "errors": {
    "processingDate": "2025-03-17T09:26:17Z",
    "code": "044",
    "message": "Tax obligation already fulfilled"
  }
}
```

