export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };
  
  export const showNotification = (title: string, body?: string) => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  };
  
  export const flashTitle = (message: string, duration = 4000) => {
    const originalTitle = document.title;
    let flashing = true;
  
    const interval = setInterval(() => {
      document.title = flashing ? message : originalTitle;
      flashing = !flashing;
    }, 1000);
  
    setTimeout(() => {
      clearInterval(interval);
      document.title = originalTitle;
    }, duration);
  };
  