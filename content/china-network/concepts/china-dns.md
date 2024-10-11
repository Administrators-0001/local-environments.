---
title: China Authoritative DNS
pcx_content_type: concept
weight: 4
---

# Default

By default Cloudflare China Network provides a nearest-to-client nameservice. The DNS request is resolved on the data center nearest to the client out of China. And the Http request is served on the data center nearest to the client. Cloudflare data center out of China is adopted for clients out of China, and JD Cloud data center in China for clients in China.


# In-China Nameserver

Cloudflare is able to deploy DNS service in mainland China to improve the Time to First Byte (TTFB) performance. With this deployment, the DNS query will be resolved in mainland China instead of global DNS servers.


## When to use

Before you enable China Authoritative DNS, you should confirm that majority (over 90%) of the traffic is coming from China. After you enable China Authoritative DNS, all the global DNS requests will be routed to JD Cloud data centers in China instead of the nearest data centers.

## Comparison

Default vs. In-China Nameserver

| **DNS Option**          | **Behavior** |
|---------------------|---------------|
| Default             | Making use of the nearest DNS server available to eyeball. |
| In-China Nameserver | Only use DNS in Mainland China operated by JD Cloud. |
|                     |               |



## General setup

After you [enable the Cloudflare China Network service](/china-network/get-started/), do the following:

1. You will need to reach out to your Cloudflare sales team to enable the feature. Temporarily the feature can't be enabled from the Cloudflare dashboard.

    The current China Network supports both a [full setup](/dns/zone-setups/full-setup/) and a [partial setup](/dns/zone-setups/partial-setup/).
2. Update your domain registrar with the assigned in-China nameservers.

    a. Full setup: These nameservers are displayed in the Cloudflare dashboard.

    b. Partial setup: CNAME to <host_name>.cdn.cloudflarecn.net.

    For example:
            You have a zone named samplezone.cn. In this zone, you have 2 DNS records: www and media pointing to 2 different Origins. Your Authoritative DNS server needs to set

            CNAME www.samplezone.cn to www.samplezone.cn.cdn.cloudflarecn.net
            CNAME media.samplezone.cn to media.samplezone.cn.cdn.cloudflarecn.net

3. Test your configuration by checking if the domain resolves correctly.


For further assistance, contact your sales team.

