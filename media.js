/*
 * 媒体素材配置：路径相对于 website/index.html，可直接使用相对路径或 HTTPS 地址。
 *
 * 配置示例：
 *   'hero': { type: 'video', src: './assets/media/hero.mp4', poster: './assets/media/hero.jpg' },
 *   'comparison-generated': { type: 'image', src: './assets/media/generated.jpg', alt: '生成的 LiDAR 点云' },
 *
 * 可用 type 为 video / image；留空或不填写则保留页面占位图。
 * 视频默认带播放控件，不自动播放，避免干扰和无素材时的空播放器。
 */
window.LIDARGEN_MEDIA = {
  'hero': {
    type: 'video',
    src: './assets/media/LiFTeR_demo_en_centered.mp4',
    altZh: 'LiFTeR 项目演示视频，英语讲解，提供英文字幕',
    altEn: 'LiFTeR project demonstration video with English narration and subtitles',
    subtitles: { src: './assets/media/LiFTeR_demo_en_centered.vtt', language: 'en', label: 'English', default: true },
  },
  'results-feature': null,
  'nuscenes-01': null,
  'nuscenes-02': null,
  'nuscenes-03': null,
  'carizon-01': null,
  'carizon-02': null,
  'carizon-03': null,
  'comparison-input': null,
  'comparison-generated': null,
  'comparison-reference': null,
  'real-sunny': null,
  'real-cloudy': null,
  'real-tunnel': null,
  'real-night': null,
  'downstream': null,
  'failure-night': null,
  'failure-motion': null,
};
