/* eslint-disable no-undef */

const storage = {
  /**
   * 设置配置
   * 将同步和未同步时的方法统一包装下，方便使用
   * @param key {String}
   * @param value
   */
  set(key, value) {
    chrome.storage.sync.get('sync', isSync => {
      if (isSync) {
        chrome.storage.sync.set({[key]: value})
      } else {
        chrome.storage.local.set({[key]: value})
      }
    })
  },

  /**
   * 将同步和未同步时的方法统一包装下，方便使用
   * @param key {String}
   * @return {Promise}
   */
  get(key) {
    return new Promise(resolve => {
      chrome.storage.sync.get('sync', isSync => {
        if (isSync) {
          chrome.storage.sync.get([key], result => resolve(result[key]))
        } else {
          chrome.storage.local.get([key], result => resolve(result[key]))
        }
      })
    })
  },

  /**
   * 如果对应key的value为null的话，就设置默认的value
   * @param key {String}
   * @param defaultValue
   */
  async setDefaultIfNull(key, defaultValue) {
    let value = await this.get(key)
    if (typeof value === 'undefined' || value === null) {
      this.set(key, defaultValue)
    }
  },

  /**
   * 当获取配置为null时，提前设置默认配置
   * 只需要执行一次
   */
  async defaultSettings() {
    // 插件设置默认启用同步
    await this.setDefaultIfNull('sync', true)
    // 图标默认颜色
    await this.setDefaultIfNull('icon_color', '#000000')
    await this.setDefaultIfNull('icon_downloading_color', '#ffa500')
    // 下载面板主题，默认为白色
    await this.setDefaultIfNull('download_panel_theme', 'white')
    // 插件设置默认不展示提示信息
    await this.setDefaultIfNull('close_tooltip', true)
    await this.setDefaultIfNull('left_click_file', true)
    await this.setDefaultIfNull('right_click_file', true)
    await this.setDefaultIfNull('left_click_url', true)
    await this.setDefaultIfNull('right_click_url', true)
    // 插件默认关闭下载过程中的通知
    await this.setDefaultIfNull('close_download_notification', true)
    await this.setDefaultIfNull('download_started_notification', false)
    await this.setDefaultIfNull('download_completed_notification', false)
    await this.setDefaultIfNull('download_warning_notification', false)
    await this.setDefaultIfNull('download_started_tone', false)
    await this.setDefaultIfNull('download_completed_tone', false)
    await this.setDefaultIfNull('download_warning_tone', false)
    // 插件默认关闭下载完成提示音
    await this.setDefaultIfNull('download_completion_tone', false)
    // 插件默认创建下载文件上下文菜单
    await this.setDefaultIfNull('download_context_menus', true)
  }

}

export default storage
