export type TSettingsSchema = {
  autoHideBottomControls: boolean;
  autoHideBottomControlsDelayInSeconds: number;
  noAnimations: boolean;
  autoPlayVideos: boolean;
  loopVideos: boolean;
};
export const SettingsDefaultSchema: TSettingsSchema = {
  autoHideBottomControls: true,
  autoHideBottomControlsDelayInSeconds: 1.5,
  noAnimations: false,
  autoPlayVideos: false,
  loopVideos: true,
};
