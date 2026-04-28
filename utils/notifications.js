import { isCapacitor } from './platform.js';

export async function getPermissionStatus() {
  try {
    if (isCapacitor()) {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const result = await LocalNotifications.checkPermissions();
      return result.display; // 'granted' | 'denied' | 'prompt'
    }
    if ('Notification' in window) return Notification.permission;
  } catch { }
  return 'denied';
}

export async function requestPermission() {
  try {
    if (isCapacitor()) {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    }
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      return result === 'granted';
    }
  } catch { }
  return false;
}

export async function scheduleStudyReminder(hour = 19, minute = 0) {
  if (!isCapacitor()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    // Cancel any existing reminder first
    await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }] });

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Time to study! 📚',
          body: 'Your daily CitizenReady session is waiting.',
          schedule: { on: { hour, minute }, repeats: true },
          actionTypeId: ''
        }
      ]
    });
  } catch (e) {
    console.warn('Failed to schedule reminder:', e);
  }
}

export async function scheduleStreakReminder(streakDays, hour = 20, minute = 0) {
  if (!isCapacitor() || streakDays < 3) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 2,
          title: `Don't break your ${streakDays}-day streak! 🔥`,
          body: 'A quick 5-minute drill keeps your streak alive.',
          schedule: { on: { hour, minute }, repeats: true },
          actionTypeId: ''
        }
      ]
    });
  } catch (e) {
    console.warn('Failed to schedule streak reminder:', e);
  }
}

export async function cancelAllReminders() {
  if (!isCapacitor()) return;
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }] });
  } catch { }
}
