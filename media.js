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
  'hero': null,
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
