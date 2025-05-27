Overview

An Overseas Return Notification (ORN) is an annual notice sent to HMRC by a Multinational Enterprise (MNE). The ORN contains information on the jurisdiction where the entity’s GloBE Information Return (GIR) has been submitted. 

If the entity is registered with Pillar 2, they (or their agent) can send a request using the Submit Overseas Return Notification endpoint. This will inform HMRC that they have submitted their GIR for the specified accounting period to another jurisdiction, and it fulfils their information return obligation. 

An entity which has been classed as “UK Only” cannot submit an ORN. 
Testing


Before using the sandbox, please read through the "API Testing Setup" page of the service guide and work through all the required steps for creating a test user and organisation.
Submit overseas return notification

This diagram shows a request which successfully submits an ORN.  



The Submit Overseas Return Notification request should include the Tax Identification Number (TIN) and issuing country for the GIR, as well as the accounting period and the date and location for the GIR.
 
All fields in the request are mandatory.  


curl --request POST \
  --url https://test-api.service.hmrc.gov.uk/organisations/pillar-two/overseas-return-notification/submit \
  --header 'authorization: YOUR_BEARER_TOKEN' \
  --header 'content-type: application/json' \
  --header 'x-pillar2-id: YOUR_PILLAR2_ID' \
  --data '{
  "accountingPeriodFrom": "2024-01-01",
  "accountingPeriodTo": "2024-12-31",
  "filedDateGIR": "2025-01-10",
  "countryGIR": "US",
  "reportingEntityName": "Newco PLC",
  "TIN": "US12345678",
  "issuingCountryTIN": "US"
}'


 A successful response will include a processingDate and formBundleNumber. 


{
  "processingDate": "2025-05-20T11:33:30Z",
  "formBundleNumber": "145749350495"
}


Sending a GET request using the Obligations and Submissions endpoint will return a response showing the submissionType “ORN_CREATE” under the “GIR” obligationType. 


{
  "processingDate": "2025-05-20T14:27:06Z",
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
              "submissionType": "ORN_CREATE",
              "receivedDate": "2025-05-20T14:08:41Z",
              "country": "US"
            }
          ]
        }
      ]
    }
  ]
}




Duplicate Submissions


Once an ORN has been submitted, it cannot be submitted again for the same accounting period. The Amend Overseas Return Notification endpoint should be used for any amendments.


If a duplicate submission is received, a 422 client error response with code "044" will be returned.


{
  "errors": {
    "processingDate": "2025-03-17T09:26:17Z",
    "code": "044",
    "message": "Tax obligation already fulfilled"
  }
}


