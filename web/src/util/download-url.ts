export const downloadUrl = (url: string, filename?: string) => {
  // Cria um elemento <a> temporário
  const link = document.createElement('a');
  
  link.href = url;
  
  if (filename) {
    link.setAttribute('download', filename);
  }
  
  link.setAttribute('target', '_blank'); // Garante que abra/baixe sem fechar a app
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}