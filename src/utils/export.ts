import { toPng, toJpeg } from 'html-to-image';

export interface ExportOptions {
  format: 'png' | 'jpeg';
  quality?: number;
  pixelRatio?: number;
}

export async function exportCard(
  element: HTMLElement,
  options: ExportOptions = { format: 'png' }
): Promise<void> {
  const { format, quality = 1, pixelRatio = 2 } = options;

  try {
    const exportOptions = {
      quality,
      pixelRatio,
      cacheBust: true,
    };

    const dataUrl = format === 'png'
      ? await toPng(element, exportOptions)
      : await toJpeg(element, exportOptions);

    // 触发下载
    const link = document.createElement('a');
    link.download = `card-${Date.now()}.${format}`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('导出失败，请重试');
  }
}

export async function getPreviewDataUrl(
  element: HTMLElement,
  pixelRatio: number = 1
): Promise<string> {
  try {
    return await toPng(element, {
      quality: 0.8,
      pixelRatio,
      cacheBust: true,
    });
  } catch (error) {
    console.error('Preview generation failed:', error);
    return '';
  }
}
