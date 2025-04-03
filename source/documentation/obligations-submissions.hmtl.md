---
title: Retrieve Obligations and Submissions | Pillar 2 Service Guide
weight: 6
---

# Retrieve obligations and submissions 

## Overview

Pillar 2 information can be organised into *obligations* and *submissions* for each accounting period. There are currently two submission types which can be retrieved using the API (UKTR, BTN) with another two planned (ORN, GIR). The request has an HTTP GET code, which means it is only ever used to retrieve information. The obligations and submissions API is also a means of retrieving the entity’s obligations to be met by submissions and the due date for these obligations.

Obligations are instructions defined by HMRC for each entity. The first obligation relates to submitting a UKTR or BTN. The entity uses an API request to send information (a submission) to HMRC. Multiple submissions can be sent to fulfill an obligation within an accounting period, where a UKTR (or BTN) can be submitted. 


## Testing

Before using the sandbox, please read through the "Setup" page of the service guide and work through all the required steps for creating a test user and organisation. 

A *Return Obligations and Submissions* endpoint API request returns information on the submission type, submission date, and the status of the obligation (open or fulfilled). The accounting period is defined by the startDate and endDate parameters. Each obligation is returned as an obligationType with a submissionType nested inside. 

