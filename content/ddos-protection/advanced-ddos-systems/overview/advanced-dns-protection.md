---
title: Advanced DNS Protection (beta)
pcx_content_type: concept
weight: 2
---

{{<heading-pill style="beta">}} Cloudflare Advanced DNS Protection {{</heading-pill>}}

Cloudflare Advanced DNS Protection, powered by [`flowtrackd`](https://blog.cloudflare.com/announcing-flowtrackd/), provides stateful protection against DNS-based DDoS attacks, specifically sophisticated and fully randomized DNS attacks such as [random prefix attacks](/dns/dns-firewall/random-prefix-attacks/about/).

## Setup

[Create a rule](/ddos-protection/advanced-ddos-systems/how-to/create-rule/#create-an-advanced-dns-protection-rule) to enable Advanced DNS Protection.

---

## Troubleshooting

### No data about Advanced DNS Protection in Network Analytics

If you cannot find any data related to Advanced DNS Protection in the **DNS Protection** tab of Network Analytics, it could be because one of these reasons:

* You did not [add your prefixes](/ddos-protection/advanced-ddos-systems/how-to/add-prefix/) to Advanced L3/4 DDoS Protection.
* Cloudflare did not enable the Advanced DNS Protection system yet.
* You do not have any DNS over UDP traffic.

---

## Data collection

Cloudflare collects DNS-related data such as query type (for example, `A` record) and the queried domains. For details, refer to [Data collection](/analytics/network-analytics/reference/data-collection/).

{{<Aside type="warning">}}
Currently, to disable this data collection you must remove your prefixes either in the Cloudflare dashboard or through the [Delete a prefix](/ddos-protection/advanced-ddos-systems/api/#prefix-operations) API operation. However, this procedure will remove the prefixes from both Advanced DNS Protection and [Advanced TCP Protection](/ddos-protection/advanced-ddos-systems/overview/advanced-tcp-protection/).
{{</Aside>}}

---

## Related products

Advanced DNS Protection can protect you against volumetric DNS DDoS attacks. To perform DNS caching, proxying, and configuration, use the [Cloudflare DNS Firewall](/dns/dns-firewall/).

Currently, Advanced DNS Protection is not available for DNS Firewall.
