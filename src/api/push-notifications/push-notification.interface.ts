export type IStoreDeviceTokenResponse = {
  success: boolean;
  token: string;
};

export type IGlobalNotificationsResponse = {
  success: boolean;
  totalTokens: number;
  results: Record<string, any>[];
};

export type IMarkNotificationAsReadResponse = {
  success: boolean;
  message: string;
};

export type IMobileDeviceInfo = {
  deviceToken: string;
  platform: string;
  version: string;
  language: string;
  deviceName?: string;
  deviceModel?: string;
  deviceBrand?: string;
};
