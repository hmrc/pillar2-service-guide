---
title: Below-Threshold Notification | Pillar 2 Service Guide
weight: 5
---

# Below-threshold notification

## Overview

If group revenues fall below the threshold where the Pillar 2 tax is applied, sending a Below-Threshold Notification (**BTN**) removes the obligation to submit a UK Tax Return (**UKTR**) for both current (and future) accounting periods. 

Your group can submit a BTN if consolidated annual revenues are below €750 million in at least 2 of the previous 4 accounting periods, and are not expected to be above €750 million within the next 2 accounting periods.

A *SubmitBTN* request requires you to send the accounting period start and end dates, and a successful request returns a processing date. 

## Testing

Before using the sandbox, please read through the "API Testing Setup" page of the service guide and work through all the required steps for creating a test user and organisation. 

A BTN is submitted for a specific accounting period.

<a href="figures/below-threshold-notification.svg" target="blank"><img src="figures/btn-test-sequence.svg" alt="Sequence diagram showing REST calls for testing Below-Threshold Notification" style="width:520px;" /></a>

Requirements for the organisation can be checked by sending a GET request using the *Retrieve Obligations and Submissions* endpoint. In this example, a UK tax return has already been submitted, but a BTN will still be accepted and supersede the previous submission.

```shell
curl --request GET \
  --url 'https://test-api.service.hmrc.gov.uk/organisations/pillar-two/obligations-and-submissions?fromDate=2024-01-01&toDate=2024-12-31' \
  --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
  --header 'X-Pillar2-Id: YOUR_PILLAR2_ID' \
  --header 'Accept: application/vnd.hmrc.1.0+json'
```

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

Using the *SubmitBTN* endpoint, a BTN can be submitted at any time regardless of the data previously sent. For a successful BTN response, the submitted accounting period must match the previously defined accounting period.

```shell
curl --request POST \
  --url 'https://test-api.service.hmrc.gov.uk/organisations/pillar-two/below-threshold-notification' \
  --header 'Accept: application/vnd.hmrc.1.0+json' \
  --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Pillar2-Id: YOUR_PILLAR2_ID' \
  --data '{
  "accountingPeriodFrom": "2024-01-01",
  "accountingPeriodTo": "2024-12-31"
}'
```


A new request using the *Retrieve Obligations and Submissions* endpoint shows that the BTN has been recorded as a submission under the "UKTR" *obligationType* and has marked as "Fulfilled". As a BTN indicates the entity is below the revenue threshold, a "GIR" *obligationType* is no longer required for this accounting period and is not returned in the response. 

```shell
curl --request GET \
  --url 'https://test-api.service.hmrc.gov.uk/organisations/pillar-two/obligations-and-submissions?fromDate=2024-01-01&toDate=2024-12-31' \
  --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
  --header 'X-Pillar2-Id: YOUR_PILLAR2_ID' \
  --header 'Accept: application/vnd.hmrc.1.0+json'
```

```json
{
  "processingDate": "2025-05-02T07:28:08Z",
  "accountingPeriodDetails": [
    {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "dueDate": "2025-05-01",
      "underEnquiry": false,
      "obligations": [
        {
          "obligationType": "UKTR",
          "status": "Fulfilled",
          "canAmend": false,
          "submissions": [
            {
              "submissionType": "BTN",
              "receivedDate": "2025-05-02T07:27:09Z"
            }
          ]
        }
      ]
    }
  ]
}
```

