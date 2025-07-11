---
title: Amend UK Tax Return | Pillar 2 Service Guide
weight: 4
---

# Amend UK tax return

## Overview
If a submitted UK tax return (**UKTR**) needs to be updated, an amendment can be sent via the API. 

The *AmendUKTR* request has the same structure and data fields as *SubmitUKTR*. Attempting to amend a return which has not been submitted will return a 422 client error response. You can find more information on code 422 errors in the [API reference guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0).

Amendments to liability returns (for MNEs and UK only entities) should include evidence of a company ID in the *entityType* field - this can be either the Company Reference Number (**CRN**) or the Unique Taxpayer Reference (**UTR**) for corporation tax.

For Pillar 2, all submitted returns have an *amendment window*. This is a period after the submit due date where you can amend the return for the specified accounting period. The amendment window lasts 12 months (minus 1 day) for each accounting period, and multiple amendments can be submitted during this time. The amendment window end date does not change if a return is submitted before or after the due date, and you cannot amend a return after the amendment window end date. 

If the return is the focus of an active enquiry, amendments are not processed until the enquiry ends. 

If the amend request is successful, it returns a response containing a processing date and a charge reference (unless the amendment changes a liability return to a nil return, where no charge reference is issued).


## Testing

Before using the sandbox, please read through the "API Testing Setup" page of the service guide and work through all the required steps for creating a test user and organisation. 

<a href="figures/amenduktr-test-sequence.svg" target="blank"><img src="figures/amenduktr-test-sequence.svg" alt="Sequence diagram showing REST calls for testing amend UK Tax Return" style="width:520px;" /></a>

Once a UKTR has been submitted, it can be amended any number of times before the end of the amendment window. The status of the tax return can be checked by sending a GET request using the *Retrieve Obligations and Submissions* endpoint. 

```shell
curl --request GET \
  --url 'https://test-api.service.hmrc.gov.uk/organisations/pillar-two/obligations-and-submissions?fromDate=2024-01-01&toDate=2024-12-31' \
  --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
  --header 'X-Pillar2-Id: YOUR_PILLAR2_ID' \
  --header 'Accept: application/vnd.hmrc.1.0+json'
```
The response shows that a UKTR has been submitted and the amendment window is still open as the *canAmend* flag is set to "true". This means any amendment submitted should return a successful response.  

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

When sending an *AmendUKTR* request, the full return must be submitted (but with amended fields). This API will not calculate deltas; it will supersede the previous UKTR with the new payload. This behaviour will be unchanged regardless of how many amendments are submitted.

```shell
curl --request PUT \
  --url 'https://test-api.service.hmrc.gov.uk/organisations/pillar-two/uk-tax-return' \
  --header 'Accept: application/vnd.hmrc.1.0+json' \
  --header 'Authorization: Bearer YOUR_BEARER_TOKEN' \
  --header 'Content-Type: application/json' \
  --header 'X-Pillar2-Id: YOUR_PILLAR2_ID' \
  --data '{
  "accountingPeriodFrom": "2024-01-01",
  "accountingPeriodTo": "2024-12-31",
  "obligationMTT": false,
  "electionUKGAAP": true,
  "liabilities": {
    "electionDTTSingleMember": false,
    "electionUTPRSingleMember": false,
    "numberSubGroupDTT": 1,
    "numberSubGroupUTPR": 1,
    "totalLiability": 5500,
    "totalLiabilityDTT": 5500,
    "totalLiabilityIIR": 0,
    "totalLiabilityUTPR": 0,
    "liableEntities": [
      {
        "ukChargeableEntityName": "Newco PLC",
        "idType": "CRN",
        "idValue": "12345678",
        "amountOwedDTT": 5500,
        "amountOwedIIR": 0,
        "amountOwedUTPR": 0
      }
    ]
  }
}'
```

This request (to amend the *amountOwedDTT*) should generate a successful response:

```json
{
  "processingDate": "2025-03-18T09:26:17Z",
  "formBundleNumber": "119000004321",
  "chargeReference": "XTC01234123412"
}

```

Following this amendment, a second *submissionType* will be returned in the response generated by the *Retrieve Obligations and Submissions* endpoint. There are now two submission types for the "UKTR" *obligationType*, "UKTR_CREATE" for the *submitUKTR* request and "UKTR_AMEND" for the *amendUKTR* request.

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
            },
            {
              "submissionType": "UKTR_AMEND",
              "receivedDate": "2025-03-18T09:26:17Z"
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
