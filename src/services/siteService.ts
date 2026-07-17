import { apiClient } from "./apiClient";

export interface BackendSettings {
  announcementText: string;
  heroTitle: string;
  heroSubtitle: string;
  bestSellersTitle: string;
  bestSellersSubtitle: string;
  featuredProductsTitle: string;
  featuredProductsSubtitle: string;
  featuredProductsCtaText: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  whyChooseFeatures: string;
  giftingTitle: string;
  giftingDescription: string;
  aboutStoryTitle: string;
  aboutStorySubtitle: string;
  aboutFounderName: string;
  aboutFounderText: string;
  aboutMeaningTitle: string;
  aboutMeaningSubtitle: string;
  aboutMeaningText1: string;
  aboutMeaningText2: string;
  aboutMeaningText3: string;
  aboutNashikRootsTitle: string;
  aboutNashikRootsText1: string;
  aboutNashikRootsText2: string;
  aboutStat1Number: string;
  aboutStat1Title: string;
  aboutStat1Desc: string;
  aboutStat2Number: string;
  aboutStat2Title: string;
  aboutStat2Desc: string;
  aboutStat3Number: string;
  aboutStat3Title: string;
  aboutStat3Desc: string;
  shopByMoodTitle: string;
  shopByMoodSubtitle: string;
  shopByMoodList: string;
  categoriesList: string;
  shippingCharge?: number;
  freeShippingThreshold?: number;
  currency?: string;
}

export interface SettingsApiResponse {
  success: boolean;
  message: string;
  data: BackendSettings;
}

export const siteService = {
  async getSettings(): Promise<BackendSettings> {
    const response = await apiClient.get<SettingsApiResponse>("/settings");
    return response.data.data;
  },

  async updateSettings(data: Partial<BackendSettings>): Promise<BackendSettings> {
    const response = await apiClient.put<SettingsApiResponse>("/admin/settings", data);
    return response.data.data;
  },
};
