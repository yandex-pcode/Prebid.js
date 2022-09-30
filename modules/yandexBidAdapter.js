import {formatQS, deepAccess, triggerPixel, isArray, isNumber} from '../src/utils.js';
import { registerBidder } from '../src/adapters/bidderFactory.js';
import { BANNER } from '../src/mediaTypes.js'

const BIDDER_CODE = 'yandex';
const BIDDER_URL = 'https://bs.yandex.ru/metadsp';
const DEFAULT_TTL = 180;
const DEFAULT_CURRENCY = 'EUR';
const SSP_ID = 10500;

export const spec = {
  code: BIDDER_CODE,
  aliases: ['ya'], // short code
  supportedMediaTypes: [ BANNER ],

  isBidRequestValid: function(bid) {
    if (!(bid.params && bid.params.pageId && bid.params.impId)) {
      return false;
    }
    const sizes = bid.mediaTypes?.banner?.sizes;
    if (!(isArray(sizes) && isArray(sizes[0]) && isNumber(sizes[0][0]) && isNumber(sizes[0][1]))) {
      return false;
    }
    return true;
  },

  buildRequests: function(validBidRequests, bidderRequest) {
    const gdprApplies = deepAccess(bidderRequest, 'gdprConsent.gdprApplies');
    const consentString = deepAccess(bidderRequest, 'gdprConsent.consentString');

    let referrer = '';
    let domain = '';
    let page = '';

    if (bidderRequest && bidderRequest.refererInfo) {
      referrer = bidderRequest.refererInfo.ref;
      domain = bidderRequest.refererInfo.domain;
      page = bidderRequest.refererInfo.page;
    }

    return validBidRequests.map((bidRequest) => {
      const { params } = bidRequest;
      const { pageId, impId, targetRef, withCredentials = true } = params;
      const sizes = bidRequest.mediaTypes.banner.sizes;
      const size = sizes[0];
      const [ w, h ] = size;

      const queryParams = {
        'imp-id': impId,
        'target-ref': targetRef || domain,
        'ssp-id': SSP_ID,
      };
      if (gdprApplies !== undefined) {
        queryParams['gdpr'] = 1;
        queryParams['tcf-consent'] = consentString;
      }

      const imp = {
        id: impId,
        banner: {
          w,
          h,
        }
      };

      if (bidRequest.getFloor) {
        const floorInfo = bidRequest.getFloor({
          currency: DEFAULT_CURRENCY,
          size
        });

        imp.bidfloor = floorInfo.floor;
        imp.bidfloorcur = floorInfo.currency;
      }

      const queryParamsString = formatQS(queryParams);
      return {
        method: 'POST',
        url: BIDDER_URL + `/${pageId}?${queryParamsString}`,
        data: {
          id: bidRequest.bidId,
          imp: [imp],
          site: {
            ref_url: referrer,
            page_url: page,
          },
        },
        options: {
          withCredentials,
        },
        bidRequest,
      };
    });
  },

  interpretResponse: function(serverResponse, {bidRequest}) {
    let response = serverResponse.body;
    if (!response.seatbid) {
      return [];
    }

    const { cur, seatbid } = serverResponse.body;
    const rtbBids = seatbid
      .map(seatbid => seatbid.bid)
      .reduce((a, b) => a.concat(b), []);

    return rtbBids.map(rtbBid => {
      let prBid = {
        requestId: bidRequest.bidId,
        cpm: rtbBid.price,
        currency: cur || DEFAULT_CURRENCY,
        width: rtbBid.w,
        height: rtbBid.h,
        creativeId: rtbBid.adid,

        netRevenue: true,
        ttl: DEFAULT_TTL,

        meta: {
          advertiserDomains: rtbBid.adomain && rtbBid.adomain.length > 0 ? rtbBid.adomain : [],
        }
      };

      prBid.ad = rtbBid.adm;

      return prBid;
    });
  },

  onBidWon: function (bid) {
    const nurl = bid['nurl'];

    if (!nurl) {
      return;
    }
    triggerPixel(nurl);
  }
}

registerBidder(spec);
