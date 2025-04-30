export const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  
  export const getEndOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };
  
  export const getPastDays = (days: number): Date => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };
  