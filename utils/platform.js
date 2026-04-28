export const isCapacitor = () =>
  typeof window !== 'undefined' && typeof window.Capacitor !== 'undefined';

export const isIOS = () =>
  isCapacitor() && window.Capacitor.getPlatform() === 'ios';

export const isAndroid = () =>
  isCapacitor() && window.Capacitor.getPlatform() === 'android';

export const isWeb = () => !isCapacitor();

export async function isOnline() {
  if (isCapacitor()) {
    try {
      const { Network } = await import('@capacitor/network');
      const status = await Network.getStatus();
      return status.connected;
    } catch {
      return navigator.onLine;
    }
  }
  return navigator.onLine;
}
