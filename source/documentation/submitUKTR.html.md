---
title: Submit UK Tax Return | Pillar 2 Service Guide
weight: 3
---

# Submit UK tax return

## Overview

Under Pillar 2 requirements, MNEs and enterprise groups based in the UK have an obligation to submit a UKTR for every accounting period. MNEs/groups (or their agents) can use the Pillar 2 API to submit the UKTR and meet this obligation. 

The request structure has four variants created from two dependencies.

<ol>
  <li>Are the group entities UK only or are they a mixture of UK and non-UK entities? This information <em>must</em> be confirmed during registration for Pillar 2. </li>
  <li>Is the return a nil return?</li>
</ol> 

The table here contains some information on the differences between the request variants. Liability returns (for MNEs and UK only entities) should include evidence of a company ID in the *entityType* field - this can be either the Company Reference Number (**CRN**) or the Unique Taxpayer Reference (**UTR**) for corporation tax. 

<table>
<thead>
<tr>
<th>Return Variant</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>Nil Return (MNE/UK)</td>
<td>The <em>obligationMTT</em> field cannot be set to true for a domestic (UK only) group.</td>
</tr>
<tr>
<td>Nil Return (UK Only)</td>
<td>The <em>obligationMTT</em> field is set to false.</td>
</tr>
<tr>
<td>Liability return (MNE/UK)</td>
<td>Request includes totals for DTT, IIR, UTPR and overall total. The <em>obligationMTT</em> field cannot be set to true for a domestic (UK only) group.</td>
</tr>
<tr>
<td>Liability return (UK Only)</td>
<td>Request includes totals for DTT and overall total. The request is rejected if it contains amounts for MTT fields. The <em>obligationMTT</em> field is set to false.</td>
</tr>
</tbody>
</table>


If the request is successful, it returns a response containing several pieces of information.

<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>Processing date</td>
<td>Date and time the request was processed.</td>
</tr>
<tr>
<td>Form bundle</td>
<td>Unique identifier for the request, to be noted and retained in case amendments need to be filed against the return.</td>
</tr>
<tr>
<td>Charge reference</td>
<td>Identifier for any liabilities specified in the return. Nil returns have no charge so don’t require a charge reference.</td>
</tr>
</tbody>
</table>


## Testing
Before using sandbox stubs, you will need to [create a Test User](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/api-platform-test-user/1.0) and create a Test Organisation.

Once the organisation is created, it is generally recommended to interact with the sandbox stubs on a scenario basis, deleting the organisation once the test scenario is completed.

If you do not delete the test organisation, it will be deleted within 28 days.


### Scenario 1: Submit UK Tax Return
<a href="figures/submituktr-test-sequence.svg" target="blank"><img src="figures/submituktr-test-sequence.svg" alt="Sequence diagram showing REST calls for testing submit UK Tax Return" style="width:520px;" /></a>

The first, simple solution is to submit a UK Tax Return that satisfies the Pillar2TaxReturn obligation.

First, we can check the obligations for this organisation:

```shell
curl --request GET \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/submissionandobligation?fromDate=2024-01-01&toDate=2024-12-31 \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' 
```

This will return the obligations for all accountingPeriods that occur during the requested date range:

```json
{
  "success": {
    "processingDate": "2025-01-01T09:26:17Z",
    "accountingPeriodDetails": [
      {
        "startDate": "2024-01-01",
        "endDate": "2024-12-31",
        "dueDate": "2025-01-31",
        "underEnquiry": false,
        "obligations": [
          {
            "obligationType": "Pillar2TaxReturn",
            "status": "Open",
            "canAmend": true,
            "submissions": []
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

From this response, we can see that for our accounting period, we have two obligations which are open and due. We can satisfy one of these obligations by submitting a UK Tax Return.

```shell
curl --request POST \
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
    "totalLiability": 5000,
    "totalLiabilityDTT": 5000,
    "totalLiabilityIIR": 0,
    "totalLiabilityUTPR": 0,
    "liableEntities": [
      {
        "ukChargeableEntityName": "Newco PLC",
        "idType": "CRN",
        "idValue": "12345678",
        "amountOwedDTT": 5000,
        "amountOwedIIR": 0,
        "amountOwedUTPR": 0
      }
    ]
  }
}'
```

and then a subsequent call to the Submissions and Obligations endpoint will show us this submission and the fulfilled obligation.

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

This will result in a successful response:
```json
{
  "processingDate": "2025-01-01T09:26:17Z",
  "formBundleNumber": "xxxxxx",
  "chargeReference": "xxxx"
}
```


#### Nil Return
A Nil Return is a type of UK Tax Return that declares that an organisation must submit a UK Tax Return to satisfy an obligation but does not have a liability to declare. A Nil Return is submitted through the same POST endpoint but has a different structure

```shell
curl --request POST \
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
    "returnType": "NIL_RETURN"
  }
}'
```

The response to a Nil Return will include a formBundleNumber but **will not include a chargeReference** as there is no charge in relation to a Nil Return

```json
{
  "processingDate": "2025-01-01T09:26:17Z",
  "formBundleNumber": "xxxxxx",
}
```


#### Duplicate Submissions
<a href="figures/duplicate-submissions.svg" target="blank"><img src="figures/duplicate-submissions.svg" alt="Sequence diagram showing client error on duplicate submission" style="width:520px;" /></a>

Once a UK Tax Return has been submitted, it cannot be submitted again for the same accounting period. The Amend UK Tax Return must be used for any amendments.

If a duplicate submission is received, a [422 client error response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/422) will be returned with a specific error code

```json
{
  "errors": {
    "processingDate": "2025-03-17T09:26:17Z",
    "code": "044",
    "message": "Tax obligation already fulfilled"
  }
}

```