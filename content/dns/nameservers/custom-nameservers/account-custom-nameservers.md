---
pcx_content_type: how-to
title: Account level
weight: 4
meta:
  title: Account custom nameservers
  description: With account-level custom nameservers, you can use the same custom nameservers for different zones in the account. The domain or domains that provide the nameservers names do not have to exist as zones in Cloudflare.
---

# Account custom nameservers

{{<render file="_acns-tcns-intro.md" withParameters="Account;;A;;account;;zones;;account " >}}

## Configuration conditions

For this configuration to be possible, a few conditions apply:

{{<render file="_acns-tcns-conditions.md" withParameters="account;;you;;You" >}}

{{<render file="_acns-tcns-byoip.md" withParameters="Account;;account" >}}

* Choosing a set from `ns_set 1` through `ns_set 5` will influence how Cloudflare assigns nameservers to your new zones if you configure [DNS zone defaults](/dns/nameservers/nameserver-options/#dns-zone-defaults).

## Enable account custom nameservers

### 1. Set up ACNS names and sets

1. Create ACNS names and sets:

{{<tabs labels="Dashboard | API">}}
{{<tab label="dashboard" no-code="true">}}

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and select your account.
2. Go to **Manage Account** > **Configurations**.
3. For **Account custom nameservers**, select **Configure custom nameservers**.
4. Insert a fully qualified domain name for **Nameserver name** and choose a **Nameserver set**. Follow the [configuration conditions](#configuration-conditions).

Cloudflare will assign an IPv4 and an IPv6 address to each ACNS name, and these nameservers will be listed as options that you can [enable on existing zones](#2-enable-acns-on-existing-zones) or [set up as default for new zones in the account](#3-optional-make-acns-default-for-new-zones).

{{</tab>}}
{{<tab label="api" no-code="true">}}

Use the [Add account custom nameserver endpoint](/api/operations/account-level-custom-nameservers-add-account-custom-nameserver) to create account custom nameservers. Follow the [conditions](#configuration-conditions) for `ns_name` and `ns_set`.

{{<render file="_ns-set-omission-callout.md">}}

Cloudflare will assign an IPv4 and an IPv6 address to each ACNS name and these nameservers will be listed as options that you can [enable on existing zones](#2-enable-acns-on-existing-zones) or [set up as default for new zones in the account](#3-optional-make-acns-default-for-new-zones).

{{</tab>}}
{{</tabs>}}

2. Make sure `A/AAAA` records with the assigned IPv4 and IPv6 exist at the authoritative DNS of the domain that provides the ACNS names.

    * If the domain uses Cloudflare DNS, the respective `A` and `AAAA` records are automatically created.

    * If the domain or domains that are used for the account custom nameservers do not exist within the same account, you must manually create the `A/AAAA` records on the configured nameserver names (for example, `ns1.example.com`) at the authoritative DNS provider.

    {{<example>}}

  | Type | Name | Content |
  | --- | --- | --- |
  | `A` | `ns1.example.com` | `<IPv4>` |

  {{</example>}}

3. Update the registrar of the domain that provides the ACNS names. This step depends on whether you are using [Cloudflare Registrar](/registrar/):

    * If you are using Cloudflare Registrar for the domain that provides the ACNS names, [contact Cloudflare Support](/support/contacting-cloudflare-support/) to add the account custom nameservers and IP addresses as glue records to the domain.

    * If you are not using Cloudflare Registrar for the domain that provides the ACNS names, add the account custom nameservers and IP addresses to your domain's registrar as glue records ([RFC 1912](https://www.rfc-editor.org/rfc/rfc1912.html)). If you do not add these records, DNS lookups for your domain will fail.

### 2. Use ACNS on existing zones

1. Choose an ACNS set as custom nameservers for a zone:

{{<tabs labels="Dashboard | API">}}
{{<tab label="dashboard" no-code="true">}}

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and select your account and zone.
2. Go to **DNS** > **Records**.
3. For **Custom nameservers**, select **Configure**.
4. Select **Use the custom nameservers created for all DNS zones under your account** and choose a nameserver set from the list.

{{</tab>}}
{{<tab label="api" no-code="true">}}

Use the [Set ACNS Related Zone Metadata endpoint](/api/operations/account-level-custom-nameservers-usage-for-a-zone-set-account-custom-nameserver-related-zone-metadata) for each zone.

{{</tab>}}
{{</tabs>}}

2. Make sure the nameservers are updated:

  * If your domain uses [Cloudflare Registrar](/registrar/), [contact Cloudflare Support](/support/contacting-cloudflare-support/) to update your nameservers.
  * If your domain uses a different registrar, update the nameservers at your registrar to use the account custom nameservers.
  * If your zone is delegated to a parent zone, update the corresponding `NS` record at the parent zone.

### 3. (Optional) Make ACNS default for new zones

To make ACNS the default option for all new zones added to your account from now on:

{{<tabs labels="Dashboard | API">}}
{{<tab label="dashboard" no-code="true">}}

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and select your account.
2. Go to **Manage Account** > **Configurations**.
3. For **DNS zone defaults**, select **Configure defaults**.
4. Change the **Nameserver assignment method** to **Account custom nameservers**.

Refer to [DNS zone defaults](/dns/nameservers/nameserver-options/#dns-zone-defaults) for details.

{{</tab>}}
{{<tab label="api" no-code="true">}}

Use the [Update Account endpoint](/api/operations/accounts-update-account) and set the value of `default_nameservers` to `custom.account`.

{{</tab>}}
{{</tabs>}}

## Disable account custom nameservers

### 1. Remove ACNS assignment from zones

To remove ACNS from a zone, first update your nameservers to stop using ACNS:

{{<tabs labels="Dashboard | API">}}
{{<tab label="dashboard" no-code="true">}}

* If you are using [Cloudflare Registrar](/registrar/), [contact Cloudflare Support](/support/contacting-cloudflare-support/) to set your nameservers back to the regular Cloudflare branded nameservers.
* If you are not using [Cloudflare Registrar](/registrar/), modify the domain's registrar to use your regular Cloudflare branded nameservers.

{{</tab>}}
{{<tab label="api" no-code="true">}}

* If you are using [Cloudflare Registrar](/registrar/), use the [Set ACNS Related Zone Metadata endpoint](/api/operations/account-level-custom-nameservers-usage-for-a-zone-set-account-custom-nameserver-related-zone-metadata) to change the `enabled` parameter to `false`, and then [contact Cloudflare Support](/support/contacting-cloudflare-support/) to set your nameservers back to the regular Cloudflare branded nameservers.
* If you are not using [Cloudflare Registrar](/registrar/), modify the domain's registrar to use your regular Cloudflare branded nameservers and then use the [Set ACNS Related Zone Metadata endpoint](/api/operations/account-level-custom-nameservers-usage-for-a-zone-set-account-custom-nameserver-related-zone-metadata) to set the `enabled` parameter to `false`.

{{</tab>}}
{{</tabs>}}

### 2. Delete ACNS names or sets

Following the [configuration conditions](#configuration-conditions), each set must have between two and five different nameserver names. When you delete all names or leave a set with only one nameserver name, the set will no longer be listed as an option for the zones in your account.

{{<tabs labels="Dashboard | API">}}
{{<tab label="dashboard" no-code="true">}}

1. Log in to the [Cloudflare dashboard](https://dash.cloudflare.com) and select your account.
2. Go to **Manage Account** > **Configurations**.
3. For **Account custom nameservers**, select **Delete** next to the ACNS name.

{{</tab>}}
{{<tab label="api" no-code="true">}}

Use the [Delete account custom nameserver endpoint](/api/operations/account-level-custom-nameservers-delete-account-custom-nameserver) to delete a specific ACNS.

{{</tab>}}
{{</tabs>}}