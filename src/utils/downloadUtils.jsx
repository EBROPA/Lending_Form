export const downloadFile = (fileUrl, fileName) => {
  return new Promise((resolve) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Даем время для начала скачивания
      setTimeout(() => resolve(true), 100);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      resolve(false);
    }
  });
};

export const downloadPresentation = () => {
  return downloadFile('../public', 'MR_One.pdf');
};