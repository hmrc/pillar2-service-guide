---
title: Pillar 2 Submission API Service Guide
weight: 1
---

# Pillar 2 Submission API Service Guide

Version 1.0 issued 23 December 2024
***

## Overview

This service guide explains how you can integrate your software with the Pillar 2 Submission API. 
**Pillar 2** is the name of a set of regulations introduced by the Organisation for Economic Cooperation and Development (**OECD**) to function as a global minimum tax. It is intended to ensure Multinational Enterprises (**MNEs**) with a turnover of >€750m are subject to a minimum Effective Tax Rate of 15%.

The API provides MNEs (and their agents) with the capability to

- submit a UK tax return (**UKTR**).
- amend a submitted UKTR.
- submit a Below Threshold Notification (**BTN**).  

## Getting Started

To comply with Pillar 2, MNEs (and enterprise groups based in the UK) have an obligation to submit tax information to HMRC for every accounting period. Information submitted via the API must include a **Pillar 2 ID**, which is generated when an MNE registers and subscribes to the service. 

In preparation, HMRC contacted MNEs and agents identified as being subject to Pillar 2 regulations (approximately 4000). The communication outlined the registration process and also confirmed the registration deadline. 

**Important**: The MNE **must** complete registration and subscription themselves. An agent cannot register or subscribe on the MNE’s behalf. The [registration notice](https://www.gov.uk/government/publications/pillar-2-top-up-taxes-registration-notice-1) is available to download on the GOV.UK website.

## Glossary

To help you navigate the information in the service guide, we’ve included a glossary of terms. 

| **Name** | **Description** |
|----------|-----------------|
| **API** - Application Programmer Interface | Software code that enables communication between different applications. |
| **CADX** - Competent Authority Data Exchange | HMRC Data Layer |
| **DTT** - Domestic Topup Tax | A new tax introduced as part of the UK adoption of Pillar 2. Groups with UK entities only are liable for DTT. |
| **GAAP** - Generally Accepted Accounting Principles | A set of rules and procedures UK companies follow when preparing their financial statements. |
| **IIR** - Income Inclusion Rule | One of the 3 Pillar 2 rules.  If the country where the profits are located does not accept the tax, then the country where the company is headquartered will receive the tax. |
| **MDTP** - Multi-channel Digital Tax Platform | Hosts components which handle the authorisation and validation of the API request. |
| **MTT** - Multinational Topup Tax | A new tax introduced as part of the UK adoption of Pillar 2, comprised of IIR and UTPR. Groups with UK and non-UK entities are liable for MTT. |
| **MNE** - Multinational Enterprise | A business organisation with operations based in more than one country. |
| **NFM** - Nominated Filing Member | An entity nominated by the UPE to file Pillar 2 returns on their behalf. |
| **UPE** - Ultimate Parent Entity | The entity liable for filing Pillar 2 returns. Can be part of an MNE or a single organisation. |
| **UTPR**  - Undertaxed Profits Rule  | One of 3 Pillar 2 rules, ensuring that any taxes not paid under another jurisdiction’s Pillar 2 rules are brought into charge in the UK. |



## Agent Services

Once registration is completed by the MNE, they can choose to engage an agent or continue with an Ultimate Parent Entity (**UPE**) or nominated filing member (**NFM**). 

Agents need to [register with HMRC](https://www.gov.uk/guidance/register-with-hmrc-to-use-an-agent-services-account) by post before they can [create an agent services account](https://www.gov.uk/guidance/get-an-hmrc-agent-services-account). You can then use your [agent services account](https://www.gov.uk/guidance/sign-in-to-your-agent-services-account) to authorise new clients and copy across existing ones.  

## Submit UK Tax Return

Under Pillar 2 requirements, MNEs and enterprise groups based in the UK have an obligation to submit a UKTR for every accounting period. MNEs/groups (or their agents) can use the _Pillar 2 Submission API_ to submit the UKTR and meet this obligation.

The information required for the return is submitted in an API request, which is then validated and processed by HMRC. A response is sent if processing is successful and an error is sent if processing fails. 

<kbd>![alt text](https://github.com/hmrc/pillar2-service-guide/blob/PIL-1462---Service-Guide-Import-v1/source/images/Pillar2_Submit_UKTR.svg "Submit UKTR")</kbd>


The request structure has four variants created from two dependencies.
1. Are the group entities UK only or are they a mixture of UK and non-UK entities? 
   **Note**: This information needs to be confirmed during registration for Pillar 2. 
2. Is the return a **Nil** return?

The table here contains some information on the differences between the request variants.

| **Return Variant** | **Description** |
| ------------------ | --------------- |
| Nil Return (MNE/UK) | Liable for MTT, the “obligationMTT” field is set to true. |
| Nil Return (UK Only)| Liable for DTT, the “obligationMTT” field is set to false. |
| Liability return (MNE/UK) | Request includes totals for DTT, IIR, UTPR and overall total. The “obligationMTT” field is set to true. |
| Liability return (UK Only) | Request includes totals for DTT and overall total. The request is rejected if it contains amounts for MTT fields. The “obligationMTT” field is set to false. |

If the request is successful, it returns a response containing several pieces of information.

| **Name** | **Description** | 
| -------- | --------------- |
| Processing date | Date and time the request was processed. |
| Form bundle | Unique identifier for the request, to be noted and retained in case amendments need to be filed against the return. |
| Charge reference | Identifier for any liabilities specified in the return. (Nil returns have no charge so don’t require a charge reference). |

You can find examples for each different request variant (and their responses) in the Endpoints page of the API reference guide. 


## Testing Requirements

You can test the Pillar 2 Submission API in the [HMRC Developer Hub](https://developer.qa.tax.service.gov.uk/api-documentation). You will need to register for an account before you start, and there are instructions for new starters in the [user guide](https://developer.qa.tax.service.gov.uk/api-documentation/docs/using-the-hub). The API landing page contains specific information for testing the Pillar 2 Submission API. 

## Software Requirements

Any software solutions which integrate with the Pillar 2 Submission API should comply with the requirements listed here. 

### Compatible Software

“Compatible software’” can mean a single end-to-end piece of software or a set of compatible software products. Any software needs to meet the minimum functionality standards, which are defined here. 

- Provide HMRC with transaction monitoring fraud prevention header data.
- Submit a UKTR, or a BTN
- Make adjustments to a submitted tax return (if required)
- Create and maintain all digital records (or digitally link to a product that can do so) that a customer is required to keep by law in digital form. End users should own and have access to all their records created and be able to export these records, if necessary.
- Allow customers to view their outstanding tax liabilities by either signposting them to their HMRC account or by displaying it in software 
- Make a final declaration or divert a customer into a channel where they can make it.

HMRC recognises customers or agents will use different pieces of software if an all-in-one product does not meet their requirements (for example, combining record keeping software with tax filing software). When a customer uses a combination of products they must follow the rules for digital links set out by HMRC.

### Bridging Software

“Bridging software” products are used by customers to digitally link record-keeping software with the software solution they use to submit Pillar 2 tax information. Bridging software ensures customers meet their obligations while using software products which meet the minimum functionality standards set out in “Compatible Software”.

For more information about digitally linking to software, refer to GOV.UK).

### Free-to-use Software

The UK government is committed to ensuring the availability of free software products and HMRC strongly encourages all providers to produce a free version of their software.

In addition to meeting the minimum functionality standards, we expect free software to 
- include a reasonable level of guidance, with help and support for users.
- enable business tax obligations for an annual accounting period.

HMRC does not expect free software to include tax functionality or integrate with an agent product. However, free software could be used with compatible software products if required. 

## Support Contacts 

Pillar 2 will offer support for organisations in checking eligibility and registering for the service, prepay taxes and later on file returns and be tax compliant in the UK and globally.

- Digital Service Available 24/7 365 days a year. If planned downtime for system maintenance is agreed an appropriate error message to be displayed.
- Pillar 2 Support Telephone support available via contact centres 8.30 - 17:00. Calls escalated to the Specialist Team. Specialist Team and CRMs email support available 8.30 - 17:00.

## Changelog
