---
title: Below-Threshold Notification | Pillar 2 Service Guide
weight: 5
---

# Below-Threshold Notification

## Overview
If group revenues fall below the threshold where the Pillar 2 tax is applied, sending a BTN removes the obligation to submit a UKTR for both current (and future) accounting periods. 

Your group can submit a BTN if consolidated annual revenues are below €750 million in at least 2 of the previous 4 accounting periods, and are not expected to be above €750 million within the next 2 accounting periods.

A SubmitBTN request requires you to send the accounting period start and end dates, and a successful request returns a processing date. 

## Testing
Testing a Below-Threshold Notification requires a test organisation. Once setup, we can submit a Below-Threshold Notification for a specific accounting period.

<a href="figures/btn-test-sequence.svg" target="blank"><img src="figures/btn-test-sequence.svg" alt="Sequence diagram showing REST calls for testing Below-Threshold Notification" style="width:520px;" /></a>

As before, we can check the Obligations and Submissions endpoint to see what is required for our organisation:

```shell
curl --request GET \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/submissionandobligation?fromDate=2024-01-01&toDate=2024-12-31 \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' 
```

```json
{
  "success": {
    "processingDate": "2025-03-17T09:26:17Z",
    "accountingPeriodDetails": [
      {
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "dueDate": "2025-01-31",
        "underEnquiry": false,
        "obligations": [
          {
            "obligationType": "Pillar2TaxReturn",
            "status": "Fulfilled",
            "canAmend": true,
            "submissions": [
              {
                "submissionType": "UKTR",
                "receivedDate": "2025-03-17T09:26:17Z"
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
}
```

As per the definition, the Below-Threshold Notification declares that our organisation has dropped below the threshold that brings them into the scope of Pillar 2. Therefore, it can be submitted at any time regardless of what has already been submitted. 
In this example, a UK Tax Return as already been submitted, but a Below-Threshold Notification will still be accepted and will supersede the previous UK Tax Return

```shell
curl --request POST \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/below-threshold-notification \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' \
  --header 'content-type: application/json' \
  --data '{
    "accountingPeriodFrom": "2024-01-01",
    "accountingPeriodTo": "2024-12-31",
  }'
```
The only required information for a successful Below-Threshold Notification is accounting period, which must match the previously defined accounting period.

If we fetch the obligations and submissions for this organisation, we will see that the Below-Threshold Notification has satisfied all obligations **for that accounting period**. 

```shell
curl --request GET \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/submissionandobligation?fromDate=2024-01-01&toDate=2024-12-31 \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' 
```

```json
{
  "success": {
    "processingDate": "2025-03-17T09:26:17Z",
    "accountingPeriodDetails": [
      {
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "dueDate": "2025-01-31",
        "underEnquiry": false,
        "obligations": [
          {
            "obligationType": "Pillar2TaxReturn",
            "status": "Fulfilled",
            "canAmend": true,
            "submissions": [
              {
                "submissionType": "UKTR",
                "receivedDate": "2025-03-17T09:26:17Z"
              },
              {
                "submissionType": "BTN",
                "receivedDate": "2025-03-22T09:30:12Z"
              }
            ]
          },
          {
            "obligationType": "GlobeInformationReturn",
            "status": "FulFilled",
            "canAmend": true,
            "submissions": [
              {
                "submissionType": "BTN",
                "receivedDate": "2025-03-22T09:30:12Z"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

