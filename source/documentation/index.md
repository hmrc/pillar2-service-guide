---
title: Pillar 2 API Service Guide
weight: 1
---

# Pillar 2 API Service Guide

Version 1.0 issued 30 January 2025
***

## Overview

This service guide explains how you can integrate your software with the [Pillar 2 API](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0). Pillar 2 API documentation also includes an [API reference guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0) and a [roadmap](https://developer.service.hmrc.gov.uk/roadmaps/pillar2-roadmap/).

*Pillar 2* is the term given to the Global Anti-Base Erosion Rules (**GloBE**) published by the Organisation for Economic Cooperation and Development (**OECD**) in 2023. GloBE was designed to ensure Multinational Enterprises (**MNEs**) with a turnover of €750m or more are subject to a minimum Effective Tax Rate (**ETR**) of 15% in each jurisdiction where they are operating. To implement Pillar 2, the UK has introduced a Multinational Top-up Tax (**MTT**) and a Domestic Top-up Tax (**DTT**). 

The API provides MNEs (and their agents) with the capability to

- submit a UK Tax Return (**UKTR**)
- amend a submitted UKTR
- submit a Below-Threshold Notification (**BTN**)
- return obligation and submission details for a specified accounting period
- submit an Overseas Return Notification (**ORN**)
- amend a submitted ORN
- retrieve the details of a submitted ORN


## Getting started

To comply with Pillar 2, MNEs (and enterprise groups based in the UK) have an obligation to submit tax information to HMRC for every accounting period. 

In preparation, HMRC contacted MNEs and agents identified as being subject to Pillar 2 regulations. The communication outlined the registration process and also confirmed the registration deadline. 

The MNE **must** complete registration and subscription themselves. An agent cannot register or subscribe on the MNE’s behalf. The [registration notice](https://www.gov.uk/government/publications/pillar-2-top-up-taxes-registration-notice-1) is available to download on the GOV.UK website.

A unique Pillar 2 ID is generated when an MNE registers and subscribes to the service. Any information submitted via the API **must** include the Pillar 2 ID in the request header. 



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
<td><strong>CRN</strong> - Company Registration Number</td>
<td>The CRN can be used as a unique identifier for an entity in an API request.</td>
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
<td>A notice informing HMRC of the jurisdiction where the group’s GIR has been submitted.</td>
</tr>
<tr>
<td><strong>TIN</strong> - Tax Identification Number</td>
<td>A unique number (or combination of letters and numbers) in a specified format issued by a jurisdiction for the purposes of identifying individuals and entities for tax purposes.</td>
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
<tr>
<td><strong>UTR</strong> - Unique Taxpayer Reference</td>
<td>The UTR for corporation tax can be used as a unique identifier for an entity in an API request.</td>
</tr>
</tbody>
</table>

## Agent services

Once registration is completed by the MNE, they can choose to engage an agent or continue with an Ultimate Parent Entity (**UPE**) or Nominated Filing Member (**NFM**). 

Agents need to [register with HMRC](https://www.gov.uk/guidance/register-with-hmrc-to-use-an-agent-services-account) by post before they can [create an agent services account](https://www.gov.uk/guidance/get-an-hmrc-agent-services-account). The agent can then use their [agent services account](https://www.gov.uk/guidance/sign-in-to-your-agent-services-account) to seek authorisation from new clients and copy across existing ones. The authorisation process is set out in the flow chart. 

<a href="documentation/figures/pillar2-agent-services.svg" target="blank"><img src="documentation/figures/pillar2-agent-services.svg" alt="Agent Services Authorisation"/></a>

## Testing requirements

You can test the Pillar 2 API in the [HMRC Developer Hub](https://developer.service.hmrc.gov.uk/api-documentation). You will need to register for an account before you start, and there are instructions for new starters in the [user guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/using-the-hub). The [API reference guide](https://developer.service.hmrc.gov.uk/api-documentation/docs/api/service/pillar2-submission-api/1.0) contains specific information for testing the Pillar 2 API. 


## Software requirements

Any software solutions which integrate with the Pillar 2 API should comply with the requirements listed here. 

### Compatible software

“Compatible software” can mean a single end-to-end piece of software or a set of compatible software products. Any software needs to meet these minimum functionality standards. 

- Provide HMRC with transaction monitoring fraud prevention header data.
- Submit a UKTR, or a BTN.
- Make amendments to a submitted tax return (if required).
- Retrieve obligation and submission details for a specified accounting period.  
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
