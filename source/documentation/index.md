---
title: Pillar 2 API Service Guide
weight: 1
---

# Pillar 2 API Service Guide

Version 1.0 issued 30 January 2025
***

## Overview

This service guide explains how you can integrate your software with the [Pillar 2 API](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0). 

*Pillar 2* is the term given to the Global Anti-Base Erosion Rules (**GloBE**) published by the Organisation for Economic Cooperation and Development (**OECD**) in 2023. GloBE was designed to ensure Multinational Enterprises (**MNEs**) with a turnover of €750m or more are subject to a minimum Effective Tax Rate (**ETR**) of 15% in each jurisdiction where they are operating. To implement Pillar 2, the UK has introduced a Multinational Top-up Tax (**MTT**) and a Domestic Top-up Tax (**DTT**). 

The API provides MNEs (and their agents) with the capability to

- submit a UK tax return (**UKTR**)
- amend a submitted UKTR
- submit a Below-Threshold Notification (**BTN**)


## Getting started

To comply with Pillar 2, MNEs (and enterprise groups based in the UK) have an obligation to submit tax information to HMRC for every accounting period. Information submitted via the API must include a *Pillar 2 ID*, which is generated when an MNE registers and subscribes to the service. 

In preparation, HMRC contacted MNEs and agents identified as being subject to Pillar 2 regulations. The communication outlined the registration process and also confirmed the registration deadline. 

**Important**: The MNE **must** complete registration and subscription themselves. An agent cannot register or subscribe on the MNE’s behalf. The [registration notice](https://www.gov.uk/government/publications/pillar-2-top-up-taxes-registration-notice-1) is available to download on the GOV.UK website.


## Glossary

A glossary of terms has been created to help you navigate the information in the service guide. 

<table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>API</strong> - Application Programming Interface</td>
<td>Software code that enables communication between different applications.</td>
</tr>
<tr>
<td><strong>BTN</strong> - Below-Threshold Notification</td>
<td>A notification sent to HMRC if group revenues fall below the level where Pillar 2 charges are applied. Sending a BTN removes the obligation to submit a UKTR for both current (and future) accounting periods.</td>
</tr>
<tr>
<td><strong>DTT</strong> - Domestic Top-up Tax</td>
<td>A new UK tax introduced with the adoption of Pillar 2. DTT charges UK entities to tax where there are low-taxed UK profits. Groups with only UK entities are subject to DTT only, while groups subject to MTT are also subject to DTT. The UK’s DTT is a Qualifying Domestic Minimum Top-up Tax (<strong>QDMTT</strong>) with safe-harbour status.</td>
</tr>
<tr>
<td><strong>GAAP</strong> - Generally Accepted Accounting Practice and Principles</td>
<td>The standard accounting rules for preparing, presenting and reporting financial statements.</td>
</tr>
<tr>
<td><strong>GIR</strong> - GloBE Information Return</td>
<td>A standardised information return for Pillar 2 published by the OECD.</td>
</tr>
<tr>
<td><strong>IIR</strong> - Income Inclusion Rule</td>
<td>One of the Pillar 2 charging mechanisms. The parent entity is charged a top-up tax where it has an interest in entities located in another jurisdiction, and the group’s profits in that jurisdiction are taxed at below 15%.</td>
</tr>
<tr>
<td><strong>MTT</strong> - Multinational Top-up Tax</td>
<td>A new UK tax introduced with the adoption of Pillar 2, comprised of two components (IIR and UTPR). MTT charges UK entities to tax where there are low-taxed profits outside the UK. Groups with UK and non-UK entities are liable for MTT.</td>
</tr>
<tr>
<td><strong>MNE</strong> - Multinational Enterprise</td>
<td>A business organisation with operations based in more than one country.</td>
</tr>
<tr>
<td><strong>NFM</strong> - Nominated Filing Member</td>
<td>A company nominated by the UPE to file Pillar 2 returns on their behalf.</td>
</tr>
<tr>
<td><strong>ORN</strong> - Overseas Return Notification</td>
<td>A notice informing HMRC of the jurisdiction where the group’s GIR has been submitted. </td>
</tr>
<tr>
<td><strong>UKTR</strong> - UK Tax Return</td>
<td>A UK specific return for reporting the self-assessment of MTT and DTT liabilities.</td>
</tr>
<tr>
<td><strong>UPE</strong> - Ultimate Parent Entity</td>
<td>An entity that does not have another entity with a controlling interest in it.  Can be part of an MNE or a single UK entity. The UPE will be the filing member unless it has nominated another filing member.</td>
</tr>
<tr>
<td><strong>UTPR</strong> - Undertaxed Profits Rule</td>
<td>One of the Pillar 2 charging mechanisms. A top-up tax charged where the MNE’s structure means that profits cannot be taxed by the IIR rule.</td>
</tr>
</tbody>
</table>





## Agent services

Once registration is completed by the MNE, they can choose to engage an agent or continue with an Ultimate Parent Entity (**UPR**) or Nominated Filing Member (**NFM**). 

Agents need to [register with HMRC](https://www.gov.uk/guidance/register-with-hmrc-to-use-an-agent-services-account) by post before they can [create an agent services account](https://www.gov.uk/guidance/get-an-hmrc-agent-services-account). The agent can then use their [agent services account](https://www.gov.uk/guidance/sign-in-to-your-agent-services-account) to seek authorisation from new clients and copy across existing ones. 


## API requests

To use the API, information is submitted in an API request, which is then validated and processed by HMRC. A response is sent if processing is successful and an error is sent if processing fails. 

- The SubmitUKTR and SubmitBTN requests return an HTTP 201 response if they complete successfully.
![Flow Diagram Showing How to Submit UKTR and BTN](SubmitUKTR_090125.svg "Submit UK Tax Return Submit BTN")

- The AmendUKTR request returns an HTTP 200 response if it completes successfully.
![Flow Diagram Showing How to Amend UKTR](AmendUKTR_090125.svg "Amend UK Tax Return")

You can find examples for each different request variant (and their responses) in the "Endpoints" page of the [API reference guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0). 



## Submit UK tax return

Under Pillar 2 requirements, MNEs and enterprise groups based in the UK have an obligation to submit a UKTR for every accounting period. MNEs/groups (or their agents) can use the Pillar 2 API to submit the UKTR and meet this obligation. 

The request structure has four variants created from two dependencies.

<ol>
  <li>Are the group entities UK only or are they a mixture of UK and non-UK entities? This information <em>must</em> be confirmed during registration for Pillar 2. </li>
  <li>Is the return a nil return?</li>
</ol> 

The table here contains some information on the differences between the request variants.

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
<td>Liable for MTT, the <em>obligationMTT</em> field is set to true.</td>
</tr>
<tr>
<td>Nil Return (UK Only)</td>
<td>Liable for DTT, the <em>obligationMTT</em> field is set to false.</td>
</tr>
<tr>
<td>Liability return (MNE/UK)</td>
<td>Request includes totals for DTT, IIR, UTPR and overall total. The <em>obligationMTT</em> field is set to true.</td>
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



## Amend UK tax return

If a submitted UKTR needs to be updated, an amendment can be sent via the API. 

The AmendUKTR request has the same structure and data fields as SubmitUKTR. If you attempt to amend a return which has not been submitted, a code 44 error is returned. You can find more information on code 44 errors in the [API reference guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0).

For Pillar 2, all submitted returns have an *amendment window*. This is a period after the submit due date where you can amend the return for the specified accounting period. The amendment window lasts 12 months for each accounting period. Multiple amendments can be submitted during this time. The amendment window end date does not change if a return is submitted before or after the due date, and you cannot amend a return after the amendment window end date. 

If the return is the focus of an active enquiry, amendments are not processed until the enquiry ends. 

If the amend request is successful, it returns a response containing a processing date and a charge reference if the liability has changed. 


## Submit below-threshold notification

If group revenues fall below the threshold where the Pillar 2 tax is applied, sending a BTN removes the obligation to submit a UKTR for both current (and future) accounting periods. 

Your group can submit a BTN if consolidated annual revenues are below €750 million in at least 2 of the previous 4 accounting periods, and are not expected to be above €750 million within the next 2 accounting periods.

A SubmitBTN request requires you to send the accounting period start and end dates, and a successful request returns a processing date. 

## Testing requirements

You can test the Pillar 2 API in the [HMRC Developer Hub](https://developer.tax.service.gov.uk/api-documentation). You will need to register for an account before you start, and there are instructions for new starters in the [user guide](https://developer.tax.service.gov.uk/api-documentation/docs/using-the-hub). The [Pillar 2 API reference guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0) contains specific information for testing the Pillar 2 API. 


## Software requirements

Any software solutions which integrate with the Pillar 2 API should comply with the requirements listed here. 

### Compatible software

“Compatible software” can mean a single end-to-end piece of software or a set of compatible software products. Any software needs to meet these minimum functionality standards. 

- Provide HMRC with transaction monitoring fraud prevention header data.
- Submit a UKTR, or a BTN.
- Make amendments to a submitted tax return (if required).
- Create and maintain all digital records (or digitally link to a product that can do so) that a customer is required to keep by law in digital form. End users should own 
and have access to all their records created and be able to export these records, if necessary.
- Allow customers to view their outstanding tax liabilities by either signposting them to their HMRC account or by displaying it in software.
- Make a final declaration or divert a customer into a channel where they can make it.

HMRC recognises customers or agents will use different pieces of software if an all-in-one product does not meet their requirements (for example, combining record keeping software with tax filing software). 


### Bridging software

“Bridging software” products are used by customers to digitally link record-keeping software with the software solution they use to submit Pillar 2 tax information. Bridging software ensures customers meet their obligations while using software products which meet the minimum functionality standards set out in “Compatible software” above.


## Support contacts 

Pillar 2 will offer support for organisations in checking eligibility and registering for the service, prepay taxes and later on file returns and be tax compliant in the UK and globally.

*API support* is available 07.00-19.00 Monday-Friday. If planned downtime for system maintenance is agreed an appropriate error message will be displayed.

*Pillar 2 (Telephone) support* is available via contact centres 08.30-17.00 Monday-Friday. Calls are escalated to the Specialist Team. Specialist Team and CRM email support is available 8.30-17.00.

## Changelog
