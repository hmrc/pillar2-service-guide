---
title: Amend UK Tax Return | Pillar 2 Service Guide
weight: 4
---

# Amend UK tax return

## Overview
If a submitted UKTR needs to be updated, an amendment can be sent via the API. 

The AmendUKTR request has the same structure and data fields as SubmitUKTR. If you attempt to amend a return which has not been submitted, a code 044 error is returned. You can find more information on code 044 errors in the [API reference guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0).

Amendments to liability returns (for MNEs and UK only entities) should include evidence of a company ID in the *entityType* field - this can be either the Company Reference Number (**CRN**) or the Unique Taxpayer Reference (**UTR**) for corporation tax.

For Pillar 2, all submitted returns have an *amendment window*. This is a period after the submit due date where you can amend the return for the specified accounting period. The amendment window lasts 12 months for each accounting period. Multiple amendments can be submitted during this time. The amendment window end date does not change if a return is submitted before or after the due date, and you cannot amend a return after the amendment window end date. 

If the return is the focus of an active enquiry, amendments are not processed until the enquiry ends. 

If the amend request is successful, it returns a response containing a processing date and a charge reference (unless the amendment changes a liability return to a Nil Return, where no charge reference is issued).


## Testing

<a href="figures/amenduktr-test-sequence.svg" target="blank"><img src="figures/amenduktr-test-sequence.svg" alt="Sequence diagram showing REST calls for testing amend UK Tax Return" style="width:520px;" /></a>

Once a UK Tax Return has been submitted, it can be amended any number of times **before end of the amendment window**. This amendement window will be denoted by the `canAmend` flag on the Obligations and Submissions endpoint. 

```shell
curl --request GET \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/submissionandobligation?fromDate=2024-01-01&toDate=2024-12-31 \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' 
```
This call to the Obligations and Submissions endpoint will show that we have previously submitted a UK Tax Return and we are within our amendment window. Therefore, we should be able to successfully submit an amendment.

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

When amendeding the UK Tax Return, the **full return must be subitted with amended fields**. This API will not calculate deltas; it will simply supersede the previous UK Tax Return with the new payload. This behaviour is identical whether it is the first or <em>n</em>th amendment.

```shell
curl --request PUT \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/uk-tax-return \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' \
  --header 'content-type: application/json' \
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

This request (to amend the `amountOwedDTT`) should request in a successful response:

```json
{
  "processingDate": "2025-01-01T09:26:17Z",
  "formBundleNumber": "xxxxxx",
  "chargeReference": "xxxx"
}
```

Following this amendment, a second UKTaxReturn will be recorded on the Obligations and Submissions endpoint. We can infer this is an amendment because there are two UKTR submissions for the same accounting period.

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
                "submissionType": "UKTR",
                "receivedDate": "2025-03-18T09:26:17Z"
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