---
title: API Testing Setup | Pillar 2 Service Guide
weight: 2
---

# API Testing Setup

## Stateful Sandbox
To help with API testing, a "stateful sandbox" environment has been created to mirror the production environment. 

The tester should start by creating a [test user](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/api-platform-test-user/1.0) and a test organisation. The test organisation can be used for the duration of the testing, and it should be deleted once a test scenario is completed. If the tester does not delete the organisation, it will be deleted within 28 days.

## Test Organisation

<a href="figures/test-organisation.svg" target="blank"><img src="figures/test-organisation.svg" alt="Agent Services Authorisation"/></a>

The test organisation facilitates the storage of submissions against a specific accounting period. This data is then used to fulfill any GET requests made on the API by the *Obligations and Submissions* endpoint.

The cURL examples shown here will create a test organisation that is *domesticOnly* and has a specific accounting period.

The *domesticOnly* flag is used to create an MNE or UK-only organisation. This will be important when testing the *SubmitUKTR* endpoint and conditional flags which depend on this value.


```shell
curl --request POST \
  --url http://test-api.service.hmrc.gov.uk/organisations/pillar-two/setup/organisation \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer {{bearer_token}}' \
  --header 'content-type: application/json' \
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



