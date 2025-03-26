---
title: Set up | Pillar 2 Service Guide
weight: 2
---

# Set up

## Stateful Sandbox
To enable testing of this API, we have developed a Stateful Sandbox environment that will mimic the production environment. To start testing, a Test Organisation should be created, which can be used for the duration of testing. Once a test scenario is complete, it is recommended to delete the Test Organisation

## Test Organisation
[![](https://mermaid.ink/img/pako:eNp1kj9PwzAQxb-K5ZVGAcYMlRAsDIhKKQvKcrWvjYVjG_sshKp-d-w4rdI_ZHLOv3vvXnJ7LqxE3vDOBPyOaAS-KNh5GDrD0gOCrGdCKzRUKg48KaEcGGIQqS_VQlTL5V2uNWz13q5ZbYH6muwXmkkt3WWm0A0D57QSQMoatkHw6NmMFh6B8MwwMgiMMKRTSPDT6vXSPh69S3eV4SrDtfU7MCqMbqG0xfkw6yz7kWUlEigdbid7LlON4PXMlwn_wW5EaylurizH4ulrzgPUTmkNvqIfWwek6M6ui87YPZ_m8f5hspad4Qs-oB9AyfT797mj49TjgB1v0lHiFqKmLm3GIaEpmG1_jeAN-YgL7m3c9bzZgg7pLTqZRKfNOSIp1qe1wwlCqdIyvZV9G9fu8Ae4bNq3?type=png)](https://mermaid.live/edit#pako:eNp1kj9PwzAQxb-K5ZVGAcYMlRAsDIhKKQvKcrWvjYVjG_sshKp-d-w4rdI_ZHLOv3vvXnJ7LqxE3vDOBPyOaAS-KNh5GDrD0gOCrGdCKzRUKg48KaEcGGIQqS_VQlTL5V2uNWz13q5ZbYH6muwXmkkt3WWm0A0D57QSQMoatkHw6NmMFh6B8MwwMgiMMKRTSPDT6vXSPh69S3eV4SrDtfU7MCqMbqG0xfkw6yz7kWUlEigdbid7LlON4PXMlwn_wW5EaylurizH4ulrzgPUTmkNvqIfWwek6M6ui87YPZ_m8f5hspad4Qs-oB9AyfT797mj49TjgB1v0lHiFqKmLm3GIaEpmG1_jeAN-YgL7m3c9bzZgg7pLTqZRKfNOSIp1qe1wwlCqdIyvZV9G9fu8Ae4bNq3)

The test organisation is created to facilitate storage of submissions against a specific accounting period. This data is then used to fulfill any GET requests made on the API.


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

This cURL will create a test organisation that is **domesticOnly** and has a specific accounting period.

The **domesticOnly** flag is used to create a MNE or UK-only organisation. This will be important when testing the submitUKTR endpoint and some of the conditional flags that depend on this value.

