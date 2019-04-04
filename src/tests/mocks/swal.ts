import swal from 'sweetalert2'

jest.mock('sweetalert2')

const mockSwalFireFire = (swal.fire as any) as jest.Mock<typeof swal.fire>
mockSwalFireFire.mockImplementation((...args: any) => ({
  ...args,
  value: true
}))

export default mockSwalFireFire
