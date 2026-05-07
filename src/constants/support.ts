export type SupportChannelId = 'wechat' | 'alipay';

export interface SupportChannelDefinition {
  id: SupportChannelId;
  imagePath: string;
}

export const SUPPORT_CHANNELS: SupportChannelDefinition[] = [
  {
    id: 'wechat',
    imagePath: 'donate/wechat-pay.png',
  },
  {
    id: 'alipay',
    imagePath: 'donate/alipay-pay.png',
  },
];
