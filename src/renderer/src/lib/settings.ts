export type TSettingsSchema = {
  autoHideBottomControls: boolean;
  autoHideBottomControlsDelayInSeconds: number;
};
export const SettingsDefaultSchema: TSettingsSchema = {
  autoHideBottomControls: true,
  autoHideBottomControlsDelayInSeconds: 1.5,
};
