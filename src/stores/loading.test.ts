import LoadingStore from './loading'

describe('loading', () => {
  const loading = new LoadingStore()
  it('start', () => {
    loading.start()
    expect(loading.load).toBe(true)
  })
  it('stop', () => {
    loading.stop()
    expect(loading.load).toBe(false)
  })
})
