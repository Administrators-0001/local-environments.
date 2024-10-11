---
pcx_content_type: how-to
title: Intune
weight: 2
---

# Deploy WARP using Intune

## Windows

### Prerequisites

[Download the `Cloudflare_WARP_<VERSION>.msi` installer](/cloudflare-one/connections/connect-devices/warp/download-warp/#windows).

### Configure Intune for Windows

1. Log in to your Microsoft Intune account.
2. Go to **Apps** > **All Apps** > **Add**.
3. In **App type**, select _Line-of-business app_ from the drop-down menu. Select **Select**.
4. Select **Select app package file** and upload the `Cloudflare_WARP_<VERSION>.msi` installer you downloaded previously.
5. Select **OK**.
6. In the **Name** field, we recommend entering the version number of the package being uploaded.
7. In the **Publisher** field, we recommend entering `Cloudflare, Inc`.
8. In the **Command-line arguments** field, enter a valid installation command. For example,
    ```txt
    /qn ORGANIZATION="your-team-name" SUPPORT_URL="http://support.example.com"
    ```
    Refer to [deployment parameters](/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/parameters/) for a description of each argument.
9. Select **Next**.
10. Add the users or groups who require Cloudflare WARP and select **Next**.
11. Review your configuration and select **Create**.

Intune is now configured to deploy the WARP client.

## macOS

Refer to the [generic instructions for macOS](/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/#macos).

## iOS

Refer to the [generic instructions for iOS](/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/#ios).

Intune allows you to insert [predefined variables](https://learn.microsoft.com/en-us/mem/intune/apps/app-configuration-policies-use-ios#tokens-used-in-the-property-list) into the XML configuration file. For example, you can set the [`unique_client_id`](/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/parameters/#unique_client_id) key to `{{deviceid}}` for a [device UUID posture check](/cloudflare-one/identity/devices/warp-client-checks/device-uuid/) deployment.

## Android

1. Log in to your Microsoft Intune account.
2. Go to **Apps** > **Android** >**Add**.
3. In **App type**, select _Managed Google Play app_.
4. Add the **Cloudflare One Agent** app from the Google Play store. Its application ID is `com.cloudflare.cloudflareoneagent`.
5. Next, go to **Apps** > **App Configuration policies** > **Add**.
6. Select _Managed devices_.
7. In **Name**, enter `Cloudflare One Agent`.
8. For **Platform**, select _Android Enterprise_.
9. Choose your desired  **Profile Type**.
10. For **Targeted app**, select **Cloudflare One Agent**. Select **Next**.
11. For **Configuration settings format**, select _Enter JSON data_. Enter your desired [deployment parameters](/cloudflare-one/connections/connect-devices/warp/deployment/mdm-deployment/parameters/) in the `managedProperty` field. For example:

    ```json
    {
        "kind": "androidenterprise#managedConfiguration",
        "productId": "app:com.cloudflare.cloudflareoneagent",
        "managedProperty": [
            {
                "key": "app_config_bundle_list",
                "valueBundleArray": [
                    {
                        "managedProperty": [
                            {
                                "key": "organization",
                                "valueString": "your-team-name"
                            },
                            {
                                "key": "service_mode",
                                "valueString": "warp"
                            },
                            {
                                "key": "onboarding",

                                "valueBool": false
                            },
                            {
                                "key": "support_url",
                                "valueString": "https://support.example.com/"
                            }
                        ]
                    }
                ]
            }
        ]
    }
    ```

    Alternatively, if you do not want to copy/paste the JSON data, you can change **Configuration settings format** to _Use configuration designer_ and manually configure each deployment parameter.

    Once you have configured the deployment parameters, select **Next**.

12. Assign users or groups to this policy and select **Next**.
13. Save the app configuration policy.
14. Finally, assign users or groups to the application:
    1. Go to **Apps** > **Android** > **Cloudflare One Agent** > **Manage Properties**.
    2. Select **Edit** and add users or groups.
    3. Select **Review + save** > **Save**.

Intune will now deploy the Cloudflare One Agent to user devices.
