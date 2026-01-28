---
title: Retrieve Account Activity | Pillar 2 Service Guide
weight: 9
---

# Retrieve account activity

## Overview

The *Retrieve Account Activity* endpoint retrieves financial transaction details from Pillar 2. Account activity includes charges, determinations, penalties, payments, and what payments have been allocated to charge. Also included are appeals, standovers, and accruing interest.

The *Retrieve Account Activity* endpoint has an HTTP GET code. When a successful call is made, the API will return information relating to account activity for a given group within a specified time period.

**Note**: The diagram in this section relates to the Pillar 2 testing environment **only**.

## Testing

Before using the sandbox, please read through the [API Testing Setup](https://developer.service.hmrc.gov.uk/guides/pillar2-service-guide/documentation/set-up.html) page of the service guide and work through all the required steps for creating a test user and organisation.

### Retrieve account activity

This diagram shows a request which successfully retrieves account activity information.

<a href="figures/retrieveaccount-activity-sequence.svg" target="blank"><img src="figures/retrieveaccount-activity-sequence.svg" alt="Sequence diagram showing REST calls for retrieving account activity" style="width:520px;" /></a>

The *Retrieve Account Activity* endpoint retrieves information for a specific time period, defined by the *fromDate* and *toDate* fields.

```shell
curl --request GET \
  --url 'https://api.development.tax.service.gov.uk/organisations/pillar-two/account-activity?fromDate=2026-01-01&toDate=2026-12-31' \
  --header 'accept: application/vnd.hmrc.1.0+json' \
  --header 'authorization: Bearer 134ade7379fe07af446305ada5ed5b46' \
  --header 'x-pillar2-id: XOPLR5914916562'
```

When successful, the API will return a response containing account activity data for the specified time period. The following example shows only one charge, a Pillar 2 UK Tax Return DTT. This is due to the setup of `DTT_CHARGE` test scenario on the test organisation. If we were to use another scenario, a different response would be retrieved from the endpoint. A full list of scenarios can be found on the open API specification.

```json
{
  "processingDate": "2026-01-21T11:02:13.4607145112",
  "transactionDetails": [
    {
      "transactionType": "Debit",
      "transactionDesc": "Pillar 2 UK Tax Return Pillar 2 DTT",
      "startDate": "2026-01-01",
      "endDate": "2026-12-31",
      "transactionDate": "2026-01-21",
      "dueDate": "2027-06-30",
      "originalAmount": 10000,
      "outstandingAmount": 10000
    }
  ]
}
```

When there is no activity on the account, a 422 error is returned with the following response. This is also returned in the sandbox when no *accountActivityScenario* is selected on the test organisation.

```json
{
  "code": "014",
  "message": "No account activity found for the given dates"
}
```
