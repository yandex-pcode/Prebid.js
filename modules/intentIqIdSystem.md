```
Module Name: IntentIQ Id System
Module Type: Id System
Maintainer: julian@intentiq.com, dmytro.piskun@intentiq.com
usp_supported: true
gpp_sids: usnat
```

# Intent IQ Universal ID module

By leveraging the Intent IQ identity graph, our module helps publishers, SSPs, and DSPs overcome the challenges of monetizing cookie-less inventory and preparing for a future without 3rd-party cookies. Our solution implements 1st-party data clustering and provides Intent IQ person IDs with over 90% coverage and unmatched accuracy in supported countries while remaining privacy-friendly and CCPA compliant. This results in increased CPMs, higher fill rates, and, ultimately, lifting overall revenue

# All you need is a few basic steps to start using our solution.

## Registration

Navigate to [our portal ](https://www.intentiq.com/) and contact our team for partner ID.
check our [documentation](https://pbmodule.documents.intentiq.com/) to get more information about our solution and how utilze it's full potential

## Integration

```
gulp build –modules=intentIqIdSystem
```

We recommend including the Intent IQ Analytics adapter module for improved visibility

## Configuration

### Parameters

Please find below list of paramters that could be used in configuring Intent IQ Universal ID module

| Param under userSync.userIds[] | Scope    | Type     | Description                                                                                                                                                                                                                                                                                                                               | Example                                       |
| ------------------------------ | -------- |----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| name                           | Required | String   | The name of this module: "intentIqId"                                                                                                                                                                                                                                                                                                     | `"intentIqId"`                                |
| params                         | Required | Object   | Details for IntentIqId initialization.                                                                                                                                                                                                                                                                                                    |                                               |
| params.partner                 | Required | Number   | This is the partner ID value obtained from registering with IntentIQ.                                                                                                                                                                                                                                                                     | `1177538`                                     |
| params.pcid                    | Optional | String   | This is the partner cookie ID, it is a dynamic value attached to the request.                                                                                                                                                                                                                                                             | `"g3hC52b"`                                   |
| params.pai                     | Optional | String   | This is the partner customer ID / advertiser ID, it is a dynamic value attached to the request.                                                                                                                                                                                                                                           | `"advertiser1"`                               |
| params.callback                | Optional | Function | This is a callback which is trigered with data and AB group                                                                                                                                                                                                                                                                               | `(data, group) => console.log({ data, group })` |
| params.timeoutInMillis         | Optional | Number   | This is the timeout in milliseconds, which defines the maximum duration before the callback is triggered. The default value is 500.                                                                                                                                                                                                       | `450`                                         |
| params.browserBlackList        | Optional |  String  | This is the name of a browser that can be added to a blacklist.                                                                                                                                                                                                                                                                           | `"chrome"`                                    |
| params.manualWinReportEnabled  | Optional | Boolean  | This variable determines whether the bidWon event is triggered automatically. If set to false, the event will occur automatically, and manual reporting with reportExternalWin will be disabled. If set to true, the event will not occur automatically, allowing manual reporting through reportExternalWin. The default value is false. | `true`                                        |
| params.domainName              | Optional | String   | Specifies the domain of the page in which the IntentIQ object is currently running and serving the impression. This domain will be used later in the revenue reporting breakdown by domain. For example, cnn.com. It identifies the primary source of requests to the IntentIQ servers, even within nested web pages.                     | `"currentDomain.com"`                         |
| params.gamObjectReference      | Optional | Object   | This is a reference to the Google Ad Manager (GAM) object, which will be used to set targeting. If this parameter is not provided, the group reporting will not be configured.                                                                                                                                                            | `googletag`                                   |
| params.gamParameterName        | Optional | String   | The name of the targeting parameter that will be used to pass the group. If not specified, the default value is `intent_iq_group`.                                                                                                                                                                                                        | `"intent_iq_group"`                           |
| params.adUnitConfig                   | Optional | Number   | Determines how the placementId parameter is extracted in the report (default is 1). Possible values: 1 – adUnitCode first, 2 – placementId first, 3 – only adUnitCode, 4 – only placementId                                                                                                                                                    | `1`                                           |

### Configuration example

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: "intentIqId",
            params: {
                partner: 123456,     // valid partner id
                timeoutInMillis: 500,
                browserBlackList: "chrome",
                callback: (data, group) => window.pbjs.requestBids(),
                manualWinReportEnabled: true,
                domainName: "currentDomain.com",
                adUnitConfig: 1 // Extracting placementId strategy (adUnitCode or placementId order of priorities)
            },
            storage: {
                type: "html5",
                name: "intentIqId",    // set localstorage with this name
                expires: 0,
                refreshInSeconds: 0
            }
        }]
    }
});
```
