---
title: API Testing Setup | Pillar 2 Service Guide
weight: 2
---

# API Testing Setup

## Stateful Sandbox
To help with API testing, a "stateful sandbox" environment has been created to mirror the production environment. 

The tester should start by creating a [test user](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/api-platform-test-user/1.0). The test user response will return a username, password and a *Pillar 2 ID*. The Pillar 2 ID must be included in the header of each test request, or an error will be returned. 

The next step is to create a test organisation using the *Create Test Organisation* endpoint. The test organisation can be used for the duration of testing, and should be deleted once a test scenario is completed. If the tester does not delete the organisation, it will be deleted within 28 days. 

## Test Organisation

<a href="figures/test-organisation.svg" target="blank"><img src="figures/test-organisation.svg" alt="Create test organisation"/></a>

The test organisation facilitates the storage of submissions against a specific accounting period. This data is then used to fulfill any GET requests made on the API by the *Obligations and Submissions* endpoint.

The cURL examples shown here will create a UK only test organisation where *domesticOnly* is set to true for a specific accounting period.

The *domesticOnly* flag is used to create an MNE or UK-only organisation. This will be important when testing the *SubmitUKTR* endpoint and the conditional flags which depend on this value.


```shell
curl --request POST \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/setup/organisation \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' \
  --header 'content-type: application/json' \
  --header 'x-pillar2-id: {{pillar2Id}} \
  --data '{
  "orgDetails": {
    "domesticOnly": true,
    "organisationName": "Test Organisation Ltd",
    "registrationDate": "2025-03-01"
  },
  "accountingPeriod": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  }
}'
```



