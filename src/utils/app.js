export const checkUpdate = () => {
  if (!uni.canIUse('getUpdateManager')) {
    return
  }
  const updateManager = uni.getUpdateManager()
  updateManager.onCheckForUpdate((res) => {
    console.log(res)
  })
  updateManager.onUpdateReady((res) => {
    uni.showModal({
      title: '提示更新',
      content: '新版本已经准备好，是否重启应用？',
      success: (res) => {
        if (res.confirm) {
          updateManager.applyUpdate()
        }
      },
    })
  })

  updateManager.onUpdateFailed(() => {
    uni.showModal({
      title: '升级失败',
      content: '新版本下载失败，请检查网络!',
      showCancel: false,
    })
  })
}
