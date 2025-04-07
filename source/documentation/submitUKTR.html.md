---
title: Submit UK Tax Return | Pillar 2 Service Guide
weight: 3
---

# Submit UK tax return

## Overview

Under Pillar 2 requirements, MNEs and enterprise groups based in the UK have an obligation to submit a UK Tax Return **(UKTR)** for every accounting period. MNEs/groups (or their agents) can use the Pillar 2 API to submit the UKTR and meet this obligation. 

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
<td>Identifier for any liabilities specified in the return. Nil returns do not return a charge reference.</td>
</tr>
</tbody>
</table>


## Testing

Before using the sandbox, please read through the "API Testing Setup" page of the service guide and work through all the required steps for creating a test user and organisation. 

### Scenario 1: Submit UK Tax Return

This scenario demonstrates submitting a UKTR that satisfies the "Pillar2TaxReturn" *obligationType*.

<a href="figures/submituktr-test-sequence.svg" target="blank"><img src="figures/submituktr-test-sequence.svg" alt="Sequence diagram showing REST calls for testing submit UK Tax Return" style="width:520px;"/></a>

Once the tax return is submitted, a GET request can be sent using the *Obligations and Submissions* endpoint to check the obligations defined for this organisation.

```shell
curl --request GET \
  --url 'http://test-api.service.hmrc.gov.uk/organisations/pillar-two/obligations-and-submissions?fromDate=2024-01-01&toDate=2024-12-31' \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' \
  --header 'x-pillar2-id: {{pillar2Id}}'
```

The response will return obligations for all accounting periods that fall within the requested date range. This example shows two obligations which are open and due for the accounting period specified in the request.

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

The *obligationType* "Pillar2TaxReturn" can be fulfilled by submitting a UKTR.

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

If the *SubmitUKTR* request is successful, it will generate the following response. 

```json
{
  "processingDate": "2025-01-01T09:26:17Z",
  "formBundleNumber": "119000004320",
  "chargeReference": "XTC01234123412"
}
```

Sending a new request using the *Obligations and Submissions* endpoint will display the successful submission and the fulfilled obligation.

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

#### Nil Return

If an organisation is required to submit a UKTR (to fulfill an obligation) but does not have any liabilities to declare, they will have to submit a "Nil Return". A nil return is also submitted through the *SubmitUKTR* endpoint, but has a different structure. 

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

A successful response will not include a *chargeReference* as there is no charge in relation to a nil return.

```json
{
  "processingDate": "2025-01-01T09:26:17Z",
  "formBundleNumber": "119000004320",
}
```


#### Duplicate Submissions

Once a UKTR has been submitted, it cannot be submitted again for the same accounting period. The *AmendUKTR* endpoint must be used for any amendments.

<a href="figures/duplicate-submissions.svg" target="blank"><img src="figures/duplicate-submissions-sequence.svg" alt="Sequence diagram showing client error on duplicate submission" style="width:520px;" /></a>


If a duplicate submission is received, a [422 client error response](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/422) with code "044" will be returned.

```json
{
  "errors": {
    "processingDate": "2025-03-17T09:26:17Z",
    "code": "044",
    "message": "Tax obligation already fulfilled"
  }
}

```
