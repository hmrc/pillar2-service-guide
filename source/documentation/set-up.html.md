---
title: API Testing Setup | Pillar 2 Service Guide
weight: 2
---

# API testing setup

**Note**: The diagrams in this section relate to the Pillar 2 testing environment **only**. 

## Stateful sandbox

To help with API testing, a "stateful sandbox" environment has been created to mirror the production environment. 

The tester should start by creating a [test user](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/api-platform-test-user/1.0). The test user response will return a username, password and a *Pillar 2 ID*. The Pillar 2 ID must be included in the header of each test request, or an error will be returned. 

The next step is to create a test organisation using the *Create Test Organisation* endpoint. The test organisation can be used for the duration of testing, and should be deleted once a test scenario is completed. If the tester does not delete the organisation, it will be deleted within 28 days. 

If required, the tester can also create a simulation of a GloBE Information Return (**GIR**) using the *Create a Test GloBE Information Return* endpoint. 

**Note**: The diagram in this section relates to the Pillar 2 testing environment **only**.


<a href="figures/test-organisation-sequence.svg" target="blank"><img src="figures/test-organisation-sequence.svg" alt="Create test organisation"/></a>

## Test organisation

The test organisation facilitates the storage of submissions against a specific accounting period. This data is then used to fulfill any GET requests made on the API by the *Retrieve Obligations and Submissions* endpoint.

The cURL examples shown here will create a UK only test organisation where *domesticOnly* is set to true for a specific accounting period.

For the *Retrieve Account Activity* endpoint, there is a field named *accountActivityScenario* within the *testData* structure. This field must be populated with a chosen scenario from a set list. For more information on this, see the [*Retrieve Account Activity* API](account-activity.html).

The *domesticOnly* flag is used to create an MNE or UK-only organisation. This will be important when testing the *Submit UK Tax Return* endpoint and the conditional flags which depend on this value.


```shell
curl --request POST \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/setup/organisation \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' \
  --header 'content-type: application/json' \
  --header 'x-pillar2-id: {{pillar2Id}}' \
  --data '{
  "orgDetails": {
    "domesticOnly": true,
    "organisationName": "Test Organisation Ltd",
    "registrationDate": "2025-03-01"
  },
  "accountingPeriod": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "testData": {
    "accountActivityScenario": "DTT_CHARGE"
  }
}'
```

## GloBE information return

**Important**: Creating a GIR simulation in the test environment is for testing purposes only, and does not reflect the process for submitting an entity’s GIR to comply with Pillar 2.

Once the test organisation has been created, a simulation of a GIR can be created in the sandbox to help support testing the *Retrieve Obligations and Submissions* endpoint. The request is submitted using the dates for the specified accounting period.

```shell
curl --request POST \
  --url https://test-api.service.hmrc.gov.uk/organisations/pillar-two/setup/globe-information-return \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: {{bearer_token}}' \
  --header 'content-type: application/json' \
  --header 'x-pillar2-id: {{testPlrId}}' \
  --data '{
  "accountingPeriodFrom": "2024-01-01",
  "accountingPeriodTo": "2024-12-31"
}'
```

A successful response will return a processing date.

```json
{
  "processingDate": "2025-05-22T09:26:17Z"
}
```

When a *Retrieve Obligations and Submissions* GET request is submitted, the response will display a "GIR" *submissionType* under the "GIR" *obligationType*.

```json
{
  "processingDate": "2025-07-04T09:12:09Z",
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
              "submissionType": "GIR",
              "receivedDate": "2025-07-04T09:12:05Z"
            }
          ]
        }
      ]
    }
  ]
}     
```
